'use strict';

module.exports.start = function() {
  var express = require('express');
  var session = require('express-session');
  var app = express();
  var http = require('http');
  var bodyParser = require('body-parser');
  var kakao = require('../../modules/bot/server/controllers/kakao.server.controller');
  var action = require('../../modules/bot/server/controllers/_action.server.controller');

  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json()); // for parsing application/jsonå
  app.use(session({
    secret: 'moneybrain',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  // app.set('view engine', 'ejs');
  // app.engine('.html', require('ejs').renderFile());

  var swig = require('swig');
  var swig = new swig.Swig();
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');

  // app.engine('html', consolidate['swig']);
  // app.set('view engine', 'html');
  // // app.set('views', './');

  var httpsServer = http.createServer(app);
  httpsServer.listen(3000, function() {
    console.log('listening on *:3000')
  });

  app.route('/kakao/:botId/keyboard').get(kakao.keyboard);
  app.route('/kakao/:botId/message').post(kakao.message);
  app.route('/kakao/:botId/friend').post(kakao.friend);
  app.route('/kakao/:botId/friend/:user_key').delete(kakao.deleteFriend);
  app.route('/kakao/:botId/chat_room/:user_key').delete(kakao.deleteChatRoom);

  // app 실행하기
  app.route('/bot/app/:androidUrl/:androidStore/:iosUrl/:iosStore')
    .get(action.appExec);
}

