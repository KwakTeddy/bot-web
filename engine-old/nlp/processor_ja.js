'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var RakutenMA = require(path.resolve('./external_modules/rakutenma/rakutenma.js'));
var CBTags = require(path.resolve('./engine2/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./engine2/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./engine2/bot/engine/nlp/sentenceInfo.js'));
var TurnTaking = require(path.resolve('./engine2/bot/engine/nlp/turnTaking.js'));

var loadZhDictionary = undefined;
(function()
{
    var result = undefined;
    loadZhDictionary = function()
    {
        if(result) {
            return result;
        }
        else
        {
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ja/user.pos'));
            var model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_ja.json')));
            var rma = new RakutenMA(model, 1024, 0.007812);
            rma.featset = RakutenMA.default_featset_ja;
            rma.hash_func = RakutenMA.create_hash_func(15);

            result = {
                userDictionary: userDictionary,
                rma: rma
            };

            return result;
        }
    }
})();

function processInput(context, inRaw, callback) {

    var data = loadZhDictionary();
    var userDictionary = data.userDictionary;
    var rma = data.rma;

    var inNLP, nlpAll = [], _nlp = [];

    // 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ja/user.pos
        function(cb) {
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ja/user.pos'));
            var model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_ja.json')));
            var rma = new RakutenMA(model, 1024, 0.007812);
            rma.featset = RakutenMA.default_featset_ja;
            rma.hash_func = RakutenMA.create_hash_func(15);

            inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
            inRaw = inRaw.replace(/\"/gi, "");

            var cbTags = new CBTags();

            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
                inRaw = inRaw.replace('。', '');
                var dicResult = userDictionary.applyUserDic('ja', inRaw);
                var text = dicResult[0];
                var mb_user_str = dicResult[1];
                var mb_user_tag = dicResult[2];

                // analyze POS
                text = userDictionary.convert(text);
                var tokens = rma.tokenize(text);

                var temp = '';
                var _inNLP = [];
                // restore user dictionary from POS
                for (var i = 0; i < tokens.length; i++) {
                    if ((tokens[i][0] in mb_user_str) && ((tokens[i][1] == 'N-pn') || (tokens[i][1] == 'N-nc'))) {
                        temp = tokens[i][0];
                        tokens[i][0] = mb_user_str[temp];
                        tokens[i][1] = mb_user_tag[temp];
                    }
                    tokens[i][1] = cbTags.normalizeTag('ja', tokens[i][0], tokens[i][1]);

                    var entry = {};
                    entry["text"] = tokens[i][0];
                    entry["pos"] = tokens[i][1];
                    _nlp.push(entry);
                    _inNLP.push(entry["text"]);
                }

                inNLP = _inNLP.join(' ');

                if (context == null) {
                    context = {};
                }

                context.botUser = context.botUser || {};
                context.botUser["nlu"] = context.botUser["nlu"] || {};

                context.botUser["inNLP"] = inNLP;
                context.botUser.nlpAll = _nlp;
                context.botUser.nlp = _nlp;

                context.botUser.nlu["sentence"] = inRaw;
                var nlpJsonPOS = rma.tokens2json(inRaw, tokens);
                context.botUser.nlu["pos"] = nlpJsonPOS;
                context.botUser.nlu["inNLP"] = inNLP;

                cb(null);
            } else if (Array.isArray(inRaw)) {
                if (context == null) {
                    context = {};
                }

                context.botUser = context.botUser || {};
                context.botUser["nlu"] = context.botUser["nlu"] || {};

                context.botUser["inNLP"] = "";
                context.botUser.nlpAll = "";
                context.botUser.nlp = "";

                context.botUser.nlu["sentence"] = "";
                context.botUser.nlu["pos"] = "";
                context.botUser.nlu["inNLP"] = "";
                cb(null);
            } else {
                cb(null);
            }
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze("ja", context.botUser.nlu);
            context.botUser.nlu["sentenceInfo"] = value;

            cb(null);
        },
        // turn taking할지 분석 (0: 사용자가 계속 말하게 둔다. 1: 봇이 발화한다.
        // dsyoon (2017. 09. 19.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var turnTaking = new TurnTaking();
            var value = turnTaking.analyze("ja", context.botUser.nlu);
            context.botUser.nlu["turnTaking"] = value;

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


function processLiveInput(inRaw, callback) {

    var data = loadZhDictionary();
    var userDictionary = data.userDictionary;
    var rma = data.rma;

    var _nlp = [], _in;

    // 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ja/user.pos
        function(cb) {
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ja'));
            var model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_ja.json')));
            var rma = new RakutenMA(model, 1024, 0.007812);
            rma.featset = RakutenMA.default_featset_ja;
            rma.hash_func = RakutenMA.create_hash_func(15);

            inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
            inRaw = inRaw.replace(/\"/gi, "");

            var cbTags = new CBTags();

            if (inRaw == undefined || inRaw == null || Array.isArray(inRaw)) {
                cb(null);
            }

            inRaw = inRaw.replace('。', '');
            var dicResult = userDictionary.applyUserDic('ja', inRaw);
            var text = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];

            // analyze POS
            text = userDictionary.convert(text);
            var tokens = rma.tokenize(text);

            var temp = '';
            var _inNLP = [];
            // restore user dictionary from POS
            for(var i=0; i<tokens.length; i++) {
                if ((tokens[i][0] in mb_user_str) && ((tokens[i][1]=='N-pn') || (tokens[i][1]=='N-nc'))) {
                    temp = tokens[i][0];
                    tokens[i][0] = mb_user_str[temp];
                    tokens[i][1] = mb_user_tag[temp];
                }
                tokens[i][1] = cbTags.normalizeTag('ja', tokens[i][0], tokens[i][1]);

                var entry = {};
                entry["text"] = tokens[i][0];
                entry["pos"] = tokens[i][1];
                if(entry.pos !== 'AuxVerb' &&
                    entry.pos !== 'Determiner' &&
                    entry.pos !== 'Conjunction' &&
                    entry.pos !== 'Determiner' &&
                    entry.pos !== 'Interjection' &&
                    entry.pos !== 'Prefix' &&
                    entry.pos !== 'Preposition' &&
                    entry.pos !== 'Suffix' &&
                    entry.pos !== 'Unknown' &&
                    entry.pos !== 'Punctuation') {
                    _nlp.push(entry.text);
                }
            }

            _in = _nlp.join(' ');
            cb(null, _in);
        }
    ], function(err) {

        callback(null, _in);
    });
}
exports.processLiveInput = processLiveInput;
