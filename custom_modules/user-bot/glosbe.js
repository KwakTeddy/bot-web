var request = require('request');

var commonHeaders = {"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  // "Accept-Encoding":"gzip, deflate, sdch",
  // "Accept-Language":"en-US,en;q=0.8,ko;q=0.6",
  "Cache-Control":"max-age=0",
  "Connection":"keep-alive",
  "User-Agent":"Athena Chatbot - Moneybrain Inc."
};

function dicAction(task, context, callback) {
  var query = task['1'];
  var to = task['2'];
  console.log(task['1'] + ' ' + task['2']);
  var _from, _to;
  if(to == '영어') {_from = 'kor'; _to = 'eng';}
  if(to == '한국어' || to == '한글') {_from = 'eng'; _to = 'kor';}

  console.log(query + ' ' + to + ' ' +  _from + ' ' +  _to);
  simpleDic(_from, _to, query, function(err, result){
    console.log(result);
    if(err){
      console.log("An error occurred error=%s", err);
      task.error = err;
      task.result = '글쎄, 그런 말은 없는 것 같은데'
    } else {
      if(result) {
        task.result = result
      } else {
        task.error = 'no result';
        task.result = '글쎄, 그런 말은 없는 것 같은데'
      }
    }

    callback(task, context);
  });
}

module.exports.dicAction = dicAction;

function simpleDic(from, to, query, callback) {
  // https://glosbe.com/gapi/translate?from=eng&dest=kor&format=json&phrase=apple&pretty=true

  var options = {
    method: 'GET',
    uri: 'https://glosbe.com/gapi/translate',
    headers: commonHeaders,
    followAllRedirects: true,
    qs: {
      from: from, dest: to, phrase: query,
      format: 'json', pretty: 'true'
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      var jsonData = JSON.parse(body);
      if(jsonData.result == 'ok' && jsonData.tuc && jsonData.tuc.length > 0) {
        callback(null, jsonData.tuc[0].phrase.text)
      } else {
        callback(error, null);
      }
    } else if(error) {
      callback(error, null);
    }
  });
}

module.exports.simpleDic = simpleDic;

