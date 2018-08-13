var request = require('request');
var session = require('express-session');

module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
          
            callback();
        }
    });
};
