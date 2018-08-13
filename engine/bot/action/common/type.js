'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');

var logger = require(path.resolve('./config/lib/logger'));
var koNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ko'));
var enNLP = require(path.resolve('./engine/bot/engine/nlp/processor_en'));
var jaNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ja'));
var zhNLP = require(path.resolve('./engine/bot/engine/nlp/processor_zh'));

var QAScore = require(path.resolve('./engine/bot/action/common/qaScore'));
var qaScore = new QAScore();
var TypeUtil = require(path.resolve('./engine/bot/action/common/typeUtil'));
var typeUtil = new TypeUtil();

var utils = require(path.resolve('./engine/bot/action/common/utils'));
var address = require(path.resolve('./engine/bot/action/common/address'));
var globals = require(path.resolve('./engine/bot/engine/common/globals'));
var concept = require(path.resolve('engine/bot/engine/concept/concept.js'));
var entity = utils.requireNoCache(path.resolve('engine/bot/engine/nlu/entity'));
var intent = utils.requireNoCache(path.resolve('engine/bot/engine/nlu/intent'));

var mongoWrapper = require('../../../utils/mongo-wrapper.js');

var MatchedIntent = mongoWrapper.model('MatchedIntent');

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
    if(inRaw.startsWith(":")) {
        callback(inRaw, null);
        return;
    }

    var doc = {entities: {}}, entities = {}, inNLP, _nlp = [], nlpAll = [], dialog;

    async.waterfall([

        function(cb) {

            var language = context.bot.language || 'ko';

            if (language=="en") {
                enNLP.processInput(context, inRaw, function(_inTextNLP, _inDoc) {
                    inNLP = context.botUser.inNLP;
                    nlpAll = context.botUser.nlpAll;
                    cb(null);
                });
            } else if (language=="zh") {
                zhNLP.processInput(context, inRaw, function(_inTextNLP, _inDoc) {
                    inNLP = context.botUser.inNLP;
                    nlpAll = context.botUser.nlpAll;
                    cb(null);
                });
            } else if (language=="ja") {
                jaNLP.processInput(context, inRaw, function(_inTextNLP, _inDoc) {
                    inNLP = context.botUser.inNLP;
                    nlpAll = context.botUser.nlpAll
                    cb(null);
                });
            } else {
                koNLP.processInput(context, inRaw, function(_inTextNLP, _inDoc) {
                    inNLP = context.botUser.inNLP;
                    nlpAll = context.botUser.nlpAll;
                    cb(null);
                });
            }
        },
        /*
                function(cb) {
                    var nlpKo = new nlp({
                        stemmer: true,      // (optional default: true)
                        normalizer: true,   // (optional default: true)
                        spamfilter: true     // (optional default: false)
                    });

                    // ToStrings
                    nlpKo.tokenize(inRaw, function(err, result) {

                        var _inNLP = [];
                        if(!result) result = inRaw;
                        for (var i = 0; i < result.length; i++) {
                            if(result[i].pos == 'Alpha') result[i].pos = 'Noun';
                            // var word = result[i].text;
                            // if(word.search(/^(은|는|이|가|을|를)$/) == -1) result2.push(word);

                            // if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation')
                            _nlp.push(result[i]);
                            // if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _inNLP.push(result[i].text);
                            nlpAll.push(result[i]);
                            if(result[i].text && result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation') _nlp.push(result[i]);
                            if(result[i].text && result[i].text.search(/^(은|는|이|가|을|를)$/) == -1 && result[i].pos !== 'Punctuation') _inNLP.push(result[i].text);
                        }

                        inNLP = _inNLP.join(' ');
                        inNLP = inNLP.replace(/(?:\{ | \})/g, '+');
                        if(inNLP == '') inNLP = inRaw;

                        context.botUser.nlpAll = nlpAll;
                        context.botUser.nlp = _nlp;

                        cb(null);
                    })
                },
        */

        // function(cb) {
        //   var sp = inRaw.split(' ');
        //   for(var i = 0; i < sp.length; i++) {
        //     _nlp.push({text: sp[i], pos: 'Noun'});
        //   }
        //
        //   inNLP = inRaw;
        //   context.botUser.nlpAll = _nlp;
        //   context.botUser.nlp = _nlp;
        //
        //   cb(null);
        // },

        function(cb) {
            entity.matchDictionaryEntities(inRaw, commonTypes, doc, context, function(_inRaw, _entities) {
                // doc.entities = doc.entities.concat(_doc.entities)
                doc.entities = utils.merge(doc.entities, _entities);

                console.tlog('entities: ' + JSON.stringify(_entities), context);

                cb(null);
            });
        },

        function(cb) {
            checkTypes(inRaw, commonTypes, {}, context, function(_inRaw, _entities) {
                // doc.entities = doc.entities.concat(_entities)
                doc.entities = utils.merge(doc.entities, _entities);
                context.botUser.entities = doc.entities;
                cb(null);
            });
        },

        // function(cb) {
        //   concept.processConcept(inRaw, inNLP, _nlp, function(inRaw, _in2, _nlp2) {
        //     _nlp = _nlp2;
        //     cb(null);
        //   });
        // },
        //
        // function(cb) {
        //   concept.processCustomConcept(inRaw, inNLP, _nlp, context, function(inRaw, _in2, _nlp2) {
        //     _nlp = _nlp2;
        //     cb(null);
        //   });
        // },

        function(cb) {
            if(context.bot.intentOption == undefined || context.bot.intentOption.useIntent != false) {
                intent.matchIntent(inRaw, inNLP, context, function(matched, _intent, _dialog) {
                    if(_intent) {
                        doc.intent = _intent;
                        context.botUser.intent = _intent;

                        //분석 Top 10 인텐트를 위한 임시코드
                        var matchedIntent = new MatchedIntent();
                        matchedIntent.botId = context.bot.id;
                        matchedIntent.intent = _intent._id;

                        matchedIntent.save(function(err)
                        {
                            if(err)
                            {
                                return console.log(err);
                            }
                        });

                        console.tlog('intent: ' + JSON.stringify(_intent), context);

                    } else {
                        doc.intent = undefined;
                        context.botUser.intent = undefined;
                    }

                    if(_dialog) {
                        doc.intentDialog = _dialog;
                        context.botUser.intentDialog = _dialog;
                    } else {
                        doc.intentDialog = undefined;
                        context.botUser.intentDialog = undefined;
                    }

                    cb(null);
                })
            } else {
                cb(null);
            }
        },

        function(cb) {
            var dialogModule = require(path.resolve('engine/bot/action/common/dialog'));
            var globalDialogs = require(path.resolve('./engine/global/global-dialogs.js'));

            dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType, {}, context, function(inNLP, task, matched) {
                if(matched) context.botUser.userDialogs = task.typeDoc;
                else context.botUser.userDialogs = undefined;
                cb(null);
            });
        },

        function(cb) {
            var dialogModule = require(path.resolve('engine/bot/action/common/dialog'));
            var globalDialogs = require(path.resolve('./engine/global/global-dialogs.js'));

            dialogModule.executeType(inRaw, inNLP, globalDialogs.dialogsType, {}, context, function(inNLP, task, matched) {
                if(matched) context.botUser.dialogsetDialogs = task.typeDoc;
                else context.botUser.dialogsetDialogs = undefined;
                cb(null);
            });
        },

        function(cb) {
            var bestDialog;

            if(context.botUser.intentDialog) {
                bestDialog = context.botUser.intentDialog;
            }

            if(context.botUser.userDialogs) {
                var userDialog = context.botUser.userDialogs[0];
                if(!bestDialog || userDialog.matchRate > bestDialog.matchRate || userDialog.matchCount > bestDialog.matchCount) {
                    bestDialog = userDialog;
                }
            }

            if(context.botUser.dialogsetDialogs) {
                var dialogsetDialog = context.botUser.dialogsetDialogs[0];
                if(!bestDialog || dialogsetDialog.matchRate > bestDialog.matchRate || dialogsetDialog.matchCount > bestDialog.matchCount) {
                    bestDialog = dialogsetDialog;
                }
            }

            if(bestDialog) {
                context.botUser.bestDialog = bestDialog;
            }

            cb(null);
        }

    ], function(err) {
        context.botUser.nlpCorrection = undefined;
        context.botUser.inRawCorrection = undefined;
        context.botUser.wordCorrection = undefined;

        callback(inNLP, entities, doc);
    });

}

exports.processInput = processInput;

exports.processOutput = processOutput;

