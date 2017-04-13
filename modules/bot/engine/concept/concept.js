var path = require('path');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var dialogsetModule = require(path.resolve('modules/bot/engine/dialogset/dialogset'));
var async = require('async');
var _ = require('lodash');

var commonWords = ['하나요', '경우', '에서', '어디', '무엇', '까지', '뭔가', '언제', '알다', '확인', '얼마나', '얼마', '자도', '누가'];

var concepts = {};
var words = {};
var verbFrames = {};
var adjFrames = {};

function loadConcept(callback) {
  async.waterfall([
    function(cb) {
      var Concept = mongoModule.getModel('cjk_concept');

      Concept.find({}).lean().exec(function(err, docs) {
        for(var i in docs) {
          concepts[docs[i].kortermnum] = docs[i];
        }

        for(var key in concepts) {
          concepts[key].parentKey = concepts[key].parent
          concepts[key].parent = concepts[concepts[key].parentKey];

          if(concepts[concepts[key].parentKey]) {
            if(concepts[concepts[key].parentKey].children == undefined) {
              concepts[concepts[key].parentKey].children = [concepts[key]];
            } else {
              concepts[concepts[key].parentKey].children.push(concepts[key]);
            }
          }
        }

        cb(null);
      })
    },

    function(cb) {
      var Word = mongoModule.getModel('konoun');

      Word.find({}).lean().exec(function(err, docs) {
        for(var i in docs) {
          var word = docs[i];

          word.concept = concepts[word.kortermnum];
          if(word.concept) {
            if(word.concept.words == undefined) {
              word.concept.words = [word];
            } else {
              word.concept.words.push(word);
            }
          }

          if(words[word.korean] == undefined) {
            words[word.korean] = [word];
          } else {
            words[word.korean].push(word);
          }
        }

        cb(null);
      })
    },

    function(cb) {
      var VerbFrame = mongoModule.getModel('koverbframe');

      VerbFrame.find({}).lean().exec(function(err, docs) {
        for(var i in docs) {
          var verbFrame = docs[i];

          verbFrame.n1Concept = concepts[verbFrame.n1con];
          verbFrame.n2Concept = concepts[verbFrame.n2con];
          verbFrame.n3Concept = concepts[verbFrame.n3con];
          verbFrame.n4Concept = concepts[verbFrame.n4con];

          if(verbFrames[verbFrame.korean] == undefined) {
            verbFrames[verbFrame.korean] = [verbFrame];
          } else {
            verbFrames[verbFrame.korean].push(verbFrame);
          }
        }

        cb(null);
      });
    },

    function(cb) {
      var AdjFrame = mongoModule.getModel('koadjframe');

      AdjFrame.find({}).lean().exec(function(err, docs) {
        for(var i in docs) {
          var adjFrame = docs[i];

          adjFrame.n1Concept = concepts[adjFrame.n1con];
          adjFrame.n2Concept = concepts[adjFrame.n2con];
          adjFrame.n3Concept = concepts[adjFrame.n3con];
          adjFrame.n4Concept = concepts[adjFrame.n4con];

          if(adjFrames[adjFrame.korean] == undefined) {
            adjFrames[adjFrame.korean] = [adjFrame];
          } else {
            adjFrames[adjFrame.korean].push(adjFrame);
          }
        }

        cb(null);
      });
    }

  ], function(err) {
    if(callback) callback();
  })
}

exports.loadConcept = loadConcept;

function processConcept(inRaw, inNLP, nlp, callback) {

  var verbs = [], adjs = [], nouns = [];
  for(var i in nlp) {
    var item = nlp[i];

    if(item.pos == 'Verb') verbs.push(item);
    else if(item.pos == 'Adjective') adjs.push(item);
    else if(item.pos == 'Noun') nouns.push(item);
  }

  for(var i = verbs.length - 1; i > 0; i--) {
    var vfs = verbFrames[verbs[i].text];

    for(var j in vfs) {
      for(var k in nouns) {
        if(_.includes(vfs[j].n1Concept.words, nouns[k].text)) nouns[k].concept = vfs[j].n1Concept;
        else if(_.includes(vfs[j].n2Concept.words, nouns[k].text)) nouns[k].concept = vfs[j].n2Concept;
        else if(_.includes(vfs[j].n3Concept.words, nouns[k].text)) nouns[k].concept = vfs[j].n3Concept;
        else if(_.includes(vfs[j].n1Concept.words, nouns[k].text)) nouns[k].concept = vfs[j].n4Concept;
      }
    }
  }

  for(var i = adjs.length - 1; i > 0; i--) {
    var afs = adjFrames[adjs[i].text];

    for(var j in afs) {
      for(var k in nouns) {
        if(_.includes(afs[j].n1Concept.words, nouns[k].text)) nouns[k].concept = afs[j].n1Concept;
        else if(_.includes(afs[j].n2Concept.words, nouns[k].text)) nouns[k].concept = afs[j].n2Concept;
        else if(_.includes(afs[j].n3Concept.words, nouns[k].text)) nouns[k].concept = afs[j].n3Concept;
        else if(_.includes(afs[j].n1Concept.words, nouns[k].text)) nouns[k].concept = afs[j].n4Concept;
      }
    }
  }

  for(var i in nouns) {
    var ns = words[nouns[i].text];

    if(ns.length > 0) {
      nouns[i].concepts = [];
      for(var j in ns) {
        nouns[i].concepts.push(ns[j].concept);
      }
    }
  }

  var _in = '';
  for(var i in nlp) {
    if(i != 0) _in += ' ';
    if(nlp[i].concepts && nlp[i].concepts.length > 0) {
      _in += '|';
      for(var j in nlp[i].concepts) {
        _in += nlp[i].concepts[j].kortermnum + '|';
      }
    }
    else _in += nlp[i].text;
  }

  callback(inRaw, _in, nlp);
}


