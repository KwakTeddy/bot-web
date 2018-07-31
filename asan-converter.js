var bot = {};
bot.setDialogs = function(d)
{
    this.dialogs = d;
};

bot.setCommonDialogs = function()
{

};

require('./custom_modules/Asan/default.graph.js')(bot);

var convert = function(dialogs)
{
    for(var i=0; i<dialogs.length; i++)
    {
        for(var j=0; j<dialogs[i].input.length; j++)
        {
            if(dialogs[i].input[j].text && !dialogs[i].input[j].text.raw.trim() && !dialogs[i].input[j].text.nlp.trim())
            {
                delete dialogs[i].input[j].text;
            }
        }

        if(dialogs[i].children && dialogs[i].children.length > 0)
        {
            convert(dialogs[i].children);
        }
    }
};

convert(bot.dialogs);

var fs = require('fs');

fs.writeFileSync('./dd', JSON.stringify(bot.dialogs, null, 4));
