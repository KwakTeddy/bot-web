module.exports = function(globals)
{
    globals.setTypeChecks('numberListTypeCheck', function(dialog, context, callback)
    {
        var text = dialog.userInput.text;

        try
        {
            var num = new Number(text);

            if (num >= 1 && num <= this.length)
            {
                callback(true, num);
            }
            else
            {
                callback(false);
            }
        }
        catch(err)
        {
            callback(false);
        }
    });
};
