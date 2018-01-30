var Bot = function()
{
    this.dialogs = undefined;
    this.commonDialogs = undefined;
};

Bot.prototype.setDialogs = function(dialogs)
{
    this.dialogs = dialogs;
};

Bot.prototype.setCommonDialogs = function(commonDialogs)
{
    this.commonDialogs = commonDialogs;
};

var b = new Bot();
require('./custom_modules/samchully/default.graph.js')(b);


var convert = function(dialogs)
{
    for(var i=0; i<dialogs.length; i++)
    {
        for(var j=0; j<dialogs[i].input.length; j++)
        {
            var input = dialogs[i].input[j];
            for(var key in input)
            {
                if(key == 'text' && typeof input[key] == 'string')
                {
                    input[key] = { raw: input[key], nlp: input[key] };
                    console.log(input[key]);
                }
            }
        }

        for(var j=0; j<dialogs[i].output.length; j++)
        {
            var output = dialogs[i].output[j];
            if(output.kind == 'Action')
            {
                var type = '';
                if(output.call)
                {
                    output.type = 'call';
                    output.dialogName = output.call;
                    delete output.call;
                }
                else if(output.callChild)
                {
                    output.type = 'callChild';
                    output.dialogName = output.callChild;
                    delete output.callChild;
                }
                else if(output.return)
                {
                    output.type = 'return';
                    delete output.return;
                }
                else if(output.returnCall)
                {
                    output.type = 'returnCall';
                    output.dialogName = output.returnCall;
                    delete output.returnCall;
                }
                else if(output.repeat)
                {
                    output.type = 'repeat';
                    delete output.repeat;
                }
                else if(output.up)
                {
                    output.type = 'up';
                    delete output.up;
                }
            }
        }

        if(dialogs[i].children)
        {
            convert(dialogs[i].children);
        }
    }
};

convert(b.dialogs);
convert(b.commonDialogs);

var fs = require('fs');

var content = '';
content += 'var dialogs = ' + JSON.stringify(b.dialogs, null, 4) + ';\r\n\r\n';
content += 'var commonDialogs = ' + JSON.stringify(b.commonDialogs, null, 4) + ';\r\n\r\n';
content += 'module.exports = function(bot)\n' +
           '{\n' +
           '    bot.setDialogs(dialogs);\n' +
           '    bot.setCommonDialogs(commonDialogs);\n' +
           '};\n';

fs.writeFileSync('graph.js', content);
