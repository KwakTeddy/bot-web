var fs = require('fs');
var path = require('path');
var async = require('async');
var fileutil = require(path.resolve('./engine-old/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('./engine-old/bot/action/common/mongo.js'));
var dialogsetModule = require('./dialogset-uploader');

// var bot = require(path.resolve('./engine2/bot.js')).getBot('private_bot');

// var baseDir = path.resolve('public/files/');

function convertDialogset(filepath, dialogset, callback) {
  var info = path.parse(filepath);
  var csvname = info.name + '.csv';
  var dlgname = info.name + '_dlg.csv';

  if(info.ext == '.txt') {
    convertFile(filepath, path.join(info.dir, csvname),
      function(result) {
        convertConversation(path.join(info.dir,csvname), path.join(info.dir, dlgname),
          function() {
            insertDatasetFile(path.join(info.dir, dlgname), dialogset,
              function(result) {
                callback(info.name + '_dlg');
              });
          });
      });

  } else if(info.ext == '.csv') {
    convertConversation(filepath, path.join(info.dir, dlgname),
      function() {
        insertDatasetFile(path.join(info.dir, dlgname), dialogset,
          function(result) {
            // console.log('convertFile: ' + filename);
            callback(info.name + '_dlg');
          });
      });
  }
}

exports.convertDialogset = convertDialogset;

function convertFile(infile, outfile, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  var lineNum = 0;
  var datetime = "", character = "", sentence = "";

  var addDialog = function() {
    if(character != "" && sentence != "" && sentence.length < 200) {
      var str = '"' + datetime.replace(/"/g, "\"\"") + '","' + character.replace(/"/g, "\"\"") + '","' + sentence.replace(/"/g, "\"\"") + '"\n';
      fs.appendFileSync(outfile, str, 'utf8');
      lineNum++;
      datetime = ''; character = ''; sentence = '';
    }
  };

  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /^(\d{4}\. \d+. \d+. (?:오전|오후) \d+:\d+), (.+) : (.*)$/g;
      var array = re.exec(line);

      if(array != null || line.trim() == '') addDialog();

      if(array !== null) {
        datetime = array[1].trim();
        character = array[2].trim();
        sentence = array[3].trim();

        sentence = sentence.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();

        // if(sentence == '' ||
        //   sentence == '사진' ||
        //   sentence == '동영상' ||
        //   sentence == '페이스톡 해요' ||
        //   sentence == '취소' ||
        //   sentence == '부재중' ||
        //   sentence == '응답 없음' ||
        //   sentence == '(이모티콘)' ||
        //   sentence.startsWith('http'))
        // {
        //   datetime = ''; character = ''; sentence = '';
        // }

      } else if(character != "") {
        sentence += line.trim().replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
      }

      cb();
    } else {
      addDialog();

      callback(result);
    }
  });
}

exports.convertFile = convertFile;

// var kakaoConvertFileTask = {
//   action: function (task, context, callback) {
//     convertFile('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/kakao/Talk_2017.1.22 18:14-1.txt',
//       '/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/kakao/Talk_2017.1.22 18:14-1.csv',
//       function(result) {
//         convertConversation('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/kakao/Talk_2017.1.22 18:14-1.csv',
//           '/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/kakao/Talk_2017.1.22 18:14-1_dlg.csv',
//           function() {
//             insertDatasetFile('/Users/com2best/Workspace/bot-web/custom_modules/private_bot/_data/ko/kakao/Talk_2017.1.22 18:14-1_dlg.csv',
//               function(result) {
//                 callback(task, context);
//               });
//           });
//       });
//   }
// };
//
// bot.setTask('kakaoConvertFileTask', kakaoConvertFileTask);


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

var exceptline = [/^사진$/, /^동영상$/, /^페이스톡 해요$/, /^취소$/, /^부재중$/, /^응답 없음$/, /^(?:\d+:)*\d+:\d+$/, /^\(.*\)\s*$/, /^http/];
function convertConversation(file, outfile, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  var dialogs = [], multiline = 0;
  var datetime = "", character = "", sentence = "";
  fileutil.streamLineSequence(file, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"?([^"]*)"?,"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);

      if(array !== null) {

        for(var i in exceptline) {
          if(array[3].search(exceptline[i]) != -1) {
            // console.log('array 3: ' + array[3]);
            array[3] = '';
          }
        }

        if(array[3] == '' ||
          array[3] == '사진' ||
          array[3] == '동영상' ||
          array[3] == '페이스톡 해요' ||
          array[3] == '취소' ||
          array[3] == '부재중' ||
          array[3] == '응답 없음' ||
          array[3] == '(이모티콘)' ||
          array[3].search(/^\(.*\)\s*$/) != -1 ||
          array[3].startsWith('http'))
        {
          // console.log('array 3: ' + array[3]);
          array[3] = '';
        }

        if(array[3] != '') {
          if(dialogs.length > 0 && dialogs[dialogs.length - 1].character == array[2]) {
            if(multiline <= 2) {
              multiline++;
              dialogs[dialogs.length - 1].sentence += ' ' + array[3];
            }
          } else {
            if(dialogs.length > 1) {
              var str =
                '"' + dialogs[dialogs.length - 2].character + '","' + dialogs[dialogs.length - 2].sentence +
                '","' + dialogs[dialogs.length - 1].character + '","' + dialogs[dialogs.length - 1].sentence +
                '"\n';
              // console.log(str);
              fs.appendFileSync(outfile, str, 'utf8');
              multiline = 0;
            }

            dialogs.push({character: array[2], sentence: array[3]});
          }

          if(dialogs.length > 10) dialogs.shift();
        }
      }

      cb();
    } else {
      callback(result);
      // console.log(result);
    }
  });
}

exports.convertConversation = convertConversation;

function insertDatasetFile(infile, dialogset, callback) {
  var info = path.parse(infile), count = 0;

  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"([^"]*)","([^"]*)","([^"]*)","([^"]*)"/g;
      var array = re.exec(line);
      var input = "", output = "", input_trans = '', output_trans = '';
      if(array !== null) {
        input = array[2].trim();
        output = array[4].trim();

        if(/*array[3] == '강지윤'*/ true) {
          var outputs = [];
          var re2 = /\[([^\]]*)\]/g;
          output.replace(re2, function(match, p1) {
            outputs.push(p1);
          });

          count++;
          dialogsetModule.insertDailogsetDialog(dialogset, count.toString(), input, output, function() {
            cb();
          });

          // processInput(null, input, function(_input, _json) {
          //   // console.log(input + '\n' + _input);
          //
          //   var task = {
          //     doc:{
          //       dialogset: dialogset._id,
          //       id: result.toString(),
          //       tag: [],
          //       inputRaw: input,
          //       input: _input,
          //       output: (outputs.length > 0 ? outputs: output)
          //       // output: output
          //     },
          //     mongo: {
          //       model: 'DialogsetDialog',
          //       query: {dialogset: '', id: ''},
          //       options: {upsert: true}
          //     }
          //   };
          //
          //   mongoModule.update(task, null, function(_task, _context) {
          //     cb();
          //   })
          // });
        } else {
          cb();
        }

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
