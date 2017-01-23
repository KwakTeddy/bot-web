var fs = require('fs');
var async = require('async');
var path = require('path');
var fileutil = require(path.resolve('modules/bot/action/common/fileutil.js'));

function convertFile(infile, outfile, callback) {
  if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
  else fs.writeFileSync(outfile, '',  {flag: 'wx'});

  var input = "", output = "";
  fileutil.streamLine(infile, function(result, line) {
    if(isNaN(result) == false) {

      line = line.replace(/(?:\*|<|>|~)/g, '');
      line = line.replace(/  /g, ' ');

      console.log(line);
      var re = /[su\?]+:\s*\((.*)\)\s*(.*)/g;
      var array = re.exec(line);

      if(array !== null) {
        console.log(array[1], array[2]);
        array[1] = array[1].trim();
        array[2] = array[2].trim();

        if(input != "" && output != "") {
          var str = '"' + input.replace(/"/g, "'") + '","' + output.replace(/"/g, "'") + '"\n';
          fs.appendFileSync(outfile, str, 'utf8');
          input = ""; output = "";
        }

        input = array[1];
        output = array[2];
        if(output.trim() != "") {
          var str = '"' + input.replace(/"/g, "'") + '","' + output.replace(/"/g, "'") + '"\n';
          fs.appendFileSync(outfile, str, 'utf8');
          input = ""; output = "";
        }
      } else if(input != "") {
        output += line.trim();
      }


      // console.log(result, line);
    } else {
      callback(result);
      // console.log(result);
    }
  });
}

// convertFile('/Users/com2best/Workspace/bot-server/RAWDATA/QUIBBLE/eliza_what.top',
//   '/Users/com2best/Workspace/bot-data/data/eliza_what_en.csv',
//   function(result) {});

var fileFilter = function(file) {
  if(file.indexOf('eliza_oor') != -1 || file.indexOf('honest') != -1 || file.indexOf('quibble') != -1) return false;
  else return file.endsWith('.top');
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

  async.eachSeries(files, function(file, cb) {
    var _file = dir + file;
    var info = path.parse(_file);
    var _outfile = path.join(path.resolve('data/'), info.name + '_en.csv');

    convertFile(_file, _outfile, function(result) {
      cb(null);
    });
  }, function(err) {
    console.log(dir + ' 업데이트 완료');
    callback();
  });
}

// convertDir('/Users/com2best/Workspace/bot-server/RAWDATA/QUIBBLE/', function() {});


// var googleTranslate = require('google-translate')('AIzaSyDFfCi-x6iMRxdN_V7U2pSCQFzGseNzSBM');
//
// function sentenceMark(sentence) {
//   if(sentence.startsWith('can') ||
//     sentence.startsWith('if') ||
//     sentence.startsWith('will') ||
//     sentence.startsWith('would') ||
//     sentence.startsWith('do') ||
//     sentence.startsWith('did') ||
//     sentence.startsWith('how') ||
//     sentence.startsWith('what') ||
//     sentence.startsWith('when') ||
//     sentence.startsWith('where') ||
//     sentence.startsWith('who') ||
//     sentence.startsWith('why') ||
//     sentence.startsWith('which')) {
//     return sentence + '?';
//   } else {
//     return sentence;
//   }
// }
//
// function translateFile(infile, outfile, from, to, callback) {
//   if(fs.existsSync(outfile)) fs.truncateSync(outfile, 0);
//   else fs.writeFileSync(outfile, '',  {flag: 'wx'});
//
//   fileutil.streamLineSequence(infile, function(result, line, cb) {
//     if(isNaN(result) == false) {
//       // console.log(line);
//
//       var re = /"([^"]*)","([^"]*)"/g;
//       var array = re.exec(line);
//       var input = "", output = "", input_trans = '', output_trans = '';
//       if(array !== null) {
//         input = array[1].trim();
//         output = array[2].trim();
//
//         input = sentenceMark(input);
//
//         async.waterfall([
//           function(cb1) {
//             googleTranslate.translate(input, to, function(err, translation) {
//               if(translation)  input_trans = translation.translatedText;
//               // console.log(translation.translatedText);
//               cb1();
//             });
//           },
//           function(cb1) {
//             googleTranslate.translate(output, to, function(err, translation) {
//               if(translation) output_trans = translation.translatedText;
//               // console.log(translation.translatedText);
//               cb1();
//             });
//           }
//         ], function(err) {
//           var str = '"' + input_trans + '","' + output_trans + '"\n';
//           fs.appendFileSync(outfile, str, 'utf8');
//           cb();
//         });
//       } else {
//         cb();
//       }
//     } else {
//       console.log(infile + ' 완료');
//       callback(result);
//       // console.log(result);
//     }
//   });
// }
//
// // translateFile('/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_en.csv',
// //   '/Users/com2best/Workspace/bot-data/data/en/chatscript/eliza_can_ko.csv',
// //   'en', 'ko',
// //   function(result) {});
//
// function translateDir(dir, from, to, callback) {
//   var files;
//
//   var transFilter = function(file) {
//     return file.endsWith(from +'.csv');
//   };
//
//
//   try {
//     files = fs.readdirSync(dir);
//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];
//       if(file != file.normalize('NFC')) {
//         files[i] = file.normalize('NFC');
//       }
//     }
//
//     files = files.filter(transFilter);
//   } catch(e) {
//     console.log(e);
//     return;
//   }
//
//   console.log(dir + ' 업데이트 시작');
//
//   async.each(files, function(file, cb) {
//     var _file = dir + file;
//     var info = path.parse(_file);
//     var _outfile = path.join(info.dir, info.name + '_' + to + '.csv');
//
//     translateFile(_file, _outfile, from, to, function(result) {
//       cb(null);
//     });
//   }, function(err) {
//     console.log(dir + ' 업데이트 완료');
//     callback();
//   });
// }
//
// // translateDir('/Users/com2best/Workspace/bot-data/data/en/chatscript/',
// //   'en', 'ko', function() {})
//
// translateDir('/Users/com2best/Workspace/bot-data/data/en/chatscript/',
//   'ja', 'ko', function() {})

// var csv = require('csv');
// var parse = require('csv-parse');
// var csvData=[];
//
// fs.createReadStream('/Users/com2best/Workspace/bot-data/data/eliza_can_en.csv')
//   .pipe(csv.parse({delimiter: ','}))
//   .on('data', function(csvrow) {
//     console.log(csvrow);
//     //do something with csvrow
//     csvData.push(csvrow);
//   })
//   .on('end',function() {
//     //do something wiht csvData
//     console.log(csvData);
//   });

// var parser = parse({delimiter: ','}, function (err, data) {
//   async.eachSeries(data, function (line, callback) {
//     // do something with the line
//
//     console.log(line);
//     callback();
//     // doSomething(line).then(function() {
//     //   // when processing finishes invoke the callback to move to the next one
//     //   callback();
//     // });
//   })
// })
// fs.createReadStream('/Users/com2best/Workspace/bot-data/data/eliza_can_en.csv').pipe(parser);

// var hwp = require('node-hwp');
// hwp.open('/Users/com2best/Samples/corpus/ko/1484370807.hwp', function(err, doc){
//   console.log(doc.toHML());
// });


process.stdin.resume();

