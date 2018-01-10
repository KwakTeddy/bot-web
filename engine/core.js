var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

(function()
{
    var Engine = function()
    {

    };

    Engine.prototype.loadModels = function()
    {
        var list = fs.readdirSync(path.resolve('./engine/models'));
        for(var i=0; i<list.length; i++)
        {
            require(path.resolve('./engine/models/' + list[i]));
            console.log(chalk.green(list[i]));
        }
    };

    Engine.prototype.init = function()
    {
        console.log();
        console.log(chalk.green('================= Engine Initialize ==================='));

        this.loadModels();

        console.log(chalk.green('===================================================='));
    };

    module.exports = new Engine();
})();

// module.exports.process = function(bot, channel, user, inputRaw, json, outCallback, options, socket)
// {
//
// };
