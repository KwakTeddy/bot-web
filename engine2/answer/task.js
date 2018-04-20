var chalk = require('chalk');
var async = require('async');

var Logger = require('../logger.js');

var Transaction = require('../utils/transaction.js');

(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.executeTask = function(bot, context, dialogInstance, task, callback)
    {
        if(task.extends)
        {
            task = this.getExtendsTask(bot, task);
            if(!task)
            {
                console.log(task.extends + ' is unsupported.');
                return callback();
            }
        }

        var transaction = new Transaction.sync();

        if(typeof task.preCallback == 'function')
        {
            transaction.call(function(done)
            {
                try
                {
                    console.log(chalk.yellow('[[[ Task - preCallback ]]]'));

                    var origin = console.log;
                    console.log = function()
                    {
                        origin.apply(null, arguments);
                        Logger.analysisLog('task', { logs: arguments }, context.user.userKey);
                    };

                    task.preCallback.call(task, dialogInstance, context, function(retryMessage)
                    {
                        console.log = origin;
                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                }
                catch(err)
                {
                    console.error(err);
                    Logger.analysisLog('task', { logs: JSON.stringify(err) }, context.user.userKey);
                }
            });
        }

        if(typeof task.action == 'function')
        {
            transaction.call(function(done)
            {
                try
                {
                    console.log(chalk.yellow('[[[ Task - action ]]]'));

                    var origin = console.log;
                    console.log = function()
                    {
                        origin.apply(null, arguments);
                        Logger.analysisLog('task', { logs: arguments }, context.user.userKey);
                    };

                    task.action.call(task, dialogInstance, context, function(retryMessage)
                    {
                        console.log = origin;
                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                }
                catch(err)
                {
                    console.error(err);
                    Logger.analysisLog('task', { logs: JSON.stringify(err) }, context.user.userKey);
                }
            });
        }

        if(typeof task.postCallback == 'function')
        {
            transaction.call(function(done)
            {
                try
                {
                    console.log(chalk.yellow('[[[ Task - postCallback ]]]'));

                    var origin = console.log;
                    console.log = function()
                    {
                        origin.apply(null, arguments);
                        Logger.analysisLog('task', { logs: arguments }, context.user.userKey);
                    };

                    task.postCallback.call(task, dialogInstance, context, function(retryMessage)
                    {
                        console.log = origin;

                        if(retryMessage)
                        {
                            return callback(true, retryMessage);
                        }

                        done();
                    });
                }
                catch(err)
                {
                    console.error(err);
                    Logger.analysisLog('task', { logs: JSON.stringify(err) }, context.user.userKey);
                }
            });
        }

        transaction.done(function()
        {
            callback();
        });
    };

    TaskManager.prototype.getExtendsTask = function(bot, task)
    {
        var parentTask = undefined;
        if(typeof task.extends == 'string')
        {
            parentTask = bot.tasks[task.extends];
        }
        else if(typeof task.extends == 'object')
        {
            parentTask = task.extends;
        }
        else
        {
            return;
        }

        var clone = {};
        for(var key in parentTask)
        {
            clone[key] = parentTask[key];
        }

        for(var key in task)
        {
            if(key != 'extends')
            {
                clone[key] = task[key];
            }
        }

        return clone;
    };

    TaskManager.prototype.exec = function(bot, context, dialogInstance, callback)
    {
        var that = this;

        var name = dialogInstance.task.name;
        if(name && bot.tasks.hasOwnProperty(name))
        {
            var task = bot.tasks[name];

            console.log();
            if(task.paramDefs && Array.isArray(task.paramDefs))
            {
                context.session.retryInput = [];

                var retryMessage = '';
                for(var i=0; i<task.paramDefs.length; i++)
                {
                    var param = task.paramDefs[i];
                    if(!dialogInstance.userInput.types[param.type])
                    {
                        context.session.retryInput.push(param.type);
                        retryMessage += param.description + '\n';
                    }
                }

                if(retryMessage)
                {
                    return callback(true, retryMessage);
                }
            }
            else
            {
                delete context.session.retryInput;
            }

            if(Array.isArray(task.action))
            {
                async.eachSeries(task.action, function(t, next)
                    {
                        if(typeof t == 'function')
                        {
                            try
                            {
                                t.call(t, dialogInstance, context, next);
                            }
                            catch(err)
                            {
                                console.error(err);
                                Logger.analysisLog('task', { logs: JSON.stringify(err) }, context.user.userKey);
                            }
                        }
                        else if(typeof t == 'string')
                        {
                            var target = bot.tasks[t];
                            if(target)
                            {
                                that.executeTask(bot, context, dialogInstance, target, next);
                            }
                            else
                            {
                                console.log(t + ' is undefined');
                                next();
                            }
                        }
                        else if(typeof t == 'object')
                        {
                            that.executeTask(bot, context, dialogInstance, t, next);
                        }
                    },
                    function()
                    {
                        callback();
                    });
            }
            else
            {
                this.executeTask(bot, context, dialogInstance, task, callback);
            }
        }
        else
        {
            Logger.analysisLog('task', { logs: name + ' undefined' }, context.user.userKey);
            callback();
        }
    };

    module.exports = new TaskManager();
})();
