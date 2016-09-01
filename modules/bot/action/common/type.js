'use strict'

var nlp = require('../../engine/nlp/processor');
var utils = require('./utils');

const TAG_START = '\\+';
const TAG_END = '\\+';
const ARRAY_TAG_START = '#';
const ARRAY_TAG_END = '#';
const IN_TAG_START = '{';
const IN_TAG_END = '}';

const DOC_NAME = 'doc';

exports.processInput = function(context, inText, callback) {
  if(inText.startsWith(":")) {
    callback(inText, null);
    return;
  }

  var doc = {}

  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: true     // (optional default: false)
  });

  checkTypes(inText, commonTypes, doc, context, function(inText, inDoc) {
    nlpKo.tokenizeToStrings(inText, function(err, result) {
      var nlpText =result.join(' ');

      nlpText = nlpText.replace(/(?:\{ | \})/g, '+');

      callback(nlpText, inDoc);
    }) // async

  });

  //commonFormat(inText, doc, function(inText, inDoc) {
  //  mongoDbTypeCheck(inText, productType, inDoc, context, function(inText, inDoc) {
  //
  //    nlpKo.tokenizeToStrings(inText, function(err, result) {
  //      var nlpText =result.join(' ');
  //
  //      nlpText = nlpText.replace(/(?:\{ | \})/g, '+');
  //
  //      callback(nlpText, inDoc);
  //    }) // async
  //
  //  });
  //})
}


