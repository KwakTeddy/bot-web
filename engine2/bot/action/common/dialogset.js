var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('engine2/bot/action/common/fileutil.js'));
var mongoModule = require(path.resolve('engine2/bot/action/common/mongo.js'));

function insertDatasetFile(infile, outfile, from, to, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  fileutil.streamLineSequence(infile, function(result, line, cb) {
    if(isNaN(result) == false) {
      // console.log(line);

      var re = /"([^"]*)","([^"]*)"/g;
      var array = re.exec(line);
      var input = "", output = "", input_trans = '', output_trans = '';
      if(array !== null) {
        input = array[1].trim();
        output = array[2].trim();

        var info = path.parse(_file);

        var task = {
          doc:{
            dialogset: info.name,
            id: result,
            tag: [],
            input: input,
            output: output
          },
          mongo: {
            model: 'dialog',
            query: {dialogset: '', id: ''},
            options: {upsert: true}
          }
        };

        mongoModule.update(task, null, function(_task, _context) {
          cb();
        })
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
