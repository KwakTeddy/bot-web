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


exports.liveChat = function (req, res) {
  console.log(util.inspect(req.body))
  var query = {};
  query['botId'] = req.body.botId;
  query['liveChat'] = true;
  query['channel'] = {$ne: "socket"};
  var currentPage = 0;
  var perPage = 10;
  var sort = {created : 1};
  // if(req.query.role && (req.query.role == 'admin')){
  //   query = {};
  // }
  if(req.query.currentPage) currentPage = req.query.currentPage;
  if(req.query.perPage) perPage = req.query.perPage;
  if(req.query.sortDir && req.query.sortCol) {
    if (req.query.sortDir == 'asc') req.query.sortDir = 1;
    else req.query.sortDir = -1;
    sort[req.query.sortCol] = req.query.sortDir;
  }
  if(req.query.search){
    var searchQuery = {};
    searchQuery['$and'] = [];
    searchQuery.$and.push(query);
    searchQuery.$and.push({
      $or : [
        {channel: { $regex: req.query.search}},
        {userId: { $regex: req.query.search}}
      ]
    });
    query = searchQuery;
  };
  console.log(util.inspect(query, {showHidden: false}))
  UserDialog.aggregate(
    [
      {$match: query},
      {$group: {
          _id: {userKey: "$userId", channel: "$channel", botId: "$botId"},
        count: {$sum: 1},
        maxDate: {$max: "$created"}
        }
      },
      {$sort: sort},
      {$skip: currentPage*perPage},
      {$limit: perPage}
    ]
  ).exec(function (err, data) {
    if(err) console.log(err);
    else {
      UserDialog.aggregate(
        [
          {$match: query},
          {$group: {
            _id: {userKey: "$userId", channel: "$channel", botId: "$botId"}
          }
          }
        ]
      ).exec(function (err, data2) {
        if(err) console.log(err);
        else {
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
          var result = {data: data, recordsTotal: data2.length};
          res.jsonp(result);
        }
      });
    }
  })
};



/**
 * List of Bot users
 */
exports.list = function (req, res) {
  console.log(util.inspect(req.params))
  console.log(util.inspect(req.query))
  var query = {};
  if(req.params.botName && req.params.botName != '') query.botId = req.params.botName;
  if(req.query.liveChat) query['liveChat'] = req.query.liveChat;
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
  if(context.user.liveChat > 1){
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
