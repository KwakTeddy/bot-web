(function()
{
    var Context = function()
    {
    };

    Context.prototype.make = function(nlu, dialog, prev)
    {
        var context = {};
        context.nlu = nlu;
        context.dialog = dialog;
        context.prev = prev;

        return context;
    };

    module.exports = new Context();
})();
