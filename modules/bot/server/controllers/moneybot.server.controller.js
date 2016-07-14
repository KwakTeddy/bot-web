//'use strict';
//process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');


exports.receivedMoneyBot = function(from, serverText, responseCallback) {

  var serverJSON = null;
  serverText = serverText.replace(/%22 /gi, "\"");
  serverText = serverText.replace(/ %22/gi, "\"");

  try { serverJSON = JSON.parse(serverText); } catch(e) {}

  if(serverJSON && typeof serverJSON == 'object') {

    getUserBankInfo(from, function (userAccounts) {

      if(serverJSON.action == "link") {
        var url = serverJSON.url;
        url = url.replace(/%26/gi, "&");
        url = url.replace(/%5F/gi, "_");

        responseCallback(serverJSON.text.replace(/ n /gi, "\n"), url);

      } else {
        if(serverJSON.action == "selectAccount") {
          var num = serverJSON.accountNumber-1;

          if(global.users[from].selectAccounts && global.users[from].selectAccounts.length > num && num >= 0) {
            userAccounts.currentBankAccount.bankAccount = global.users[from].selectAccounts[num].accountNumber;
            global.users[from].userAccounts = userAccounts;
            global.users[from].selectAccounts = null;
          }

          serverJSON.action = 'bankBalance';
        }

        bankProcess(userAccounts.currentBankAccount, serverJSON, function(retText, retJson) {
          if(serverJSON.action == "bankAccounts") {
            if(!global.users) global.users = {};
            if(!global.users[from]) global.users[from] = {};
            global.users[from].selectAccounts = retJson;
          }

          responseCallback(retText);
        });
      }
    })

  } else {
    responseCallback(serverText);
  }

};


function getUserBankInfo(userKey, successCallback, failCallback) {
  if(global.users && global.users[userKey] && global.users[userKey].userAccounts) {
    successCallback(global.users[userKey].userAccounts);

  } else {
    //if(userKey == "com2best" || userKey == "QRtjQoQse8CX") {
    if(true) {

      var userAccounts = {
        banks: [
          {bankCode: "88", bank: "신한은행", id: "com2best", password: "Finger2167!", mainAccount: "37112368362", isMain: true},
          {bankCode: "20", bank: "우리은행", id: "com2best", password: "Finger2167", mainAccount: "1002435512892", isMain: false}
        ],
        currentBankAccount: {
          bankCode: "88", bank: "신한은행", id: "com2best", password: "Finger2167!", bankAccount: "37112368362"
          //bankCode: "20", bank: "우리은행", id: "com2best", password: "Finger2167", bankAccount: "1002435512892"
        }
      };

      if(!global.users) global.users = {};
      if(!global.users[userKey]) global.users[userKey] = {};
      global.users[userKey].userAccounts = userAccounts;
      successCallback(userAccounts);
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

  if(json.action == "bankAccounts") {
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
          for(i = 1; i < len; i++) {
            var tokens2 = tokens[i].split("\t");

            text +=  i + ". " + tokens2[0] + " " + tokens2[1] + "\r\n";
            selectAccounts.push({"accountName": tokens2[0], "accountNumber": tokens2[1]});
          }
          text += (++i) + ". " + "다른 은행 계좌 선택\r\n";

          text += "번호로 계좌를 선택해 주세요.";

          successCallback(text, selectAccounts);
        } else {
          console.error(response);
          console.error(error);

          text = "봇서버에서 응답을 받을 수 없습니다.";
          successCallback(text);
        }
      });
  } else if(json.action == "bankBalance") {
    scrappingCode = "104";

    successCallback("신한 371-12-3682362 100,000원 입니다.");

    //request('http://211.232.21.89:8081/biz/scraping/BankScrapApp?' +
    //  'action=' + scrappingCode + '&bank_id=' + accountInfo.bankCode + '&online_web_id=' + accountInfo.id + '&online_web_pwd=' + accountInfo.password + '&acct_no=' + accountInfo.bankAccount
    //  , function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //      var serverText = response.body;
    //      var tokens = serverText.split("\r\n");
    //      var balance = tokens[1].split("\t")[2];
    //      text =  accountInfo.bank + " " + accountInfo.bankAccount + " 잔액 " + balance + "\r\n";
    //      text += "다른 계좌조회는 '다른계좌' 입력해 주세요"
    //      successCallback(text, null);
    //    } else {
    //      console.error(response);
    //      console.error(error);
    //
    //      text = "봇서버에서 응답을 받을 수 없습니다.";
    //      successCallback(text);
    //    }
    //  });
  } else if(json.action == "bankHistory") {
    scrappingCode = "103";

    var startDate = null, endDate = null;
    if(json.periodWord) {
      var today = new Date();

      endDate = today.getFullYear() + "" + ("00"+(today.getMonth() + 1)).slice(-2) + "" + ("00"+today.getDate()).slice(-2);

      if(json.periodWord == "today") {
        startDate = endDate;
      } else if(json.periodWord == "week") {
        var start = new Date();
        start.setDate(start.getDate() - 7);
        startDate = start.getFullYear() + "" + ("00"+(start.getMonth() + 1)).slice(-2) + "" + ("00"+start.getDate()).slice(-2);
      } else if(json.periodWord == "month") {
        var start = new Date();
        start.setMonth(start.getMonth() - 1);
        startDate = start.getFullYear() + "" + ("00"+(start.getMonth() + 1)).slice(-2) + "" + ("00"+start.getDate()).slice(-2);
      }

    } else if(json.startDate || json.endDate) {
      startDate = json.startDate;
      endDate = json.endDate;
    } else {
      startDate = "20160620";
      endDate = "20160623";
    }

    //successCallback(startDate + " " + endDate);

    request('http://211.232.21.89:8081/biz/scraping/BankScrapApp?'+
      'action=' + scrappingCode + '&bank_id=' + accountInfo.bankCode + '&online_web_id=' + accountInfo.id + '&online_web_pwd=' + accountInfo.password + '&acct_no=' + accountInfo.bankAccount +
      '&start_date=' + startDate + '&end_date=' + endDate
      , function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var serverText = response.body;
          var tokens = serverText.split("\r\n");

          if(tokens[0] == "000") {
            var balance = tokens[1].split("\t")[0];
            var len = tokens.length;
            for(i = 2; i < len; i++) {
              var tokens2 = tokens[i].split("\t");

              if(json.ai) { // 입출금 지정한 경우
                if(json.ai == "입금" && tokens2[1] != "AI") continue;
                else if(json.ai == "출금" && tokens2[1] == "AI") continue;
              }

              text +=  tokens2[0] + " " + tokens2[4] + " " + tokens2[2] + " " +  (tokens2[1] == "AI" ? "입금":"출금") + "\r\n";
            }
            text +=  "잔액 " + balance + "\r\n";
            text += "다른 계좌조회는 '다른계좌' 입력해 주세요"

            successCallback(text, null);
          } else if(tokens[0] == "001") {
            text = startDate + "-" + endDate + "\r\n" + " 거래내역이 없습니다.\r\n다른 계좌조회는 '다른계좌' 입력해 주세요";
            successCallback(text);
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
