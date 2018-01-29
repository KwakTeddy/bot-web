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

        var error = new Error(errCallback);

        BotManager.load(botId, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                if(inputRaw.startsWith(':'))
                {
                    //FIXME 커맨드 실행
                    console.log(chalk.green('================================'));
                    console.log();

                    if(inputRaw == ':reset user')
                    {
                        outCallback(bot.commonDialogs[0].output[0]);
                    }
                    else if(inputRaw == ':build')
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
                                outCallback(bot.commonDialogs[0].output[0]);
                            }
                        });
                    }

                    return;
                }

                var sessionKey = channel + '_' + botId + '_' + userKey;
                that.redis.get(sessionKey, function(err, session)
                {
                    if(err)
                    {
                        error.delegate(err);
                    }
                    else
                    {
                        if(!session)
                        {
                            session = {};
                            session.userKey = userKey;
                            session.botId = botId;
                            session.channel = channel;
                            session.userData = {};
                            session.contexts = [];
                            session.returnDialog = undefined;
                            session.dialogCursor = undefined;
                        }
                        else
                        {
                            session = JSON.parse(session);
                        }

                        var context = Context.make({});
                        session.contexts.splice(0, 0, context);

                        for(var i=0; i<session.contexts.length; i++)
                        {
                            if(i < session.contexts.length - 1)
                            {
                                session.contexts[i].prev = session.contexts[i+1];
                            }
                        }

                        context.nlu.sentence = inputRaw;

                        InputManager.analysis(bot, context, error, function()
                        {
                            OutputManager.determine(bot, session, context, error, function(output)
                            {
                                console.log('아웃풋 : ', output);

                                for(var i=0; i<session.contexts.length; i++)
                                {
                                    delete session.contexts[i].prev;
                                }

                                that.redis.set(sessionKey, JSON.stringify(session), function(err, reply)
                                {
                                    if(err)
                                    {
                                        error.delegate(err);
                                    }
                                    else
                                    {
                                        //테스트 필요
                                        that.redis.expireat(sessionKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                                        outCallback(output);

                                        console.log('세션저장 : ', reply);
                                        console.log(chalk.green('================================'));
                                        console.log();
                                    }
                                });
                            });
                        });
                    }
                });

                // var session = SessionManager.make(botId, userKey, channel, options);
                // var context = session.context.get();
                // context.nlu.sentence = inputRaw;
                // context.nlu.inputRaw = inputRaw;
            }
        });
    };

    module.exports = new Core();
})();
