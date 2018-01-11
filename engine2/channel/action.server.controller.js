'use strict'

var nlp = require('../../engine2/nlp/processor');

const TAG_START = '\\+';
const TAG_END = '\\+';
const ARRAY_TAG_START = '#';
const ARRAY_TAG_END = '#';
const IN_TAG_START = '{';
const IN_TAG_END = '}';

const DOC_NAME = 'doc';


exports.processInput = function(botName, user, text, callback) {
  if(text.startsWith(":")) {
    callback(text, null);
    return;
  }

  var json = {}

  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: true     // (optional default: false)
  });

  commonFormat(text, json, function(inText, inJson) {
    nlpKo.tokenizeToStrings(inText, function(err, result) {
      var nlpText =result.join(' ');

      nlpText = nlpText.replace(/(?:\{ | \})/g, '+');

      callback(nlpText, inJson);
    }) // async
  })
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

function processOutput(inJson, outJson, text) {
  try {
    //if (outJson.preText) text = outJson.preText + "\r\n" + text;
    //else if (outJson.pretext) text = outJson.pretext + "\r\n" + text;
    //
    //if (outJson.postText) text = text + "\r\n" + outJson.postText;
    //else if (outJson.posttext) text = text + "\r\n" + outJson.posttext;

    var re = new RegExp(ARRAY_TAG_START + "([\\w\\d-_\\.]*)" + ARRAY_TAG_START + "([^" + ARRAY_TAG_END + "]*)" + ARRAY_TAG_END, "g");
    var re2 = new RegExp(TAG_START + "([\\w\\d-_\\.]+)" + TAG_END, "g");

    //text = text.replace(/\\#/g, "%23");

    text = text.replace(re, function (match, p1, p2, offset, string) {
      var val;
      if (outJson && outJson[DOC_NAME]) {
        if(p1 == '') val = outJson[DOC_NAME];
        else  val = eval('(' + 'outJson.' + DOC_NAME + '.' + p1 + ')');
      }
      if (!val && inJson) val = eval('(' + 'inJson.' + p1 + ')');

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

    text = text.replace(re2, function replacer(match, p1, offset, string) {
      var val;
      if (outJson && outJson[DOC_NAME]) val = eval('(' + 'outJson.' + DOC_NAME + '.' + p1 + ')');
      if (!val && outJson) val = eval('(' + 'outJson.' + p1 + ')');
      if (!val && inJson) val = eval('(' + 'inJson.' + p1 + ')');

      if (val) return val;

      return p1;
    });

  } catch(e) {
    console.log("processOutput:error: " + e);
  }

  return text;
}

exports.processOutput = processOutput;


function processButtons(inJson, outJson, text) {
  var re = new RegExp(ARRAY_TAG_START + "([\\w]*)" + ARRAY_TAG_START + "([^" + ARRAY_TAG_END +"]*)" + ARRAY_TAG_END, "g");
  var re2 = new RegExp(TAG_START + "([\\w\\d-_\\.]+)" + TAG_END, "g");

  //text = text.replace(/\\#/g, "%23");

//  console.log(text);

  var formatArray = [];

  text = text.replace(re, function(match, p1, p2, offset, string) {
    var val = eval('('+'outJson.' + p1+')');
    if(!val) val = eval('('+'inJson.' + p1+')');

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

exports.chatserverEscape = chatserverEscape;


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

exports.execute = execute;
function execute(botName, user, text, inJson, successCallback, errorCallback) {
  var outJson = null;

  text = chatserverEscape(text);

  try {
    outJson = JSON.parse(text);
  } catch (e) {
    if(text.startsWith("{")) console.log("acton.server.controller:execute>> action JSON 포맷 오류\n" + text);
  }

  if (outJson && typeof outJson == 'object') {
    executeJson(outJson.action, botName, user, inJson, outJson, successCallback, errorCallback);
  } else {
    if(successCallback) successCallback(processOutput(inJson, null, text));

    return false;
  }
}

function executeJson(action, botName, user, inJson, outJson, successCallback, errorCallback) {
  var action = findModule(outJson, botName);

  if(action) {

    var params = outJson.template && outJson.template.params ? outJson.template.params : outJson.params;
    if(params) {
      for(var i = 0; i < params.length; i++) {
        if(!outJson[params[i].name]) {
          global.users[user].pendingCallback = function(_text) {
            outJson[params[i].name] = _text;

            global.users[user].pendingCallback = null;
            executeJson(outJson.action, botName, user, inJson, outJson, successCallback, errorCallback);
          };

          if(successCallback) successCallback(params[i].question);
          return;
        }
      }
    }

    var preCallback = outJson.template && outJson.template.preCallback ? outJson.template.preCallback : outJson.preCallback;
    var postCallback = outJson.template && outJson.template.postCallback ? outJson.template.postCallback : outJson.postCallback;

    var _successCallback = function(json) {
      if(typeof json.buttons === "string") {
        json.buttons = processButtons(inJson, json, json.buttons);
      }

      if(postCallback) {
        postCallback(outJson, json, function(_json) {
          if(successCallback) successCallback(processOutput(inJson, _json, _json.content), inJson, _json);
        });
      } else {
        if(successCallback) successCallback(processOutput(inJson, json, json.content), inJson, json);
      }

    };

    var _errorCallback = function(errorJson) {
      if(errorCallback) errorCallback(processOutput(errorJson, null, json.content), inJson, json);
      else console.log("execAction:" + outJson.module + "." + outJson.action + ": error: " + errorJson);
    };

    if(preCallback) {
      preCallback(outJson, outJson, function(_json) {
        action.execute(outJson.action, botName, user, inJson, _json, _successCallback, _errorCallback, _json.template);
      });
    } else {
      action.execute(outJson.action, botName, user, inJson, outJson, _successCallback, _errorCallback, outJson.template);
    }

    return true;
  } else {
    return false;
  }

}


exports.findModule = findModule;

function findModule(outJson, botName) {
  var action;

  if(!outJson.module) {
    // bot action
    try {
      action = require('../../../../custom_modules/' + botName + '/' + botName);
    } catch(err) {
      //console.log("error loading custom module: " + botName + "/" + botName);
    }
  } else {
    //template action
    var templateModule;
    try {
      templateModule = require('../../../../custom_modules/' + botName + '/' + outJson.module);

      if(templateModule) {
        if(templateModule[outJson.action]) {
          outJson.template = clone(templateModule[outJson.action]);
          outJson.templateAction = outJson.action;
          outJson.module = outJson.template.module;
          outJson.action = outJson.template.action;

          action = require('../../action/common/' + outJson.module);
        } else {
          action = templateModule;
        }
      }
    } catch(err) {
      //console.log("error loading custom module: " + botName + "/" + outJson.module + '/' + outJson.action);
    }

    // common action
    if(!action) {
      try {
        action = require('../../action/common/' + outJson.module);
      } catch(e) {
        //console.log("error loading common module: " + outJson.module);
        //console.log("error loading common module: " + e);
      }
    }
  }

  return action;
}

if (typeof JSON.clone !== "function")
{
  JSON.clone = function(obj)
  {
    return JSON.parse(JSON.stringify(obj));
  };
}

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return obj;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}
