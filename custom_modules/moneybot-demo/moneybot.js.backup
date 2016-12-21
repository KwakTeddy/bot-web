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

exports.execute = function (action, botName, user, inJson, outJSON, responseCallback) {

  switch (action) {
    case 'link':
      linkProcess(botName, user, inJson, outJSON, function (serverJSON) {
        responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
      });
      break;
    case 'text':
      responseCallback(outJSON);
      break;
    case 'faq':
      faqProcess(botName, user, inJson, outJSON, function (serverJSON) {
        responseCallback(attachText(serverJSON.content, serverJSON), serverJSON);
      });
      break;
    case 'selectproduct':
      selectProductProcess(botName, user, inJson, outJSON, function (serverJSON) {
        responseCallback(serverJSON);
      });
      break;
    case 'recommendproduct':
      recommendProductProcess(botName, user, inJson, outJSON, function (serverJSON) {
        responseCallback(serverJSON);
      });
      break;
    default:
      console.log('default: ' + outJSON.action);
      getUserBankInfo(user, function (userAccounts) {
        console.log('getUserBankInfo: ' + JSON.stringify(userAccounts));
        if (!userAccounts.banks || userAccounts.banks.length <= 0 || !userAccounts.currentBankAccount) {
          // 은행 계정 정보가 하나도 없을때
          saveBank(user, outJSON, function (retText, serverJSON) {
            responseCallback(retText, serverJSON);
          })
        } else {
          // 은행 계정 정보는 존재한다.
          if (outJSON.action == 'bankAccounts') {
            // Do Bank Account
            actionBankAccounts(user, userAccounts, outJSON, function (retText, serverJSON) {
              responseCallback(retText, serverJSON);
            })
          } else if (outJSON.action == 'selectAccount') {
            var num = parseNumber(outJSON.accountNumber) - 1;

            if (global.users[user].selectAccounts && global.users[user].selectAccounts.length > num && num >= 0) {
              userAccounts.currentBankAccount.bankAccount = global.users[user].selectAccounts[num].accountNumber;
              updateGlobalUser(user, 'userAccounts', userAccounts);
              updateGlobalUser(user, 'selectAccounts', null);
              BotUser.findOne({userKey: user}).populate('currentBank').exec(function (err, botUser) {
                if (botUser) {
                  botUser.currentAccount = userAccounts.currentBankAccount.bankAccount;
                  botUser.save(function (err) {

                  });
                }
              });
            }

            if (global.users && global.users[user] && global.users[user].lastJSON) {
              outJSON = global.users[user].lastJSON;
              global.users[user].lastJSON = null;
            } else {
              outJSON.action = 'bankBalance';
              outJSON.postText = "\n\n추천 명령: 내역조회 다른계좌 처음 home";
            }

            bankProcess(user, userAccounts.currentBankAccount, outJSON, function (retText, retJson) {
              responseCallback(retText, outJSON);
            });
          } else if (outJSON.action == 'bankBanks') {
            updateGlobalUser(user, 'selectBanks', userAccounts.banks);
            var retText = '';
            outJSON.buttons = [];
            for (var i = 0; userAccounts.banks && i < userAccounts.banks.length; i++) {
              retText += (i + 1) + '. ' + userAccounts.banks[i].bank + '\n';
              outJSON.buttons.push((i + 1) + ". " + userAccounts.banks[i].bank);
            }
            retText += (userAccounts.banks ? userAccounts.banks.length + 1 : 1) + '. ' + '은행추가';
            outJSON.buttons.push((userAccounts.banks ? userAccounts.banks.length + 1 : 1) + '. ' + '은행추가');

            responseCallback(retText, outJSON);
          } else if (outJSON.action == 'selectBank') {
            var num = parseNumber(outJSON.bankNumber) - 1;

            if (global.users[user].selectBanks && global.users[user].selectBanks.length > num && num >= 0) {
              userAccounts.currentBankAccount = global.users[user].selectBanks[num];
              updateGlobalUser(user, 'userAccounts', userAccounts);
              BotUser.findOne({userKey: user}).populate('currentBank').exec(function (err, botUser) {
                if (botUser) {
                  botUser.currentBank = userAccounts.currentBankAccount;
                  botUser.currentAccount = null;
                  botUser.save(function (err) {
                    actionBankAccounts(user, userAccounts, outJSON, function (retText, serverJSON) {
                      responseCallback(retText, serverJSON);
                    })
                  });
                } else {
                  responseCallback('해당하는 유저가 존재하지 않습니다.', outJSON);
                }
              });
            } else {
              saveBank(user, outJSON, function (retText, serverJSON) {
                responseCallback(retText, serverJSON);
              })
            }
            updateGlobalUser(user, 'selectBanks', null);
          } else {
            // updateGlobalUser(user, 'lastJSON', serverJSON);
            if (!userAccounts.currentBankAccount.bankAccount) {
              actionBankAccounts(user, userAccounts, outJSON, function (retText, serverJSON) {
                responseCallback(retText, serverJSON);
              })
            } else {
              bankProcess(userAccounts.currentBankAccount, outJSON, function (retText, retJson) {
                responseCallback(retText, outJSON);
              });
            }
          }
        }
      }, function () {
        responseCallback("조회 중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home", outJSON);
      });
      break;
  }

};

