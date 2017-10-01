var path = require('path');

var NLPKo = require('./nlp/nlp-ko.js');

var nlp = require(path.resolve('./bot-engine/engine/nlp/processor.js'));

(function()
{
    var NLPManager = function()
    {
        this.ko = new NLPKo({ stemmer: true, normalizer: true, spamfilter: true });
    };

    NLPManager.prototype.initialize = function(lan, done)
    {
        this.ko.initialize(done);

        done();
    };

    NLPManager.prototype.tokenize = function(userInputText, done)
    {
        this.ko.tokenize(userInputText, function(result)
        {
            done(result);
        });
    };

    module.exports = new NLPManager();
})();
