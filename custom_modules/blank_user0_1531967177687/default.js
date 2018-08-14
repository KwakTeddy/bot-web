var request = require('request');
var async = require('async');
var path = require('path');

module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
          
            callback();
        }
    });

      bot.setTask('noanswerTask', 
        {
            action: function (dialog, context, callback)
            {
              console.log('noanswerTask')
              console.log(dialog)
                callback();

            }
        });
};
