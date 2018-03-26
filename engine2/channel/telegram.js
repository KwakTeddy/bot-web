const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const Bot = mongoose.model('Bot');

(function()
{
    var Telegram = function()
    {
    };

    Telegram.prototype.message = function(req, res)
    {
        const Engine = require(path.resolve('./engine2/core.js'));

        var token = req.params.token;
        Bot.findOne({ telegram: token }).exec(function(err, bot)
        {
            if(err)
            {
                console.error();
                res.end();
            }
            else
            {
                var data = req.body;
                var chatId = data.message.chat.id;
                var userId = data.message.from.id;
                var text = data.message.text;

                Engine.process(bot.id, 'telegram', userId, text, {}, function(context, result)
                {
                    var options = {};
                    options.method = 'POST';
                    options.url = 'https://api.telegram.org/bot' + token + '/sendMessage';
                    options.simple = false;
                    options.resolveWithFullResponse = true;
                    options.forever = true;
                    options.form = {
                        chat_id: chatId,
                        text: result.output.text
                    };

                    request(options, function(err, response, body)
                    {
                        if(err)
                        {
                            console.error(err);
                        }
                        else
                        {
                            console.log('바디 : ', body);

                            res.end();
                        }
                    });
                },
                function(err)
                {
                    console.error();
                    res.end();
                });
            }
        });
    };

    module.exports = new Telegram();
})();
