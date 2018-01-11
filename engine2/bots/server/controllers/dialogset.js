var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('engine2/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('engine2/bot/action/common/mongo.js'));
var type = require(path.resolve('engine2/bot/action/common/type'));

var bot = require(path.resolve('./engine2/bot.js')).getBot('private_bot');

var dialogsetKakao = require('./dialogset-kakao');
var dialogsetSmi = require('./dialogset-smi');
var dialogsetKdrama = require('./dialogset-kdrama');

function convertDialogset(original, callback) {
  var dialogType = 'kakao';

  var info = path.parse(original);
  if(info.ext == '.txt') {dialogType = 'kakao';}
  else if(info.ext == '.csv') {dialogType = 'kakao';}
  else if(info.ext == '.smi') {dialogType = 'smi';}

  var dir = path.resolve('public/files/');
  insertDatasetFile(path.join(dir, original), function() {
    callback();
  });

  // analyzeKnowledge('quibble', callback);

  // nlpTest(path.join(dir, original), callback);

  // if(dialogType == 'kakao') dialogsetKakao.convertDialogset(original, callback);
  // else if(dialogType == 'smi') dialogsetSmi.convertDialogset(original, callback);
  // else if(dialogType == 'kdrama') dialogsetKdrama.convertDialogset(original, callback);
}

exports.convertDialogset = convertDialogset;

function insertDatasetFile(infile, callback) {
  var info = path.parse(infile);
  var input, output;
  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);

      if(array == null) {
        var re2 = /([^,]*),([^,]*)/g;
        array = re2.exec(line);
      }

      if(array !== null) {
        if(array[1] && array[1] != '') input = array[1].trim();
        if(array[2] && array[2] != '') output = array[2].trim();

        // if(array[2] && array[2] != '') input = array[2].trim();
        // if(array[4] && array[4] != '') output = array[4].trim();

        var outputs = [];
        // var re2 = /\[([^\]]*)\]/g;
        // output.replace(re2, function(match, p1) {
        //   outputs.push(p1);
        // });

        processInput(null, input, function(_input, _json) {
          console.log(result + ">> " + input + ' || ' + _input + ' || ' + (outputs.length > 0 ? outputs: output));

          var task = {
            doc:{
              dialogset: info.name,
              id: result.toString(),
              tag: [],
              inputRaw: input,
              input: _input,
              output: (outputs.length > 0 ? outputs: output)
              // output: output
            },
            mongo: {
              model: 'DialogsetDialog',
              query: {dialogset: '', id: ''},
              options: {upsert: true}
            }
          };

          mongoModule.update(task, null, function(_task, _context) {
            setTimeout(function(){cb();}, 10);
            // cb();
          })
        });

      } else {
        setTimeout(function(){cb();}, 10);
        // cb();
      }
    } else {
      console.log(infile + ' 완료');
      callback(result);
      // console.log(result);
    }
  });
}

exports.insertDatasetFile = insertDatasetFile;


function analyzeKnowledge(dialogset, callback) {
  var model = mongoModule.getModel('DialogsetDialog');

  model.find({dialogset: dialogset}, function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
      processInput(null, doc._doc.input, function(_input, _json) {
        console.log(">> " + doc._doc.input);

        var nlp = _json._nlp;
        var node1, node2, link;
        for(var i = 0; i < nlp.length; i++) {
          if(nlp[i].pos == 'Noun') {
            node1 = nlp[i].text;
            break;
          }
        }

        if(node1) {
          for(var i = nlp.length -1 ; i >= 0; i--) {
            if(node2 && link) break;
            if(nlp[i].pos == 'Noun' && nlp[i].text != node1) {
              node2 = nlp[i].text;
            } else if(nlp[i].pos == 'Verb' || nlp[i].pos == 'Adjective') {
              link = nlp[i].text;
            }
          }
        }

        console.log(">> " + node1 + ', ' + node2 + ' ' + link);

        if(node1 && node2 && link) {
          var task = {
            doc:{
              botUser: null,
              node1: node1,
              node2: node2,
              link: link
            },

            mongo: {
              model: 'FactLink',
              query: {node1: '', node2: '', link: ''},
              options: {upsert: true}
            }
          };

          mongoModule.update(task, null, function(_task, _context) {
            cb();
          })
        } else {
          cb();
        }

      })
    }, function(err) {
      callback();
    });
  });
}

