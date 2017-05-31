var path = require('path');
var globals = require(path.resolve('modules/bot/engine/common/globals'));
var http = require(path.resolve('modules/bot/action/common/http'));

var httpRequest = {
  action: http.simpleRequest,
  url: '',
  params: {}
};

globals.setGlobalTask('httpRequest', httpRequest);
