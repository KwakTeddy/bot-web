var https = require('https');
var net = require('net');
var request = require('request');
var chat = require('./bot.server.controller');

exports.receiveNew = function (req, res) {
  console.log("receive receive");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.events && req.body.events[0].message.text) {
    var from = req.body.events[0].source.userId;
    var text = req.body.events[0].message.text;
    var replyToken = req.body.events[0].replyToken;

    console.log(from, text, replyToken, req.params.bot);

    chat.write('line', from, req.params.bot, text, function (retText, json) {
      chat.getContext(req.params.bot, 'line', from , function(context) {
        respondMessageNew(context.bot.line.CHANNEL_ACCESS_TOKEN, replyToken, retText, json)
      });
    });
  }

  res.end();
};


function respondMessageNew(channelToken, replyToken, text, json) {
  var sendHeader = {
    'Content-Type' : 'application/json',
    'Authorization': channelToken
  };

  var sendMsg = {
    "replyToken": replyToken,
    "messages":[
      {
        "type":"text",
        "text": text
      }
    ]
  };

  var options = {
    hostname: 'api.line.me',
    port: 443,
    path: '/v2/bot/message/reply',
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


// {
//   "events": [
//   {
//     "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
//     "type": "message",
//     "timestamp": 1462629479859,
//     "source": {
//       "type": "user",
//       "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
//     },
//     "message": {
//       "id": "325708",
//       "type": "text",
//       "text": "Hello, world"
//     }
//   }
// ]
// }


// curl -X POST \
// -H 'Content-Type:application/json' \
// -H 'Authorization: Bearer {ENTER_ACCESS_TOKEN}' \
// -d '{
// "replyToken":"nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
//   "messages":[
//   {
//     "type":"text",
//     "text":"Hello, user"
//   },
//   {
//     "type":"text",
//     "text":"May I help you?"
//   }
// ]
// }' https://api.line.me/v2/bot/message/reply

// chat.getContext(botId, 'facebook', to, function(context) {
//   callSendAPI(messageData, context.bot.facebook.PAGE_ACCESS_TOKEN);
// });
//


//===============================================================
// Bot Trial API (Old API)
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

exports.receiveGet = function(req, res) {
  console.log("get receive");
  res.send("ok");
  res.end();
}

exports.receive = function (req, res) {
  console.log("receive receive");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.result && req.body.result[0].content.text) {
    var from = req.body.result[0].content.from;
    var text = req.body.result[0].content.text;

    chat.write('line', from, req.params.bot, text, function (retText, url) {
      //moneybot.receivedMoneyBot(from, serverText, function(retText, url) {
        respondMessage(from, retText, url)
      //});
    });
  }
};

function respondMessage(to, text, json) {
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


