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
    var bot_name = 'Shopping_bot_ch';
    var user = 'com2best';

    var msgEqual = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            assert.equal(out, expected);
            done();
        });
    };

    var msgMatch = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            console.log(out + '\n-------------------------------------------------\n' +  expected + '\n-------------------------------------------------\n' + out.search(new RegExp(expected, 'i')));
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
            msgMatch(':reset user', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('2', function (done) {
            msgMatch('配送查询', '', done);
        });
        it('3', function (done) {
            msgMatch('01092597716', '', done);
        });
        it('4', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('5', function (done) {
            msgMatch('配送查询', '配送状态.\n\\(手机数: 01092597716\\)\n\n1. \\[配送中\\] 做旧牛仔连衣裙 \\(2color\\)\n2. \\[配送准备中\\] 比花更没的运动裤\n3. \\[配送准备中\\] 修身弹性牛仔裤\n\n请输入想要查看详细内容的编号. ', done);
        });
        it('6', function (done) {
            msgMatch('2', '\\[比花更没的运动裤\\]  \n\n주소: 北京市 东城区 东长安街33号  \n\n配送进行状态: 配送准备中  \n\n预计到达日: 2017\\-06\\-25', done);
        });
        it('7', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('8', function (done) {
            msgMatch('订单取消', '预订商品目录.\n\n1. \\[配送中\\] 做旧牛仔连衣裙 \\(2color\\)\n2. \\[配送准备中\\] 比花更没的运动裤\n3. \\[配送准备中\\] 修身弹性牛仔裤\n\n请输入想要取消订单的号码.', done);
        });
        it('9', function (done) {
            msgMatch('1', '配送中的商品不能取消订单.\n请在配送结束后申请退货.', done);
        });
        it('10', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('11', function (done) {
            msgMatch('订单取消', '预订商品目录.\n\n1. \\[配送中\\] 做旧牛仔连衣裙 \\(2color\\)\n2. \\[配送准备中\\] 比花更没的运动裤\n3. \\[配送准备中\\] 修身弹性牛仔裤\n\n请输入想要取消订单的号码.', done);
        });
        it('12', function (done) {
            msgMatch('2', '取消订单成功，谢谢.', done);
        });
        it('13', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('14', function (done) {
            msgMatch('商品检索', '下面是商品种类.\n请选择需要查询商品的种类.\n\n1. 连衣裙\n2. 裤子\n', done);
        });
        it('15', function (done) {
            msgMatch('2', '相关种类商品目录.\n\n1. 修身弹性牛仔裤\n2. 比花更没的运动裤\n\n想要查看具体信息请选择商品.', done);
        });
        it('16', function (done) {
            msgMatch('1', '\\[修身弹性牛仔裤\\]\n材料结实，不变形，经久耐穿的牛仔裤 ♡\n\n价格: 34000\n颜色: Blue\n尺寸: 23,24,25,26\n库存: 售完\\(\\*重新入库 通知 可能\\*\\)\n预计入库日期: 2017\\-06\\-29', done);
        });
        it('17', function (done) {
            msgMatch('重新入库', '\\[修身弹性牛仔裤\\]\n\n 已选择上述商品的再入库通知.', done);
        });
        it('18', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('19', function (done) {
            msgMatch('订单修改', '请选择修改内容', done);
        });
        it('20', function (done) {
            msgMatch('商品选项变更', '预订商品目录.\n\n1. \\[配送中\\] 做旧牛仔连衣裙 \\(2color\\)\n2. \\[配送准备中\\] 比花更没的运动裤\n3. \\[配送准备中\\] 修身弹性牛仔裤\n\n请选择需要变更目录的号码.', done);
        });
        it('21', function (done) {
            msgMatch('2', '请选择想要修改的选项内容.\n\\(当前选项: S\\)\n\nS, M, L', done);
        });
        it('22', function (done) {
            msgMatch('L', '选项 L 修改完成.', done);
        });
        it('23', function (done) {
            msgMatch('第一', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });
        it('24', function (done) {
            msgMatch('订单修改', '请选择修改内容', done);
        });
        it('25', function (done) {
            msgMatch('配送地变更', '预订商品目录.\n\n1. \\[配送中\\] 做旧牛仔连衣裙 \\(2color\\)\n2. \\[配送准备中\\] 比花更没的运动裤\n3. \\[配送准备中\\] 修身弹性牛仔裤\n\n请选择想要修改配送地的商品序号.', done);
        });
        it('26', function (done) {
            msgMatch('2', '请输入新配送地.', done);
        });
        it('27', function (done) {
            msgMatch('seoul', '新配送地 \n\nseoul\n\n确认\\?', done);
        });
        it('28', function (done) {
            msgMatch('是', '新配送地已经变更为为配送地.', done);
        });
        it('29', function (done) {
            msgMatch(':build Shopping_bot_ch reset', '您好，我是购物机器人.\n欢迎使用配送查询，订单取消和商品检索功能.', done);
        });




        /*
         add a test case here
         it('bot should return "expected" for "msg", function(done) {
         bot_test(bot_name, 'msg', "expected", done);
         });
         */
    });
});
