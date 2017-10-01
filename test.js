var nlp = require('./bot-engine/engine/nlp/processor.js');

var NLPKo = require('./bot-engine/modules/nlp/nlp-ko.js');

// var nlpKo = new nlp({
//     stemmer: true,      // (optional default: true)
//     normalizer: true,   // (optional default: true)
//     spamfilter: true     // (optional default: false)
// });
//
// nlpKo.tokenize('반가워', function(err, result)
// {
//     console.log(result);
// });

var ko = new NLPKo({ stemmer: true, normalizer: true, spamfilter: true });
ko.initialize(function()
{
    ko.tokenize('반가워', function(result)
    {
        console.log('결과 : ', result);
    });
});
