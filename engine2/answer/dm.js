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

    DialogGraphManager.prototype.findDialog = function(nlpText, intents, entities, dialogs)
    {
        for(var i=0; i<dialogs.length; i++)
        {
            var input = dialogs[i].input;
            if(!input || input.length <= 0)
            {
                continue;
            }

            for(var j=0; j<input.length; j++)
            {
                if(input[j].text)
                {
                    if(this.checkInputText(nlpText, input[j].text))
                    {
                        return dialogs[i];
                    }
                }
                else if(input[j].entities)
                {
                    if(this.checkEntities(input[j].entities, entities))
                    {
                        return dialogs[i];
                    }
                }
                else if(input[j].intent)
                {
                    if(intents.length > 0 && input[j].intent == intents[0].name)
                    {
                        return dialogs[i];
                    }
                }
                else if(input[j].types)
                {
                    //TODO
                }
                else if(input[j].if)
                {
                    //TODO eval을 써야만 하겠네
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

        var dialogs = undefined;
        if(session.dialogCursor)
        {
            dialogs = this.getNextDialogs(session.dialogCursor, bot.commonDialogs);
            if(!dialogs)
            {
                dialogs = this.getNextDialogs(session.dialogCursor, bot.dialogs);
            }
        }

        var dialog = undefined;
        if(!dialogs)
        {
            dialog = this.findDialog(context.nlu.nlpText, intents, entities, bot.commonDialogs);
            if(!dialog)
            {
                dialog = this.findDialog(context.nlu.nlpText, intents, entities, bot.dialogs);
            }
        }
        else
        {
            dialog = this.findDialog(context.nlu.nlpText, intents, entities, dialogs);
        }

        callback(null, dialog);

        console.log('----- DialogGraphManager find [End]');
        console.log();
    };

    module.exports = new DialogGraphManager();
})();
