(function()
{
    var LINEBot = require('line-messaging');

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
        var Engine = require('../core.js');

        var headers = req.headers;
        var signature = headers['x-line-signature'];

        var bot = LINEBot.Client({
            channelID: '1566616426',
            channelSecret: '2a569aeebebdf437319610e748ab72e7',
            channelAccessToken: 'JelfAloyropKAdzeYTXl00NzZ+LDd9jx0eVzChBnuJeX+K521KUsKap4WEOPdoNFyQV5aaLM3VAIIvlYhxeugvRC2huTw79zl6vDWQY5+DNaTfFtW4KqIjgAIf33Z3B54d/fQli3DOBcEsfzXq2gtwdB04t89/1O/w1cDnyilFU='
        });

        bot.on(LINEBot.Events.MESSAGE, function(replyToken, message)
        {
            var text = message.getText();
            var userId = message.getUserId();

            console.log(text);

            Engine.process(req.params.bot, 'line', userId, text, {}, function(err, out)
            {
                // var textMessageBuilder = new LINEBot.TextMessageBuilder(out.output.text);
                // bot.replyMessage(replyToken, textMessageBuilder);

                var buttons = new LINEBot.ButtonTemplateBuilder();
                buttons.setTitle('Menu');
                buttons.setMessage('Please select');
                buttons.setThumbnail('https://example.com/bot/images/image.jpg');

                var template = new LINEBot.TemplateMessageBuilder('this is a buttons template', buttons);

                bot.replyMessage(replyToken, template);
            }, function(err)
            {

            });
        });

        var headers = req.headers;
        var signature = headers['x-line-signature'];

        bot.handleEventRequest(req.body, signature);
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