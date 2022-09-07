/*
 * UaRq 21-02-2013
 */

UA = {};

$j = jQuery;
$id = function(id) {
    return document.getElementById(id);
};

//21-02-2013
var UaRq = {
    error: '',
    rqsGet: function(url, params, fnErr, dataType) {
        var ok = true;
        var res = null;
        jQuery.ajax({
            type: 'GET',
            url: url,
            dataType: dataType || 'xml',
            data: params,
            async: false,
            processData: true,
            cache: false,
            success: function(rsp, arg2) {
                UaRq.error = "";
            },
            error: function(rsp, arg2) {
                ok = false;
                UaRq.error = "Error!\n UaRq.rqsGet\nurl:" + url;
                if (!fnErr) fnErr = function(rsp) {
                    var s = !rsp.responseText ? "text is null" : rsp.responseText;
                    alert(UaRq.error + "\nstatus: " + rsp.status + "\n" + s);
                };
            },
            complete: function(rsp, arg2) {
                if (ok) {
                    if (dataType == 'xml' && !rsp.responseXML) rsp.responseXML = $.parseXML(rsp.responseText);
                    res = rsp;
                } else {
                    res = null;
                    fnErr(rsp);
                }
            }
        });
        return res;
    },

    rqsJsonp: function(url, params, callback, fnOk, fnErr) {
        return $.ajax({
            type: 'GET',
            cache: false,
            url: url,
            dataType: 'jsonp',
            contentType: "application/json",
            jsonpCallback: callback,
            data: params,
            success: fnOk,
            error: fnErr
        });
    },

    rqsPost: function(url, params, fnOk, fnErr, dataType_) {
        var ok = true;
        jQuery.ajax({
            type: 'POST',
            url: url,
            dataType: !! dataType_ ? dataType_ : 'xml',
            data: params,
            processData: true,
            async: true,
            cache: false,
            success: function(rsp) {
                UaRq.error = "";
            },
            error: function(rsp) {
                ok = false;
                UaRq.error = "Error!\n UaRq.rqsPost\nurl:" + url;
                if (!fnErr) fnErr = function(rsp) {
                    alert(UaRq.error);
                };
            },
            complete: function(rsp) {
                if (ok) fnOk(rsp);
                else fnErr(rsp)
            }
        });
    },


    getText: function(url, params, fnErr) {
        var rsp = UaRq.rqsGet(url, params, fnErr, 'text');
        if (rsp == null) return null;
        return rsp.responseText;
    },

    getXml: function(url, params, fnErr) {
        var rsp = UaRq.rqsGet(url, params, fnErr, 'xml');
        if (rsp == null) return null;
        return rsp.responseXML;
    },

    /*
     * Legge un file json
     * url: nome del file json
     * funzione opzionale per gestire l'errore
     * ritorna un object json
     */
    getJson: function(url, params, fnErr) {
        var json = null;
        try {
            var rsp = UaRq.rqsGet(url, params, null, 'text');
            if (!rsp) return null;
            eval("var json=" + rsp.responseText);
        } catch (err) {
            if ( !! fnErr) fnErr(err)
            else alert("UaRq.getJson:\nerror: " + err + "\nurl:" + url);
        }
        return json;
    },


    /*
     * Legge un file javascript
     * url: nome del file js
     * id: identificatore dello script.
     * onLoad : funzione da invocare alla fine del caricamento in formato stringa.
     * es: onLoad="alert('prova onLoad');";
     */
    loadJs: function(url, id, onLoad) {
        if (!onLoad) onLoad = "";
        if (!id) id = 'idjs_';
        var js = jQuery("<script></script>").attr({
            id: id,
            src: url,
            type: "text/javascript",
            onload: onLoad
        })[0];
        $("head").append(js);
        $('#' + id).remove();
    },

    /*
     * Legge un file js e lo esegue
     * nameJs : nome del file js
     * onLoadExpr è la funzione che viene invocata alla fine del caricamento.
     * Il parametro onLoadExpr viene valutato e viene ritornato il suo valore.
     * es.
     * var x=execJs("file.js","myFn()");
     * ritorna il valore di ritorno della funzione myFn.
     */
    execJs: function(jsUrl, onLoadExpr, pars, fnErr) {
        alert('UaRq.execJs obsolete');
        var uaobj = null;
        var js = UaRq.rqsGet(jsUrl, pars, fnErr, 'text').responseText + ";\nuaobj=" + onLoadExpr + ";";
        try {
            eval(js);
        } catch (err) {
            alert("UaRq.execJs:\n" + err + "\n" + js);
            throw (err);
        }
        return uaobj;
    },
    /*
     * gestione di funzioni anonime;
     *
     * es:
     * (function () {
     *  return function (n) {
     *   var s = "";
     *   for (i = 0; i < n; i++) {
     *     s = s + i + "\n";
     *   }
     *   return s; }
     *   })();
     *
     * Ritorna la funzione .
     * Per invocarla successivamente
     * var f =UaRq.getFn(txt); var s=f(20)
     * oppure
     * var s = UaRq.getFn(txt)(10);
     */
    getFn: function(fnTxt) {
        try {
            var uajsfn = eval(fnTxt);
        } catch (err) {
            alert("UaRq.getFn:\n" + err + "\n" + fnTxt);
            throw (err);
        }
        return uajsfn;
    },
    /*
     * Legge il testo della funzione e la restituiscec {url:url,pars:{p1:v1,..}},{par1:<val1>,..}
     * var f=UaRq.loadFn("func/fes.js");
     * var s=f(20);
     * oppure;
     * var s =UaRq.loadFn("func/fes.js")(10);
     */
    loadFn: function(fnUrl, pars, fnErr) {
        var js = UaRq.getText(fnUrl, pars, fnErr);
        if (!js) return null;
        try {
            var jsfn = eval(js);
        } catch (err) {
            alert("UaRq.loadFn:\n" + js);
            throw (err);
        }
        return jsfn;
    },

    loadCss: function(url, id) {
        var css = jQuery("<link></link>").attr({
            id: id,
            rel: "stylesheet",
            type: "text/css",
            href: url
        })[0];
        document.getElementsByTagName("head")[0].appendChild(css);
    },
    /*
     * Trasforma una query string del tipo ?par1=va1&par2=val2 in un hash
     */
    queryStringToHash: function(qstr) {
        var hs = {};
        var up = qstr.split('?');
        var qs = up.length == 1 ? up[0] : up[1];
        var ar = qs.split('&');
        for (var i = 0; i < ar.length; i++) {
            var kv = ar[i].split('=');
            hs[kv[0]] = kv[1];
        }
        return hs
    },
    /*
     * dd-mm-yyyy <=> yyyy-mm-dd
     */
    dateConvert: function(dateStr) {
        if (!dateStr || dateStr == '') return dateStr;
        var s = dateStr.replace(/\//g, '-').replace(/\./g, '-');
        var p = s.split(/-/g);
        return [p[2], p[1], p[0]].join("-");
    }
};
