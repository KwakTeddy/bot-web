'use strict'

exports.processInput = function(text, callback) {
  var json = {}

  commonFormat(text, json, callback);

}


function commonFormat(text, json, callback) {
  text = text.replace(/([\d,]+[십백천만억원]+)/g, function(match, p1, offset, string) {
    if(json.amount) {
      if(Array.isArray(json.amout)) json.amount.push(p1);
      else json.amount = [json.amout];
    } else {
      json.amount = p1;
    }

    return '{$amount}';
  });

  text = text.replace(/\b((?:010-\d{4}|01[1|6|7|8|9][-.]?\d{3,4})[-.]?\d{4})\b/g, function(match, p1, offset, string) {
    if(json.$mobile) {
      if(Array.isArray(json.$mobile)) json.$mobile.push(p1);
      else json.$mobile = [json.$mobile, p1];
    } else {
      json.$mobile = p1;
    }

    return '{$mobile}';
  });

  text = text.replace(/\b((?:0(?:2|3[0-3]|4[1-4]|5[0-5]|6[0-4]|70|80))[-.]?\d{3,4}[-.]?\d{4})\b/g, function(match, p1, offset, string) {
    if(json.phone) {
      if(Array.isArray(json.phone)) json.phone.push(p1);
      else json.phone = [json.phone, p1];
    } else {
      json.phone = p1;
    }

    return '{$phone}';
  });


//text = text.replace(/(\b\d{3}[-.]?\d{4}[-.]?\d{4}\b)/g, function(match, p1, offset, string) {
//	json.phone = p1;
//	return '{$phone}';
//});


  text = text.replace(/(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g, function(match, p1, offset, string) {
    if(json.date) {
      if(Array.isArray(json.date)) json.date.push(p1);
      else json.date = [json.date];
    } else {
      json.date = p1;
    }

    return '{$date}';
  });


  text = text.replace(/((?:[01][0-9]|2[0-3]|[1-9])[:시][ ]?(?:[0-5][0-9]|[1-9])[분]?)/g, function(match, p1, offset, string) {
    if(json.time) {
      if(Array.isArray(json.time)) json.time.push(p1);
      else json.time = [json.time];
    } else {
      json.time = p1;
    }

    return '{$time}';
  });


  text = text.replace(/(\b[\d-]+\b)/g, function(match, p1, offset, string) {
    if(json.account) {
      if(Array.isArray(json.account)) json.account.push(p1);
      else json.account = [json.account];
    } else {
      json.account = p1;
    }

    return '{$account}';
  });


  callback(text, json);
}


exports.execAction = function(resJson, callback) {
  var action = require('../../action/common/' + resJson.action);

  if(action) {
    action.execute(resJson.params, function(json) {
      if(callback) callback(processOutput(json, resJson.text));
    });
  }
}


function processOutput(json, text) {

  function replacer(match, p1, offset, string) {
    var val = eval('json.' + p1);
    if(val) return val;
    else return p1;
  }

  if(text) return text.replace(/\{\$([\w\d-_\.]+)\}/g, replacer);
  else text;
}

exports.processOutput = processOutput;