function linkProcess(botName, user, inJson, outJson, callback) {
  var url = outJson.url;
  url = url.replace(/%26/gi, "&");
  url = url.replace(/%5F/gi, "_");
  outJson.url = url;

  callback(outJson);
}
function faqProcess(botName, user, inJson, outJson, callback) {
  Faq.findById(outJson.id).exec(function (err, faq) {
    if (err || !faq) {
      outJson.content = '죄송합니다! 일치하는 답변을 찾지 못했습니다ㅠㅜ';
    } else {
      outJson.content = "[" + faq.title + "]" + '\n\n' + faq.content;
    }

    callback(outJson);
  });
}

function selectProductProcess(botName, user, inJson, outJson, callback) {
  var sel = parseNumber(outJson.select);
  var selectProduct = global.users[user].products[sel - 1];
  outJson.id = selectProduct._id;
  Product.findById(outJson.id).exec(function (err, product) {
    if (err || !product) {
      outJson.error = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
    } else {
      //serverJSON.content = product.title + "\n" + product.content;
      outJson.title = product.title;
      outJson.product = product.content;
      outJson.url = product.link;
    }

    callback(outJson);
  });
}

function recommendProductProcess(botName, user, inJson, outJson, callback) {
  Product.find({category: outJson.category}).sort('-rate').exec(function (err, products) {
    if (err || !products || products.length <= 0) {
      outJson.error = '죄송합니다! 일치하는 상품을 찾지 못했습니다ㅠㅜ';
    } else {
      if (!global.users) global.users = {};
      if (!global.users[user]) global.users[user] = {};
      global.users[user].products = [];

      //serverJSON.content = '';
      outJson.products = [];
      //serverJSON.buttons = [];
      if (outJson.category == 'mortgage'
        || outJson.category == 'lend'
        || outJson.category == 'credit') {
        for (var i = products.length - 1; i >= 0; i--) {
          if (i <= products.length - 4) {
            break;
          }
          //if (serverJSON.content.length > 0) {
          //  serverJSON.content += '\n';
          //}

          //serverJSON.content += ((products.length - i) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
          outJson.products.push({"index": (products.length - i), "title": products[i].title, "rate": products[i].rate});
          //serverJSON.buttons.push((products.length - i) + '. ' + products[i].title + ' (' + products[i].rate + '%)');

          global.users[user].products.push(products[i]);
        }
      } else {
        for (var i = 0; i < products.length; i++) {
          if (i >= 3) {
            break;
          }
          //if (serverJSON.content.length > 0) {
          //  serverJSON.content += '\n';
          //}
          //serverJSON.content += ((i + 1) + '. ' + products[i].title + ' (' + products[i].rate + '%)');
          outJson.products.push({"index": (i+1), "title": products[i].title, "rate": products[i].rate});
          //serverJSON.buttons.push((i + 1) + '. ' + products[i].title + ' (' + products[i].rate + '%)');

          global.users[user].products.push(products[i]);
        }
      }
    }
    callback(outJson);
  });
}


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
function saveBank(userKey, serverJSON, callback) {
  updateGlobalUser(userKey, 'userAccounts', null);
  // updateGlobalUser(userKey, 'lastAction', serverJSON.action);

  serverJSON.url = config.host + '/banks/save/' + userKey;
  if(serverJSON.action != 'selectBank') {
    callback('은행 계정 정보를 입력해주세요!\n\n입력을 완료한 후에는 다시 한번 "' + actionNameFromCode(serverJSON.action) + '"라고 입력해 주세요', serverJSON);
  } else {
    callback('은행 계정 정보를 입력해주세요!', serverJSON);
  }
}
function actionBankAccounts(userKey, userAccounts, serverJSON, callback) {
  bankProcess(userAccounts.currentBankAccount, {action: 'bankAccounts'}, function (retText, retJson) {
    if (retText.startsWith("비밀번호")) {
      serverJSON.url = config.host + '/banks/save/' + user;
    } else {
      updateGlobalUser(userKey, 'selectAccounts', retJson);
      if (serverJSON.action == 'bankAccounts'
        || serverJSON.action == 'selectBank') {
        serverJSON.buttons = [];
        for (var i = 0; retJson && i < retJson.length; i++) {
          serverJSON.buttons.push((i + 1) + ". " + retJson[i].accountName + " " + retJson[i].accountNumber);
        }
      } else {
        updateGlobalUser(userKey, 'lastJSON', serverJSON);
      }
    }
    callback(retText, serverJSON);
  });
}

