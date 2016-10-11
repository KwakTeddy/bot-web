var path = require('path');
var config = require(path.resolve('./config/config'));
var winston = require('winston');

// var logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)({ level: config.log.level, colorize: false})
//   ]
// });
//
// logger.level = config.log.level;
// logger.info('Log Level: ' + logger.level);

var logger = {
  verbose: function(text) {console.log(text);},
  info: function(text) {console.log(text);},
  debug: function(text) {console.log(text);},
  error: function(text) {console.error(text);}
};

module.exports = logger;


