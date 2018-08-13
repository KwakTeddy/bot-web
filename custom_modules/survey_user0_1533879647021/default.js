module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
          	console.log(JSON.stringify(context.session.history))
            callback();
        }
    });
};
