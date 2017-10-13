(function()
{
    var AsyncProcess = function(count)
    {
        this.count = 0;
        this.doneCallback = undefined;

        this.list = {};
        
        for(var i=0; i<count; i++)
        {
            this.list[i] = false;
        }
    };

    AsyncProcess.prototype.makeAsyncProcess = function()
    {
        var index = this.count;
        this.list[index] = false;

        var that = this;
        var done = function()
        {
            that.list[index] = true;
            that.processDone();
        };

        this.count++;

        return done;
    };

    AsyncProcess.prototype.processDone = function()
    {
        for(var key in this.list)
        {
            if(!this.list[key])
                return;
        }

        this.doneCallback();
    };

    AsyncProcess.prototype.done = function(callback)
    {
        this.doneCallback = callback;
    };


    module.exports = AsyncProcess;
})();
