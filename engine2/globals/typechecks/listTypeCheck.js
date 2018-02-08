module.exports = function(globals)
{
    globals.setTypeChecks('listTypeCheck', function(dialog, context, callback)
    {
        if(this.listName && this.field)
        {
            var text = dialog.userInput.text.replace(/\s/g, '');
            var listName = this.listName || this.name;
            var list = context.session[listName];

            for (var j = 0; list && j < list.length; j++)
            {
                if(list[j][this.field].indexOf(text) != -1)
                {
                    return callback(true, list[j][this.field]);
                }
            }
        }

        callback(false);
    });
};
