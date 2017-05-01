'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  BotUser = mongoose.model('BotUser'),
  UserDialogLog = mongoose.model('UserDialogLog'),
  UserDialog = mongoose.model('UserDialog'),
  FactLink = mongoose.model('FactLink'),
  botLib = require(path.resolve('config/lib/bot')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var async = require('async');
var BotFile = mongoose.model('BotFile');

/**
 * List of User count
 */
exports.list = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;

  var cond = {};
  if (kind == 'year')
    cond = {year: parseInt(arg)};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1 };
  console.log(JSON.stringify(cond));
  UserDialogLog.aggregate(
    [
      {$match: cond},
      {$group: {_id: {year: '$year', month: '$month', date: '$date'}, date: {$first: '$date'}, count: {$sum: 1}}},
      {$sort: {_id:-1,  date: -1}},
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

exports.dialogList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;

  var cond = { inOut: true};
  if (kind == 'year') {
    cond = {year: parseInt(arg), inOut: true};
  } else if (kind == 'month') {
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth() + 1, inOut: true}
  }
  cond.dialog = {$ne: null, $nin: [":reset user", ":build csdemo reset"]};
  cond.botId = "csdemo";

  console.log(JSON.stringify(cond));
  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', botId: '$botId'}},
      {$match: cond},
      {$group: {_id: '$dialog', count: {$sum: 1}}},
      {$sort: {count: -1}},
      {$limit: 300}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // replace ";reset user" to 시작
      userCounts.forEach(function(item) {
        if (item._id == ":reset user")
          item._id = "시작";
      });
      res.jsonp(userCounts);
    }
  });
};

exports.dialogSuccessList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;

  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true};
  console.log(JSON.stringify(cond));
  async.waterfall([
    function(cb) {
      UserDialog.aggregate(
        [
          {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog'}},
          {$match: cond},
          {$group: {_id: {year: '$year', month: '$month', date: '$day'}, date: {$first: '$date'}, count: {$sum: 1}}},
          {$sort: {_id:-1, date: -1}}
        ]
      ).exec(function (err, userCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          cb(null, userCounts);
        }
      });
    },
    function(userCounts, cb) {
      cond.fail = true;
      UserDialog.aggregate(
        [
          {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', fail:'$fail'}},
          {$match: cond},
          {$group: {_id: {year: '$year', month: '$month', date: '$day'}, date: {$first: '$date'}, count: {$sum: 1}}},
          {$sort: {_id:1, date: -1}}
        ]
      ).exec(function(err, failCounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var result = [];
          for (var i = 0; i < userCounts.length; ++i)
          {
            result.push(userCounts[i]);
            result[i].rate = 100.0;
            result[i].fail_count = 0;
            result[i].success_count =  userCounts[i].count;
            for (var j=0; j < failCounts.length; ++j)
            {
              if (
                userCounts[i]._id.year == failCounts[j]._id.year &&
                userCounts[i]._id.month == failCounts[j]._id.month &&
                userCounts[i]._id.date == failCounts[j]._id.date
                )
              {
                result[i].fail_count = failCounts[j].count;
                result[i].rate = ((userCounts[i].count - failCounts[j].count) / userCounts[i].count * 100.0).toFixed(2);
              }
            }
          }
          res.jsonp(result);
        }
      });
    }
  ]);
};

exports.sessionSuccessList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;

  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true};
  console.log(JSON.stringify(cond));
  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog', fail:'$fail'}},
      {$match: cond},
      {$group: {_id: '$dialog', count: {$sum: 1}}},
      {$sort: {count: -1}}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

exports.dialogFailureList = function (req, res) {
  var kind = req.params.kind;
  var arg = req.params.arg;

  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true}
  cond.fail = true;
  //TODO: change this to regexp
  cond.dialog = {$ne: null, $nin: [":reset user", ":build csdemo reset"]};
  cond.preDialogId = {$ne: 0};
  cond.botId = "csdemo";

  console.log(JSON.stringify(cond));

  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" },
        inOut: '$inOut', dialog: '$dialog', fail:'$fail', preDialogId:'$preDialogId', preDialogName:'$preDialogName', botId:'$botId'}},
      {$match: cond},
      {$match:{ preDialogId: { $exists:true, $ne: null } } },
      {$group: {_id: {dialog:'$dialog', preDialogId: '$preDialogId'}, count: {$sum: 1}}},
      {$sort: {count: -1}},
      {$limit: 300}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

var searchDialog = function(dialogs, dialogId, action, res, data) {
  dialogs.forEach(function(obj) {
    if (obj.id == dialogId) {
      action(obj, res, data);
      return;
    }
    else if (obj.children) {
      searchDialog(obj.children, dialogId, action, res, data);
    }
  });
};

