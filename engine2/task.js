(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.exec = function(bot, session, context, output, name, callback)
    {
        if(name && bot.tasks.hasOwnProperty(name))
        {
            var task = bot.tasks[name];
            if(typeof task.action == 'function')
            {
                task.action(session.userData, context, output, function()
                {
                    callback();
                });

                return;
            }
        }

        callback();
    };

    module.exports = new TaskManager();
})();