function commonFormat(text, json, callback) {
  text = text.replace(/([\d,]+[십백천만억원]+)/g, function(match, p1, offset, string) {
    if(json.amount) {
      if(Array.isArray(json.amout)) json.amount.push(p1);
      else json.amount = [json.amout];
    } else {
      json.amount = p1;
    }

    return IN_TAG_START + 'amount' + IN_TAG_END;
  });

  text = text.replace(/\b((?:010-\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g, function(match, p1, offset, string) {
    if(json.$mobile) {
      if(Array.isArray(json.$mobile)) json.$mobile.push(p1);
      else json.$mobile = [json.$mobile, p1];
    } else {
      json.$mobile = p1;
    }

    return IN_TAG_START + 'mobile' + IN_TAG_END;
  });

  text = text.replace(/\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g, function(match, p1, offset, string) {
    if(json.phone) {
      if(Array.isArray(json.phone)) json.phone.push(p1);
      else json.phone = [json.phone, p1];
    } else {
      json.phone = p1;
    }

    return IN_TAG_START + 'phone' + IN_TAG_END;
  });


//text = text.replace(/(\b\d{3}[-.]?\d{4}[-.]?\d{4}\b)/g, function(match, p1, offset, string) {
//	json.phone = p1;
//	return IN_TAG_START + $phone + IN_TAG_END;
//});


  text = text.replace(/(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g, function(match, p1, offset, string) {
    if(json.date) {
      if(Array.isArray(json.date)) json.date.push(p1);
      else json.date = [json.date];
    } else {
      json.date = p1;
    }

    return IN_TAG_START + 'date' + IN_TAG_END;
  });


  text = text.replace(/((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g, function(match, p1, offset, string) {
    if(json.time) {
      if(Array.isArray(json.time)) json.time.push(p1);
      else json.time = [json.time];
    } else {
      json.time = p1;
    }

    return IN_TAG_START + 'time' + IN_TAG_END;
  });


  text = text.replace(/(\b[\d-]+-[\d-]+\b)/g, function(match, p1, offset, string) {
    if(json.account) {
      if(Array.isArray(json.account)) json.account.push(p1);
      else json.account = [json.account];
    } else {
      json.account = p1;
    }

    return IN_TAG_START + 'account' + IN_TAG_END;
  });

  //text = text.replace(/(\b[\d]+\b)/g, function(match, p1, offset, string) {
  //  if(json.account) {
  //    if(Array.isArray(json.account)) json.account.push(p1);
  //    else json.account = [json.account];
  //  } else {
  //    json.account = p1;
  //  }
  //
  //  return IN_TAG_START + 'number' + IN_TAG_END;
  //});

  callback(text, json);
}

exports.processOutput = processOutput;

function processOutput(task, context, out) {
  try {
    if (task.preText) out = task.preText + "\r\n" + out;
    else if (task.pretext) out = task.pretext + "\r\n" + out;

    if (task.postText) out = out + "\r\n" + task.postText;
    else if (task.posttext) out = out + "\r\n" + task.posttext;

    var re = new RegExp(ARRAY_TAG_START + "([\\w\\d-_\\.]*)" + ARRAY_TAG_START + "([^" + ARRAY_TAG_END + "]*)" + ARRAY_TAG_END, "g");
    var re2 = new RegExp(TAG_START + "([\\w\\d-_\\.]+)" + TAG_END, "g");

    //text = text.replace(/\\#/g, "%23");

    out = out.replace(re, function (match, p1, p2, offset, string) {
      var val;
      if (task && task[DOC_NAME]) {
        if(p1 == '') val = task[DOC_NAME];
        else  val = eval('(' + 'task.' + DOC_NAME + '.' + p1 + ')');
      }

      if (val && Array.isArray(val)) {
        var formatArray = [];

        p2 = p2.replace(/%23/g, "#");

        p2.replace(re2, function (match1, p11, offset1, string1) {
          for (var i = 0; i < val.length; i++) {
            var val1 = val[i][p11];

            if (val1) {
              if (!(formatArray[i])) formatArray[i] = string1;
              formatArray[i] = formatArray[i].replace(match1, val1);
            } else if(p11 == 'index') {
              if (!(formatArray[i])) formatArray[i] = string1;
              formatArray[i] = formatArray[i].replace(match1, (i+1));
            }
          }

          return match1;
        });

        return formatArray.join('');
      }

      return p1;
    });

    out = out.replace(re2, function replacer(match, p1, offset, string) {
      var val;
      if (task && task[DOC_NAME]) val = eval('(' + 'task.' + DOC_NAME + '.' + p1 + ')');
      if (!val && task) val = eval('(' + 'task.' + p1 + ')');

      if (val) return val;

      return p1;
    });

  } catch(e) {
    console.log("processOutput:error: " + e);
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
  else if (_text.startsWith("일") || _text.startsWith("처") || _text.startsWith("첫")) _text = "1";
  else if (_text.startsWith("이") || _text.startsWith("두") || _text.startsWith("둘")) _text = "2";
  else if (_text.startsWith("삼") || _text.startsWith("세") || _text.startsWith("셋")) _text = "3";
  else if (_text.startsWith("사") || _text.startsWith("네") || _text.startsWith("넷")) _text = "4";
  else if (_text.startsWith("오") || _text.startsWith("다섯")) _text = "5";
  else if (_text.startsWith("육") || _text.startsWith("여섯")) _text = "6";
  else if (_text.startsWith("칠") || _text.startsWith("일곱")) _text = "7";
  else if (_text.startsWith("팔") || _text.startsWith("여덟")) _text = "8";
  else if (_text.startsWith("구") || _text.startsWith("아홉")) _text = "9";

  return _text;
}

var regexpTypeCheck = function (text, type, task, context, callback) {
  var re = type.regexp;
  var matched = false;

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

  callback(text, task, matched);
};

var amountType = {
  name: 'account',
  typeCheck: regexpTypeCheck,
  regexp: /([\d,]+[십백천만억원]+)/g
};

var mobileType = {
  name: 'mobile',
  typeCheck: regexpTypeCheck,
  regexp: /\b((?:010-\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g,
  required: function(text, type, inDoc, context) {
    if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
    else if(text.length < 13) return '자리수가 맞지 않습니다';
    else return '휴대폰전화번호 형식으로 입력해 주세요';
  }
};

exports.mobileType = mobileType;

var phoneType = {
  name: 'phone',
  typeCheck: regexpTypeCheck,
  regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
};

var dateType = {
  name: 'date',
  typeCheck: regexpTypeCheck,
  regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
};

var timeType = {
  name: 'time',
  typeCheck: regexpTypeCheck,
  regexp: /((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g
};

var accountType = {
  name: 'account',
  typeCheck: regexpTypeCheck,
  regexp: /(\b[\d-]+-[\d-]+\b)/g
};

var countType = {
  name: 'count',
  typeCheck: regexpTypeCheck,
  regexp: /(\d)\s?(?:개)/g
};

exports.countType = countType;

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
    required: function(text, type, inDoc, context) {
      return '금융상품이 존재하지 않습니다';
    }
  }
}

var lotteriaMenuType = {
  typeCheck: mongoDbTypeCheck,
  mongo: {
    model: 'lotteriaMenu',
    queryFields: ['title'],
    //query: {},
    //sort: "-rate1",
    limit: 5,
    minMatch: 2,
    required: function(text, type, inDoc, context) {
      return '말씀하신 메뉴를 찾을 수 없습니다.';
    }
  }
}

exports.lotteriaMenuType = lotteriaMenuType;


var mongoose = require('mongoose');

exports.customMongoDBFormat = mongoDbTypeCheck;

function mongoDbTypeCheck(text, format, inDoc, context, callback) {
  var model;
  if (mongoose.models[format.mongo.model]) {
    model = mongoose.model(format.mongo.model);
  } else {
    model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
  }

  var bestDoc;
  var words = text.split(' '), wordsCount = 0;
  for(var i = 0 ; i < words.length; i++) {
    var word = words[i];

    var query = {};
    for(var j = 0; j < format.mongo.queryFields.length; j++) {
      query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
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
              matchIndex = doc[format.mongo.queryFields[l]].indexOf(words[m]);

              if(matchIndex != -1) {
                matchCount++;

                var matchOrgIndex = text.indexOf(words[m]);
                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
              }
            }
          }

          if((!bestDoc || bestDoc.matchCount < matchCount) && matchCount >= format.mongo.minMatch) {
            bestDoc = doc;
            bestDoc.matchCount = matchCount;
            bestDoc.matchMin = matchMin;
            bestDoc.matchMax = matchMax;
          }
        }
      }

      if(wordsCount >= words.length) {
        if(bestDoc) {
          var matchedText = '';
          for(var l = 0; l < format.mongo.queryFields.length; l++) {
            var _text = bestDoc[format.mongo.queryFields[l]]
            if(matchedText == '') matchedText = matchedText.concat(_text);
            else matchedText = matchedText.concat(' ', _text);
          }

          var matchedOriginal = text.substring(bestDoc.matchMin, bestDoc.matchMax);
          text = text.replace(matchedOriginal, IN_TAG_START + format.name + IN_TAG_END);

          if(inDoc['_'+format.name]) {
            if(Array.isArray(inDoc['_'+format.name])) inDoc['_'+format.name].push(matchedOriginal);
            else inDoc['_'+format.name] = [inDoc['_'+format.name], matchedOriginal];
          } else {
            inDoc['_'+format.name] = matchedOriginal;
          }

          if(inDoc[format.name]) {
            if(Array.isArray(inDoc[format.name])) inDoc[format.name].push(matchedText);
            else inDoc[format.name] = [inDoc[format.name], matchedText];
          } else {
            inDoc[format.name] = matchedText;
          }

          callback(text, inDoc, true);
        } else {
          callback(text, inDoc, false);
        }
      }

    });
  }

}


var commonTypes = [
  amountType,
  mobileType,
  phoneType,
  dateType,
  timeType,
  accountType,
  productType
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

  //var typeModule = findType(type, context);
  //
  //if(typeModule) {
  //  typeModule[type.typeCheck](text, type, inDoc, context, successCallback);
  //} else {
  //  successCallback(text, inDoc);
  //}
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
  typeCheck: addressTypeCheck
}

exports.addressType= addressType;

const ADDRESS_KEY = 'U01TX0FVVEgyMDE2MDgyODEwMjEyMDE0ODU1';

function addressTypeCheck(text, type, task, context, callback) {
  var userTokens = text.split(' ');
  var tmpTokens = utils.clone(userTokens);
  var addrPart, addrDetail;
  for(var i = tmpTokens.length - 1; i >= 0; i--) {
    if(tmpTokens[i].endsWith('길') || tmpTokens[i].endsWith('로')) {
      addrPart = tmpTokens.splice(0, i+2).join(' ');
      addrDetail = tmpTokens.join(' ');
      break;
    } else if(tmpTokens[i].search(/^[^\d].*동$/g) != -1 || userTokens[i].endsWith('리')) {
      addrPart = tmpTokens.splice(0, i+2).join(' ');
      addrDetail = tmpTokens.join(' ');
      break;
    }
  }

  task.addressOrg = {};
  task.addressOrg.address = text;
  task.addressOrg.addrTokens = userTokens;
  task.addressOrg.addrPart = addrPart;
  task.addressOrg.addrDetail = addrDetail;
  task.addressOrg.detailToken = tmpTokens;

  if(!addrPart) {
    type.message = context.global.messages.typeAddress;
    return;
  }

  var http = require('./http');
  var httpTask = {
    action: 'xml',
    url: 'http://www.juso.go.kr',
    path: '/addrlink/addrLinkApi.do',
    param: {confmKey: ADDRESS_KEY, currentPage: 1, countPerPage: 30, keyword: addrPart}
  };

  http.execute(httpTask, context, function(_task, context) {
    if(_task.doc.results.common.totalCount == 0) {
      type.message = context.global.messages.typeAddressCheck1;
    } else {
      var addr;
      if(_task.doc.results.juso instanceof Array) {
        addr = _task.doc.results.juso[0];
      } else {
        addr = _task.doc.results.juso;
      }

      task.address = {};
      task.addressJibun = {};

      task.address.address = addr.roadAddr;
      task.address.roadAddrPart1 = addr.roadAddrPart1;
      task.address.roadAddrPart2 = addr.roadAddrPart2;
      task.address.zipNo = addr.zipNo;

      task.addressJibun.address = addr.jibunAddr;
      task.addressJibun.zipNo = addr.zipNo;

      var jusoToken = addr.jibunAddr.split(' ');
      var roadToken = addr.roadAddrPart1.split(' ');
      if(jusoToken[0].endsWith('시')) {
        task.addressJibun.sido = jusoToken[0];
        task.addressJibun.sigungu = jusoToken[1];
        task.addressJibun.dong = jusoToken[2];
        task.addressJibun.bungi = jusoToken[4];
        task.addressJibun.building = jusoToken[5];

        task.address.sido = roadToken[0];
        task.address.sigungu = roadToken[1];
        task.address.road = roadToken[2];
        task.address.roadNum = roadToken[3];
      } else {
        if (jusoToken[1].endsWith('시')) {
          task.addressJibun.sido = jusoToken[0];
          // 현재 도로명주소 API 비정상으로 나오고 있음
          // task.addressJibun.sigungu = jusoToken[1] + ' ' + jusoToken[2];
          // task.addressJibun.dong = jusoToken[3];
          task.addressJibun.sigungu = jusoToken[1];
          task.addressJibun.dong = jusoToken[2];
          task.addressJibun.bungi = jusoToken[4];
          task.addressJibun.building = jusoToken[5];

          task.address.sido = roadToken[0];
          task.address.sigungu = roadToken[1] + ' ' + roadToken[2];;
          task.address.road = roadToken[3];
          task.address.roadNum = roadToken[4];

        } else if (jusoToken[1].endsWith('군')) {
          task.addressJibun.sido = jusoToken[0];
          task.addressJibun.sigungu = jusoToken[1];
          task.addressJibun.dong = jusoToken[2];
          task.addressJibun.bungi = jusoToken[4];
          task.addressJibun.building = jusoToken[5];

          task.address.sido = roadToken[0];
          task.address.sigungu = roadToken[1];
          task.address.road = roadToken[2];
          task.address.roadNum = roadToken[3];
        }
      }

      for(var i = 0; i < tmpTokens.length; i++) {
        if(task.addressJibun.address.indexOf(tmpTokens[i]) == -1) {
          task.addressJibun.detail = tmpTokens.slice(i).join(' ');
          task.addressJibun.address += ' ' + task.addressJibun.detail;
          break;
        }
      }

      // 주소 API 에서 동이 안나오는 오류 임시 처리

      var sigu = task.addressJibun.sigungu.split(' ');
      if(sigu.length == 1 && sigu[0].endsWith('시')) {
        for(var i = 0; i < userTokens.length; i++) {
          if(userTokens[i].search(/^[^\d].*구$/g) != -1) {
            task.addressJibun.sigungu += ' ' + userTokens[i];
            break;
          }
        }
      }

      task.address.detail = task.addressJibun.detail;
      task.address.address = addr.roadAddrPart1 + ', ' + task.address.detail + addr.roadAddrPart2;

      console.log(JSON.stringify(task.address));
      console.log(JSON.stringify(task.addressJibun));

      callback(text, task, true);
    }
  });
}


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

exports.numberType= numberType;

function numberTypeCheck(text, type, task, context, callback) {
  if(text.search(/^(\d)+$/g) != -1) {
    task[type.name] = text;
    callback(text, task, true);
  } else {
    callback(text, task, false);
  }
}