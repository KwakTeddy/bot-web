'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var RakutenMA = require(path.resolve('./external_modules/rakutenma/rakutenma.js'));
var ZH_CharDic = require(path.resolve('./external_modules/rakutenma/zh_chardic.js'));
var CBTags = require(path.resolve('./engine/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./engine/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./engine/bot/engine/nlp/sentenceInfo.js'));
var TurnTaking = require(path.resolve('./engine/bot/engine/nlp/turnTaking.js'));

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
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/zh'));
            var model = JSON.parse(fs.readFileSync(path.resolve('./external_modules/rakutenma/model_zh.json')));
            var rma = new RakutenMA(model, 1024, 0.007812);
            rma.featset = RakutenMA.default_featset_zh;
            rma.hash_func = RakutenMA.create_hash_func(15);
            var zh_CharDic = new ZH_CharDic();
            rma.ctype_func = RakutenMA.create_ctype_chardic_func(zh_CharDic.get());

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

    var inNLP = "", nlpAll = [], _nlp = [];

    // 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ja/user.pos
        function(cb) {
            if (context == null) {
                context = {};
            }

            context.botUser = context.botUser || {};
            context.botUser["nlu"] = context.botUser["nlu"] || {};

            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                var cbTags = new CBTags();
                if (typeof inRaw.replace !== "function") {
                    if (context == null) {
                        context = {};
                    }
                    context.botUser = context.botUser || {};
                    context.botUser["nlu"] = context.botUser["nlu"] || {};
                    context.botUser.nlu["sentence"] = "";
                    context.botUser.nlu["pos"] = "";
                    cb(null);
                } else {
                    inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
                    inRaw = inRaw.replace(/\"/gi, "");
                    var dicResult = userDictionary.applyUserDic('zh', inRaw);
                    var text = dicResult[0];
                    var mb_user_str = dicResult[1];
                    var mb_user_tag = dicResult[2];

                    var position = -1;
                    // analyze POS
                    //var tokens = rma.tokenize(inRaw);
                    var tokens = rma.tokenize(text);

                    var temp = '';
                    var _inNLP = [];
                    // restore user dictionary from POS
                    for (var i = 0; i < tokens.length; i++) {
                        for (var key in dicResult[1]) {
                            position = tokens[i][0].indexOf(key);
                            if (position >= 0) {
                                if (tokens[i][0] == key) {
                                    tokens[i][1] = mb_user_tag[key];
                                }
                                tokens[i][0] = tokens[i][0].replace(new RegExp(key, 'gi'), dicResult[1][key]);
                            }
                        }
                        if (i==1) {
                            if (tokens[0][0]=="我" && tokens[i][0]=="在") {
                                tokens[i][1] = "Verb";
                            } else {
                                tokens[i][1] = cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);
                            }
                        } else {
                            tokens[i][1] = cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);
                        }
                        var entry = {};
                        entry["text"] = tokens[i][0];
                        entry["pos"] = tokens[i][1];
                        _nlp.push(entry);
                        _inNLP.push(entry["text"]);
                    }

                    inNLP = _inNLP.join(' ');
                    while (inNLP.search(/^ /) >= 0 || inNLP.search(/ $/) >= 0) {
                        inNLP = inNLP.replace(new RegExp(/^ /, 'gi'), "").replace(new RegExp(" $", 'gi'), "");
                    }

                    context.botUser["inNLP"] = inNLP;
                    context.botUser.nlpAll = _nlp;
                    context.botUser.nlp = _nlp;

                    context.botUser.nlu["sentence"] = inRaw;
                    var nlpJsonPOS = rma.tokens2json(inRaw, tokens);
                    context.botUser.nlu["pos"] = nlpJsonPOS;
                    context.botUser.nlu["inNLP"] = inNLP;

                    cb(null);
                }
            } else if (Array.isArray(inRaw)) {
                context.botUser["inNLP"] = "";
                context.botUser.nlpAll = "";
                context.botUser.nlp = "";

                context.botUser.nlu["sentence"] = "";
                context.botUser.nlu["pos"] = "";
                context.botUser.nlu["inNLP"] = "";
                cb(null);
            } else {
                context.botUser["nlu"] = {};
                context.botUser.nlu["sentence"] = "";
                context.botUser.nlu["pos"] = "";
                context.botUser.nlu["inNLP"] = "";

                cb(null);
            }


        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                if ("nlu" in context.botUser) {
                    var sentenceInfo = new SentenceInfo();
                    var value = sentenceInfo.analyze("zh", context.botUser.nlu);
                    context.botUser.nlu["sentenceInfo"] = value;
                    cb(null);
                } else {
                    cb(null);
                }
            } else {
                cb(null);
            }
        },
        // turn taking할지 분석 (0: 사용자가 계속 말하게 둔다. 1: 봇이 발화한다.
        // dsyoon (2017. 09. 19.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                if ("nlu" in context.botUser) {
                    var turnTaking = new TurnTaking();
                    var value = turnTaking.analyze("zh", context.botUser.nlu);
                    context.botUser.nlu["turnTaking"] = value;

                    cb(null);
                } else {
                    cb(null);
                }
            } else {
                cb(null);
            }
        }
    ], function(err) {
        if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
            context.botUser.nlpCorrection = undefined;
            context.botUser.inRawCorrection = undefined;
            context.botUser.wordCorrection = undefined;
        }

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
            if (inRaw == undefined || inRaw == null || Array.isArray(inRaw)) {
                cb(null);
            } else {
                var cbTags = new CBTags();
                inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
                inRaw = inRaw.replace(/\"/gi, "");

                var dicResult = userDictionary.applyUserDic('zh', inRaw);
                var text = dicResult[0];
                var mb_user_str = dicResult[1];
                var mb_user_tag = dicResult[2];

                // analyze POS
                var tokens = rma.tokenize(text);

                var temp = '';
                // restore user dictionary from POS
                for (var i = 0; i < tokens.length; i++) {
                    if ((tokens[i][0] in mb_user_str) && (tokens[i][1] == 'NR')) {
                        temp = tokens[i][0]
                        tokens[i][0] = mb_user_str[temp];
                        tokens[i][1] = mb_user_tag[temp];
                    }
                    tokens[i][1] = cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);

                    var entry = {};
                    entry["text"] = tokens[i][0];
                    entry["pos"] = tokens[i][1];
                    if (entry.pos !== 'AuxVerb' &&
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
        }
    ], function(err) {
        callback(null, _in);
    });
}
exports.processLiveInput = processLiveInput;



