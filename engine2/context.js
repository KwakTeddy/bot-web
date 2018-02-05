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
            currentDialog: undefined, // dialogCursor가 있는 dialog previousDialog는 이전에 실행된. parent는 논리적인 부모
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
        dialog.input = {};
        dialog.task = {};
        dialog.data = {};
        dialog.options = {};
        dialog.output = {};

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
