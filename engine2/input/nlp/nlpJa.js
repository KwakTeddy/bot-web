var fs = require('fs');
var path = require('path');

var CBTags = require('./cbTags.js');
var UserDictionary = require('./userDictionary.js');
var SentenceInfo = require('./sentenceInfo.js');
var TurnTaking = require('./turnTaking.js').ja;

(function()
{
    var JapaneseAnalyzer = function()
    {
        var RakutenMA = require('./rakutenma/rakutenma.js');
        this.cbTags = new CBTags();
        var model = JSON.parse(fs.readFileSync(path.resolve('./engine2/input/nlp/rakutenma/model_ja.json')));
        var rma = new RakutenMA(model, 1024, 0.007812);
        rma.featset = RakutenMA.default_featset_ja;
        rma.hash_func = RakutenMA.create_hash_func(15);

        this.dictionary = new UserDictionary('ja');
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
        var nlpText = [];

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
            nlpText.push(entry.text);
        }

        nlpText = nlpText.join(' ');

        var nlpJsonPOS = this.rma.tokens2json(inputRaw, tokens);
        callback(null, lastChar, nlpText, nlp, nlpJsonPOS);
    };

    JapaneseAnalyzer.prototype.findSentenceType = function(inputRaw, nlp)
    {
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

    module.exports = new JapaneseAnalyzer();
})();
