'use strict';

// Load the module dependencies
var config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  tls = require('tls'),
  constants = require('constants'),
  passport = require('passport'),
  socketio = require('socket.io'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);

// Define the Socket.io configuration method
module.exports = function (app, db) {
  var server;
  if (config.secure && config.secure.ssl === true) {
    // Load SSL key and certificate
    var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
    var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
    var ca = fs.readFileSync(path.resolve(config.secure.ca), 'utf8');
    var options = {
      key: privateKey,
      cert: certificate,
      ca: ca,
      requestCert : true,
      //rejectUnauthorized : true,
      // secureProtocol: 'TLSv1.2_method',
      secureProtocol: 'SSLv23_method',
      secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,

      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        'DHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'DHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA256',
        'DHE-RSA-AES256-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':'),
      honorCipherOrder: true,
      SNICallback: function(servername, cb) {
        var certificates = {
          "bot.moneybrain.ai": [privateKey, certificate]
        };
        if (certificates[servername]) {
          var ctx = tls.createSecureContext({
            key: certificates[servername][0],
            cert: certificates[servername][1]
            // passphrase: passphrase
          });
          // Compatibility with old versions of node
          if (cb) {
            cb(null, ctx);
          } else {
            return ctx;
          }
        }
      }
    };

    // Create new HTTPS Server
    server = https.createServer(options, app);
  } else {
    // Create a new HTTP server
    server = http.createServer(app);
  }
  // Create a new Socket.io server
  var io = socketio.listen(server);

  // Create a MongoDB storage object
  var mongoStore = new MongoStore({
    mongooseConnection: db.connection,
    collection: config.sessionCollection
  });

  // Intercept Socket.io's handshake request
  // io.use(function (socket, next) {
  //   // Use the 'cookie-parser' module to parse the request cookies
  //   cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
  //     // Get the session id from the request cookies
  //     var sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;
  //
  //     if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);
  //
  //     // Use the mongoStorage instance to get the Express session information
  //     mongoStore.get(sessionId, function (err, session) {
  //       if (err) return next(err, false);
  //       if (!session) return next(new Error('session was not found for ' + sessionId), false);
  //
  //       // Set the Socket.io session information
  //       socket.request.session = session;
  //
  //       // Use Passport to populate the user details
  //       passport.initialize()(socket.request, {}, function () {
  //         passport.session()(socket.request, {}, function () {
  //           if (socket.request.user) {
  //             next(null, true);
  //           } else {
  //             next(new Error('User is not authenticated'), false);
  //           }
  //         });
  //       });
  //     });
  //   });
  // });

  // Add an event listener to the 'connection' event
  io.on('connection', function (socket) {
    //require("../../modules/bot/server/sockets/bot.server.socket.config.js")(io, socket);
    //var chat = require("../../modules/bot/server/sockets/bot.server.socket.config");
    //var chat = require(path.resolve("modules/bot/server/sockets/bot.server.socket.config.js"));
    //chat(io, socket);

    config.files.server.sockets.forEach(function (socketConfiguration) {
      require(path.resolve(socketConfiguration))(io, socket);
    });
  });

  return server;
};
