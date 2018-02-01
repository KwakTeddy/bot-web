var chalk = require('chalk');

var Error = require('./error.js');

var Logger = require('./logger.js');

var globals = require('./globals.js');
var channel = require('./channel.js');
var loadBalancer = require('./loadbalancer.js');

var Context = require('./context.js');
var Command = require('./command.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var KnowledgeGraph = require('./km.js');
var ConversationManager = require('./conversation.js');
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

    Core.prototype.process = function(botId, channel, userKey, inputRaw, options, outCallback, errCallback)
    {
        var that = this;

        console.log();
        console.log(chalk.green('======== Engine Process ========'));
        console.log('--- Parameters: ');
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
                            if(!context.user)
                            {
                                context.user = {};
                            }
                        }

                        if(inputRaw.startsWith(':'))
                        {
                            Command.execute(that.redis, contextKey, inputRaw, bot, context, error, outCallback);
                            return;
                        }

                        context.user.userKey = userKey;
                        context.bot = bot;
                        context.channel = channel;

                        for(var i=0; i<context.history.length; i++)
                        {
                            if(i < context.history.length - 1)
                            {
                                context.history[i].prev = context.history[i+1];
                            }

                            if(i > 0)
                            {
                                context.history[i].next = context.history[i-1];
                            }
                        }

                        var conversation = {};

                        if(context.history.length > 0)
                        {
                            conversation.prev = context.history[0];
                            context.history[0].next = conversation;
                        }

                        context.history.splice(0, 0, conversation);

                        conversation.nlu = {
                            sentence: inputRaw,
                            inputRaw: inputRaw
                        };

                        console.log('[[[ Context ]]]');
                        console.log(context);
                        console.log();

                        InputManager.analysis(bot, conversation, error, function()
                        {
                            var transaction = new Transaction.sync();

                            if(bot.useKnowledgeMemory)
                            {
                                transaction.call(function(done)
                                {
                                    KnowledgeGraph.memory(conversation, error, function(numAffected)
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
                                    ConversationManager.answer(bot, context, error, function(output)
                                    {
                                        output = OutputManager.make(context, output);

                                        for(var i=0; i<context.history.length; i++)
                                        {
                                            delete context.history[i].next;
                                            delete context.history[i].prev;
                                        }

                                        delete context.bot;
                                        delete context.channel;

                                        console.log('[[[ Save Context ]]]');
                                        console.log(context);
                                        console.log();

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

                                                outCallback(output);

                                                console.log(chalk.green('================================'));
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
