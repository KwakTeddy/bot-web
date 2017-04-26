var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BotIntent = mongoose.model('BotIntent');
var path = require('path');
var dialog = require(path.resolve('modules/bot/action/common/dialog.js'));

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
    BotIntent.aggregate([
      {$match: {botId: context.bot.name}},
      {$group: {_id: '$botId', intents: {$push: '$intent'}}}
    ], function(err, intents) {
      if(intents) {
        type.mongo.queryStatic = {intentId: {$in: intents[0].intents}};
      } else {
        type.mongo.queryStatic.intentId = null;
      }

      callback(task, context);

    });
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
      if(Array.isArray(task.intentDoc)) {
        intentId = task.intentDoc[0].intentId;
      } else {
        intentId = task.intentDoc.intentId;
      }

      BotIntent.findOne({botId: context.bot.name, intent: intentId}).lean().exec(function(err, intent) {
        if(intent) {
          for(var i in context.bot.dialogs) {
            var dialog = context.bot.dialogs[i];
            if(dialog.id == intent.dialogId) {
              callback(true, dialog);
              return;
            }
          }
        }
        callback(false, null);
      });
    } else {
      callback(false, null);
    }
  })
}

exports.matchIntent = matchIntent;

// var IntentSchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill name',
//     trim: true
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   }
// });
//
// mongoose.model('Intent', IntentSchema);
//
// var IntentUtteranceSchema = new Schema({
//   utterance: {
//     type: String,
//     default: '',
//     required: 'Please fill utterance name',
//     trim: true
//   },
//   input: {
//     type: String
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   },
//   intent: {
//     type: Schema.ObjectId,
//     ref: 'Intent'
//   }
// });
//
// mongoose.model('IntentUtterance', IntentUtteranceSchema);
//