function bankProcess(user, accountInfo, json, successCallback) {
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

          if (tokens[0] == "000") {
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
            if (tokens[0] == "001") successCallback("해당은행에 계좌가 없습니다.\n\n처음으로 이동은: 처음 home");
            if (tokens[0] == "002") {
              if (tokens[1].indexOf("비밀번호") != -1) {
                successCallback("비밀번호가 틀렸습니다.\n\n처음으로 이동은: 처음 home");
              } else
                successCallback("조회 중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.\n\n 처음으로 이동은: 처음 home");
            } else {
              successCallback("조회 중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home");
            }

          }
        } else {
          console.error(response);
          console.error(error);

          text = "봇서버에서 응답을 받을 수 없습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home";
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
          console.log('bankBalance: ' + serverText);
          var tokens = serverText.split("\r\n");
          var balance = tokens[1].split("\t")[2];
          text = accountInfo.bank + " " + accountInfo.bankAccount + " 잔액 " + balance + "\r\n";
          successCallback(attachText(text, json));
        } else {
          console.error(response);
          console.error(error);

          text = "봇서버에서 응답을 받을 수 없습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home";
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
            text = startDate + "-" + endDate + "\r\n" + "거래내역이 없습니다.\n\n추천 명령: 다른계좌 처음 home";
            successCallback(attachText(text, json));
          } else {
            text = "계좌 내역을 읽어올 수 없습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home";
            successCallback(text);
          }
        } else {
          console.error(response);
          console.error(error);

          text = "계좌 내역을 읽어올 수 없습니다.\n잠시 후 다시 시도해 주세요.\n\n처음으로 이동은: 처음 home";
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

function updateGlobalUser(userKey, key, value) {
  if (!global.users) global.users = {};
  if (!global.users[userKey]) global.users[userKey] = {};

  global.users[userKey][key] = value;
}

function actionNameFromCode(actionCode) {
  switch (actionCode) {
    case 'bankBalance':
      return '잔액조회';
    case 'bankHistory':
      return '내역조회';
    case 'bankBanks':
      return '다른은행';
    case 'bankAccounts':
      return '계좌조회';
    default:
      return '';
  }
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
