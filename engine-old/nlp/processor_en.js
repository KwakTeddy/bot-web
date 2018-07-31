'use strict'

var path = require('path');
// var _ = require('lodash');
var async = require('async');

var openNLP = require(path.resolve('./external_modules/opennlp/opennlp.js'));
var posTagger = new openNLP().posTagger;

// var logger = require(path.resolve('./config/lib/logger'));
// var utils = require(path.resolve('./engine2/bot/action/common/utils'));
var CBTags = require(path.resolve('./engine2/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./engine2/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./engine2/bot/engine/nlp/sentenceInfo.js'));
var TurnTaking = require(path.resolve('./engine2/bot/engine/nlp/turnTaking.js'));
var turnTaking = new TurnTaking("en");
var Typos = require(path.resolve('./engine2/bot/engine/nlp/typos.js'));
var typos = new Typos("en");

var NLPUtil = require(path.resolve('./engine2/bot/engine/nlp/nlpUtil.js'));

// var address = require(path.resolve('./engine2/bot/action/common/address'));
// var globals = require(path.resolve('./engine2/bot/engine/common/globals'));
// var concept = require(path.resolve('engine2/bot/engine/concept/concept.js'));
// var entity = utils.requireNoCache(path.resolve('engine2/bot/engine/nlu/entity'));
// var intent = utils.requireNoCache(path.resolve('engine2/bot/engine/nlu/intent'));

const TAG_START = '\\+';
const TAG_END = '\\+';
const ARRAY_TAG_START = '#';
const ARRAY_TAG_END = '#';
const IN_TAG_START = '{';
const IN_TAG_END = '}';
const DOC_NAME = 'doc';
const REG_ESCAPE = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/;
const MAX_LIST = 1000;
const LIST_PER_PAGE = 9;

exports.TAG_START = TAG_START;
exports.TAG_END = TAG_END;
exports.ARRAY_TAG_START = ARRAY_TAG_START;
exports.ARRAY_TAG_END = ARRAY_TAG_END;
exports.IN_TAG_START = IN_TAG_START;
exports.IN_TAG_END = IN_TAG_END;
exports.DOC_NAME = DOC_NAME;
exports.MAX_LIST= MAX_LIST;
exports.LIST_PER_PAGE = LIST_PER_PAGE;

