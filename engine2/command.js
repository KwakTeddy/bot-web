var chalk = require('chalk');

var OutputManager = require('./output.js');
var ContextManager = require('./context.js');
var BotManager = require('./bot.js');
var DialogGraphManager = require('./answer/dm.js');

(function()
{
    var CommandManager = function()
    {

    };

    CommandManager.prototype.resetUser = function(redis, contextKey, bot, context, error, callback)
    {
        context.returnDialog = undefined;
        context.session.dialogCursor = undefined;
        context.session.history = [];

        var dialogInstance = ContextManager.createDialogInstance(bot.commonDialogs[0], {});
        DialogGraphManager.execWithRecord(bot, context, dialogInstance, function(output)
        {
            redis.set(contextKey, JSON.stringify(context), function(err, reply)
            {
                if(err)
                {
                    error.delegate(err);
                }
                else
                {
                    redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                    output = OutputManager.make(context, {}, output);
                    callback(null, { type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                    console.log(chalk.green('================================'));
                    console.log()
                }
            });
        });
    };

    CommandManager.prototype.resetMemory = function(redis, contextKey, bot, error, callback)
    {
        var context = ContextManager.create();
        BotManager.reset(bot.id);
        BotManager.load(bot.id, function(err, bot)
        {
            if (err)
            {
                error.delegate(err);
            }
            else
            {
                var dialogInstance = ContextManager.createDialogInstance(bot.commonDialogs[0], {});
                DialogGraphManager.execWithRecord(bot, context, dialogInstance, function(output)
                {
                    redis.set(contextKey, JSON.stringify(context), function(err, reply)
                    {
                        if(err)
                        {
                            error.delegate(err);
                        }
                        else
                        {
                            //테스트 필요
                            redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                            output = OutputManager.make(context, {}, output);
                            callback(null, { type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                            console.log(chalk.green('================================'));
                            console.log();
                        }
                    });
                });
            }
        });
    };

    CommandManager.prototype.buildBot = function(redis, contextKey, bot, context, error, callback)
    {
        context.returnDialog = undefined;
        context.session.dialogCursor = undefined;

        BotManager.reset(bot.id);
        BotManager.load(bot.id, function(err, bot)
        {
            if (err)
            {
                error.delegate(err);
            }
            else
            {
                var dialogInstance = ContextManager.createDialogInstance(bot.commonDialogs[0], {});
                DialogGraphManager.execWithRecord(bot, context, dialogInstance, function(output)
                {
                    redis.set(contextKey, JSON.stringify(context), function(err, reply)
                    {
                        if(err)
                        {
                            error.delegate(err);
                        }
                        else
                        {
                            //테스트 필요
                            redis.expireat(contextKey, parseInt((+new Date)/1000) + (1000 * 60 * 5));

                            output = OutputManager.make(context, {}, output);
                            callback(null, { type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                            console.log(chalk.green('================================'));
                            console.log();
                        }
                    });
                });
            }
        });
    };

    CommandManager.prototype.reloadBotFiles = function(bot, context, error, callback)
    {
        BotManager.load(bot.id, function(err, bot)
        {
            if(err)
            {
                error.delegate(err);
            }
            else
            {
                BotManager.reloadBotFiles(bot);

                var dialogInstance = ContextManager.createDialogInstance(bot.commonDialogs[0], {});
                DialogGraphManager.execWithRecord(bot, context, dialogInstance, function(output)
                {
                    output = OutputManager.make(context, { }, output);
                    callback(null, { type: 'dialog', dialogId: bot.commonDialogs[0].id, output: output});

                    console.log(chalk.green('================================'));
                    console.log();
                });

                console.log(chalk.green('================================'));
                console.log();
            }
        });
    };

    CommandManager.prototype.execute = function(redis, contextKey, inputRaw, bot, context, error, callback)
    {
        //FIXME 커맨드 실행
        console.log();
        console.log(chalk.yellow('[[[ Execute Command ]]]'));
        console.log(inputRaw);

        if(inputRaw == ':reset user')
        {
            this.resetUser(redis, contextKey, bot, context, error, callback);
        }
        else if(inputRaw == ':reset memory')
        {
            this.resetMemory(redis, contextKey, bot, error, callback);
        }
        else if(inputRaw == ':build')
        {
            this.buildBot(redis, contextKey, bot, context, error, callback);
        }
        else if(inputRaw == ':reload-bot-files')
        {
            bot.dialogs = [];
            bot.commonDialogs = [];
            context.session.dialogCursor = undefined;
            this.reloadBotFiles(bot, context, error, callback);
        }
        else
        {
            callback(context, inputRaw + ' is not command');
        }
    };

    module.exports = new CommandManager();
})();
