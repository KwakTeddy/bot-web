var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Intent = mongoose.model('Intent');
var IntentContent = mongoose.model('IntentContent');
var BotIntentFail = mongoose.model('BotIntentFail');
var path = require('path');
var dialog = require(path.resolve('./bot-engine/action/common/dialog.js'));
var mongoModule = require(path.resolve('./bot-engine/action/common/mongo'));
var analytics = require(path.resolve('./bot-engine/analytics.server.controller'));
var async = require('async');
var _ = require('lodash');

var intentCheck = {
  name: 'intentDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
  limit: 10,
  matchRate: 0.4,
  matchCount: 4,
  exclude: ['하다', '이다'],
  mongo: {
    model: 'intentcontent',
    queryFields: ['input'],
    fields: 'input intentId' ,
    taskFields: ['input', 'intentId', 'matchCount', 'matchRate'],
    minMatch: 1
  },
  preType: function(task, context, type, callback) {
    type.mongo.queryStatic = {};
    if(type.typeCheck == undefined) type.typeCheck =global._context.typeChecks['dialogTypeCheck'];

    if(context.bot.intents && context.bot.intents.length > 0) {
      var _intents = [];
      for(var i in context.bot.intents) {
        _intents.push(context.bot.intents[i]._id);
      }
      type.mongo.queryStatic = {intentId: {$in: _intents}};
    } else {
      type.mongo.queryStatic.intentId = null;
    }

    callback(task, context);
  }
};

exports.intentCheck = intentCheck;

var intentTask = {

  action: function(task, context, callback) {
    // console.log(JSON.stringify(task.typeDoc, null, 2));

    if(Array.isArray(task.typeDoc)) {
      if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
      else task._output = task.typeDoc[0].output;

      console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
    } else {
      task._output = task.typeDoc.output;
      console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
    }

    if(Array.isArray(task._output)) {
      task._output = task._output[Math.floor(Math.random() * task._output.length)];
    }

    callback(task, context);
  }
};

exports.intentTask = intentTask;

exports.matchIntent = function(inRaw, inNLP, context, callback)
{
    dialog.executeType(inRaw, inNLP, intentCheck, {}, context, function(inNLP, task, matched)
    {
        if(matched) {
            var matchCount, matchRate;
            var intentId;
            if(Array.isArray(task.intentDoc) && task.intentDoc.length > 0) {
                intentId = task.intentDoc[0].intentId;
                matchCount = task.intentDoc[0].matchCount;
                matchRate = task.intentDoc[0].matchRate;
            } else {
                intentId = task.intentDoc.intentId;
                matchCount = task.intentDoc.matchCount;
                matchRate = task.intentDoc.matchRate;
            }

            Intent.findOne({_id: intentId}).lean().exec(function(err, _intent) {
                if(_intent) {
                    for(var i in context.bot.dialogs) {
                        var dialog = context.bot.dialogs[i];
                        if(dialog.input.intent && dialog.input.intent == _intent.name) {
                            callback(true, {name: _intent.name, matchRate: matchRate, matchCount: matchCount}, dialog);
                            return;
                        }
                    }

                    callback(true, {name: _intent.name, matchRate: matchRate, matchCount: matchCount}, null);
                } else {
                    callback(false, null, null);
                }
            })

        } else {
            callback(false, null, null);
        }
    })
};