exports.processConcept = processConcept;

var mongoose = require('mongoose');
function batchConcept(botId, callback) {
  var wordCount = {};

  var wordCountFunc = function(input) {
    if(!input.startsWith(':')) {
      var words = input.split(' ');
      for(var i in words) {
        if(words[i].length > 1) wordCount[words[i]] = wordCount.hasOwnProperty(words[i]) ? wordCount[words[i]] + 1 : 1;
      }
    }
  };

  var wordCountNLPFunc = function(words) {
    for(var i in words) {
      if(words[i].text.length > 1 && (words[i].pos == 'Noun'/* || words[i].pos == 'Verb' || words[i].pos == 'Adjective'*/))
        wordCount[words[i].text] = wordCount.hasOwnProperty(words[i].text) ? wordCount[words[i].text] + 1 : 1;
    }
  };

  var bot;
  async.waterfall([
    function(cb) {
      var query;

      var Bot = mongoose.model('Bot');
      Bot.findOne({id: botId}).exec(function(err, doc) {
        if(doc) {
          bot = doc;

          if(doc.dialogsets && doc.dialogsets.length > 0) {
            query = {$or: []};
            for(var i in doc.dialogsets) {
              query.$or.push({dialogset: doc.dialogsets[i]})
            }
          }
        }

        if(query) {
          var DialogsetDialog = mongoose.model('DialogsetDialog');
          DialogsetDialog.find(query).lean().exec(function(err, docs) {

            async.eachSeries(docs, function(doc, cb2) {
              if(Array.isArray(doc.input)) {
                // for(var j in doc.input) {
                //   wordCountFunc(doc.input[j]);
                // }

                async.eachSeries(doc.input, function(input, cb3) {
                  dialogsetModule.processInput(null, input, function(_in, result) {
                    wordCountNLPFunc(result._nlp);
                    cb3(null);
                  })
                }, function(err3) {
                  cb2(null);
                })

              } else {
                // wordCountFunc(doc.input);

                dialogsetModule.processInput(null, doc.input, function(_in, result) {
                  wordCountNLPFunc(result._nlp);
                  cb2(null);
                })
              }
            }, function(err2) {
              cb(null);
            });
            
          })

        } else {
          cb(null);
        }
      });
    },

    function(cb) {
      var query = {botId: botId, fail: false, inOut: true};
      var UserDialog = mongoose.model('UserDialog');

      UserDialog.find(query).lean().sort('+created').exec(function (err, docs) {
        for(var i in docs) {
          wordCountFunc(docs[i].dialog);
        }
        cb(null);
      });
    }

  ], function(err) {
    var wordArray = [];
    for(var i in wordCount) {
      wordArray.push({word: i, count: wordCount[i]});
    }

    wordArray.sort(function(a, b) {
      if(b.count > a.count) return 1;
      else if(b.count < a.count) return -1;
      else return 0;
    });

    bot.topicKeywords = [];

    for(var i in wordArray) {
      var w = wordArray[i];

      if(w.count > 10 && !_.includes(commonWords, w.word)) {
          bot.topicKeywords.push(w.word);
        // console.log(w.word + ' ' + w.count);
      }
    }

    console.log('topics: ' + bot.topicKeywords.join(', '));

    // for(var i in wordCount) {
    //   if(wordCount[i] > 5) console.log(i + ':' + wordCount[i]);
    // }

    bot.save(function(err, num) {
      if(callback) callback(callback);
    })
  });
}

exports.batchConcept = batchConcept;
