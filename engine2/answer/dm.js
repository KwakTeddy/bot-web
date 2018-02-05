var async = require('async');
var chalk = require('chalk');

var Transaction = require('../utils/transaction.js');
var utils = require('../utils/utils.js');

var TaskManager = require('./task.js');
var Globals = require('../globals.js');

(function()
{
    var DialogGraphManager = function()
    {

    };

    DialogGraphManager.prototype.checkInputText = function(nlpText, text)
    {
        var words = text.split(/\s/);
        for(var i=0; i<words.length; i++)
        {
            var word = RegExp.escape(words[i]);
            if(nlpText.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) != -1)
            {
                return true;
            }
        }

        return false;
    };

    DialogGraphManager.prototype.checkEntities = function(src, dest)
    {
        if(Array.isArray(src))
        {
            for(var i in src)
            {
                for(var key in dest)
                {
                    if(src[i] == key)
                    {
                        return true;
                    }
                }
            }
        }
        else
        {
            for(var key in dest)
            {
                if(src == key)
                {
                    return true;
                }
            }
        }

        return false;
    };

    DialogGraphManager.prototype.findDialog = function(bot, context, dialog, intents, entities, dialogs, callback)
    {
        var that = this;

        var selectedDialog = [];

        var nlpText = dialog.input.nlpText;
        async.eachSeries(dialogs, function(originalDialog, next)
        {
            if(!originalDialog.matchCount)
            {
                originalDialog.matchCount = 0;
            }

            var inputs = originalDialog.input;
            if(!inputs || !inputs.length || inputs.length <= 0)
            {
                return next();
            }

            async.eachSeries(inputs, function(input, next)
            {
                var result = true;

                var keyList = [];
                for(var key in input)
                {
                    keyList.push(key);
                }

                if(keyList.length <= 0)
                {
                    result = false;
                }

                async.eachSeries(keyList, function(key, next)
                {
                    if(key == 'text')
                    {
                        var check = that.checkInputText(nlpText, input.text.nlp);
                        if(check)
                        {
                            originalDialog.matchCount++;
                        }

                        result = result && check;
                    }
                    else if(key == 'entities')
                    {
                        var check = that.checkEntities(input.entities, entities);
                        if(check)
                        {
                            originalDialog.matchCount++;
                        }

                        result = result && check;
                    }
                    else if(key == 'intent')
                    {
                        var check = (intents.length > 0 && input.intent == intents[0].intentName);
                        if(check)
                        {
                            originalDialog.matchCount++;
                        }

                        result = result && check;
                    }
                    else if(key == 'types')
                    {
                        var type = bot.types[input[key]];
                        if(!type)
                        {
                            type = Globals.types[input[key]];
                        }

                        type.typeCheck.call(type, dialog, context, function(matched, parsed, retry) //TODO retry가 true면 해당 input을 다시 입력받도록 질의 한다. 만약 필요한 값이 더 있다면 그 값도 요구할 수 있다. retry : ['주민등록번로를 다시 입력해주세요 YYMMDD']
                        {
                            if(matched)
                            {
                                result = result && true;

                                originalDialog.matchCount++;

                                if(parsed)
                                {
                                    dialog.input.types[type.name] = parsed;
                                }
                            }
                            else
                            {
                                result = false;
                            }

                            next();
                        });

                        return;
                    }
                    else if(key == 'if')
                    {
                        result = result && (function(dialog, context, input)
                        {
                            if(eval('result = (' + input.if + ' ? true : false);'))
                            {
                                originalDialog.matchCount++;
                                return true;
                            }

                            return false;

                        })(dialog, context, input);
                    }
                    else
                    {
                        result = false;
                    }

                    next();
                },
                function()
                {
                    if(result)
                    {
                        // return callback(originalDialog);
                        selectedDialog.push(originalDialog);
                    }

                    next();
                });
            },
            function()
            {
                next();
            });
        },
        function()
        {
            console.log('오리지날 : ', selectedDialog);

            selectedDialog.sort(function(a, b)
            {
                return b.matchCount - a.matchCount;
            });

            for(var i=0; i<dialogs.length; i++)
            {
                delete dialogs[i].matchCount;
            }

            if(selectedDialog.length > 0)
            {
                callback(selectedDialog[0]);
            }
            else
            {
                callback();
            }
        });
    };

    DialogGraphManager.prototype.getNextDialogs = function(cursor, dialogs)
    {
        for(var i=0; i<dialogs.length; i++)
        {
            if(dialogs[i].id == cursor)
            {
                return dialogs[i].children;
            }
            else if(dialogs[i].children)
            {
                var children = this.getNextDialogs(cursor, dialogs[i].children);
                if(children)
                {
                    return children;
                }
            }
        }
    };

    DialogGraphManager.prototype.find = function(bot, context, dialog, callback)
    {
        var that = this;

        var intents = dialog.input.intents;
        var entities = dialog.input.entities;

        var transaction = new Transaction.sync();

        var foundDialog = undefined;
        transaction.call(function(done)
        {
            if(!foundDialog)
            {
                that.findDialog(bot, context, dialog, intents, entities, bot.commonDialogs, function(result)
                {
                    foundDialog = result;
                    done();
                });
            }
            else
            {
                done();
            }
        });

        transaction.call(function(done)
        {
            if(context.session.dialogCursor && !foundDialog)
            {
                var dialogs = that.getNextDialogs(context.session.dialogCursor, bot.commonDialogs);
                if(!dialogs)
                {
                    dialogs = that.getNextDialogs(context.session.dialogCursor, bot.dialogs);
                }

                if(dialogs)
                {
                    that.findDialog(bot, context, dialog, intents, entities, dialogs, function(result)
                    {
                        foundDialog = result;
                        done();
                    });
                }
                else
                {
                    done();
                }
            }
            else
            {
                done();
            }
        });

        transaction.call(function(done)
        {
            if(!foundDialog)
            {
                that.findDialog(bot, context, dialog, intents, entities, bot.dialogs, function(result)
                {
                    foundDialog = result;
                    done();
                });
            }
            else
            {
                done();
            }
        });

        transaction.done(function()
        {
            callback(null, foundDialog);
        });
    };

    DialogGraphManager.prototype.exec = function(bot, context, dialog, callback)
    {
        context.session.previousDialogId = context.session.currentDialogId;
        context.session.currentDialogId = dialog.id;

        console.log();
        console.log(chalk.yellow('[[[ Execute DialogGraph ]]]'));

        var that = this;

        context.session.dialogCursor = dialog.id;

        var output = [];
        for(var i=0; i<dialog.originalOutput.length; i++)
        {
            output.push(dialog.originalOutput[i]);
        }

        dialog.output = output;

        var sync = new Transaction.sync();
        sync.dialog = dialog;
        if(dialog.task)
        {
            sync.call(function(done)
            {
                TaskManager.exec(bot, context, sync.dialog, dialog.task.name, done);
            });
        }

        sync.done(function()
        {
            var dialog = sync.dialog;
            var dialogId = dialog.id;
            var output = dialog.output;

            if(typeof output == 'string')
            {
                // TASK에서 string으로 output을 강제로 넣은경우
                output = { kind: 'Content', text: output };
            }

            if(output.length > 0)
            {
                var resultOutput = undefined;
                var elseList = [];

                for(var i=0; i<output.length; i++)
                {
                    if(!resultOutput && output[i].if)
                    {
                        if(output.length == 1)
                        {
                            resultOutput = output[i];
                        }
                        else
                        {
                            (function(context, dialog, o)
                            {
                                try
                                {
                                    var result = false;
                                    eval('result = (' + o.if + ' ? true : false);');

                                    if(result)
                                    {
                                        resultOutput = o;
                                    }
                                }
                                catch(err)
                                {
                                    console.error(chalk.red(err));
                                }
                            })(context, dialog, output[i]);
                        }
                    }
                    else if(!output[i].if)
                    {
                        elseList.push(output[i]);
                    }
                }

                if(!resultOutput)
                {
                    resultOutput = elseList[utils.getRandomInt(0, elseList.length-1)];
                    output.output = resultOutput;
                }
            }
            else
            {
                resultOutput = output;
            }

            console.log();
            console.log(chalk.yellow('[[[ Output ]]]'));
            console.log(resultOutput);

            if(resultOutput.kind == 'Action')
            {
                if(resultOutput.type == 'repeat')
                {
                    // 커서를 부모다이얼로그로 옮긴다.
                    var parent = bot.parentDialogMap[dialog.id];
                    if(parent)
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - repeat ]]]'));
                        console.log(parent);

                        context.session.dialogCursor = parent.id;
                        callback(resultOutput.text || parent.output[0]);
                    }
                    else
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - repeat ]]]'));
                        console.log('prev is undefined');

                        callback('[repeat] prev가 없습니다');
                    }
                }
                else if(resultOutput.type == 'up')
                {
                    var parent = bot.parentDialogMap[context.session.previousDialogId];
                    if(parent)
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - up ]]]'));
                        console.log(parent.id, parent.name);

                        parent.originalInput = parent.input;
                        parent.originalOutput = parent.output;
                        parent.input = dialog.input;

                        that.exec(bot, context, parent, callback);
                    }
                    else
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - up ]]]'));
                        console.log('prev is undefined');

                        callback({ output: { text: '[up] prev가 없습니다' } });
                    }
                }
                else if(resultOutput.type == 'call')
                {
                    if(resultOutput.dialogId)
                    {
                        var foundDialog = bot.dialogMap[resultOutput.dialogId];

                        console.log();
                        console.log(chalk.yellow('[[[ Action - call ]]]'));
                        console.log(foundDialog);

                        foundDialog.originalInput = foundDialog.input;
                        foundDialog.originalOutput = foundDialog.output;
                        foundDialog.input = dialog.input;

                        that.exec(bot, context, foundDialog, callback);
                    }
                    else
                    {
                        callback({ output: { text: 'Call 타겟을 찾을 수 없습니다.' }});
                    }
                }
                else if(resultOutput.type == 'callChild')
                {
                    var dialog = bot.dialogMap[resultOutput.dialogId];
                    that.find(bot, context, dialog, function(err, foundDialog)
                    {
                        if(foundDialog)
                        {
                            console.log();
                            console.log(chalk.yellow('[[[ Action - callChild ]]]'));
                            console.log(foundDialog.id);

                            foundDialog.originalInput = foundDialog.input;
                            foundDialog.originalOutput = foundDialog.output;
                            foundDialog.input = dialog.input;

                            for(var key in dialog)
                            {
                                foundDialog[key] = dialog[key];
                            }

                            that.exec(bot, context, foundDialog, callback);
                        }
                        else
                        {
                            callback(resultOutput);
                        }
                    });
                }
                else if(resultOutput.type == 'returnCall')
                {
                    context.session.returnDialog = dialogId;

                    var foundDialog = bot.dialogMap[resultOutput.dialogId];

                    console.log();
                    console.log(chalk.yellow('[[[ Action - returnCall ]]]'));
                    console.log(foundDialog.id);

                    foundDialog.originalInput = foundDialog.input;
                    foundDialog.originalOutput = foundDialog.output;
                    foundDialog.input = dialog.input;

                    for(var key in dialog)
                    {
                        foundDialog[key] = dialog[key];
                    }

                    that.exec(bot, context, foundDialog, callback);
                }
                else if(resultOutput.type == 'return')
                {
                    if(context.session.returnDialog)
                    {
                        var foundDialog = bot.parentDialogMap[context.session.returnDialog];

                        console.log();
                        console.log(chalk.yellow('[[[ Action - return ]]]'));
                        console.log(foundDialog.id);

                        foundDialog.originalInput = foundDialog.input;
                        foundDialog.originalOutput = foundDialog.output;
                        foundDialog.input = dialog.input;

                        for(var key in dialog)
                        {
                            foundDialog[key] = dialog[key];
                        }

                        that.exec(bot, context, foundDialog, callback);
                    }
                    else
                    {
                        // 모르겟어요?

                        console.log();
                        console.log(chalk.yellow('[[[ Action - return ]]]'));
                        console.log('context.returnDialog is undefined');

                        callback(null);
                    }
                }
            }
            else
            {
                callback(resultOutput);
            }
        });
    };

    module.exports = new DialogGraphManager();
})();
