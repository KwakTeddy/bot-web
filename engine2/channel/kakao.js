var path = require('path');
var config = require(path.resolve('config/config'));
var request = require('request');

exports.keyboard = function (req, res)
{
    var Engine = require('../core.js');
    console.log("kakao keyboard");
    Engine.getBot(req.params.bot, function(bot)
    {
        var sendMsg = (bot.options.kakao && bot.options.kakao.keyboard) || { type: 'text' };

        //console.log('==========================exports keyborad==============');
        //if(req.params.bot=='samchully'){
        //    sendMsg = {};
        //}
        //console.log(sendMsg);

        res.write(JSON.stringify(sendMsg));
        res.end();
    },
    function(err)
    {
        respondMessage(res, { text: JSON.stringify(err) });
    });
};

exports.message = function (req, res)
{
    var Engine = require('../core.js');
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

        Engine.process(req.params.bot, 'kakao', from, text, {}, function (context, out)
        {
            respondMessage(res, out.output);
        },
        function(err)
        {
            if(err == 'old-version')
            {
                request.post({ url: 'https://old.playchat.ai/kakao/' + req.params.bot + '/message', json: { user_key: from, type: type, content: text } }, function(err, response, body)
                {
                    if(err)
                    {
                        res.end(JSON.stringify(err));
                    }
                    else
                    {
                        res.end(JSON.stringify(body));
                    }
                });
            }
            else
            {
                respondMessage(res,{ text: JSON.stringify(err) });
            }
        });
    }
};


exports.friend = function (req, res)
{
    console.log("kakao friend");
    res.end();
};

exports.deleteFriend = function (req, res)
{
    console.log("kakao friend delete");
    res.end();
};

exports.deleteChatRoom = function (req, res)
{
    // var from = req.body.user_key;
    var Engine = require('../core.js');
    console.log("kakao delete chatroom: " + req.params.user_key + "," + req.params.bot);
    Engine.process(req.params.bot, 'kakao', req.params.user_key, ':reset memory', {}, function (context, out)
    {
        res.end();
    },
    function(err)
    {
        respondMessage(res, { output: { text: JSON.stringify(err) } });
    });
};

function respondMessage(res, output)
{
    var sendMsg =
    {
        message: { text: output.text }
    };

    if(output.image)
    {
        sendMsg.message.photo =
        {
            url: (output.image.url.startsWith('http') ? output.image.url : config.host + output.image.url),
            width: output.image.width || 640,
            height: output.image.height || 480
        };

        // sendMsg.message.message_button =
        // {
        //     label: '이미지보기',
        //     url: output.image.url
        // };
    }

    // if(json && json.url)
    // {
    //     sendMsg.message.message_button =
    //     {
    //       "label": (json.urlMessage ? json.urlMessage : "상세정보보기"),
    //       "url": json.url
    //     };
    // }

    if(output.buttons)
    {
        for(var i = 0; i < output.buttons.length; i++)
        {
            if (output.buttons[i].url)
            {
                sendMsg.message.message_button =
                {
                    label: output.buttons[i].text,
                    url: output.buttons[i].url
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

                sendMsg.keyboard.buttons.push(output.buttons[i].text);
            }
        }
    }

    // if(smartReply)
    // {
    //     sendMsg.keyboard =
    //     {
    //         type: 'buttons',
    //         buttons: json.smartReply
    //     };
    // }

    res.write(JSON.stringify(sendMsg));
    res.end();
}

