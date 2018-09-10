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
        if(matchs && matchs.length > 0)
        {
            matched = true;
            parsed = matchs[0];

            if(type.name=='mobile'){
                context.user.mobile = dialog.userInput.text
            }else if(type.name=='name'){
                context.user.name = dialog.userInput.text
            }else if(type.name=='date'){
                context.user.date = dialog.userInput.text
            }
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
