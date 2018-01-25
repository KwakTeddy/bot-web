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
        this.doneCallback = undefined;
    };

    SyncTransaction.prototype.callback = function(f)
    {
        var that = this;

        return function()
        {
            var args = [];
            for(var i=0; i<arguments.length; i++)
            {
                args.push(arguments[i]);
            }

            args.push(function()
            {
                that.callNext();
            });

            that.list.push(function()
            {
                f.apply(this, args);
            });
        };
    };

    SyncTransaction.prototype.callNext = function()
    {
        if(this.list[0])
        {
            var next = this.list.splice(0, 1);
            next[0]();
        }
        else
        {
            this.doneCallback();
        }
    };

    SyncTransaction.prototype.done = function(f)
    {
        this.doneCallback = f;
        this.callNext();
    };

    module.exports.async = AsyncTransaction;
    module.exports.sync = SyncTransaction;
})();
