var NARNI = 0;
var proposte = function() {
    menuId = '#div01';
    var x = 'html/proposta/filter.html';
    if (NARNI === 1) x = 'html/proposta/filterx.html';
    var hf = UaRq.getText(x, "", null);
    $('#div1').html(hf);
    showFilter();
    Report.open({
        name: 'proposta'
    });
    //Report.readData('data/proposta.csv');
    Report.readDataZip('data/proposta.csv.zip');
};
var setProposte1 = function() {
    var x = 'data/proposta01_cols.csv';
    if (NARNI === 1) x = 'data/proposta01_colsx.csv';
    Report.readConf(x);
    showReport();
};
var setProposte2 = function() {
    var x = 'data/proposta02_cols.csv';
    if (NARNI === 1) x = 'data/proposta02_colsx.csv';
    Report.readConf(x);
    showReport();
};
var setProposte3 = function() {
    var x = 'data/proposta03_cols.csv';
    if (NARNI === 1) x = 'data/proposta03_colsx.csv';
    Report.readConf(x);
    showReport();
};
/*****************************************/
var riforme = function() {
    menuId = '#div02';
    var x = 'html/riforma/filter.html';
    if (NARNI === 1) x = 'html/riforma/filterx.html';
    var hf = UaRq.getText(x, "", null);
    $('#div1').html(hf);
    showFilter();
    Report.open({
        name: 'riforma'
    });
    Report.readDataZip('data/riforma.csv.zip');
};
var setRiforme1 = function() {
    var x = 'data/riforma01_cols.csv';
    if (NARNI === 1) x = 'data/riforma01_colsx.csv';
    Report.readConf(x);
    showReport();
};
var setRiforme2 = function() {
    var x = 'data/riforma02_cols.csv';
    if (NARNI === 1) x = 'data/riforma02_colsx.csv';
    Report.readConf(x);
    showReport();
};
var setRiforme3 = function() {
    var x = 'data/riforma03_cols.csv';
    if (NARNI === 1) x = 'data/riforma03_colsx.csv';
    Report.readConf(x);
    showReport();
};
/*****************************************/
var persone = function() {
    menuId = '#div03';
    var hf = UaRq.getText('html/persona/filter.html', "", null);
    $('#div1').html(hf);
    showFilter();
    Report.open({
        name: 'persona'
    });
    Report.readData('data/persona.csv');
};
var setPersone1 = function() {
    Report.readConf('data/persona01_cols.csv');
    showReport();
};
var setPersone2 = function() {
    Report.readConf('data/persona02_cols.csv');
    showReport();
};
var setPersone3 = function() {
    Report.readConf('data/persona03_cols.csv');
    showReport();
};
/*****************************************/
var fnExit = function(rsp) {
    //alert('fine');
    self.close();
};
//menu iniziale
var initDiv = function() {
    $('body').removeClass('sfondo');
    jQuery('#div0t').hide();
    jQuery('#div0').hide();
    jQuery('#div00').hide();
    jQuery('#div01').hide();
    jQuery('#div02').hide();
    jQuery('#div03').hide();
    jQuery('#div1').hide();
    jQuery('#div2').hide();
    jQuery('#div0hlp').hide();
    UaEjsWndAdm.removeAll();
    UaWindowAdm.removeAll();
};
var setDiv00 = function() {
    initDiv();
    $('body').addClass('sfondo');
    $('#div0t').show();
    $('#div00').show();
    $('#div0hlp').show();
};
var menuId;
var showFilter = function() {
    initDiv();
    $(menuId).show();
    $('#div1').show();
};

var showReport = function() {
    initDiv();
    var h = Report.select();
    var rn = Report.rep.getRowsNum();
    var rs = Report.rep.getRowsSelected();
    $('#div0').show();
    $('#rownum').css({
        color: '#333333'
    }).html("<label>" + rn + "</label>").show();
    $('#rowselected').css({
        color: '#333333'
    }).html("<label>" + rs + "</label>").show();
    document.getElementById("div2").style.visibility= 'visible' ;    $('#div2').css({
        position: 'absolute',
        left: '0px',
        top: '25px',
        width: 'auto',
        height: 'auto'
    });
    $('#div2').html(h).show();
};


