'use strict';

/**
 * Module dependencies.
 */
//var kakao = require('../controllers/kakao.server.controller');
var line = require('../controllers/line.server.controller');
var facebook = require('../controllers/facebook.server.controller');

module.exports = function (app) {
  // 카카오톡
  //app.route('/keyboard').get(kakao.keyboard);
  //app.route('/message').post(kakao.message);
  //app.route('/friend').post(kakao.friend);
  //app.route('/friend/:user_key').delete(kakao.deleteFriend);
  //app.route('/chat_room/:user_key').delete(kakao.deleteChatRoom);

  // 라인
  app.route('/receive').get(line.receiveGet);
  app.route('/receive').post(line.receive);

  // 페이스북
  app.route('/webhook').get(facebook.messageGet);
  app.route('/webhook').post(facebook.message);

};
