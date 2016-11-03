var path = require('path');
var http = require(path.resolve('modules/bot/action/common/http'));
var task = require(path.resolve('modules/bot/action/common/task'));
var bot = require(path.resolve('config/lib/bot')).getBot('sample');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var tough = require('tough-cookie');

var async = require('async');
var webdriverio = require('webdriverio');
var utils = require(path.resolve('modules/bot/action/common/utils'));

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

function naverTest(task, context, callback) {
    var client = webdriverio
        .remote(options)
        .init()
        .then(function() {
            // client.end();
            client.url('http://www.naver.com')
                .pause(500)
                .setValue('#query', '강남 스테이크 맛집')
                .click('#search_btn')
                .pause(1000)
                .scroll('#lcs_greenmap')
                .getText('#sp_local_2 > dl > dd:nth-child(3) > span.tell')
                .then(function(text) {
                    context.dialog.mobile = text;
                    console.log(text);
                })
                .getText('#sp_local_2 > dl > dd:nth-child(3) > span:nth-child(2)')
                .catch(function(err) {
                    console.log(err);
                })
                .then(function(text) {
                    context.dialog.address = text;
                    console.log(text);
                })
                .then(function(){
                    // var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
                    // var vmsMessage = "안녕하세요 카카오톡 예약봇 양얌입니다. " +
                    //     _menuStr + ' 배달해 주세요.' +
                    //     '주소는 ' + context.dialog.address + ' 입니다.' +
                    //     '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
                    //     '이 전화은 인공지능 배달봇 얌얌의 카카오톡에서 예약 대행 서비스입니다.';
                    //     messages.sendVMS({callbackPhone: '028585683', phone: '01066624995', message: vmsMessage}, context,
                    //         function(_task, _context) {
                                callback(task, context);
                            // });
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
