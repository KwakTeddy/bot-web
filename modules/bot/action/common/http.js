var request = require('request');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var actionController = require('../../server/controllers/action.server.controller');
var utils = require('./utils');

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

function execute(action, botName, user, inJson, outJson, successCallback, errorCallback, template) {
  var method, uri, path, param, options;
  var isSave, xpathRepeat, xpathLimit, xpathDoc, xpathPages, xpathCurrentPage;

  var xmldomErrorHandler = {
    warning: function(w) {},
    error: function(e) {},
    fatalError: function(e) {}
  };

  try {
    if(action == 'json') {
      method = template && template.method ? template.method : outJson.method;
      uri = template && template.url ? template.url : outJson.url;
      path = template && template.path ? template.path : (outJson.path ? outJson.path : "");
      param = template && template.param ? template.param : outJson.param;
      isSave = template && template.save ? template.save : outJson.save;

      options = {
        method: method,
        uri: uri  + encodeURI(path),
        header: commonHeaders
      };

      if(method && method.toUpperCase() == "PUT") {
        options.form = param;
      } else {
        options.qs = param;
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

          outJson[DOC_NAME] = result;

          if(isSave) {
            if (!global.users) global.users = {};
            if (!global.users[user]) global.users[user] = {};
            global.users[user][DOC_NAME] = outJson[DOC_NAME];
          }

          if (successCallback) successCallback(outJson);
        } else {
          if (errorCallback) errorCallback(error);
          else console.log("[common.action: http." + action + "] error: " + error);
        }
      });

    } else if(action == 'xpathRepeat') {

      method = template && template.method ? template.method : outJson.method;
      uri = template && template.url ? template.url : outJson.url;
      path = template && template.path ? template.path : (outJson.path ? outJson.path : "");
      param = utils.mergeJSON(template ? template.param : undefined, outJson.param);
      isSave = template && template.save ? template.save : outJson.save;
      xpathRepeat = template && template.xpath && template.xpath.repeat ?
        template.xpath.repeat : (outJson.xpath ? outJson.xpath.repeat: undefined);
      xpathLimit = template && template.xpath && template.xpath.limit ?
        template.xpath.limit : (outJson.xpath ? outJson.xpath.limit: undefined);
      xpathDoc = utils.mergeJSON(template ? (template.xpath ? template.xpath.doc : undefined): undefined,
        outJson.xpath ? outJson.xpath.doc : undefined);
      xpathPages = template && template.xpath && template.xpath.pages ?
        template.xpath.pages : (outJson.xpath ? outJson.xpath.pages: undefined);
      xpathCurrentPage = template && template.xpath && template.xpath.currentPage ?
        template.xpath.currentPage : (outJson.xpath ? outJson.xpath.currentPage: undefined);

      options = {
        method: method,
        uri: uri  + path,
        header: commonHeaders
      };

      if(method && method.toUpperCase() == "POST") {
        options.form = param;
      } else {
        options.qs = param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          if(!body || !xpathRepeat || !xpathDoc)
            if(errorCallback) errorCallback(null);

          var xml = body;

          var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);
          var nodes = xpath.select(xpathRepeat, doc)
          //var nodes = xpath.select("//ul[@class='lst_detail_t1']/li//dt/a/text()", doc)

          outJson[DOC_NAME] = [];
          for(var i = 0; nodes && i < nodes.length; i++) {
            if(xpathLimit && i >= xpathLimit) break;
            outJson[DOC_NAME][i] = {};
            outJson[DOC_NAME][i]["index"] = (i+1);

            for(var j in xpathDoc){
              var key = j;
              var val = xpathDoc[j];

              //TODO 전체 문서에서 아니라 nodes[i]부터 검색하도록
              if(val.search(/\/@[\w-_]*$/g) != -1)  // @attribute
                outJson[DOC_NAME][i][key] = xpath.select1(xpathRepeat + "[" + (i+1) + "]" + val, doc).value;
              else
                outJson[DOC_NAME][i][key] = xpath.select(xpathRepeat + "[" + (i+1) + "]" + val, doc).toString();
            }
          }

          outJson[PAGES_NAME] = []
          var pages = xpath.select(xpathPages, doc);
          for(var i = 0; pages && i < pages.length; i++)
            outJson[PAGES_NAME][i] = pages[i].toString();
          outJson[CURRENT_PAGE_NAME] = xpath.select(xpathCurrentPage, doc).toString();

          if(isSave) {
            if (!global.users) global.users = {};
            if (!global.users[user]) global.users[user] = {};
            global.users[user][DOC_NAME] = outJson[DOC_NAME];
          }

          console.log("xpathRepeat >> " + JSON.stringify(outJson[DOC_NAME]));
          if(successCallback) successCallback(outJson);
        } else {
          if(errorCallback) errorCallback(error);
          else console.log("[common.action: http." + action + "] error: " + error);
        }
      });

    } else if(action == 'xpath' || action == 'xpathByIndex') {

      var index, selectDoc;
      if(action == 'xpathByIndex') {
        index = actionController.parseNumber(outJson.index);

        if(!global.users || !global.users[user] || !global.users[user][DOC_NAME]) {
          throw new Error("docs not saved");
        }

        selectDoc = global.users[user][DOC_NAME][index - 1];
        outJson.path = selectDoc.path;
      }

      method = template && template.method ? template.method : outJson.method;
      uri = template && template.url ? template.url : outJson.url;
      path = template && template.path ? template.path : (outJson.path ? outJson.path : "");
      param = utils.mergeJSON(template ? template.param : undefined, outJson.param);
      xpathDoc = utils.mergeJSON(template ? (template.xpath ? template.xpath.doc : undefined): undefined,
        outJson.xpath ? outJson.xpath.doc : undefined);

      options = {
        method: method,
        uri: uri  + path,
        header: commonHeaders
      };

      if(method && method.toUpperCase() == "PUT") {
        options.form = param;
      } else {
        options.qs = param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        //console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          if(!body || !xpathDoc)
            if(errorCallback) errorCallback(null);

          var xml = body;

          var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);

          outJson[DOC_NAME] = {};
          for(var j in xpathDoc){
            var key = j;
            var val = xpathDoc[j];

            if(val.search(/\/@[\w-_]*$/g) != -1)  // @attribute
              outJson[DOC_NAME][key] = xpath.select1(val, doc).value;
            else
              outJson[DOC_NAME][key] = xpath.select(val, doc).toString();
          }

          if(action == 'selectByIndex') global.users[user][DOC_NAME] = null;

          console.log("xpath >> " + JSON.stringify(outJson[DOC_NAME]));

          if(successCallback) successCallback(outJson);
        } else {
          if (errorCallback) errorCallback(error);
          else console.log("[common.action: http." + action + "] error: " + error);
        }
      });

    } else if(action == 'plaintext') {

      method = template && template.method ? template.method : outJson.method;
      uri = template && template.url ? template.url : outJson.url;
      path = template && template.path ? template.path : (outJson.path ? outJson.path : "");
      param = template && template.param ? template.param : outJson.param;

      options = {
        method: method,
        uri: uri + path,
        header: commonHeaders
      };

      if (method && method.toUpperCase() == "PUT") {
        options.form = param;
      } else {
        options.qs = param;
        options.useQuerystring = true;
      }

      request(options, function (error, response, body) {
        console.log("status:" + response.statusCode);
        //console.log(body);

        if (!error && response.statusCode == 200) {
          if (!body || !xpathDoc)
            if (errorCallback) errorCallback(null);

          outJson[DOC_NAME] = body;

          if (successCallback) successCallback(outJson);
        } else {
          if(errorCallback) errorCallback(error);
          else console.log("[common.action: http." + action + "] error: " + error);
        }
      });
    } else if(action == 'selectByIndex') {
      var index = actionController.parseNumber(outJson.index);

      if(!global.users || !global.users[user] || !global.users[user][DOC_NAME]) {
        throw new Error("docs not saved");
      }

      if(outJson.array) outJson[DOC_NAME] = eval('(' + 'global.users.' + user + '.' + DOC_NAME + '.' + outJson.array + '[' + (index-1) + ']' + ')');
      else outJson[DOC_NAME] = global.users[user][DOC_NAME][index - 1];

      if(successCallback) successCallback(outJson);
    }
  } catch(e) {
    if(errorCallback) errorCallback(e);
    else console.log("[common.action: http." + action + "] error: " + e);
  }

}


