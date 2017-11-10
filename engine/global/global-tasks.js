var path = require('path');
var globals = require(path.resolve('./engine/bot/engine/common/globals'));
var http = require(path.resolve('./engine/bot/action/common/http'));

var httpRequest = {
  action: http.simpleRequest,
  url: '',
  params: {}
};

globals.setGlobalTask('httpRequest', httpRequest);
