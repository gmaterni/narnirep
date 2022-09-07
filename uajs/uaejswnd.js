/*
 * uaejswnd.js release:  10-03-2013
 *
 * var obj=UaEjsWndAdm.create(id,ejsUrl);
 * obj.readData(dataUrl,dataPars,dataExt).setLink(lkId,x,y,p),setStyle(css).show();
 *
 * es.
 * var obj=UaEjsWndAdm.create('lkid','ejs/'es1.ejs');
 * obj.readData('readdata',{par1:'val1',par2:'val2'},{campo1:'val1'}).setLink('fieldId',100,10,1),setStyle({width:'400px',height:'300px'}).show();
 *
 * UaEjsWndAdm.open({id:<id>,ejsUrl:<url>,dataUrl:<url>,dataPars:{},dataExt:{},lkId:<id>,x:10,y:10,p:1,css:{});
 *
 * UaEjsWndAdm.open({id:<id>,ejsUrl:<url>,lkId:<id>[,dataUrl:<url>]);
 */
var UaEjsWndAdm = {
    objs: {},

    open: function(args) {
        var dataPars = args['dataPars'] || {};
        var dataEjs = {};
        dataEjs['dataExt'] = args['dataExt'] || {};
        var x = args['x'] || 0;
        var y = args['y'] || 0;
        var p = args['p'] || 1;
        var css = args['css'] || {};
        css['width'] = css['width'] || 'auto';
        css['height'] = css['height'] || 'auto';

        if ( !! args['dataUrl']) dataEjs['rows'] = UaRq.getJson(args.dataUrl, dataPars);
        else dataEjs['rows'] = [];

        var ejsw = this.create(args.id, args.ejsUrl);
        ejsw.setData(dataEjs).setLink(args.lkId, x, y, p).setStyle(css).show();
        this.objs[args.id] = ejsw;
        return ejsw;
    },
    create: function(id, ejsUrl) {
        var ejsw = newUaEjsWnd(id, ejsUrl);
        this.objs[id] = ejsw;
        return ejsw;
    },
    setAction: function(id, fns) {
        this.objs[id].setAction(fns);
        return this;
    },
    get: function(id) {
        if (!this.objs[id]) return null;
        return this.objs[id];
    },
    getData: function(id) {
        return this.get(id).getData();
    },
    action: function(id, args) {
        this.objs[id].action(args);
    },
    close: function(id) {
        this.objs[id].close();
    },
    remove: function(id) {
        this.close(id);
        this.objs[id] = null;
        // XXX eliminare item map
    },
    showAll: function() {
        for (var k in this.objs) this.objs[k].show();
    },
    hideAll: function() {
        for (var k in this.objs) this.objs[k].hide();
    },
    closeAll: function() {
        for (var k in this.objs) this.objs[k].close();
    },
    removeAll: function() {
        this.closeAll();
        for (var k in this.objs) this.objs[k] = null;
        this.objs = {};
    }
};

var newUaEjsWnd = function(id, ejsUrl) {
    var obj = {
        initialize: function(id, ejsUrl) {
            this.ejs = UaRq.getText(ejsUrl);
            this.w = UaWindowAdm.create(id, {
                draggable: true,
                cancel: 'div.lk'
            });
        },
        readData: function(dataUrl, dataPars, dataExt) {
            var data = dataExt || {};
            data['rows'] = UaRq.getJson(dataUrl, dataPars);
            return this.setData(data);
        },
        setData: function(data) {
            this.data = data;
            data['id'] = data['id'] || this.w.getId();
            var rsp = UaEjs.compile(this.ejs, data);
            //console.log(rsp.html);
            this.w.setHtml(rsp.html);
            return this;
        },
        setXY: function(x, y, p_) {
            var p = p_ || 1;
            this.w.setXY(x, y, p);
            return this;
        },
        setLink: function(lkId, x, y, p_) {
            var p = p_ || 1;
            this.w.setLinked(lkId, x, y, p_ || 1);
            return this;
        },
        setStyle: function(css) {
            this.w.setStyle(css);
            return this;
        },
        setAction: function(fn) {
            this.action = fn;
            return this;
        },
        show: function() {
            this.w.show();
            return this;
        },
        hide: function() {
            this.w.hide();
            return this;
        },
        close: function() {
            this.w.close();
            return this;
        },
        action: function(args) {
            this.action(args);
            return this;
        },
        getData: function() {
            return this.data;
        },
        getWnd: function() {
            return this.w;
        }
    };
    obj.initialize(id, ejsUrl);
    return obj;
}

