var chalk = require('chalk');
var Transaction = require('../utils/transaction.js');

(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.exec = function(bot, context, dialogInstance, callback)
    {
        var name = dialogInstance.task.name;
        if(name && bot.tasks.hasOwnProperty(name))
        {
            var task = bot.tasks[name];

            var transaction = new Transaction.sync();

            console.log();
            console.log(chalk.yellow('[[[ Task ]]]'));

            if(task.paramDefs && Array.instanceOf(task.paramDefs))
            {
                var retryMessage = '';
                for(var i=0; i<task.paramDefs.length; i++)
                {
                    var param = task.paramDefs[i];
                    if(!dialogInstance.userInput.types[param.type])
                    {
                        retryMessage += param.description + '\n';
                    }
                }

                callback(true, retryMessage);
                // [
                //     {name: '휴대폰', type: mobileType, require: false, dialog: '휴대폰Dialog'},
                // ]
            }

            if(typeof task.preCallback == 'function')
            {
                transaction.call(function(done)
                {
                    console.log(chalk.yellow('[[[ Task - preCallback ]]]'));
                    task.preCallback(dialogInstance, context, function(retryMessage)
                    {
                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                });
            }

            if(typeof task.action == 'function')
            {
                transaction.call(function(done)
                {
                    console.log(chalk.yellow('[[[ Task - action ]]]'));
                    task.action(dialogInstance, context, function(retryMessage)
                    {
                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                });
            }

            if(typeof task.postCallback == 'function')
            {
                transaction.call(function(done)
                {
                    console.log(chalk.yellow('[[[ Task - postCallback ]]]'));
                    task.postCallback(dialogInstance, context, function(retryMessage)
                    {
                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                });
            }

            transaction.done = callback;
        }
        else
        {
            callback();
        }
    };

    module.exports = new TaskManager();
})();
