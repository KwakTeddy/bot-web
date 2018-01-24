(function()
{
    var MAX = 10;

    var Context = function()
    {
        var initContext = {};
        initContext.nlu = {};

        this.history = [initContext];
    };

    Context.prototype.get = function()
    {
        return this.history[this.history.length-1];
    };

    Context.prototype.make = function()
    {
        var context = {
            nlu: {}
        };

        this.history.push(context);

        if(this.history.length > MAX)
        {
            this.history.splice(0, 1);
        }

        return context;
    };

    module.exports = Context;
})();
