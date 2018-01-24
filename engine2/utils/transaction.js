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

    module.exports.async = AsyncTransaction;
})();
