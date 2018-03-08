var request = require('request');
var mongoose = require('mongoose');
var Bot = mongoose.model('Bot');

const BASE_URL = 'https://api.line.me';
const VERSION = 'v2';

(function () {
    var client = function (accessToken) {
        this.accessToken = accessToken;
    };



    client.prototype.get = function (url) {
        return sendRequest('GET', url, this.accessToken);
    };

    client.prototype.post = function (url, data) {
        return sendRequest('POST', url, this.accessToken, data);
    };

    var sendRequest = function (method, url, accessToken, body) {
        var headers = {
            'Authorization' : 'Bearer ' + accessToken,
            'Content-Type' : 'application/json'
        };

        var options = {
            method: method,
            url: url,
            headers: headers,
            json: true
        };
        if(body) options.body = body;

        console.log(JSON.stringify(options, null, 4))

        return new Promise(function (resolve, reject) {
            request(options, function (err, response, body) {
                if(err)
                {
                    console.log(err)
                    reject(err);
                }
                else if(response.statusCode != 200)
                {
                    reject({statusCode: response.statusCode, body: body});
                }
                else
                {
                    resolve(body);
                }
            })
        });
    };
    
    exports.client = client;
})();


(function () {
    
    var bot = function (client) {
        this.client = client;

    };

    bot.prototype.sendReply = function (replyToken, data) {
        this.client.post(BASE_URL + '/' + VERSION + '/bot/message/reply', {replyToken : replyToken, messages: data}).then(function (result) {
            console.log(result)
        }).catch(function (err) {
            console.log(JSON.stringify(err, null, 4));
        })
    };

    // module.exports = bot;
    exports.bot = bot;

})();


(function () {
    var lineModule = require('./line-test');
    var client = new lineModule.client('NYyAVDiFCxAS0S4eNTXyaWqQgPSgflP2drKdAdJw3WqeihBw9/1/1ZVrveU//5NCX5ShdAVO7WlrmlT9GHYPj96hxK+wW+PeJAePewyJEUgV91AydKJJNH6bu9Z8Rvqizg0I4TevcI4Q1W4LNv+MWgdB04t89/1O/w1cDnyilFU=');
    var bot = new lineModule.bot(client);




    var post = function (req, res) {
        var events = req.body.events;

        Bot.findOne({ id: req.params.bot }).exec(function(err, chatbot)
        {
            if(chatbot)
            {

                var text = events[0].message.text;
                var userId = chatbot.userId;
                var Engine = require('../core.js');

                Engine.process(req.params.bot, 'line', userId, text, {}, function(err, out)
                {
                    if(out.output.buttons)
                    {

                        var template = {
                            "type": "template",
                            "altText": "This is a buttons template",
                            "template": {
                                "type": "buttons",
                                "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                                "imageAspectRatio": "rectangle",
                                "imageSize": "cover",
                                "imageBackgroundColor": "#FFFFFF",
                                "title": "Menu",
                                "text": "Please select",
                                "defaultAction": {
                                    "type": "uri",
                                    "label": "View detail",
                                    "uri": "http://example.com/page/123"
                                },
                                "actions": [
                                    {
                                        "type": "postback",
                                        "label": "Buy",
                                        "data": "action=buy&itemid=123"
                                    },
                                    {
                                        "type": "postback",
                                        "label": "Add to cart",
                                        "data": "action=add&itemid=123"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "View detail",
                                        "uri": "http://example.com/page/123"
                                    }
                                ]
                            }
                        };

                        bot.sendReply(req.body.events[0].replyToken, [template]);
                        console.log(out.output.buttons[0].text)

                    }
                    else if(out.output.image)
                    {

                    }
                    else
                    {
                        bot.sendReply(req.body.events[0].replyToken, [{
                            "type": "text",
                            "text": "Hello, world"
                        }]);
                    }

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



    exports.post = post;
})();
