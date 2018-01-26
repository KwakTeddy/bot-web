var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var Error = require('./error.js');

var globals = require('./globals.js');
var channel = require('./channel.js');
var loadBalancer = require('./loadbalancer.js');

var SessionManager = require('./session.js');
var BotManager = require('./bot.js');
var InputManager = require('./input.js');
var OutputManager = require('./output.js');

var redis = require(path.resolve('./config/lib/redis.js'));

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

    Core.prototype.process = function(botId, channel, userId, inputRaw, options, outCallback, errCallback)
    {
        var that = this;

        console.log();
        console.log(chalk.green('======== Engine Process ========'));
        console.log('--- Parameters: ');
        console.log({ botId: botId, channel: channel, userId: userId, inputRaw: inputRaw, options: options });

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

                var session = SessionManager.make(botId, userId, channel, options);
                var context = session.context.get();
                context.nlu.sentence = inputRaw;
                context.nlu.inputRaw = inputRaw;

                InputManager.analysis(bot, session, context, error, function()
                {
                    OutputManager.determine(bot, session, context, error, function(output)
                    {
                        console.log('아웃풋 : ', output);
                        outCallback(output);

                        console.log(chalk.green('================================'));
                        console.log();
                    });
                });
            }
        });
    };

    module.exports = new Core();
})();
