'use strict';

module.exports.start = function() {
  var express = require('express');
  var session = require('express-session');
  var app = express();
  var http = require('http');
  var bodyParser = require('body-parser');
  var kakao = require('../../modules/channels/server/controllers/kakao.server.controller');

  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json()); // for parsing application/jsonå
  app.use(session({
    secret: 'moneybrain',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  var httpsServer = http.createServer(app);
  httpsServer.listen(3000, function() {
    console.log('listening on *:3000')
  });

  app.route('/keyboard').get(kakao.keyboard);
  app.route('/message').post(kakao.message);
  app.route('/friend').post(kakao.friend);
  app.route('/friend/:user_key').delete(kakao.deleteFriend);
  app.route('/chat_room/:user_key').delete(kakao.deleteChatRoom);
}
