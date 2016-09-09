var path = require('path');
var config = require(path.resolve('./config/config'));
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: config.log.level}),
  ]
});

logger.level = config.log.level;
logger.info('Log Level: ' + logger.level);

module.exports = logger;