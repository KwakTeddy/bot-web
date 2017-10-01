var path = require('path');
var moduleLoader = require(path.resolve('./bot-engine/modules/common/module-loader.js'));

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
        moduleLoader.load(path.resolve('./bot-engine/modules/commands'), { postfix: '-command.js' }, function(fileList)
        {
            for(var i=0, l=fileList.length; i<l; i++)
            {
                var command = require(fileList[i]);
                that.commands[command.name] = command.action;
            }
        });
    };

    CommandManager.prototype.execute = function(userInputText)
    {
        this.commands[userInputText]();
    };

    module.exports = new CommandManager();
})();
