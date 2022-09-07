/*
 * uawait2.js release 18-08-2016
 */

var UaWait = {
  w: null,
  waitShow: function (urlImg) {
    urlImg=urlImg||'css/ico/wait.gif';
    this.append();
    this.w.css({
      position: "fixed",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      backgroundImage: "url(" + urlImg + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      opacity: "0.5"
    }).show();
  },
  waitHide: function () {
    this.hide();
  },
  fogShow: function (op) {
    if (!op) op = "0.7";
    this.append();
    this.w.css({
      position: "fixed",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      opacity: op
    }).show();
  },
  fogHide: function () {
    this.hide();
  },
  append:function(){
    this.w = jQuery('<div ></div>').attr('id', '_wait_').appendTo('body');
  },
  hide: function () {
    this.w.remove();
  }
};
/*
$('#loading_indicator')
    .ajaxStart(function() { $(this).show(); })
    .ajaxStop(function() { $(this).hide(); });
*/
