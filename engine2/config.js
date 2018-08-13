var path = require('path');
module.exports = (function()
{
    var config = {};
    config.path = {};
    config.path.engine = path.resolve('./engine2');
    config.path.bots = path.resolve('./custom_modules');

    return config;
})();
