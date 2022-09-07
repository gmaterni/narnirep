/*
* uadom release 1.01 17-05-2012
*/


var UaDom = {
syntax:/(^|.|\r|\n)(\<%=\s*(\w+)\s*%\>)/,
setInner:function (html, id) {
    $id (id).innerHTML = html;
},
/*
 * setta l'elemento e valuta javascript
 */
setInnerJs:function (html, id) {
    jQuery ('#' + id).html (html);
},
/*
 * setta tutti gli elementi di doc
 * il cui id esiste nell'insieme delle chiavi di map
 */
setInners:function (xmlMap) {
    for (var id in xmlMap.getElements ()) {
        var e = document.getElementById (id);
        if (e != null) e.innerHTML = xmlMap.getValue (id, id + " Err");
    }
},
/*
 * setta tutti gli elementi di elements
 * il cui id esiste nell'insieme delle chiavi di map
 */
setListInners:function (elements, map) {
    var l = elements.length;
    for ( var i = 0; i < l; i++) {
        var e = elements[i];
        var id = e.id;
        var v = map.getValue (id, null);
        if (v != null) e.innerHTML = v;
    }
},
setValue:function (val, id) {
    var e = document.getElementById (id)
    e.value = val;
},
/*
 * setta i valori di tutti gli elementi di doc
 * il cui id esiste nell'insieme delle chiavi di map
 */
setValues:function (map) {
    var es = map.getElements ();
    for (id in es) {
        var e = document.getElementById (id);
        if (e != null) e.value = map.getValue (id, id + " Err");
    }
},
setTag:function (txt, key, val) {
    var t = {}
    t[key] = val;
    var rs = UaEjs.compile (txt, t);
    return rs.html;
},
setTags:function (html, map) {
    var t = {};
    var es = map.getElements ();
    for ( var k in es)
        t[k] = map.getValue (k, k + " Err:");
    var rs = UaEjs.compile (html, t);
    return rs.html;
}
}
