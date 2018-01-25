var Transaction = require('../utils/transaction.js');
var utils = require('../utils/utils.js');

var TaskManager = require('./task.js');

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

    DialogGraphManager.prototype.findDialog = function(context, intents, entities, dialogs)
    {
        var nlpText = context.nlu.nlpText;

        for(var i=0; i<dialogs.length; i++)
        {
            var inputs = dialogs[i].input;
            if(!inputs || !inputs.length || inputs.length <= 0)
            {
                continue;
            }

            for(var j=0; j<inputs.length; j++)
            {
                var result = true;
                var input = inputs[j];
                for(var key in input)
                {
                    console.log(input[key]);

                    if(key == 'text')
                    {
                        result = result && this.checkInputText(nlpText, input.text);
                    }
                    else if(key == 'entities')
                    {
                        result = result && this.checkEntities(input.entities, entities);
                    }
                    else if(key == 'intent')
                    {
                        result = result && (intents.length > 0 && input.intent == intents[0].name);
                    }
                    else if(key == 'types')
                    {
                        //TODO
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
                }

                if(result)
                {
                    return dialogs[i];
                }
            }
        }
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
        // 가장먼저 공통 다이얼로그에서 찾고
        // 그 다음 사용자 다이얼로그에서 찾고
        // 각 대화카드의 input값을 가지고
        var nlp = context.nlu.nlp;
        var intents = context.nlu.intents;
        var entities = context.nlu.entities;

        console.log();
        console.log('----- DialogGraphManager find [Start]');

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
                dialog = this.findDialog(context, intents, entities, dialogs);
            }
        }

        if(!dialog)
        {
            dialog = this.findDialog(context, intents, entities, bot.commonDialogs);
            if(!dialog)
            {
                dialog = this.findDialog(context, intents, entities, bot.dialogs);
            }
        }

        if(dialog)
        {
            dialog.parentDialogId = session.dialogCursor;
            session.dialogCursor = dialog.id;
        }

        callback(null, dialog);

        console.log('----- DialogGraphManager find [End]');
        console.log();
    };

    DialogGraphManager.prototype.exec = function(bot, session, context, dialog, callback)
    {
        var sync = new Transaction.sync();
        if(dialog.task)
        {
            sync.make(function(done)
            {
                TaskManager.exec(bot, session, context, dialog.output, dialog.task.name, done);
            });
        }

        sync.done(function()
        {
            var output = dialog.output;

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
                        console.log('컨텍 : ', context.output);

                        if(resultOutput.text)
                        {
                            callback(resultOutput.text);
                        }
                        else
                        {
                            callback(context.output);
                        }

                        session.dialogCursor = dialog.parentDialogId;
                    }
                }
                else
                {
                    context.output = resultOutput;
                    callback(resultOutput);
                }
            }
            else
            {
                callback(output);
            }
        });
    };

    module.exports = new DialogGraphManager();
})();
