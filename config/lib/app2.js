'use strict';

module.exports.start = function() {
  var express = require('express');
  var session = require('express-session');
  var app = express();
  var http = require('http');
  var bodyParser = require('body-parser');
  var path = require('path');
  // var rest = require(path.resolve('./engine/bot/server/controllers/rest.server.controller'));
  var kakao = require(path.resolve('./engine2/channel/kakao.js'));
  // var wechat = require(path.resolve('./engine/bot/server/controllers/wechat.server.controller'));
  // var action = require(path.resolve('./engine/bot/server/controllers/_action.server.controller'));
  var path = require('path');

  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json()); // for parsing application/jsonå
  app.use(session({
    secret: 'moneybrain',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  var swig = require('swig');
  var swig = new swig.Swig();
  app.engine('server.view.html', swig.renderFile);
  app.set('view engine', 'server.view.html');
  app.set('views', './');

  app.use('/', express.static(path.resolve('./public')));

  var httpsServer = http.createServer(app);
  httpsServer.listen(3000, function() {
    console.log('listening on *:3000')
  });

  // app.route('/chat/:bot/message').post(rest.message);

  app.route('/kakao/:bot/keyboard').get(kakao.keyboard);
  app.route('/kakao/:bot/message').post(kakao.message);
  app.route('/kakao/:bot/friend').post(kakao.friend);
  app.route('/kakao/:bot/friend/:user_key').delete(kakao.deleteFriend);
  app.route('/kakao/:bot/chat_room/:user_key').delete(kakao.deleteChatRoom);

  // app.route('/wechat/:bot/webhook').get(wechat.message);
  // app.route('/wechat/:bot/webhook').post(wechat.message);

  // app 실행하기
  // app.route('/bot/app/:androidUrl/:androidStore/:iosUrl/:iosStore').get(action.appExec);
};

