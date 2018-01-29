module.exports = function(globals)
{
    globals.setTypeChecks('regexpTypeCheck', function (inputRaw, type, callback)
    {
        var parsed = undefined;
        var re = type.regexp;

        inputRaw.replace(re, function(match, p1)
        {
            parsed = p1;
            return '+' + type.name + '+';
        });

        callback(parsed);
    });
};
