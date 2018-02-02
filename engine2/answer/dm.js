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

    DialogGraphManager.prototype.findDialog = function(bot, context, conversation, intents, entities, dialogs, callback)
    {
        var that = this;

        var nlpText = conversation.nlu.nlpText;
        async.eachSeries(dialogs, function(dialog, next)
        {
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
                        result = result && that.checkInputText(nlpText, input.text.nlp);
                    }
                    else if(key == 'entities')
                    {
                        result = result && that.checkEntities(input.entities, entities);
                    }
                    else if(key == 'intent')
                    {
                        result = result && (intents.length > 0 && input.intent == intents[0].intentName);
                    }
                    else if(key == 'types')
                    {
                        var type = bot.types[input[key]];
                        if(!type)
                        {
                            type = Globals.types[input[key]];
                        }

                        type.typeCheck.call(type, conversation, context, function(matched, parsed, retry) //TODO retry가 true면 해당 input을 다시 입력받도록 질의 한다. 만약 필요한 값이 더 있다면 그 값도 요구할 수 있다. retry : ['주민등록번로를 다시 입력해주세요 YYMMDD']
                        {
                            if(matched)
                            {
                                result = result && true;

                                if(parsed)
                                {
                                    context.types[type.name] = parsed;
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
                        result = result && (function(conversation, context, input)
                        {
                            if(eval('result = (' + input.if + ' ? true : false);'))
                            {
                                return true;
                            }

                            return false;

                        })(conversation, context, input);
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
                        return callback(dialog);
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
            callback();
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

    DialogGraphManager.prototype.find = function(bot, context, conversation, callback)
    {
        var that = this;

        var intents = conversation.nlu.intents;
        var entities = conversation.nlu.entities;

        var transaction = new Transaction.sync();

        var dialog = undefined;
        transaction.call(function(done)
        {
            if(!dialog)
            {
                that.findDialog(bot, context, conversation, intents, entities, bot.commonDialogs, function(result)
                {
                    dialog = result;
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
            if(context.dialogCursor && !dialog)
            {
                var dialogs = that.getNextDialogs(context.dialogCursor, bot.commonDialogs);
                if(!dialogs)
                {
                    dialogs = that.getNextDialogs(context.dialogCursor, bot.dialogs);
                }

                if(dialogs)
                {
                    that.findDialog(bot, context, conversation, intents, entities, dialogs, function(result)
                    {
                        dialog = result;
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
            if(!dialog)
            {
                that.findDialog(bot, context, conversation, intents, entities, bot.dialogs, function(result)
                {
                    dialog = result;
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
            callback(null, dialog);
        });
    };

    DialogGraphManager.prototype.exec = function(bot, context, conversation, callback)
    {
        console.log();
        console.log(chalk.yellow('[[[ Execute DialogGraph ]]]'));

        var that = this;

        var dialog = conversation.dialog;
        context.dialogCursor = dialog.id;

        var sync = new Transaction.sync();
        if(dialog.task)
        {
            sync.call(function(done)
            {
                TaskManager.exec(bot, context, conversation, dialog.task.name, done);
            });
        }

        sync.done(function(options)
        {
            var dialogId = conversation.dialog.id;
            var output = conversation.dialog.output;

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
                        (function(context, conversation, o)
                        {
                            var result = false;
                            eval('result = (' + o.if + ' ? true : false);');

                            if(result)
                            {
                                resultOutput = o;
                            }

                        })(context, conversation, output[i]);
                    }
                    else if(!output[i].if)
                    {
                        elseList.push(output[i]);
                    }
                }

                if(!resultOutput)
                {
                    resultOutput = elseList[utils.getRandomInt(0, elseList.length-1)];
                }
            }
            else
            {
                resultOutput = output;
            }

            console.log();
            console.log(chalk.yellow('[[[ Output ]]]'));
            console.log(resultOutput);

            if(options)
            {

            }

            if(resultOutput.kind == 'Action')
            {
                //call, callChild, reutrnCall, up, repeat, return
                if(resultOutput.type == 'repeat')
                {
                    // 커서를 부모다이얼로그로 옮긴다.
                    var prev = conversation.prev;
                    if(prev)
                    {
                        console.log();
                        console.log(chalk.yellow('[[[ Action - repeat ]]]'));
                        console.log(prev.dialog.id);

                        context.dialogCursor = prev.dialog.id;
                        callback(resultOutput.text);
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
                    context.history.splice(0, 2);
                    var prev = conversation.prev;
                    if(prev)
                    {
                        if(prev.prev)
                        {
                            prev = prev.prev;
                        }

                        console.log();
                        console.log(chalk.yellow('[[[ Action - up ]]]'));
                        console.log(prev.dialog.id);

                        that.exec(bot, context, prev, callback);
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
                    var dialog = bot.dialogMap[resultOutput.dialogId];
                    conversation.dialog = dialog;

                    console.log();
                    console.log(chalk.yellow('[[[ Action - call ]]]'));
                    console.log(resultOutput.dialogId);
                    console.log(resultOutput.dialogName);

                    that.exec(bot, context, conversation, callback);
                }
                else if(resultOutput.type == 'callChild')
                {
                    var dialog = bot.dialogMap[resultOutput.dialogId];
                    context.dialogCursor = dialog.id;
                    that.find(bot, context, conversation, function(err, dialog)
                    {
                        if(dialog)
                        {
                            console.log();
                            console.log(chalk.yellow('[[[ Action - callChild ]]]'));
                            console.log(dialog.id);

                            conversation.dialog = dialog;
                            that.exec(bot, context, conversation, callback);
                        }
                        else
                        {
                            callback(resultOutput);
                        }
                    });
                }
                else if(resultOutput.type == 'returnCall')
                {
                    context.returnDialog = dialogId;

                    var dialog = bot.dialogMap[resultOutput.dialogId];
                    conversation.dialog = dialog;

                    console.log();
                    console.log(chalk.yellow('[[[ Action - returnCall ]]]'));
                    console.log(dialog.id);

                    that.exec(bot, context, conversation, callback);
                }
                else if(resultOutput.type == 'return')
                {
                    if(context.returnDialog)
                    {
                        var dialog = bot.parentDialogMap[context.returnDialog];
                        conversation.dialog = dialog;

                        console.log();
                        console.log(chalk.yellow('[[[ Action - return ]]]'));
                        console.log(dialog.id);

                        that.exec(bot, context, conversation, callback);
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
