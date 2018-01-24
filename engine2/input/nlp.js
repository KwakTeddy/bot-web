(function()
{
    var NLPManager = function()
    {
        this.nlpKo = require('./nlp/nlpKo.js');
        this.nlpEn = require('./nlp/nlpEn.js');
        this.nlpZh = undefined;
        this.nlpJa = undefined;
    };

    NLPManager.prototype.getNlpedText = function(language, inputRaw, callback)
    {
        if(language == 'ko')
        {
            this.nlpKo.getNlpedText(inputRaw, callback);
        }
        else if(language == 'en')
        {
            this.nlpEn.getNlpedText(inputRaw, callback);
        }
        else if(language == 'zh')
        {
            // 서버기동시 로드가 느려서 서버가 늦게뜨는것 때문에 이렇게 처리함.
            if(!this.nlpZh)
            {
                this.nlpZh = require('./nlp/nlpZh.js');
            }

            this.nlpZh.getNlpedText(inputRaw, callback);
        }
        else if(language == 'ja')
        {
            if(!this.nlpJa)
            {
                this.nlpJa = require('./nlp/nlpJa.js');
            }

            this.nlpJa.getNlpedText(inputRaw, callback);
        }
    };

    NLPManager.prototype.analysis = function(language, inputRaw, callback)
    {
        if(language == 'ko')
        {
            this.nlpKo.analysis(inputRaw, callback);
        }
        else if(language == 'en')
        {
            this.nlpEn.analysis(inputRaw, callback);
        }
        else if(language == 'zh')
        {
            if(!this.nlpZh)
            {
                this.nlpZh = require('./nlp/nlpZh.js');
            }

            this.nlpZh.analysis(inputRaw, callback);
        }
        else if(language == 'ja')
        {
            if(!this.nlpJa)
            {
                this.nlpJa = require('./nlp/nlpJa.js');
            }

            this.nlpJa.analysis(inputRaw, callback);
        }
    };

    module.exports = new NLPManager();
})();
