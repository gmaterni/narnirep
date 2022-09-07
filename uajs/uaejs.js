/*
 *uaejs  17-05-2012
 */
var UaEjs = {
    build: function (src, args) {
        return UaEjs.compile(src, args).html;
    },
    compile: function (src, args) {
        var data = '';
        var srcEjs = UaEjs.parse(src);
        var k;
        for(k in args)
        data += ("var " + k + "=args['" + k + "'];");
        var js = "(function(){var up=[];" + data + srcEjs + ";return up.join(\"\");})();";
        try {
            var html = eval(js);
        } catch(err) {
            var s = js.replace(/\;/g, ";\n");
            alert("UaEjs.compile\n" + err + "\n\n\n\n" + js+"\n\n\n");
            return {
                js: js,
                html: ""
            };
        }
        return {
            js: js,
            html: html
        };
    },
    parse: function (src) {
        var txt = src.replace(/[\r\t\n]/g, "");
        var rex = /(<%=)|(<%)|(%>)/g;
        var arr = [];
        var r;
        var x0 = 0;
        var x1;
        var tag = "%>";
        for(;;) {
            r = rex.exec(txt);
            if(r == null) break;
            x1 = r.index;
            if(tag == '<%=') { // valore js
                arr.push("up.push(" + txt.substring(x0 + 3, x1).replace(/^\s+|\s+$/g, "") + ");");
            } else if(tag == '<%') { //js
                arr.push(txt.substring(x0, x1).replace(/\"/g, '"'));
            } else { // html
                arr.push("up.push(\"" + txt.substring(x0, x1).replace(/\"/g, '\\"') + "\");");
            }
            tag = r[0];
            x0 = x1;
        }
        arr.push("up.push(\"" + txt.substring(x0).replace(/\"/g, '\\"') + "\");");
        var js = arr.join("");
        return js.replace(/<%/g, '').replace(/%>/g, '');
    }
}
