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
  BotIntentFail = mongoose.model('BotIntentFail'),
  Intent = mongoose.model('Intent'),
  FactLink = mongoose.model('FactLink'),
  botLib = require(path.resolve('config/lib/bot')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  utils = require(path.resolve('modules/bot/action/common/utils'));

var async = require('async');
var BotFile = mongoose.model('BotFile');

var util = require('util');
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
  var botId = req.params.bId;
  var kind = req.params.kind;
  var arg = req.params.arg;

  _dialogFailureList(botId, kind, arg, function(userCounts, err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userCounts);
    }
  });
};

function _dialogFailureList(botId, kind, arg, callback) {
  var cond = { inOut: true};
  if (kind == 'year')
    cond = {year: parseInt(arg), inOut: true};
  else if (kind == 'month')
    cond = {year: new Date(arg).getFullYear(), month: new Date(arg).getMonth()+1, inOut: true}
  cond.fail = true;
  //TODO: change this to regexp
  cond.dialog = {$ne: null, $nin: [":reset user", ":build " + botId + " reset"]};
  cond.preDialogId = {$ne: 0};
  cond.botId = botId;
  cond.clear = {$ne: true};

  // console.log(JSON.stringify(cond));

  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" },
        inOut: '$inOut', dialog: '$dialog', fail:'$fail', preDialogId:'$preDialogId', preDialogName:'$preDialogName', botId:'$botId', clear:'$clear'}},
      {$match: cond},
      {$match:{ preDialogId: { $exists:true, $ne: null } } },
      {$group: {_id: {dialog:'$dialog', preDialogId: '$preDialogId'}, count: {$sum: 1}}},
      {$sort: {count: -1}},
      {$limit: 300}
    ]
  ).exec(function (err, userCounts) {
    callback(userCounts, err);
  });
}

exports._dialogFailureList = _dialogFailureList;
var dialogs_data;

var searchDialog = function(dialogs, dialogId, action, res, data) {
  for(var i = 0; i < dialogs.length; i++){
    if (dialogs[i].id == dialogId){
      return action(dialogs[i], res, data);
    }else if (dialogs[i].children) {
      searchDialog(dialogs[i].children, dialogId, action, res, data);
    }
  }
  res.end();
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
  if (object.children){
    object.children.forEach(function(obj) {
      var dialog = {};
      dialog.dialogId = obj.id;
      dialog.name = obj.name != undefined ? obj.name : "dialog"+obj.id;
      dialog.outputs = obj.output;
      if (Array.isArray(obj.input)){
        for(var i = 0; i < obj.input.length; i++){
          if (obj.input[i].text){
            obj.input[i] = obj.input[i].text
          }
        }
      }else if(typeof obj.input == 'Object'){
        obj.input = obj.input.text
      }

      dialog.inputs = obj.input;

      dialogChildren.push(dialog);
    });

    res.jsonp(dialogChildren);
  }else {
    dialogs_data.forEach(function(obj) {
      var dialog = {};
      dialog.dialogId = obj.id;
      dialog.name = obj.name != undefined ? obj.name : "dialog"+obj.id;
      dialog.outputs = obj.output;
      if (Array.isArray(obj.input)){
        for(var i = 0; i < obj.input.length; i++){
          if (obj.input[i].text){
            obj.input[i] = obj.input[i].text
          }
        }
      }else if(typeof obj.input == 'Object'){
        obj.input = obj.input.text
      }
      dialog.inputs = obj.input;
      dialogChildren.push(dialog);
    });
    res.jsonp(dialogChildren);
  }
};