var findOne = function(o, res, data) {
  var dialog = {};
  dialog.name = o.name != undefined ? o.name : "dialog" + o.id;
  dialog.inputs = o.input;
  dialog.outputs = o.output;

  console.log(JSON.stringify(dialog));
  res.jsonp(dialog);
};

var findChildren = function(object, res, data) {
  var dialogChildren = [];

  object.children.forEach(function(obj) {
    var dialog = {};
    dialog.dialogId = obj.id;
    dialog.name = obj.name != undefined ? obj.name : "dialog"+obj.id;
    dialog.inputs = obj.input;
    dialog.outputs = obj.output;
    dialogChildren.push(dialog);
  });

  console.log(JSON.stringify(dialogChildren));
  res.jsonp(dialogChildren);
};

var save = function(o, res, data) {
  console.log(JSON.stringify(data));

  var nlp = require(path.resolve('modules/bot/engine/nlp/processor'));
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: true     // (optional default: false)
  });

  nlpKo.tokenize/*ToStrings*/(data.inputs[data.inputs.length-1], function(err, result) {

    var _nlp = [], _in;
    for (var i = 0; i < result.length; i++) {

      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    data.inputs[data.inputs.length - 1] = _in;

    o.input = data.inputs;
  });

};

exports.dialog = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  var dialogs_data = global._bots[botId].dialogs;
  var data = {};

  console.log("dialog:" + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findOne, res, data);
};

exports.dialogChildren = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  var dialogs_data = global._bots[botId].dialogs;
  var data = {};

  console.log("dialogChildren: " + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findChildren, res, data);
};

exports.save_dialog = function(req, res) {
  var botId = req.body.botId;
  var dialogId = req.body.dialogId;
  var dialog = {inputs: req.body.inputs, outputs: req.body.outputs};
  var dialogs_data = global._bots[botId].dialogs;

  console.log("save: " + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, save, res, dialog);
};

exports.load_bot = function(req, res) {
  var botId = req.params.bId;
  botLib.loadBot(botId, function(bot) {
    console.log("loadBot: " + botId);
    res.status(200).send({message: 'done'});
  });
};

exports.save_dialogs = function(req, res) {
  var botId = req.body.botId;
  var fileName = req.body.fileName;
  var dialogs = req.body.dialogs;
  // var dialogs = JSON.parse(req.body.dialogs, function(key, value){
  //   console.log(key + "," + value);
  //   if(typeof value != 'string') return value;
  //   return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
  // });

  // save to dialog.js , buildBot and loadBot
  botLib.buildBot(botId, null, fileName, JSON.stringify(dialogs, null, "\t"));
  botLib.loadBot(botId, function(bot) {
    console.log("saveAll: " + botId+","+fileName);
    res.status(200).send({message: 'done'});
  });
};

exports.dialogs = function (req, res) {
  var botId = req.params.bId;
  var fileId = req.params.fileId;

  var result = {};
  var dialogs_data;
  async.waterfall([
    function (cb) {
      BotFile.findById(fileId).exec(function (err, file) {
        result.fileName= file.name.split(".")[0];
        cb(null);
      });
    },
    function (cb) {
      Bot.findOne({_id: botId}).exec(function (err, doc) {
        result.botId = doc.id;
        if (!global._bots[doc.id]) {
          botLib.loadBot(doc.id, function (bot) {
            dialogs_data = bot.dialogs;
            cb(null, doc.id);
          });
        } else {
          dialogs_data = global._bots[doc.id].dialogs;
          cb(null, doc.id);
        }
      });
    },
    function(botName,cb) {
      result.tasks = Object.keys(global._bots[botName].tasks).map(function(key) {return global._bots[botName].tasks[key].name;});
      result.types = Object.keys(global._bots[botName].types).map(function(key) {return global._bots[botName].types[key]});
      result.intents = Object.keys(global._bots[botName].intents).map(function(key) {return global._bots[botName].intents[key]});
      result.type_dic = global._bots[botName].types;
      cb(null);
    },
    function (cb) {
      result.data = [];
      dialogs_data.forEach(function (d) {
        if (d.filename === result.fileName) {
          result.data.push(d);
        }
      });

      console.log("dialog:" + result.botId + "(" + botId + "), " + result.fileName);
      // var json = JSON.stringify(result, function(key, value) {
      //       return (typeof value === 'function' ) ? value.toString() : value;
      //   });
      // return res.send(json);
      return res.jsonp(result);
    }
  ]);
};

exports.resetDB = function(req, res) {
  console.log('resetDB');
  var cond = { inOut: true};
  cond.fail = true;
  cond.botId = "csdemo";
  UserDialog.find(cond).remove().exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      FactLink.find({botUser: {$ne: null}}).remove().exec(function(err, data) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.status(200).send({message: 'done (factlinks and userdialogs)'});
        }
      });
    }
  });
};

