var $model = {};
var nano = require("nano");
nano.syntax(/\-\=(.+?)\=\-/gi);
nano($,$model);
$.index.open();

function login() {
  Alloy.Globals.loading.show('Loading...', false);
  if (true) {
    Alloy.Globals.alert.show({
      title: "JAST",
      message: JSON.stringify($model)
    });
    Alloy.Globals.loading.hide();
    return;
  }
  Alloy.Globals.xhrGet("/login", res => {
    Alloy.Globals.loading.hide();
  }, res => {
    Alloy.Globals.loading.hide();
    Alloy.Globals.alert.show({
      title: "Error",
      message: "Could not Login" 
    });
  });
}

