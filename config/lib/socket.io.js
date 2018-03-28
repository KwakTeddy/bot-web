'use strict';

// Load the module dependencies
var config = require('../config');
var path = require('path');
var logger = require('./logger.js');
var fs = require('fs');
var http = require('http');
var https = require('https');
var constants = require('constants');
var socketio = require('socket.io');

// Define the Socket.io configuration method
module.exports = function (app, db)
{
    var server = undefined;
    if (config.secure && config.secure.ssl === true)
    {
        // Load SSL key and certificate
        var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
        var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
        var ca = fs.readFileSync(path.resolve(config.secure.ca), 'utf8');
        var options =
        {
            key: privateKey,
            cert: certificate,
            ca: ca
            // requestCert : true,
            //rejectUnauthorized : true,
            // secureProtocol: 'TLSv1.2_method',
            // secureProtocol: 'SSLv23_method',
            // secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
            // ciphers: [
            //     'ECDHE-RSA-AES128-GCM-SHA256',
            //     'ECDHE-ECDSA-AES128-GCM-SHA256',
            //     'ECDHE-RSA-AES256-GCM-SHA384',
            //     'ECDHE-ECDSA-AES256-GCM-SHA384',
            //     'DHE-RSA-AES128-GCM-SHA256',
            //     'ECDHE-RSA-AES128-SHA256',
            //     'DHE-RSA-AES128-SHA256',
            //     'ECDHE-RSA-AES256-SHA384',
            //     'DHE-RSA-AES256-SHA384',
            //     'ECDHE-RSA-AES256-SHA256',
            //     'DHE-RSA-AES256-SHA256',
            //     'HIGH',
            //     '!aNULL',
            //     '!eNULL',
            //     '!EXPORT',
            //     '!DES',
            //     '!RC4',
            //     '!MD5',
            //     '!PSK',
            //     '!SRP',
            //     '!CAMELLIA'
            // ].join(':'),
            // honorCipherOrder: true
        };

        // Create new HTTPS Server
        server = https.createServer(options, app);

        // HTTP to HTTPS redirect
        http.createServer(function (req, res)
        {
            var host = req.header("host");

            return res.redirect(301, 'https://' + host + req.path);
            // res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            // res.end();
        }).listen(80);

    }
    else
    {
        // Create a new HTTP server
        server = http.createServer(app);
    }

    // Create a new Socket.io server
    var io = socketio.listen(server);

    // console.log();
    // logger.systemInfo('============== socket.io require modules - socket.io.js =============');
    // logger.systemInfo(config.files.server.sockets.toString().replace(/,/gi, '\n'));
    // logger.systemInfo('=====================================================================');

    return { server: server, app: app, io: io };
};
