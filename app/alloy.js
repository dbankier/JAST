// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
var XHR = require("XHR");
var nano = require("nano");
var xhr = new XHR();
xhr.clean();
var server = "http://localhost:3000";
Alloy.Globals.xhrGet = function(path, callback, onerror,options) {
  xhr.get(server + path, callback,onerror, options||{});
};
Alloy.Globals.xhrPost = function(path, data, callback, onerror, options) {
  xhr.post(server + path, data, callback,onerror, options || {});
};
Alloy.Globals.xhr = xhr;
Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");
Alloy.Globals.alert = Alloy.createWidget("yy.alert");
