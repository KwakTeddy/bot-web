var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

var NLPKo = require('./nlp/nlp-ko.js');

(function()
{
    var NLPManager = function()
    {
        this.ko = new NLPKo({ stemmer: true, normalizer: true, spamfilter: true });
        // this.en = new NLPEn();
        // this.zh = new NLPZh();
        // this.ja = new NLPJa();
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
            this[language].tokenize(rawText, done, function(err)
            {
                logger.systemError(err);
                errCallback(err);
            });
        }.bind(this));
    };

    module.exports = new NLPManager();
})();
