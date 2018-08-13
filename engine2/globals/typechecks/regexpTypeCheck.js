module.exports = function(globals)
{
    globals.setTypeChecks('regexpTypeCheck', function (dialog, context, callback)
    {
        var type = this;
        var parsed = undefined;
        var re = type.regexp;
        var matched = false;


        var inputRaw = dialog.userInput.text;


        var matchs = inputRaw.match(re);

        console.log(matchs);

        if(matchs && matchs.length > 0)
        {
            matched = true;
            parsed = matchs[0];

            // dialog.userInput.text = inputRaw.replace(matchs[0], '+' + type.name + '+');
        }

        // dialog.userInput.text = inputRaw.replace(re, function(match, p1)
        // {
        //     matched = true;
        //     parsed = p1;
        //     return '+' + type.name + '+';
        // });

        callback(matched, parsed);
    });
};
