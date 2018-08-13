'use strict'

var path = require('path');
var _ = require('lodash');
var async = require('async');

var koNLP = require(path.resolve('./engine2/bot/engine/nlp/processor_ko'));
var enNLP = require(path.resolve('./engine2/bot/engine/nlp/processor_en'));
var jaNLP = require(path.resolve('./engine2/bot/engine/nlp/processor_ja'));
var zhNLP = require(path.resolve('./engine2/bot/engine/nlp/processor_zh'));

var QAScore = require(path.resolve('./engine2/bot/action/common/qaScore'));
var qaScore = new QAScore();

var utils = require(path.resolve('./engine2/bot/action/common/utils'));
var entity = utils.requireNoCache(path.resolve('engine2/bot/engine/nlu/entity'));
var intent = utils.requireNoCache(path.resolve('engine2/bot/engine/nlu/intent'));

var mongoWrapper = require('../../../utils/mongo-wrapper.js');

var MatchedIntent = mongoWrapper.model('MatchedIntent');

var globlas = require(path.resolve('./engine2/globals.js'));

var commonTypes = [
    // amountType,
    globlas.types.mobileType,
    // phoneType,
    globlas.types.dateType,
    // timeType,
    // accountType
];

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
            var dialogModule = require(path.resolve('engine2/bot/action/common/dialog'));
            var globalDialogs = require(path.resolve('./engine2/global/global-dialogs.js'));

            dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType, {}, context, function(inNLP, task, matched) {
                if(matched) context.botUser.userDialogs = task.typeDoc;
                else context.botUser.userDialogs = undefined;
                cb(null);
            });
        },

        function(cb) {
            var dialogModule = require(path.resolve('engine2/bot/action/common/dialog'));
            var globalDialogs = require(path.resolve('./engine2/global/global-dialogs.js'));

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
