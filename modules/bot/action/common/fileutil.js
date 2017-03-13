var fs = require('fs')
  , util = require('util')
  , stream = require('stream')
  , es = require('event-stream');

function streamLine(filename, callback) {
  var lineNr = 0;

  console.log(filename);
  var s = fs.createReadStream(filename)
    .pipe(es.split())
    .pipe(es.mapSync(
      function(line){

        // pause the readstream
        s.pause();

        lineNr += 1;

        // process line here and call s.resume() when rdy
        // function below was for logging memory usage
        callback(lineNr, line);

        // resume the readstream, possibly from a callback
        s.resume();
      })
      .on('error', function(){
        console.log('Error while reading file.');
        callback('error', null);
      })
      .on('end', function(){
        // console.log('Read entire file.')
        callback('end', null);
      })
    );
}

exports.streamLine = streamLine;

function streamLineSequence(filename, callback) {
  var lineNr = 0;

  console.log(filename);
  var s = fs.createReadStream(filename)
    .pipe(es.split())
    .pipe(es.mapSync(
      function(line){

        // pause the readstream
        s.pause();

        lineNr += 1;

        // process line here and call s.resume() when rdy
        // function below was for logging memory usage
        callback(lineNr, line, function() {
          // console.log('streamLineSequence: ' + lineNr);
          s.resume();
        });

        // resume the readstream, possibly from a callback
      })
      .on('error', function(){
        console.log('Error while reading file.');
        callback('error', null);
      })
      .on('end', function(){
        // console.log('Read entire file.')
        callback('end', null);
      })
    );
}

exports.streamLineSequence = streamLineSequence;