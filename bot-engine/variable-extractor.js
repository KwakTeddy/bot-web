var ContextManager = require('./context-manager.js');

(function()
{
    var VariableExtractor = function()
    {

    };

    VariableExtractor.prototype.extract = function(userId, botId, rawText, nlp)
    {
        var context = ContextManager.getContext(userId, botId);
    };

    module.exports = new VariableExtractor();
})();