function processOutput(task, context, out) {
    try {
        if(task) {
            if (task.preText) out = task.preText + "\r\n" + out;
            else if (task.pretext) out = task.pretext + "\r\n" + out;

            if (task.postText) out = out + "\r\n" + task.postText;
            else if (task.posttext) out = out + "\r\n" + task.posttext;
        }

        var re = new RegExp(ARRAY_TAG_START + "([\\w가-힣\\d-_\\.]*)" + ARRAY_TAG_START + "([^" + ARRAY_TAG_END + "]*)" + ARRAY_TAG_END, "g");
        var re2 = new RegExp(TAG_START + "([\\w가-힣\\d-_\\.]+)" + TAG_END, "g");

        //text = text.replace(/\\#/g, "%23");
        out = out.replace(/\\\+/g, '%2B');

        out = out.replace(re, function (match, p1, p2, offset, string) {
            var val;
            if (task && task[DOC_NAME]) {
                if(p1 == '') val = task[DOC_NAME];
                else  val = _.get(task[DOC_NAME], p1);
            }
            if (!val && task) val = _.get(task, p1);
            if (!val && context.dialog && context.dialog[DOC_NAME]) val = _.get(context.dialog[DOC_NAME], p1);
            if (!val && context.dialog) val = _.get(context.dialog, p1);
            if (!val && context.bot && context.bot[DOC_NAME]) val = _.get(context.bot[DOC_NAME], p1);
            if (!val && context.bot) val = _.get(context.bot, p1);
            if (!val && context.user && context.user[DOC_NAME]) val = _.get(context.user[DOC_NAME], p1);
            if (!val && context.user) val = _.get(context.user, p1);

            if (val && Array.isArray(val)) {
                var formatArray = [];

                p2 = p2.replace(/%23/g, "#");

                var start, end;
                if(context.dialog.page) {
                    start = (context.dialog.page-1) * LIST_PER_PAGE;
                    end = Math.min(val.length, start + LIST_PER_PAGE);
                } else {
                    start = 0;
                    end = Math.min(val.length, LIST_PER_PAGE);

                    if(val.length > LIST_PER_PAGE) {
                        context.dialog.page = 1;
                        context.dialog.numOfPage = Math.ceil(val.length / LIST_PER_PAGE);
                    }
                }

                p2.replace(re2, function (match1, p11, offset1, string1) {
                    for (var i = start; i < end; i++) {
                        var val1 = val[i][p11];

                        if (!(formatArray[i])) formatArray[i] = string1;
                        if (val1) {
                            formatArray[i] = formatArray[i].replace(match1, (val1? val1: ''));
                        } else if(p11 == 'index') {
                            formatArray[i] = formatArray[i].replace(match1, (i - start +1));
                        } else {
                            formatArray[i] = formatArray[i].replace(match1, '');
                        }
                    }

                    return match1;
                });

                var pageStr;
                if(context.dialog.page && context.dialog.numOfPage > 1) {
                    pageStr =
                        (context.dialog.page && context.dialog.page != 1 ? '<. 이전페이지\n': '') +
                        (context.dialog.page && context.dialog.page != context.dialog.numOfPage ? '\>. 다음페이지\n': '');
                }

                return formatArray.join('') + (pageStr ? pageStr: '');
            } else {
                return '';
            }

            // return p1;
        });

        out = out.replace(re2, function replacer(match, p1) {
            var val;
            if (task && task[DOC_NAME]) val = _.get(task[DOC_NAME], p1);
            // if (!val && task) val = _.get(task, p1);
            // if (!val && context.dialog && context.dialog[DOC_NAME]) val = _.get(context.dialog[DOC_NAME], p1);
            // if (!val && context.dialog) val = _.get(context.dialog, p1);
            // if (!val && context.bot && context.bot[DOC_NAME]) val = _.get(context.bot[DOC_NAME], p1);
            // if (!val && context.bot) val = _.get(context.bot, p1);
            // if (!val && context.user && context.user[DOC_NAME]) val = _.get(context.user[DOC_NAME], p1);
            // if (!val && context.user) val = _.get(context.user, p1);

            // 만약 task에 name키가 있으면 그 걸로 할당이 되어서 bot.name을 가져온다든지 하는게 안되버린다.
            if (task) {
                var t = _.get(task, p1);
                if (t)
                    val = t;
            }

            if (context.dialog && context.dialog[DOC_NAME]) {
                var t = _.get(context.dialog[DOC_NAME], p1);
                if (t) {
                    val = t;
                }
            }
            if (context.dialog) {
                var t = _.get(context.dialog, p1);
                if (t)
                    val = t;
            }

            if (context.bot && context.bot[DOC_NAME]) {
                var t = _.get(context.bot[DOC_NAME], p1);
                if (t)
                    val = t;
            }

            if (context.bot) {
                var t = _.get(context.bot, p1);
                if (t)
                    val = t;
            }

            if (context.user && context.user[DOC_NAME]) {
                var t = _.get(context.user[DOC_NAME], p1);
                if (t)
                    val = t;
            }

            if (context.user) {
                var t = _.get(context.user, p1);
                if(t)
                    val = t;
            }

            if (val) return val;
            else return '';

            // return p1;
        });

        var mappedDialog = context.botUser.nlu.dialog;
        // dialog가 매치되는 경우를 qa보다 우선 순위를 높게 둔다.
        if (mappedDialog != undefined && (mappedDialog.filename != undefined || mappedDialog.name != undefined || (mappedDialog.intent != undefined && mappedDialog.intent.name != undefined))) {
            // if (mappedDialog != undefined && (mappedDialog.filename != undefined || mappedDialog.name != undefined || (mappedDialog.intent.name != undefined && mappedDialog.intent.name != undefined))) {
            // if (mappedDialog != undefined && (mappedDialog.filename != undefined || mappedDialog.name != undefined)) {
            if (mappedDialog.input && mappedDialog.input != undefined) {
                if (Array.isArray(mappedDialog.input)) {
                    for (var i=0; i<mappedDialog.input.length; i++) {
                        if (mappedDialog.input[i].text == context.botUser.nlu.inNLP) {
                            context.botUser.nlu["matchInfo"] = {};
                            context.botUser.nlu.matchInfo["qa"] = [];
                            context.botUser.nlu.matchInfo["contextNames"] = {};
                            context.botUser.nlu.matchInfo["contexts"] = {};
                            context.botUser.nlu.matchInfo["topScoreCount"] = 0;
                            break;
                        }
                    }
                } else {
                    if (mappedDialog.input.text == context.botUser.nlu.inNLP) {
                        context.botUser.nlu["matchInfo"] = {};
                        context.botUser.nlu.matchInfo["qa"] = [];
                        context.botUser.nlu.matchInfo["contextNames"] = {};
                        context.botUser.nlu.matchInfo["contexts"] = {};
                        context.botUser.nlu.matchInfo["topScoreCount"] = 0;
                    }
                }
            }
        }

        // context를 고려한 bot 발화 출력 (dsyoon)
        if (context.botUser.nlu.matchInfo != undefined && context.botUser.nlu.matchInfo.qa.length > 0) {
            context = qaScore.assignScore(context);

            var topScoreCount = context.botUser.nlu.matchInfo.topScoreCount;
            var contextCount = Object.keys(context.botUser.nlu.matchInfo.contexts).length;

            if (context.botUser.nlu.sentence.substr(0, 1) != ":") {
                if (topScoreCount == 0) {
                    //out = out.replace(/%2B/g, '+');
                    out = "알아듣지 못했습니다";
                    out = 'I don\'t understand';
                } else if (topScoreCount > 1 && contextCount > 1) {
                    out = "";
                    for (var i = 0; i < topScoreCount; i++) {
                        if (i > 0) out += " ";
                        out += context.botUser.nlu.matchInfo.qa[i].context.name + "?";
                        if (i > 2) {
                            out += " 등 모호하네요. 좀 더 자세히 이야기해 주세요.";
                            break;
                        }
                    }
                } else {
                    if (context.botUser.nlu.matchInfo.qa[0].output) {
                        if (Array.isArray(context.botUser.nlu.matchInfo.qa)) {
                            var result = Math.floor(Math.random() * context.botUser.nlu.matchInfo.qa.length) + 1;
                            out = context.botUser.nlu.matchInfo.qa[result].output;
                        } else {
                            out = context.botUser.nlu.matchInfo.qa.output;
                        }
                    }
                // 대화학습 output 여러개 있을 때 하나만 나와서 위에것으로 수정함. 원래는 아래 것이 였음 Eric
                //   if (context.botUser.nlu.matchInfo.qa[0].output) {
                //     if (Array.isArray(context.botUser.nlu.matchInfo.qa[0].output)) {
                //       var result = Math.floor(Math.random() * context.botUser.nlu.matchInfo.qa[0].output.length) + 1;
                //       out = context.botUser.nlu.matchInfo.qa[0].output[result];
                //     } else {
                //       out = context.botUser.nlu.matchInfo.qa[0].output;
                //     }
                //   }
                }
            }
        }

        if (context.botUser.nlu.contextInfo != undefined && context.botUser.nlu.contextInfo != null) {
            var MAX_CONTEXTHISTORY_LENGTH = 5;
            if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
            if (context.botUser.nlu.contextInfo["contextHistory"] == undefined || context.botUser.nlu.contextInfo["contextHistory"] == null) {
                context.botUser.nlu.contextInfo["contextHistory"] = [context.botUser.nlu.matchInfo.contexts];
                if (context.botUser.nlu.contextInfo.context.type=="CONTEXT_SELECTION") {
                    var json = {};
                    json[context.botUser.nlu.matchInfo.qa[0].context.name] = context.botUser.nlu.matchInfo.contextNames[context.botUser.nlu.matchInfo.qa[0].context.name];
                    context.botUser.nlu.contextInfo["matchContextHistory"] = [json];
                } else {
                    context.botUser.nlu.contextInfo["matchContextHistory"] = [context.botUser.nlu.matchInfo.contextNames];
                }
                var queryHistory = {};
                queryHistory["inputRaw"] = context.botUser.nlu.sentence;
                queryHistory["input"] = context.botUser.nlu.inNLP;
                context.botUser.nlu.contextInfo["queryHistory"] = [queryHistory];
                if (context.botUser.nlu.matchInfo.qa && context.botUser.nlu.matchInfo.qa[0]) {
                    var context = [];
                    for (var i=0; i<topScoreCount; i++) context.push(context.botUser.nlu.matchInfo.qa[i].context);
                    context.botUser.nlu.contextInfo["contextHistory"] = context;
                }
                var answerHistory = {};
                answerHistory["topScoreCount"] = topScoreCount;
                answerHistory["contextCount"] = contextCount;
                context.botUser.nlu.contextInfo["answerHistory"] = [answerHistory];
            } else {
                context.botUser.nlu.contextInfo["contextHistory"].splice(0, 0, context.botUser.nlu.matchInfo.contexts);
                if (context.botUser.nlu.contextInfo.context.type=="CONTEXT_SELECTION") {
                    var json = {};
                    for (var i=0; i<topScoreCount; i++) {
                        json[context.botUser.nlu.matchInfo.qa[i].context.name] = context.botUser.nlu.matchInfo.contextNames[context.botUser.nlu.matchInfo.qa[i].context.name];
                    }
                    context.botUser.nlu.contextInfo["matchContextHistory"].splice(0, 0, json);
                } else {
                    context.botUser.nlu.contextInfo["matchContextHistory"].splice(0, 0, context.botUser.nlu.matchInfo.contextNames);
                }
                var queryHistory = {};
                queryHistory["inputRaw"] = context.botUser.nlu.sentence;
                queryHistory["input"] = context.botUser.nlu.inNLP;
                context.botUser.nlu.contextInfo["queryHistory"].splice(0, 0, queryHistory);
                var answerHistory = {};
                answerHistory["topScoreCount"] = topScoreCount;
                answerHistory["contextCount"] = contextCount;
                context.botUser.nlu.contextInfo["answerHistory"].splice(0, 0, answerHistory);

                // history는 5개 이내로 유지하기 위해서
                if (context.botUser.nlu.contextInfo["contextHistory"].length > MAX_CONTEXTHISTORY_LENGTH) {
                    context.botUser.nlu.contextInfo["contextHistory"].splice(5, 1);
                    context.botUser.nlu.contextInfo["matchContextHistory"].splice(5, 1);
                    context.botUser.nlu.contextInfo["queryHistory"].splice(5, 1);
                }
            }
        }

    } catch(e) {
        console.log("processOutput:error: " + e, context);
    }

    return out;
}

exports.processButtons = processButtons;


function processButtons(task, context, text) {
    var re = new RegExp(ARRAY_TAG_START + "([\\w]*)" + ARRAY_TAG_START + "([^" + ARRAY_TAG_END +"]*)" + ARRAY_TAG_END, "g");
    var re2 = new RegExp(TAG_START + "([\\w\\d-_\\.]+)" + TAG_END, "g");

    //text = text.replace(/\\#/g, "%23");

    var formatArray = [];

    text = text.replace(re, function(match, p1, p2, offset, string) {
        var val = eval('('+'task.' + p1+')');

        if(val && Array.isArray(val)) {

            p2 = p2.replace(/%23/g, "#");

            p2.replace(re2, function(match1, p11, offset1, string1){
                for(var i = 0; i < val.length; i++) {
                    var val1 = val[i][p11];

                    if(val1) {
                        if(!(formatArray[i])) formatArray[i] = string1;
                        formatArray[i] = formatArray[i].replace(match1, val1);
                    }
                }

                return match1;
            });

            if(formatArray && formatArray.length > 0) return formatArray;
            else return undefined;
        }

        return p1;
    });

    if(formatArray && formatArray.length > 0) return formatArray;
    else return undefined;

    return text;

}

