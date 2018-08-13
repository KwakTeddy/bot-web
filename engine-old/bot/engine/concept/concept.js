var path = require('path');
var mongoModule = require(path.resolve('engine2/bot/action/common/mongo'));
var utils = require(path.resolve('engine2/bot/action/common/utils'));
var dialogsetModule = require(path.resolve('engine2/bot/engine/dialogset/dialogset'));
var async = require('async');
var _ = require('lodash');

var commonWords = ['하나요', '경우', '에서', '어디', '무엇', '까지', '뭔가', '언제', '알다', '확인', '얼마나', '얼마', '자도', '누가'];

var concepts = {};
var words = {};
var verbFrames = {};
var adjFrames = {};

exports.removeParent = removeParent;
function removeParent(c) {
  c.parent = undefined;
  if (c.children)
    c.children.forEach(removeParent);
}

var forTree = false;
exports.getConcepts = function(req, res) {
  forTree = true;
  loadConcept(function () {
    var keys = Object.keys(concepts);
    for (var i=0; i < keys.length; ++i) {
      removeParent(concepts[keys[i]]);
    }
    res.json([concepts]);
  });
};

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

          if (forTree) {
            var con = concepts[word.kortermnum];
            if (con) {
              if (!con.words || con.words.length < 10)
              (con.words = con.words || []).push(word);
            }
          }
          else {
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
        }

        cb(null);
      })
    },

    function(cb) {
    if (forTree)
      cb(null);
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
      if (forTree)
        cb(null);
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
            for(var i = 0; i < doc.dialogsets.length; i++) {
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


function loadCustomConcept(bot, callback) {
  async.waterfall([
    function(cb) {
      var conceptnet = {};
      var Concept = mongoose.model('conceptlists');

      Concept.find({}).lean().exec(function(err, docs) {
        for(var i in docs) {
          conceptnet[docs[i].name] = docs[i];
        }

        for(var i in conceptnet) {
          for(var j in conceptnet) {
            if(conceptnet[i].parent && conceptnet[i].parent.toString() == conceptnet[j]._id.toString()) {
              conceptnet[i].parentKey = conceptnet[j].name;
              break;
            }
          }
        }

        for(var key in conceptnet) {
          // conceptnet[key].parentKey = conceptnet[key].parent
          conceptnet[key].parent = conceptnet[conceptnet[key].parentKey];

          if(conceptnet[conceptnet[key].parentKey]) {
            if(conceptnet[conceptnet[key].parentKey].children == undefined) {
              conceptnet[conceptnet[key].parentKey].children = [conceptnet[key]];
            } else {
              conceptnet[conceptnet[key].parentKey].children.push(conceptnet[key]);
            }
          }
        }

        bot.conceptNet = conceptnet;
        cb(null);
      })
    },

    function(cb) {
      var CustomConceptWord = mongoose.model('CustomConceptWord');
      CustomConceptWord.find({bot: bot}).populate('concept').lean().exec(function(err, docs) {
        var conceptWords = {};
        for(var i in docs) {
          conceptWords[docs[i].name] = {name: docs[i].name, concept: docs[i].concept};
        }

        bot.conceptWords = conceptWords;

        cb(null);
      })
    },

    function(cb) {
      var CustomConcept = mongoose.model('CustomConcept');
      CustomConcept.find({bot: bot}).lean().exec(function(err, docs) {
        var concepts = {};
        for(var i in docs) {
          concepts[docs[i].name] = {name: docs[i].name, parent: null};
        }

        if(bot.concepts == undefined) bot.concepts = {};
        bot.concepts = utils.merge(bot.concepts, concepts);

        for(var i in bot.conceptWords) {
          if(bot.conceptWords[i].concept && bot.concepts[bot.conceptWords[i].concept.name]) {
            bot.conceptWords[i].concept = bot.concepts[bot.conceptWords[i].concept.name]
          }

          cb(null);
        }
      })
    }

  ], function(err) {
    if(callback) callback();
  })
}


exports.loadCustomConcept = loadCustomConcept;


function processCustomConcept(inRaw, inNLP, nlp, context, callback) {

  if(context.bot.conceptWords) {
    for(var i in nlp) {
      var item = nlp[i];

      if(context.bot.conceptWords[nlp[i].text]) {
        nlp[i].concept = context.bot.conceptWords[nlp[i].text].concept;

        inNLP = inNLP.replace(nlp[i].text, '~' + nlp[i].concept.name);
      }
    }
  }

  callback(inRaw, inNLP, nlp);
}

exports.processCustomConcept = processCustomConcept;