exports.analyzeKnowledge = analyzeKnowledge;


// var insertDatasetTask = {
//   action: function (task, context, callback) {
//     insertDatasetFile('/Users/com2best/Workspace/bot-web/custom_modules/test/_data/en/chatscript/eliza_what_en_ja_ko.csv', function(result) {
//       callback(task, context);
//     });
//   }
// };
//
// bot.setTask('insertDatasetTask', insertDatasetTask);

var nlp = require(path.resolve('engine2/bot/engine/nlp/processor'));


// translateFile('/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_en.csv',
//   '/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_ko.csv',
//   'en', 'ko',
//   function(result) {});

function insertDatasetDir(dir, from, to, callback) {
  var files;

  var transFilter = function(file) {
    return file.endsWith(from +'.csv');
  };

  try {
    files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }

    files = files.filter(transFilter);
  } catch(e) {
    console.log(e);
    return;
  }

  console.log(dir + ' 업데이트 시작');

  async.each(files, function(file, cb) {
    var _file = dir + file;
    var info = path.parse(_file);
    var _outfile = path.join(info.dir, info.name + '_' + to + '.csv');

    insertDatasetFile(_file, _outfile, from, to, function(result) {
      cb(null);
    });
  }, function(err) {
    console.log(dir + ' 업데이트 완료');
    callback();
  });
}

exports.insertDatasetDir = insertDatasetDir;


// var insertDatasetDirTask = {
//   action: function (task, context, callback) {
//
//     callback(task, context);
//   }
// };
//
// bot.setTask('insertDatasetDirTask', insertDatasetDirTask);


function processInput(context, inRaw, callback) {
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });

  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo.tokenize(inRaw, function(err, result) {
    for(var i in result) {
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    callback(_in, {_nlp: _nlpRaw});
  });
}

exports.processInput = processInput;

// var nlptest = {
//   action: function (task, context, callback) {
//
//     async.waterfall([
//       function(cb) {
//         var inRaw = '장세영에게 010-6316-5683으로 전화해줘';
//         var nlpKo = new nlp({
//           stemmer: true,      // (optional default: true)
//           normalizer: true,   // (optional default: true)
//           spamfilter: false     // (optional default: false)
//         });
//
//         var sentenceType = [
//           'declarative',    // 평서문
//           'imperative',     // 명령
//           'exclamatory',    // 감탄
//           'interrogative'   // 질문
//         ];
//
//         var _sentenceType = '';
//         var _in = '';
//         var _nlp = [];
//         nlpKo.tokenize(inRaw, function(err, result) {
//           for(var i in result) {
//             // console.log(result[i].text);
//             if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
//           }
//
//           _in = _nlp.join(' ');
//
//           for(var i in result) {
//             if(result[i].text === '?') _sentenceType = 'interrogative';
//             // else if(result[i].text === '!') _sentenceType = 'exclamatory';
//           }
//
//           if(_sentenceType === '') _sentenceType = 'declarative';
//
//           console.log(JSON.stringify(result));
//           console.log(JSON.stringify(_nlp));
//           console.log(_in);
//           console.log(_sentenceType);
//           cb();
//         });
//       }
//     ], function(err) {
//       callback(task, context);
//     })
//
//   }
// };
//
// bot.setTask('nlptest', nlptest);


