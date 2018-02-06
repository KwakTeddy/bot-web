(function()
{
    var Context = function()
    {
    };

    Context.prototype.create = function()
    {
        var context = {};
        context.globals = undefined;
        context.user = {};
        context.bot = undefined;
        context.channel = {};
        context.session =
        {
            history: [],
            currentDialog: undefined,
            returnDialog: undefined,
            dialogCursor: undefined
        };

        return context;
    };

    Context.prototype.createDialog = function()
    {
        var dialog = {};
        dialog.originalInput = [];
        dialog.originalOutput = [];
        dialog.input = {
            types: {}
        };
        dialog.task = {};
        dialog.data = {};
        dialog.options = {};
        dialog.output = [];

        return dialog;
    };

    Context.prototype.init = function(context)
    {
        if(!context.user)
        {
            context.user = {};
        }

        if(!context.channel)
        {
            context.channel = {};
        }

        if(!context.session)
        {
            context.session = {};
        }
    };

    module.exports = new Context();
})();
