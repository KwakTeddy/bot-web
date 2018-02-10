var chalk = require('chalk');
var async = require('async');

var Transaction = require('../utils/transaction.js');

(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.executeTask = function(context, dialogInstance, task, callback)
    {
        var transaction = new Transaction.sync();

        if(typeof task.preCallback == 'function')
        {
            transaction.call(function(done)
            {
                console.log(chalk.yellow('[[[ Task - preCallback ]]]'));
                task.preCallback.call(task, dialogInstance, context, function(retryMessage)
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
                task.action.call(task, dialogInstance, context, function(retryMessage)
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
                task.postCallback.call(task, dialogInstance, context, function(retryMessage)
                {
                    if(retryMessage)
                    {
                        return callback(true, retryMessage);
                    }

                    done();
                });
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

            if(Array.isArray(task.actions))
            {
                async.eachSeries(task.actions, function(t, next)
                {
                    if(typeof t == 'function')
                    {
                        t.call(t, dialogInstance, context, next);
                    }
                    else if(typeof t == 'string')
                    {
                        var target = bot.tasks[t];
                        if(target)
                        {
                            if(target.extends)
                            {
                                var extendsTask = this.getExtendsTask(bot, target);
                                if(!extendsTask)
                                {
                                    console.log(target.extends + ' is unsupported.');
                                    return next();
                                }

                                that.executeTask(context, dialogInstance, extendsTask, next);
                            }
                            else
                            {
                                that.executeTask(context, dialogInstance, target, next);
                            }
                        }
                        else
                        {
                            console.log(t + ' is undefined');
                            next();
                        }
                    }
                    else if(typeof t == 'object')
                    {
                        if(t.extends)
                        {
                            var extendsTask = this.getExtendsTask(bot, t);
                            if(!extendsTask)
                            {
                                console.log(t.extends + ' is unsupported.');
                                return next();
                            }

                            that.executeTask(context, dialogInstance, extendsTask, next);
                        }
                        else
                        {
                            that.executeTask(context, dialogInstance, t, next);
                        }
                    }
                },
                function()
                {
                    callback();
                });
            }
            else if(task.extends)
            {
                var extendsTask = this.getExtendsTask(bot, task);
                if(!extendsTask)
                {
                    console.log(task.extends + ' is unsupported.');
                    callback();
                }

                this.executeTask(context, dialogInstance, extendsTask, callback);
            }
            else
            {
                this.executeTask(context, dialogInstance, task, callback);
            }
        }
        else
        {
            callback();
        }
    };

    module.exports = new TaskManager();
})();