function nlpTest(callback) {
  // var model = mongoModule.getModel('DialogsetDialog');
  //
  // model.find({}, function(err, docs) {
  //   if(docs != null) {
  //     async.eachSeries(docs, function(doc, cb) {
  //       multiNLP(doc._doc.inputRaw, function(result, result1) {
  //         var info = analyzeSentence(doc._doc.inputRaw, result, result1);
  //         // makeTone(doc._doc.inputRaw, result, result1, info, 0);
  //         console.log('');
  //         cb();
  //       });
  //     })
  //   }
  // });

  async.eachSeries(samples, function(doc, cb) {
    multiNLP(doc, function(result, result1) {
      var info = analyzeSentence(doc, result, result1);
      makeTone(doc, result, result1, info, '합쇼체');
      console.log('');
      cb();
    });
  });

  // var info = path.parse(infile);
  // fileutil.streamLineSequence(infile, function(result, line, cb) {
  //   if(isNaN(result) == false) {
  //     var inRaw = line;
  //     console.log(inRaw);
  //
  //     var nlpKo1 = new nlp({
  //       stemmer: false,      // (optional default: true)
  //       normalizer: true,   // (optional default: true)
  //       spamfilter: false     // (optional default: false)
  //     });
  //
  //     var _in = '';
  //     var _nlpRaw = [];
  //     var _nlp = [];
  //     nlpKo1.tokenize(inRaw, function(err, result) {
  //       for(var i in result) {
  //         if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
  //         /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
  //       }
  //
  //       _in = _nlp.join(' ');
  //
  //       console.log(_in);
  //       // console.log(JSON.stringify(result));
  //
  //       var nlpKo = new nlp({
  //         stemmer: true,      // (optional default: true)
  //         normalizer: true,   // (optional default: true)
  //         spamfilter: false     // (optional default: false)
  //       });
  //
  //       _in = '';
  //       _nlpRaw = [];
  //       _nlp = [];
  //       nlpKo.tokenize(inRaw, function(err, result1) {
  //         for (var i in result1) {
  //           if (result1[i].pos !== 'Josa' && result1[i].pos !== 'Punctuation') _nlpRaw.push(result1[i]);
  //           /*if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result1[i].text);
  //         }
  //
  //         _in = _nlp.join(' ');
  //
  //         console.log(_in);
  //         // console.log(JSON.stringify(result1));
  //
  //         var info = analyzeSentence(line, result, result1);
  //         makeTone(line, result, result1, info, 0);
  //
  //         console.log('');
  //
  //         cb();
  //       });
  //     });
  //
  //   } else {
  //     console.log(infile + ' 완료');
  //     callback(result);
  //     // console.log(result);
  //   }
  // });
}

exports.nlpTest = nlpTest;

function multiNLP(inRaw, callback) {
  console.log(inRaw);

  var nlpKo1 = new nlp({
    stemmer: false,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });

  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo1.tokenize(inRaw, function(err, result) {
    for(var i in result) {
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      /*if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    // console.log(_in);
    // console.log(JSON.stringify(result));

    var nlpKo = new nlp({
      stemmer: true,      // (optional default: true)
      normalizer: true,   // (optional default: true)
      spamfilter: false     // (optional default: false)
    });

    _in = '';
    _nlpRaw = [];
    _nlp = [];
    nlpKo.tokenize(inRaw, function(err, result1) {
      for (var i in result1) {
        if (result1[i].pos !== 'Josa' && result1[i].pos !== 'Punctuation') _nlpRaw.push(result1[i]);
        /*if (result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')*/ _nlp.push(result1[i].text);
      }

      _in = _nlp.join(' ');

      console.log(_in);
      // console.log(JSON.stringify(result1));

      callback(result, result1);
    });
  });
}


