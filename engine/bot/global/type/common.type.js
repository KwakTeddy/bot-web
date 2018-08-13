var path = require('path');
var utils = require(path.resolve('engine/bot/action/common/utils'));
var globals = require(path.resolve('engine/bot/engine/common/globals'));
var typelib = require(path.resolve('engine/bot/action/common/type'));
var logger = require(path.resolve('config/lib/logger'));
var globals = require(path.resolve('engine/bot/engine/common/globals'));

function numberListTypeCheck(text, type, task, context, callback) {
  var num = Number(text);

  if (task[type.name] && num >= 1 && num <= task[type.name].length) {
    context.dialog[type.name] = task[type.name] = task[type.name][num - 1];

    // TODO 목록 선택시 텍스트 변경
    // if (task.in && task[paramDef.name]['matchOriginal']) {
    //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
    //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
    // }

    callback(text, task, true);
  } else if (context.dialog[type.name] && num >= 1 && num <= context.dialog[type.name].length) {
    context.dialog[type.name] = task[type.name] = context.dialog[type.name][num - 1];

    callback(text, task, true);
  } else {
    callback(text, task, false);
  }
}

exports.numberListTypeCheck = numberListTypeCheck;
globals.setGlobalTypeCheck('numberListTypeCheck', numberListTypeCheck);

function listTypeCheck(text, type, task, context, callback) {
  var inRawText = text.replace(/\s/g, '');

  var listName;
  if(type.listName) listName = type.listName;
  else listName= type.name;
  var list = (task[listName] ? task[listName] : context.dialog[listName]);

  for (var j = 0; list && j < list.length; j++) {
    var item;
    if(type.field) item = list[j][type.field];
    else if(list[j]['name']) item = list[j]['name'];
    else if(typeof list[j] == 'string') item = list[j];
    else continue;

    if(item) {
      item = item.replace(' ', '');

      var re = new RegExp(inRawText, 'i');
      if(item.search(re) != -1) {
        context.dialog[type.name] = /*task[type.name] = */list[j];

        callback(text, task, true);
        return;
      }
    }
  }

  var words = text.split(' ');
  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    var _num = Number(word);

    if(!_num) {
      _num = Number(typelib.parseNumber(word));
    }

    var num;
    if(context.dialog.page) {
      num = (context.dialog.page - 1) * typelib.LIST_PER_PAGE + _num;
    } else {
      num = _num;
    }

    list = (task[listName] ? task[listName] : context.dialog[listName]);
    if(list && num >= 1 && num <= list.length) {
      context.dialog[type.name] = /*task[type.name] = */list[num - 1];

      callback(text, task, true);
      return;
    }
  }

  // list word match
  var maxEqual = false;
  var maxIndex = -1, maxCount = 0;
  var matchedList = [];
  list = (task[listName] ? task[listName] : context.dialog[listName]);
  for (var j = 0; list && j < list.length; j++) {
    var item;
    if(type.field) item = list[j][type.field];
    else if(list[j]['name']) item = list[j]['name'];
    else if(typeof list[j] == 'string') item = list[j];

    if(item) {
      var matchCount = 0;
      var words = text.split(' ');
      for (var i = 0; i < words.length; i++) {
        var word = words[i];

        if(word.length == 1) continue;
        word = RegExp.escape(word);
        // console.log(item);

        var re = new RegExp(word, 'i');
        if(item.search(re) != -1) matchCount++;
        // if(item.search(word) != -1) matchCount++;
      }

      if(matchCount > maxCount) {
        maxCount = matchCount;
        maxIndex = j;
      } else if(matchCount > 0 && matchCount == maxCount) {
        matchedList.push(list[j]);
        maxEqual = true;
      }
    }
  }

  if(maxIndex != -1 && !maxEqual) {
    context.dialog[type.name] = /*task[type.name] = */list[maxIndex];
    callback(text, task, true);
  } else if(maxIndex != -1 && maxEqual) {
    context.dialog[type.name] = matchedList;
    callback(text, task, false);
  } else
    callback(text, task, false);
}

exports.listTypeCheck = listTypeCheck;
globals.setGlobalTypeCheck('listTypeCheck', listTypeCheck);


function regexpTypeCheck(text, type, task, context, callback) {
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

    return typelib.IN_TAG_START + type.name + typelib.IN_TAG_END;
  });

  if(matched)
    logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

  callback(text, task, matched);
}

globals.setGlobalTypeCheck('regexpTypeCheck', regexpTypeCheck);

var amountType = {
  name: 'account',
  typeCheck: regexpTypeCheck,
  regexp: /([\d,]+[십백천만억원]+)/g
};

globals.setGlobalType('amountType', amountType);

var mobileType = {
  name: 'mobile',
  raw: true,
  typeCheck: regexpTypeCheck,
  regexp: /\b((?:010-\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g,
  checkRequired: function(text, type, inDoc, context) {
    if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
    else if(text.length < 13) return '자리수가 맞지 않습니다';
    else return '휴대폰전화번호 형식으로 입력해 주세요';
  }
};

globals.setGlobalType('mobileType', mobileType);

var phoneType = {
  name: 'phone',
  typeCheck: regexpTypeCheck,
  regexp: /\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g
};

globals.setGlobalType('phoneType', phoneType);

var dateType = {
  name: 'date',
  typeCheck: regexpTypeCheck,
  regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
};

globals.setGlobalType('dateType', dateType);

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

globals.setGlobalType('accountType', accountType);

var countType = {
  name: 'count',
  typeCheck: regexpTypeCheck,
  regexp: /(\d)\s?(?:개)/g
};

globals.setGlobalType('countType', countType);
