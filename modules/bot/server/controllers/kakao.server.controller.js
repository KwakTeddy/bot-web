var net = require('net');
var request = require('request');
var path = require('path');
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('modules/bot/engine/common/context'));
var mongoose = require('mongoose');
var Media = mongoose.model('Media');
var fs = require('fs');

var util = require('util');
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

    if (type == "photo" || type == "video"){
      Media.findOne({url: req.body.content}).exec(function (err, data) {
        if(err){
          console.log(err)
        }else {
          if(!data){

            // request.get(req.body.content, function(err, response, body) {
            //   if (response.statusCode === 200) {
            //     var localPath = '';
            //     if(type == "photo"){
            //       localPath = "public/images"
            //     }else if(type = "vidoe"){
            //       localPath = "public/videos"
            //     }
            //     fs.writeFile(path.resolve(localPath), body, 'binary',function() {
            //       console.log('Successfully downloaded file ' + req.body.content);
            //       var media = new Media();
            //       media.bot = req.params.bot;
            //       media.url = req.body.content;
            //       console.log(util.inspect(media, {showHidden: false, depth: null}))
            //       media.save(function (err) {
            //         if(err){
            //           console.log(err)
            //         }
            //       })
            //     });
            //   }
            // });
          }else {

          }
        }
      })
    }
    if (type == "photo" || type == "video"){
      req.body.inputType = req.body.type;
      delete req.body.type;
      req.body.url = req.body.content;
      delete req.body.content;
    }

    console.log(JSON.stringify(req.params));
    chat.write('kakao', from, req.params.bot, text, req.body, function (serverText, json) {
      console.log(util.inspect(json, {showHidden: false, depth: null}));
      console.log(123123123123123);
      if (type == "photo"){
        var json = {};
        json.photoUrl = req.body.content;
        return respondMessage(res, serverText, json)
      }
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
  if (json && json.result && json.result.items){

  }

  var sendMsg =
  {
    "message": {
      "text": text
    }
  };

  if(json && json.photoUrl) {
    sendMsg.message.photo = {
      "url": json.photoUrl,
      "width": json.photoWidth || 640,
      "height":json.photoHeight || 480
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

  if(json && json.result && json.result.smartReply) {
    sendMsg.keyboard =
      {
        "type": "buttons",
        "buttons": json.result.smartReply
      };
  }

  console.log(JSON.stringify(sendMsg));
  res.write(JSON.stringify(sendMsg));
  res.end();
}

