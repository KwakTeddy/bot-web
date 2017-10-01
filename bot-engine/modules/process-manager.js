var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

(function()
{
    var ProcessManager = function()
    {
        this.processQueue = [];
        this.nextProcessIndex = 0;
    };

    ProcessManager.prototype.addProcess = function(process)
    {
        this.processQueue.push(process);
    };

    ProcessManager.prototype.execute = function()
    {
        this.processQueue[this.nextProcessIndex](arguments);
    };

    ProcessManager.prototype.error = function(err)
    {
        logger.systemError('\n================================================');
        logger.systemError(err.stack ? err.stack : err);
        logger.systemError('================================================');

        //errorCallback;
    };

    module.exports = new ProcessManager();
})();
