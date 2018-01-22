var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js').zh;

(function()
{
    var ChineseAnalyzer = function()
    {
        this.cbTags = new CBTags();
        var userDictionary = new UserDictionary('./nlp/resources/zh');
        var model = JSON.parse(fs.readFileSync('./nlp/rakutenma/model_zh.json'));
        var rma = new RakutenMA(model, 1024, 0.007812);
        rma.featset = RakutenMA.default_featset_zh;
        rma.hash_func = RakutenMA.create_hash_func(15);
        var zh_CharDic = new ZH_CharDic();
        rma.ctype_func = RakutenMA.create_ctype_chardic_func(zh_CharDic.get());

        this.dictionary = userDictionary;
        this.rma = rma;
    };

    ChineseAnalyzer.prototype.getNlpedText = function(inputRaw, callback)
    {
        inputRaw = inputRaw.replace(/(^\s*)|(\s*$)/gi, "");
        inputRaw = inputRaw.replace(/\"/gi, "");

        var lastChar = inputRaw.charAt(inputRaw.length - 1);
        if (!(lastChar == '.' || lastChar == '?' || lastChar == '!'))
        {
            lastChar = '';
        }

        var dicResult = this.dictionary.applyUserDic('zh', inputRaw);

        var text = dicResult[0];
        var mb_user_str = dicResult[1];
        var mb_user_tag = dicResult[2];
        var position = -1;

        var tokens = this.rma.tokenize(text);

        var nlp = [];
        var nlpAll = [];
        var inNLP = [];

        // restore user dictionary from POS
        for (var i = 0; i < tokens.length; i++)
        {
            for (var key in dicResult[1])
            {
                position = tokens[i][0].indexOf(key);
                if (position >= 0)
                {
                    if (tokens[i][0] == key)
                    {
                        tokens[i][1] = mb_user_tag[key];
                    }

                    tokens[i][0] = tokens[i][0].replace(new RegExp(key, 'gi'), dicResult[1][key]);
                }
            }

            if (i==1)
            {
                if (tokens[0][0]=="我" && tokens[i][0]=="在")
                {
                    tokens[i][1] = 'Verb';
                }
                else
                {
                    tokens[i][1] = this.cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);
                }
            }
            else
            {
                tokens[i][1] = this.cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);
            }

            var entry = {};
            entry.text = tokens[i][0];
            entry.pos = tokens[i][1];

            nlp.push(entry);
            nlpAll.push(entry);
            inNLP.push(entry.text);
        }

        inNLP = inNLP.join(' ');
        while (inNLP.search(/^ /) >= 0 || inNLP.search(/ $/) >= 0)
        {
            inNLP = inNLP.replace(new RegExp(/^ /, 'gi'), "").replace(new RegExp(" $", 'gi'), "");
        }

        var nlpJsonPOS = this.rma.tokens2json(inputRaw, tokens);
        callback(null, lastChar, inNLP, nlp, nlpAll, nlpJsonPOS);
    };

    ChineseAnalyzer.prototype.findSentenceType = function(inputRaw, nlp)
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

        var value = SentenceInfo.analyze('zh', inputRaw, nlp);
        return value;
    };

    ChineseAnalyzer.prototype.turnTaking = function(inputRaw)
    {
        var value = TurnTaking.analyze(inputRaw);
        return value;
    };

    ChineseAnalyzer.prototype.analysis = function(inputRaw, callback)
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
        this.getNlpedText(inputRaw, function(err, lastChar, inNLP, nlp, nlpAll, nlpJsonPOS)
        {
            if(err)
            {
                return callback(err);
            }

            var sentenceInfo = that.findSentenceType(inputRaw, nlp);
            var turnTaking = that.turnTaking(inputRaw);

            callback(null, lastChar, inNLP, nlp, nlpAll, sentenceInfo, turnTaking, nlpJsonPOS);
        });
    };

    module.exports = new ChineseAnalyzer();
})();
