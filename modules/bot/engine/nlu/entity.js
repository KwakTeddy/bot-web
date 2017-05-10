var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var utils = require(path.resolve('modules/bot/action/common/utils'));
var async = require('async');

function matchDictionaryEntities(inRaw, inNLP, inDoc, context, callback) {
  var nlp = context.botUser.nlp;
  var entities = {};

  var Dic = mongoose.model('EntityContent');
  async.eachSeries(nlp, function(word, cb) {
    if(word.pos == 'Noun') {
      Dic.find({name: word.text}).lean().populate('entityId').exec(function(err, docs) {
        for(var i in docs) {
          if(docs[i].entityId)
            entities[docs[i].entityId.name] = docs[i].name;
          // entities.push({name: docs[i].entityId.name, word: docs[i].name})
        }

        cb(null);
      })
    } else {
      cb(null);
    }

  }, function(err) {
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