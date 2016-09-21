var net = require('net');
var request = require('request');
var chat = require('./bot.server.controller');
var moneybot = require('../controllers/moneybot.server.controller');

const CHANNEL_ID = 1469815524;
const CHANNEL_SECRET = 'b3250f6b4b68374c2c9d70314980b814';
const MID = 'uf4867e86aa4c0e064754b0555d52a98f';

const sendHeader = {
  'Content-Type' : 'application/json; charset=UTF-8',
  'X-Line-ChannelID' : CHANNEL_ID,
  'X-Line-ChannelSecret' : CHANNEL_SECRET,
  'X-Line-Trusted-User-With-ACL' : MID
};

exports.keyboard = function (req, res) {
  console.log("kakao keyboard");

  var sendMsg =
  {
    // type: 'text'

    // "type": "buttons",
    // "buttons": ["잔액조회", "상품추천", "고객상담"]

    // "type": "buttons",
    // "buttons": ["상품안내", "이벤트안내", "이용시간안내", "FAQ", "올원뱅크연결"]

    "type": "buttons",
    "buttons": ["배달주문하기"]

  };

  res.write(JSON.stringify(sendMsg));
  res.end();
};


exports.message = function (req, res) {
  console.log("kakao message");
  console.log(JSON.stringify(req.body));

  //respondMessage2(res, "")

  if(req.body && req.body.user_key && req.body.content) {
    var from = req.body.user_key;
    var type = req.body.type;
    var text = req.body.content;

    chat.write(from, req.params.botId, text, function (serverText, json) {
      respondMessage(res, serverText, json)

      //moneybot.receivedMoneyBot(from, serverText, function(retText, url) {
      //  respondMessage(res, retText, url)
      //});
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
  console.log("kakao delete chatroom: " + req.params.user_key + "," + req.params.botId);

  chat.write(req.params.user_key, req.params.botId, ":reset user", function (serverText, json) {
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


function respondMessage2(res, text) {
  var sendMsg =
  {
    "message": {
      "text": "귀하의 차량이 성공적으로 등록되었습니다. 축하합니다!",
      "photo": {
        "url": "https://photo.src",
        "width": 640,
        "height": 480
      },
      "message_button": {
        "label": "주유 쿠폰받기",
        "url": "https://coupon/url"
      }
    },
    "keyboard": {
      "type": "buttons",
      "buttons": [
        "처음으로",
        "다시 등록하기",
        "취소하기"
      ]
    }
  };

  console.log(JSON.stringify(sendMsg));
  res.write(JSON.stringify(sendMsg));
  res.end();

}
