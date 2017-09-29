var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('modules/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('modules/bot/action/common/mongo.js'));
var type = require(path.resolve('modules/bot/action/common/type'));

var bot = require(path.resolve('./engine/core/bot')).getBot('private_bot');

var dialogsetKakao = require('./dialogset-kakao');
var dialogsetSmi = require('./dialogset-smi');
var dialogsetKdrama = require('./dialogset-kdrama');

function convertDialogset(original, callback) {
  var dialogType = 'kakao';

  var info = path.parse(original);
  if(info.ext == '.txt') {dialogType = 'kakao';}
  else if(info.ext == '.csv') {dialogType = 'kakao';}
  else if(info.ext == '.smi') {dialogType = 'smi';}

  if(dialogType == 'kakao') dialogsetKakao.convertDialogset(original, callback);
  else if(dialogType == 'smi') dialogsetSmi.convertDialogset(original, callback);
  else if(dialogType == 'kdrama') dialogsetKdrama.convertDialogset(original, callback);
}

exports.convertDialogset = convertDialogset;

function insertDatasetFile(infile, callback) {
  var info = path.parse(infile);

  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);
      var input = "", output = "", input_trans = '', output_trans = '';
      if(array !== null) {
        input = array[1].trim();
        output = array[2].trim();

        var outputs = [];
        var re2 = /\[([^\]]*)\]/g;
        output.replace(re2, function(match, p1) {
          outputs.push(p1);
        });

        processInput(null, input, function(_input, _json) {
          // console.log("자연어 처리>> " + _input);

          var task = {
            doc:{
              dialogset: info.name,
              id: result.toString(),
              tag: [],
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
            cb();
          })
        });

      } else {
        cb();
      }
    } else {
      console.log(infile + ' 완료');
      callback(result);
      // console.log(result);
    }
  });
}

exports.insertDatasetFile = insertDatasetFile;

var insertDatasetTask = {
  action: function (task, context, callback) {
    insertDatasetFile('/Users/com2best/Workspace/bot-web/custom_modules/test/_data/en/chatscript/eliza_what_en_ja_ko.csv', function(result) {
      callback(task, context);
    });
  }
};

bot.setTask('insertDatasetTask', insertDatasetTask);

var nlp = require(path.resolve('modules/bot/engine/nlp/processor'));


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


var insertDatasetDirTask = {
  action: function (task, context, callback) {

    callback(task, context);
  }
};

bot.setTask('insertDatasetDirTask', insertDatasetDirTask);


function processInput(context, inRaw, callback) {
  console.log(inRaw);

  // var inRaw = '장세영에게 010-6316-5683으로 전화해줘.';
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: false     // (optional default: false)
  });

  var sentenceType = [
    'declarative',    // 평서문
    'imperative',     // 명령
    'exclamatory',    // 감탄
    'interrogative'   // 질문
  ];

  var _sentenceType = '';
  var _in = '';
  var _nlpRaw = [];
  var _nlp = [];
  nlpKo.tokenize(inRaw, function(err, result) {
    for(var i in result) {
      // console.log(result[i].text);
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlpRaw.push(result[i]);
      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    for(var i in result) {
      if(result[i].text === '?') _sentenceType = 'interrogative';
      // else if(result[i].text === '!') _sentenceType = 'exclamatory';
    }

    if(_sentenceType === '') _sentenceType = 'declarative';

    // console.log(JSON.stringify(result));
    // console.log(JSON.stringify(_nlpRaw));
    // console.log(_in);
    // console.log(_sentenceType);
    callback(_in, {_nlp: _nlpRaw});
  });
}

var nlptest = {
  action: function (task, context, callback) {

    async.waterfall([
      function(cb) {
        var inRaw = '장세영에게 010-6316-5683으로 전화해줘';
        var nlpKo = new nlp({
          stemmer: true,      // (optional default: true)
          normalizer: true,   // (optional default: true)
          spamfilter: false     // (optional default: false)
        });

        var sentenceType = [
          'declarative',    // 평서문
          'imperative',     // 명령
          'exclamatory',    // 감탄
          'interrogative'   // 질문
        ];

        var _sentenceType = '';
        var _in = '';
        var _nlp = [];
        nlpKo.tokenize(inRaw, function(err, result) {
          for(var i in result) {
            // console.log(result[i].text);
            if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
          }

          _in = _nlp.join(' ');

          for(var i in result) {
            if(result[i].text === '?') _sentenceType = 'interrogative';
            // else if(result[i].text === '!') _sentenceType = 'exclamatory';
          }

          if(_sentenceType === '') _sentenceType = 'declarative';

          console.log(JSON.stringify(result));
          console.log(JSON.stringify(_nlp));
          console.log(_in);
          console.log(_sentenceType);
          cb();
        });
      }
    ], function(err) {
      callback(task, context);
    })

  }
};

bot.setTask('nlptest', nlptest);

