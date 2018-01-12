var path = require('path');
var processor = require('./processor.js');
var async = require('async');

var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js').ko;
var NLPUtil = require('./nlpUtil.js');
var processor = require('./processor.js');

(function()
{
    var KoreanAnalyzer = function()
    {
        var that = this;
        this.nlpKo = undefined;
    };

    KoreanAnalyzer.prototype.initNLPKo = function(callback)
    {
        if(this.nlpKo)
        {
            callback();
        }
        else
        {
            this.nlpKo = new processor({
                stemmer: true,      // (optional default: true)
                normalizer: true,   // (optional default: true)
                spamfilter: true     // (optional default: false)
            });

            callback();
        }
    };

    KoreanAnalyzer.prototype.getNlpedText = function(inputRaw, callback)
    {
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

        var that = this;
        this.initNLPKo(function()
        {
            that.nlpKo.tokenize(dicResult[0], function (err, result)
            {
                if(err)
                {
                    return callback(err);
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

                            entry.text = (entry.text).replace(new RegExp(key, 'gi'), mb_user_str[key]);
                        }
                    }

                    entry.pos = cbTags.normalizeTag('ko', entry.text, entry.pos);

                    if (entry.pos == 'Alpha')
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

                callback(null, lastChar, inNLP, nlp, nlpAll);
            });
        });
    };

    KoreanAnalyzer.prototype.morphemeAnalysis = function(inputRaw, nlp, callback)
    {
        async.eachSeries(nlp, function(item, next)
        {
            if(item.pos == 'Verb')
            {
                this.nlpKo.tokenize(item.text, function(err, result)
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
            var nlpUtil = new NLPUtil();
            var nlpJsonPOS = nlpUtil.convertJSON(inputRaw, nlp);

            if(callback)
            {
                callback(nlpJsonPOS);
            }
        });
    };

    KoreanAnalyzer.prototype.findSentenceType = function(inputRaw, nlp)
    {
        var str = inputRaw;

        // 1. 문장 부호 확인
        var lastStr = str.charAt(str.length - 1);
        if (lastStr == "?" || lastStr == "？")
        {
            return this.type.interrogative;
        }
        else if (lastStr == "!")
        {
            return this.type.exclamation;
        }

        var value = SentenceInfo.analyze('ko', inputRaw, nlp);
        return value;
        // context.botUser.nlu["sentenceInfo"] = value;
    };

    KoreanAnalyzer.prototype.turnTaking = function(inputRaw)
    {
        var value = TurnTaking.analyze(inputRaw);
        return value;
    };

    KoreanAnalyzer.prototype.analysis = function(inputRaw, callback)
    {
        if(!inputRaw)
        {
            return callback('inputRaw is undefined');
        }

        if(Array.isArray(inputRaw))
        {
            return callback('inputRaw is must be string');
        }

        var that = this;
        this.getNlpedText(inputRaw, function(err, lastChar, inNLP, nlp, nlpAll)
        {
            if(err)
            {
                return callback(err);
            }

            that.morphemeAnalysis(inputRaw, nlp, function(nlpJsonPOS)
            {
                var sentenceInfo = that.findSentenceType(inputRaw, nlp);
                var turnTaking = that.turnTaking(inputRaw);

                callback(null, lastChar, inNLP, nlp, nlpAll, sentenceInfo, turnTaking, nlpJsonPOS);
            });
        });
    };

    module.exports = new KoreanAnalyzer();
})();
