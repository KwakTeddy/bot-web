'use strict';

/**
 * Module dependencies.
 */
var kakao = require('../controllers/kakao.server.controller');
var line = require('../controllers/line.server.controller');
var facebook = require('../controllers/facebook.server.controller');

module.exports = function (app) {
  // 카카오톡
  app.route('/kakao/:botId/keyboard').get(kakao.keyboard);
  app.route('/kakao/:botId/message').post(kakao.message);
  app.route('/kakao/:botId/friend').post(kakao.friend);
  app.route('/kakao/:botId/friend/:user_key').delete(kakao.deleteFriend);
  app.route('/kakao/:botId/chat_room/:user_key').delete(kakao.deleteChatRoom);

  // 라인
  app.route('/line/:botId/receive').get(line.receiveGet);
  app.route('/line/:botId/receive').post(line.receive);

  // 페이스북
  app.route('/facebook/:botId/webhook').get(facebook.messageGet);
  app.route('/facebook/:botId/webhook').post(facebook.message);

};
