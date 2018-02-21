var randomQuibble = function(qs)
{
    return qs[Math.floor(Math.random() * qs.length)];
};

(function()
{
    var QuibbleManager = function()
    {

    };

    QuibbleManager.prototype.getSlangQuibble = function(quibbles, inputRaw)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<quibbles[i].condition.words.length; j++)
            {
                if(inputRaw.indexOf(quibbles[i].condition.words[j]) != -1)
                {
                    return randomQuibble(quibbles[i].sentences);
                }
            }
        }
    };

    QuibbleManager.prototype.getNounQuibble = function(quibbles, nlp)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<nlp.length; j++)
            {
                if(nlp[j].pos == 'Noun' && quibbles[i].condition.words.indexOf(nlp[j].text) != -1)
                {
                    return randomQuibble(quibbles[i].sentences);
                }
            }
        }
    };

    QuibbleManager.prototype.getVerbQuibble = function(quibbles, nlp, sentenceInfo)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<nlp.length; j++)
            {
                if((nlp[j].pos == 'Verb' || nlp[j].post == 'Adjective') && quibbles[i].condition.words.indexOf(nlp[j].text) != -1)
                {
                    if(quibbles[i].condition.questionWord && quibbles[i].condition.questionWord != 'yesno')
                    {
                        var token1 = nlp[j];
                        if((quibbles[i].condition.questionWord == undefined || quibbles[i].condition.questionWord == token1.text) &&
                           (quibbles[i].condition.tenseType  == undefined || sentenceInfo.tenseType == undefined || quibbles[i].condition.tenseType == sentenceInfo.tenseType) &&
                           (quibbles[i].condition.sentenceType  == undefined || sentenceInfo.sentenceType == undefined || quibbles[i].condition.sentenceType == sentenceInfo.sentenceType)) {
                            return randomQuibble(quibbles[i].sentences);
                        }
                    }
                    else
                    {
                        if((quibbles[i].condition.tenseType == undefined || sentenceInfo.tenseType == undefined ||  quibbles[i].condition.tenseType == sentenceInfo.tenseType) &&
                           (quibbles[i].condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || quibbles[i].condition.sentenceType == sentenceInfo.sentenceType)) {
                            return randomQuibble(quibbles[i].sentences);
                        }
                    }
                }
            }
        }
    };

    QuibbleManager.prototype.getSentenceQuibble = function(quibbles, nlp, sentenceInfo)
    {
        for(var i=0; i<quibbles.length; i++)
        {
            for(var j=0; j<nlp.length; j++)
            {
                var token = nlp[j];
                var q = quibbles[i];
                if((q.condition.questionWord == undefined || q.condition.words.indexOf(token.text) != -1) &&
                   (q.condition.tenseType == undefined || sentenceInfo.tenseType == undefined || q.condition.tenseType == sentenceInfo.tenseType) &&
                   (q.condition.sentenceType == undefined || sentenceInfo.sentenceType == undefined || q.condition.sentenceType == sentenceInfo.sentenceType) &&
                   (q.condition.nlpLength == undefined || q.condition.nlpLength < nlp.length)) {
                    return randomQuibble(q.sentences);
                }
            }
        }
    };

    QuibbleManager.prototype.process = function(quibbles, userInput)
    {
        var nlp = userInput.nlp;
        var inputRaw = userInput.text;
        var sentenceInfo = userInput.sentence;

        return this.getSlangQuibble(quibbles.slangQuibbles, inputRaw) || this.getNounQuibble(quibbles.nounQuibbles, nlp) || this.getVerbQuibble(quibbles.verbQuibbles, nlp, sentenceInfo) || this.getSentenceQuibble(quibbles.sentenceQuibbles, nlp, sentenceInfo) || (quibbles.quibble ? randomQuibble(quibbles.quibble) : undefined);
    };

    module.exports = new QuibbleManager();
})();
