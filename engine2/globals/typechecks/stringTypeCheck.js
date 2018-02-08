module.exports = function(globals)
{
    globals.setTypeChecks('stringTypeCheck', function(dialog, context, callback)
    {
        callback(true, dialog.userInput.text);
    });
}
