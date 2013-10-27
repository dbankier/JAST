function doClick(e) {  
  $.dialog.show();
}
function doDialogClick(e) {
  Ti.API.info(e.index);
}
$.index.open();
