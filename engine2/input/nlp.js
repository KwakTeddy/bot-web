var nlpKo = require('./nlp/nlpKo.js');

(function()
{
    var NLPManager = function()
    {

    };

    NLPManager.prototype.getNLPedText = function(language, inputRaw, callback)
    {
        if(language == 'ko')
        {
            nlpKo.getNlpedText(inputRaw, callback);
        }
        else if(language == 'en')
        {

        }
        else if(language == 'zh')
        {

        }
        else if(language == 'ja')
        {

        }
    };

    NLPManager.prototype.analysis = function(language, inputRaw, callback)
    {
        if(language == 'ko')
        {
            nlpKo.analysis(inputRaw, callback);
        }
        else if(language == 'en')
        {

        }
        else if(language == 'zh')
        {

        }
        else if(language == 'ja')
        {

        }
    };

    module.exports = new NLPManager();
})();
