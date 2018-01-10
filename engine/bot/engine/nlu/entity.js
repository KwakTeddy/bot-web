var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var utils = require(path.resolve('engine/bot/action/common/utils'));
var async = require('async');
var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));

function matchDictionaryEntities(inRaw, inNLP, inDoc, context, callback) {
  var _nlp; // var nlp = context.botUser.nlp;
  var entities = {};
  var nouns = [], phrase = '', phraseCnt = 0;

  async.waterfall([
    function(cb) {
      _nlp = context.botUser.nlu.nlp;
      phrase = ''; phraseCnt = 0;

      for(var i in _nlp) {
        if(!(_nlp[i].pos == 'Josa' || _nlp[i].pos == 'Suffix' || _nlp[i].pos == 'Verb' || _nlp[i].pos == 'Adjective')) {
          if(_nlp[i].pos == 'Noun') nouns.push(_nlp[i].text);

          if(phraseCnt > 0 && _nlp[i].offset > _nlp[i-1].offset + _nlp[i-1].length) phrase += ' ';
          phrase += _nlp[i].text;
          phraseCnt ++;
          if(phraseCnt > 1) nouns.push(phrase);
        } else {
          phrase = ''; phraseCnt = 0;
        }
      }

      nouns.sort(function (a, b) {
        return b.length - a.length;
      });

      cb(null);
    },

    function(cb)
    {
        var Dic = mongoose.model('EntityContentSynonym');
        async.eachSeries(nouns, function(word, cb1)
        {
            console.log('워드 : ' + word);

           var query = { name: word };
           if(context.bot.templateId)
               query.templateId = context.bot.templateId;
           else 
               query.botId = context.bot.id;

            Dic.find(query).lean().populate('entityId').populate('contentId').exec(function(err, docs)
            {
              for(var i in docs) {
                if(docs[i].entityId)
                {
                    if(entities[docs[i].entityId.name] == undefined)
                        entities[docs[i].entityId.name] = [];

                    entities[docs[i].entityId.name].push({ word: word, synonym: docs[i].contentId.name });
                }
              }

              cb1(null);
            });
        }, function(err)
        {
            console.log('에러 : ' + err);
            cb(null);
        });
    },

    function(cb) {
      var Dic = mongoose.model('EntityContentSynonym');
      async.eachSeries(nouns, function(word, cb1) {
        Dic.find({botId: null, name: word}).lean().populate('entityId').populate('contentId').exec(function(err, docs) {
          for(var i in docs) {
            if(docs[i].entityId && entities[docs[i].entityId.name] == undefined)
                if(entities[docs[i].entityId.name] == undefined)
                    entities[docs[i].entityId.name] = [];

              entities[docs[i].entityId.name].push({ word: word, synonym: docs[i].contentId.name });
          }

          cb1(null);
        })
      }, function(err) {
        cb(null);
      });
    }

  ], function(err1) {
    callback(inRaw, entities, true);
  });

}

exports.matchDictionaryEntities = matchDictionaryEntities;


function matchEntities(inRaw, inNLP, inDoc, context, callback) {

  async.waterfall([
    // dictionary-based entity
    function(cb) {
      matchDictionaryEntities(inRaw, inNLP, inDoc, context, function(_inRaw, _inDoc, _matched) {
        cb(null);
      })
    },

    // rule-based entity
    function(cb) {

    },

    // custom entity
    function(cb) {

    }

  ], function(err) {

  })
}

exports.matchEntities = matchEntities;


function loadEntities(bot, callback) {
  var Entity = mongoose.model('Entity');

  Entity.find({botId: bot.id}).lean().exec(function(err, docs) {
    bot.entities = docs;
    if(callback) callback();
  });
}

exports.loadEntities = loadEntities;

function loadEntityContents(bot, callback) {
  var Entity = mongoose.model('Entity');

  Entity.find({botId: bot.id}).lean().exec(function(err, docs) {
    bot.entityContents = docs;
    for(var i in docs) {
      docs[i].name = '@' + docs[i].name;
    }

    var EntityContent = mongoose.model('EntityContent');

    EntityContent.find({botId: bot.id}).lean().populate('entityId').exec(function(err, docs) {
      for(var i in docs) {
        docs[i].name = docs[i].name + '@' + (docs[i].entityId ? docs[i].entityId.name : '');
      }
      bot.entityContents = bot.entityContents.concat(docs);

      bot.entities = bot.entityContents;

      if(callback) callback();
    });
  });

}

exports.loadEntityContents = loadEntityContents;
