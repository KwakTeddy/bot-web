// 'use strict';
//
// var assert = require('assert');
// var path = require('path');
// var mongoose = require(path.resolve('config/lib/mongoose.js'));
// var bot_server;
// var bot;
//
// describe('Bot', function () {
//   var channel = "socket";
//   var bot_name = 'test4';
//   var user = 'com2best';
//
//   var msgEqual = function (msg, expected, done) {
//     bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
//       assert.equal(out, expected);
//       done();
//     });
//   };
//
//   var msgMatch = function (msg, expected, done) {
//     bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
//       assert.notEqual(-1, out.search(new RegExp(expected, 'i')));
//       done();
//     });
//   };
//
//   before(function () {
//     var app = require(path.resolve('config/lib/app.js'));
//     app.start();
//
//     bot_server = require(path.resolve('./engine/bot.js.js'));
//     bot = require(path.resolve('engine/bot/server/controllers/bot.server.controller'));
//   });
//
//   describe('lgdemo', function () {
//     // before(function () {
//     //   bot_server.loadBot(bot_name);
//     // });
//
//     it('load', function(done) {
//       bot_server.loadBot(bot_name, function() {
//         done();
//       });
//     });
//
//     it('1', function (done) {
//       msgEqual(':reset user', "안녕하세요. 머니브레인 고객센터입니다.", done);
//     });
//
//     it('2', function (done) {
//       msgMatch('센터 찾아줘', "몰라 몰라", done);
//     });
//
//     it('3', function (done) {
//       msgMatch('여의도', "영등포구 여의도동", done);
//     });
//
//     /*
//      add a test case here
//      it('bot should return "expected" for "msg", function(done) {
//      bot_test(bot_name, 'msg', "expected", done);
//      });
//      */
//   });
// });
//
