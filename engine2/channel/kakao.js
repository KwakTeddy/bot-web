var path = require('path');
var chat = require(path.resolve('engine2/bot/server/controllers/bot.server.controller'));
var contextModule = require(path.resolve('engine2/bot/engine/common/context'));
var mongoose = require('mongoose');
var Media = mongoose.model('Media');
var config = require(path.resolve('config/config'));
var master = require(path.resolve('engine2/loadbalancer/master.js'));

var engine = require(path.resolve('./engine2/core.js'));


var util = require('util');
exports.keyboard = function (req, res)
{
    console.log("kakao keyboard");
    Engine.process(req.params.bot, 'kakao', req.params.user_key, '', {}, function(context, out)
    {
        var sendMsg = context.bot.kakao.keyboard;
        if(sendMsg == undefined)
        {
            sendMsg = {type: 'text'};
        }

        res.write(JSON.stringify(sendMsg));
        res.end();
    });
};

exports.message = function (req, res)
{
    if(req.body && req.body.user_key && req.body.content)
    {
        var from = req.body.user_key;
        var type = req.body.type;
        var text = req.body.content;
        if (type == "photo" || type == "video" || type == 'audio')
        {
            req.body.inputType = req.body.type;
            delete req.body.type;
            req.body.url = req.body.content;
            delete req.body.content;
        }

        Engine.process(req.params.bot, 'kakao', req.params.user_key, '', {}, function(context, out)
        {
            respondMessage(res, out);
        });
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


function respondMessage(res, result)
{
    var sendMsg =
    {
        message: { text: result.output.text }
    };

    if(result.output.image)
    {
        sendMsg.message.photo =
        {
            url: result.output.image.url,
            width: result.output.image.width || 640,
            height: result.output.image.height || 480
        };

        sendMsg.message.message_button =
        {
            label: '이미지보기',
            url: result.output.image.url
        };
    }

    // if(json && json.url)
    // {
    //     sendMsg.message.message_button =
    //     {
    //       "label": (json.urlMessage ? json.urlMessage : "상세정보보기"),
    //       "url": json.url
    //     };
    // }

    if(result.output.buttons)
    {
        for(var i = 0; i < result.output.buttons.length; i++)
        {
            if (result.output.buttons[i].url)
            {
                sendMsg.message.message_button =
                {
                    label: result.output.buttons[i].text,
                    url: result.output.buttons[i].url
                };
            }
            else
            {
                if (!sendMsg.keyboard)
                {
                    sendMsg.keyboard = {};
                    sendMsg.keyboard.buttons = [];
                    sendMsg.keyboard.type = 'buttons';
                }

                sendMsg.keyboard.buttons.push(result.output.buttons[i].text);
            }
        }
    }

    if(result.output && result.output.image)
    {
        if (result.output.image.url.substring(0,4) !== 'http')
        {
            result.output.image.url = config.host + result.output.image.url
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

