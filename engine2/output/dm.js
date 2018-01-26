var async = require('async');

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

    DialogGraphManager.prototype.findDialog = function(bot, context, intents, entities, dialogs, callback)
    {
        var that = this;

        var nlpText = context.nlu.nlpText;
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

                async.eachSeries(keyList, function(key, next)
                {
                    if(key == 'text')
                    {
                        result = result && that.checkInputText(nlpText, input.text);
                    }
                    else if(key == 'entities')
                    {
                        result = result && that.checkEntities(input.entities, entities);
                    }
                    else if(key == 'intent')
                    {
                        result = result && (intents.length > 0 && input.intent == intents[0].name);
                    }
                    else if(key == 'types')
                    {
                        var type = bot.types[input[key]];
                        if(!type)
                        {
                            type = Globals.types[input[key]];
                        }

                        type.typeCheck(context.nlu.inputRaw, type, function(parsed)
                        {
                            if(parsed)
                            {
                                result = result && true;
                                context.userData[type.name] = parsed;
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
                        result = result && (function(context, input)
                        {
                            if(eval('result = (' + input.if + ' ? true : false);'))
                            {
                                return true;
                            }

                            return false;

                        })(JSON.parse(JSON.stringify(context)), input);
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

    DialogGraphManager.prototype.find = function(bot, session, context, callback)
    {
        var that = this;

        var intents = context.nlu.intents;
        var entities = context.nlu.entities;

        var transaction = new Transaction.sync();

        var dialog = undefined;
        if(session.dialogCursor)
        {
            var dialogs = this.getNextDialogs(session.dialogCursor, bot.commonDialogs);
            if(!dialogs)
            {
                dialogs = this.getNextDialogs(session.dialogCursor, bot.dialogs);
            }

            if(dialogs)
            {
                transaction.call(function(done)
                {
                    that.findDialog(bot, context, intents, entities, dialogs, function(result)
                    {
                        dialog = result;
                        done();
                    });
                });
            }
        }

        transaction.call(function(done)
        {
            if(!dialog)
            {
                that.findDialog(bot, context, intents, entities, bot.commonDialogs, function(result)
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
            if(!dialog)
            {
                that.findDialog(bot, context, intents, entities, bot.dialogs, function(result)
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

    DialogGraphManager.prototype.exec = function(bot, session, context, dialog, callback)
    {
        var that = this;

        session.dialogCursor = dialog.id;

        var sync = new Transaction.sync();
        if(dialog.task)
        {
            sync.call(function(done)
            {
                TaskManager.exec(bot, session, context, dialog.output, dialog.task.name, done);
            });
        }

        var dialogId = dialog.id;
        var output = dialog.output;
        sync.done(function()
        {
            if(output.length > 0)
            {
                var resultOutput = undefined;
                var elseList = [];
                for(var i=0; i<output.length; i++)
                {
                    if(!resultOutput && output[i].if)
                    {
                        (function(context, output)
                        {
                            var result = false;
                            eval('result = (' + output[i].if + ' ? true : false);');

                            if(result)
                            {
                                resultOutput = output;
                            }

                        })(JSON.parse(JSON.stringify(context)), output);
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

                if(resultOutput.kind == 'Action')
                {
                    //call, callChild, reutrnCall, up, repeat, return
                    if(resultOutput.type == 'repeat')
                    {
                        var prev = context.prev;
                        if(prev)
                        {
                            that.exec(bot, session, prev, prev.dialog, callback);
                        }
                        else
                        {
                            //TODO 만약 prev가 없다면??? 없을리가 없긴 하지만..
                            callback('[repeat] prev가 없습니다');
                        }
                    }
                    else if(resultOutput.type == 'up')
                    {
                        var prev = context.prev;
                        if(prev)
                        {
                            if(prev.prev)
                            {
                                that.exec(bot, session, prev.prev, prev.prev.dialog, callback);
                            }
                            else
                            {
                                callback(context, '[up] prev.prev가 없습니다');
                            }
                        }
                        else
                        {
                            callback(context, '[up] prev가 없습니다');
                        }
                    }
                    else if(resultOutput.type == 'call')
                    {
                        var nlu = context.nlu;
                        var dialog = bot.dialogMap[resultOutput.dialogId];
                        context = session.context.make();
                        context.nlu = JSON.parse(JSON.stringify(nlu));
                        context.dialog = dialog;
                        that.exec(bot, session, context, dialog, callback);
                    }
                    else if(resultOutput.type == 'callChild')
                    {
                        var nlu = context.nlu;
                        var dialog = bot.dialogMap[resultOutput.dialogId];
                        context = session.context.make();
                        context.nlu = JSON.parse(JSON.stringify(nlu));
                        context.dialog = dialog;
                        that.exec(bot, session, context, dialog, function(context, resultOutput)
                        {
                            that.find(bot, session, context, function(err, dialog)
                            {
                                if(dialog)
                                {
                                    context = session.context.make();
                                    context.nlu = JSON.parse(JSON.stringify(nlu));
                                    context.fromContext = prevContext;
                                    context.dialog = dialog;

                                    that.exec(bot, session, context, dialog, callback);
                                }
                                else
                                {
                                    callback(context, resultOutput);
                                }
                            });
                        });
                    }
                    else if(resultOutput.type == 'returnCall')
                    {
                        session.returnDialog = dialogId;

                        var nlu = context.nlu;
                        var dialog = bot.dialogMap[resultOutput.dialogId];
                        context = session.context.make();
                        context.nlu = JSON.parse(JSON.stringify(nlu));
                        context.dialog = dialog;
                        that.exec(bot, session, context, dialog, callback);
                    }
                    else if(resultOutput.type == 'return')
                    {
                        if(session.returnDialog)
                        {
                            var nlu = context.nlu;
                            var dialog = bot.parentDialogMap[session.returnDialog];
                            context = session.context.make();
                            context.nlu = JSON.parse(JSON.stringify(nlu));
                            context.dialog = dialog;
                            that.exec(bot, session, context, dialog, callback);
                        }
                        else
                        {
                            // 모르겟어요?
                            callback(context, null);
                        }
                    }
                }
                else
                {
                    callback(context, resultOutput);
                }
            }
            else
            {
                callback(context, output);
            }
        });
    };

    module.exports = new DialogGraphManager();
})();
