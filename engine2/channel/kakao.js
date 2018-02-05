var path = require('path');
var config = require(path.resolve('config/config'));

exports.keyboard = function (req, res)
{
    var Engine = require('../core.js');
    console.log("kakao keyboard");
    Engine.getBot(req.params.bot, function(bot)
    {
        var sendMsg = bot.options.kakao || { type: 'text' };

        res.write(JSON.stringify(sendMsg));
        res.end();
    },
    function(err)
    {
        respondMessage(res, { output: { text: JSON.stringify(err) } });
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
            respondMessage(res, out);
        },
        function(err)
        {
            respondMessage(res, { output: { text: JSON.stringify(err) } });
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
    var from = req.body.user_key;
    var Engine = require('../core.js');
    console.log("kakao delete chatroom: " + req.params.user_key + "," + req.params.bot);
    Engine.process(req.params.bot, 'kakao', from, ':reset user', {}, function (context, out)
    {
        res.end();
    },
    function(err)
    {
        respondMessage(res, { output: { text: JSON.stringify(err) } });
    });
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
            url: config.host + result.output.image.url,
            width: result.output.image.width || 640,
            height: result.output.image.height || 480
        };

        // sendMsg.message.message_button =
        // {
        //     label: '이미지보기',
        //     url: result.output.image.url
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

    // if(result.smartReply)
    // {
    //     sendMsg.keyboard =
    //     {
    //         type: 'buttons',
    //         buttons: json.result.smartReply
    //     };
    // }

    res.write(JSON.stringify(sendMsg));
    res.end();
}

