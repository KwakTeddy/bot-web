var xml2json = require('xml2js');
var js2xmlparser = require("js2xmlparser");
var path = require('path');
var utils = require(path.resolve('engine/bot/action/common/utils'));
var chat = require(path.resolve('engine/bot/server/controllers/bot.server.controller'));

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
};

exports.message =  function(req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
    if (body.length > 1e6)
      req.connection.destroy();
  });

  req.on('end', function () {
    console.log(body);
    try {
      xml2json.parseString(body, {}, function(err, js) {
        receivedMessage(req, res, js);
      });
    } catch (exception) {
      res.write('');
      res.end();
    }
  });
};

function receivedMessage(req, res, json) {
  var from = json.xml.FromUserName[0];
  var text = json.xml.Content[0] || '';

  chat.write('wechat', from, req.params.bot, text, json, function (serverText, _json) {
    json = utils.merge(json, _json);
    respondMessage(res, serverText, json)
  });
}

function respondMessage(res, text, json) {

  var result = {
    ToUserName: json.xml.FromUserName[0],
    FromUserName: json.xml.ToUserName[0],
    CreateTime: json.xml.CreateTime[0],
    MsgType: 'text',
    Content: text
  };

  var xml = js2xmlparser.parse("xml", result);
  console.log(JSON.stringify(json));
  console.log('============================================');
  console.log(xml);

  res.write(xml);
  res.end();
}

function sendTextMessage(recipientId, text, task, token) {

}

function sendImageMessage(recipientId, text, task, token) {

}

function sendLocationMessage(recipientId, text, task, token) {

}

function sendLinkMessage(recipientId, text, task, token) {

}

function sendEventMessage(recipientId, text, task, token) {

}

function sendMusicMessage(recipientId, text, task, token) {

}

function sendRichMediaMessage(recipientId, text, task, token) {

}
