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

                    if(!output)
                    {
                        var dialog = bot.dialogMap['noanswer'];
                        output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
                    }

                    output = OutputManager.make(context, {}, {}, output);
                    callback(null, { type: 'command', dialogId: context.session.dialogCursor, output: output});
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
                context.bot = bot;
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

                            if(!output)
                            {
                                var dialog = bot.dialogMap['noanswer'];
                                output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
                            }

                            output = OutputManager.make(context, {}, {}, output);
                            callback(null, { type: 'command', dialogId: context.session.dialogCursor, output: output});
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
                context.bot = bot;
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

                            if(!output)
                            {
                                var dialog = bot.dialogMap['noanswer'];
                                output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
                            }

                            output = OutputManager.make(context, {}, {}, output);
                            callback(null, { type: 'command', dialogId: context.session.dialogCursor, output: output});
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
                    if(!output)
                    {
                        var dialog = bot.dialogMap['noanswer'];
                        output = dialog.output[Math.floor(Math.random() * dialog.output.length)];
                    }

                    output = OutputManager.make(context, {}, {}, output);
                    callback(null, { type: 'command', dialogId: context.session.dialogCursor, output: output});
                });
            }
        });
    };

    CommandManager.prototype.execute = function(redis, contextKey, inputRaw, bot, context, error, callback)
    {
        //FIXME 커맨드 실행
        //console.log();
        //console.log(chalk.yellow('[[[ Execute Command ]]]'));
        //console.log(inputRaw);

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
        else if(inputRaw == ':humanWriteMode' || inputRaw == ':aiWriteMode')
        {
            bot.options.isHuman = (inputRaw == ':humanWriteMode' ? true : false);
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

                    // callback(null, { type: 'dialog', output: { kind: 'Content', text: '상담원과 연결되었습니다.' }});

                    //console.log(chalk.green('================================'));
                    //console.log();
                }
            });
        }
        else if(inputRaw == ':humanViewMode')
        {
            if(bot.options.isHuman)
            {
                callback(null, { type: 'setMode', mode: 'human' });
            }
            else
            {
                callback(null, { type: 'setMode', mode: 'ai' });
            }
        }
        else
        {
            callback(context, inputRaw + ' is not command');
        }
    };

    module.exports = new CommandManager();
})();
