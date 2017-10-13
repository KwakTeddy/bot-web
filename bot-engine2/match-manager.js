(function()
{
    var MatchManager = function()
    {

    };

    MatchManager.prototype.match = function(nlpText, dialogs)
    {
        nlpText = nlpText.replace(/\s/gi, '');
        for(var i=0; i<dialogs.length; i++)
        {
            var dialog = dialogs[i];
            var input = dialogs[i].input;

            if(dialogs[i].inputRaw == '홈페이지 접속이 안돼요')
            {
                console.log(dialogs[i].input);
            }

            if(typeof input == 'object' && input.length)
            {
                for(var j=0; j<input.length; j++)
                {
                    if(typeof input[j] == 'string' || input[j].text)
                    {
                        if(this.matchText(nlpText, input[j]))
                        {
                            return dialog;
                        }
                    }
                }
            }
            else if(typeof input == 'string' || input.text)
            {
                if(this.matchText(nlpText, input))
                {
                    return dialog;
                }
            }
        }

        return null;
    };

    MatchManager.prototype.matchText = function(nlpText, input)
    {
        var matched = true;
        if(typeof input.text == 'string')
        {
            input = input.text;
        }

        var words = input.split(/\s/);
        for (var i = 0; i < words.length; i++)
        {
            var word = words[i];
            word = RegExp.escape(word);

            if(word.startsWith('~'))
            {
                // matched = false;
                // var concepts = utils.findConcepts(context, word.substring(1));
                // for (var j = 0; j < concepts.length; j++) {
                //     var concept = concepts[j];
                //     concept = RegExp.escape(concept);
                //     if(inNLP.search(new RegExp('(?:^|\\b|\\s)' + concept + '(?:$|\\b|\\s)', 'i')) != -1) {  // 포함이 아닌 정확히 매치로 수정 by com2best
                //         _matched = true;
                //         break;
                //     }
                // }
                // if(!_matched) break;
            }
            else if(nlpText.search(new RegExp('(?:^|\\b|\\s)' + word + '(?:$|\\b|\\s)', 'i')) == -1)
            {
                matched = false;
                break;
            }
        }

        return matched;
    };

    module.exports = new MatchManager();
})();
