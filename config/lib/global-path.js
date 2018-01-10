var path = require('path');

module.exports = function()
{
    global._botEngineModules = {
        nlpManager: path.resolve('./bot-engine/modules/nlp-manager.js'),
        mongoose: path.resolve('./bot-engine/modules/common/mongo-wrapper.js'),
        models: path.resolve('./bot-engine/modules/models'),
        asyncProcess: path.resolve('./bot-engine/modules/common/async-process/core.js')
    };
};
