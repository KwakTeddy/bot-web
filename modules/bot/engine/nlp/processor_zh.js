'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var RakutenMA = require(path.resolve('./external_modules/rakutenma/rakutenma.js'));
var ZH_CharDic = require(path.resolve('./external_modules/rakutenma/zh_chardic.js'));
var CBTags = require(path.resolve('./modules/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./modules/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));


function processInput(context, inRaw, callback) {

    var inNLP, nlpAll = [], _nlp = [];

    // 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ja/user.pos
        function(cb) {
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/zh/user.pos'));
            var model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_zh.json')));
            var rma = new RakutenMA(model, 1024, 0.007812);
            rma.featset = RakutenMA.default_featset_zh;
            rma.hash_func = RakutenMA.create_hash_func(15);
            var zh_CharDic = new ZH_CharDic();
            rma.ctype_func = RakutenMA.create_ctype_chardic_func(zh_CharDic.get());

            var cbTags = new CBTags();

            var dicResult = userDictionary.applyUserDic('zh', inRaw);
            var text = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];

            // analyze POS
            var tokens = rma.tokenize(text);

            var temp = '';
            // restore user dictionary from POS
            for(var i=0; i<tokens.length; i++) {
                if ((tokens[i][0] in mb_user_str) && (tokens[i][1]=='NR')) {
                    temp = tokens[i][0]
                    tokens[i][0] = mb_user_str[temp];
                    tokens[i][1] = mb_user_tag[temp];
                }
                tokens[i][1] = cbTags.normalizeTag('zh', tokens[i][1]);
            }

            if(inNLP == '') inNLP = inRaw;

            context.botUser["inNLP"] = inNLP;
            context.botUser.nlpAll = tokens;
            context.botUser.nlp = tokens;

            context.botUser["nlu"] = {};
            context.botUser.nlu["sentence"] = inRaw;
            var nlpJsonPOS = rma.tokens2json(inRaw, tokens);;
            context.botUser.nlu["pos"] = nlpJsonPOS;

            cb(null);
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze("zh", context.botUser.nlu.pos);
            context.botUser.nlu["sentenceInfo"] = value;

            cb(null);
        }
    ], function(err) {
        context.botUser.nlpCorrection = undefined;
        context.botUser.inRawCorrection = undefined;
        context.botUser.wordCorrection = undefined;

        callback(inNLP, null, null);
    });

}

exports.processInput = processInput;
