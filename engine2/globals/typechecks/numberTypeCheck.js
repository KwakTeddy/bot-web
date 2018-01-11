module.exports = function(globals)
{
    globals.setTypeChecks('numberTypeCheck', function(text, type, task, context, callback)
    {
        if(text.search(/^(\d)+$/g) != -1)
        {
            task[type.name] = text;
            callback(text, task, true);
        }
        else
        {
            callback(text, task, false);
        }
    });
};
