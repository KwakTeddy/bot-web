var utils = require('./utils/utils.js');

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

    Context.prototype.createDialog = function(srcDialog, userInput)
    {
        var cloneDialog = utils.clone(srcDialog);
        cloneDialog.originalInput = cloneDialog.input;
        cloneDialog.originalOutput = utils.clone(cloneDialog.output);
        cloneDialog.userInput = userInput;
        cloneDialog.options = {};
        cloneDialog.data = {};

        return cloneDialog;
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