function processInput(context, inRaw, callback) {

    var inNLP, nlpAll = [], _nlp = [];

    async.waterfall([
        // 사용자 사전 적용된 영어 형태소 분석기
        // dsyoon (2017. 10. 31.)
        // 사용자 사전 경로: ./external_module/resources/eno/user.pos
        function(cb) {
            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                var cbTags = new CBTags();
                inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
                inRaw = inRaw.replace(/\"/gi, "");

                var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/en'));

                var _inRaw = inRaw;
                var lastChar = _inRaw.charAt(_inRaw.length - 1);
                if (lastChar == '.' || lastChar == '?' || lastChar == '!') {
                    _inRaw = _inRaw.substring(0, _inRaw.length - 1);
                } else {
                    lastChar = "";
                }

                var dicResult = userDictionary.applyUserDic('en', _inRaw);
                var temp_inRaw = dicResult[0];
                var mb_user_str = dicResult[1];
                var mb_user_tag = dicResult[2];
                var position = -1;

                var tempInRaw = "";
                var arr = inRaw.split(" ");
                for (var i=0; i<arr.length; i++) {
                    if (i>0) tempInRaw += " ";
                    var tempStr = typos.checkAndReplace('en', arr[i]);

                    if (tempStr == "") {
                        tempInRaw += arr[i];
                    } else {
                        tempInRaw += tempStr;
                    }
                }
                inRaw = tempInRaw;

                posTagger.tag(inRaw, function(err, result) {
                    var _inNLP = [];
                    if (!result) result = _inRaw;
                    if (!result) {
                        result = _inRaw;
                    }

                    var textArr = inRaw.split(' ');
                    // 사용자 사전 적용
                    for (var i=0; i<result.length; i++) {
                        var entry = {};

                        entry["text"] = textArr[i];
                        entry["pos"] = result[i];
                        if (entry.text == 'like' || entry.text == 'like.' || entry.text == 'like?') {
                            entry.pos = 'Verb'
                        }
                        if (entry.text == 'apple' || entry.text == 'apple.'|| entry.text == 'apple?') {
                            entry.pos = 'Noun'
                        }
                        if (entry.text == 'i' || entry.text == 'I') {
                            entry.pos = 'Pronoun'
                        }

                        for (var key in dicResult[1]) {
                            position = entry.text.indexOf(key);
                            if (position >= 0) {
                                if (entry.text == key) {
                                    entry.pos = mb_user_tag[key];
                                }
                                entry.text = (entry.text).replace(new RegExp(key,'gi'), mb_user_str[key]);
                            }
                        }

                        entry.pos = cbTags.normalizeTag('en', entry.text, entry.pos);

                        _nlp.push(entry);
                        _inNLP.push(entry.text);
                    }
                    inNLP = _inNLP.join(' ');
                    inNLP = inNLP.replace(/(?:\{ | \})/g, '+');
                    if (inNLP == '') inNLP = inRaw;

                    if (context == null) {
                        context = {};
                    }
                    // if (!("botUser" in context)) {
                    //     context["botUser"] = {}
                    // }
                    // if (!("nlu" in context["botUser"])) {
                    //     context.botUser["nlu"] = {};
                    // }

                    context.botUser = context.botUser || {};
                    context.botUser["nlu"] = context.botUser["nlu"] || {};

                    context.botUser["inNLP"] = inNLP;
                    context.botUser["nlpAll"] = nlpAll;
                    context.botUser["nlp"] = _nlp;

                    context.botUser.nlu["sentence"] = inRaw;
                    context.botUser.nlu["lastChar"] = lastChar;
                    context.botUser.nlu["nlp"] = _nlp;
                    context.botUser.nlu["inNLP"] = inNLP;
                    cb(null);
                });
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
                cb(null);
            } else {
                cb(null);
            }
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/en/user.pos
        function(cb) {
            if (inRaw != undefined && inRaw != null && !Array.isArray(inRaw)) {
                if ("nlu" in context.botUser) {
                    var sentenceInfo = new SentenceInfo();
                    var value = sentenceInfo.analyze("en", context.botUser.nlu);
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
                    var value = turnTaking.analyze("en", context.botUser.nlu);
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

        callback(inNLP, context, null);
    });
}
exports.processInput = processInput;

function processLiveInput(inRaw, callback) {

    var _nlp = [], _in;

    async.waterfall([
        // 사용자 사전 적용된 영어 형태소 분석기
        // dsyoon (2017. 10. 31.)
        // 사용자 사전 경로: ./external_module/resources/en/user.pos
        function(cb) {
            var cbTags = new CBTags();
            inRaw = inRaw.replace(/(^\s*)|(\s*$)/gi, "");
            inRaw = inRaw.replace(/\"/gi, "");

            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/en'));
            var nlpUtil = new NLPUtil();

            if (inRaw == undefined || inRaw == null || Array.isArray(inRaw)) {
                cb(null);
            }

            var lastChar = inRaw.charAt(inRaw.length-1);
            if (lastChar == '.' || lastChar == '?' || lastChar == '!') {
                inRaw = inRaw.substring(0, inRaw.length-1);
            } else {
                lastChar = "";
            }

            var dicResult = userDictionary.applyUserDic('en', inRaw);
            var temp_inRaw = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];
            var position  = -1;

            posTagger.tag(inRaw, function(err, result) {
                if(!result) result = inRaw;
                if(!result) {
                    result = inRaw;
                }

                var textArr = inRaw.split(' ');
                // 사용자 사전 적용
                for (var i=0; i<result.length; i++) {
                    var entry = {};
                    entry["text"] = textArr[i];
                    entry["pos"] = result[i];
                    if (entry.text == 'like') {
                        entry.pos = 'Verb'
                    }

                    for (var key in dicResult[1]) {
                        position = entry.text.indexOf(key);
                        if (position >= 0) {
                            entry.text = (entry.text).replace(new RegExp(key,'gi'), dicResult[1][key]);
                            if (entry.text == key) {
                                entry.pos = mb_user_tag[key];
                            }
                        }
                    }

                    entry.pos = cbTags.normalizeTag('ko', entry.text, entry.pos);

                    if(entry.pos == 'Alpha') entry.pos = 'Noun';

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
            })
        },
    ], function(err) {
        callback(null, _in);
    });
}
exports.processLiveInput = processLiveInput;
