(function()
{
    var xml2json = require('xml2js');
    var js2xmlparser = require('js2xmlparser');

    var wechat = require('wechat');

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
        var botId = req.params.botId;

        var config = {
            token: 'moneybrain_token',
            appid: 'wx64144a43a06a77ce',
            encodingAESKey: 'oMJWADd6TqwTXOLF6IMnQDfqfohdvPhEPwX5jBOprHd',
            checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
        };

        var f = wechat(config, function (req, res, next)
        {
            var message = req.weixin;
            var userId = message.FromUserName;
            var text = message.Content;
            Engine.process(botId, 'wechat', userId, text || '', {}, function(context, result)
            {
                console.log(result);
                res.reply([
                    {
                        title: '머니브레인',
                        description: 'ㅎㅎㅎㅎ',
                        picurl: 'https://nbamania.com/g2/data/cheditor5/1711/mania-done-20171114203140_gnvbdbwd.jpg',
                        url: 'http://moneybrain.ai'
                    }
                ]);
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
