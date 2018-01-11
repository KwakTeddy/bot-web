var chalk = require('chalk');

(function()
{
    var Logger = function()
    {

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

    Logger.prototype.error = function(err)
    {
        console.error();
        console.error(chalk.red('======== Engine Error ' + this.now() + ' ========'));
        console.error(err);
        console.error(chalk.red('================================'));
        console.error();
    };

    module.exports = new Logger();
})();
