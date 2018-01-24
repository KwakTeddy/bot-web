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

    DialogGraphManager.prototype.findDialog = function(context, callback)
    {
        for(var i=0; i<dialogs.length; i++)
        {
            var input = dialogs[i].input;
            if(!input)
            {
                continue;
            }

            if(input.text)
            {
                return this.checkInputText(context.nlu.nlpText, input.text);
            }
            else if(input.entities)
            {

            }
            else if(input.intent)
            {
                return context.nlu.intents.length > 0 && input.intent == context.nlu.intents[0].name;
            }
            else if(input.types)
            {

            }
            else if(input.if)
            {
                //eval을 써야만 하겠네
            }
        }
    };

    DialogGraphManager.prototype.find = function(bot, context)
    {
        // 가장먼저 공통 다이얼로그에서 찾고
        // 그 다음 사용자 다이얼로그에서 찾고
        // 각 대화카드의 input값을 가지고

        console.log();
        console.log('----- DialogGraphManager find [Start]');

        this.findDialog(context, bot.commonDialogs);

        console.log(bot.commonDialogs);
        console.log(bot.dialogs);

        console.log('----- DialogGraphManager find [End]');
        console.log();
    };

    module.exports = new DialogGraphManager();
})();
