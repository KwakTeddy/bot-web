var nlp = require('./bot-engine/engine/nlp/processor.js');

var nlpManager = require('./bot-engine/modules/nlp-manager');
nlpManager.tokenize('ko', '테스트로 하겠습니다.', function(result)
{
    console.log(result);

    result = result.processed;

    var nlp = [];
    for(var i in result)
    {
        if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')
        {
            nlp.push(result[i].text);
        }
    }

    var input = nlp.join(' ');

    console.log('인풋 : ', input);
}, function(err)
{
    console.log(err);
});
