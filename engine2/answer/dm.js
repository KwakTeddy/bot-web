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
        var count = 0;

        if(nlpText.trim())
        {
            var words = text.split(/\s/);
            for(var i=0; i<words.length; i++)
            {
                var word = RegExp.escape(words[i]);
                if(nlpText.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) != -1)
                {
                    count++;
                }
            }
        }

        return count;
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

    DialogGraphManager.prototype.findDialog = function(bot, context, userInput, intents, entities, dialogs, callback)
    {
        var that = this;

        var selectedDialog = [];

        var rawText = userInput.text;
        var nlpText = userInput.nlpText;
        async.eachSeries(dialogs, function(dialog, next)
        {
            if(!dialog.matchCount)
            {
                dialog.matchCount = 0;
            }

            var inputs = dialog.input;
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
                        if(rawText == input.text.raw)
                        {
                            result = result && true;
                            dialog.matchCount = 100000;
                        }
                        else
                        {
                            var matchCount = that.checkInputText(nlpText, input.text.nlp);
                            if(matchCount > 0)
                            {
                                dialog.matchCount += matchCount;
                                result = result && true;
                            }
                            else
                            {
                                result = result && false;
                            }
                        }
                    }
                    else if(key == 'entities')
                    {
                        var check = that.checkEntities(input.entities, entities);
                        if(check)
                        {
                            dialog.matchCount++;
                        }

                        result = result && check;
                    }
                    else if(key == 'intent')
                    {
                        var check = (intents.length > 0 && input.intent == intents[0].intentName);
                        if(check)
                        {
                            dialog.matchCount++;
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

                        type.typeCheck.call(type, { userInput: userInput }, context, function(matched, parsed, retry) //TODO retry가 true면 해당 input을 다시 입력받도록 질의 한다. 만약 필요한 값이 더 있다면 그 값도 요구할 수 있다. retry : ['주민등록번로를 다시 입력해주세요 YYMMDD']
                        {
                            if(matched)
                            {
                                result = result && true;

                                dialog.matchCount += 100;

                                if(parsed)
                                {
                                    userInput.types[type.name] = parsed;
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
                                dialog.matchCount++;
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
                        // return callback(dialog);
                        selectedDialog.push(dialog);
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

    DialogGraphManager.prototype.find = function(bot, context, userInput, callback)
    {
        var that = this;

        var intents = userInput.intents;
        var entities = userInput.entities;

        var transaction = new Transaction.sync();

        var foundDialog = undefined;
        transaction.call(function(done)
        {
            if(!foundDialog)
            {
                that.findDialog(bot, context, userInput, intents, entities, bot.commonDialogs, function(result)
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
                    that.findDialog(bot, context, userInput, intents, entities, dialogs, function(result)
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
                that.findDialog(bot, context, userInput, intents, entities, bot.dialogs, function(result)
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

    DialogGraphManager.prototype.execWithRecord = function(bot, context, targetDialog, callback)
    {
        context.session.history.splice(0, 0, targetDialog);
        context.session.dialogCursor = targetDialog.id;

        this.exec(bot, context, targetDialog, callback);
    };

    DialogGraphManager.prototype.exec = function(bot, context, targetDialog, callback)
    {
        var that = this;

        console.log();
        console.log(chalk.yellow('[[[ Execute DialogGraph ]]]'));

        var sync = new Transaction.sync();
        sync.targetDialog = targetDialog;
        if(targetDialog.task)
        {
            sync.call(function(done)
            {
                TaskManager.exec(bot, context, sync.targetDialog, done);
            });
        }

        sync.done(function()
        {
            var targetDialog = sync.targetDialog;
            var output = targetDialog.output;

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
                            })(context, targetDialog, output[i]);
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
                    // output.output = resultOutput; // ???
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
                    context.session.history.splice(0, 1);

                    var parent = bot.parentDialogMap[targetDialog.id];
                    if(parent)
                    {
                        context.session.dialogCursor = parent.id;

                        var cloneDialog = utils.clone(parent);
                        cloneDialog.originalInput = cloneDialog.input;
                        cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                        cloneDialog.userInput = targetDialog.userInput;

                        console.log();
                        console.log(chalk.yellow('[[[ Action - repeat ]]]'));
                        console.log(cloneDialog);

                        context.session.dialogCursor = cloneDialog.id;
                        callback({ text: resultOutput.text || cloneDialog.output[0] });
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
                    context.session.history.splice(0, 1);
                    context.session.history.splice(0, 1);

                    var parent = bot.parentDialogMap[context.session.history[0].id];
                    if(parent)
                    {
                        context.session.dialogCursor = parent.id;

                        context.session.history.splice(0, 1);

                        var cloneDialog = utils.clone(parent);
                        cloneDialog.originalInput = cloneDialog.input;
                        cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                        cloneDialog.userInput = targetDialog.userInput;

                        console.log();
                        console.log(chalk.yellow('[[[ Action - up ]]]'));
                        console.log(cloneDialog.id, cloneDialog.name);

                        that.exec(bot, context, cloneDialog, callback);
                    }
                    else
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - up ]]]'));
                        console.log('prev is undefined');

                        callback({ text: '[up] prev가 없습니다' });
                    }
                }
                else if(resultOutput.type == 'call')
                {
                    if(resultOutput.dialogId)
                    {
                        var foundDialog = bot.dialogMap[resultOutput.dialogId];
                        if(foundDialog)
                        {
                            var cloneDialog = utils.clone(foundDialog);
                            cloneDialog.originalInput = cloneDialog.input;
                            cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                            cloneDialog.userInput = targetDialog.userInput;

                            console.log();
                            console.log(chalk.yellow('[[[ Action - call ]]]'));
                            console.log(cloneDialog);

                            that.execWithRecord(bot, context, cloneDialog, callback);
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
                }
                else if(resultOutput.type == 'callChild')
                {
                    var dialog = utils.clone(bot.dialogMap[resultOutput.dialogId]);
                    that.find(bot, context, dialog, function(err, foundDialog)
                    {
                        if(foundDialog)
                        {
                            console.log();
                            console.log(chalk.yellow('[[[ Action - callChild ]]]'));
                            console.log(foundDialog.id);

                            var cloneDialog = utils.clone(foundDialog);
                            cloneDialog.originalInput = cloneDialog.input;
                            cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                            cloneDialog.userInput = targetDialog.userInput;

                            that.execWithRecord(bot, context, cloneDialog, callback);
                        }
                        else
                        {
                            callback({ text: 'CallChild 타겟을 찾을 수 없습니다.' });
                        }
                    });
                }
                else if(resultOutput.type == 'returnCall')
                {
                    context.session.returnDialog = targetDialog.id;

                    var foundDialog = bot.dialogMap[resultOutput.dialogId];
                    if(foundDialog)
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - returnCall ]]]'));
                        console.log(foundDialog.id);

                        var cloneDialog = utils.clone(foundDialog);
                        cloneDialog.originalInput = cloneDialog.input;
                        cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                        cloneDialog.userInput = targetDialog.userInput;

                        that.execWithRecord(bot, context, cloneDialog, callback);
                    }
                    else
                    {
                        callback({ text: 'Return Call 타겟을 찾을 수 없습니다.' });
                    }
                }
                else if(resultOutput.type == 'return')
                {
                    if(context.session.returnDialog)
                    {
                        var foundDialog = bot.parentDialogMap[context.session.returnDialog];
                        if(foundDialog)
                        {
                            console.log();
                            console.log(chalk.yellow('[[[ Action - return ]]]'));
                            console.log(foundDialog.id);

                            var cloneDialog = utils.clone(foundDialog);
                            cloneDialog.originalInput = cloneDialog.input;
                            cloneDialog.originalOutput = utils.clone(cloneDialog.output);
                            cloneDialog.userInput = targetDialog.userInput;

                            that.execWithRecord(bot, context, cloneDialog, callback);
                        }
                        else
                        {
                            callback({ text: 'Return 타겟을 찾을 수 없습니다.' });
                        }
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
