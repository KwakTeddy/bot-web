'use strict'

var nlp = require('../../engine/nlp/processor');
var utils = require('./utils');
var path = require('path');

var CBTags = require(path.resolve('./modules/bot/engine/nlp/cbTags.js'));
var UserDictionary = require(path.resolve('./modules/bot/engine/nlp/userDictionary.js'));
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));
var NLPUtil = require(path.resolve('./modules/bot/engine/nlp/nlpUtil.js'));

var logger = require(path.resolve('./config/lib/logger'));
var address = require(path.resolve('./modules/bot/action/common/address'));
var _ = require('lodash');
var globals = require(path.resolve('./modules/bot/engine/common/globals'));
var async = require('async');
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
    if (context.botUser.language = "en") {

    } else if (context.botUser.language = "zh") {

    } else if (context.botUser.language = "ja") {

    } else {
        // default: ko
    }
    if(inRaw.startsWith(":")) {
        callback(inRaw, null);
        return;
    }

    var doc = {entities: {}}, entities = {}, inNLP, _nlp = [], nlpAll = [], dialog;

    // 한국어 형태소 분석기
    async.waterfall([
        /* 기존 NLP
        function(cb) {

            var nlpKo = new nlp({
                stemmer: true,      // (optional default: true)
                normalizer: true,   // (optional default: true)
                spamfilter: true     // (optional default: false)
            });

            nlpKo.tokenize(inRaw, function(err, result) {
                var _inNLP = [];
                if(!result) result = inRaw;
                for (var i = 0; i < result.length; i++) {
                    if(result[i].pos == 'Alpha') result[i].pos = 'Noun';
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
        // 사용자 사전 적용된 한국어 형태소 분석기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var cbTags = new CBTags();
            var userDictionary = new UserDictionary(path.resolve('./external_modules/resources/ko/user.pos'));
            var nlpUtil = new NLPUtil();

            var nlpKo = new nlp({
                stemmer: true,      // (optional default: true)
                normalizer: true,   // (optional default: true)
                spamfilter: true     // (optional default: false)
            });

            var dicResult = userDictionary.applyUserDic('KO', inRaw);
            var temp_inRaw = dicResult[0];
            var mb_user_str = dicResult[1];
            var mb_user_tag = dicResult[2];

            nlpKo.tokenize(temp_inRaw, function(err, result) {
                var _inNLP = [];
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
                    entry.pos = cbTags.normalizeTag('KO', entry.pos);

                    if(entry.pos == 'Alpha') entry.pos = 'Noun';
                    nlpAll.push(entry);
                    if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _nlp.push(entry);
                    if(entry.text && entry.text.search(/^(은|는|이|가|을|를)$/) == -1 && entry.pos !== 'Punctuation') _inNLP.push(entry.text);
                }
                inNLP = _inNLP.join(' ');
                inNLP = inNLP.replace(/(?:\{ | \})/g, '+');
                if(inNLP == '') inNLP = inRaw;
                context.botUser.nlpAll = nlpAll;
                context.botUser.nlp = _nlp;

                var nlpJsonAll = nlpUtil.convertJSON(temp_inRaw, nlpAll);
                context.botUser.nlu.sentence = inRaw;
                context.botUser.nlu.pos = nlpJsonAll;

                cb(null);
            })
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze(context);
            context.botUser.nlp.sentenceInfo = value;

            cb(null);
        },

    function(cb) {
      entity.matchDictionaryEntities(inRaw, commonTypes, doc, context, function(_inRaw, _entities) {
        // doc.entities = doc.entities.concat(_doc.entities)
        doc.entities = utils.merge(doc.entities, _entities);

        console.log('entities: ' + JSON.stringify(_entities));

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

          console.log('intent: ' + JSON.stringify(_intent));
          cb(null);
        })
      } else {
        cb(null);
      }
    },

    function(cb) {
      var dialogModule = require(path.resolve('modules/bot/action/common/dialog'));
      var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));

      dialogModule.executeType(inRaw, inNLP, globalDialogs.userDialogType, {}, context, function(inNLP, task, matched) {
        if(matched) context.botUser.userDialogs = task.typeDoc;
        else context.botUser.userDialogs = undefined;
        cb(null);
      });
    },

    function(cb) {
      var dialogModule = require(path.resolve('modules/bot/action/common/dialog'));
      var globalDialogs = require(path.resolve('custom_modules/global/global-dialogs'));

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
      if (!val && task) val = _.get(task, p1);
      if (!val && context.dialog && context.dialog[DOC_NAME]) val = _.get(context.dialog[DOC_NAME], p1);
      if (!val && context.dialog) val = _.get(context.dialog, p1);
      if (!val && context.bot && context.bot[DOC_NAME]) val = _.get(context.bot[DOC_NAME], p1);
      if (!val && context.bot) val = _.get(context.bot, p1);
      if (!val && context.user && context.user[DOC_NAME]) val = _.get(context.user[DOC_NAME], p1);
      if (!val && context.user) val = _.get(context.user, p1);

      if (val) return val;
      else return '';

      // return p1;
    });

    out = out.replace(/%2B/g, '+');

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

//  console.log(text);


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
  typeCheck: regexpTypeCheck,
  regexp: /((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g
};

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
  typeCheck: address.addressTypeCheck
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

            // console.log(query);
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

  var nlps = context.botUser.nlp;

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

            // console.log(query);
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
      var _nlps = [];
      var excluded = [];
      for (var i = 0; i < nlps.length; i++) {
        var word = nlps[i].text;
        // if(word.length <= 1) continue;
        word = RegExp.escape(word);

        if((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, word)) {
          topicKeywords.push(nlps[i]);
        }
        if(!(format.exclude && _.includes(format.exclude, word)))
          _nlps.push(nlps[i]);
        else
          excluded.push(nlps[i]);
      }

      if((!context.bot.dialogsetOption || context.bot.dialogsetOption.useContext !== false) && context.botUser.contexts && context.botUser.contexts.length > 0) {
        topicKeywords = [];
        for(var j = 0; j < context.botUser.contexts.length; j++)
          if(context.botUser.contexts[j].name) topicKeywords.push({text: context.botUser.contexts[j].name, pos: 'Noun'});
        console.log('topicKeywords: contexts ' + topicKeywords);
      } else if((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && topicKeywords.length == 0 && context.botUser.topic && context.botUser.topic.length > 0) {
        topicKeywords = context.botUser.topic;
        console.log('topicKeywords: topic ' + topicKeywords);
      }

      if(_nlps.length == 0) _nlps.concat(excluded);

      async.eachSeries((topicKeywords.length > 0 ? topicKeywords : _nlps), function (word, _callback){
         word = word.text ? RegExp.escape(word.text): word;

        if(false/*word.length <= 1*/) {
          _callback(null);
        } else {
          var query = {};
          if(format.mongo.queryStatic) query = format.mongo.queryStatic;
          else query = {};

          for(var j = 0; j < format.mongo.queryFields.length; j++) {
            try {
              if(!(format.exclude && _.includes(format.exclude, word))) {
                if(word.length == 1) query[format.mongo.queryFields[j]] = word;
                else query[format.mongo.queryFields[j]] = new RegExp('(?:^|\\s)' + word + '(?:$|\\s)', 'i');

              } else
                excluded.push(word);
            } catch(e) {}
          }

          if(format.query) query = utils.merge(query, format.query);

          var _query = model.find(query, format.mongo.fields, format.mongo.options);

          _query.populate('context');
          if(format.mongo.sort) _query.sort(format.mongo.sort);
          if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

          _query.lean().exec(function (err, docs) {
            nlpsCount++;

            if (err || !docs || docs.length <= 0) {
              //callback(text, inDoc);
            } else {

              for(var k = 0; k < docs.length; k++) {
                var doc = docs[k];

                var matchCount = 0, matchCount1 = 0, matchTotal = 0, matchNLP = [];
                matchedWord = '';
                var matchIndex = -1, matchMin = -1, matchMax = -1;

                var _matchCount = [], _matchCount1 = [], _matchTotal = [];
                var _matchedWord = [];
                var _matchIndex = [], _matchMin = [], _matchMax = [], _matchOrgIndex = [];
                if(Array.isArray(doc['input'])) {
                  for (var n = 0; n < doc['input'].length; n++) {
                    _matchCount[n] = 0; _matchTotal[n] = 0; _matchedWord[n] = '';
                    _matchIndex[n] = -1; _matchMin[n] = -1; _matchMax[n] = -1;
                  }
                }

                for(var l = 0; l < format.mongo.queryFields.length; l++) {
                  var bMatchTotal = false;
                  for(var m = 0; m < _nlps.length; m++) {
                    if(_nlps[m].pos == 'Josa') continue;

                    var _word = _nlps[m].text;
                    _word = RegExp.escape(_word);

                    if(Array.isArray(doc[format.mongo.queryFields[l]])) {

                      for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
                        _matchIndex[n] = doc[format.mongo.queryFields[l]][n].search(new RegExp('(?:^|\\s)' + _word + '(?:$|\\s)', 'i'));

                        if(_matchIndex[n] != -1) {
                          if(context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {_matchCount[n]++; _matchCount1[n] +=3;}
                          else if(_nlps[m].pos == 'Noun') {_matchCount[n]++;_matchCount1[n]+=2;}
                          else {_matchCount[n]++;_matchCount1[n]++;}

                          // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]][n] + ' ' +_matchCount[n]);
                          if(!bMatchTotal) {_matchTotal[n] += doc[format.mongo.queryFields[l]][n].split(' ').length; bMatchTotal = true};
                          _matchedWord[n] += nlps[m];

                          var __word = nlps[m].text;
                          __word = RegExp.escape(__word);

                          _matchOrgIndex[n] = text.search(new RegExp(__word, 'i'));
                          if(_matchOrgIndex[n] != -1 && (_matchMin[n] == -1 || _matchOrgIndex[n] < _matchMin[n])) _matchMin[n] = _matchOrgIndex[n];
                          if(_matchOrgIndex[n] != -1 && (_matchMax[n] == -1 || _matchOrgIndex[n] + nlps[m].length> _matchMax[n])) _matchMax[n] = _matchOrgIndex[n] + nlps[m].length;
                        }
                      }

                      var maxMatchIndex = 0, maxMatchedCount = 0;
                      for(var n = 0; n < doc[format.mongo.queryFields[l]].length; n++) {
                        if(_matchCount[n] > maxMatchedCount) {
                          maxMatchIndex = n;
                          maxMatchedCount = _matchCount[n];
                        }
                      }

                      matchCount = _matchCount[maxMatchIndex];
                      matchCount1 = _matchCount1[maxMatchIndex];
                      matchTotal= _matchTotal[maxMatchIndex];
                      matchedWord = _matchedWord[maxMatchIndex];
                      matchIndex = _matchIndex[maxMatchIndex];
                      matchMin = _matchMin[maxMatchIndex];
                      matchMax = _matchMax[maxMatchIndex];

                    } else {
                      matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));

                      if(matchIndex != -1) {
                        if((!context.bot.dialogsetOption || context.bot.dialogsetOption.useTopic !== false) && context.bot.topicKeywords && _.includes(context.bot.topicKeywords, _nlps[m].text)) {matchCount++; matchCount1 +=3;}
                        else if(_nlps[m].pos == 'Noun') {matchCount++; matchCount1+=2;}
                        else {matchCount++; matchCount1++;}
                        // console.log(word + ' ' + _word + ' ' + doc[format.mongo.queryFields[l]] + ' ' +matchCount);

                        if(!bMatchTotal) {matchTotal += doc[format.mongo.queryFields[l]].split(' ').length;bMatchTotal = true;}
                        matchedWord += nlps[m];
                        matchNLP.push({text: _nlps[m].text, pos: _nlps[m].pos});

                        // console.log(l + ',' + doc[format.mongo.queryFields[l]] + ', ' + matchCount + ',' + matchTotal);

                        var __word = nlps[m].text;
                        __word = RegExp.escape(__word);

                        var matchOrgIndex = text.search(new RegExp(__word, 'i'));
                        if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                        if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + nlps[m].length> matchMax)) matchMax = matchOrgIndex + nlps[m].length;
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

                if(!format.mongo.minMatch || matchCount >= format.mongo.minMatch) {
                  var bExist = false;
                  for(var l = 0; l < matchedDoc.length; l++) {
                    if((Array.isArray(doc.input) && doc.input[maxMatchIndex] == matchedDoc[l].input) ||
                      (doc.input == matchedDoc[l].input)) {
                      bExist = true;
                      break;
                    }
                  }

                  if(!bExist &&
                    ((nlps.length <= 2 && (matchCount == matchTotal ||
                    (matchCount / nlpMatchLength >= format.matchRate || matchCount1 >= format.matchCount))) ||
                    (nlps.length > 2 && (matchCount / nlpMatchLength >= format.matchRate ||
                    matchCount1 >= format.matchCount)))) {
                    if(Array.isArray(doc.input)) doc.input = doc.input[maxMatchIndex];
                    doc.inputLen = doc.input.split(' ').length;
                    doc.matchWord = matchedWord;
                    doc.matchCount = matchCount1;
                    doc.matchNLP = matchNLP;
                    doc.matchMin = matchMin;
                    doc.matchMax = matchMax;
                    doc.matchRate = matchCount / nlpMatchLength;
                    // doc.matchRate = matchCount / matchTotal;

                    matchedDoc.push(doc);
                  }
                }
              }
            }

            _callback(null);
          });
        }
        // var word = nlps[i];
      }, function(err) {
        if(matchedDoc.length > 0) _cb(true);
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