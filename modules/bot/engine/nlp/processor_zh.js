var fs = require('fs');
var path = require('path');
var request = require("request");
var queryString = require('querystring');

var RakutenMA = require(path.resolve('./external_modules/rakutenma/rakutenma.js'));
var ZH_CharDic = require(path.resolve('./external_modules/rakutenma/zh_chardic.js'));
var CBTags = require(path.resolve('./modules/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./modules/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));


var ProcessorZH = function () {
    this.userDictionary = new UserDictionary(path.resolve('./external_modules/resources/zh/user.pos'));
    this.model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_zh.json')));
    this.rma = new RakutenMA(this.model, 1024, 0.007812);
    this.rma.featset = RakutenMA.default_featset_zh;
    this.rma.hash_func = RakutenMA.create_hash_func(15);
    this.zh_CharDic = new ZH_CharDic();
    this.rma.ctype_func = RakutenMA.create_ctype_chardic_func(this.zh_CharDic.get());

    this.cbTags = new CBTags();

    return this;
};

ProcessorZH.prototype.analyzePOS = function(inRaw) {
    var dicResult = this.userDictionary.applyUserDic('zh', inRaw);
    var text = dicResult[0];
    var mb_user_str = dicResult[1];
    var mb_user_tag = dicResult[2];

    // analyze POS
    var tokens = this.rma.tokenize(text);

    var temp = '';
    // restore user dictionary from POS
    for(var i=0; i<tokens.length; i++) {
        if ((tokens[i][0] in mb_user_str) && (tokens[i][1]=='NR')) {
            temp = tokens[i][0]
            tokens[i][0] = mb_user_str[temp];
            tokens[i][1] = mb_user_tag[temp];
        }
        tokens[i][1] = this.cbTags.normalizeTag('zh', tokens[i][1]);
    }

    return this.rma.tokens2json(inRaw, tokens);
}

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = ProcessorZH;
