var chalk = require('chalk');

var Error = require('./error.js');

var Logger = require('./logger.js');

var globals = require('./globals.js');
var channel = require('./channel.js');

var Context = require('./context.js');
var Command = require('./command.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var KnowledgeGraph = require('./km.js');
var AnswerManager = require('./answer.js');
var OutputManager = require('./output.js');

var Transaction = require('./utils/transaction.js');

(function()
{
    var Core = function()
    {
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

        BotManager.load(botId, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                var contextKey = channel + '_' + botId + '_' + userKey;
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

                        if(inputRaw.startsWith(':'))
                        {
                            Command.execute(that.redis, contextKey, inputRaw, bot, context, error, outCallback);
                            return;
                        }

                        context.globals = globals;
                        context.user.userKey = userKey;
                        context.bot = bot;
                        context.channel.name = channel;

                        var dialog = Context.createDialog();
                        dialog.input.text = inputRaw;

                        InputManager.analysis(bot, dialog, error, function()
                        {
                            var transaction = new Transaction.sync();

                            if(bot.options.useKnowledgeMemory)
                            {
                                transaction.call(function(done)
                                {
                                    KnowledgeGraph.memory(bot, dialog, error, function(numAffected)
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
                                    AnswerManager.answer(bot, context, dialog, error, function(output)
                                    {
                                        output = OutputManager.make(context, dialog, output);

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
                                                outCallback(context, output);

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
    };

    module.exports = new Core();
})();
