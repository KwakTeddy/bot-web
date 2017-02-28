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

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  var query = {};
  if(req.params.botName && req.params.botName != '') query.botId = req.params.botName;
  if(req.params.botName && req.params.botName == '') query.botId = 'order';
  query.userId = req.params.userKey;

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

function addDialog(inText, outText, isFail, context, callback) {
  var inQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: true,
    fail: isFail,
    dialog: inText
  };

  var outQuery = {
    botId: context.bot.botName,
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: false,
    fail: isFail,
    dialog: outText
  };

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