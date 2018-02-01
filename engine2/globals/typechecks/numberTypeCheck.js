module.exports = function(globals)
{
    globals.setTypeChecks('numberTypeCheck', function(conversation, context, callback)
    {
        var text = conversation.nlu.inputRaw;
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
