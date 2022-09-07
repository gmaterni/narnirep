/*
 * ua2rq.js release:14-04-2013
 */
UA = {};
var UaRq = {
    error: '',
    rqsGet: function(url, params, fnErr, dataType) {
        var ok = true;
        var res = null;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: dataType || 'xml',
            data: params,
            async: false,
            processData: true,
            cache: true,
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
                    if (dataType == 'xml' && !rsp.responseXML)
                        rsp.responseXML = $.parseXML(rsp.responseText);
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
            dataType: !!dataType_ ? dataType_ : 'xml',
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
            if (!!fnErr) fnErr(err)
            else alert("UaRq.getJson:\nerror: " + err + "\nurl:" + url);
        }
        return json;
    },
    /*
     * Legge il testo della funzione e la restituiscec {url:url,pars:{p1:v1,..}},{par1:<val1>,..}
     * var f=UaRq.loadFn("func/fes.js");
     * var s=f(20);
     * oppure;
     * var s =UaRq.loadFn("func/fes.js")(10);
     */
    loadFn: function(fnUrl, pars, fnErr) {
        var rsp = UaRq.rqsGet(fnUrl, pars, fnErr, 'text');
        if (rsp == null) return null;
        var js = rsp.responseText;
        try {
            var jsfn = eval(js);
        } catch (err) {
            alert("UaRq.loadFn:\n" + js);
            throw (err);
        }
        return jsfn;
    }
};
