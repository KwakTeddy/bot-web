var fs = require('fs');
var path = require('path');
var async = require('async');
var fileutil = require(path.resolve('modules/bot/action/common/fileutil.js'));

var baseDir = '/Users/com2best/Workspace/bot-data/data/ko/drama/';

function convertFile(infile, outfile, callback) {
  var bStart = false, lineNum = 0;
  var character = "", sentence = "";
  fileutil.streamLine(infile, function(result, line) {
    if(isNaN(result) == false) {
      // console.log(line);

      if(line.startsWith('씬/')) {
        bStart = true;
      } else if(bStart) {
        var re = /^([\w\d가-힣]+)\s+(.*)$/g;
        var array = re.exec(line);

        if(array != null || line.trim() == '') {
          if(character != "" && sentence != "") {
            var str = '"' + character.replace(/"/g, "\"\"") + '","' + sentence.replace(/"/g, "\"\"") + '"\n';
            fs.appendFileSync(outfile, str, 'utf8');
            // console.log('['+character+'] '+ sentence);

            lineNum++;
            character = ""; sentence = "";
          }
        }

        if(array !== null) {
          // array[1] = array[1].trim();
          // array[2] = array[2].trim();

          character = array[1].trim();
          sentence = array[2].trim();

          sentence = sentence.replace(/\([^)]*\)/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        } else if(character != "") {
          sentence += line.trim().replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
        }
      }

      // console.log(result, line);
    } else {
      if(character != "") {
        var str = '"' + character.replace(/"/g, "\"\"") + '","' + sentence.replace(/"/g, "\"\"") + '"\n';
        fs.appendFileSync(outfile, str, 'utf8');
        lineNum++;
        character = ""; sentence = "";
      }

      console.log(lineNum + ' ' + infile);

      callback(result);

      // console.log(result);
    }
  });
}

// convertFile('/Users/com2best/Samples/corpus/ko/드라마대본/1484370545_1_오나의귀신님/-Unlicensed-오나귀1_(v.최종)_20151011024437.txt',
//   '/Users/com2best/Workspace/bot-data/data/ko/drama/test.csv',
//   function(result) {});

var fileFilter = function(file) {
  return file.endsWith('.txt');
};

function convertDir(dir, callback) {
  var files;

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
  var character = "", sentence = "";
  fileutil.streamLine(file, function(result, line) {
    if(isNaN(result) == false) {
      // console.log(line);

      console.log(line);

      var re = /"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);

      if(array !== null) {
        if(dialogs.length > 0 && dialogs[dialogs.length - 1].character == array[1]) {
          if(multiline <= 2) {
            multiline++;
            dialogs[dialogs.length - 1].sentence += '\n' + array[2];
          }
        } else {
          if(dialogs.length > 1) {
            var str =
              '"' + dialogs[dialogs.length - 2].character + '","' + dialogs[dialogs.length - 2].sentence +
              '","' + dialogs[dialogs.length - 1].character + '","' + dialogs[dialogs.length - 1].sentence +
              '"\n';
            fs.appendFileSync(outfile, str, 'utf8');
            multiline = 0;
          }

          dialogs.push({character: array[1], sentence: array[2]});
        }

        if(dialogs.length > 10) dialogs.shift();
      }
    } else {
      callback(result);
      // console.log(result);
    }
  });
}

// convertConversation('/Users/com2best/Workspace/bot-data/data/ko/drama/1484370545_1.csv',
//   '/Users/com2best/Workspace/bot-data/data/ko/drama/1484370545_1_오나의귀신님_dlg.csv',
//   function() {});
//
// process.stdin.resume();
