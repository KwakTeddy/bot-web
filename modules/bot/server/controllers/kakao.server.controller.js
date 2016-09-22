var net = require('net');
var request = require('request');
var chat = require('./bot.server.controller');

exports.keyboard = function (req, res) {
  console.log("kakao keyboard");

  var context = chat.getContext(req.params.bot, req.params.user_key);

  var sendMsg = context.bot.kakao.keyboard;
  if(sendMsg == undefined) sendMsg = { type: 'text'};

  // {
    // type: 'text'
    // "type": "buttons",
    // "buttons": ["잔액조회", "상품추천", "고객상담"]
    // "type": "buttons",
    // "buttons": ["상품안내", "이벤트안내", "이용시간안내", "FAQ", "올원뱅크연결"]
    // "type": "buttons",
    // "buttons": ["배달주문하기", "배달내역보기"]
  // };

  res.write(JSON.stringify(sendMsg));
  res.end();
};

exports.message = function (req, res) {
  console.log("kakao message");
  console.log(JSON.stringify(req.body));

  if(req.body && req.body.user_key && req.body.content) {
    var from = req.body.user_key;
    var type = req.body.type;
    var text = req.body.content;

    chat.write(from, req.params.bot, text, function (serverText, json) {
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

  chat.write(req.params.user_key, req.params.bot, ":reset user", function (serverText, json) {
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

