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

    Context.prototype.createDialogInstance = function(srcDialog, userInput)
    {
        var children = srcDialog.children;
        delete srcDialog.children;

        var dialogInstance = utils.clone(srcDialog);
        dialogInstance.originalInput = dialogInstance.input;
        dialogInstance.originalOutput = utils.clone(dialogInstance.output);
        dialogInstance.userInput = userInput;
        dialogInstance.options = {};
        dialogInstance.data = {};

        delete dialogInstance.input;

        srcDialog.children = children;

        return dialogInstance;
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
