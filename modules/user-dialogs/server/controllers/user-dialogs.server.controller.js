'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserDialog = mongoose.model('UserDialog'),
  UserDialogLog = mongoose.model('UserDialogLog'),
  Bank = mongoose.model('Bank'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var util = require('util');

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  var query = {};
  if(req.params.botName && req.params.botName != '') query.botId = req.params.botName;
  // if(req.params.botName && req.params.botName == '') query.botId = 'csdemo';
  query.userId = req.params.userKey;
  console.log(util.inspect(query));

  UserDialog.find(query).sort('+created').exec(function (err, userDialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userDialogs);
    }
  });
};

function addDialog(inText, outText, isFail, dialog, context, callback) {
  var dialogId, dialogName, preDialogId, preDialogName;

  if(dialog != undefined) {
    dialogId = dialog.id;
    dialogName = dialog.name;

    if(context.botUser.lastDialog != undefined) {
      preDialogId = context.botUser.lastDialog.id;
      preDialogName = context.botUser.lastDialog.name;
    }
  }

  var inQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: true,
    fail: isFail,
    dialog: inText,
    dialogId: dialogId,
    dialogName: dialogName,
    preDialogId: preDialogId,
    preDialogName: preDialogName
  };

  var outQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: false,
    fail: isFail,
    dialog: outText,
    dialogId: dialogId,
    dialogName: dialogName,
    preDialogId: preDialogId,
    preDialogName: preDialogName
  };
  console.log(util.inspect(context.user));
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
  if(context.user.liveChat > 2){
    inQuery['liveChat'] = true;
    outQuery = {};
  }

  UserDialog.create([inQuery, outQuery], function(err) {
    if(err) {}
    else {}

    var query = {
      botId: context.bot.botName,
      userId : context.user.userKey,
      channel: context.channel.name,
      year: (new Date()).getYear() + 1900,
      month: (new Date()).getMonth() + 1,
      date: (new Date()).getDate()
    };

    UserDialogLog.update(query, query, {upsert: true}, function(err) {
      if(err) {}
      else {}

      callback();
    });

    // callback();
  });
}
exports.addDialog = addDialog;

exports.update = function (req, res) {
  UserDialog.update({preDialogId : req.body._id.preDialogId, dialog : req.body._id.dialog, fail: true, inOut: true}, {clear: true}, {multi: true}, function (err, result) {
    if(err){
      console.log(err)
    }else {
      console.log(result)
      res.json(result)
    }
  });
};
