var path = require('path');

var openNLP = require('./opennlp/opennlp.js');
var posTagger = new openNLP().posTagger;

var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js').en;

var Typos = require('./typos.js');
var typos = new Typos('en');

(function()
{
    var EnglishAnalyzer = function()
    {
        this.cbTags = new CBTags();
    };

    EnglishAnalyzer.prototype.getNlpedText = function(inputRaw, callback)
    {
        inputRaw = inputRaw.replace(/(^\s*)|(\s*$)/gi, "");
        inputRaw = inputRaw.replace(/\"/gi, "");

        var userDictionary = new UserDictionary('en');

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

        var dicResult = userDictionary.applyUserDic('en', tempInputRaw);
        var mb_user_str = dicResult[1];
        var mb_user_tag = dicResult[2];
        var position = -1;

        var tempInRaw = '';
        var arr = inputRaw.split(' ');
        for (var i=0; i<arr.length; i++)
        {
            if (i > 0)
            {
                tempInRaw += ' ';
            }

            var tempStr = typos.checkAndReplace('en', arr[i]);

            if (!tempStr)
            {
                tempInRaw += arr[i];
            }
            else
            {
                tempInRaw += tempStr;
            }
        }

        inputRaw = tempInRaw;

        var that = this;
        posTagger.tag(inputRaw, function(err, result)
        {
            if(err)
            {
                return callback(err);
            }

            var nlpText = [];
            var nlp = [];

            if (!result)
            {
                result = [tempInputRaw];
            }

            var textArr = inputRaw.split(' ');

            // 사용자 사전 적용
            for (var i=0; i<result.length; i++)
            {
                var entry = {};

                entry.text = textArr[i];
                entry.pos = result[i];
                if (entry.text == 'like' || entry.text == 'like.' || entry.text == 'like?')
                {
                    entry.pos = 'Verb'
                }
                else if (entry.text == 'apple' || entry.text == 'apple.'|| entry.text == 'apple?')
                {
                    entry.pos = 'Noun'
                }
                else if (entry.text == 'i' || entry.text == 'I')
                {
                    entry.pos = 'Pronoun'
                }

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

                entry.pos = that.cbTags.normalizeTag('en', entry.text, entry.pos);

                nlp.push(entry);
                nlpText.push(entry.text);
            }

            nlpText = nlpText.join(' ');
            nlpText = nlpText.replace(/(?:\{ | \})/g, '+');

            if (nlpText == '')
            {
                nlpText = inputRaw;
            }

            callback(null, lastChar, nlpText, nlp);
        });
    };

    EnglishAnalyzer.prototype.findSentenceType = function(inputRaw, nlp)
    {
        var value = SentenceInfo.analyze('en', inputRaw, nlp);
        return value;
    };

    EnglishAnalyzer.prototype.turnTaking = function(inputRaw)
    {
        var value = TurnTaking.analyze(inputRaw);
        return value;
    };

    EnglishAnalyzer.prototype.analysis = function(inputRaw, callback)
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
        this.getNlpedText(inputRaw, function(err, lastChar, nlpText, nlp, nlpJsonPOS)
        {
            if(err)
            {
                return callback(err);
            }

            var sentenceInfo = that.findSentenceType(inputRaw, nlp);
            var turnTaking = that.turnTaking(inputRaw);

            callback(null, lastChar, nlpText, nlp, sentenceInfo, turnTaking, nlpJsonPOS);
        });
    };

    module.exports = new EnglishAnalyzer();
})();