var dialogId;
var originalDialog;
var targetPreDialog;
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

    if (Array.isArray(data.inputs)){
      for(var i = 0; i < data.inputs.length; i++){
        if (data.inputs[i].text){
          data.inputs[i] = data.inputs[i].text
        }
      }
    }else if(typeof data.inputs == 'Object'){
      data.inputs = data.inputs.text
    }

    for(var i = 0; i < o.input.length; i++){
      o.input[i]['text'] = data.inputs[i]
    }
    for(var j = o.input.length; j < data.inputs.length;j++){
      o.input.push({'text': data.inputs[j]});
    }

    for(var i = 0; i < o.output.length; i++){
      o.output[i]['output'] = data.outputs[i].output
    }
    for(var j = o.output.length; j < data.outputs.length;j++){
      o.output.push({'output': data.outputs[j].output});
    }

    var userDialogIds = [];

    UserDialog.update({preDialogId : targetPreDialog, dialog : originalDialog, fail: true, inOut: true}, {clear: true}, {multi: true}, function (err, result) {
      if(err){
        console.log(err)
      }else {
        console.log(result)
        res.json(result)
      }
    });
  });

};

exports.dialog = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  dialogs_data = utils.clone(global._bots[botId].dialogs);
  var data = {};

  console.log("dialog:" + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findOne, res, data);
};


exports.dialogChildren = function (req, res) {
  var botId = req.params.bId;
  var dialogId = req.params.dialogId;
  dialogs_data = utils.clone(global._bots[botId].dialogs);
  var data = {};

  console.log("dialogChildren: " + botId+","+dialogId);
  searchDialog(dialogs_data, dialogId, findChildren, res, data);
};

exports.save_dialog = function(req, res) {
  var botId = req.body.botId;
  dialogId = req.body.dialogId;
  originalDialog = req.body.originalDialog;
  targetPreDialog = req.body.targetPreDialog;
  var dialog = {inputs: req.body.inputs, outputs: req.body.outputs};
  dialogs_data = global._bots[botId].dialogs;

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
  var common_dialogs;
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
            common_dialogs = global._bots[doc.id].commonDialogs;
            cb(null, doc.id);
          });
        } else {
          dialogs_data = global._bots[doc.id].dialogs;
          common_dialogs = global._bots[doc.id].commonDialogs;
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

      result.common = [];
      common_dialogs.forEach(function (d) {
        if (d.filename === result.fileName + "common") {
          result.common.push(d);
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

exports.dialogFailureMaintenanceList = function (req, res) {
  BotIntentFail.aggregate(
    [
      {$match: {botId: req.bot.id}},
      {$group: {_id: '$intent'}}
    ]
  ).exec(function (err, data) {
    if (err){
      console.log(err)
    }else {
      Intent.populate(data, {path: '_id'},function (err, result) {
        if (err){
          console.log(err)
        }else {
          res.json(result)
        }
      });
    }
  })
};

exports.dialogFailureMaintenance = function (req, res) {
  BotIntentFail.find({intent : req.params.intentId, clear: {$ne: true}}).populate('userDialog').exec(function (err, data) {
    if(err){
      console.log(err)
    }else {
      res.json(data)
    }
  })
};

exports.dialogFailureMaintenanceUpdate = function (req, res) {
  // console.log(util.inspect(req.query.clearList));
  // console.log(util.inspect(typeof req.query.clearList));
  // console.log(util.inspect(JSON.parse(req.query.clearList)));
  // console.log(util.inspect(req.query.clearList.length));
  // console.log('-------------------==--');
  var intentFailIds = [];
  var userDialogIds = [];

  if (typeof req.query.clearList == 'string'){
    req.query.clearList = JSON.parse(req.query.clearList);
    intentFailIds.push(req.query.clearList._id)
    userDialogIds.push(req.query.clearList.userDialog._id)
  }else {
    for(var i = 0; i < req.query.clearList.length; i++){
      intentFailIds.push(JSON.parse(req.query.clearList[i])._id);
      userDialogIds.push(JSON.parse(req.query.clearList[i]).userDialog._id)
    }
  }

  BotIntentFail.update({_id : {$in: intentFailIds}}, {clear: true}, {multi: true}, function (err, result) {
    if(err){
      console.log(util.inspect(err))
    }else {
      UserDialog.update({_id: {$in: userDialogIds}}, {clear: true}, {multi: true}, function (err, result2) {
        if(err){
          console.log(err)
        }else {
          console.log(result2)
          res.json(result2)
        }
      })
    }
  });
};
