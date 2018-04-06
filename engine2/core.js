var chalk = require('chalk');
var async = require('async');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var Error = require('./error.js');

var Logger = require('./logger.js');

var SystemMessages = require('./system-messages.js');

var globals = require('./globals.js');
var channel = require('./channel.js');

var Context = require('./context.js');
var Command = require('./command.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var KnowledgeGraph = require('./km.js');
var AnswerManager = require('./answer.js');

var Transaction = require('./utils/transaction.js');

var AWS = require('aws-sdk');
AWS.config.update(require(path.resolve('./aws-s3-credentials.json')));
var s3 = new AWS.S3();

(function()
{
    var Core = function()
    {
        this.version = '';
        this.redis = undefined;

        console.log();
        console.log(chalk.green('================= Engine Initailize ==================='));

        globals.init();

        console.log(chalk.green('===================================================='));
        console.log();
    };

    Core.prototype.setRedisClient = function(client)
    {
        this.redis = client;
    };

    Core.prototype.init = function(app, io)
    {
        channel.init(app, io);
        // loadBalancer.init(app, io);
    };

    Core.prototype.getBot = function(botId, callback, errCallback)
    {
        var error = new Error(errCallback);

        BotManager.load(botId, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                callback(bot);
            }
        });
    };

    Core.prototype.downloadFromS3 = function(botId, callback)
    {
        if(process.env.NODE_ENV == 'production')
        {
            if(fs.existsSync(path.resolve('./custom_modules/' + botId)))
            {
                return callback();
            }

            var params = {
                Bucket: 'playchat-custom-modules',
                Delimiter: '',
                Prefix: botId
            }

            s3.listObjects(params, function (err, data)
            {
                if(err)
                {
                    return callback(err);
                }

                fs.mkdirSync(path.resolve('./custom_modules/' + botId));

                var list = data.Contents;
                async.eachSeries(list, function(item, next)
                {
                    if(item.Key == botId + '/')
                    {
                        return next();
                    }

                    s3.getObject({ Bucket: "playchat-custom-modules", Key: item.Key }, function (err, data)
                    {
                        if(err != null)
                        {
                            rimraf(path.resolve('./custom_modules/' + botId), function () { console.log('done'); });
                            callback(err);
                        }
                        else
                        {
                            var content = data.Body.toString('utf-8');
                            fs.writeFileSync(path.resolve('./custom_modules/' + item.Key), content);
                            next();
                        }
                    });
                },
                function()
                {
                    callback(null, botId);
                });
            });
        }
        else
        {
            callback(null, botId);
        }
    };

    Core.prototype.process = function(botId, channel, userKey, inputRaw, options, outCallback, errCallback)
    {
        var that = this;

        console.log();
        console.log(chalk.green('======================== Engine Process ========================'));
        console.log(chalk.yellow('[[[ Parameter ]]]'));
        console.log({ botId: botId, channel: channel, userKey: userKey, inputRaw: inputRaw, options: options });
        console.log();

        Logger.logBotUser(botId, channel, userKey, {});

        var error = new Error(errCallback);
        this.downloadFromS3(botId, function(err)
        {
            if(err)
            {
                return error.delegate(err);
            }

            if(!botId)
            {
                return error.delegate('bot is not found');
            }

            BotManager.load(botId, function(err, bot)
            {
                if(err)
                {
                    error.delegate(err);
                }
                else
                {
                    if(!bot.options.version)
                    {
                        return errCallback('old-version');
                    }

                    var contextKey = botId + '_' + userKey;
                    that.redis.get(contextKey, function(err, context)
                    {
                        if(err)
                        {
                            error.delegate(err);
                        }
                        else
                        {
                            if(!context)
                            {
                                context = Context.create();
                            }
                            else
                            {
                                context = JSON.parse(context);
                                Context.init(context);
                            }

                            context.globals = globals;
                            context.user.userKey = userKey;
                            context.bot = bot;
                            context.channel.name = channel;

                            if(!bot)
                            {
                                return outCallback(context, { type: 'dialog', output: { kind: 'Content', text: SystemMessages['There is an unsupported version of the bot. if you are using previous version, then please move below.'].ko, buttons: [{ text: 'https://old.playchat.ai', url: 'https://old.playchat.ai' }] } });
                            }
                            else if(!bot.options.use)
                            {
                                return outCallback(context, SystemMessages['You can\'t use this bot']);
                            }

                            if(inputRaw.startsWith(':'))
                            {
                                Command.execute(that.redis, contextKey, inputRaw, bot, context, error, outCallback);
                                return;
                            }

                            if(context.session.history.length > 10)
                            {
                                context.session.history.splice(context.session.history.length-1, 1);
                            }

                            var userInput = { text: inputRaw };
                            InputManager.analysis(bot, context, userInput, error, function()
                            {
                                var transaction = new Transaction.sync();

                                if(bot.options.useKnowledgeMemory)
                                {
                                    transaction.call(function(done)
                                    {
                                        KnowledgeGraph.memory(bot, userInput, error, function(numAffected)
                                        {
                                            if(numAffected && numAffected.ok == 1 && numAffected.n > 0)
                                            {
                                                if (bot.language == "zh")
                                                {
                                                    outCallback(context, '我学到了你说的话。');
                                                }
                                                else if (bot.language == "en")
                                                {
                                                    outCallback(context, 'I understand.');
                                                }
                                                else
                                                {
                                                    outCallback(context, '말씀하신 내용을 학습했어요.');
                                                }
                                            }
                                            else
                                            {
                                                done();
                                            }
                                        });
                                    });
                                }
                                else
                                {
                                    transaction.done(function()
                                    {
                                        AnswerManager.answer(bot, context, userInput, error, function(dialog)
                                        {
                                            delete context.bot;
                                            delete context.channel;
                                            delete context.globals;
                                            delete context.session.currentDialog;

                                            that.redis.set(contextKey, JSON.stringify(context), function(err)
                                            {
                                                if(err)
                                                {
                                                    error.delegate(err);
                                                }
                                                else
                                                {
                                                    //테스트 필요
                                                    that.redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                                                    context.bot = bot;
                                                    outCallback(context, dialog);

                                                    //여기서 소켓으로 올려보내자 userkey로 구분해서
                                                    // Logger.chatLog(userKey, { userKey: userKey, inputRaw: inputRaw, output: dialog });
                                                    if(Logger.userSockets[userKey])
                                                    {
                                                        Logger.userSockets[userKey].emit('chat_log', { type: 'dialog', inputRaw: inputRaw, output: dialog.output });
                                                    }

                                                    console.log(chalk.green('================================================================'));
                                                    console.log();
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    };

    module.exports = new Core();
})();
