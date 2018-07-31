'use strict';

/**
 * Module dependencies.
 */
var config = require('../config.js');
var chalk = require('chalk');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('./logger.js');

// Load the mongoose models
module.exports.loadModels = function (callback)
{
    // Globbing model files
    config.files.server.models.forEach(function (modelPath)
    {
        require(path.resolve(modelPath));
    });

    console.log();
    logger.systemInfo('======== Server Database Models require modules - mongoose.js =======');
    logger.systemInfo(config.files.server.models.toString().replace(/,/gi, '\n'));
    logger.systemInfo('=====================================================================');

    if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = function (cb)
{
    var _this = this;

    var db = mongoose.connect(config.db.uri, config.db.options, function (err)
    {
        // Log Error
        if (err)
        {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(err);
        }
        else
        {
            mongoose.set('debug', config.db.debug);

            // Call callback FN
            if (cb) cb(db);
        }
    });
};

module.exports.disconnect = function (cb)
{
    mongoose.disconnect(function (err)
    {
        console.info(chalk.yellow('Disconnected from MongoDB.'));
        cb(err);
    });
};
