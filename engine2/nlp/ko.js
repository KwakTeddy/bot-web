var path = require('path');

var processor = require('./engine2/bot/engine/nlp/processor.js');
var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js');
var turnTaking = new TurnTaking("ko");
var NLPUtil = require('./nlpUtil.js');

(function()
{
    var KoreanAnalyzer = function()
    {
        this.nlpKo = new processor({
            stemmer: true,      // (optional default: true)
            normalizer: true,   // (optional default: true)
            spamfilter: true     // (optional default: false)
        });
    };

    KoreanAnalyzer.prototype.morphemeAnalysis = function(session, inputRaw, callback, error)
    {
        var that = this;

        if(!inputRaw)
        {
            return error.delegate('inputRaw is undefined');
        }

        if(Array.isArray(inputRaw))
        {
            return error.delegate('inputRaw is must be string');
        }

        var cbTags = new CBTags();
        inputRaw = inputRaw.replace(/(^\s*)|(\s*$)/gi, "");
        inputRaw = inputRaw.replace(/\"/gi, "");

        var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ko'));

        var tempInputRaw = inputRaw;

        var lastChar = tempInputRaw.charAt(tempInputRaw.length - 1);
        if (lastChar == '.' || lastChar == '?' || lastChar == '!')
        {
            tempInputRaw = tempInputRaw.substring(0, tempInputRaw.length - 1);
        }
        else
        {
            lastChar = '';
        }

        var dicResult = userDictionary.applyUserDic('KO', tempInputRaw);
        var mb_user_str = dicResult[1];
        var mb_user_tag = dicResult[2];
        var position = -1;

        var nlpAll = [];
        var nlp = [];
        var inNLP = [];

        this.nlpKo.tokenize(dicResult[0], function (err, result)
        {
            if(err)
            {
                return error.delegate(err);
            }

            if (!result)
            {
                result = tempInputRaw;
            }

            // 사용자 사전 적용
            for (var i=0; i<result.length; i++)
            {
                var entry = result[i];
                for (var key in dicResult[1])
                {
                    position = entry.text.indexOf(key);
                    if (position >= 0)
                    {
                        if (entry.text == key)
                        {
                            entry.pos = mb_user_tag[key];
                        }

                        entry.text = (entry.text).replace(new RegExp(key,'gi'), mb_user_str[key]);
                    }
                }

                entry.pos = cbTags.normalizeTag('ko', entry.text, entry.pos);

                if(entry.pos == 'Alpha')
                {
                    entry.pos = 'Noun';
                }

                nlpAll.push(entry);
                //if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _nlp.push(entry);
                //if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _inNLP.push(entry.text);
                nlp.push(entry);
                inNLP.push(entry.text);
            }

            inNLP = inNLP.join(' ');
            inNLP = inNLP.replace(/(?:\{ | \})/g, '+');
            if (inNLP == '')
            {
                inNLP = inputRaw;
            }

            session.botUser.inNLP = inNLP;
            session.botUser.nlpAll = nlpAll;
            session.botUser.nlp = nlp;

            session.botUser.nlu.sentence = inputRaw;
            session.botUser.nlu.lastChar = lastChar;
            session.botUser.nlu.nlp = nlp;
            session.botUser.nlu.inNLP = inNLP;

            async.eachSeries(nlp, function(item, next)
            {
                if(item.pos == 'Verb')
                {
                    that.nlpKo.tokenize(item.text, function(err, result)
                    {
                        for(var i=0; i<result.length; i++)
                        {
                            var entry = result[i];
                            item.stem = entry.text;
                        }

                        next();
                    });
                }
                else
                {
                    item.stem = item.text;
                    next();
                }
            },
            function()
            {
                session.botUser.nlu.nlp = nlp;
                var nlpUtil = new NLPUtil();
                var nlpJsonPOS = nlpUtil.convertJSON(inputRaw, nlp);
                session.botUser.nlu.json = nlpJsonPOS;

                if(callback)
                {
                    callback();
                }
            });
        });
    };

    module.exports = new KoreanAnalyzer();
})();
