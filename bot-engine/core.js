var socketReceiver = require('./receiver/socket-receiver.js');
var contextManager = require('./context-manager.js');
var nlpManager = require('./nlp-manager.js');
var nluManager = require('./nlu-manager.js');
var VariableExtractor = require('./variable-extractor.js');
var DialogAnalysor = require('./dialog-analysor.js');
var TaskManager = require('./task-manager.js');
var OutputManager = require('./output-manager.js');

var SyncProcess = require('./utils/sync-process.js');

(function()
{
    var Core = function()
    {
    };

    Core.prototype.initialize = function(app, io)
    {
        socketReceiver.initialize(this, io);
    };

    Core.prototype.process = function(userId, botId, rawText, responseCallback)
    {
        contextManager.makeContext(userId, botId);

        nlpManager.process(userId, botId, rawText);

        nluManager.process(userId, botId, nlp);

        VariableExtractor.extract(userId, botId, rawText, nlp);

        var dialog = DialogAnalysor.analysis(userId, botId, rawText, nlp);

        TaskManager.execute(dialog);

        OutputManager.execute(dialog);
    };

    module.exports = new Core();
})();
