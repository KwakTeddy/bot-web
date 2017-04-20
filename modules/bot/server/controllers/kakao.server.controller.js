var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));

exports.keyboard = function (req, res) {
  console.log("kakao keyboard");

  contextModule.getContext(req.params.bot, 'kakao', req.params.user_key, null, function(context) {
    var sendMsg = context.bot.kakao.keyboard;
    if(sendMsg == undefined) sendMsg = { type: 'text'};

    res.write(JSON.stringify(sendMsg));
    res.end();

  });
};

exports.message = function (req, res) {
  console.log("kakao message");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.user_key && req.body.content) {
    var from = req.body.user_key;
    var type = req.body.type;
    var text = req.body.content;

   console.log(JSON.stringify(req.params));
    chat.write('kakao', from, req.params.bot, text, req.body, function (serverText, json) {
      console.log(util.inspect(json, {showHidden: false, depth: null}));
      respondMessage(res, serverText, json)
    });
  }

};


exports.friend = function (req, res) {
  console.log("kakao friend");
  res.end();
};

exports.deleteFriend = function (req, res) {
  console.log("kakao friend delete");
  res.end();
};

exports.deleteChatRoom = function (req, res) {
  console.log("kakao delete chatroom: " + req.params.user_key + "," + req.params.bot);

  chat.write('kakao', req.params.user_key, req.params.bot, ":reset user", null, function (serverText, json) {
    // respondMessage(res, serverText, json)
  });


  res.end();
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

  if(json && json.result && json.result.image) {
    sendMsg.message.photo = {
      "url": json.result.image.url,
      "width": json.result.image.width || 640,
      "height":json.result.image.height || 480
    };

    if(!json.url) {
      sendMsg.message.message_button =
        {
          "label": (json.urlMessage ? json.urlMessage : "이미지보기"),
          "url": json.result.image.url
        };
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

