/*
* uawindow  18-02-2013
*/
var UaWindowAdm = {
ws:{},
create:function (id, args) {
    var w = null;
    var eid = document.getElementById (id);
    if (!!eid)
        w = jQuery('#' + id);
    else
        w = jQuery('<div id=\"' + id + '\"></div>').appendTo ('body');
    if (!args) args = {
        draggable:true
    };
    var d = args.draggable;
    if (!!d && d == true) {
        args.cursor = 'move';
        args.scroll = false;
        if (!args.opacity) args.opacity = 0.50;
        if (!args.cancel) args.cancel = 'input,option';
        w.draggable (args);
    }
    w.hide ();
    var uaw = newUaWindow (w);
    w.mousedown (function (event, ui) {
        uaw.over ();
    });
    this.ws[id] = uaw;
    return uaw;
},
remove:function (id) {
    if (!this.ws[id]) return;
    $('#'+id).remove();
    this.ws[id]= null;
    // XXX eliminare item array
},
underAll:function () {
    //for ( var k in this.ws) { this.ws[k].w.css ( { zIndex:'auto'});}
    var z = 0;
    for ( var k in this.ws) {
        var x = parseInt (this.ws[k].w.css ('zIndex'));
        if (isNaN (x)) x = 0;
        z = Math.max (z, x);
    };
    return z + 1;
},
get:function (id) {
    if (!this.ws[id]) return null;
    return this.ws[id];
},
close:function (id) {
    if(!!this.ws[id])this.ws[id].close();
},
showAll:function () {
    for ( var k in this.ws)
        this.ws[k].w.show ();
},
hideAll:function () {
    for ( var k in this.ws)
        this.ws[k].w.hide ();
},
closeAll:function () {
    for ( var k in this.ws)
        this.ws[k].close ();
},
removeAll:function () {
    for ( var k in this.ws)
        this.remove(k);
    this.ws = {};
}
};

var newUaWindow = function (jqw) {
    var wnd = {
    initialize:function (w_) {
        this.w = w_;
        this.wx = '0px';
        this.wy = '0px';
        this.isVisible = false;
        this.firstShow = true;
        this.pos = 0;
    },
    addClassStyle:function (className) {
        if (!this.w.hasClass (className)) {
            this.w.addClass (className);
        }
        return this;
    },
    removeClassStyle:function (className) {
        if (this.w.hasClass (className)) {
            this.w.removeClass (className);
        }
        return this;
    },
    getWindow:function () {
        return this.w;
    },
    getId:function () {
        return this.w.attr ("id");
    },
    setStyle:function (style) {
        this.w.css (style);
        return this;
    },
    setHtml:function (html) {
        this.w.html (html);
        return this;
    },
    getHtml:function (html) {
        return this.w.html ();
    },
    /*
     * pos==1) => si posiziona ad ogni chiamata di show
     * pos==0) => si posiziona ad ogni chiamata di show sucessiva ad uno status hide (default)
     * pos==-1)=> si posiziona solo alla prima chiamata di show
     */
    setXY:function (x, y, pos_) {
        this.wx = x;
        this.wy = y;
        if (pos_ != null) this.pos = pos_;
        return this;
    },
    setCenterY:function (y, p) {
        var xd = jQuery (document).width ();
        var x = (xd - this.w.width ()) / 2;
        this.setXY (x, y, p);
        return this;
    },
    setCenter:function (p) {
        var xd = jQuery (window).width ();
        var yd = jQuery (window).height ();
        var x = (xd - this.w.width ()) / 2;
        var y = (yd - this.w.height ()) / 2;
        this.setXY (x, y, p);
        return this;
    },
    setLinked:function (linked_id, dx, dy, p) {
        var lk = jQuery ('#' + linked_id)[0];
        this.setLkTo(lk,dx,dy,p);
        return this;
    },
    setLkTo:function (element, dx, dy, p) {
        var lk = $(element);
        var x = lk.position ().left + lk.outerWidth () + dx;
        var y = lk.position ().top + dy;
        if (y < 0) y = 0;
        this.setXY (x, y, p);
        return this;
    },
    reset:function () {
        this.firstShow = true;
        return this;
    },
    visible:function () {
        if (this.isVisible == false) this.show ();
        else this.hide ();
        return this;
    },
    show:function () {
        if (this.firstShow || this.pos == 1 || this.pos == 0 && this.isVisible == false) {
            this.w.css ({
            position:"absolute",
            marginLeft:0,
            marginTop:0,
            left:this.wx + 'px',
            top:this.wy + 'px'
            });
        }
        this.w.show ();
        this.firstShow = false;
        this.isVisible = true;
        this.over ();
        return this;
    },
    hide:function () {
        this.w.hide ();
        this.isVisible = false;
        return this;
    },
    close:function () {
        this.hide ();
        this.w.html ('');
        return this;
    },
    over:function () {
        var z = UaWindowAdm.underAll ();
        this.w.css ({
            zIndex:z
        });
    },
    drag:function () {
        return this;
    }
    };
    wnd.initialize (jqw);
    return wnd;
}