function analyzeSentence(text, result1, result2) {
  var sentenceType = -1;            // 0. 평서문 1. 의문문 2. 명령 3. 청유 4. 감탄
  var toneType = undefined;         // 합쇼체 하오체 하게체 해라체 해요체 해체
  var verbType = undefined;         // 0. 2형식 1. 3형식
  var tense = undefined;            // 시제
  var aspect = undefined;           // 완료형
  var verbPos = undefined;          // 동사 위치
  var verbEomi = undefined;         // 동사 어미
  var verbToken = undefined;        // 어미 변환이 필요한 동사 token


  for (var i = result2.length - 1; i >= 0; i--) {
    if(sentenceType != -1 && verbToken != undefined) break;

    var token = result2[i];
    var textToken = '';

    if(token.pos == 'Verb' || token.pos == 'Adjective' || token.pos == 'Josa') {
      var textToken = text.substring(token.offset);
      var _offset = textToken.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
      if(_offset != -1) textToken = textToken.substring(0, _offset);
    }

    if (token.pos == 'Punctuation' && token.text == '?') {
      sentenceType = 1;
    } else if(token.text == '누구' || token.text == '언제' || token.text == '어디서' ||
      token.text == '어떻게' ||token.text == '왜' ||token.text == '얼마나') {
      sentenceType = 1;
    }

    if(textToken.endsWith('야') || textToken.endsWith('어') || textToken.endsWith('지') || textToken.endsWith('니') || textToken.endsWith('나')) {
      verbToken = token;
      if(sentenceType != 1) sentenceType = 0;
      toneType = '해체';
    } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
      verbToken = token;
      sentenceType = 2;
      toneType = '해체';
    // } else if(textToken.endsWith('해') || textToken.endsWith('하지')) {
    //   verbToken = token;
    //   sentenceType = 3;
    //   toneType = '해체';

    } else if(textToken.endsWith('나요') || textToken.endsWith('해요') || textToken.endsWith('예요')) {
      verbToken = token;
      if(sentenceType != 1) sentenceType = 0;
      toneType = '해요체';
    } else if(textToken.endsWith('세요') || textToken.endsWith('셔요') ||textToken.endsWith('해요') ||
      textToken.endsWith('주세요')) {
      verbToken = token;
      sentenceType = 2;
      toneType = '해요체';
    // } else if(textToken.endsWith('하세요') ||textToken.endsWith('하셔요') ||textToken.endsWith('해요')) {
    //   verbToken = token;
    //   sentenceType = 3;
    //   toneType = '해요체';

    } else if(textToken.endsWith('십니다') || textToken.endsWith('니다') || textToken.endsWith('니다') ||
      textToken.endsWith('니다') || textToken.endsWith('소서') ||
      textToken.endsWith('나이다') || textToken.endsWith('올시다')) {
      verbToken = token;
      sentenceType = 0;
      toneType = '합쇼체';

    } else if(textToken.endsWith('니까')) {
      verbToken = token;
      sentenceType = 1;
      toneType = '합쇼체';
    } else if(textToken.endsWith('십시오')) {
      verbToken = token;
      sentenceType = 2;
      toneType = '합쇼체';
    } else if(textToken.endsWith('십시다') || textToken.endsWith('시지요')) {
      verbToken = token;
      sentenceType = 3;
      toneType = '합쇼체';
    // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오') ||
    //   // textToken.endsWith('소') || textToken.endsWith('오') ||
    //   textToken.endsWith('리다') || textToken.endsWith('디다')) {
    //   verbToken = token;
    //   sentenceType = 0;
    //   toneType = '하오체';
    // } else if(textToken.endsWith('하시오') || textToken.endsWith('하오') || textToken.endsWith('이오')
    //   // textToken.endsWith('소') || textToken.endsWith('오')
    //   ) {
    //   verbToken = token;
    //   sentenceType = 1;
    //   toneType = '하오체';
    } else if(textToken.endsWith('시오') || textToken.endsWith('하오') || textToken.endsWith('하구려')
      // textToken.endsWith('시오')
      ) {
      verbToken = token;
      sentenceType = 2;
      toneType = '하오체';
    } else if(textToken.endsWith('시다')) {
      verbToken = token;
      sentenceType = 3;
      toneType = '하오체';
    } else if(textToken.endsWith('하네') || textToken.endsWith('이네')) {
      verbToken = token;
      sentenceType = 0;
      toneType = '하게체';
    } else if(textToken.endsWith('하는가') || textToken.endsWith('하나') || textToken.endsWith('이나')) {
      verbToken = token;
      sentenceType = 1;
      toneType = '하게체';
    } else if(textToken.endsWith('하게') || textToken.endsWith('하구려')) {
      verbToken = token;
      sentenceType = 2;
      toneType = '하게체';
    } else if(textToken.endsWith('하세')) {
      verbToken = token;
      sentenceType = 3;
      toneType = '하게체';
    } else if(textToken.endsWith('하다') || textToken.endsWith('한다') || textToken.endsWith('이다')) {
      verbToken = token;
      sentenceType = 0;
      toneType = '해라체';
    } else if(textToken.endsWith('하느냐') || textToken.endsWith('하냐') || textToken.endsWith('하니') ||
      textToken.endsWith('이냐') || textToken.endsWith('이니')) {
      verbToken = token;
      sentenceType = 1;
      toneType = '해라체';
    } else if(textToken.endsWith('해라') || textToken.endsWith('하려무나') || textToken.endsWith('하렴')) {
      verbToken = token;
      sentenceType = 2;
      toneType = '해라체';
    } else if(textToken.endsWith('하자')) {
      verbToken = token;
      sentenceType = 3;
      toneType = '해라체';
    } else if(token.pos == 'Verb' || token.pos == 'Adjective' ||
      token.text == '하다' || token.text == '이다' || token.text == '있다' ||
      token.text == '해주다' || token.text == '줄다') {
      verbToken = token;
    }
  }


  if(verbToken) {
    var _text = text.substring(verbToken.offset);
    var _offset = _text.search(/[\s0-9!"#$%&'()*+,./:;<=>?@\^_`{|}~-]/);
    if(_offset != -1) _text = _text.substring(0, _offset);

    var _pos = -1;
    for(var j = 0; j < Math.min(verbToken.text.length, _text.length); j++) {
      if(verbToken.text.charAt(j) != _text.charAt(j)) {
        _pos = j;
        break;
      }
    }

    if(_pos != -1) verbEomi = _text.substring(_pos);
    else verbEomi = '';

    if(verbToken.text =='이다' ||
      (verbToken.text == '야' && verbToken.pos == 'Josa') ||
      (verbToken.text == '예요' && verbToken.pos == 'Josa')) {

      verbType = 0;
      verbPos = verbToken.offset;

    } else if(verbToken.text == '해주다' ||
        (verbToken.text == '해' && verbToken.pos == 'Josa') ||
        (verbToken.text == '줄다' && verbToken.pos == 'Verb')) {

      verbType = 1;
      verbPos = verbToken.offset + verbToken.text.indexOf('해');

    } else if(verbToken.text.endsWith('하다')) {
      verbType = 1;
      verbPos = verbToken.offset + verbToken.text.indexOf('하다');
    }
  }

  var info = {sentenceType: sentenceType, toneType: toneType, verbType: verbType, tense: tense, aspect: aspect,
    verbPos: verbPos, verbEomi: verbEomi, verbToken: verbToken};
  console.log(JSON.stringify(info));

  return info;
}


function makeTone(text, result1, result2, info, toneType) {
  var eomi = '';

  if(toneType == '합쇼체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '입니다';
      else if(info.sentenceType == 1) eomi = '입니까';
      else if(info.sentenceType == 2) eomi = '입시오';
      else if(info.sentenceType == 3) eomi = '입시다';
      else eomi = '입니다';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '합니다';
      else if(info.sentenceType == 1) eomi = '합니까';
      else if(info.sentenceType == 2) eomi = '하십시오';
      else if(info.sentenceType == 3) eomi = '하십시다';
      else eomi = '합니다';
    }
  } else if(toneType == '하오체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이오';
      else if(info.sentenceType == 1) eomi = '이오';
      else if(info.sentenceType == 2) eomi = '입시오';
      else if(info.sentenceType == 3) eomi = '입시다';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '하오';
      else if(info.sentenceType == 1) eomi = '하오';
      else if(info.sentenceType == 2) eomi = '하오';
      else if(info.sentenceType == 3) eomi = '합시다';
      else eomi = '하오';
    }
  } else if(toneType == '하게체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이네';
      else if(info.sentenceType == 1) eomi = '인가';
      else if(info.sentenceType == 2) eomi = '이게';
      else if(info.sentenceType == 3) eomi = '이세';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '하네';
      else if(info.sentenceType == 1) eomi = '하는가';
      else if(info.sentenceType == 2) eomi = '하게';
      else if(info.sentenceType == 3) eomi = '하세';
      else eomi = '하네';
    }
  } else if(toneType == '해라체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '이다';
      else if(info.sentenceType == 1) eomi = '이나';
      else if(info.sentenceType == 2) eomi = '이라';
      else if(info.sentenceType == 3) eomi = '이자';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '한다';
      else if(info.sentenceType == 1) eomi = '하니';
      else if(info.sentenceType == 2) eomi = '해라';
      else if(info.sentenceType == 3) eomi = '하자';
      else eomi = '한다';
    }
  } else if(toneType == '해요체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '예요';
      else if(info.sentenceType == 1) eomi = '인가요';
      else if(info.sentenceType == 2) eomi = '이요';
      else if(info.sentenceType == 3) eomi = '이요';
      else eomi = '예요';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '해요';
      else if(info.sentenceType == 1) eomi = '하나요';
      else if(info.sentenceType == 2) eomi = '해주세요';
      else if(info.sentenceType == 3) eomi = '해주세요';
      else eomi = '해요';
    }
  } else if(toneType == '해체') {
    if(info.verbType == 0) {
      if(info.sentenceType == 0) eomi = '야';
      else if(info.sentenceType == 1) eomi = '야';
      else if(info.sentenceType == 2) eomi = '야';
      else if(info.sentenceType == 3) eomi = '야';
      else eomi = '이오';
    } else if(info.verbType == 1) {
      if(info.sentenceType == 0) eomi = '해';
      else if(info.sentenceType == 1) eomi = '해';
      else if(info.sentenceType == 2) eomi = '해';
      else if(info.sentenceType == 3) eomi = '해';
      else eomi = '하오';
    }
  }

  if(info.verbPos != undefined) {
    var _text = text.replace(text.substring(info.verbPos, text.length), eomi);
    console.log(_text);
  }

}

