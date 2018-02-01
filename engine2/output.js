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

    OutputManager.prototype.make = function(context, target)
    {
        console.log();
        console.log('[[[ OUTPUT MAKEUP BEFORE ]]]');
        console.log(target);

        var conversation = context.history[0];
        if(!conversation)
        {
            conversation = {};
        }

        target = JSON.parse(JSON.stringify(target));

        if(typeof target == 'object')
        {
            if(context.bot && context.bot.commonButtons)
            {
                if(!target.output.buttons)
                {
                    target.output.buttons = [];
                }

                target.output.buttons = target.output.buttons.concat(context.bot.commonButtons);
            }

            if(target.output && target.output.text)
            {
                var result = target.output.text.replace(new RegExp(ARRAY_TAG + "([\\w가-힣\\d-_\\.]*)" + ARRAY_TAG + "([^" + ARRAY_TAG + "]*)" + ARRAY_TAG, "g"), function replacer(match, key)
                {
                    if(key)
                    {
                        var template = match.replace(ARRAY_TAG + key + ARRAY_TAG, '').replace(ARRAY_TAG, '');
                        var list = getValue(context, key);
                        if(!list)
                        {
                            list = getValue(conversation, key);
                        }

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
                        var replaced = getValue(context, key);
                        if(!replaced)
                        {
                            replaced = getValue(conversation, key);
                        }

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
        console.log('[[[ OUTPUT MAKEUP AFTER ]]]');
        console.log(target);

        return target;
    };

    module.exports = new OutputManager();
})();
