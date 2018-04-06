(function()
{
    var mongoose = require('mongoose');
    var wechat = require('wechat');
    var xml2json = require('xml2json');
    var ejs = require('ejs');
    var js2xmlparser = require('js2xmlparser');
    var path = require('path');
    var configs = require(path.resolve('config/config'));
    var Bot = mongoose.model('Bot');

    var WeChat = function()
    {

    };

    WeChat.prototype.get = function(req, res)
    {
        var signature = req.query.signature;
        var timestamp = req.query.timestamp;
        var nonce = req.query.nonce;
        var echostr = req.query.echostr;

        console.log('signature: ' + signature);
        console.log('timestamp: ' + timestamp);
        console.log('nonce: ' + nonce);
        console.log('echostr: ' + echostr);

        if(echostr)
        {
            res.end(echostr);
        }
        else
        {
            res.end();
        }
    };

    WeChat.prototype.post = function(req, res)
    {

        var buffers = [];
        stream.on('data', function (trunk) {
            buffers.push(trunk);
        });
        stream.on('end', function () {
            callback(null, Buffer.concat(buffers));
        });
        stream.once('error', callback);
        var Engine = require('../core.js');
        var botId = req.params.bot;

        var config = {
            token: 'moneybrain_token',
            // appid: 'wx64144a43a06a77ce',
            // encodingAESKey: 'AV2i3wjVj24LFXn0Qj0Rq5RrjgY0zMJ6hIYzo9VkRKe',
            checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
        };

        var args = arguments;

        Bot.findOne({ id: req.params.bot }).exec(function(err, bot)
        {
            if(err)
            {
                console.error(err);
                res.end();
            }
            else if(!bot)
            {
                res.end();
            }
            else
            {
                config.appid = bot.wechat.appId;
                config.encodingAESKey = bot.wechat.encodingAESKey;

                var f = wechat(config, function (req, res, next)
                {
                    var message = req.weixin;
                    var msgId = message.MsgId;
                    var userId = message.FromUserName;
                    var text = message.Content;
                    var createTime = message.CreateTime;
                    var toUserName = message.ToUserName;
                    Engine.process(botId, 'wechat', userId, text || '', {}, function(context, result)
                    {
                        var imageUrl = '';
                        var buttons = '';
                        var link = undefined;

                        if(result.output.image)
                        {
                            var imageUrl = encodeURI(result.output.image.url);
                            imageUrl = (imageUrl.startsWith('http') ? imageUrl : configs.host + imageUrl);
                        }

                        if(result.output.buttons)
                        {
                            for(var i=0; i<result.output.buttons.length; i++)
                            {
                                if(result.output.buttons[i].url)
                                {
                                    link = { url: result.output.buttons[i].url, text: result.output.buttons[i].text };
                                }

                                buttons += '\n' + result.output.buttons[i].text;
                            }
                        }

                        if(link)
                        {
                            return res.reply({ type: 'link', title: link.text, url: link.url });
                        }


                        if(imageUrl)
                        {
                            var json = { title: result.output.text, picurl: imageUrl, url: imageUrl };

                            if(buttons)
                            {
                                json.description = buttons;
                            }

                            res.reply([json]);
                        }
                        else
                        {
                            var text = result.output.text;
                            if(buttons)
                            {
                                text += buttons;
                            }

                            res.reply(text);
                        }
                        //
                        // var result = {
                        //     ToUserName: '<![CDATA[' + toUserName + ']]>',
                        //     FromUserName: '<![CDATA[' + userId + ']]>',
                        //     CreateTime: createTime,
                        //     MsgType: '<![CDATA[text]]>',
                        //     Content: '<![CDATA[' + text + ']]>',
                        //     MsgId: msgId
                        // };
                        //
                        // var xml = [
                        //     '<xml>',
                        //     '<ToUserName><![CDATA[' + toUserName + ']]></ToUserName>',
                        //     '<FromUserName><![CDATA[' + userId + ']]></FromUserName>',
                        //     '<CreateTime>' + createTime + '</CreateTime>',
                        //     '<MsgType><![CDATA[text]]></MsgType>',
                        //     '<Content><![CDATA[' + text + ']]></Content>',
                        //     '<MsgId>' + msgId + '</MsgId>',
                        //     '</xml>'
                        // ];
                        //
                        // console.log(xml);
                        // res.end(xml.join(''));
                    });
                });

                f.apply(f, args);
            }
        });
    };

    module.exports = new WeChat();
})();
