var path = require('path');
const line = require('@line/bot-sdk');
var LINEBot = require('line-messaging');
var mongoose = require('mongoose');
var Bot = mongoose.model('Bot');
var config = require(path.resolve('config/config'));


(function()
{

    var Line = function()
    {

    };

    Line.prototype.get = function(req, res)
    {
        console.log("get receive");
        res.send("ok");
        res.end();
    };

    Line.prototype.post = function(req, res)
    {

        var events = req.body.events;
        var botId = req.params.bot;

        switch (events[0].type)
        {
            case 'message':
                return messageEvent(events, botId);
            case 'postback' :
                return postbackEvent(events, botId);
            // case 'follow' :
            //     return
            // case 'unfollow' :
            //     return
            // case 'join' :
            //     return
            // case 'leave' :
            //     return
            // case 'beacon' :
            //     return
            default :
                res.end();
        }


    };
    var buildMessage = function (output) {
        var message;
        var text = output.text;

        if(output.buttons || output.image)
        {

            if(output.buttons)
            {
                var buttons = output.buttons;
                var length = buttons.length > 4 ? 4 : buttons.length;
                message = {
                    "type": "template",
                    "altText": "This is a buttons template",
                    "template": {
                        "type": "buttons",
                        "text": "",
                        "actions": []
                    }
                };

                for(var i = 0; i < length; i++)
                {
                    var actionTemplate = {
                        "type": '',
                        "label" : ''
                    };

                    if(buttons[i].url)
                    {
                        actionTemplate.type = 'uri';
                        actionTemplate.label = buttons[i].text;
                        actionTemplate.uri = buttons[i].url;
                    }
                    else
                    {
                        actionTemplate.type = 'message';
                        actionTemplate.label = buttons[i].text;
                        actionTemplate.text = buttons[i].text;
                    }

                    message.template.actions.push(actionTemplate);
                }
            }


            if(output.image)
            {
                text = text.slice(0, 60);

                var image = output.image;
                message.template.thumbnailImageUrl = 'https://70096bfb.ngrok.io' + image.url;
                // message.template.thumbnailImageUrl = config.host + image.url;
                message.template.imageAspectRatio = 'rectangle';
                message.template.imageSize = 'cover';
                message.template.imageBackgroundColor = '#FFFFFF';
            }
            else
            {
                text = text.slice(0, 160);
            }

            message.template.text = text;

        }
        else
        {
            message = {
                type: 'text',
                text: text
            };
        }
        console.log(JSON.stringify(message, null, 4));
        return message;
    };

    var messageEvent = function (events, botId) {

        var text = events[0].message.text;
        var replyToken = events[0].replyToken;


        Bot.findOne({ id: botId }).exec(function(err, chatbot)
        {
            if(chatbot)
            {
                var Engine = require('../core.js');
                Engine.process(botId, 'line', chatbot.userId, text, {}, function(err, out)
                {
                    var message = buildMessage(out.output);
                    var client = new line.Client({
                        channelAccessToken: chatbot.lineChannel.accessToken
                    });
                    client.replyMessage(replyToken, message)
                        .then(function (result)
                        {
                            console.log(JSON.stringify(result, null, 4))

                        })
                        .catch(function (err)
                        {
                            console.log(err);
                        });

                }, function(err)
                {

                });

            }
            else
            {
                res.end();
            }
        });

    };

    var postbackEvent = function (events, botId) {
        var text = events[0].postback.data;
        var replyToken = events[0].replyToken;

        Bot.findOne({ id: botId }).exec(function(err, chatbot)
        {
            if(chatbot)
            {
                var Engine = require('../core.js');

                Engine.process(botId, 'line', chatbot.userId, text, {}, function(err, out)
                {
                    var message = buildMessage(out.output);
                    var client = new line.Client({
                        channelAccessToken: chatbot.lineChannel.accessToken
                    });
                    client.replyMessage(replyToken, message)
                        .then(function (result)
                        {
                            console.log(JSON.stringify(result, null, 4))

                        })
                        .catch(function (err)
                        {
                            console.log(JSON.stringify(err, null, 4))

                        });

                }, function(err)
                {

                });

            }
            else
            {
                res.end();
            }
        });

    };





    module.exports = new Line();
})();

//
// function respondMessageNew(channelToken, replyToken, text, json) {
//   var sendMsg = {
//     "replyToken": replyToken,
//     "messages":[
//       {
//         "type":"text",
//         "text": text
//       }
//     ]
//   };
//
//   request.post({
//     url: 'https://api.line.me/v2/bot/message/reply',
//     headers: {
//       'Content-Type' : 'application/json',
//       'Authorization': 'Bearer ' + channelToken
//     },
//     body: JSON.stringify(sendMsg)
//   }, function (error, response, body) {
//     if (error) {console.log(error);}
//     else {
//       console.log('response ' + body);
//     }
//   });
// }
//
//
// //===============================================================
// // Bot Trial API (Old API)
// const CHANNEL_ID = 1469815524;
// const CHANNEL_SECRET = 'b3250f6b4b68374c2c9d70314980b814';
// const MID = 'uf4867e86aa4c0e064754b0555d52a98f';
//
// const sendHeader = {
//   Host: 'trialbot-api.line.me',
//   'Content-Type' : 'application/json; charset=UTF-8',
//   'X-Line-ChannelID' : CHANNEL_ID,
//   'X-Line-ChannelSecret' : CHANNEL_SECRET,
//   'X-Line-Trusted-User-With-ACL' : MID
// };
//
// exports.receive = function (req, res) {
//   console.log("receive receive");
//   console.log(JSON.stringify(req.body));
//
//   if(req.body && req.body.result && req.body.result[0].content.text) {
//     var from = req.body.result[0].content.from;
//     var text = req.body.result[0].content.text;
//
//     chat.write('line', from, req.params.bot, text, req.body.result[0].content, function (retText, url) {
//       //moneybot.receivedMoneyBot(from, serverText, function(retText, url) {
//         respondMessage(from, retText, url)
//       //});
//     });
//   }
// };
//
// function respondMessage(to, text, json) {
//   var sendMsg =
//   {
//     "to": [],
//     "toChannel":1383378250,
//     "eventType":"138311608800106203",
//     "content": {
//       "contentType":1,
//       "toType":1,
//       "text": null
//     }
//   };
//
//   sendMsg.to.push(to);
//   sendMsg.content.text = text;
//
//   var options = {
//     hostname: 'trialbot-api.line.me',
//     port: 443,
//     path: '/v1/events',
//     method: 'POST',
//     headers: sendHeader
//   };
//
//   var req = https.request(options, function (res) {
//     console.log('statusCode: ', res.statusCode);
//     console.log('headers: ', res.headers);
//
//     res.on('data', function (d) {
//       console.log(d.toString());
//       //process.stdout.write(d);
//     });
//   });
//
//   req.write(JSON.stringify(sendMsg));
//   req.end();
//
//   req.on('error', function (e) {
//     console.error(e);
//   });
// }
//
//
