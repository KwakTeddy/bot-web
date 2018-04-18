const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const Bot = mongoose.model('Bot');

(function()
{
    var Telegram = function()
    {
    };

    Telegram.prototype.makeText = function(options, chatId, result)
    {
        options.form =
        {
            chat_id: chatId,
            text: result.output.text
        };
    };

    Telegram.prototype.makePhoto = function(options, chatId, result)
    {
        options.form = {
            chat_id: chatId,
            photo: result.output.image.url,
            caption: result.output.text,
            text: ''
        }
    };

    Telegram.prototype.message = function(req, res)
    {
        const Engine = require(path.resolve('./engine2/core.js'));

        var that = this;
        var token = req.params.token;
        Bot.findOne({ telegram: token }).exec(function(err, bot)
        {
            if(err)
            {
                console.error(err);
                res.end();
            }
            else
            {
                var data = req.body;

                var chatId = undefined;
                var userId = undefined;
                var text = undefined;
                var replyId = undefined;

                var welcomeName = undefined;

                if(data.message)
                {
                    chatId = data.message.chat.id;
                    userId = data.message.from.id;
                    text = data.message.text;

                    if(data.message.new_chat_member)
                    {
                        if(data.message.new_chat_member.is_bot)
                        {
                            text = 'welcome_bot';
                            welcomeName = data.message.new_chat_member.first_name;
                        }
                        else
                        {
                            text = 'welcome_user';
                            // welcomeName = data.message.new_chat_member.first_name + ' ' + data.message.new_chat_member.last_name;
                            if(data.message.new_chat_member.first_name)
                            {
                                welcomeName = data.message.new_chat_member.first_name;
                            }

                            if(welcomeName)
                            {
                                welcomeName += ' ';
                            }

                            if(data.message.new_chat_member.last_name)
                            {
                                welcomeName += data.message.new_chat_member.last_name;
                            }
                        }
                    }
                }
                else
                {
                    var callbackData = JSON.parse(data.callback_query.data);
                    chatId = data.callback_query.message.chat.id;
                    userId = data.callback_query.from.id;
                    text = callbackData.text;
                    // replyId = callbackData.replyId;
                }

                if(!text)
                {
                    return res.end();
                }

                try
                {
                    Engine.process(bot.id, 'telegram', userId, text || '', {}, function(context, result)
                    {
                        if(result.originalDialogId == 'noanswer')
                        {
                            return res.end();
                        }

                        var options = {};
                        options.method = 'POST';
                        options.url = 'https://api.telegram.org/bot' + token + '/';
                        options.simple = false;
                        options.resolveWithFullResponse = true;
                        options.forever = true;

                        if(welcomeName)
                        {
                            result.output.text = result.output.text.replace(/{{ name }}/gi, welcomeName);
                        }

                        if(result.output.image)
                        {
                            options.url += 'sendPhoto';
                            that.makePhoto(options, chatId, result);
                        }
                        else
                        {
                            options.url += 'sendMessage';
                            that.makeText(options, chatId, result);
                        }

                        if(result.output.buttons)
                        {
                            var inlineKeyboard = {
                                inline_keyboard: []
                            };

                            var keyboard = [];
                            for(var i=0; i<result.output.buttons.length; i++)
                            {
                                var callback_data = { text: result.output.buttons[i].text };
                                if(data.message)
                                {
                                    callback_data.replyId = data.message.message_id;
                                }

                                keyboard.push({ text: result.output.buttons[i].text, callback_data: JSON.stringify(callback_data) });

                                if(i > 0 && i % 3 == 0)
                                {
                                    inlineKeyboard.inline_keyboard.push(keyboard);
                                    keyboard = [];
                                }
                            }

                            inlineKeyboard.inline_keyboard.push(keyboard);

                            options.form.reply_markup = JSON.stringify(inlineKeyboard);
                        }

                        if(replyId)
                        {
                            options.form.reply_to_message_id = replyId;
                        }

                        console.log('옵션스 : ', options);
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
                catch(err)
                {
                    res.end();
                }
            }
        });
    };

    module.exports = new Telegram();
})();
