module.exports = function(globals)
{
    globals.setTypeChecks('regexpTypeCheck', function (userInput, context, callback)
    {
        var type = this;
        var parsed = undefined;
        var re = type.regexp;
        var matched = false;

        var inputRaw = userInput.text;
        userInput.text = inputRaw.replace(re, function(match, p1)
        {
            matched = true;
            parsed = p1;
            return '+' + type.name + '+';
        });

        callback(matched, parsed);
    });
};