function attachText(text, json) {
    if (json.preText) text = json.preText + "\r\n" + text;
    else if (json.pretext) text = json.pretext + "\r\n" + text;

    if (json.postText) text = text + "\r\n" + json.postText;
    else if (json.posttext) text = text + "\r\n" + json.posttext;

    return text;
}

exports.chatserverEscape = chatserverEscape;

function chatserverEscape(text) {

    text = text.replace(/%22 /gi, "\"");
    text = text.replace(/ %22/gi, "\"");
    text = text.replace(/%22/gi, "\"");

    text = text.replace(/%5b/gi, "[");
    text = text.replace(/%5d/gi, "]");

    text = text.replace(/%0a/gi, "\\n");
    text = text.replace(/ url/gi, "url");

    text = text.replace(/%5f/gi, "_");

    return text;
}


exports.parseNumber =parseNumber;

function parseNumber(text, json) {
    var _text = text.trim();
    if (_text.endsWith(".")) _text = _text.substr(0, _text.length - 1);
    else if (_text.endsWith(",")) _text = _text.substr(0, _text.length - 1);
    else if (_text == "일" || _text.startsWith("처음") || _text.startsWith("첫째") || _text.startsWith("첫번")) _text = "1";
    else if (_text == "이" || _text.startsWith("두번") || _text.startsWith("둘째")) _text = "2";
    else if (_text == "삼" || _text.startsWith("세번") || _text.startsWith("셋째")) _text = "3";
    else if (_text == "사" || _text.startsWith("네번") || _text.startsWith("넷째")) _text = "4";
    else if (_text == "오" || _text.startsWith("다섯")) _text = "5";
    else if (_text == "육" || _text.startsWith("여섯")) _text = "6";
    else if (_text == "칠" || _text.startsWith("일곱")) _text = "7";
    else if (_text == "팔" || _text.startsWith("여덟")) _text = "8";
    else if (_text == "구" || _text.startsWith("아홉")) _text = "9";

    return _text;
}

var regexpTypeCheck = function (text, type, task, context, callback) {
    var re = type.regexp;
    var matched = false;

    logger.debug('');
    logger.debug('type.js:regexpTypeCheck: START ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    text = text.replace(re, function(match, p1, offset, string) {
        matched = true;

        // if(task[type.name]) {
        //   if(Array.isArray(task[type.name])) task[type.name].push(p1);
        //   else task[type.name] = [task[type.name], p1];
        // } else {
        task[type.name] = p1;
        // }

        return IN_TAG_START + type.name + IN_TAG_END;
    });

    if(matched)
        logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    callback(text, task, matched);
};

var amountType = {
    name: 'account',
    typeCheck: regexpTypeCheck,
    regexp: /([\d,]+[십백천만억원]+)/g
};

var mobileType = {
    name: 'mobile',
    raw: true,
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text, type, inDoc, context) {
        if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
        else if(text.length < 13) return '자리수가 맞지 않습니다';
        else return '휴대폰전화번호 형식으로 입력해 주세요';
    }
};

exports.mobileType = mobileType;
globals.setGlobalType('mobile', mobileType);

var phoneType = {
    name: 'phone',
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
};

globals.setGlobalType('phone', phoneType);

var dateType = {
    name: 'date',
    typeCheck: regexpTypeCheck,
    regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
};

globals.setGlobalType('date', dateType);

var timeType = {
    name: 'time',
    typeCheck: timeTypeCheck
};

function timeTypeCheck(text, type, task, context, callback) {
    var name = 'time';
    var re = /(오전|오후|새벽|아침|낮|저녁|밤|am|pm|a.m|p.m)?\s*(\d{1,2})\s*(?:시|:)\s*(?:(\d{1,2}|반)\s*분?)?/g;
    var matched = false;


    text = text.replace(re, function(match, g1, g2, g3){
        matched = true;
        var time;
        // var timeform = ':00';

        var matchTime = function(_name, _task, _time) {
            if(_task[_name]) {
                if(Array.isArray(_task[_name])) _task[_name].push(_time);
                else _task[_name] = [_task[_name], _time];
            } else {
                _task[_name] = _time;
            }
        };

        var hour = parseInt(g2);
        var min = parseInt(g3) || g3 || 0;
        if (min=='반') min = 30;

        var am = (g1 == '오전' || g1 == '새벽' || g1 == '아침' || g1 == 'am' || g1 == 'a.m');
        var pm = (g1 == '오후' || g1 == '낮' || g1 == '저녁' || g1 == '밤' || g1 == 'pm' || g1 == 'p.m');

        if(hour<23 && min <60) {
            if(hour > 12) {
                time = hour.toString() + ':' + min;
            } else if(am) {
                if(hour==12) hour = 0;
                time = hour.toString() + ':' + min;
            } else if(pm) {
                if(hour==12) hour = 0;
                time = (hour+12) + ':' + min;
            } else time = 're';
        } else {
            time = 'out';
        }

        time = time.replace(/(.*):(.*)/, function(match, g1, g2) {
            if (g1.length == 1) g1 = '0'+g1;
            if (g2.length == 1) g2 = '0'+g2;
            return g1 + ":" + g2;
        });


        return matchTime(name, task, time);
    });

    callback(text, task, matched);
}





globals.setGlobalType('timeType', timeType);

var accountType = {
    name: 'account',
    typeCheck: regexpTypeCheck,
    regexp: /(\b[\d-]+-[\d-]+\b)/g
};

globals.setGlobalType('account', accountType);

var countType = {
    name: 'count',
    typeCheck: regexpTypeCheck,
    regexp: /(\d)\s?(?:개)/g
};

globals.setGlobalType('count', countType);

var productType = {
    name: 'product',
    typeCheck: mongoDbTypeCheck,
    mongo: {
        model: 'Product',
        queryFields: ['title'],
        //query: {},
        //sort: "-rate1",
        limit: 5,
        minMatch: 2,
        checkRequired: function(text, type, inDoc, context) {
            return '금융상품이 존재하지 않습니다';
        }
    }
}


var lotteriaMenuType = {
    typeCheck: menuTypeCheck,
    limit: 5,
    mongo: {
        model: 'lotteriamenu',
        queryFields: ['title'],
        // fields: 'title sort price' ,
        // taskFields: ['_id', 'title', 'sort', 'price'],
        //query: {},
        //sort: "-rate1",
        limit: 5,
        minMatch: 1,
        checkRequired: function(text, type, inDoc, context) {
            return '말씀하신 메뉴를 찾을 수 없습니다.';
        }
    }

}
exports.lotteriaMenuType = lotteriaMenuType;

var faqType = {
    typeCheck: mongoDbTypeCheck,
    limit: 5,
    mongo: {
        model: 'faq',
        queryFields: ['title'],
        fields: 'title content created' ,
        taskFields: ['_id', 'title', 'content'],
        taskSort: function(a, b) {
            if(b.matchCount > a.matchCount) return 1;
            else if(b.matchCount < a.matchCount) return -1;
            else {
                if(b.created.getTime() < a.created.getTime()) return 1;
                else if(b.created.getTime() > a.created.getTime()) return -1;
                else return 0;
            }
        },
        //query: {},
        // sort: "-created",
        // limit: 5,
        minMatch: 1,
        checkRequired: function(text, type, inDoc, context) {
            return '학습되어 있지 않은 질문 입니다.';
        }
    }
}

exports.faqType = faqType;
globals.setGlobalType('faqType', faqType);


var mongoose = require('mongoose');

function menuTypeCheck(text, format, inDoc, context, callback) {
    logger.debug('');
    try {
        logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    } catch(e) {
        logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '"');
    }

    var model;
    if (mongoose.models[format.mongo.model]) {
        model = mongoose.model(format.mongo.model);
    } else {
        model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
    }

    var matchedWord = '';
    var matchedDoc = {};
    var bestDoc;
    var words = text.split(' '), wordsCount = 0;
    for(var i = 0 ; i < words.length; i++) {
        var word = words[i];

        var query = {};
        for(var j = 0; j < format.mongo.queryFields.length; j++) {
            try {
                query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
            } catch(e) {}
        }

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit);

        _query.lean().exec(function (err, docs) {
            wordsCount++;

            if (err || !docs || docs.length <= 0) {
                //callback(text, inDoc);
            } else {

                for(var k = 0; k < docs.length; k++) {
                    var doc = docs[k];

                    var matchCount = 0;
                    matchedWord = '';
                    var matchIndex = -1, matchMin = -1, matchMax = -1;
                    for(var l = 0; l < format.mongo.queryFields.length; l++) {
                        for(var m = 0; m < words.length; m++) {
                            matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

                            if(matchIndex != -1) {
                                matchCount++;
                                matchedWord += words[m];

                                var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                            }
                        }
                    }

                    if(matchCount >= format.mongo.minMatch) {
                        var bExist = false;
                        for(var l = 0; l < matchedDoc.length; l++) {
                            if(matchedDoc[l]._id.id == doc._id.id) {
                                bExist = true;
                                break;
                            }
                        }

                        if(!bExist) {
                            doc.matchCount = matchCount;
                            doc.matchMin = matchMin;
                            doc.matchMax = matchMax;

                            if(matchedDoc[matchedWord] == undefined) matchedDoc[matchedWord] = [];
                            matchedDoc[matchedWord].push(doc);
                        }
                    }
                }
            }

            if(wordsCount >= words.length) {

                if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
                    matchedDoc.sort(format.mongo.taskSort);
                } else {
                    matchedDoc.sort(function (a, b) {
                        return b.matchCount - a.matchCount;
                    });
                }

                if (matchedDoc.length > 0) {

                    inDoc.typeDoc = [];
                    for (var _l = 0; _l < matchedDoc.length; _l++) {
                        var matchDoc = matchedDoc[_l];

                        var matchText = '';
                        for (var l = 0; l < format.mongo.queryFields.length; l++) {
                            var _text = matchDoc[format.mongo.queryFields[l]]
                            if (matchText == '') matchText = matchText.concat(_text);
                            else matchText = matchText.concat(' ', _text);
                        }

                        var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                        text = text.replace(matchOriginal, IN_TAG_START + format.name + IN_TAG_END);

                        if (inDoc['_' + format.name]) {
                            if (Array.isArray(inDoc['_' + format.name])) inDoc['_' + format.name].push(matchOriginal);
                            else inDoc['_' + format.name] = [inDoc['_' + format.name], matchOriginal];
                        } else {
                            inDoc['_' + format.name] = matchOriginal;
                        }

                        if (inDoc[format.name]) {
                            if (Array.isArray(inDoc[format.name])) inDoc[format.name].push(matchText);
                            else inDoc[format.name] = [inDoc[format.name], matchText];
                        } else {
                            inDoc[format.name] = matchText;
                        }

                        if (format.mongo.taskFields) {
                            var addDoc = {};
                            for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                                addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                            }
                            inDoc.typeDoc.push(addDoc);
                        } else {
                            inDoc.typeDoc.push(matchDoc);
                        }

                        if (inDoc.typeDoc.length >= format.limit) break;
                    }

                    try {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                    } catch (e) {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                    }

                    callback(text, inDoc, true);
                } else {
                    try {
                        logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                    } catch (e) {
                        logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                    }

                    callback(text, inDoc, false);
                }
            }
        });
    }
}

