var path = require('path');
var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var type = require(path.resolve('./modules/bot/action/common/type'));
var utils = require('./utils');
var tough = require('tough-cookie');

var commonHeaders = {"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding":"gzip, deflate, sdch",
  "Accept-Language":"en-US,en;q=0.8,ko;q=0.6",
  "Cache-Control":"max-age=0",
  "Connection":"keep-alive",
  "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
  //"Host":"movie.naver.com",
  //"Referer":"http://movie.naver.com/movie/running/current.nhn?view=list&tab=normal&order=point",
  //Cookie":"NNB=Z7A7YI6K3C6VM; npic=2TFxXS5uGkucf441SoaWOjWGt3xlQOLQXA6gAj2ULyfoCYarS/JNdMu0RemSeCWJCA==; nx_ssl=2; nid_inf=508472080; BMR=s=1469622178956&r=http%3A%2F%2Ftvcast.naver.com%2Fspecial%2Flive%2F478%2F&r2=http%3A%2F%2Fwww.naver.com%2F; nid_iplevel=-1; page_uid=SHWcBdoRR1RssZhbNKssssssss8-160896; _naver_usersession_=U8hcxq8beczPhgYOWTWwyQ==
  //"Upgrade-Insecure-Requests":"1",
};

const DOC_NAME = 'doc';
const PAGES_NAME = 'pages';
const CURRENT_PAGE_NAME = 'currentPage';
exports.DOC_NAME = DOC_NAME;
exports.PAGES_NAME = PAGES_NAME;
exports.CURRENTPAGE_NAME = CURRENT_PAGE_NAME;

exports.execute = execute;

function execute(task, context, successCallback, errorCallback) {
  var options;
  var cookiejar = context.user.cookie;

  var xmldomErrorHandler = {
    warning: function(w) {},
    error: function(e) {},
    fatalError: function(e) {}
  };

  try {
    if(task.action == 'json') {

      options = {
        method: task.method,
        uri: task.url  + encodeURI(task.path),
        header: utils.merge(commonHeaders, task.headers),
        followAllRedirects: true
      };

      if(task.method && task.method.toUpperCase() == "PUT") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          var result;
          try {
            result = JSON.parse(body);
          } catch (exception) {
            result = body;
          }

          task[DOC_NAME] = result;

          if(task.save) context.user[DOC_NAME] = task[DOC_NAME];

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
        followAllRedirects: true
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri);

      if(task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
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
          for(var i = 0; nodes && i < nodes.length; i++) {
            if(task.xpath.limit && i >= task.xpath.limit) break;
            task[DOC_NAME][i] = {};
            task[DOC_NAME][i]["index"] = (i+1);

            for(var j in task.xpath.doc){
              var key = j;
              var val = task.xpath.doc[j];

              //TODO 전체 문서에서 아니라 nodes[i]부터 검색하도록
              if(val.search(/\/@[\w-_]*$/g) != -1)  // @attribute
                task[DOC_NAME][i][key] = xpath.select1(task.xpath.repeat + "[" + (i+1) + "]" + val, doc).value;
              else
                task[DOC_NAME][i][key] = xpath.select(task.xpath.repeat + "[" + (i+1) + "]" + val, doc).toString();
            }
          }

          task[PAGES_NAME] = []
          var pages = xpath.select(task.xpath.pages, doc);
          for(var i = 0; pages && i < pages.length; i++)
            task[PAGES_NAME][i] = pages[i].toString();
          task[CURRENT_PAGE_NAME] = xpath.select(task.xpath.currentPage, doc).toString();

          if(task.save) context.user[DOC_NAME] = task[DOC_NAME];

          console.log("xpathRepeat >> " + JSON.stringify(task[DOC_NAME]));
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
        followAllRedirects: true
      };

      if(task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
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
          for(var j in task.xpath.doc){
            var key = j;
            var val = task.xpath.doc[j];

            if(val.search(/\/@[\w-_]*$/g) != -1)  // @attribute
              task[DOC_NAME][key] = xpath.select1(val, doc).value;
            else
              task[DOC_NAME][key] = xpath.select(val, doc).toString();
          }

          if(task.action == 'selectByIndex') context.user[DOC_NAME] = null;

          console.log("xpath >> " + JSON.stringify(task[DOC_NAME]));

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
        followAllRedirects: true
      };

      options.headers['Cookie'] = cookiejar.getCookieStringSync(options.uri) + ';';

      if (task.method && task.method.toUpperCase() == "POST") {
        options.form = task.param;
      } else {
        options.qs = task.param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        // console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          if (!body) {
            task.error = error;
            if (successCallback) successCallback(task, context);
          }

          task._text = body;

          var cookieHeaders = response.headers['set-cookie'];
          for(var i = 0; cookieHeaders && i < cookieHeaders.length; i++) {
            var cookie = tough.Cookie.parse(cookieHeaders[i]);
            cookiejar.setCookie(cookie, options.uri, function() {});
          }

          //body = 'jQuery18200016291653109714588_1470820544969({"seq":"9939311","authCode":"945182","errorCode":"0","errorMsg":"\uC778\uC99D\uBC88\uD638\uAC00 \uBC1C\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4 \uC7A0\uC2DC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694"})';

          task[DOC_NAME]={};
          task[DOC_NAME]['plaintext'] = body;

          if(task.regexp && task.regexp.doc) {
            for(var key in task.regexp.doc) {
              var re = task.regexp.doc[key];
              var match = re.exec(body);

              if(match) task[DOC_NAME][key] = match[1];
            }
          }

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


