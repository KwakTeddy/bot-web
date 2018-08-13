/**
 * Created by moneybrain on 2017. 7. 5..
 */

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
    var bot_name = 'sample';
    var user = 'com2best';

    var msgEqual = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            assert.equal(out, expected);
            done();
        });
    };

    var msgMatch = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            console.log('---------------------------------------\n' + out + '\n---------------------------------------\n' +  expected + '\n' + out.search(new RegExp(expected, 'i')));
            assert.notEqual(-1, out.search(new RegExp(expected, 'i')));
            done();
        });
    };

    before(function () {
        var app = require(path.resolve('config/lib/app.js'));
        app.start();

        bot_server = require(path.resolve('./bot-engine/bot.js'));
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
            msgMatch(':reset user', 'sample 입니다', done);
        });
        it('2', function (done) {
            msgMatch('찾다', '텍스트 내용을 출력합니다.2', done);
        });
        it('3', function (done) {
            msgMatch('정규식', 'RegExp 매치 되면 내용 출력합니다.', done);
        });






        /*
         add a test case here
         it('bot should return "expected" for "msg", function(done) {
         bot_test(bot_name, 'msg', "expected", done);
         });
         */
    });
});
