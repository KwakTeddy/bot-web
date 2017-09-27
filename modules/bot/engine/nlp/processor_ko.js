'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');

var logger = require(path.resolve('./config/lib/logger'));
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var nlp = require(path.resolve('./modules/bot/engine/nlp/processor'));
var CBTags = require(path.resolve('./modules/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./modules/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));
var TurnTaking = require(path.resolve('./modules/bot/engine/nlp/turnTaking.js'));
var NLPUtil = require(path.resolve('./modules/bot/engine/nlp/nlpUtil.js'));

var address = require(path.resolve('./modules/bot/action/common/address'));
var globals = require(path.resolve('./modules/bot/engine/common/globals'));
var concept = require(path.resolve('modules/bot/engine/concept/concept.js'));
var entity = utils.requireNoCache(path.resolve('modules/bot/engine/nlu/entity'));
var intent = utils.requireNoCache(path.resolve('modules/bot/engine/nlu/intent'));

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

    // 한국어 형태소 분석기
    async.waterfall([
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var cbTags = new CBTags();
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ko/user.pos'));
            var nlpUtil = new NLPUtil();

            var nlpKo = new nlp({
                stemmer: false,      // (optional default: true)
                normalizer: false,   // (optional default: true)
                spamfilter: false     // (optional default: false)
            });

            var lastChar = inRaw.charAt(inRaw.length-1);
            if (lastChar == '.' || lastChar == '?' || lastChar == '!') {
                inRaw = inRaw.substring(0, inRaw.length-1);
            } else {
                lastChar = "";
            }

            var dicResult = userDictionary.applyUserDic('KO', inRaw);
            var temp_inRaw = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];

            nlpKo.tokenize(temp_inRaw, function(err, result) {
                var _inNLP = [];
                if(!result) result = inRaw;
                if(!result) {
                    result = inRaw;
                }

                // 사용자 사전 적용
                for (var i=0; i<result.length; i++) {
                    var entry = result[i];
                    var position = entry.text.search("MBNOUN[A-Z]");
                    if (position >= 0 && entry.pos == 'Alpha') {
                        var info2replace = userDictionary.getTag(entry.text, dicResult);
                        temp_inRaw = temp_inRaw.replace(new RegExp(entry.text,'gi'),info2replace[0]);
                        entry.text = info2replace[0];
                        entry.pos = info2replace[1];
                    }
                    entry.pos = cbTags.normalizeTag('ko', entry.pos);

                    if(entry.pos == 'Alpha') entry.pos = 'Noun';
                    nlpAll.push(entry);
                    if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _nlp.push(entry);
                    if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _inNLP.push(entry.text);
                }
                inNLP = _inNLP.join(' ');
                inNLP = inNLP.replace(/(?:\{ | \})/g, '+');
                if(inNLP == '') inNLP = inRaw;

                if (context == null) {
                    context = {};
                }
                if (!("botUser" in context)) {
                    context["botUser"] = {}
                }
                if (!("nlu" in context["botUser"])) {
                    context.botUser["nlu"] = {};
                }

                context.botUser["inNLP"] = inNLP;
                context.botUser["nlpAll"] = nlpAll;
                context.botUser["nlp"] = _nlp;

                var nlpJsonPOS = nlpUtil.convertJSON(temp_inRaw, nlpAll);
                context.botUser.nlu["sentence"] = inRaw;
                context.botUser.nlu["lastChar"] = lastChar;
                context.botUser.nlu["pos"] = nlpJsonPOS;

                cb(null);
            })
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze("ko", context.botUser.nlu);
            context.botUser.nlu["sentenceInfo"] = value;

            cb(null);
        },
        // turn taking할지 분석 (0: 사용자가 계속 말하게 둔다. 1: 봇이 발화한다.
        // dsyoon (2017. 09. 19.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var turnTaking = new TurnTaking();
            var value = turnTaking.analyze("ko", context.botUser.nlu);
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