exports.customMongoDBFormat = mongoDbTypeCheck;

function mongoDbTypeCheck(text, format, inDoc, context, callback) {
    logger.debug('');
    try {
        logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    } catch(e) {
        logger.debug('type.js:mongoDbTypeCheck: START ' + format.name + ' "' + text + '"');
    }

    var model;
    if (mongoose.models[format.mongo.model]) {
        model = mongoose.model(format.mongo.model);
    } else {
        model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
    }

    var matchedDoc = [];
    var bestDoc;
    var words = text.split(' '), wordsCount = 0;
    for(var i = 0 ; i < words.length; i++) {
        var word = words[i];

        if(word.search(REG_ESCAPE) != -1) {
            wordsCount++;
            continue;
        }

        var query = {};
        if(format.mongo.queryStatic) query = format.mongo.queryStatic;
        else query = {};

        for(var j = 0; j < format.mongo.queryFields.length; j++) {
            try {
                query[format.mongo.queryFields[j]] = new RegExp((word), 'i');
            } catch(e) {}
        }

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit);

        _query.lean().exec(function (err, docs) {
            wordsCount++;

            if (err || !docs || docs.length <= 0) {
                //callback(text, inDoc);
            } else {

                for(var k = 0; k < docs.length; k++) {
                    var doc = docs[k];

                    var matchCount = 0;
                    var matchIndex = -1, matchMin = -1, matchMax = -1;
                    for(var l = 0; l < format.mongo.queryFields.length; l++) {
                        for(var m = 0; m < words.length; m++) {
                            if(words[m].search(REG_ESCAPE) != -1) continue;

                            // matchIndex = doc[format.mongo.queryFields[l]].toLowerCase().indexOf(words[m].toLowerCase());
                            matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

                            if(matchIndex != -1) {
                                matchCount++;

                                // var matchOrgIndex = text.toLowerCase().indexOf(words[m].toLowerCase());
                                var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                            }
                        }
                    }

                    if(format.limit && format.limit == 1) {
                        if((!bestDoc || bestDoc.matchCount < matchCount) && matchCount >= format.mongo.minMatch) {
                            bestDoc = doc;
                            bestDoc.matchCount = matchCount;
                            bestDoc.matchMin = matchMin;
                            bestDoc.matchMax = matchMax;
                        }
                    } else {
                        if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                            var bExist = false;
                            for(var l = 0; l < matchedDoc.length; l++) {
                                if(matchedDoc[l]._id.id == doc._id.id) {
                                    bExist = true;
                                    break;
                                }
                            }

                            if(!bExist) {
                                doc.matchCount = matchCount;
                                doc.matchMin = matchMin;
                                doc.matchMax = matchMax;
                                matchedDoc.push(doc);
                            }
                        }
                    }
                }
            }

            if(wordsCount >= words.length) {

                if(format.limit && format.limit == 1) {

                } else {
                    if(format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
                        matchedDoc.sort(format.mongo.taskSort);
                    } else {
                        matchedDoc.sort(function(a, b) {
                            return b.matchCount - a.matchCount;
                        });
                    }
                }

                if(bestDoc) {
                    var matchText = '';
                    for (var l = 0; l < format.mongo.queryFields.length; l++) {
                        var _text = bestDoc[format.mongo.queryFields[l]]
                        if (matchText == '') matchText = matchText.concat(_text);
                        else matchText = matchText.concat(' ', _text);
                    }

                    var matchOriginal = text.substring(bestDoc.matchMin, bestDoc.matchMax);
                    text = text.replace(matchOriginal, IN_TAG_START + format.name + IN_TAG_END);

                    if (inDoc['_' + format.name]) {
                        if (Array.isArray(inDoc['_' + format.name])) inDoc['_' + format.name].push(matchOriginal);
                        else inDoc['_' + format.name] = [inDoc['_' + format.name], matchOriginal];
                    } else {
                        inDoc['_' + format.name] = matchOriginal;
                    }

                    if (inDoc[format.name]) {
                        if (Array.isArray(inDoc[format.name])) inDoc[format.name].push(matchText);
                        else inDoc[format.name] = [inDoc[format.name], matchText];
                    } else {
                        inDoc[format.name] = matchText;
                    }

                    if(format.mongo.taskFields) {
                        for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                            inDoc[format.mongo.taskFields[l]] = bestDoc[format.mongo.taskFields[l]];
                        }
                    } else {
                        inDoc = utils.merge(inDoc, bestDoc);
                    }

                    inDoc.typeDoc = bestDoc;

                    try {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                    } catch(e) {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                    }

                    callback(text, inDoc, true);
                } else if(matchedDoc.length > 0) {
                    inDoc.typeDoc = [];
                    for(var _l = 0; _l < matchedDoc.length; _l++) {
                        var matchDoc = matchedDoc[_l];

                        var matchText = '';
                        for (var l = 0; l < format.mongo.queryFields.length; l++) {
                            var _text = matchDoc[format.mongo.queryFields[l]]
                            if (matchText == '') matchText = matchText.concat(_text);
                            else matchText = matchText.concat(' ', _text);
                        }

                        var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                        text = text.replace(matchOriginal, IN_TAG_START + format.name + IN_TAG_END);

                        if (inDoc['_' + format.name]) {
                            if (Array.isArray(inDoc['_' + format.name])) inDoc['_' + format.name].push(matchOriginal);
                            else inDoc['_' + format.name] = [inDoc['_' + format.name], matchOriginal];
                        } else {
                            inDoc['_' + format.name] = matchOriginal;
                        }

                        if (inDoc[format.name]) {
                            if (Array.isArray(inDoc[format.name])) inDoc[format.name].push(matchText);
                            else inDoc[format.name] = [inDoc[format.name], matchText];
                        } else {
                            inDoc[format.name] = matchText;
                        }

                        if(format.mongo.taskFields) {
                            var addDoc = {};
                            for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                                addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                            }
                            inDoc.typeDoc.push(addDoc);
                        } else {
                            inDoc.typeDoc.push(matchDoc);
                        }

                        if(inDoc.typeDoc.length >= format.limit) break;
                    }

                    try {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                    } catch(e) {
                        logger.debug('type.js:mongoDbTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                    }
                    context.dialog.faqDoc = inDoc.typeDoc;
                    callback(text, inDoc, true);
                } else {
                    try {
                        logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
                    } catch(e) {
                        logger.debug('type.js:mongoDbTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
                    }

                    callback(text, inDoc, false);
                }
            }

        });
    }
}

globals.setGlobalTypeCheck('mongoDbTypeCheck', mongoDbTypeCheck);
exports.mongoDbTypeCheck = mongoDbTypeCheck;

var commonTypes = [
    // amountType,
    mobileType,
    // phoneType,
    dateType,
    // timeType,
    // accountType
];


function checkTypes(text, types, inDoc, context, successCallback) {
    var typeNum = 0;
    var curType = types[typeNum];

    var _successCallback = function(_text, _inDoc) {

        if(++typeNum >= types.length) {
            successCallback(_text, _inDoc);
        } else {
            curType = types[typeNum];
            executeType(_text, curType, _inDoc, context, _successCallback);
        }
    }

    executeType(text, curType, inDoc, context, _successCallback);
}

exports.executeType = executeType;

function executeType(text, type, inDoc, context, successCallback) {

    if(type) {
        type.typeCheck(text, type, inDoc, context, successCallback);
    } else {
        successCallback(text, inDoc);
    }

}


exports.findType = findType;

function findType(type, context) {
    var typeModule;
    var botName = context.bot.botName;

    if(!type.module) {
        // bot action
        try {
            typeModule = require('../../../../custom_modules/' + botName + '/' + botName);
        } catch(err) {
            //console.log("error loading custom module: " + botName + "/" + botName);
        }
    } else {
        //template action
        var templateModule;
        try {
            templateModule = require('../../../../custom_modules/' + botName + '/' + type.module);

            if(templateModule) {
                if(templateModule[type.action]) {
                    //var template = utils.clone(templateModule[type.action]);
                    var template = templateModule[type.action];
                    type.templateAction = type.action;
                    type.module = template.module;
                    type.action = template.action;
                    type = utils.merge(type, template);
                    type.template = template;

                    typeModule = require('../../action/common/' + type.module);

                } else {
                    typeModule = templateModule;
                }
            }
        } catch(err) {
            //console.log("error loading custom module: " + botName + "/" + type.module + '/' + type.action);
            //console.log(err);
        }

        // common action
        if(!typeModule) {
            try {
                typeModule = require('../../action/common/type');
            } catch(e) {
                //console.log("error loading common module: " + outJson.module);
                //console.log("error loading common module: " + e);
            }
        }
    }

    return typeModule;
}


var addressType = {
    name: 'address',
    typeCheck: address.addressTypeCheck,
    raw: true,
    context: true
};

exports.addressType= addressType;
globals.setGlobalType('address', addressType);


var stringType = {
    name: 'string',
    typeCheck: stringTypeCheck
}

exports.stringType= stringType;

function stringTypeCheck(text, type, task, context, callback) {
    task[type.name] = text;
    callback(text, task, true);
}


var numberType = {
    name: 'number',
    typeCheck: numberTypeCheck
}

globals.setGlobalType('number', numberType);
exports.numberType= numberType;

function numberTypeCheck(text, type, task, context, callback) {
    if(text.search(/^(\d)+$/g) != -1) {
        task[type.name] = text;
        callback(text, task, true);
    } else {
        callback(text, task, false);
    }
}


