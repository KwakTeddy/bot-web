var path = require('path');

module.exports = function()
{
    global._botEngineModules = {};
    global._botEngineModules.nlpManager = path.resolve('./bot-engine/modules/nlp-manager.js');
};
