var xml2json = require('xml2js');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));

exports.messageGet = function(req, res) {
  var signature = req.query['signature'];
  var timestamp = req.query['timestamp'];
  var nonce = req.query['nonce'];
  var echostr = req.query['echostr'];

  console.log('signature: ' + signature);
  console.log('timestamp: ' + timestamp);
  console.log('nonce: ' + nonce);
  console.log('echostr: ' + echostr);

  res.write(echostr);
  res.end();
}

exports.message =  function(req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
    if (body.length > 1e6)
      req.connection.destroy();
  });

  req.on('end', function () {
    console.log(body);

    var result;
    try {
      xml2json.parseString(body, {explicitArray: false}, function(err, js) {
        receivedMessage(res, js);
      });
    } catch (exception) {
      res.write('');
      res.end();
    }
  });
}


function receivedMesage(req, res, json) {
  var from = json.FromUserName;
  var text = json.Content;

  chat.write('wechat', from, req.params.bot, text, json, function (serverText, json) {
    respondMessage(res, serverText, json)
  });
}

function respondMessage(res, text, json) {

}
