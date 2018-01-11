module.exports = function(globals)
{
    globals.setTypeChecks('stringTypeCheck', function(text, type, task, context, callback)
    {
        task[type.name] = text;
        callback(text, task, true);
    });
}