function mongoTypeCheck(text, format, inDoc, context, callback) {
    // logger.debug('');
    // try {
    //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    // } catch(e) {
    //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '"');
    // }

    if(text == null) {
        callback(text, inDoc, false);
        return;
    }

    var model;
    if (mongoose.models[format.mongo.model]) {
        model = mongoose.model(format.mongo.model);
    } else {
        model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
    }

    var matchedWord = '';
    var matchedDoc = [];
    var words = text.split(' '), wordsCount = 0;

    async.waterfall([
        function(_cb) {
            var matchConcepts = [];
            var bot = context.bot;
            if(bot.concepts) {
                for(var key in bot.concepts) {

                    for (var i = 0; i < words.length; i++) {
                        var word = words[i];
                        try {
                            if(word.length <= 1) continue;
                            word = RegExp.escape(word);

                            for (var j = 0; j < bot.concepts[key].length; j++) {
                                var val = bot.concepts[key][j];

                                if(val.search(word) != -1 && !(format.exclude && _.includes(format.exclude, word))) {
                                    if(!_.includes(matchConcepts, key)) matchConcepts.push(key);
                                    break;
                                }
                            }

                        } catch(e) {}
                    }
                }
            }

            if(matchConcepts.length > 0) {
                async.eachSeries(matchConcepts, function (word, _callback) {
                    if(word.length <= 1) {
                        _callback(null);
                    } else {
                        var query = {};
                        if(format.mongo.queryStatic) query = format.mongo.queryStatic;
                        else query = {};

                        for(var j = 0; j < format.mongo.queryFields.length; j++) {
                            try {
                                word = RegExp.escape(word);
                                query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                            } catch(e) {}
                        }

                        if(format.query) query = utils.merge(query, format.query);
                        var _query = model.find(query, format.mongo.fields, format.mongo.options);
                        if(format.mongo.sort) _query.sort(format.mongo.sort);
                        if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                        _query.lean().exec(function (err, docs) {
                            if (err || !docs || docs.length <= 0) {
                                //callback(text, inDoc);
                            } else {
                                for(var k = 0; k < docs.length; k++) {
                                    var doc = docs[k];

                                    var bExist = false;
                                    for(var l = 0; l < matchedDoc.length; l++) {
                                        if(matchedDoc[l]._id.id == doc._id.id) {
                                            bExist = true;
                                            break;
                                        }
                                    }

                                    if(!bExist) {
                                        doc.matchRate = 1;
                                        matchedDoc.push(doc);
                                    }
                                }
                            }

                            _callback(null);
                        });
                    }
                }, function(err) {
                    if(matchedDoc.length > 0) _cb(true);
                    else _cb(null);
                })

            } else _cb(null);

        },

        function(_cb) {
            var _words = [];
            var excluded = [];
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                if(word.length <= 1) continue;
                word = RegExp.escape(word);
                if(!(format.exclude && _.includes(format.exclude, word)))
                    _words.push(word);
                else
                    excluded.push(word);
            }

            if(_words.length == 0) _words.concat(excluded);

            async.eachSeries(_words, function (word, _callback){

                if(word.length <= 1) {
                    _callback(null);
                } else {
                    var query = {};
                    if(format.mongo.queryStatic) query = format.mongo.queryStatic;
                    else query = {};

                    for(var j = 0; j < format.mongo.queryFields.length; j++) {
                        try {
                            if(!(format.exclude && _.includes(format.exclude, word)))
                                query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                            else
                                excluded.push(word);
                        } catch(e) {}
                    }

                    if(format.query) query = utils.merge(query, format.query);

                    var _query = model.find(query, format.mongo.fields, format.mongo.options);
                    if(format.mongo.sort) _query.sort(format.mongo.sort);
                    if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                    _query.lean().exec(function (err, docs) {
                        wordsCount++;

                        if (err || !docs || docs.length <= 0) {
                            //callback(text, inDoc);
                        } else {

                            for(var k = 0; k < docs.length; k++) {
                                var doc = docs[k];

                                var matchCount = 0;
                                matchedWord = '';
                                var matchIndex = -1, matchMin = -1, matchMax = -1;
                                for(var l = 0; l < format.mongo.queryFields.length; l++) {
                                    for(var m = 0; m < _words.length; m++) {
                                        matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_words[m], 'i'));

                                        if(matchIndex != -1) {
                                            matchCount++;
                                            matchedWord += words[m];

                                            var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                                            if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                            if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                                        }
                                    }
                                }

                                if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                                    var bExist = false;
                                    for(var l = 0; l < matchedDoc.length; l++) {
                                        if(matchedDoc[l]._id.id == doc._id.id) {
                                            bExist = true;
                                            break;
                                        }
                                    }

                                    if(!bExist) {
                                        doc.matchWord = matchedWord;
                                        doc.matchCount = matchCount;
                                        doc.matchMin = matchMin;
                                        doc.matchMax = matchMax;
                                        doc.matchRate = matchCount / words.length;
                                        matchedDoc.push(doc);
                                    }
                                }
                            }
                        }

                        _callback(null);
                    });
                }
                // var word = words[i];
            }, function(err) {
                if(matchedDoc.length > 0) _cb(true);
                else _cb(null);
            })
        }

    ], function(err) {

        if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
            matchedDoc.sort(format.mongo.taskSort);
        } else {
            matchedDoc.sort(function (a, b) {
                return b.matchRate - a.matchRate;
            });
        }

        if (matchedDoc.length > 0) {

            inDoc[format.name] = [];
            for (var _l = 0; _l < matchedDoc.length; _l++) {
                var matchDoc = matchedDoc[_l];

                var matchText = '';
                for (var l = 0; l < format.mongo.queryFields.length; l++) {
                    var _text = matchDoc[format.mongo.queryFields[l]]
                    if (matchText == '') matchText = matchText.concat(_text);
                    else matchText = matchText.concat(' ', _text);
                }
                matchDoc['matchText'] = matchText;

                if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
                    var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                    matchDoc['matchOriginal'] = matchOriginal;
                }

                if (format.mongo.taskFields) {
                    var addDoc = {};
                    for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                        addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                    }
                    inDoc[format.name].push(addDoc);
                } else {
                    inDoc[format.name].push(matchDoc);
                }

                if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
                    break;
                if (inDoc[format.name].length >= (format.limit || MAX_LIST)) break;
            }

            if(inDoc[format.name].length == 1) {
                inDoc[format.name] = inDoc[format.name][0];

                if(inDoc[format.name]['matchOriginal']) {
                    text = text.replace(inDoc[format.name]['matchOriginal'], IN_TAG_START + format.name + IN_TAG_END);
                    inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
                }
            }

            try {
                logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc: ' + JSON.stringify(inDoc)*/);
            } catch (e) {
                logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc)*/);
            }

            callback(text, inDoc, true);
        } else {

            try {
                logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
            } catch (e) {
                logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
            }

            callback(text, inDoc, false);
        }
    });
}

exports.mongoTypeCheck = mongoTypeCheck;
globals.setGlobalTypeCheck('mongoTypeCheck', mongoTypeCheck);

