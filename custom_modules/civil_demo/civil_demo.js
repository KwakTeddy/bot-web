var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('config/lib/bot')).getBot('civil_demo');

function searchCenter (task,context,callback) {
  var center = mongo.getModel('lgcenter',undefined);
  var address, lng, lat;