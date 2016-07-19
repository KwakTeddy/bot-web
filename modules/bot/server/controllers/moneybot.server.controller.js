//'use strict';
//process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var config = require(path.resolve('./config/config'));
// var bank = require('../../../banks/server/controllers/banks.server.controller');
// var botUser = require('../../../bot-users/server/controllers/bot-users.server.controller.js');
var mongoose = require('mongoose'),
  Bank = mongoose.model('Bank'),
  BotUser = mongoose.model('BotUser'),
  Faq = mongoose.model('Faq'),
  Product = mongoose.model('Product');

exports.receivedMoneyBot = function (from, serverText, responseCallback) {

  var serverJSON = null;
  serverText = serverText.replace(/%22 /gi, "\"");
  serverText = serverText.replace(/ %22/gi, "\"");
  serverText = serverText.replace(/%22/gi, "\"");

  serverText = serverText.replace(/%5b/gi, "[");
  serverText = serverText.replace(/%5d/gi, "]");

  serverText = serverText.replace(/%0a/gi, "\n");

  try {
    serverJSON = JSON.parse(serverText);
  } catch (e) {
  }

  if (serverJSON && typeof serverJSON == 'object') {
    if (serverJSON.action == "link") {
      var url = serverJSON.url;
      url = url.replace(/%26/gi, "&");
      url = url.replace(/%5F/gi, "_");
      serverJSON.url = url;

      responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
    } else if (serverJSON.action == "text") {
      responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);

    } else if (serverJSON.action == "faq") {
      Faq.findById(serverJSON.id).exec(function (err, faq) {
        if (err || !faq) {
          serverJSON.content = '죄송합니다! 일치하는 답변을 찾지 못했습니다ㅠㅜ';
        } else {
          serverJSON.content = "[" + faq.title + "]" + '\n\n' + faq.content;
        }

        responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
      });
    //} else if (serverJSON.action == "product") {
    //  Product.findById(serverJSON.id).exec(function (err, product) {
    //    if (err || !product) {
    //      serverJSON.content = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
    //    } else {
    //      serverJSON.content = product.content;
    //    }
    //
    //    responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
    //  });
    } else if (serverJSON.action == "selectproduct") {
      var sel = parseNumber(serverJSON.select);
      var selectProduct = global.users[from].products[sel - 1];
      serverJSON.id = selectProduct._id;
      Product.findById(serverJSON.id).exec(function (err, product) {
        if (err || !product) {
          serverJSON.content = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
        } else {
          serverJSON.content = product.title + "\n" + product.content;
          serverJSON.url = product.link;
        }

        responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
      });
      //global.users[from].products = null;

    } else if(serverJSON.action == "recommendproduct") {

      Product.find({category: serverJSON.category}).sort('-rate').exec(function (err, products) {
        if (err || !products || products.length <= 0) {
          serverJSON.content = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
        } else {
          if (!global.users) global.users = {};
          if (!global.users[from]) global.users[from] = {};
          global.users[from].products = [];

          serverJSON.content = '';
          serverJSON.buttons = [];
          if (serverJSON.category == 'mortgage'
            || serverJSON.category == 'lend'
            || serverJSON.category == 'credit') {
            for (var i = products.length-1; i >= 0; i--) {
              if (i <= products.length-4) {
                break;
              }
              if(serverJSON.content.length > 0) {
                serverJSON.content += '\n';
              }
              serverJSON.content += ((products.length - i) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
              serverJSON.buttons.push((products.length - i) + '. ' + products[i].title + ' (' + products[i].rate + '%)');

              global.users[from].products.push(products[i]);
            }
          } else {
            for (var i = 0; i < products.length; i++) {
              if (i >= 3) {
                break;
              }
              if(serverJSON.content.length > 0) {
                serverJSON.content += '\n';
              }
              serverJSON.content += ((i+1) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
              serverJSON.buttons.push((i+1) + '. ' + products[i].title + ' (' + products[i].rate + '%)');

              global.users[from].products.push(products[i]);
            }
          }
        }
        responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
      });
    //} else if (serverJSON.action == "mortgage"
    //  || serverJSON.action == "lend"
    //  || serverJSON.action == "credit"
    //  || serverJSON.action == "deposit"
    //  || serverJSON.action == "installment") {
    //  Product.find({category: serverJSON.action}).sort('+rate').exec(function (err, products) {
    //    if (err || !products || products.length <= 0) {
    //      serverJSON.content = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
    //    } else {
    //      if (!global.users) global.users = {};
    //      if (!global.users[from]) global.users[from] = {};
    //      global.users[from].products = products;
    //
    //      serverJSON.content = '';
    //      if (serverJSON.action == 'mortgage'
    //        || serverJSON.action == 'lend'
    //        || serverJSON.action == 'credit') {
    //        for (var i = 0; i < products.length; i++) {
    //          if (i >= 3) {
    //            break;
    //          }
    //          if(serverJSON.content.length > 0) {
    //            serverJSON.content += '\n';
    //          }
    //          serverJSON.content += ((i+1) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
    //        }
    //      } else {
    //        for (var i = products.length-1; i >= 0; i--) {
    //          if (i <= products.length-4) {
    //            break;
    //          }
    //          if(serverJSON.content.length > 0) {
    //            serverJSON.content += '\n';
    //          }
    //          serverJSON.content += ((products.length - i) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
    //        }
    //      }
    //    }
    //    responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
    //  });
    } else {
      getUserBankInfo(from, function (userAccounts) {
        if (userAccounts.banks.length <= 0 || !userAccounts.currentBankAccount) {
          serverJSON.url = config.host + '/banks/save/' + from;
          responseCallback("은행 계정 정보를 입력해주세요! \n 입력을 완료한 후에는 다시 한번 \"잔액조회\"라고 입력해 주세요", serverJSON);
          if (global.users && global.users[from] && global.users[from].userAccounts) {
            global.users[from] = null;
          }
        } else {
          if (serverJSON.action != "selectAccount" && !userAccounts.currentBankAccount.bankAccount) {
            bankProcess(userAccounts.currentBankAccount, {action: 'bankAccounts'}, function (retText, retJson) {
              if (!global.users) global.users = {};
              if (!global.users[from]) global.users[from] = {};
              global.users[from].selectAccounts = retJson;
              global.users[from].lastJSON = serverJSON;

              responseCallback(retText, serverJSON);

              //doBankProcess();
            });
          } else {
            doBankProcess();
          }

          function doBankProcess() {
            if (serverJSON.action == "selectAccount") {
              var num = parseNumber(serverJSON.accountNumber) - 1;

              if (global.users[from].selectAccounts && global.users[from].selectAccounts.length > num && num >= 0) {
                userAccounts.currentBankAccount.bankAccount = global.users[from].selectAccounts[num].accountNumber;
                global.users[from].userAccounts = userAccounts;
                global.users[from].selectAccounts = null;
              }

              serverJSON.action = 'bankBalance';
              serverJSON.postText = "필요하신 게 더 있으신가요?n (도움말 : help)";
            }

            bankProcess(userAccounts.currentBankAccount, serverJSON, function (retText, retJson) {
              if (serverJSON.action == "bankAccounts") {
                if (!global.users) global.users = {};
                if (!global.users[from]) global.users[from] = {};
                global.users[from].selectAccounts = retJson;

                serverJSON.buttons = [];
                for(i = 0; retJson && i < retJson.length; i++) {
                  serverJSON.buttons.push((i+1)+". " + retJson[i].accountName + " " + retJson[i].accountNumber);
                }

              }

              responseCallback(retText, serverJSON);
            });
          }
        }
      });
    }
  } else {
    responseCallback(serverText, serverJSON);
  }

};


function getUserBankInfo(userKey, successCallback, failCallback) {
  if (global.users && global.users[userKey] && global.users[userKey].userAccounts) {
    successCallback(global.users[userKey].userAccounts);

  } else {
    BotUser.findOne({userKey: userKey}).populate('currentBank').exec(function (err, botUser) {
      if (err || !botUser) {
        botUser = new BotUser();
        botUser.userKey = userKey;
        botUser.save(function (err) {
          if (err) {
            return failCallback();
          } else {
            setBanks(botUser);
          }
        });
      } else {
        setBanks(botUser);
      }
    });

    function setBanks(botUser) {
      var userAccounts = {};
      userAccounts.banks = [];
      userAccounts.currentBankAccount = null;
      Bank.find({userKey: botUser.userKey}).exec(function (err, banks) {
        if (!err && banks && banks.length > 0) {
          for (var i = 0; i < banks.length; i++) {
            userAccounts.banks.push({
              bankCode: banks[i].bankCode,
              bank: banks[i].bankName,
              id: banks[i].userID,
              password: banks[i].userPassword
            })
          }
        }
        if (botUser.currentBank) {
          userAccounts.currentBankAccount = {
            bankCode: botUser.currentBank.bankCode,
            bank: botUser.currentBank.bankName,
            id: botUser.currentBank.userID,
            password: botUser.currentBank.userPassword
          };
          if (botUser.currentAccount) {
            userAccounts.currentBankAccount.bankAccount = botUser.currentAccount;
          }
        }

        if (!global.users) global.users = {};
        if (!global.users[userKey]) global.users[userKey] = {};
        global.users[userKey].userAccounts = userAccounts;
        successCallback(userAccounts);
      });
    }

  }
}


function bankProcess(accountInfo, json, successCallback) {
  var text = "";
  var scrappingCode = "";

  console.log("=============bankProcess==============");
  console.log(JSON.stringify(accountInfo));
  console.log(JSON.stringify(json));
  console.log("=============bankProcess==============");

  if (json.action == "bankAccounts") {
    scrappingCode = "105";
    request('http://211.232.21.89:8081/biz/scraping/BankScrapApp?' +
      'action=' + scrappingCode + '&bank_id=' + accountInfo.bankCode + '&online_web_id=' + accountInfo.id + '&online_web_pwd=' + accountInfo.password
      , function (error, response, body) {
        if (!error && response.statusCode == 200) {
          text = accountInfo.bank + "\r\n";
          var serverText = response.body;
          var tokens = serverText.split("\r\n");
          var len = tokens.length;
          var selectAccounts = [];
          for (i = 1; i < len; i++) {
            var tokens2 = tokens[i].split("\t");

            text += i + ". " + tokens2[0] + " " + tokens2[1] + "\r\n";
            selectAccounts.push({"accountName": tokens2[0], "accountNumber": tokens2[1]});
          }
          //text += (++i) + ". " + "다른 은행 계좌 선택\r\n";

          text += "조회할 계좌를 선택해 주세요.";

          successCallback(attachText(text, json), selectAccounts);
        } else {
          console.error(response);
          console.error(error);

          text = "봇서버에서 응답을 받을 수 없습니다.";
          successCallback(text);
        }
      });
  } else if (json.action == "bankBalance") {
    scrappingCode = "104";

    //text = "신한 371-12-3682362 100,000원 입니다.";
    //successCallback(attachText(text, json));

    request('http://211.232.21.89:8081/biz/scraping/BankScrapApp?' +
      'action=' + scrappingCode + '&bank_id=' + accountInfo.bankCode + '&online_web_id=' + accountInfo.id + '&online_web_pwd=' + accountInfo.password + '&acct_no=' + accountInfo.bankAccount
      , function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var serverText = response.body;
          var tokens = serverText.split("\r\n");
          var balance = tokens[1].split("\t")[2];
          text =  accountInfo.bank + " " + accountInfo.bankAccount + " 잔액 " + balance + "\r\n";
          successCallback(attachText(text, json));
        } else {
          console.error(response);
          console.error(error);

          text = "봇서버에서 응답을 받을 수 없습니다.";
          successCallback(text);
        }
      });
  } else if (json.action == "bankHistory") {
    scrappingCode = "103";

    var startDate = null, endDate = null;
    if (json.periodWord) {
      var today = new Date();

      endDate = today.getFullYear() + "" + ("00" + (today.getMonth() + 1)).slice(-2) + "" + ("00" + today.getDate()).slice(-2);

      if (json.periodWord == "today") {
        startDate = endDate;
      } else if (json.periodWord == "week") {
        var start = new Date();
        start.setDate(start.getDate() - 7);
        startDate = start.getFullYear() + "" + ("00" + (start.getMonth() + 1)).slice(-2) + "" + ("00" + start.getDate()).slice(-2);
      } else if (json.periodWord == "month") {
        var start = new Date();
        start.setMonth(start.getMonth() - 1);
        startDate = start.getFullYear() + "" + ("00" + (start.getMonth() + 1)).slice(-2) + "" + ("00" + start.getDate()).slice(-2);
      }

    } else if (json.startDate || json.endDate) {
      startDate = json.startDate;
      endDate = json.endDate;
    } else {    // 기본 일주일
      var today = new Date();
      endDate = today.getFullYear() + "" + ("00" + (today.getMonth() + 1)).slice(-2) + "" + ("00" + today.getDate()).slice(-2);

      var start = new Date();
      start.setDate(start.getDate() - 7);
      startDate = start.getFullYear() + "" + ("00" + (start.getMonth() + 1)).slice(-2) + "" + ("00" + start.getDate()).slice(-2);
    }

    //successCallback(startDate + " " + endDate);

    request('http://211.232.21.89:8081/biz/scraping/BankScrapApp?' +
      'action=' + scrappingCode + '&bank_id=' + accountInfo.bankCode + '&online_web_id=' + accountInfo.id + '&online_web_pwd=' + accountInfo.password + '&acct_no=' + accountInfo.bankAccount +
      '&start_date=' + startDate + '&end_date=' + endDate
      , function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var serverText = response.body;
          var tokens = serverText.split("\r\n");

          if (tokens[0] == "000") {
            var balance = tokens[1].split("\t")[0];
            var len = tokens.length;
            for (i = 2; i < len; i++) {
              var tokens2 = tokens[i].split("\t");

              if (json.ai) { // 입출금 지정한 경우
                if (json.ai == "out" && tokens2[1] != "AI") continue;
                else if (json.ai == "out" && tokens2[1] == "AI") continue;
              }

              text += tokens2[0] + " " + tokens2[4] + " " + tokens2[2] + " " + (tokens2[1] == "AI" ? "입금" : "출금") + "\r\n";
            }
            text += "잔액 " + balance + "\r\n";

            successCallback(attachText(text, json));
          } else if (tokens[0] == "001") {
            text = startDate + "-" + endDate + "\r\n" + " 거래내역이 없습니다.\r\n다른 계좌조회는 '다른계좌' 입력해 주세요";
            successCallback(attachText(text, json));
          } else {
            text = "계좌 내역을 읽어올 수 없습니다.\r\n잠시후 다시 시도해 주세요";
            successCallback(text);
          }
        } else {
          console.error(response);
          console.error(error);

          text = "계좌 내역을 읽어올 수 없습니다.\r\n잠시후 다시 시도해 주세요";
          successCallback(text);
        }
      });
  }
}

