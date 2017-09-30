var path = require('path');
var http = require(path.resolve('./bot-engine/action/common/http'));
var task = require(path.resolve('./bot-engine/action/common/task'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('sample');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var tough = require('tough-cookie');

var async = require('async');
var webdriverio = require('webdriverio');
var utils = require(path.resolve('./bot-engine/action/common/utils'));
var config = require(path.resolve('./config/config'));

var options = {
    host: '127.0.0.1',
    port: 9515,
    path: '/',
    desiredCapabilities: {
        browserName: 'chrome',
        logLevel: 'verbose',
        chromeOptions: {
            "args": [
                "window-size=1280,1080",
                "no-proxy-server",
                "no-default-browser-check",
                "no-first-run",
                "disable-boot-animation",
                "disable-default-apps",
                "disable-extensions",
                "disable-translate"
            ]
        }
    }
};

function naversearch(task, context, callback) {

    var inRaw = context.dialog.inRaw;
    var matched = inRaw.match(/네이버[^\s]*\s*(.*)검색/);
    query = matched[1];
    if(query) query.trim();

    var client = webdriverio
        .remote(options)
        .init()
        .then(function () {
            // client.end();
            client.url('http://www.naver.com')
                .pause(500)
                .setValue('#query', query)
                .click('#search_btn')
                .pause(1000)
                .scroll('#lcs_greenmap')
                .getText('#sp_local_2 > dl > dd:nth-child(3) > span.tell')
                .then(function (text) {
                    context.dialog.mobile = text;
                    console.log(text);
                })
                .getText('#sp_local_2 > dl > dd:nth-child(3) > span:nth-child(2)')
                .catch(function (err) {
                    console.log(err);
                })
                .then(function (text) {
                    context.dialog.address = text;
                    console.log(text);
                })
                .getText('#sp_local_1 > dl > dt > a')
                .catch(function (err) {
                    console.log(err);
                })
                .then(function (text) {
                    context.dialog.name = text;
                    console.log(text);
                })
                .pause(3000)
                .end()
                .then(function () {
                    callback(task, context);
                })
        })
}

function naverTest(task, context, callback) {

  var inRaw = context.dialog.inRaw;
  var matched = inRaw.match(/네이버[^\s]*\s*(.*)검색/);

  if(matched) query = matched[1];
  else query = '';
  if(query) query.trim();

  var client = webdriverio
    .remote(options)
    .init()
    .then(function () {
      // client.end();
      client.url('http://www.naver.com')
        .pause(500)
        .setValue('#query', query)
        .click('#search_btn')
        .pause(1000)
        .scroll('#lcs_greenmap')
        .getText('#sp_local_2 > dl > dd:nth-child(3) > span.tell')
        .then(function (text) {
          context.dialog.mobile = text;
          console.log(text);
        })
        .getText('#sp_local_2 > dl > dd:nth-child(3) > span:nth-child(2)')
        .catch(function (err) {
          console.log(err);
        })
        .then(function (text) {
          context.dialog.address = text;
          console.log(text);
        })
        .getText('#sp_local_1 > dl > dt > a')
        .catch(function (err) {
          console.log(err);
        })
        .then(function (text) {
          context.dialog.name = text;
          console.log(text);
        })
        .click('#sp_local_1 > dl > dt > a')
          .then(function () {
          var request = require('request');

          var vmsMessage = "이 전화는 인공지능 예약 데모 입니다. " +
            '레스토랑 이름은' + context.dialog.name + '입니다.' +
            '주소는 ' + context.dialog.address + ' 입니다.' +
            '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
            '이 전화는 인공지능 예약 데모 입니다.';

          request.post(
            'https://bot.moneybrain.ai/api/messages/vms/send',
            // 'http://localhost:8443/api/messages/vms/send',
            {json: {callbackPhone: config.callcenter, phone: '01063165683', message: vmsMessage}},
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                // callback(task, context);
              }
              callback(task, context);
            }
          );
        })
        .pause(3000)
        .end();
    })
}

function samsung(task, context, callback) {
    var client = webdriverio
        .remote(options)
        .init()
        .then(function() {
            // client.end();
            client.url('https://www.samsungcard.com')
                .pause(1000)
                .click('#gnb > div.htop_l > div.btn_sec > div > button')
                .pause(1000)
                .click('#gnb > div.htop_l > div.btn_sec.open > section > nav > ul.gnb > li.depth01.on > a > span')
                .click('#gnb > div.htop_l > div.btn_sec.open > section > nav > ul.gnb > li.depth01.on > div > div.sub_menu01.clfix.group_on > ul:nth-child(1) > li:nth-child(4) > a')
                .pause(1000)
                .click('#contents > div > div.card_box.raume.ui_premium_card.premium_card_list03 > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.raume.ui_premium_card.premium_card_list03.open.on > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.the0.ui_premium_card.premium_card_list03 > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.the0.ui_premium_card.premium_card_list03.open.on > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.the1.ui_premium_card.premium_card_list03 > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.the1.ui_premium_card.premium_card_list03.open.on > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.platinum.ui_premium_card > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.platinum.ui_premium_card.open.on > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.amex.ui_premium_card > div > div > div.box696_premium > a')
                .pause(1000)
                .click('#contents > div > div.card_box.amex.ui_premium_card.open.on > div > div > div.box696_premium > a')
                .pause(3000)
                .end()
              .then(function () {
                callback(task, context);
              })
        })
}

