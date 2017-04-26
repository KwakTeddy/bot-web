var path = require('path');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var async = require('async');

function entityDictionaryCheck(inRaw, inNLP, inDoc, context, callback) {
  var nlp = context.botUser.nlp;
  var entities = [];

  var Dic = mongoose.model('EntityContent');
  async.eachSeries(nlp, function(word, cb) {
    if(word.pos == 'Noun') {
      Dic.find({name: word.text}).lean().populate('entity').exec(function(err, docs) {
        for(var i in docs) {
          entities.push({name: docs[i].entity.name, word: docs[i].name})
        }

        cb(null);
      })
    } else {
      cb(null);
    }

  }, function(err) {
    inDoc.entities = entities;
    callback(inRaw, inDoc, true);
  });
}

exports.entityDictionaryCheck = entityDictionaryCheck;
