var fs = require('fs');
var chalk = require('chalk');

var Config = require('./config.js');
var utils = require('./utils/utils.js');

var BotObject = require('./bot/bot.js');

(function()
{
    var BotManager = function()
    {
        this.bots = {};
    };

    BotManager.prototype.load = function(botId, callback)
    {
        console.log();
        console.log(chalk.yellow('[[[ Bot loading ]]]'));
        var that = this;
        if(this.bots[botId])
        {
            callback(null, this.bots[botId]);
        }
        else
        {
            var botDir = Config.path.bots + '/' + botId;
            if(!fs.existsSync(botDir))
            {
                callback(botDir + ' is not found')
            }
            else
            {
                var bot = new BotObject(botId);
                bot.loadBotData(function(err)
                {
                    if(err)
                    {
                        return callback(err);
                    }

                    that.bots[botId] = bot;
                    that.loadBotFiles(bot, botDir);

                    callback(null, bot);
                })
            }
        }
    };

    BotManager.prototype.reset = function(botId)
    {
        this.bots[botId] = undefined;
    };

    BotManager.prototype.reloadBotFiles = function(bot)
    {
        var botDir = Config.path.bots + '/' + bot.id;
        this.loadBotFiles(bot, botDir);
    };

    BotManager.prototype.loadBotFiles = function(bot, botDir)
    {
        //제일먼저 .bot.js 파일을 로딩하고나서 그래프 등의 로직파일을 로딩한다.
        var files = fs.readdirSync(botDir);
        for(var i=0; i<files.length; i++)
        {
            console.log('Loading : ', files[i]);
            if(files[i].endsWith('.js'))
            {
                utils.requireNoCache(botDir + '/' + files[i], true)((files[i].endsWith('bot.js') ? bot.options : bot));
            }
        }

        console.log('options: ', bot.options);
    };
    
    BotManager.prototype.setOptions = function(botId, options)
    {
        var bot = this.bots[botId];
        bot.options = options;
    };

    BotManager.prototype.getBot = function(botId)
    {
        return this.bots[botId];
    };

    // BotManager.prototype.getBot = function(bot)
    // {
    //     return Context.bots[bot];
    // };

    module.exports = new BotManager();
})();
