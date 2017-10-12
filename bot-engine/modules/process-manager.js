var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

(function()
{
    var ProcessManager = function()
    {
        this.nextProcess = undefined;
        this.processList = {};
    };

    ProcessManager.prototype.addProcess = function(name, process)
    {
        this.processList[name] = process;
    };

    ProcessManager.prototype.execute = function()
    {
        this.processQueue[this.nextProcess](arguments);
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
