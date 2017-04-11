var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

var util =require('util'); //temporary

exports.message =  function(req, res) {
  console.log("navertalk message");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.username && req.body.text) {
    var from = req.body.username;
    var text = req.body.text;

    console.log(JSON.stringify(req.params));
    chat.write('navertalk', from, req.params.bot, text, function (serverText, json) {
      respondMessage(res, serverText, json)
    });
  }
};

function respondMessage(res, text, json) {
  var sendMsg =
    {
      "message": {
        "text": text
      }
    };

  if(json && json.photoUrl) {
    sendMsg.message.photo = {
      "url": json.photoUrl,
      "width": json.photoWidth,
      "height":json.photoHeight
    }
  }

  if(json && json.url) {
    sendMsg.message.message_button =
      {
        "label": (json.urlMessage ? json.urlMessage : "상세정보보기"),
        "url": json.url
      };
  }

  if(json && json.buttons) {
    sendMsg.keyboard =
      {
        "type": "buttons",
        "buttons": json.buttons
      };
  }

  console.log(JSON.stringify(sendMsg));
  res.write(JSON.stringify(sendMsg));
  res.end();
}
