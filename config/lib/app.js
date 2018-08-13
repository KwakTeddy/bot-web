'use strict';
var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var loadbalancer = require(path.resolve('engine/bot/engine/loadbalancer/loadbalancer'));

process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;

// error 발생해도 node 죽지 않게
process.on('uncaughtException', function (err)
{
    logger.error('Caught exception: ' + err);
    logger.error(err.stack);
});


/**
 * Module dependencies.
 */
var config = require('../config');
var mongoose = require('./mongoose');
var express = require('./express');
var chalk = require('chalk');
var seed = require('./seed');

function seedDB()
{
    if (config.seedDB && config.seedDB.seed)
    {
        console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
        seed.start();
    }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels()
{
    mongoose.loadModels();
};

module.exports.init = function init(callback)
{
    mongoose.connect(function (db)
    {
        var app = express.init(db);
        if (callback)
        {
            callback(app, db, config);
        }
    });
};

module.exports.start = function start(callback)
{
    var fs = require('fs');
    var list = fs.readdirSync(path.resolve('./engine/models'));
    for(var i=0; i<list.length; i++)
    {
        require(path.resolve('./engine/models/' + list[i]));
    }

    var globals = require(path.resolve('engine/bot/engine/common/globals'));
    globals.initGlobals();
    var autoCorrection = require(path.resolve('engine/bot/engine/nlp/autoCorrection'));
    autoCorrection.loadWordCorrections();

    this.init(function (app, db, config)
    {
        if(config.loadBalance.use)
        {
            loadbalancer.init();
        }

        app.server.listen(config.port, function ()
        {
            app.io.on('connection', function (socket)
            {
                console.log('커넥션');
                require(path.resolve('./engine/bot/server/sockets/bot.server.socket.config.js'))(app.io, socket);
                require(path.resolve('./modules/demo/server/controllers/demo.server.controller.js'))(app.io, socket);
            });

            // Logging initialization
            console.log();
            console.log(chalk.green('================= Server Started ==================='));
            console.log(chalk.green(config.app.title));
            console.log(chalk.green('Environment     : ' + process.env.NODE_ENV));
            console.log(chalk.green('Port            : ' + config.port));
            console.log(chalk.green('Database        : ' + config.db.uri));
            if (process.env.NODE_ENV === 'secure')
            {
                console.log(chalk.green('HTTPs           : on'));
            }

            console.log(chalk.green('App version     : ' + config.meanjs.version));

            if (config.meanjs['meanjs-version'])
                console.log(chalk.green('MEAN.JS version : ' + config.meanjs['meanjs-version']));

            console.log(chalk.green('===================================================='));
            console.log();

            if(callback)
                callback(app.server, db, config);
        });

        // require(path.resolve('./bot-engine2/core.js')).initialize(app, function()
        // {
        //     app.server.listen(config.port, function ()
        //     {
        //         // Logging initialization
        //         console.log();
        //         console.log(chalk.green('================= Server Started ==================='));
        //         console.log(chalk.green(config.app.title));
        //         console.log(chalk.green('Environment     : ' + process.env.NODE_ENV));
        //         console.log(chalk.green('Port            : ' + config.port));
        //         console.log(chalk.green('Database        : ' + config.db.uri));
        //         if (process.env.NODE_ENV === 'secure')
        //         {
        //             console.log(chalk.green('HTTPs           : on'));
        //         }
        //
        //         console.log(chalk.green('App version     : ' + config.meanjs.version));
        //
        //         if (config.meanjs['meanjs-version'])
        //             console.log(chalk.green('MEAN.JS version : ' + config.meanjs['meanjs-version']));
        //
        //         console.log(chalk.green('===================================================='));
        //         console.log();
        //
        //         if(callback)
        //             callback(app.server, db, config);
        //     });
        // });

        // var io = app.io;
        // app.server.listen(config.port, function ()
        // {
        //     // Add an event listener to the 'connection' event
        //     io.on('connection', function (socket)
        //     {
        //         require(path.resolve('./bot-engine/core.js')).initialize(io, socket);
        //     });
        //
        //     // Logging initialization
        //     console.log();
        //     console.log(chalk.green('================= Server Started ==================='));
        //     console.log(chalk.green(config.app.title));
        //     console.log(chalk.green('Environment     : ' + process.env.NODE_ENV));
        //     console.log(chalk.green('Port            : ' + config.port));
        //     console.log(chalk.green('Database        : ' + config.db.uri));
        //     if (process.env.NODE_ENV === 'secure')
        //     {
        //         console.log(chalk.green('HTTPs           : on'));
        //     }
        //
        //     console.log(chalk.green('App version     : ' + config.meanjs.version));
        //
        //     if (config.meanjs['meanjs-version'])
        //         console.log(chalk.green('MEAN.JS version : ' + config.meanjs['meanjs-version']));
        //
        //     console.log(chalk.green('===================================================='));
        //     console.log();
        //
        //     if(callback)
        //         callback(app.server, db, config);
        // });
    });
};
