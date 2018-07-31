'use strict';
var path = require('path');
var fs = require('fs');
var logger = require(path.resolve('./config/lib/logger'));
// var loadbalancer = require(path.resolve('engine/bot/engine/loadbalancer/loadbalancer'));

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
    var redis = require('redis');

    var client = redis.createClient(6379, config.redis.host);

    console.log('[Load Engine Models START]');
    var list = fs.readdirSync(path.resolve('./engine2/models'));
    for(var i=0; i<list.length; i++)
    {
        require(path.resolve('./engine2/models/' + list[i]));
        console.log(list[i]);
    }
    console.log('[Load Engine Models END]');
    console.log();

    var Engine = require(path.resolve('./engine2/core.js'));

    this.init(function (app, db, config)
    {
        client.on('connect', function()
        {
            console.log(chalk.green('sdf redis connected!'));
            console.log();
        });

        Engine.setRedisClient(client);

        app.server.listen(config.port, function ()
        {
            Engine.init(app.app, app.io);

            console.log();
            console.log(chalk.green('================= Server Started ==================='));

            // Logging initialization
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
    });
};
