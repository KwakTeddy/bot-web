var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var utils = require(path.resolve('modules/bot/action/common/utils'));
var async = require('async');
var nlp = require(path.resolve('modules/bot/engine/nlp/processor'));

function matchDictionaryEntities(inRaw, inNLP, inDoc, context, callback) {
  var _nlp; // var nlp = context.botUser.nlp;
  var entities = {};
  var nouns = [], phrase = '', phraseCnt = 0;

  async.waterfall([
    function(cb) {
      var nlpKo = new nlp({
        stemmer: true,      // (optional default: true)
        normalizer: true,   // (optional default: true)
        spamfilter: true     // (optional default: false)
      });

      nlpKo.tokenize/*ToStrings*/(inRaw, function(err, result) {
        _nlp = result;
        cb(null);
      })
    },

    function(cb) {
      phrase = ''; phraseCnt = 0;
      for(var i in _nlp) {
        if(!(_nlp[i].pos == 'Josa' || _nlp[i].pos == 'Verb' || _nlp[i].pos == 'Adjective')) {
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

    function(cb) {
      var Dic = mongoose.model('EntityContent');
      async.eachSeries(nouns, function(word, cb1) {
        Dic.find({botId: context.bot.id, name: word}).lean().populate('entityId').exec(function(err, docs) {
          for(var i in docs) {
            if(docs[i].entityId && entities[docs[i].entityId.name] == undefined)
              entities[docs[i].entityId.name] = docs[i].name;
          }

          cb1(null);
        })
      }, function(err) {
        cb(null);
      });
    },

    function(cb) {
      var Dic = mongoose.model('EntityContent');
      async.eachSeries(nouns, function(word, cb1) {
        Dic.find({botId: null, name: word}).lean().populate('entityId').exec(function(err, docs) {
          for(var i in docs) {
            if(docs[i].entityId && entities[docs[i].entityId.name] == undefined)
              entities[docs[i].entityId.name] = docs[i].name;
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