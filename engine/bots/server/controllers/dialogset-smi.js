var fs = require('fs');
var path = require('path');
var async = require('async');
var fileutil = require(path.resolve('engine/bot/action/common/fileutil'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var utils = require(path.resolve('engine/bot/action/common/utils'));

var baseDir = path.resolve('public/files/');

function convertDialogset(filename, callback) {
  var dir = baseDir;
  var info = path.parse(path.join(dir, filename));
  var csvname = info.name + '.csv';
  var dlgname = info.name + '_dlg.csv';

  convertFile(path.join(dir, filename), path.join(dir, csvname),
    function(result) {
      convertConversation(path.join(dir,csvname), path.join(dir, dlgname),
        function() {
          insertDatasetFile(path.join(dir, dlgname),
            function(result) {
              callback();
            });
        });
    });
}

exports.convertDialogset = convertDialogset;

function convertFile(infile, outfile, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  var lineNum = 0;
  var sentence = "";

  var str = utils.convertEncoding('euc-kr', 'utf-8', fs.readFileSync(infile));
  str = str.replace(/<[^>]*>/g, '').replace(/- /g,'&nbsp;').replace(/(\r\n)+/g, '\r\n');
  // console.log(str);

  var lines = str.split('&nbsp;');
  for(var i in lines) {
    if(lines[i].trim() == '') continue;
    var str = '"' + lines[i].replace(/\r\n/g, ' ').replace(/"/g, "\"\"").trim() + '"\n';
    fs.appendFileSync(outfile, str, 'utf8');
    lineNum++;
  }

  callback();
}

exports.convertFile = convertFile;

// var smiConvertFileTask = {
//   action: function (task, context, callback) {
//     convertFile('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/movie/Love.Actually.2003.720p.BluRay.x264-SiNNERS.smi',
//       '/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/movie/Love.Actually.2003.720p.BluRay.x264-SiNNERS.csv',
//       function(result) {
//         convertConversation('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/movie/Love.Actually.2003.720p.BluRay.x264-SiNNERS.csv',
//           '/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/movie/Love.Actually.2003.720p.BluRay.x264-SiNNERS_dlg.csv',
//           function() {
//             insertDatasetFile('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/movie/Love.Actually.2003.720p.BluRay.x264-SiNNERS_dlg.csv',
//               function(result) {
//                 callback(task, context);
//               });
//           });
//       });
//   }
// };
//
// bot.setTask('smiConvertFileTask', smiConvertFileTask);


function convertDir(dir, callback) {
  var files;

  var fileFilter = function(file) {
    return file.endsWith('.txt');
  };

  try {
    files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }

    files = files.filter(fileFilter);
  } catch(e) {
    console.log(e);
    return;
  }

  console.log(dir + ' 업데이트 시작');

  var info = path.parse(dir);
  var _outfile = path.join(baseDir, info.name + '.csv');
  if(fs.existsSync(_outfile)) fs.truncateSync(_outfile, 0);
  else fs.writeFileSync(_outfile, '',  {flag: 'wx'});

  async.eachSeries(files, function(file, cb) {
    var _file = dir + file;

    convertFile(_file, _outfile, function(result) {
      cb(null);
    });
  }, function(err) {
    console.log(dir + ' 업데이트 완료');
    callback();
  });
}

// convertDir('/Users/com2best/Samples/corpus/ko/드라마대본/1484370545_1_오나의귀신님/', function() {})

function convertConversation(file, outfile, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  var dialogs = [], multiline = 0;
  var datetime = "", character = "", sentence = "";
  fileutil.streamLineSequence(file, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"([^"]*)"/g;
      var array = re.exec(line);

      if(array !== null) {
        // if(dialogs.length > 0 && dialogs[dialogs.length - 1].character == array[2]) {
        //   if(multiline <= 2) {
        //     multiline++;
        //     dialogs[dialogs.length - 1].sentence += ' ' + array[3];
        //   }
        // } else {
          if(dialogs.length > 1) {
            var str =
              '"' + dialogs[dialogs.length - 2].sentence +
              '","' + dialogs[dialogs.length - 1].sentence +
              '"\n';
            fs.appendFileSync(outfile, str, 'utf8');
            multiline = 0;
          }

          dialogs.push({sentence: array[1]});
        // }

        if(dialogs.length > 10) dialogs.shift();
      }

      cb();
    } else {
      callback(result);
      // console.log(result);
    }
  });
}

exports.convertConversation = convertConversation;

function insertDatasetFile(infile, callback) {
  var info = path.parse(infile);

  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      console.log(line);

      var re = /"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);
      var input = "", output = "", input_trans = '', output_trans = '';
      if(array !== null) {
        input = array[1].trim();
        output = array[2].trim();

        console.log(input + ' '+ output);

        // if(/*array[3] == '강지윤'*/ true) {
          var outputs = [];
          var re2 = /\[([^\]]*)\]/g;
          output.replace(re2, function(match, p1) {
            outputs.push(p1);
          });

          processInput(null, input, function(_input, _json) {
            console.log("자연어 처리>> " + _input);

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
              console.log('after mongo:' + _task + ' ' + _context);
              cb();
            })
          });
        // } else {
        //   cb();
        // }

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

var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));

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