function dialogTypeCheck(text, format, inDoc, context, callback) {
    // logger.debug('');
    // try {
    //   logger.debug('type.js:dialogTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    // } catch(e) {
    //   logger.debug('type.js:dialogTypeCheck: START ' + format.name + ' "' + text + '"');
    // }

    if(context.bot == undefined) callback(text, inDoc, false);

    var t0 = new Date();

    if(text == null) {
        callback(text, inDoc, false);
        return;
    }
    var model;
    if (mongoose.models[format.mongo.model]) {
        model = mongoose.model(format.mongo.model);
    } else {
        model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
    }

    var matchedWord = '';
    var matchedDoc = [];
    var /*nlps = text.split(' '), */nlpsCount = 0;

    var nlps = context.botUser.nlu.nlp;

    // TODO 현재 중국어 자연어 처리 안되는 듯 com2best
    if(nlps === undefined) {
        nlps = [];
        var _s = text.split(' ');
        for(var i = 0; i < _s.length; i++) {
            nlps.push({text: _s[i], pos: 'Noun'});
        }
    }
    var nlpMatchLength = 0;
    for(var i = 0; i < nlps.length; i++) {
        if(nlps[i].pos == 'Noun') nlpMatchLength+=2;
        else nlpMatchLength += 1;
    }

    var topicKeywords = [];
    var contexts = [];
    if(!context.dialog) context.dialog = {};

    async.waterfall([
        function(_cb) {
            // 현재 발화의 대답이 중복인 경우, 중복된 발화의 category들을 저장하는 변수 (dsyoon)
            if (context.botUser["nlu"] == undefined || context.botUser["nlu"] == null) context.botUser["nlu"] = {};
            if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};

            // dialog를 저장한다.
            if (context.botUser.nlu["dialog"] == undefined || context.botUser.nlu["dialog"] == null) context.botUser.nlu["dialog"] = {};
            // 발화의 상태를 history로 저장한다
            if (context.botUser.nlu.contextInfo["contextHistory"] == undefined || context.botUser.nlu.contextInfo["contextHistory"] == null) context.botUser.nlu.contextInfo["contextHistory"] = [];
            if (context.botUser.nlu.contextInfo["matchContextHistory"] == undefined || context.botUser.nlu.contextInfo["matchContextHistory"] == null) context.botUser.nlu.contextInfo["matchContextHistory"] = [];
            // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
            if (context.botUser.nlu.contextInfo["answerHistory"] == undefined || context.botUser.nlu.contextInfo["answerHistory"] == null) context.botUser.nlu.contextInfo["answerHistory"] = [];
            // 사용자 발화를 history로 저장한다
            if (context.botUser.nlu.contextInfo["queryHistory"] == undefined || context.botUser.nlu.contextInfo["queryHistory"] == null) context.botUser.nlu.contextInfo["queryHistory"] = [];
            // 현재 발화의 상태
            if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};

            // 현재 발화의 매치 정보
            if (context.botUser.nlu["matchInfo"] == undefined || context.botUser.nlu["matchInfo"] == null) context.botUser.nlu["matchInfo"] = {};
            if (context.botUser.nlu.matchInfo["qa"] == undefined || context.botUser.nlu.matchInfo["qa"] == null) context.botUser.nlu.matchInfo["qa"] = [];
            if (context.botUser.nlu.matchInfo["contextNames"] == undefined || context.botUser.nlu.matchInfo["contextNames"] == null) context.botUser.nlu.matchInfo["contextNames"] = {};
            if (context.botUser.nlu.matchInfo["contexts"] == undefined || context.botUser.nlu.matchInfo["contexts"] == null) context.botUser.nlu.matchInfo["contexts"] = {};
            if (context.botUser.nlu.matchInfo["topScoreCount"] == undefined || context.botUser.nlu.matchInfo["topScoreCount"] == null) context.botUser.nlu.matchInfo["topScoreCount"] = 0;

            _cb(null);
        },
        function(_cb) {
            var matchConcepts = [];
            var bot = context.bot;
            if(bot && bot.concepts) {
                for(var key in bot.concepts) {
                    for (var i = 0; i < nlps.length; i++) {
                        var word = nlps[i].text;
                        try {
                            if(word.length <= 1) continue;
                            word = RegExp.escape(word);

                            for (var j = 0; j < bot.concepts[key].length; j++) {
                                var val = bot.concepts[key][j];

                                if(val.search(word) != -1 && !(format.exclude && _.includes(format.exclude, word))) {
                                    if(!_.includes(matchConcepts, key)) matchConcepts.push(key);
                                    break;
                                }
                            }

                        } catch(e) {}
                    }
                }
            }

            if(matchConcepts.length > 0) {
                async.eachSeries(matchConcepts, function (word, _callback) {
                    if(word.length <= 1) {
                        _callback(null);
                    } else {
                        var query = {};
                        if(format.mongo.queryStatic) query = format.mongo.queryStatic;
                        else query = {};

                        for(var j = 0; j < format.mongo.queryFields.length; j++) {
                            try {
                                word = RegExp.escape(word);
                                query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
                            } catch(e) {}
                        }

                        if(format.query) query = utils.merge(query, format.query);
                        var _query = model.find(query, format.mongo.fields, format.mongo.options);
                        if(format.mongo.sort) _query.sort(format.mongo.sort);
                        if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                        _query.lean().exec(function (err, docs) {
                            if (err || !docs || docs.length <= 0) {
                                //callback(text, inDoc);
                            } else {
                                for(var k = 0; k < docs.length; k++) {
                                    var doc = docs[k];
                                    var bExist = false;
                                    for(var l = 0; l < matchedDoc.length; l++) {
                                        if(matchedDoc[l].dialogset == doc.dialogset) {
                                            bExist = true;
                                            break;
                                        }
                                    }

                                    if(!bExist) {
                                        doc.matchRate = 1;
                                        matchedDoc.push(doc);
                                    }
                                }
                            }

                            _callback(null);
                        });
                    }
                }, function(err) {
                    if(matchedDoc.length > 0) _cb(true);
                    else _cb(null);
                })

            } else _cb(null);
        },

        function(_cb) {
            // 명사 단어에 대한 bigram 적용
            var nounList = [];
            for (var i = 0; i < nlps.length; i++) {
                var word = nlps[i].text;
                if (nlps[i].pos == "Noun") {
                    nounList.push(RegExp.escape(word));
                }
            }
            if (nounList.length > 0) {
                for (var i=0; i<nounList.length; i++) {
                    var nounWord = nounList[i];
                    for (var j=1; j<nounWord.length; j++) {
                        var word = nounWord.substr(j-1, 2);
                        var query = {};
                        if (format.mongo.queryStatic) query = format.mongo.queryStatic;
                        else query = {};

                        for (var k = 0; k < format.mongo.queryFields.length; k++) {
                            try {
                                if (!(format.exclude && _.includes(format.exclude, word))) {
                                    if (word.length == 1) query[format.mongo.queryFields[k]] = word;
                                    else query[format.mongo.queryFields[k]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
                                } else
                                    excluded.push(word);
                            } catch (e) {
                            }
                        }

                        if (format.query) query = utils.merge(query, format.query);

                        var _query = model.find(query, format.mongo.fields, format.mongo.options);

                        _query.populate('context');
                        if (format.mongo.sort) _query.sort(format.mongo.sort);
                        if (format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                        _query.lean().exec(function (err, docs) {
                            nlpsCount++;

                            if (err || !docs || docs.length <= 0) {
                                if(err) {
                                    // logger.systemError(err.stack || err);
                                }
                                //callback(text, inDoc);
                            } else {
                                for (var k = 0; k < docs.length; k++) {
                                    var doc = docs[k];
                                    doc["score"] = 0.0;
                                    matchedDoc.push(doc);

                                    var parsedDoc = typeUtil.parseDialogSetDocs(doc);
                                    for (var pdx=0; pdx<parsedDoc.length; pdx++) {
                                        context.botUser.nlu.matchInfo["qa"].push(doc);
                                    }
                                }
                            }
                        });
                    }
                }
                _cb(null);
            } else {
                _cb(null);
            }
        },
        function(_cb) {
            // Token 단위로 Answer 체크
            var _nlps = [];
            var excluded = [];

            for (var i = 0; i < nlps.length; i++) {
                var word = nlps[i].text;
                // if(word.length <= 1) continue;
                word = RegExp.escape(word);

                if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, word)) {
                    topicKeywords.push(nlps[i]);
                }
                if (!(format.exclude && _.includes(format.exclude, word)))
                    _nlps.push(nlps[i]);
                else
                    excluded.push(nlps[i]);
            }

            if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useContext !== false) && context.botUser.contexts && context.botUser.contexts.length > 0) {
                topicKeywords = [];
                /* context를 통한 topicKeyword 검색은 하지 않는다.
                for (var j = 0; j < context.botUser.contexts.length; j++)
                    if (context.botUser.contexts[j].name) topicKeywords.push({
                        text: context.botUser.contexts[j].name,
                        pos: 'Noun'
                    });
                console.log('topicKeywords: contexts ' + topicKeywords);
                */
            } else if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && topicKeywords.length == 0 && context.botUser.topic && context.botUser.topic.length > 0) {
                topicKeywords = context.botUser.topic;
                console.log('topicKeywords: topic ' + topicKeywords);
            }

            if (_nlps.length == 0) _nlps.concat(excluded);

            async.eachSeries((topicKeywords.length > 0 ? topicKeywords : _nlps), function (word, _callback) {
                word = word.text ? RegExp.escape(word.text) : word;

                if (false/*word.length <= 1*/) {
                    _callback(null);
                } else {
                    var query = {};
                    if (format.mongo.queryStatic) query = format.mongo.queryStatic;
                    else query = {};

                    for (var j = 0; j < format.mongo.queryFields.length; j++) {
                        try {
                            if (!(format.exclude && _.includes(format.exclude, word))) {
                                /*
                                if (word.length == 1) query[format.mongo.queryFields[j]] = word;
                                else query[format.mongo.queryFields[j]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
                                */
                                // "몇 살?" 질의에 대해서 기존 "몇"의 Question이 있는 경우 "몇 살"을 검색하지 못함
                                query[format.mongo.queryFields[j]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');
                            } else
                                excluded.push(word);
                        } catch (e) {
                        }
                    }

                    if (format.query) query = utils.merge(query, format.query);

                    var _query = model.find(query, format.mongo.fields, format.mongo.options);

                    _query.populate('context');
                    if (format.mongo.sort) _query.sort(format.mongo.sort);
                    if (format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

                    _query.lean().exec(function (err, docs) {
                        nlpsCount++;

                        if (err || !docs || docs.length <= 0) {
                            //callback(text, inDoc);
                        } else {
                            for (var k = 0; k < docs.length; k++) {
                                var doc = docs[k];

                                var matchCount = 0, matchCount1 = 0, matchTotal = 0, matchNLP = [];
                                matchedWord = '';
                                var matchIndex = -1, matchMin = -1, matchMax = -1;

                                var _matchCount = [], _matchCount1 = [], _matchTotal = [];
                                var _matchedWord = [];
                                var _matchIndex = [], _matchMin = [], _matchMax = [], _matchOrgIndex = [];
                                if (Array.isArray(doc['input'])) {
                                    for (var n = 0; n < doc['input'].length; n++) {
                                        _matchCount[n] = 0;
                                        _matchTotal[n] = 0;
                                        _matchedWord[n] = '';
                                        _matchIndex[n] = -1;
                                        _matchMin[n] = -1;
                                        _matchMax[n] = -1;
                                    }
                                }

                                for (var l = 0; l < format.mongo.queryFields.length; l++) {
                                    var bMatchTotal = false;
                                    for (var m = 0; m < _nlps.length; m++) {
                                        if (_nlps[m].pos == 'Josa' || _nlps[m].pos == 'Suffix') continue;

                                        var _word = _nlps[m].text;
                                        _word = RegExp.escape(_word);

                                        if (Array.isArray(doc[format.mongo.queryFields[l]])) {

                                            for (var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
                                                _matchIndex[n] = doc[format.mongo.queryFields[l]][n].search(new RegExp('(?:^|\\s)' + _word + '(?:$|\\s)', 'i'));

                                                if (_matchIndex[n] != -1) {
                                                    if (context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {
                                                        _matchCount[n]++;
                                                        _matchCount1[n] += 3;
                                                    }
                                                    else if (_nlps[m].pos == 'Noun') {
                                                        _matchCount[n] += 2;
                                                        _matchCount1[n] += 2;
                                                    }
                                                    else {
                                                        _matchCount[n]++;
                                                        _matchCount1[n]++;
                                                    }

                                                    if (!bMatchTotal) {
                                                        _matchTotal[n] += doc[format.mongo.queryFields[l]][n].split(' ').length;
                                                        bMatchTotal = true
                                                    }
                                                    ;
                                                    _matchedWord[n] += nlps[m];

                                                    var __word = nlps[m].text;
                                                    __word = RegExp.escape(__word);

                                                    _matchOrgIndex[n] = text.search(new RegExp(__word, 'i'));
                                                    if (_matchOrgIndex[n] != -1 && (_matchMin[n] == -1 || _matchOrgIndex[n] < _matchMin[n])) _matchMin[n] = _matchOrgIndex[n];
                                                    if (_matchOrgIndex[n] != -1 && (_matchMax[n] == -1 || _matchOrgIndex[n] + nlps[m].length > _matchMax[n])) _matchMax[n] = _matchOrgIndex[n] + nlps[m].length;
                                                }
                                            }

                                            var maxMatchIndex = 0, maxMatchedCount = 0;
                                            for (var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
                                                if (_matchCount[n] > maxMatchedCount) {
                                                    maxMatchIndex = n;
                                                    maxMatchedCount = _matchCount[n];
                                                }
                                            }

                                            matchCount = _matchCount[maxMatchIndex];
                                            matchCount1 = _matchCount1[maxMatchIndex];
                                            matchTotal = _matchTotal[maxMatchIndex];
                                            matchedWord = _matchedWord[maxMatchIndex];
                                            matchIndex = _matchIndex[maxMatchIndex];
                                            matchMin = _matchMin[maxMatchIndex];
                                            matchMax = _matchMax[maxMatchIndex];

                                        } else {
                                            matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));

                                            if (matchIndex != -1) {
                                                if ((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {
                                                    matchCount++;
                                                    matchCount1 += 3;
                                                }
                                                else if (_nlps[m].pos == 'Noun') {
                                                    matchCount += 2;
                                                    matchCount1 += 2;
                                                }
                                                else {
                                                    matchCount++;
                                                    matchCount1++;
                                                }

                                                if (!bMatchTotal) {
                                                    matchTotal += doc[format.mongo.queryFields[l]].split(' ').length;
                                                    bMatchTotal = true;
                                                }
                                                matchedWord += nlps[m];
                                                matchNLP.push({text: _nlps[m].text, pos: _nlps[m].pos});

                                                var __word = nlps[m].text;
                                                __word = RegExp.escape(__word);

                                                var matchOrgIndex = text.search(new RegExp(__word, 'i'));
                                                if (matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                                if (matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + nlps[m].length > matchMax)) matchMax = matchOrgIndex + nlps[m].length;
                                            }
                                        }
                                    }
                                }

                                // context match
                                // if(doc.context) {
                                //   matchIndex = doc.context.name.search(new RegExp(_word, 'i'));
                                //
                                //   if(matchIndex != -1) {
                                //     matchCount++; matchCount1+=3;
                                //   }
                                // }

                                if (!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                                    var bExist = false;
                                    for (var l = 0; l < matchedDoc.length; l++) {
                                        if ((Array.isArray(doc.input) && doc.input[maxMatchIndex] == matchedDoc[l].input) ||
                                            (doc.input == matchedDoc[l].input)) {
                                            bExist = true;
                                            break;
                                        }
                                    }

                                    // intent 매치의 경우 위에서 bExist가 모두 true로 나와서 아래 if문이 실행 안됨. 따라서 matchRate가 계산이 안되는 문제가 있었음.
                                    //일단 임시로 intent매치의 경우 bExist를 false로 해서 matchRate를 계산한다
                                    if(format.mongo.model == 'intentcontent')
                                        bExist = false;

                                    if (!bExist &&
                                        ((nlps.length <= 2 && (matchCount == matchTotal ||
                                                               (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
                                         (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
                                                              matchCount1 >= format.matchCount)))) {
                                        //if (Array.isArray(doc.input)) doc.input = doc.input[maxMatchIndex];
                                        if (Array.isArray(doc.input)) {
                                            doc.inputLen = doc.input[maxMatchIndex].split(' ').length;
                                        } else {
                                            doc.inputLen = doc.input.split(' ').length;
                                        }
                                        doc.matchWord = matchedWord;
                                        doc.matchCount = matchCount1;
                                        doc.matchNLP = matchNLP;
                                        doc.matchMin = matchMin;
                                        doc.matchMax = matchMax;
                                        doc.matchRate = matchCount / nlpMatchLength;
                                        // doc.matchRate = matchCount / matchTotal;

                                        var doc = docs[k];
                                        doc["score"] = 0.0;
                                        matchedDoc.push(doc);

                                        if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
                                        if (context.botUser.nlu.contextInfo["context"] == undefined || context.botUser.nlu.contextInfo["context"] == null) context.botUser.nlu.contextInfo["context"] = {};
                                    }

                                    // 멀티 Answer에 대해서 Context 확인을 위해서 모든 answer 저장 (dsyoon)
                                    var parsedDoc = typeUtil.parseDialogSetDocs(doc);
                                    for (var pdx=0; pdx<parsedDoc.length; pdx++) {
                                        context.botUser.nlu.matchInfo["qa"].push(parsedDoc[pdx]);
                                    }

                                    if (((nlps.length <= 2 && (matchCount == matchTotal ||
                                                               (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
                                         (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
                                                              matchCount1 >= format.matchCount)))) {
                                        if (context.botUser.nlu["contextInfo"] == undefined || context.botUser.nlu["contextInfo"] == null) context.botUser.nlu["contextInfo"] = {};
                                        if (doc.context) {
                                            context.botUser.nlu.matchInfo.contextNames[doc.context.name] = doc.context;
                                        }
                                    }
                                }
                            }
                        }

                        _callback(null);
                    });
                }
                // var word = nlps[i];
            }, function (err) {
                if (matchedDoc.length > 0) _cb(true);
                else _cb(null);
            })
        },

        // function(_cb) {
        //   if(context.bot.dialogsetContexts == undefined) {
        //     _cb(null);
        //   } else {
        //     var CustomContext = mongoModule.getModel('customcontext');
        //
        //     async.eachSeries(nlps, function (word, _callback) {
        //       CustomContext.find({name: new RegExp(word, 'i')}).lean().exec(function(err, docs) {
        //
        //       })
        //     }, function(err) {
        //
        //     });
        //
        //     async.eachSeries(nlps, function (word, _callback){
        //       word = word.text ? RegExp.escape(word.text): word;
        //
        //       if(false/*word.length <= 1*/) {
        //         _callback(null);
        //       } else {
        //         var query = {};
        //         if(format.mongo.queryStatic) query = format.mongo.queryStatic;
        //         else query = {};
        //
        //         for(var j = 0; j < format.mongo.queryFields.length; j++) {
        //           try {
        //             if(!(format.exclude && _.includes(format.exclude, word)))
        //               query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
        //             else
        //               excluded.push(word);
        //           } catch(e) {}
        //         }
        //
        //         if(format.query) query = utils.merge(query, format.query);
        //
        //         var _query = model.find(query, format.mongo.fields, format.mongo.options);
        //         if(format.mongo.sort) _query.sort(format.mongo.sort);
        //         if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);
        //
        //         _query.lean().exec(function (err, docs) {
        //           nlpsCount++;
        //
        //           if (err || !docs || docs.length <= 0) {
        //             //callback(text, inDoc);
        //           } else {
        //
        //             for(var k = 0; k < docs.length; k++) {
        //               var doc = docs[k];
        //
        //               var matchCount = 0, matchCount1 = 0, matchTotal = 0, matchNLP = [];
        //               matchedWord = '';
        //               var matchIndex = -1, matchMin = -1, matchMax = -1;
        //
        //               var _matchCount = [], _matchCount1 = [], _matchTotal = [];
        //               var _matchedWord = [];
        //               var _matchIndex = [], _matchMin = [], _matchMax = [], _matchOrgIndex = [];
        //               if(Array.isArray(doc['input'])) {
        //                 for (var n = 0; n < doc['input'].length; n++) {
        //                   _matchCount[n] = 0; _matchTotal[n] = 0; _matchedWord[n] = '';
        //                   _matchIndex[n] = -1; _matchMin[n] = -1; _matchMax[n] = -1;
        //                 }
        //               }
        //
        //               for(var l = 0; l < format.mongo.queryFields.length; l++) {
        //                 var bMatchTotal = false;
        //                 for(var m = 0; m < _nlps.length; m++) {
        //                   if(_nlps[m].pos == 'Josa') continue;
        //
        //                   var _word = _nlps[m].text;
        //                   _word = RegExp.escape(_word);
        //
        //                   if(Array.isArray(doc[format.mongo.queryFields[l]])) {
        //
        //                     for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
        //                       _matchIndex[n] = doc[format.mongo.queryFields[l]][n].search(new RegExp(_word, 'i'));
        //
        //                       if(_matchIndex[n] != -1) {
        //                         if(context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {_matchCount[n]++; _matchCount1[n] +=3;}
        //                         else if(_nlps[m].pos == 'Noun') {_matchCount[n]++;_matchCount1[n]+=2;}
        //                         else {_matchCount[n]++;_matchCount1[n]++;}
        //
        //                         // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]][n] + ' ' +_matchCount[n]);
        //                         if(!bMatchTotal) {_matchTotal[n] += doc[format.mongo.queryFields[l]][n].split(' ').length; bMatchTotal = true};
        //                         _matchedWord[n] += nlps[m];
        //
        //                         var __word = nlps[m].text;
        //                         __word = RegExp.escape(__word);
        //
        //                         _matchOrgIndex[n] = text.search(new RegExp(__word, 'i'));
        //                         if(_matchOrgIndex[n] != -1 && (_matchMin[n] == -1 || _matchOrgIndex[n] < _matchMin[n])) _matchMin[n] = _matchOrgIndex[n];
        //                         if(_matchOrgIndex[n] != -1 && (_matchMax[n] == -1 || _matchOrgIndex[n] + nlps[m].length> _matchMax[n])) _matchMax[n] = _matchOrgIndex[n] + nlps[m].length;
        //                       }
        //                     }
        //
        //                     var maxMatchIndex = 0, maxMatchedCount = 0;
        //                     for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
        //                       if(_matchCount[n] > maxMatchedCount) {
        //                         maxMatchIndex = n;
        //                         maxMatchedCount = _matchCount[n];
        //                       }
        //                     }
        //
        //                     matchCount = _matchCount[maxMatchIndex];
        //                     matchCount1 = _matchCount1[maxMatchIndex];
        //                     matchTotal= _matchTotal[maxMatchIndex];
        //                     matchedWord = _matchedWord[maxMatchIndex];
        //                     matchIndex = _matchIndex[maxMatchIndex];
        //                     matchMin = _matchMin[maxMatchIndex];
        //                     matchMax = _matchMax[maxMatchIndex];
        //
        //                   } else {
        //                     matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));
        //
        //                     if(matchIndex != -1) {
        //                       if(context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {matchCount++; matchCount1 +=3;}
        //                       else if(_nlps[m].pos == 'Noun') {matchCount++; matchCount1+=2;}
        //                       else {matchCount++; matchCount1++;}
        //                       // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]] + ' ' +matchCount);
        //
        //                       if(!bMatchTotal) {matchTotal += doc[format.mongo.queryFields[l]].split(' ').length;bMatchTotal = true;}
        //                       matchedWord += nlps[m];
        //                       matchNLP.push({text: _nlps[m].text, pos: _nlps[m].pos});
        //
        //                       // console.log(l + ',' + doc[format.mongo.queryFields[l]] + ', ' + matchCount + ',' + matchTotal);
        //
        //                       var __word = nlps[m].text;
        //                       __word = RegExp.escape(__word);
        //
        //                       var matchOrgIndex = text.search(new RegExp(__word, 'i'));
        //                       if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
        //                       if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + nlps[m].length> matchMax)) matchMax = matchOrgIndex + nlps[m].length;
        //                     }
        //                   }
        //                 }
        //               }
        //
        //               if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
        //                 var bExist = false;
        //                 for(var l = 0; l < matchedDoc.length; l++) {
        //                   if((Array.isArray(doc.input) && doc.input[maxMatchIndex] == matchedDoc[l].input) ||
        //                     (doc.input == matchedDoc[l].input)) {
        //                     bExist = true;
        //                     break;
        //                   }
        //                 }
        //
        //                 if(!bExist &&
        //                   ((nlps.length <= 2 && (matchCount == matchTotal ||
        //                   (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
        //                   (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
        //                   matchCount1 >= format.matchCount)))) {
        //                   if(Array.isArray(doc.input)) doc.input = doc.input[maxMatchIndex];
        //                   doc.inputLen = doc.input.split(' ').length;
        //                   doc.matchWord = matchedWord;
        //                   doc.matchCount = matchCount1;
        //                   doc.matchNLP = matchNLP;
        //                   doc.matchMin = matchMin;
        //                   doc.matchMax = matchMax;
        //                   doc.matchRate = matchCount / nlpMatchLength;
        //                   // doc.matchRate = matchCount / matchTotal;
        //
        //                   matchedDoc.push(doc);
        //                 }
        //               }
        //             }
        //           }
        //
        //           _callback(null);
        //         });
        //       }
        //       // var word = nlps[i];
        //     }, function(err) {
        //       if(matchedDoc.length > 0) _cb(true);
        //       else _cb(null);
        //     })
        //   }
        // }

    ], function(err) {

        if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
            matchedDoc.sort(format.mongo.taskSort);
        } else {
            var inNLP = context.botUser.nlu.inNLP;
            for(var i = 0; i < matchedDoc.length /*&& i < 5*/; i++) {
                if (inNLP == matchedDoc[i].input) {
                    matchedDoc[i].matchRate = 1.0;
                }
            }
            matchedDoc = matchedDoc.sort(function(doc1, doc2) {
                return doc2.matchRate - doc1.matchRate;
            });
            matchedDoc.sort(function (a, b) {
                if(b.matchCount == a.matchCount) {
                    if(b.matchRate == a.matchRate) {
                        if(a.id && b.id) return a.id - b.id;
                        else return a.inputLen - b.inputLen;
                    }
                    else return b.matchRate - a.matchRate;
                } else {
                    if(!b.matchCount) b.matchCount = 0;
                    if(!a.matchCount) a.matchCount = 0;

                    return b.matchCount - a.matchCount;
                }
            });
        }

        if (matchedDoc.length > 0) {
            inDoc[format.name] = [];
            for (var _l = 0; _l < matchedDoc.length; _l++) {
                var matchDoc = matchedDoc[_l];

                var matchText = '';
                for (var l = 0; l < format.mongo.queryFields.length; l++) {
                    var _text = matchDoc[format.mongo.queryFields[l]]
                    if (matchText == '') matchText = matchText.concat(_text);
                    else matchText = matchText.concat(' ', _text);
                }
                matchDoc['matchText'] = matchText;

                if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
                    var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                    matchDoc['matchOriginal'] = matchOriginal;
                }

                if (format.mongo.taskFields) {
                    var addDoc = {};
                    for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                        addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                    }
                    addDoc._id = matchDoc._id; // addDialog시 qna의 경우 dialogsetdialog의 _id가 필요해서 넣음
                    inDoc[format.name].push(addDoc);
                } else {
                    inDoc[format.name].push(matchDoc);
                }

                // if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
                //   break;
                if (inDoc[format.name].length >= (format.limit || MAX_LIST)) break;
            }

            if(inDoc[format.name][0].context) {
                var _dialog = inDoc[format.name][0];
                context.botUser.contexts = [];
                var parentContext = function(_context) {
                    var __context;
                    if(context.bot.dialogsetContexts[_dialog.dialogset] && context.bot.dialogsetContexts[_dialog.dialogset][_context._id]) {
                        __context = context.bot.dialogsetContexts[_dialog.dialogset][_context._id];
                        context.botUser.contexts.unshift(__context);
                    }

                    if(__context && __context.parent) {
                        parentContext(__context.parent);
                    }
                };

                parentContext(inDoc[format.name][0].context);
            }

            if(inDoc[format.name].length == 1) {
                inDoc[format.name] = inDoc[format.name][0];

                if(inDoc[format.name]['matchOriginal']) {
                    text = text.replace(inDoc[format.name]['matchOriginal'], IN_TAG_START + format.name + IN_TAG_END);
                    inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
                }
            }

            var t1 = new Date();
            try {
                logger.debug('type.js:dialogCheck: MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc: ' + JSON.stringify(inDoc)*/);
            } catch (e) {
                logger.debug('type.js:dialogCheck: MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + ' isArray: ' + Array.isArray(inDoc[format.name]) /* + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc)*/);
            }

            if(topicKeywords && topicKeywords.length > 0) context.botUser.topic = topicKeywords;
            // console.log('topic1: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null')+ ',' + context.botUser.analytics + ',' + context.botUser.analytics2);

            for(var i = 0; i < matchedDoc.length /*&& i < 5*/; i++) {
                var _doc = matchedDoc[i];
                console.log('type.js:dialogCheck: ' + /*(_doc.context ? _doc.context.name + ':': '') +*/ _doc.matchText + ': ' + _doc.matchCount + ', ' + _doc.matchRate + ', ' + JSON.stringify(_doc.matchNLP));
            }

            callback(text, inDoc, true);
        } else {

            var t1 = new Date();
            try {
                logger.debug('type.js:dialogCheck: NOT MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
            } catch (e) {
                logger.debug('type.js:dialogCheck: NOT MATCHED ' + (t1 - t0) + ' ms ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
            }

            if(((context.botUser.topic && context.botUser.topic.length > 0) ||
                (context.botUser.contexts && context.botUser.contexts.length > 0))&&
               (context.botUser.analytics == null || context.botUser.analytics2 == null)) {
                if(context.botUser.analytics == null) {
                    context.botUser.topic = null;
                    context.botUser.contexts = null;
                }
                // else context.botUser.analytics = null;
                else context.botUser.analytics2 = true;

                // console.log('topic20: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null') + ',' + context.botUser.analytics + ',' + context.botUser.analytics2);

                dialogTypeCheck(text, format, inDoc, context, callback);
            } else {
                if(topicKeywords && topicKeywords.length > 0) context.botUser.topic = topicKeywords;

                // console.log('topic21: '+ (context.botUser.topic ? context.botUser.topic[0].text : 'null') + ',' + context.botUser.analytics + ',' + context.botUser.analytics2);
                callback(text, inDoc, false);
            }
        }
    });
}

exports.dialogTypeCheck = dialogTypeCheck;
globals.setGlobalTypeCheck('dialogTypeCheck', dialogTypeCheck);

function contextListCheck(text, format, inDoc, context, callback) {
    // logger.debug('');
    // try {
    //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    // } catch(e) {
    //   logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '"');
    // }

    if(text == null) {
        callback(text, inDoc, false);
        return;
    }

    var matchedWord = '';
    var matchedDoc = [];
    var words = text.split(' '), wordsCount = 0;

    async.waterfall([
        function(_cb) {
            var matchConcepts = [];
            var bot = context.bot;
            if(bot.concepts) {
                for(var key in bot.concepts) {

                    for (var i = 0; i < words.length; i++) {
                        var word = words[i];
                        try {
                            if(word.length <= 1) continue;
                            word = RegExp.escape(word);

                            for (var j = 0; j < bot.concepts[key].length; j++) {
                                var val = bot.concepts[key][j];

                                if(val.search(word) != -1 && !(format.exclude && _.includes(format.exclude, word))) {
                                    if(!_.includes(matchConcepts, key)) matchConcepts.push(key);
                                    break;
                                }
                            }

                        } catch(e) {}
                    }
                }
            }

            if(matchConcepts.length > 0) {
                for(var k = 0; context.dialog[format.list] && k < context.dialog[format.list].length; k++) {
                    var doc = context.dialog[format.list][k];

                    var matchCount = 0;
                    matchedWord = '';
                    var matchIndex = -1, matchMin = -1, matchMax = -1;
                    for(var l = 0; l < format.mongo.queryFields.length; l++) {
                        for(var m = 0; m < matchConcepts.length; m++) {
                            var word = matchConcepts[m];
                            matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(word, 'i'));

                            if(matchIndex != -1) {
                                matchCount++;
                                matchedWord += word;

                                var matchOrgIndex = text.search(new RegExp(word, 'i'));
                                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + word.length> matchMax)) matchMax = matchOrgIndex + word.length;
                            }
                        }
                    }

                    if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                        var bExist = false;
                        for(var l = 0; l < matchedDoc.length; l++) {
                            if(matchedDoc[l]._id.id == doc._id.id) {
                                bExist = true;
                                break;
                            }
                        }

                        if(!bExist) {
                            doc.matchWord = matchedWord;
                            doc.matchCount = matchCount;
                            doc.matchMin = matchMin;
                            doc.matchMax = matchMax;
                            doc.matchRate = matchCount / matchConcepts.length;
                            matchedDoc.push(doc);
                        }
                    }
                }

                // for (var i = 0; i < matchConcepts.length; i++) {
                //   var word = matchConcepts[i];
                //
                //   if(word.length > 1) {
                //     for(var k = 0; context.dialog[format.list] && k < context.dialog[format.list].length; k++) {
                //       var doc = context.dialog[format.list][k];
                //       var bExist = false;
                //       for(var l = 0; l < matchedDoc.length; l++) {
                //         if(matchedDoc[l]._id.id == doc._id.id) {
                //           bExist = true;
                //           break;
                //         }
                //       }
                //
                //       if(!bExist) {
                //         doc.matchRate = 1;
                //         matchedDoc.push(doc);
                //       }
                //     }
                //   }
                // }

                if(matchedDoc.length > 0) _cb(true);
                else _cb(null);
            } else _cb(null);

        },

        function(_cb) {
            var _words = [];
            var excluded = [];
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                if(word.length <= 1) continue;
                word = RegExp.escape(word);
                if(!(format.exclude && _.includes(format.exclude, word)))
                    _words.push(word);
                else
                    excluded.push(word);
            }

            if(_words.length == 0) _words.concat(excluded);

            for(var k = 0; context.dialog[format.list] && k < context.dialog[format.list].length; k++) {
                var doc = context.dialog[format.list][k];

                var matchCount = 0;
                matchedWord = '';
                var matchIndex = -1, matchMin = -1, matchMax = -1;
                for(var l = 0; l < format.mongo.queryFields.length; l++) {
                    for(var m = 0; m < _words.length; m++) {
                        matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_words[m], 'i'));

                        if(matchIndex != -1) {
                            matchCount++;
                            matchedWord += words[m];

                            var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                            if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                            if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
                        }
                    }
                }

                if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                    var bExist = false;
                    for(var l = 0; l < matchedDoc.length; l++) {
                        if(matchedDoc[l]._id.id == doc._id.id) {
                            bExist = true;
                            break;
                        }
                    }

                    if(!bExist) {
                        doc.matchWord = matchedWord;
                        doc.matchCount = matchCount;
                        doc.matchMin = matchMin;
                        doc.matchMax = matchMax;
                        doc.matchRate = matchCount / words.length;
                        matchedDoc.push(doc);
                    }
                }
            }

            _cb(null);
        }

    ], function(err) {

        if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
            matchedDoc.sort(format.mongo.taskSort);
        } else {
            matchedDoc.sort(function (a, b) {
                return b.matchRate - a.matchRate;
            });
        }

        if (matchedDoc.length > 0) {

            inDoc[format.name] = [];
            for (var _l = 0; _l < matchedDoc.length; _l++) {
                var matchDoc = matchedDoc[_l];

                var matchText = '';
                for (var l = 0; l < format.mongo.queryFields.length; l++) {
                    var _text = matchDoc[format.mongo.queryFields[l]]
                    if (matchText == '') matchText = matchText.concat(_text);
                    else matchText = matchText.concat(' ', _text);
                }
                matchDoc['matchText'] = matchText;

                if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
                    var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
                    matchDoc['matchOriginal'] = matchOriginal;
                }

                if (format.mongo.taskFields) {
                    var addDoc = {};
                    for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                        addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
                    }
                    inDoc[format.name].push(addDoc);
                } else {
                    inDoc[format.name].push(matchDoc);
                }

                if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
                    break;
                if (inDoc[format.name].length >= (format.limit || MAX_LIST)) break;
            }

            if(inDoc[format.name].length == 1) {
                inDoc[format.name] = inDoc[format.name][0];

                if(inDoc[format.name]['matchOriginal']) {
                    text = text.replace(inDoc[format.name]['matchOriginal'], IN_TAG_START + format.name + IN_TAG_END);
                    inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
                }
            }

            try {
                logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text/* + '" inDoc: ' + JSON.stringify(inDoc)*/);
            } catch (e) {
                logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text/* + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc)*/);
            }

            callback(text, inDoc, true);
        } else {

            try {
                logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
            } catch (e) {
                logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
            }

            callback(text, inDoc, false);
        }
    });
}


exports.contextListCheck = contextListCheck;
