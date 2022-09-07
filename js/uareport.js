var UaRepAdm = {
    reps: {},
    create: function(name) {
        this.reps[name] = UaRepCreator();
        return this.reps[name];
    },
    remove: function(name) {
        if (!this.reps[name]) return;
    },
    get: function(name) {
        if (!this.reps[name]) return null;
        return this.reps[name];
    },
    removeAll: function() {
        this.reps = {};
    }
};
/*
colonne rows:
proposta_id|riforma_id|it_lt|redazione|areainteresse|tipoprop|   ...   |tipoluogo

rowMapPos={'proposta_id':0,'riforma_id':1,'it_lt':2,'redazione':3,'areainteresse':4,'tipoprop':5,   ...   ,'tipoluogo':99]

colonne report:
it_lt|redazione|areainteresse|tipoprop|argomento|descrizione|deput_carica
It/Lat|Redazione|Area Interesse|Tipo Prop.|Argomento|Descizione|Carica Deputato

reportCols=['it_lt','redazione','areainteresse','tipoprop','argomento','descrizione','deput_carica']
reportMapPos={'it_lt':0,'redazione':1,'areainteresse':2,'tipoprop':3,'argomento':4,'descrizione':5,'deput_carica':6}
rowToReport=[2,3,4,5,...]
reportLabels=['It/Lat','Redazione','Area Interesse','Tipo Prop.','Argomento','Descizione','Carica Deputato']
reportMapLabel={'it_lt':'It/Lat','redazione':Redazione','areainteresse':'Area Interesse','tipoprop':'Tipo Prop.','argomento':Argomento','descrizione':Descizione','deput_carica':Carica Deputato'}
*/
var UaRepCreator = function() {
    var that;
    var rep = {
        rows: null,
        rowMapPos: null,
        reportRows: null, //esportata
        reportCols: null,
        reportMapPos: null, //esportata
        reportMapLabel: null, //esportata
        rowToReport: null,
        reportLabels: null,
        initialize: function() {},
        setData: function(data) {
            var srows = data.split('\n');
            var csv = srows[0];
            var rowCols = csv.split('|');
            that.rowMapPos = {};
            var i;
            var lr = rowCols.length;
            for (i = 0; i < lr; i++) {
                that.rowMapPos[rowCols[i]] = i;
            }
            var nr = srows.length;
            that.rows = [];
            var r;
            for (r = 1; r < nr; r++) {
                that.rows[r - 1] = srows[r].split('|');
            }
            return this;
        },
        setConf: function(repconf) {
            var conf = repconf.split('\n');
            this.reportCols = conf[0].split('|');
            var reportLabels = conf[1].split('|');
            this.reportMapPos = {};
            this.reportMapLabel = {};
            this.rowToReport = [];
            for (var i = 0; i < this.reportCols.length; i++) {
                var col = this.reportCols[i];
                var c = this.rowMapPos[col];
                this.reportMapPos[col] = i;
                this.rowToReport[i] = c;
                this.reportMapLabel[col] = reportLabels[i];
            }
            return this;
        },
        buildFilter_: function(pars) {
            var filter = {};
            var t;
            var v0;
            var v1;
            var l0 = 0;
            var f;
            for (var k in pars) {
                f = pars[k];
                if (!f) continue;
                f = f.toLowerCase();
                var lk0 = f.indexOf('%');
                var lk1 = f.lastIndexOf('%');
                if (f.indexOf('*') > -1) { //not null
                    t = 'nn';
                    v0 = '';
                    v1 = '';
                } else if (lk0 > -1 && lk0 != lk1) { //like
                    t = 'l';
                    v0 = f.replace(/%/g, '');
                    v1 = v0;
                } else if (lk0 === 0) { //like after %word
                    t = 'la';
                    v0 = f.replace('%', '');
                    l0 = v0.length;
                    v1 = v0;
                } else if (lk0 > 0) { //like before word%
                    t = 'lb';
                    v0 = f.replace('%', '');
                    l0 = v0.length;
                    v1 = v0;
                } else if (f.indexOf('|') > -1) { //between
                    t = 'b';
                    var vv = f.split('|');
                    v0 = vv[0];
                    v1 = vv[1];
                } else { //equals
                    t = 'e';
                    v0 = f;
                    v1 = f;
                }
                filter[k] = {
                    't': t,
                    'v0': v0,
                    'v1': v1,
                    'l0': l0
                };
            }
            return filter;
        },
        okRow_: function(filter, row) {
            var ok = true;
            var l, lk;
            for (var k in filter) {
                var flt = filter[k];
                if (!flt) continue;
                var c = this.rowMapPos[k];
                if (!c) continue;
                var colv = row[c] || '';
                colv = colv.toLowerCase().replace(/^\s+|\s+$/g, '');
                l = colv.length;
                if (flt.t == 'nn') { // not null
                    if (l === 0) {
                        ok = false;
                        break;
                    }
                } else if (flt.t == 'l') { //like %word%
                    if (colv.indexOf(flt.v0) < 0) {
                        ok = false;
                        break;
                    }
                } else if (flt.t == 'la') { //like after %word
                    if (l < flt.l0 || colv.substr(l - flt.l0, flt.l0) != flt.v0) {
                        ok = false;
                        break;
                    }
                } else if (flt.t == 'lb') { //like before word%
                    if (colv.substr(0, flt.l0) != flt.v0) {
                        ok = false;
                        break;
                    }
                } else if (flt.t == 'b') {
                    if ((colv >= flt.v0 && colv <= flt.v1) === false) {
                        ok = false;
                        break;
                    }
                } else {
                    if (flt.v0 != colv) {
                        ok = false;
                        break;
                    }
                }
            }
            return ok;
        },
        select: function(pars) {
            var filter = this.buildFilter_(pars);
            this.reportRows = [];
            var rwf;
            var rwsf = [];
            var nr = this.rows.length;
            var nc = this.reportCols.length;
            var r;
            var c;
            var j = 0;
            for (r = 0; r < nr; r++) {
                if (this.okRow_(filter, this.rows[r])) {
                    rwf = [];
                    for (c = 0; c < nc; c++) {
                        rwf[c] = this.rows[r][this.rowToReport[c]];
                    }
                    rwsf[j] = rwf.join('|');
                    j += 1;
                }
            }
            this.rowsFiltred = j; // XXX
            nr = rwsf.length;
            if (nr === 0) return this;
            rwsf = rwsf.sort();
            this.reportRows[0] = rwsf[0].split('|');
            j = 1;
            for (r = 1; r < nr; r++) {
                if (rwsf[r] == rwsf[r - 1]) continue;
                this.reportRows[j] = rwsf[r].split('|');
                j += 1;
            }
            return this;
        },
        getRowsNum: function() {
            return this.rows.length;
        },
        getRowsSelected: function() {
            return this.reportRows.length;
        },
        getRows: function() {
            return this.reportRows;
        },
        getLabels: function() {
            return this.reportMapLabel;
        },
        getColsPos: function() {
            return this.reportMapPos;
        },
        t0: function() {
            this.tm0 = new Date().getTime();
        },
        t1: function(s) {
            var tm1 = new Date().getTime();
            var sec = (tm1 - this.tm0) / 1000;
            UaPrn.print("</br>" + s + sec);
            return sec;
        }
    };
    rep.initialize();
    that = rep;
    return rep;
};
