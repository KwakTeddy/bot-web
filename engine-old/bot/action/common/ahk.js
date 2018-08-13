var net = require('net');

function connectAhk(task, context, callback) {
  var client = net.connect({port:27015, host:'10.211.55.3'}, function(){
    console.log('Client connected1');
    client.write('Some Data \r\n');
    callback(task, context);
    console.log('Client connected2');
  });
  client.on('data', function(data){
    console.log(data.toString());
    // client.end();
  });
  client.on('end', function(){
    console.log('Client disconnected');
  });

}

exports.connectAhk = connectAhk;