function KorToJaso(str) {
  var cCho  = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ],
    cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ],
    cho, jung, jong;

  var cnt = str.length,
    chars = [],
    cCode;

  for (var i = 0; i < cnt; i++) {
    cCode = str.charCodeAt(i);

    if (cCode == 32) { continue; }

    // 한글이 아닌 경우
    if (cCode < 0xAC00 || cCode > 0xD7A3) {
      chars.push(str.charAt(i));
      continue;
    }

    cCode  = str.charCodeAt(i) - 0xAC00;

    jong = cCode % 28; // 종성
    jung = ((cCode - jong) / 28 ) % 21 // 중성
    cho  = (((cCode - jong) / 28 ) - jung ) / 21 // 초성

    chars.push(cCho[cho], cJung[jung]);
    if (cJong[jong] !== '') { chars.push(cJong[jong]); }
  }

  return chars;
}

var samples = [
'한국어를 처리하는 예시입니다.', 
'한국어를 처리하는 예시이다.', 
'한국어를 처리하는 예시야.', 
'한국어를 처리하는 예시예요.', 
'한국어를 처리하는 것을 좋아합니다.', 
'한국어를 처리하는 것을 좋아하다.', 
'한국어를 처리하는 것을 좋아해.', 
'한국어를 처리하는 것을 좋아해요.', 
'한국어를 처리하는 것을 좋아하나요?', 
'한국어를 처리 해줄래.', 
'한국어를 처리해.', 
'한국어를 처리해 주세요.', 
'한국어를 처리해 주십시오.', 
'장모님 있어?', 
'도착해서 나한테 전화 해줘.', 
'시간 날때 가보자.', 
'내일 대학원 갔다 오는 거야?', 
'먼데 어떻게 가?', 
'응 뚱 빨리 코자', 
'갑자기?', 
'유치원 체육대회 토요일이야 일요일이야?', 
'주말에 놀러오라구 했는데 괜찮지?', 
'일단해.', 
'왔을때 고쳐.', 
'지윤이 몇호', 
'아가 토니스트래치 오늘 왔나?', 
'장모님 있어?', 
'수정해 달라구 해', 
'응 지윤이가 고민해서 판단해', 
'지윤 뚱이 사봐', 
'누구랑 할꺼야?', 
'언제 할꺼야?', 
'어디서 할꺼야?', 
'어떻게 할꺼야?', 
'왜 할꺼야?', 
'얼마나 할꺼야?'
];


