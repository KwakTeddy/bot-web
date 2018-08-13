var chalk = require('chalk');

var ContextManager = require('../context.js');

(function()
{
    var ActionManager = function()
    {
        this.dm = undefined;
    };

    ActionManager.prototype.makeOption = function(resultOutput)
    {
        var options = {};
        if(resultOutput.text)
        {
            options.outputPrefixText = resultOutput.prefixText;
            options.outputText = resultOutput.text;
            options.outputPostfixText = resultOutput.postfixText;
        }

        return options;
    };

    ActionManager.prototype.repeat = function(bot, context, dialogInstance, resultOutput, callback)
    {
        // Repeat을 위한 다이얼로그 인스턴스가 실행되어 history에 쌓였으므로 제거해준다.
        context.session.history.splice(0, 1);

        // Repeat은 무조건 부모 다이얼로그를 실행한다.
        var parent = bot.parentDialogMap[dialogInstance.id];
        if(parent)
        {
            context.session.dialogCursor = parent.id;

            console.log();
            console.log(chalk.yellow('[[[ Action - repeat ]]]'));
            console.log(parent.id, parent.name);

            var tempDialogInstance = ContextManager.createDialogInstance(parent, dialogInstance.userInput);
            tempDialogInstance.options = this.makeOption(resultOutput);

            this.dm.exec(bot, context, tempDialogInstance, callback);
        }
        else
        {
            console.log();
            console.log(chalk.yellow('[[[ Action - repeat ]]]'));
            console.log('prev is undefined');

            callback();
        }
    };

    ActionManager.prototype.up = function(bot, context, dialogInstance, resultOutput, callback)
    {
        context.session.history.splice(0, 1);

        var parent = bot.parentDialogMap[context.session.previousDialogCursor];
        if(parent)
        {
            context.session.dialogCursor = parent.id;

            console.log();
            console.log(chalk.yellow('[[[ Action - up ]]]'));
            console.log(parent.id, parent.name);

            var tempDialogInstance = ContextManager.createDialogInstance(parent, dialogInstance.userInput);
            tempDialogInstance.options = this.makeOption(resultOutput);

            this.dm.execWithRecord(bot, context, tempDialogInstance, callback);
        }
        else
        {
            console.log();
            console.log(chalk.yellow('[[[ Action - up ]]]'));
            console.log('prev is undefined');

            callback();
        }
    };

    ActionManager.prototype.back = function(bot, context, dialogInstance, resultOutput, callback)
    {
        context.session.history.splice(0, 2); // up을 입력해서 실행한 카드, 그 전에 실행한 카드, 그 이전으로 돌아가야 하므로 앞 2개를 제거한다.

        var parent = context.session.history[0];
        if(parent)
        {
            context.session.dialogCursor = parent.id;

            console.log();
            console.log(chalk.yellow('[[[ Action - back ]]]'));
            console.log(parent.id, parent.name);

            this.dm.exec(bot, context, parent, callback);
        }
        else
        {
            console.log();
            console.log(chalk.yellow('[[[ Action - back ]]]'));
            console.log('prev is undefined');

            callback();
        }
    };

    ActionManager.prototype.call = function(bot, context, dialogInstance, resultOutput, callback)
    {
        if(resultOutput.dialogId)
        {
            var matchedDialog = bot.dialogMap[resultOutput.dialogId];
            if(matchedDialog)
            {
                var tempDialogInstance = ContextManager.createDialogInstance(matchedDialog, dialogInstance.userInput);
                tempDialogInstance.options = this.makeOption(resultOutput);

                //console.log();
                //console.log(chalk.yellow('[[[ Action - call ]]]'));
                //console.log(tempDialogInstance);

                // dialogInstance.nextCall = tempDialogInstance;
                // tempDialogInstance.prevCall = dialogInstance;

                context.session.dialogCursor = tempDialogInstance.id;

                this.dm.exec(bot, context, tempDialogInstance, callback);
            }
            else
            {
                callback({ text: 'Call 타겟을 찾을 수 없습니다.' });
            }
        }
        else
        {
            callback({ text: 'Call 타겟을 찾을 수 없습니다.' });
        }
    };

    ActionManager.prototype.callChild = function(bot, context, dialogInstance, resultOutput, callback)
    {
        var that = this;
        var dialog = bot.dialogMap[resultOutput.dialogId];
        this.dm.findDialog(bot, context, dialogInstance.userInput, dialogInstance.userInput.intents, dialogInstance.userInput.entities, dialog.children, function(matchedDialog)
        {
            context.session.dialogCursor = dialog.id;

            if(matchedDialog)
            {
                console.log();
                console.log(chalk.yellow('[[[ Action - callChild ]]]'));
                console.log(matchedDialog.id);

                var tempDialogInstance = ContextManager.createDialogInstance(matchedDialog, dialogInstance.userInput);
                tempDialogInstance.options = that.makeOption(resultOutput);

                // dialogInstance.nextCall = tempDialogInstance;
                // tempDialogInstance.prevCall = dialogInstance;

                context.session.dialogCursor = tempDialogInstance.id;

                that.dm.exec(bot, context, tempDialogInstance, callback);
            }
            else
            {
                callback({ text: '검색된 결과가 없습니다'});
            }
        });
    };

    ActionManager.prototype.returnCall = function(bot, context, dialogInstance, resultOutput, callback)
    {
        context.session.returnDialog = dialogInstance.id;

        var matchedDialog = bot.dialogMap[resultOutput.dialogId];
        if(matchedDialog)
        {
            console.log();
            console.log(chalk.yellow('[[[ Action - returnCall ]]]'));
            console.log(matchedDialog.id);

            var tempDialogInstance = ContextManager.createDialogInstance(matchedDialog, dialogInstance.userInput);
            tempDialogInstance.options = this.makeOption(resultOutput);

            context.session.dialogCursor = tempDialogInstance.id;

            // dialogInstance.nextCall = tempDialogInstance;
            // tempDialogInstance.prevCall = dialogInstance;

            this.dm.exec(bot, context, tempDialogInstance, callback);
        }
        else
        {
            callback({ text: 'Return Call 타겟을 찾을 수 없습니다.' });
        }
    };

    ActionManager.prototype.return = function(bot, context, dialogInstance, resultOutput, callback)
    {
        if(context.session.returnDialog)
        {
            var matchedDialog = bot.parentDialogMap[context.session.returnDialog];
            if(matchedDialog)
            {
                console.log();
                console.log(chalk.yellow('[[[ Action - return ]]]'));
                console.log(matchedDialog.id);

                var tempDialogInstance = ContextManager.createDialogInstance(matchedDialog, dialogInstance.userInput);

                context.session.dialogCursor = tempDialogInstance.id;

                this.dm.exec(bot, context, tempDialogInstance, callback);
            }
            else
            {
                callback({ text: 'Return 타겟을 찾을 수 없습니다.' });
            }
        }
        else
        {
            console.log();
            console.log(chalk.yellow('[[[ Action - return ]]]'));
            console.log('context.returnDialog is undefined');

            callback(null);
        }
    };

    ActionManager.prototype.exec = function(bot, context, dialogInstance, resultOutput, callback)
    {
        if(this[resultOutput.type])
        {
            this[resultOutput.type](bot, context, dialogInstance, resultOutput, callback);
        }
        else
        {
            callback(resultOutput.type + '실행할 수 없는 액션입니다');
        }
    };

    module.exports = new ActionManager();
})();
