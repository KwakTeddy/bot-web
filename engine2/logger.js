var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

var mongoose = require('mongoose');
var BotUser = mongoose.model('BotUser');

(function()
{
    var Logger = function()
    {
    };

    Logger.prototype.logBotUser = function(botId, channel, userKey, data)
    {
        BotUser.findOne({ botId: botId, channel: channel, userKey: userKey }).exec(function(err, data)
        {
            if(err || !data)
            {

            }
            else
            {
                if(!fs.existsSync(path.resolve('./logs')))
                {
                    fs.mkdirSync(path.resolve('./logs'));
                }

                fs.writeFileSync(path.resolve('./logs') + '/botUser-' + botId + '_' + userKey + '_' + channel, JSON.stringify(data || {}));
            }
        });
    };

    Logger.prototype.now = function()
    {
        var now = new Date();

        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();

        var hour = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();

        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;

        return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    };

    Logger.prototype.log = function()
    {
        console.log();
        console.log(chalk.green('================ Engine Error ' + this.now() + ' ================'));
        console.log.apply(null, arguments);
        console.log(chalk.green('=================================================================='));
        console.log();
    };

    Logger.prototype.error = function(err)
    {
        console.error();
        console.error(chalk.red('================ Engine Error ' + this.now() + ' ================'));
        console.error(err);
        console.error(chalk.red('=================================================================='));
        console.error();
    };

    module.exports = new Logger();
})();
