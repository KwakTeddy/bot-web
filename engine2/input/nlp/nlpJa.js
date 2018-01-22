var RakutenMA = require('./nlp/rakutenma/rakutenma.js');
var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js').ja;

(function()
{
    var JapaneseAnalyzer = function()
    {
        this.cbTags = new CBTags();
        var userDictionary = new UserDictionary('./nlp/resources/ja/user.pos');
        var model = JSON.parse(fs.readFileSync('./nlp/rakutenma/model_ja.json'));
        var rma = new RakutenMA(model, 1024, 0.007812);
        rma.featset = RakutenMA.default_featset_ja;
        rma.hash_func = RakutenMA.create_hash_func(15);

        this.dictionary = userDictionary;
        this.rma = rma;
    };

    JapaneseAnalyzer.prototype.getNlpedText = function(inputRaw, callback)
    {
        inputRaw = inputRaw.replace(/(^\s*)|(\s*$)/gi, "");
        inputRaw = inputRaw.replace(/\"/gi, "");

        var lastChar = inputRaw.charAt(inputRaw.length - 1);
        if (!(lastChar == '.' || lastChar == '?' || lastChar == '!'))
        {
            lastChar = '';
        }

        var dicResult = this.dictionary.applyUserDic('ja', inputRaw);

        var text = dicResult[0];
        var mb_user_str = dicResult[1];
        var mb_user_tag = dicResult[2];

        text = this.dictionary.convert(text);
        var tokens = this.rma.tokenize(text);

        var nlp = [];
        var nlpAll = [];
        var inNLP = [];

        var temp = '';
        for (var i = 0; i < tokens.length; i++)
        {
            if ((tokens[i][0] in mb_user_str) && ((tokens[i][1] == 'N-pn') || (tokens[i][1] == 'N-nc')))
            {
                temp = tokens[i][0];
                tokens[i][0] = mb_user_str[temp];
                tokens[i][1] = mb_user_tag[temp];
            }

            tokens[i][1] = this.normalizeTag('ja', tokens[i][0], tokens[i][1]);

            var entry = {};
            entry.text = tokens[i][0];
            entry.pos = tokens[i][1];
            nlp.push(entry);
            nlpAll.push(entry);
            inNLP.push(entry.text);
        }

        inNLP = inNLP.join(' ');

        var nlpJsonPOS = this.rma.tokens2json(inputRaw, tokens);
        callback(null, lastChar, inNLP, nlp, nlpAll, nlpJsonPOS);
    };

    JapaneseAnalyzer.prototype.findSentenceType = function(inputRaw, nlp)
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

    JapaneseAnalyzer.prototype.turnTaking = function(inputRaw)
    {
        var value = TurnTaking.analyze(inputRaw);
        return value;
    };

    JapaneseAnalyzer.prototype.analysis = function(inputRaw, callback)
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

    module.exports = new JapaneseAnalyzer();
})();