function attachText(text, json) {
  if (json.preText) text = json.preText + "\r\n" + text;
  else if (json.pretext) text = json.pretext + "\r\n" + text;

  if (json.postText) text = text + "\r\n" + json.postText;
  else if (json.posttext) text = text + "\r\n" + json.posttext;

  return text;
}

function parseNumber(text, json) {
  var _text = text.trim();
  if(_text.endsWith(".")) _text = _text.substr(0, _text.length -1);
  else if(_text.endsWith(",")) _text = _text.substr(0, _text.length -1);
  else if(_text.startsWith("일") || _text.startsWith("처") || _text.startsWith("첫")) _text = "1";
  else if(_text.startsWith("이") || _text.startsWith("두") || _text.startsWith("둘")) _text = "2";
  else if(_text.startsWith("삼") || _text.startsWith("세") || _text.startsWith("셋")) _text = "3";
  else if(_text.startsWith("사") || _text.startsWith("네") || _text.startsWith("넷")) _text = "4";
  else if(_text.startsWith("오") || _text.startsWith("다섯")) _text = "5";
  else if(_text.startsWith("육") || _text.startsWith("여섯")) _text = "6";
  else if(_text.startsWith("칠") || _text.startsWith("일곱")) _text = "7";
  else if(_text.startsWith("팔") || _text.startsWith("여덟")) _text = "8";
  else if(_text.startsWith("구") || _text.startsWith("아홉")) _text = "9";

  return _text;
}

//function openUserBankInfo() {
//  var openMsg =
//  {
//    "message": {
//      "text": "귀하의 차량이 성공적으로 등록되었습니다. 축하합니다!",
//      "photo": {
//        "url": "https://photo.src",
//        "width": 640,
//        "height": 480
//      },
//      "message_button": {
//        "label": "주유 쿠폰받기",
//        "url": "https://coupon/url"
//      }
//    },
//    "keyboard": {
//      "type": "buttons",
//      "buttons": [
//        "처음으로",
//        "다시 등록하기",
//        "취소하기"
//      ]
//    }
//  };
//
//  return openMsg;
//}
