module.exports = function(globals)
{
    globals.setTypeChecks('numberTypeCheck', function(dialog, context, callback)
    {
        var text = dialog.userInput.text;
        if(text.search(/^(\d)+$/g) != -1)
        {
            callback(true, text);
        }
        else
        {
            callback(false);
        }
    });
};
