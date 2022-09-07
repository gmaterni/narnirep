/*
* uaprn release 1.01 17-05-2012
*/


var UaPrn = {
prn:null,
status:0,
x:null,
y:null,
open:function () {
    if (this.prn == null) {
        this.prn = UaWindowAdm.create ("uaprn_");
        this.prn.drag ();
    }
    var h = '<button type="button" onclick="javascript:UaPrn.close();">Close</button><button type="button" onclick="javascript:UaPrn.hide();">Hide</button><button type="button" onclick="javascript:UaPrn.cls();">Clear</button><div id="uaprnmsg_"></div>';
    this.prn.setHtml (h);
    this.prn.setStyle ( {
    border:'2px solid #696969',
    width:'auto',
    height:'auto',
    textAlign:'left',
    padding:'5px 2px 2px 2px',
    margin:'0px',
    background:'#f8f8f8',
    color:'#696969',
    fontSize:'1em',
    fontWeight:'normal'
    });
    $j ("#uaprnmsg_").css ( {
    borderTop:'2px solid #ff9000',
    paddingTop:'2px ',
    marginTop:'2px',
    color:'inherit',
    background:'inherit'
    });
    var btnCss = {
    background:'#ff9000',
    color:'#fafafa',
    padding:'0px',
    margin:'0px 2px 2px 2px',
    fontSize:'0.9em',
    fontWeight:'bold',
    border:'2px solid #ff9000 '
    };
    $j("#uaprn_  button").css(btnCss);
    $j("#uaprn_  button").bind("mouseover",function(e){$j(e.target).css({color : '#ff9000', background : '#fafafa'});});
    $j("#uaprn_  button").bind("mouseout",function(e){$j(e.target).css(btnCss);});
    if (this.x != null) this.prn.setXY (this.x, this.y);
    else this.prn.setCenter (-1);
},
println:function (s) {
    this.print (s + "<br />");
},
print:function (s) {
    if (this.prn == null) this.open ();
    var h = $j ("#uaprnmsg_").html () + s + "<br/>";
    $j ("#uaprnmsg_").html (h);
    if (this.status == 0 || this.prn.isVisible == false) this.prn.show ();
    this.status = 1;
},
setXY:function (x_, y_) {
    this.x = x_;
    this.y = y_;
    return this;
},
show:function () {
    if (this.prn == null) return;
    this.prn.show ();
    this.status = 1;
},
hide:function () {
    if (this.prn == null) return;
    this.prn.hide ();
    this.status = 0;
},
cls:function () {
    if (this.prn == null) return;
    $j ("#uaprnmsg_").html ("");
},
close:function () {
    if (this.prn == null) return;
    this.prn.close ();
    this.prn = null;
    this.status = 0;
}
}
