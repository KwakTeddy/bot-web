(function()
{
    var MAX = 10;

    var Context = function()
    {
        this.initContext = {};
        this.initContext.nlu = {};
        this.initContext.userData = {};

        this.history = [this.initContext];
    };

    Context.prototype.get = function()
    {
        return this.history[this.history.length-1];
    };

    Context.prototype.make = function()
    {
        var context = JSON.parse(JSON.stringify(this.initContext));

        if(this.history.length > 0)
        {
            context.prev = this.history[this.history.length-1];
        }

        this.history.push(context);

        if(this.history.length > MAX)
        {
            this.history.splice(0, 1);
        }

        return context;
    };

    module.exports = Context;
})();
