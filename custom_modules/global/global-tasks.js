var path = require('path');
var globals = require(path.resolve('./engine/core/engine/common/globals.js'));
var http = require(path.resolve('./engine/core/action/common/http'));

var httpRequest = {
  action: http.simpleRequest,
  url: '',
  params: {}
};

globals.setGlobalTask('httpRequest', httpRequest);
