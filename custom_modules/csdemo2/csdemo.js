var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('config/lib/bot')).getBot('csdemo2');
var async = require('async');

exports.refricheck = function (task,context,callback){
  callback(context.botUser.curcontext == 'refri');
};

exports.aircheck = function (task,context,callback){
  callback(context.botUser.curcontext == 'air');
};

exports.start = function (task,context,callback) {
  context.botUser.curcontext = null;
  callback(task,context);
};
