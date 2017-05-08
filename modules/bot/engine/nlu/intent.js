var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Intent = mongoose.model('Intent');
var IntentContent = mongoose.model('IntentContent');
var path = require('path');
var dialog = require(path.resolve('modules/bot/action/common/dialog.js'));
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));

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

    // BotIntent.aggregate([
    //   {$match: {botId: context.bot.id}},
    //   {$group: {_id: '$botId', intents: {$push: '$intent'}}}
    // ], function(err, intents) {
    //   if(intents && intents.length > 0) {
    //     type.mongo.queryStatic = {intentId: {$in: intents[0].intents}};
    //   } else {
    //     type.mongo.queryStatic.intentId = null;
    //   }
    //
    //   callback(task, context);
    //
    // });
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

function matchIntent(inRaw, inNLP, context, callback) {
  dialog.executeType(inRaw, inNLP, intentCheck, {}, context, function(inNLP, task, matched) {
    if(matched) {
      var intentId;
      if(Array.isArray(task.intentDoc) && task.intentDoc.length > 0) {
        intentId = task.intentDoc[0].intentId;
      } else {
        intentId = task.intentDoc.intentId;
      }

      Intent.findOne({_id: intentId}).lean().exec(function(err, _intent) {
        if(_intent) {
          for(var i in context.bot.dialogs) {
            var dialog = context.bot.dialogs[i];
            if(dialog.input.intent && dialog.input.intent == _intent.name) {
              callback(true, {name: _intent.name}, dialog);
              return;
            }
          }

          callback(true, {name: _intent.name}, null);
        } else {
          callback(false, null, null);
        }
      })

      // BotIntent.findOne({botId: context.bot.id, intent: intentId}).lean().exec(function(err, intent) {
      //   if(intent) {
      //     for(var i in context.bot.dialogs) {
      //       var dialog = context.bot.dialogs[i];
      //       if(dialog.id == intent.dialogId) {
      //         callback(true, intent, dialog);
      //         return;
      //       }
      //     }
      //   }
      //   callback(false, null, null);
      // });
    } else {
      callback(false, null, null);
    }
  })
}

exports.matchIntent = matchIntent;


function loadIntents(bot, callback) {
  var Intent = mongoose.model('Intent');

  Intent.find({botId: bot.id}).lean().exec(function(err, docs) {
    bot.intents = docs;
    if(callback) callback();
  });
}

exports.loadIntents = loadIntents;


function saveIntentTopics(botId, callback) {
  var words = {};

  IntentContent.find({botId: botId}, {}, function(err, docs) {
    for(var i in docs) {
      var ws = docs[i].input.split(' ');

      for(var j in ws) {
        var word = ws[j];
        if(words[word] == undefined) words[word] = 1;
        else words[word]++;
      }
    }

    var _words = [];
    for(var i in words) {
      _words.push({word: i, count: words[i], botId: botId});
    }

    mongoModule.remove({mongo: {model: 'intentcontext', query: {botId: botId}}}, null, function() {
      mongoModule.save({mongo: {model: 'intentcontext'}, doc: _words}, null, function () {
        callback();
      });
    });
  });
}

exports.saveIntentTopics = saveIntentTopics;

function loadIntentTopics(bot, callback) {

  mongoModule.find({mongo: {model: 'intentcontext', query: {botId: bot.id}}}, null, function(_task, _context) {
    var words = _task.doc, nWords = {};
    for(var i in words) {
      nWords[words[i].word] = words[i].count;
    }

    bot.intentTopics = nWords;
    if(callback) callback();
  });
}

exports.loadIntentTopics = loadIntentTopics;