function analyzeFactLinks(context, inRaw, callback) {

    var data = loadZhDictionary();
    var userDictionary = data.userDictionary;
    var rma = data.rma;

    var node1="", node2="", link="";
    var nlu = [];

    // 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ja/user.pos
        function(cb) {
            var cbTags = new CBTags();
            inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
            inRaw = inRaw.replace(/\"/gi, "");
            var dicResult = userDictionary.applyUserDic('zh', inRaw);
            var text = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];

            var position = -1;
            // analyze POS
            var tokens = rma.tokenize(inRaw);

            var temp = '';
            // restore user dictionary from POS
            for (var i = 0; i < tokens.length; i++) {
                for (var key in dicResult[1]) {
                    position = tokens[i][0].indexOf(key);
                    if (position >= 0) {
                        tokens[i][0] = (" " + tokens[i][0] + " ").replace(new RegExp(key, 'gi'), dicResult[1][key]);
                        if (tokens[i][0] == key) {
                            tokens[i][1] = mb_user_tag[key];
                        }
                    }
                }
                tokens[i][1] = cbTags.normalizeTag('zh', tokens[i][0], tokens[i][1]);
                var entry = {};
                entry["text"] = tokens[i][0];
                entry["pos"] = tokens[i][1];
                nlu.push(entry);
            }

            cb(null);
        },
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze("zh", nlu);
            if (value != 0) {
                node1="";
                node2="";
                link="";
            }
            cb(null);
        },
        function(cb) {
            var mode = 0; // 1: the first noun, 2: verb, 3: the second noun
            for (var i = 0; i < nlu.length - 1; i++) {
                var token = nlu[i];
                if(isNaN(token.text) != true) continue;
                if ((token.text.indexOf("年") >= 0) ||
                    (token.text.indexOf("月") >= 0) ||
                    (token.text.indexOf("日") >= 0)) continue;
                if (node1==token.text) continue;

                if (mode == 0) {
                    if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                        node1 = token.text;
                        mode = 1;
                    }
                } else if (mode == 1) {
                    if (token.pos == 'Adjective' || token.pos == 'Verb') {
                        link = token.text;
                        mode = 2;
                    }
                } else if (mode == 2) {
                    if (token.pos == 'Noun' || token.pos == 'Pronoun' || token.pos == 'Foreign') {
                        node2 = token.text;
                        break;
                    }
                }
            }
            cb();
        }
    ], function(err) {
        callback(node1, node2, link);
    });

}
exports.analyzeFactLinks = analyzeFactLinks;
