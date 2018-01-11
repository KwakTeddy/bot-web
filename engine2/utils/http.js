var path = require('path');
var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var utils = require('./utils');
var tough = require('tough-cookie');
var charset = require('charset');
var _ = require('lodash');

var commonHeaders = {"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  // "Accept-Encoding":"gzip, deflate, sdch",
  "Accept-Language":"en-US,en;q=0.8,ko;q=0.6",
  "Cache-Control":"max-age=0",
  "Connection":"keep-alive",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
};

var xmldomErrorHandler = {
  warning: function(w) {},
  error: function(e) {},
  fatalError: function(e) {}
};

const DOC_NAME = 'doc';
const PAGES_NAME = 'pages';
const CURRENT_PAGE_NAME = 'currentPage';
exports.DOC_NAME = DOC_NAME;
exports.PAGES_NAME = PAGES_NAME;
exports.CURRENTPAGE_NAME = CURRENT_PAGE_NAME;


function execute(task, context, successCallback, errorCallback) {
  var options;
  var cookiejar = context.user.cookie;
  var type = utils.requireNoCache(path.resolve('./engine2/bot/action/common/type'));

  console.log('\n' + 'http.js:action ' +  + (task.method ? task.method : '') + ' ' +
      task.url + task.path);
  if(task.param) console.log('task.param: ' + JSON.stringify(task.param, null, 2));

  var xmldomErrorHandler = {
    warning: function(w) {},
    error: function(e) {},
    fatalError: function(e) {}
  };

  try {
    if(task.action == 'json') {

      options = {
        method: task.method,
        uri: task.url + encodeURI(task.path),
        headers: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true,
        encoding: 'binary'
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

      if (task.method && task.method.toUpperCase() == "PUT") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = false;
      }

      if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          var encoding = charset(response.headers['content-type']);
          if(encoding && encoding != 'UTF-8') {
            console.log('encoding:' + encoding);

            var Iconv  = require('iconv').Iconv;
            var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

            body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
          }

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }

          var result;
          try {
            result = JSON.parse(body);
          } catch (exception) {
            result = body;
          }

          task[DOC_NAME] = result;

          if (task.save) context.user[DOC_NAME] = task[DOC_NAME];

          if (successCallback) successCallback(task, context);

          console.log('task.' + DOC_NAME + ': ' + JSON.stringify(task[DOC_NAME], null, 2));

        } else {
          if (errorCallback) errorCallback(error, task, context);
          else console.log("[common.task.action: http." + task.action + "] error: " + error);
        }
      });
    } else if(task.action == 'xml') {
      var xml2json = require('xml2js');

      options = {
        method: task.method,
        uri: task.url + encodeURI(task.path),
        headers: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true
        // encoding: 'binary'
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

      if (task.method && task.method.toUpperCase() == "PUT") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {

          var encoding = charset(response.headers['content-type']);
          if(encoding && encoding != 'UTF-8') {
            // console.log('encoding:' + encoding);

            var Iconv  = require('iconv').Iconv;
            var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

            body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
          }

          task._text = body;

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }

          var result;
          try {
            xml2json.parseString(body, {explicitArray: false}, function(err, js) {
              result = js;
            });
          } catch (exception) {
            result = body;
          }

          task[DOC_NAME] = result;

          if (task.save) context.user[DOC_NAME] = task[DOC_NAME];

          console.log('task.' + DOC_NAME + ': ' + JSON.stringify(task[DOC_NAME], null, 2));

          if (successCallback) successCallback(task, context);

        } else {
          if (errorCallback) errorCallback(error, task, context);
          else console.log("[common.task.action: http." + task.action + "] error: " + error);
        }
      });

    } else if(task.action == 'xpathRepeat') {
      options = {
        method: task.method,
        uri: task.url  + encodeURI(task.path),
        headers: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true,
        encoding: 'binary'
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

      if(task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);

        if (!error && response.statusCode == 200) {
          var encoding = charset(response.headers['content-type']);
          if(encoding && encoding != 'UTF-8') {
            console.log('encoding:' + encoding);

            var Iconv  = require('iconv').Iconv;
            var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

            body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
          }

          console.log(body);

          task._text = body;

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }

          if(!body || !task.xpath || !task.xpath.repeat || !task.xpath.doc) {
            if(successCallback) successCallback(task, context);
          }

          var xml = body;

          var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);
          var nodes = xpath.select(task.xpath.repeat, doc)
          //var nodes = xpath.select("//ul[@class='lst_detail_t1']/li//dt/a/text()", doc)

          task[DOC_NAME] = [];
          var xpathSel;
          for(var i = 0; nodes && i < nodes.length; i++) {
            if(task.xpath.limit && i >= task.xpath.limit) break;
            task[DOC_NAME][i] = {};
            task[DOC_NAME][i]["index"] = (i+1);

            for(var j in task.xpath.doc){
              var key = j;
              var val = task.xpath.doc[j];

              //TODO 전체 문서에서 아니라 nodes[i]부터 검색하도록
              if(val.search(/\/@[\w-_]*$/g) != -1) { // @attribute
                xpathSel = xpath.select1(task.xpath.repeat + "[" + (i + 1) + "]" + val, doc);
                if(xpathSel) task[DOC_NAME][i][key] = xpathSel.value;
              } else if(val.search(/\/text\(\)$/g) != -1) {
                xpathSel = xpath.select(task.xpath.repeat + "[" + (i+1) + "]" + val, doc);
                if(xpathSel) task[DOC_NAME][i][key] =  xpathSel.toString();
              } else {
                xpathSel = xpath.select(task.xpath.repeat + "[" + (i+1) + "]" + val, doc);
                if(xpathSel) task[DOC_NAME][i][key] =  xpathSel;
              }
            }
          }

          task[PAGES_NAME] = []
          var pages = xpath.select(task.xpath.pages, doc);
          for(var i = 0; pages && i < pages.length; i++)
            task[PAGES_NAME][i] = pages[i].toString();
          task[CURRENT_PAGE_NAME] = xpath.select(task.xpath.currentPage, doc).toString();

          if(task.save) context.user[DOC_NAME] = task[DOC_NAME];

          try {
            console.log('task.' + DOC_NAME + ': ' + JSON.stringify(task[DOC_NAME], null, 2));
          } catch(e) {}

          if(successCallback) successCallback(task, context);

        } else {
          if(errorCallback) errorCallback(error, task, context);
          else console.log("[common.task.action: http." + task.action + "] error: " + error);
        }
      });

    } else if(task.action == 'xpath' || task.action == 'xpathByIndex') {
      var index = task.index ? task.index : 0;
      var selectDoc;

      if(task.action == 'xpathByIndex') {
        index = type.parseNumber(index);

        if(!context.user[DOC_NAME]) {
          throw new Error("docs not saved");
        }

        selectDoc = context.user[DOC_NAME][index - 1];
        task.path = selectDoc.path;
      }

      options = {
        method: task.method,
        uri: task.url  + task.path,
        headers: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true,
        encoding: 'binary'
       };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

      if(task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {

          var encoding = charset(response.headers['content-type']);
          if(encoding && encoding != 'UTF-8') {
            console.log('encoding:' + encoding);
            
            var Iconv  = require('iconv').Iconv;
            var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

            body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
          }

          task._text = body;

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }


          if(!body || !task.xpath || !task.xpath.doc) {
            if(successCallback) successCallback(task, context);
            return;
          }

          var xml = body;

          var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);

          task[DOC_NAME] = {};
          var xpathSel;
          for(var j in task.xpath.doc){
            var key = j;
            var val = task.xpath.doc[j];

            if(val.search(/\/@[\w-_]*$/g) != -1) { // @attribute
              xpathSel = xpath.select1(val, doc);
              if(xpathSel) task[DOC_NAME][key]= xpathSel.value;
            } else {
              xpathSel = xpath.select(val, doc);
              if(xpathSel) task[DOC_NAME][key] = xpathSel.toString();
            }
          }

          if(task.action == 'selectByIndex') context.user[DOC_NAME] = null;

          console.log('task.' + DOC_NAME + ': ' + JSON.stringify(task[DOC_NAME], null, 2));

          if(successCallback) successCallback(task, context);

        } else {
          if (errorCallback) errorCallback(error, task, context);
          else console.log("[common.task.action: http." + task.action + "] error: " + error);
        }
      });

    } else if(task.action == 'plaintext') {
      options = {
        method: task.method,
        uri: task.url + task.path,
        headers: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true,
        encoding: 'binary'
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri) + ';';

      if (task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = false;
      }

      if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

      request(options, function (error, response, body) {
        // console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          if (!body) {
            task.error = error;
            if (successCallback) successCallback(task, context);
          }

          var encoding = charset(response.headers['content-type']);
          if(encoding && encoding != 'UTF-8' && encoding != 'utf8') {
            console.log('encoding:' + encoding);

            var Iconv  = require('iconv').Iconv;
            var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

            body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
          }

          task._text = body;

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }

          task[DOC_NAME]={};
          task[DOC_NAME]['plaintext'] = body;

          if(task.regexp && task.regexp.doc) {
            for(var key in task.regexp.doc) {
              var re = task.regexp.doc[key];
              var match = re.exec(body);

              if(match) task[DOC_NAME][key] = match[1];
            }
          }

          console.log('task.' + DOC_NAME + ': ' + JSON.stringify(task[DOC_NAME], null, 2));

          if (successCallback) successCallback(task, context);

        } else {
          if (errorCallback) errorCallback(error, task, context);
          else console.log("[common.task.action: http." + task.action + "] error: " + error);
        }
      });
    } else if(task.action == 'selectByIndex') {
      var index = type.parseNumber(task.index);

      if(!context.user[DOC_NAME]) {
        throw new Error("docs not saved");
      }

      if(task.array) task[DOC_NAME] = eval('(' + 'context.user.' + DOC_NAME + '.' + task.array + '[' + (index-1) + ']' + ')');
      else task[DOC_NAME] = context.user[DOC_NAME][index - 1];

      if(successCallback) successCallback(task, context);
    }
  } catch(e) {
    console.log("[http." + task.action + "] error: " + e);
    if(errorCallback) errorCallback(e, task, context);
  }

}

