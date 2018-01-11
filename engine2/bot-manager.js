var fs = require('fs');
var _ = require('lodash');

var Config = require('./config.js');
var utils = require('./utils/utils.js');

var BotObject = require('./bot.js');

(function()
{
    var BotManager = function()
    {
        this.bots = {};
    };

    BotManager.prototype.load = function(botId, callback)
    {
        console.log();
        console.log('----- Loading Bot : ', botId, ' [Start]');
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
                    that.loadBotFiles(botDir);
                    callback(null, bot);

                    console.log('----- Loading Bot : ', botId, ' [End]');
                })
            }
        }
    };

    BotManager.prototype.loadBotFiles = function(botDir)
    {
        //제일먼저 .bot.js 파일을 로딩하고나서 그래프 등의 로직파일을 로딩한다.
        var files = fs.readdirSync(botDir);
        for(var i=0; i<files.length; i++)
        {
            if(files[i].endsWith('.bot.js'))
            {
                console.log('Loading : ', files[i]);
                utils.requireNoCache(botDir + '/' + files[i], true);
                files.splice(i, 1);
                break;
            }
        }

        for(var i=0; i<files.length; i++)
        {
            if(files[i].endsWith('.js'))
            {
                console.log('Loading : ', files[i]);
                utils.requireNoCache(botDir + '/' + files[i], true);
            }
        }
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