var closeReport = function() {
    $('#div2').html('');
    showFilter();
};
var clsForm = function() {
    Report.clsForm();
};
var getZip = function(url, callback) {
    zip.useWebWorkers = false;
    var onerror = function(message) {
        alert(message);
    };
    zip.createReader(new zip.HttpReader(url), function(zipReader) {
        zipReader.getEntries(function(entries) {
            entries[0].getData(new zip.TextWriter(), function(text) {
                zipReader.close();
                callback(text);
            });
        });
    }, onerror);
};
var Report = {
    rep: null,
    urlFilter: null,
    open: function(args) {
        this.rep = UaRepAdm.create(args.name);
    },
    clsForm: function() {
        var fields = $("#form1 :input");
        $.each(fields, function(i, f) {
            $(f).val('');
        });
    },
    readData: function(urlData) {
        var data = UaRq.getText(urlData, {}, null);
        this.rep.setData(data);
    },
    readDataZip: function(urlData) {
        getZip(urlData, this.rep.setData);
    },
    readConf: function(urlConf) {
        var conf = UaRq.getText(urlConf, {}, null);
        this.rep.setConf(conf);
    },
    getPars_: function(form_id) {
        var ps = jQuery('#' + form_id).serializeArray();
        var pars = {};
        jQuery.each(ps, function(i, p) {
            pars[p.name] = p.value.replace(/\'/g, "\\'");
        });
        return pars;
    },
    select: function() {
        var pars = this.getPars_('form1');
        var d0 = pars.dal || null;
        var d1 = pars.al || null;
        if (!!d0 || !!d1) {
            d0 = d0 || '1400-01-01';
            d1 = d1 || '1700-01-01';
            pars.datarif = d0 + '|' + d1;
            //console.log(pars['datarif']);
        }
        this.rep.select(pars);
        return this.composeReport();
    },
    composeReport: function() {
        var ejsSch = UaRq.getText("ejs/report.ejs", {}, null);
        var mapLabel = this.rep.getLabels();
        var rse = UaEjs.compile(ejsSch, {
            'mapCols': mapLabel
        });
        var ejs = rse.html.replace(/#/g, '%');
        var rows = this.rep.getRows();
        var cols = this.rep.getColsPos();
        var rs = UaEjs.compile(ejs, {
            'cols': cols,
            'rows': rows
        });
        return rs.html;
    }
};
//{dataUrl:'url',lkId:'lkId',titolo:'titolo,w:<n>,h:<n>,x:<n>,y:<n>}
var lk = function(args) {
    var data = {
        'dataExt': {
            'titolo': args.titolo
        },
        'rows': []
    };
    var text = UaRq.getText(args.dataUrl, {}, null);
    var rs = text.split('\n');
    for (var i = 0; i < rs.length; i++) data.rows[i] = {
        'descr': rs[i]
    };
    var w = args['w'] || '200px';
    var h = args['h'] || '300px';
    var x = args['x'] || 10;
    var y = args['y'] || -10;
    var lk = UaEjsWndAdm.create('lk', 'ejs/lk.ejs');
    lk.setData(data).setLink(args.lkId, x, y, 1).setStyle({
        'width': w,
        'height': h
    }).show();
    var fn = function(i) {
        var f = lk.getData().rows[i]['descr'];
        $("#" + args.lkId).val(f);
        lk.close();
    };
    lk.setAction(fn);
};
var choice = function(args) {
    var data = {
        'dataExt': {
            'titolo': args.titolo
        },
        'rows': []
    };
    var text = args.options;
    var rs = text.split('|');
    for (var i = 0; i < rs.length; i++) data.rows[i] = {
        'descr': rs[i]
    };
    var w = args['w'] || '100px';
    var h = args['h'] || 'auto';
    var x = args['x'] || 100;
    var y = args['y'] || 0;
    var lk = UaEjsWndAdm.create('lk', 'ejs/choise.ejs');
    lk.setData(data).setLink(args.lkId, x, y, 1).setStyle({
        'width': w,
        'height': h
    }).show();
    var fn = function(i) {
        var f = lk.getData().rows[i]['descr'];
        $("#" + args.lkId).val(f);
        lk.close();
    };
    lk.setAction(fn);
};
var help = function(args) {
    var id = 'hlp__';
    var w = args['w'] || '800px';
    var h = args['h'] || '700px';
    var wnd = UaWindowAdm.get(id);
    if (!wnd) wnd = UaWindowAdm.create(id);
    var html = UaRq.getText(args.url);
    wnd.setHtml(html).setStyle({
        width: w
    }).setXY(300, 10, 0);
    $('#' + id + " div.help").css({
        border: '2px solid #999999',
        height: h
    });
    wnd.visible();
};
