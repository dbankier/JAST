

exports.show = function(o){
  $.back.remove($.buttonArea);
  $.buttonArea = Ti.UI.createView({
    bottom: 20,
    left: 20,
    right: 20,
    layout:"horizontal",
    height: 40
  });
  $.back.add($.buttonArea);
  function click(e) {
    $.alert.close({animate: false});
    if (o.confirm) {
      if (e.source.index === 0) {
        o.confirm(e);
      }
    } else if (o.callback) {
      if (o.cancel === e.source.index) {
        e.cancel = true;
      }
      o.callback(e);
    }
  }
  $.alert_title.text = o.title;
  $.alert_content.text = o.message;
  if (!o.buttons) {
    if (o.confirm) {
      o.buttons = ["Yes", "No"];
    } else {
      o.buttons = ["OK"];
    }
  } 
  console.log(o.buttons);
  o.buttons.forEach(function(name, idx) {
    var but = Ti.UI.createButton({
      backgroundColor: "#0F5738",
      color: "white",
      title: name,
      left: 0,
      width: (100/o.buttons.length) + "%",
      index: idx,
      font: {
        fontFamily: "Raleway-Regular",
      }, 
      height: 40,
      borderColor: "white",
      borderWidth: 1
    });
    but.addEventListener("click",click);
    $.buttonArea.add(but);
  });
  $.alert.open({
    animated: false
  });
};
