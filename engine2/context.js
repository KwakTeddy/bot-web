(function()
{
    var Context = function()
    {
    };

    Context.prototype.create = function()
    {
        var context = {};
        context.user = {};
        context.history = [];
        context.returnDialog = undefined;
        context.dialogCursor = undefined;
        context.types = {};

        return context;
    };

    Context.prototype.make = function(nlu, dialog, prev)
    {
        var context = {};
        context.nlu = nlu;
        context.dialog = dialog;
        context.prev = prev;
        context.userData = {};

        return context;
    };

    module.exports = new Context();
})();
