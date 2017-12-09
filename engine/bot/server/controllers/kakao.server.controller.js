var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('engine/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('engine/bot/engine/common/context'));
var mongoose = require('mongoose');
var Media = mongoose.model('Media');
var fs = require('fs');
var config = require(path.resolve('config/config'));
var loadbalancer = require(path.resolve('engine/bot/engine/loadbalancer/loadbalancer'));


var util = require('util');
exports.keyboard = function (req, res) {
  console.log("kakao keyboard");

  contextModule.getContext(req.params.bot, 'kakao', req.params.user_key, null, function(context) {
    var sendMsg = context.bot.kakao.keyboard;
    if(sendMsg == undefined) sendMsg = { type: 'text'};
    console.log(util.inspect(sendMsg))
    res.write(JSON.stringify(sendMsg));
    res.end();

  });
};

exports.message = function (req, res) {
  if(req.body && req.body.user_key && req.body.content) {
    var from = req.body.user_key;
    var type = req.body.type;
    var text = req.body.content;
    if (type == "photo" || type == "video" || type == 'audio') {
      req.body.inputType = req.body.type;
      delete req.body.type;
      req.body.url = req.body.content;
      delete req.body.content;
    }

    if(loadbalancer.isUse() && loadbalancer.isMaster()) {
      loadbalancer.balance('kakao', from, req.params.bot, text, req.body, function (serverText, json) {
        respondMessage(res, serverText, json)
      });
    } else {
      chat.write('kakao', from, req.params.bot, text, req.body, function (serverText, json) {
        respondMessage(res, serverText, json)
      });
    }

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
  // console.log('text: ' + text);
  // console.log('json: ' + util.inspect(json));
  var sendMsg =
  {
    "message": {
      "text": text
    }
  };

  // if(json && json.photoUrl) {
  //   sendMsg.message.photo = {
  //     "url": json.photoUrl,
  //     "width": json.photoWidth || 640,
  //     "height":json.photoHeight || 480
  //   }
  // }

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

    for(var i = 0; i < json.buttons.length; i++){
      if ( json.buttons[i].url){
        sendMsg.message.message_button =
          {
            "label": json.buttons[i].text,
            "url": json.buttons[i].url
          };
      }else {
        if (!sendMsg.keyboard){
          sendMsg['keyboard'] = {};
          sendMsg.keyboard['buttons'] = [];
          sendMsg.keyboard['type'] = 'buttons';
        }
        sendMsg.keyboard.buttons.push(json.buttons[i].text);
      }
    }
    // sendMsg.keyboard =
    // {
    //   "type": "buttons",
    //   "buttons": json.buttons
    // };
  }

  if(json && json.image){
    if (json.image.url.substring(0,4) !== 'http'){
      json.image.url = config.host + json.image.url
    }
    sendMsg.message.photo =
      {
        "url": json.image.url,
        "width" : 720,
        "height" : 630
      }
  }


  if(json && json.result && json.result.smartReply) {
    sendMsg.keyboard =
      {
        "type": "buttons",
        "buttons": json.result.smartReply
      };
  }

  // console.log(JSON.stringify(sendMsg));
  res.write(JSON.stringify(sendMsg));
  res.end();
}

