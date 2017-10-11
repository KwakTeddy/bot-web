var path = require('path');

var NLPKo = require('./nlp/nlp-ko.js');

var nlp = require(path.resolve('./bot-engine/engine/nlp/processor.js'));

(function()
{
    var NLPManager = function()
    {
        this.ko = new NLPKo({ stemmer: true, normalizer: true, spamfilter: true });
    };

    NLPManager.prototype.initialize = function(language, done)
    {
        if(this[language].isDone)
            done();
        else
            this[language].initialize(done);
    };

    NLPManager.prototype.tokenize = function(language, rawText, done, errCallback)
    {
        if(language && typeof rawText == 'function' && !done)
        {
            done = rawText;
            rawText = language;
            language = 'ko'; //defualt
        }

        language = language || 'ko';

        this.initialize(language, function()
        {
            this[language].tokenize(rawText, done, errCallback);
        }.bind(this));
    };

    module.exports = new NLPManager();
})();
