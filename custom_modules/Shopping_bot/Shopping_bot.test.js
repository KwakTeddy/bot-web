/**
 * Created by moneybrain on 2017. 7. 5..
 */

'use strict';

var assert = require('assert');
var path = require('path');
var mongoose = require(path.resolve('config/lib/mongoose.js'));
var bot_server;
var bot;

describe('Bot', function () {
    var channel = "socket";
    var bot_name = 'Shopping_bot';
    var user = 'com2best';

    var msgEqual = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            assert.equal(out, expected);
            done();
        });
    };

    var msgMatch = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            console.log(out + ', ' +  expected + ', ' + out.search(new RegExp(expected, 'i')));
            assert.notEqual(-1, out.search(new RegExp(expected, 'i')));
            done();
        });
    };

    before(function () {
        var app = require(path.resolve('config/lib/app.js'));
        app.start();

        bot_server = require(path.resolve('config/lib/bot.js'));
        bot = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
    });

    describe('start', function () {
        // before(function () {
        //   bot_server.loadBot(bot_name);
        // });

        it('load', function(done) {
            bot_server.loadBot(bot_name, function() {
                done();
            });
        });



        it('1', function (done) {
            msgMatch(':reset user', '안녕하세요 쇼핑봇입니다.\n배송조회, 주문취소, 상품검색 기능을 이용하실 수 있습니다.', done);
        });
        it('2', function (done) {
            msgMatch('배송조회', '배송조회를 진행하겠습니다. \n조회를 위해서는 휴대폰 인증이 필요합니다. \n가입하실때 사용하신 휴대폰 번호를 입력해주세요.', done);
        });
        it('3', function (done) {
            msgMatch('01092597716', '배송 진행 상황입니다.\n\n1. \\[배송중\\] 9117 구제 데님 원피스 \\(2color\\)\n2. \\[배송준비중\\] 꽃보다 츄리닝\n3. \\[배송준비중\\] 스키니핏 스판 청바지\n\n상세한 정보를 보고싶은 번호를 입력해주세요.', done);
        });
        it('4', function (done) {
            msgMatch('1', '\\[9117 구제 데님 원피스 \\(2color\\)\\]  \n\n주소: 서울특별시 서초구 사당동 오렌지팜  \n\n배송진행상황: 배송중입니다.\n\n현재 청원IC 도착.\n\n택배 담당자 : 김기철 010-6565-5854  \n\n배송예정일: 2017-06-25', done);
        });
        it('5', function (done) {
            msgMatch('주문취소', '주문취소를 진행하겠습니다. \n주문 취소를 위해서는 휴대폰 인증이 필요합니다. \n가입하실때 사용하신 휴대폰 번호를 입력해주세요.', done);
        });
        it('6', function (done) {
            msgMatch('01092597716', '주문한 상품 목록입니다.\n\n1. \\[배송중\\] 9117 구제 데님 원피스 \\(2color\\)\n2. \\[배송준비중\\] 꽃보다 츄리닝\n3. \\[배송준비중\\] 스키니핏 스판 청바지\n\n주문 취소를 원하는 번호를 입력해주세요.', done);
        });
        it('7', function (done) {
            msgMatch('2', '주문취소신청 처리 되었습니다. 감사합니다.', done);
        });
        it('8', function (done) {
            msgMatch('상품검색', '아래는 상품 카테고리입니다.\n찾으시는 상품이 속한 카테고리를 선택해주세요.\n\n1. 원피스\n2. 바지\n', done);
        });
        it('9', function (done) {
            msgMatch('2', '카테고리에 속한 상품 목록입니다.\n\n1. 스키니핏 스판 청바지\n2. 꽃보다 츄리닝\n\n상세 정보를 보고 싶으신 상품을 선택해주세요.', done);
        });
        it('10', function (done) {
            msgMatch('2', '\\[꽃보다 츄리닝\\]\n편안하고 시원한 츄리닝 바지\n\n가격: 9000\n색상: 블랙,그레이\n사이즈: S,M,L\n재고: 20\n입고예정일: ', done);
        });





        /*
         add a test case here
         it('bot should return "expected" for "msg", function(done) {
         bot_test(bot_name, 'msg', "expected", done);
         });
         */
    });
});
