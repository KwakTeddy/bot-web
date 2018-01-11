var path = require('path'),
  mongoose = require('mongoose'),
  async = require('async'),
  mongoModule = require(path.resolve('engine/bot/action/common/mongo')),
  UserDialog = mongoose.model('UserDialog');

var speller_en = require('./speller_en');
var speller_ko = require('./speller_ko');

function batchCorrectionDB(callback) {
  var speller = speller_ko;
  var query = {fail: false};

  UserDialog.find(query).lean().sort('+created').exec(function (err, docs) {
    if(docs) {
      async.eachSeries(docs, function (doc, cb) {
        // console.log(doc.dialog);
        speller.train(doc.dialog);
        cb();
      }, function (err) {
        saveWordCorrections(speller.getNWords(), function() {
          console.log('batchCorrectionDB: DONE');
          if(callback) callback();
        })
      });

    } else if (err) {
      console.log(err);
      if(callback) callback();
    }

  });
}

exports.batchCorrectionDB = batchCorrectionDB;

function saveWordCorrections(nWords, callback) {
  var words = [];
  for(var i in nWords) {
    words.push({word: i, count: nWords[i]});
  }

  mongoModule.remove({mongo: {model: 'wordcorrection', query: {}}}, null, function() {
    mongoModule.save({mongo: {model: 'wordcorrection'}, doc: words}, null, function () {
      callback();
    });
  });
}

exports.saveWordCorrections = saveWordCorrections;

function loadWordCorrections(callback) {
  var speller = speller_ko;

  mongoModule.find({mongo: {model: 'wordcorrection', query: {}}}, null, function(_task, _context) {
    var words = _task.doc, nWords = {};
    for(var i in words) {
      nWords[words[i].word] = words[i].count;
    }
    speller.setNWords(nWords);

    if(callback) callback();
  });
}
exports.loadWordCorrections = loadWordCorrections;

function correction(text) {
  var t0 = new Date();
  var tokens = text.split(' ');
  for(var i = 0;i < tokens.length; i++) {
    if(tokens[i].length <= 5) tokens[i] = speller_ko.correct(tokens[i]);
  }

  var t1 = new Date();
  console.log('오타수정: ' + (t1-t0) + 'ms ' +  text + ' > ' + tokens.join(' '));

  return tokens.join(' ');
}

exports.correction = correction;
