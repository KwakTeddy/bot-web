var path = require('path');
var moduleLoader = require('./utils/module-loader.js');

(function()
{
    var CommandManager = function()
    {
        this.commands = {};

        this.loadCommands();
    };

    CommandManager.prototype.loadCommands = function()
    {
        var that = this;
        moduleLoader.load(path.resolve('./bot-engine2/commands'), { postfix: '-command.js' }, function(fileList)
        {
            for(var i=0, l=fileList.length; i<l; i++)
            {
                var command = require(fileList[i]);
                that.commands[command.name] = command.action;
            }
        });
    };

    CommandManager.prototype.execute = function(commandName, context, done)
    {
        this.commands[commandName](context, done);
    };

    module.exports = new CommandManager();
})();
