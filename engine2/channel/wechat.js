(function()
{
    var xml2json = require('xml2js');
    var js2xmlparser = require('js2xmlparser');

    var wechat = require('wechat');
    var path = require('path');
    var configs = require(path.resolve('config/config'));

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
        var Engine = require('../core.js');
        var botId = req.params.bot;

        var config = {
            token: 'moneybrain_token',
            appid: 'wx64144a43a06a77ce',
            encodingAESKey: 'AV2i3wjVj24LFXn0Qj0Rq5RrjgY0zMJ6hIYzo9VkRKe',
            checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
        };

        var f = wechat(config, function (req, res, next)
        {
            var message = req.weixin;
            var userId = message.FromUserName;
            var text = message.Content;
            Engine.process(botId, 'wechat', userId, text || '', {}, function(context, result)
            {
                console.log("-->"+JSON.stringify(result));
                console.log("buttons"+result.output.buttons);
                if(result.output.image && !result.output.buttons)
                {
                    console.log("[[image]]");

                    var str=result.output.image.url.split("/");
                    var imagurl="";

                    for(var i=0;i<str.length;i++)
                    {
                        if(i===0){
                            console.log(encodeURIComponent(str[i]));
                            imagurl= encodeURIComponent(str[i]);
                        }
                        else{
                            imagurl= imagurl+"/"+encodeURIComponent(str[i]);
                        }
                    }

                    var t = {
                                title: result.output.text,
                                picurl: (result.output.image.url.startsWith('http') ? imagurl : "http://3ad29a82.ngrok.io" + imagurl)
                            };

                    console.log(t);
                    res.reply(
                      [t]
                    );
                }
                else if(result.output.image && result.output.buttons)
                {
                    console.log("[[image+buttons]]");

                    var str=result.output.image.url.split("/");
                    var imagurl="";

                    for(var i=0;i<str.length;i++)
                    {
                        if(i===0){
                            imagurl= encodeURIComponent(str[i]);
                        }
                        else{
                            imagurl= imagurl+"/"+encodeURIComponent(str[i]);
                        }
                    }

                    var buttons="";
                    for(var j=0;j<result.output.buttons.length;j++)
                    {
                        buttons=buttons+"\n"+result.output.buttons[j].text;
                    }
                    console.log(buttons);

                    var t = {
                               title: result.output.text+"\n",
                               description: buttons,
                               picurl: (result.output.image.url.startsWith('http') ? imagurl : configs.host + imagurl)
                            };

                    console.log(t);
                    res.reply(
                        [t]
                    );
                }
                else if(!result.output.image && result.output.buttons){

                    console.log("[[buttons]]");

                    var buttons="";
                    for(var j=0;j<result.output.buttons.length;j++)
                    {
                        buttons=buttons+"\n"+result.output.buttons[j].text;
                    }

                    var t = result.output.text+"\n"+buttons;

                    console.log(t);
                    res.reply(
                        t
                    );
                }
                else
                {
                    console.log("[[text]]");
                    res.reply(
                        {
                            type: "text",
                            content: result.output.text
                        });
                }
            });
        });

        f.apply(f, arguments);
        //
        // var body = '';
        // req.on('data', function (data)
        // {
        //     body += data;
        //     if (body.length > 1e6)
        //     {
        //         req.connection.destroy();
        //     }
        // });
        //
        // req.on('end', function ()
        // {
        //     console.log(body);
        //     try
        //     {
        //         xml2json.parseString(body, {}, function(err, json)
        //         {
        //             if(err)
        //             {
        //                 console.log(err);
        //             }
        //             else
        //             {
        //                 var userId = json.xml.FromUserName[0];
        //                 var text = json.xml.Content[0] || '';
        //
        //                 Engine.process(botId, 'wechat', userId, text || '', {}, function(context, result)
        //                 {
        //                     var output = result.output;
        //
        //                     var result = {
        //                         ToUserName: json.xml.FromUserName[0],
        //                         FromUserName: json.xml.ToUserName[0],
        //                         CreateTime: json.xml.CreateTime[0],
        //                         MsgType: 'text',
        //                         Content: output.text
        //                     };
        //
        //                     var xml = js2xmlparser.parse("xml", result);
        //                     console.log(JSON.stringify(json));
        //                     console.log('============================================');
        //                     console.log(xml);
        //
        //                     res.write(xml);
        //                     res.end();
        //                 });
        //             }
        //         });
        //     }
        //     catch (err)
        //     {
        //         console.log('에러 : ', err);
        //         res.write('');
        //         res.end();
        //     }
        // });
    };

    module.exports = new WeChat();
})();
