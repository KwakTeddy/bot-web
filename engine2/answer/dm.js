var async = require('async');
var chalk = require('chalk');

var Transaction = require('../utils/transaction.js');
var utils = require('../utils/utils.js');

var Globals = require('../globals.js');
var TaskManager = require('./task.js');
var ActionManager = require('./action.js');

(function()
{
    var DialogGraphManager = function()
    {
        this.exclude = ['하다', '이다'];
        ActionManager.dm = this;
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
                if(this.exclude.indexOf(word) == -1)
                {
                    if(nlpText.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) != -1)
                    {
                        count++;
                    }
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

    DialogGraphManager.prototype.checkInput = function(dialog, userInput, inputs, callback)
    {
        var that = this;
        var rawText = userInput.text;
        var nlpText = userInput.nlpText;

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
                    if(input.text.raw && input.text.nlp)
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

                    if(typeof type.typeCheck == 'string')
                    {
                        type.typeCheck = Globals.typeChecks[type.typeCheck];
                    }

                    type.typeCheck.call(type, { userInput: userInput }, context, function(matched, parsed, retry)
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
                    callback(true);
                }
                else
                {
                    next();
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
            if(!dialog.matchCount)
            {
                dialog.matchCount = 0;
            }

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
                    that.checkInput(dialog, userInput, inputs, function(result)
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
            if(!dialog.matchCount)
            {
                dialog.matchCount = 0;
            }

            var inputs = dialog.input;
            if(!inputs || !inputs.length || inputs.length <= 0)
            {
                return next();
            }

            that.checkInput(dialog, userInput, inputs, function(result)
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
            that.findDialog(bot, context, userInput, intents, entities, bot.commonDialogs, function(result)
            {
                foundDialog = result;
                done();
            });
        });

        if(bot.options.globalSearch && bot.options.globalSearch.use)
        {
            // 글로벌 서치 했는데 없으면 없는거다.
            transaction.done(function()
            {
                if(!foundDialog)
                {
                    that.findDialogGlobal(bot, context, userInput, intents, entities, bot.dialogs, function(selectedDialogs)
                    {
                        selectedDialogs.sort(function(a, b)
                        {
                            return b.matchCount - a.matchCount;
                        });

                        for(var i=0; i<selectedDialogs.length; i++)
                        {
                            delete selectedDialogs[i].matchCount;
                        }

                        if(selectedDialogs.length > 0)
                        {
                            if(!bot.options.globalSearch.limitOfSimilarAnswer || !bot.options.globalSearch.limitOfSimilarAnswer || bot.options.globalSearch.limitOfSimilarAnswer == 1)
                            {
                                foundDialog = selectedDialogs[0];
                            }
                            else if(bot.options.globalSearch.limitOfSimilarAnswer > 1)
                            {
                                //여러개 선택해서 보여준담에 다시 고르라고 해야함.
                            }
                        }

                        callback(null);
                    });
                }
                else
                {
                    callback(null, foundDialog);
                }
            });
        }
        else
        {
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
        }
    };

    // 실행된 dialogInstance를 히스토리에 기록.
    DialogGraphManager.prototype.execWithRecord = function(bot, context, dialogInstance, callback)
    {
        if(dialogInstance.id == 'startDialog')
        {
            context.session.history = [];
        }

        context.session.history.splice(0, 0, dialogInstance);
        context.session.dialogCursor = dialogInstance.id;

        this.exec(bot, context, dialogInstance, callback);
    };

    DialogGraphManager.prototype.exec = function(bot, context, dialogInstance, callback)
    {
        console.log();
        console.log(chalk.yellow('[[[ Execute DialogGraph ]]]'));
        console.log(dialogInstance);

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
        });
    };

    module.exports = new DialogGraphManager();
})();
