'use strict';

/**
 * Module dependencies.
 */
var kakao = require('../controllers/kakao.server.controller');
var line = require('../controllers/line.server.controller');
var facebook = require('../controllers/facebook.server.controller');
var navertalk = require('../controllers/navertalk.server.controller');

module.exports = function (app) {
  // 카카오톡
  app.route('/kakao/:bot/keyboard').get(kakao.keyboard);
  app.route('/kakao/:bot/message').post(kakao.message);
  app.route('/kakao/:bot/friend').post(kakao.friend);
  app.route('/kakao/:bot/friend/:user_key').delete(kakao.deleteFriend);
  app.route('/kakao/:bot/chat_room/:user_key').delete(kakao.deleteChatRoom);

  // 라인
  app.route('/line/:bot/receive').get(line.receiveGet);
  app.route('/line/:bot/receive').post(line.receiveNew);

  // 페이스북
  app.route('/facebook/:bot/webhook').get(facebook.messageGet);
  app.route('/facebook/:bot/webhook').post(facebook.message);

  // 네이버 톡톡
  app.route('/navertalk/:bot/webhook').post(navertalk.message);

};
