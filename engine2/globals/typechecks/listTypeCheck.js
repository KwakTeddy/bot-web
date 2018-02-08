module.exports = function(globals)
{
    globals.setTypeChecks('listTypeCheck', function(dialog, context, callback)
    {
        if(this.listName)
        {
            var nlp = dialog.userInput.nlp;
            var listName = this.listName || this.name;
            var list = context.session[listName];

            for (var j = 0; list && j < list.length; j++)
            {
                for(var i=0; i<nlp.length; i++)
                {
                    if(nlp[i].pos == 'Noun')
                    {
                        var text = nlp[i].text;
                        if(this.field && list[j][this.field].indexOf(text) != -1)
                        {
                            return callback(true, list[j][this.field]);
                        }
                        else if(list[j].indexOf(text) != -1)
                        {
                            return callback(true, list[j]);
                        }
                    }
                }
            }
        }

        callback(false);
    });
};
