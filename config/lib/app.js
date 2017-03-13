'use strict';
var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));

process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;

// error 발생해도 node 죽지 않게
process.on('uncaughtException', function (err) {
  logger.error('Caught exception: ' + err);
  logger.error(err.stack);
});


/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);

  });
};

module.exports.start = function start(callback) {
  var _this = this;

  var bot = require('./bot');
  var globals = require(path.resolve('modules/bot/engine/common/globals'));
  globals.initGlobals();

  var autoCorrection = require(path.resolve('modules/bot/engine/nlp/autoCorrection'));
  autoCorrection.loadWordCorrections();

  bot.loadBots();
  // bot.loadBot('csdemo');
  // bot.loadBot('athena');

  _this.init(function (app, db, config) {

    // Start the app by listening on <port>
    app.listen(config.port, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }
      console.log(chalk.green('App version:\t\t\t' + config.meanjs.version));
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green('MEAN.JS version:\t\t\t' + config.meanjs['meanjs-version']));
      console.log('--');

      console.log(chalk.red('CHAT_SERVER:\t\t\t' + process.env.CHAT_SERVER));
      if (callback) callback(app, db, config);
    });

  });

};
