var chalk = require('chalk');

(function()
{
    var REPLACED_TAG = '\\+';
    var ARRAY_TAG = '#';

    var getValue = function(obj, key)
    {
        var replaced = undefined;

        var split = key.split('.');
        for(var i=0; i<split.length; i++)
        {
            if(i == 0)
            {
                replaced = obj[split[i]];
            }
            else if(typeof replaced == 'object')
            {
                if(replaced.hasOwnProperty(split[i]))
                {
                    replaced = replaced[split[i]];
                }
                else
                {
                    replaced = undefined;
                }
            }
            else
            {
                break;
            }
        }

        return replaced;
    };

    var OutputManager = function()
    {

    };

    OutputManager.prototype.make = function(context, dialog, target)
    {
        console.log();
        console.log(chalk.yellow('[[[ Output Makeup Before ]]]'));
        console.log(target.text || target.output.text);
        if(target.output && target.output.buttons)
        {
            console.log('-- buttons --');
            for(var i=0; i<target.output.buttons.length; i++)
            {
                console.log('[ ' + target.output.buttons[i].text + ' ]');
            }
        }

        var bot = context.bot;

        target = JSON.parse(JSON.stringify(target));

        if(typeof target == 'object')
        {
            if(context.bot && context.bot.options && context.bot.options.commonButtons)
            {
                if(!target.output.buttons)
                {
                    target.output.buttons = [];
                }

                if(typeof target.output == 'string')
                {
                    target.output.text = target.output;
                }

                if(context.channel.name == 'kakao')
                {
                    if(target.output.buttons)
                    {
                        target.output.buttons = (target.output.buttons || []).concat(context.bot.options.commonButtons);
                    }
                }
                else
                {
                    target.output.buttons = (target.output.buttons || []).concat(context.bot.options.commonButtons);
                }
            }

            if(target.output && target.output.text)
            {
                var result = target.output.text.replace(new RegExp(ARRAY_TAG + "([\\w가-힣\\d-_\\.]*)" + ARRAY_TAG + "([^" + ARRAY_TAG + "]*)" + ARRAY_TAG, "g"), function replacer(match, key)
                {
                    if(key)
                    {
                        var template = match.replace(ARRAY_TAG + key + ARRAY_TAG, '').replace(ARRAY_TAG, '');
                        var list = getValue({ context: context, dialog: dialog, bot: bot }, key);
                        if(list)
                        {
                            var resultText = '';
                            for(var i=0; i<list.length; i++)
                            {
                                var t = template;
                                var matchs = template.match(new RegExp(REPLACED_TAG + "([\\w가-힣\\d-_\\.]+)" + REPLACED_TAG, 'gi'));
                                for(var j=0; j<matchs.length; j++)
                                {
                                    if(matchs[j] == '+index+')
                                    {
                                        t = t.replace(matchs[j], (i+1));
                                    }
                                    else
                                    {
                                        t = t.replace(matchs[j], getValue(list[i], matchs[j].replace(/\+/gi, '')));
                                    }
                                }

                                resultText += t;
                            }

                            return resultText;
                        }
                    }

                    return '';
                });

                result = result.replace(new RegExp(REPLACED_TAG + "([\\w가-힣\\d-_\\.]+)" + REPLACED_TAG, "g"), function replacer(match, key)
                {
                    if(key)
                    {
                        var replaced = getValue({ context: context, dialog: dialog, bot: bot }, key);
                        if(replaced)
                        {
                            return replaced;
                        }
                        else
                        {
                            return '[' + match + '] is undefined';
                        }
                    }

                    return '';
                });

                target.output.text = result;
            }
        }

        console.log();
        console.log(chalk.yellow('[[[ Output Makeup After ]]]'));
        console.log(target.text || target.output.text);
        if(target.output && target.output.buttons)
        {
            console.log('-- buttons --');
            for(var i=0; i<target.output.buttons.length; i++)
            {
                console.log('[ ' + target.output.buttons[i].text + ' ]');
            }
        }

        return target;
    };

    module.exports = new OutputManager();
})();
