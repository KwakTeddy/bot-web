var nlpKo = require('./nlp/nlpKo.js');
var nlpEn = require('./nlp/nlpEn.js');
var nlpZh = require('./nlp/nlpZh.js');
var nlpJa = require('./nlp/nlpJa.js');

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
            nlpEn.getNlpedText(inputRaw, callback);
        }
        else if(language == 'zh')
        {
            nlpZh.getNlpedText(inputRaw, callback);
        }
        else if(language == 'ja')
        {
            nlpJa.getNlpedText(inputRaw, callback);
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
            nlpEn.analysis(inputRaw, callback);
        }
        else if(language == 'zh')
        {
            nlpZh.analysis(inputRaw, callback);
        }
        else if(language == 'ja')
        {
            nlpJa.analysis(inputRaw, callback);
        }
    };

    module.exports = new NLPManager();
})();
