var https = require('https');
var net = require('net');
var request = require('request');
var chat = require('../controllers/chat.server.controller');
var moneybot = require('../controllers/moneybot.server.controller');

var chatBot = "";

const CHANNEL_ID = 1469815524;
const CHANNEL_SECRET = 'b3250f6b4b68374c2c9d70314980b814';
const MID = 'uf4867e86aa4c0e064754b0555d52a98f';

const sendHeader = {
  Host: 'trialbot-api.line.me',
  'Content-Type' : 'application/json; charset=UTF-8',
  'X-Line-ChannelID' : CHANNEL_ID,
  'X-Line-ChannelSecret' : CHANNEL_SECRET,
  'X-Line-Trusted-User-With-ACL' : MID
};

exports.receive = function (req, res) {
  console.log("put receive");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.result && req.body.result[0].content.text) {
    var from = req.body.result[0].content.from;
    var text = req.body.result[0].content.text;

    chat.write(from, chatBot, text, function (serverText) {
      moneybot.receivedMoneyBot(from, serverText, function(retText, url) {
        respondMessage(from, retText, url)
      });
    });
  }
};

function respondMessage(to, text, link) {
  var sendMsg =
  {
    "to": [],
    "toChannel":1383378250,
    "eventType":"138311608800106203",
    "content": {
      "contentType":1,
      "toType":1,
      "text": null
    }
  };

  sendMsg.to.push(to);
  sendMsg.content.text = text;

  var options = {
    hostname: 'trialbot-api.line.me',
    port: 443,
    path: '/v1/events',
    method: 'POST',
    headers: sendHeader
  };

  var req = https.request(options, function (res) {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);

    res.on('data', function (d) {
      console.log(d.toString());
      //process.stdout.write(d);
    });
  });

  req.write(JSON.stringify(sendMsg));
  req.end();

  req.on('error', function (e) {
    console.error(e);
  });

}
