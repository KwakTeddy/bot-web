var async = require('async');
var chalk = require('chalk');

var Transaction = require('../utils/transaction.js');
var utils = require('../utils/utils.js');

var Logger = require('../logger.js');

var Globals = require('../globals.js');
var TaskManager = require('./task.js');
var ActionManager = require('./action.js');
var ContextManager = require('../context.js');

(function()
{
    var DialogGraphManager = function()
    {
        this.exclude = ['하다', '이다'];
        ActionManager.dm = this;
    };

    DialogGraphManager.prototype.checkInputText = function(nlpText, text)
    {
        if(nlpText.trim())
        {
            var words = text.split(/\s/);
            for(var i=0; i<words.length; i++)
            {
                var word = RegExp.escape(words[i]);
                if(this.exclude.indexOf(word) == -1)
                {
                    if(nlpText.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) == -1)
                    {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    DialogGraphManager.prototype.checkEntities = function(src, dest)
    {
        if(Array.isArray(src))
        {
            for(var i in src)
            {
                for(var key in dest)
                {
                    if(src[i].trim() == key)
                    {
                        return { key: key, matchedName: dest[key][0].matchWord.join(', ') };
                    }
                }
            }
        }
        else
        {
            src = src.trim();
            for(var key in dest)
            {
                if(src == key)
                {
                    return { key: key, matchedName: dest[key][0].matchWord.join(', ') };
                }
            }
        }

        return false;
    };

    DialogGraphManager.prototype.checkInput = function(bot, context, dialog, userInput, inputs, callback)
    {
        var that = this;
        var rawText = userInput.text;
        var nlpText = userInput.nlpText;
        var intents = userInput.intents;
        var entities = userInput.entities;

        async.eachSeries(inputs, function(input, nextInput)
        {
            var result = true;

            var keyList = Object.keys(input);
            if(keyList.length <= 0)
            {
                result = false;
            }

            keyList.sort();

            async.eachSeries(keyList, function(key, next)
            {
                if(key == 'intent')
                {
                    if(intents.length > 0)
                    {
                        var check = input.intent == intents[0].intentName;
                        if(check)
                        {
                            dialog.matchRate = intents[0].matchRate;
                            userInput.matchedIntent = input.intent;
                        }
                        else
                        {
                            return nextInput();
                        }
                    }
                    else
                    {
                        return nextInput();
                    }
                }
                else if(key == 'text')
                {
                    if(input.text.raw && input.text.nlp)
                    {
                        if(rawText == input.text.raw)
                        {
                            dialog.matchRate = 1;
                        }
                        else
                        {
                            var matchCount = that.checkInputText(nlpText, input.text.nlp);
                            if(matchCount)
                            {
                                dialog.matchRate = 1;
                            }
                            else
                            {
                                return nextInput();
                            }
                        }
                    }
                    else
                    {
                        return nextInput();
                    }
                }
                else if(key == 'entities')
                {
                    var check = that.checkEntities(input.entities, entities);
                    if(!check)
                    {
                        return nextInput();
                    }
                    else
                    {
                        userInput.matchedEntity = check;
                    }
                }
                else if(key == 'types')
                {
                    var type = bot.types[input[key]];
                    if(!type)
                    {
                        type = Globals.types[input[key]];
                    }

                    if(type)
                    {
                        if(typeof type.typeCheck == 'string')
                        {
                            type.typeCheck = Globals.typeChecks[type.typeCheck];
                        }

                        type.typeCheck.call(type, { userInput: userInput }, context, function(matched, parsed, retry)
                        {
                            if(matched)
                            {
                                if(parsed)
                                {
                                    userInput.types[type.name] = parsed;
                                }

                                next();
                            }
                            else
                            {
                                return nextInput();
                            }
                        });
                    }
                    else
                    {
                        console.log(input[key] + ' type is not defined');
                    }

                    return;
                }
                else if(key == 'if')
                {
                    var dialogInstance = ContextManager.createDialogInstance(dialog, userInput);
                    result = (function(dialog, context, input)
                    {
                        try
                        {
                            if(eval('result = (' + input.if + ' ? true : false);'))
                            {
                                return true;
                            }
                        }
                        catch(err)
                        {
                            console.error(err);
                        }

                        return false;

                    })(dialogInstance, context, input);

                    if(!result)
                    {
                        return nextInput();
                    }
                }
                else if(key == 'regexp')
                {
                    var regexp = undefined;
                    try
                    {
                        regexp = input.regexp;
                        var options = 'gi';
                        if(regexp.startsWith('/'))
                        {
                            regexp = regexp.substring(1);
                            var index = regexp.lastIndexOf('/');
                            var o = regexp.substring(index + 1);
                            if(o)
                            {
                                options = o;
                            }

                            regexp = regexp.substring(0, index);
                        }

                        regexp = new RegExp(regexp, options);
                        if(regexp.test(rawText))
                        {
                            var match = rawText.match(regexp);

                            var list = {};
                            for(var i=0; i<match.length; i++)
                            {
                                if(match[i])
                                {
                                    list[i+1] = match[i];
                                }
                            }

                            userInput.regexp = list;

                            dialog.matchRate = 1;
                        }
                        else
                        {
                            return nextInput();
                        }
                    }
                    catch(err)
                    {
                        return nextInput();
                    }
                }
                else
                {
                    return nextInput();
                }

                next();
            },
            function()
            {
                if(result)
                {
                    callback(true);
                }
                else
                {
                    nextInput();
                }
            });
        },
        function()
        {
            callback(false);
        });
    };

    DialogGraphManager.prototype.findDialogGlobal = function(bot, context, userInput, intents, entities, dialogs, callback)
    {
        var that = this;

        var selectedDialog = [];

        async.eachSeries(dialogs, function(dialog, next)
        {
            delete dialog.matchRate;

            var transaciton = new Transaction.sync();

            var children = dialog.children;
            if(children && children.length > 0)
            {
                transaciton.call(function(done)
                {
                    that.findDialogGlobal(bot, context, userInput, intents, entities, children, function(results)
                    {
                        selectedDialog = selectedDialog.concat(results);
                        done();
                    });
                });
            }

            transaciton.done(function()
            {
                var inputs = dialog.input;
                if(inputs && inputs.length > 0)
                {
                    var targetInputs = [];
                    for(var i=0; i<inputs.length; i++)
                    {
                        var keyList = Object.keys(inputs[i]);
                        if(keyList.indexOf('intent') != -1)
                        {
                            targetInputs.push(inputs[i]);
                        }
                    }

                    if(targetInputs.length > 0)
                    {
                        that.checkInput(bot, context, dialog, userInput, targetInputs, function(result)
                        {
                            if(result)
                            {
                                selectedDialog.push(dialog);
                            }

                            next();
                        });
                    }
                    else
                    {
                        next();
                    }
                }
                else
                {
                    next();
                }
            });
        },
        function()
        {
            callback(selectedDialog);
        });
    };

    DialogGraphManager.prototype.findDialog = function(bot, context, userInput, intents, entities, dialogs, callback)
    {
        var that = this;

        var selectedDialog = [];

        async.eachSeries(dialogs, function(dialog, next)
        {
            delete dialog.matchRate;

            var inputs = dialog.input;
            if(!inputs || !inputs.length || inputs.length <= 0)
            {
                return next();
            }

            that.checkInput(bot, context, dialog, userInput, inputs, function(result)
            {
                if(result)
                {
                    selectedDialog.push(dialog);
                }

                next();
            });
        },
        function()
        {
            selectedDialog.sort(function(a, b)
            {
                return b.matchRate - a.matchRate;
            });

            if(selectedDialog.length > 0)
            {
                if(selectedDialog[0].matchRate)
                {
                    if(selectedDialog[0].matchRate >= (bot.options.dialoggraphMinMatchRate || 0.5))
                    {
                        callback(selectedDialog[0]);
                    }
                    else
                    {
                        callback();
                    }
                }
                else
                {
                    callback(selectedDialog[0]);
                }
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
            that.findDialog(bot, context, userInput, intents, entities, bot.commonDialogs, function(result)
            {
                foundDialog = result;
                done();
            });
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

        if(bot.options.globalSearch && bot.options.globalSearch.use)
        {
            // 글로벌 서치 했는데 없으면 없는거다.
            transaction.call(function(done)
            {
                if(!foundDialog)
                {
                    that.findDialogGlobal(bot, context, userInput, intents, entities, bot.dialogs, function(selectedDialogs)
                    {
                        selectedDialogs.sort(function(a, b)
                        {
                            return b.matchRate - a.matchRate;
                        });

                        transaction.selectedDialogs = selectedDialogs;

                        done();
                        // callback(null, foundDialog);
                    });
                }
                else
                {
                    done();
                    // callback(null, foundDialog);
                }
            });
        }

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
            if(bot.options.globalSearch && bot.options.globalSearch.use)
            {
                var selectedDialogs = transaction.selectedDialogs;
                if(selectedDialogs && selectedDialogs.length > 0)
                {
                    if(!bot.options.globalSearch.limitOfSimilarAnswer || !bot.options.globalSearch.limitOfSimilarAnswer || bot.options.globalSearch.limitOfSimilarAnswer == 1)
                    {
                        if(selectedDialogs[0].matchRate)
                        {
                            if(!foundDialog)
                            {
                                foundDialog = selectedDialogs[0];
                            }
                            else if(selectedDialogs[0].matchRate >= (bot.options.globalSearch.minMatchRate || 0.5) && (!foundDialog.matchRate || selectedDialogs[0].matchRate > foundDialog.matchRate))
                            {
                                foundDialog = selectedDialogs[0];
                            }
                        }
                    }
                    else if(bot.options.globalSearch.limitOfSimilarAnswer > 1)
                    {
                        //여러개 선택해서 보여준담에 다시 고르라고 해야함.
                    }
                }
            }

            callback(null, foundDialog);
        });
    };

    // 실행된 dialogInstance를 히스토리에 기록.
    DialogGraphManager.prototype.execWithRecord = function(bot, context, dialogInstance, callback)
    {
        if(dialogInstance.id == 'startDialog')
        {
            context.session.history = [];
        }

        context.session.history.splice(0, 0, dialogInstance);
        context.session.previousDialogCursor = context.session.dialogCursor;
        context.session.dialogCursor = dialogInstance.id;

        this.exec(bot, context, dialogInstance, callback);
    };

    DialogGraphManager.prototype.exec = function(bot, context, dialogInstance, callback)
    {
        console.log();
        console.log(chalk.yellow('[[[ Execute DialogGraph ]]]'));
        console.log(dialogInstance);

        if(dialogInstance.userInput.types)
        {
            for(var key in dialogInstance.userInput.types)
            {
                dialogInstance.data[key] = dialogInstance.userInput.types[key];
            }
        }

        if(dialogInstance.userInput.regexp)
        {
            for(var key in dialogInstance.userInput.regexp)
            {
                dialogInstance.data[key] = dialogInstance.userInput.regexp[key];
            }
        }

        var sync = new Transaction.sync();
        sync.dialogInstance = dialogInstance;
        if(dialogInstance.task)
        {
            sync.call(function(done)
            {
                TaskManager.exec(bot, context, sync.dialogInstance, function(isRetry, retryMessage)
                {
                    if(isRetry)
                    {
                        context.session.retryDialogInstance = sync.dialogInstance;
                        // 필요한 입력값을 갖기 위해 재 질의를 한다고 하면.
                        // text로 재 질의를 유도하고.
                        // 그런데 다시 입력을 했을때 다른 서버로 튈수가 있어. 그러므로 session에 어떤식으로 저장을 해둬야 한다.
                        // input이 들어오면 그 text를 일단 분석하고, 특정 type을 이용해 데이터를 뽑아내거나.
                        // task에서 처리 할 수 있다.

                        callback({ text: retryMessage });
                    }
                    else
                    {
                        delete context.session.retryDialogInstance;
                        done();
                    }
                });
            });
        }

        sync.done(function()
        {
            var dialogInstance = sync.dialogInstance;
            var output = dialogInstance.output;

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

                                    return callback({ text: err.message });
                                }
                            })(context, dialogInstance, output[i]);
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
            console.log(chalk.yellow('[[[ Selected Output ]]]'));
            console.log(resultOutput);

            if(resultOutput)
            {
                if(resultOutput.kind == 'Action')
                {
                    ActionManager.exec(bot, context, dialogInstance, resultOutput, callback);
                }
                else
                {
                    if(dialogInstance.options.outputText)
                    {
                        resultOutput.text = dialogInstance.options.outputText;
                    }

                    callback(resultOutput, dialogInstance);
                }
            }
            else
            {
                callback();
            }
        });
    };

    module.exports = new DialogGraphManager();
})();
