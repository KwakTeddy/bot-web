var chalk = require('chalk');
var async = require('async');
const execFile = require('child_process').execFile;

var Logger = require('../logger.js');

var Transaction = require('../utils/transaction.js');

(function()
{
    var TaskManager = function()
    {

    };

    TaskManager.prototype.delegateTask = function(type, bot, task, dialogInstance, context, done, callback)
    {
        var origin = console.log;
        console.log = function()
        {
            origin.apply(null, arguments);
            Logger.analysisLog('task', { logs: arguments }, context.user.userKey);
        };

        const child = execFile('node', ['task-executor.js', type, bot.id, task.name, JSON.stringify(dialogInstance), JSON.stringify(this.makeTempContext(context))], function(error, stdout, stderr)
        {
            if (error) {
                console.error('stderr', stderr);
                throw error;
            }

            var start = stdout.indexOf('[result][start]');
            var end = stdout.indexOf('[result][end]');

            console.log(stdout.substring(0, start));

            stdout = stdout.substring(start + '[result][start]'.length, end);
            var split = stdout.split('\n');

            var isRetry = split[0] === 'undefined' ? undefined : new Boolean(split[1]);
            var retryMessage = split[1] === 'undefined' ? undefined : JSON.parse(split[2]);
            var taskDialogInstance = JSON.parse(split[3]);
            var taskContext = JSON.parse(split[4]);

            for(var key in taskDialogInstance)
            {
                dialogInstance[key] = taskDialogInstance[key];
            }

            for(var key in taskContext.session)
            {
                context.session[key] = taskContext.session[key];
            }

            console.log = origin;

            if(isRetry && retryMessage)
            {
                return callback(isRetry, retryMessage);
            }

            done();
        });
    };

    TaskManager.prototype.makeTempContext = function(context)
    {
        var tempContext = {
            bot: context.bot,
            user: context.user,
            channel: context.channel,
            session: JSON.parse(JSON.stringify(context.session))
        };

        delete tempContext.session.history;
        delete tempContext.session.dialogCursor;
        delete tempContext.session.currentCategory;
        delete tempContext.session.page;
        delete tempContext.session.totalPage;
        delete tempContext.session.isPaging;
        delete tempContext.session.previousDialogCursor;

        return tempContext;
    };

    TaskManager.prototype.executeTask = function(bot, context, dialogInstance, task, callback)
    {
        var that = this;
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
                    that.delegateTask('preCallback', bot, task, dialogInstance, context, done, callback);
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
                    that.delegateTask('action', bot, task, dialogInstance, context, done, callback);
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
                    that.delegateTask('postCallback', bot, task, dialogInstance, context, done, callback);
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