function hyundai(task, context, callback) {
    var client = webdriverio
        .remote(options)
        .init()
        .then(function() {
            // client.end();
            client.url('https://www.hyundaicard.com')
                .pause(1000)
                .click('#localMenu > ul > li.cards > a')
                .pause(1000)
                .click('#container > aside > div > div.box_card_side > ul.link_card_side > li:nth-child(1) > a')
                .pause(1000)
                .scroll('#premiumCard > div:nth-child(2) > div.box_tooltip.tooltip_fee > p > a > span')
                .pause(1000)
                .scroll('#premiumCard > div:nth-child(3) > div.box_tooltip.tooltip_fee > p > a > span')
                .pause(3000)
                .end()
                .then(function () {
                callback(task, context);
              })
        })
};

function shinhan(task, context, callback) {
    var client = webdriverio
        .remote(options)
        .init()
        .then(function() {
            // client.end();
            client.url('https://www.Shinhancard.com')
                .pause(1000)
                .click('#shcGnb > li:nth-child(2) > a')
                .pause(1000)
                .click('#gnb2 > div > div > div.area02 > div > ul > li:nth-child(1) > a')
                .pause(1000)
                .click('#gnb2 > div > div > div.area02 > div > ul > li:nth-child(1) > ul > li:nth-child(1) > a')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(4)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(5)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(6)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(7)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(8)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(9)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(10)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(11)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(12)')
                .pause(1000)
                .scroll('#pbContent > div:nth-child(13)')
                .pause(1000)
                .click('#pbContent > div.btnWrap > a > span')
                .pause(1000)
                .scroll('#pbContent > div.cardListMore > div:nth-child(1)')
                .pause(1000)
                .scroll('#pbContent > div.cardListMore > div:nth-child(2)')
                .pause(1000)
                .scroll('#pbContent > div.cardListMore > div:nth-child(3)')
                .pause(1000)
                .scroll('#pbContent > div.cardListMore > div:nth-child(4)')
                .pause(3000)
                .end()
                .then(function () {
                callback(task, context);
              })
        })
};

function lotte(task, context, callback) {
    var client = webdriverio
        .remote(options)
        .init()
        .then(function() {
            // client.end();
            client.url('https://www.lottecard.co.kr')
                .pause(1000)
                .click('#ulGnbMenu > li:nth-child(2) > a > img')
                .pause(1000)
                .click('#ic_tab01 > ul > li.ben02 > a')
                .pause(1000)
                .scroll('#tabList > li.last > a')
                .pause(1000)
                .click('#tabList > li.last > a')
                .pause(1000)
                .scroll('#cardList_0 > div')
                .pause(1000)
                .scroll('#cardList_6 > div')
                .pause(1000)
                .click('#cardListDiv > div > a:nth-child(4)')
                .scroll('#cardList_0 > div')
                .pause(3000)
                .end()
                .then(function () {
                    callback(task, context);
                })

        })
};

// var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
//
// var vmsMessage = "카카오톡에서 배달봇 양얌 주문입니다. " +
//     _menuStr + ' 배달해 주세요.' +
//     '주소는 ' + context.dialog.address.지번주소 + ' 입니다.' +
//     '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
//     '이 주문은 인공지능 배달봇 얌얌의 카카오톡에서 배달대행 주문입니다.';
//
// messages.sendVMS({callbackPhone: '028585683', phone: context.dialog.phone, message: vmsMessage},
//     context, function(_task, _context) {
//     });




exports.naverTest = naverTest;

bot.setAction('naverTest', naverTest);

exports.naversearch = naversearch;

bot.setAction('naversearch', naversearch);


exports.samsung = samsung;

bot.setAction('samsung', samsung);

exports.hyundai = hyundai;

bot.setAction('hyundai', hyundai);

exports.shinhan = shinhan;

bot.setAction('shinhan', shinhan);

exports.lotte = lotte;

bot.setAction('lotte', lotte);


function allCard(task, context, callback) {
  console.log('allCard');

  async.parallel([
    function(cb) {
      hyundai(task, context, function(task, context) {
        cb(null);
      })
    },

    function (cb) {
      setTimeout(function () {
        samsung(task, context, function (task, context) {
          cb(null);
        })
      }, 500)
    },

    function(cb) {
      setTimeout(function() {
        shinhan(task, context, function(task, context) {
          cb(null);
        })
      }, 1000)
    },

    function(cb) {
      setTimeout(function() {
        lotte(task, context, function(task, context) {
          cb(null);
        })
      }, 1500)
    }
  ],

  function(err, results) {

    callback(task, context);
  })
}

exports.allCard = allCard;

bot.setAction('allCard', allCard);