exports.execute = execute;

function simpleRequest(task, context, callback) {
  var cookiejar = context.user.cookie;
  var type = utils.requireNoCache(path.resolve('./engine2/bot/action/common/type'));

  console.log('\n' + 'http.js:request: ' + (task.method ? task.method : '') + ' ' +
    (task.uri ? task.uri : task.url + task.path));

  if(task.param) console.log('task.param: ' + JSON.stringify(task.param, null, 2));

  var options = {
    method: task.method,
    uri: task.uri || (task.url  + encodeURI(task.path)),
    headers: utils.merge(commonHeaders, task.headers),
    followAllRedirects: true,
    encoding: 'binary'
  };

  // console.log(context.user.cookie.toJSON());
  options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

  if(task.method && task.method.toUpperCase() == "POST") {
    options.form = task.param;
  } else {
    options.qs = task.param;
    options.useQuerystring = true;
  }

  if(options.headers) console.log('task.headers: ' + JSON.stringify(options.headers, null, 2));

  request(options, function (error, response, body) {
    //console.log("status:" + response.statusCode);
    //console.log(body);

    if (!error && response.statusCode == 200) {
      var encoding = charset(response.headers['content-type']);
      if(encoding && encoding != 'UTF-8') {
        // console.log('encoding:' + encoding);

        var Iconv  = require('iconv').Iconv;
        var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');

        body = iconv.convert(new Buffer(body, 'binary')).toString('UTF-8');
      }

      task._text = body;

      if(response.headers['content-type'] && response.headers['content-type'].startsWith('application/json')) {
        try {
          task[DOC_NAME] = JSON.parse(body);
        } catch (exception) {
          // result = body;
        }
      } else if(task.json) {
        try {
          task[DOC_NAME] = _.get(task, JSON.parse(body));
        } catch (exception) {
          // result = body;
        }
      } else if(task.xpath) {
        var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(body);

        // task[DOC_NAME] = xpathAction(doc, task.xpath);

        if(task.xpath.doc === undefined) {
          task.doc = xpathAction(doc, task.xpath);
        } else {
          utils.merge(task, xpathAction(doc, task.xpath), true);
        }

        // if(task.xpath._repeat) {
        //   var nodes = xpath.select(task.xpath._repeat, doc)
        //
        //   task[DOC_NAME] = [];
        //   var xpathSel;
        //   for(var i = 0; nodes && i < nodes.length; i++) {
        //     var node = nodes[i];
        //     if(task.xpath.limit && i >= task.xpath.limit) break;
        //     task[DOC_NAME][i] = {};
        //     // task[DOC_NAME][i]["index"] = (i+1);
        //
        //     for(var key in task.xpath){
        //       if(key === '_repeat') continue;
        //       var val = task.xpath[key];
        //
        //       if(val.search(/\/@[\w-_]*$/g) != -1) { // @attribute
        //         xpathSel = xpath.select1(val, node);
        //         if(xpathSel) task[DOC_NAME][i][key] = xpathSel.value;
        //       } else if(val.search(/\/text\(\)$/g) != -1) {
        //         xpathSel = xpath.select(val, node);
        //         if(xpathSel) task[DOC_NAME][i][key] =  xpathSel.toString();
        //       } else {
        //         xpathSel = xpath.select(val, node);
        //         if(xpathSel) task[DOC_NAME][i][key] =  xpathSel;
        //       }
        //     }
        //   }
        // } else {
        //   task[DOC_NAME] = {};
        //   var xpathSel;
        //
        //   for(var key in task.xpath){
        //     if(key === '_repeat') continue;
        //     var val = task.xpath[key];
        //
        //     if(val.search(/\/@[\w-_]*$/g) != -1) { // @attribute
        //       xpathSel = xpath.select1(val, doc);
        //       if(xpathSel) task[DOC_NAME][key] = xpathSel.value;
        //     } else if(val.search(/\/text\(\)$/g) != -1) {
        //       xpathSel = xpath.select(val, doc);
        //       if(xpathSel) task[DOC_NAME][key] =  xpathSel.toString();
        //     } else {
        //       xpathSel = xpath.select(val, doc);
        //       if(xpathSel) task[DOC_NAME][key] =  xpathSel;
        //     }
        //   }
        // }
      }

      var cookieHeaders = response.headers['set-cookie'];
      for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
        var cookie = tough.Cookie.parse(cookieHeaders[i]);
        cookiejar.setCookie(cookie, options.uri, function() {});
      }

      callback(task, context);
    } else {
      console.log("[http.js:request] error: " + error);

      task.error = error;
      callback(error, task, context);
    }
  });
}

