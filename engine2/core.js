var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var Error = require('./error.js');

var globals = require('./globals.js');
var channel = require('./channel.js');
var loadBalancer = require('./loadbalancer.js');

var Context = require('./context.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var ConversationManager = require('./conversation.js');
var OutputManager = require('./output.js');

(function()
{
    var Core = function()
    {
        this.redis = undefined;

        console.log();
        console.log(chalk.green('================= Engine Initailize ==================='));

        this.loadModels();
        globals.init();

        // var autoCorrection = require(path.resolve('engine2/bot/engine/nlp/autoCorrection'));
        // autoCorrection.loadWordCorrections();

        console.log(chalk.green('===================================================='));
        console.log();
    };

    Core.prototype.setRedisClient = function(client)
    {
        this.redis = client;
    };

    Core.prototype.loadModels = function()
    {
        console.log('[Load Models START]');
        var list = fs.readdirSync(path.resolve('./engine2/models'));
        for(var i=0; i<list.length; i++)
        {
            require(path.resolve('./engine2/models/' + list[i]));
            console.log(list[i]);
        }
        console.log('[Load Models END]');
        console.log();
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
                        }

                        if(inputRaw.startsWith(':'))
                        {
                            //FIXME 커맨드 실행
                            console.log(chalk.green('================================'));
                            console.log('커맨드 실행 : ', inputRaw);

                            context.history = [{ dialog: bot.commonDialogs[0] }];

                            if(inputRaw == ':reset user')
                            {
                                context.returnDialog = undefined;
                                context.dialogCursor = undefined;

                                that.redis.set(contextKey, JSON.stringify(context), function(err, reply)
                                {
                                    if(err)
                                    {
                                        error.delegate(err);
                                    }
                                    else
                                    {
                                        var output = bot.commonDialogs[0].output;
                                        if(typeof output != 'string')
                                        {
                                            output = bot.commonDialogs[0].output[0];
                                        }

                                        output = OutputManager.make(context, output);
                                        outCallback({ type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                                        console.log(chalk.green('================================'));
                                        console.log();
                                    }
                                });
                            }
                            else if(inputRaw == ':reset memory')
                            {
                                context = JSON.parse(context);

                                context = Context.create();
                                that.redis.set(contextKey, JSON.stringify(context), function(err, reply)
                                {
                                    if(err)
                                    {
                                        error.delegate(err);
                                    }
                                    else
                                    {
                                        //테스트 필요
                                        that.redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                                        var output = bot.commonDialogs[0].output;
                                        if(typeof output != 'string')
                                        {
                                            output = bot.commonDialogs[0].output[0];
                                        }

                                        output = OutputManager.make(context, output);
                                        outCallback({ type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                                        console.log(chalk.green('================================'));
                                        console.log();
                                    }
                                });
                            }
                            else if(inputRaw == ':build')
                            {
                                context.returnDialog = undefined;
                                context.dialogCursor = undefined;

                                that.redis.set(contextKey, JSON.stringify(context), function(err, reply)
                                {
                                    if(err)
                                    {
                                        error.delegate(err);
                                    }
                                    else
                                    {
                                        BotManager.reset(botId);
                                        BotManager.load(botId, function(err, bot)
                                        {
                                            if (err)
                                            {
                                                error.delegate(err);
                                            }
                                            else
                                            {
                                                var output = bot.commonDialogs[0].output;
                                                if(typeof output != 'string')
                                                {
                                                    output = bot.commonDialogs[0].output[0];
                                                }

                                                output = OutputManager.make(context, output);
                                                outCallback({ type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});
                                            }
                                        });

                                        console.log(chalk.green('================================'));
                                        console.log();
                                    }
                                });
                            }

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
    };

    module.exports = new Core();
})();
