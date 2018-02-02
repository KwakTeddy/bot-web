(function()
{
    var AsyncTransaction = function()
    {
        this.list = [];
        this.count = 0;
        this.doneCallback = undefined;
    };

    AsyncTransaction.prototype.callback = function(f)
    {
        var that = this;
        this.list.push(f);

        return function()
        {
            var args = [];
            for(var i=0; i<arguments.length; i++)
            {
                args.push(arguments[i]);
            }

            args.push(function()
            {
                that.count++;
                if(that.list.length == that.count && that.doneCallback)
                {
                    that.doneCallback.call(that);
                }
            });

            f.apply(this, args);
        }
    };

    AsyncTransaction.prototype.done = function(f)
    {
        this.doneCallback = f;
    };

    var SyncTransaction = function()
    {
        this.list = [];
    };

    SyncTransaction.prototype.call = function(f)
    {
        this.list.push(f);
    };

    SyncTransaction.prototype.callNext = function()
    {
        var that = this;
        if(this.list.length > 0)
        {
            var next = this.list.splice(0, 1);
            next[0].call(next[0], function()
            {
                that.callNext();
            });
        }
    };

    SyncTransaction.prototype.done = function(f)
    {
        this.list.push(f);
        this.callNext();
    };

    module.exports.async = AsyncTransaction;
    module.exports.sync = SyncTransaction;
})();
