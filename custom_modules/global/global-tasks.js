var path = require('path');
var globals = require(path.resolve('./bot-engine/engine/common/globals.js'));
var http = require(path.resolve('./bot-engine/action/common/http'));

var httpRequest = {
  action: http.simpleRequest,
  url: '',
  params: {}
};

globals.setGlobalTask('httpRequest', httpRequest);
