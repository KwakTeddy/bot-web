var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Intent = mongoose.model('Intent');
var IntentContent = mongoose.model('IntentContent');
var BotIntentFail = mongoose.model('BotIntentFail');
var path = require('path');
var dialog = require(path.resolve('engine/bot/action/common/dialog.js'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var analytics = require(path.resolve('engine/analytics/server/controllers/analytics.server.controller'));
var async = require('async');
var _ = require('lodash');

var intentCheck = {
  name: 'intentDoc',
  typeCheck: global._context.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
  limit: 10,
  matchRate: 0.4,
  matchCount: 4,
  // exclude: ['하다', '이다'],
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

function matchIntent(inRaw, inNLP, context, callback) {
  dialog.executeType(inRaw, inNLP, intentCheck, {}, context, function(inNLP, task, matched) {
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
              callback(true, {_id: _intent._id, name: _intent.name, matchRate: matchRate, matchCount: matchCount}, dialog);
              return;
            }
          }

          callback(true, {_id: _intent._id, name: _intent.name, matchRate: matchRate, matchCount: matchCount}, null);
        } else {
          callback(false, null, null);
        }
      })

    } else {
      callback(false, null, null);
    }
  })
}

exports.matchIntent = matchIntent;


function loadIntents(bot, callback) {
  var Intent = mongoose.model('Intent');

  var query = {};
  if(bot.templateId)
  {
      query.templateId = bot.templateId;
  }
  else
  {
      query.botId = bot.id;
  }

  Intent.find(query).lean().exec(function(err, docs) {
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
      if(i.length > 1)
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

function analyzeIntentFailReq(req, res) {
  analyzeIntentFail(req.params.bId, function() {
    res.end();
  })
}

exports.analyzeIntentFailReq = analyzeIntentFailReq;

function analyzeIntentFail(botId, callback) {
  var failDialogs, bot;
  async.waterfall([
    function(cb) {
      analytics._dialogFailureList(botId, null, null, function(_failDialogs, err) {
        if(_failDialogs) {
          failDialogs = _failDialogs;
          cb(null);
        } else {
          cb(true);
        }
      })
    },

    function(cb) {
      // var _failDialog = [];
      async.eachSeries(failDialogs, function(failDialog, cb2) {

        var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));
        var nlpKo = new nlp({
          stemmer: true,      // (optional default: true)
          normalizer: true,   // (optional default: true)
          spamfilter: true     // (optional default: false)
        });

        nlpKo.tokenize/*ToStrings*/(failDialog._id.dialog, function(err, result) {
          var _nlp = [], _in;
          for (var i = 0; i < result.length; i++) {
            if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
          }
          _in = _nlp.join(' ');

          // _failDialog.push(_in);
          failDialog.input = _in;
          cb2(null);
        });

      }, function(err) {
        // failDialogs = _failDialog;
        cb(null);
      })
    },

    function(cb) {
      BotIntentFail.remove({botId: botId, clear: {$ne: true}}, function(err) {
        cb(null);
      })
    },

    function(cb) {
      if(global._bots[botId] && global._bots[botId].intents) {
        bot = global._bots[botId];

        async.eachSeries(bot.intents, function(intent, cb2) {
          IntentContent.find({botId: botId, intentId: intent}, {}, function(err, docs) {
            var words = {};
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
              if(i.length > 1)
                _words.push({word: i, count: words[i], botId: botId});
            }

            async.eachSeries(failDialogs, function(failDialog, cb3) {
              var fws = failDialog.input.split(' ');

              var bExist = false;
              for(var j in _words) {
                if(bExist) break;
                if(_.includes(fws, _words[j].word)) {
                  bExist = true;
                }
              }

              if(bExist) {
                var bif = new BotIntentFail({
                  botId: botId,
                  intent: intent,
                  userDialog: failDialog.id
                });

                bif.save(function(err4) {
                  cb3(null);
                });
              } else {
                cb3(null);
              }

            }, function(err3) {
              cb2(null);
            });
          })
        }, function(err2) {
          cb(null);
        })

      } else {
        cb(true);
      }
    }
  ], function(err) {
    console.log('사용자 대화 Intent 분석 완료');
    if(callback) callback();
    else return;
  });
}

exports.analyzeIntentFail = analyzeIntentFail;
