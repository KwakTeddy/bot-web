'use strict';

var assert = require('assert');

var path = require('path');
var _ = require('lodash');
var mongoose = require(path.resolve('config/lib/mongoose.js'));
var bot_server = require(path.resolve('config/lib/bot.js'));
var bot;

describe('Bot', function() {
    var channel = "socket";
    var user = 'com2best';
    var chatscriptConfig = {port: 0, host: '', allowHalfOpen: true};

    var bot_test = function(bot_name, msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, function(out, task) {
            assert.equal(out, expected );
            //assert.equal(task, undefined);
            done();
        }, _.assign(chatscriptConfig, {host: 'localhost', port: '1024'}));
    };

    before(function() {
        mongoose.loadModels();
        mongoose.connect( function(db) {} );
        bot_server.initGlobals();
        bot = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));

    });

    describe('lgdemo', function() {
        var bot_name = 'lgdemo';
        before (function() {
            bot_server.loadBot(bot_name);
        });

        it('bot should return 안녕하세요. LG전자 고객센터 데모 입니다. for :reset user', function(done) {
            bot_test(bot_name, ':reset user', "안녕하세요. LG전자 고객센터 데모 입니다.", done);
        });

        /*
         add a test case here
        it('bot should return "expected" for "msg", function(done) {
            bot_test(bot_name, 'msg', "expected", done);
        });
         */
    });
});