exports.simpleRequest = simpleRequest;


function xpathAction(doc, path, isRepeat) {
  if(path._repeat && isRepeat !== true) {
    var json = [];

    var nodes = xpath.select(path._repeat, doc);
    for(var i = 0; nodes && i < nodes.length; i++) {
      var node = nodes[i];
      if(path._limit && i >= path._limit) break;

      json.push(xpathAction(node, path, true));
    }

    return json;
  } else {
    var json = {};
    var xpathSel;

    var postXpath;
    for(var key in path){
      if(key === '_repeat') continue;
      if(key === '_postXpath') {
        postXpath = path[key];
        continue;
      }
      var val = path[key];

      if(typeof val === 'string') {
        if(val.search(/\/@[\w-_]*$/g) != -1) { // @attribute
          xpathSel = xpath.select1(val, doc);
          if(xpathSel) json[key] = xpathSel.value;
        } else if(val.search(/\/text\(\)$/g) != -1) {
          xpathSel = xpath.select(val, doc);
          if(xpathSel) json[key] =  xpathSel.toString();
        } else {
          xpathSel = xpath.select(val, doc);
          if(xpathSel) json[key] =  xpathSel;
        }
      } else if (typeof val === 'object') {
        json[key] = xpathAction(doc, val);
      }
    }

    if(postXpath) {
      json = postXpath(json, doc);
    }

    return json;
  }
}
