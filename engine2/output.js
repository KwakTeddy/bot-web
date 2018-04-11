var chalk = require('chalk');
var utils = require('./utils/utils.js');

(function()
{
    var REPLACED_TAG = '\\+';
    var ARRAY_TAG = '#';

    var getValue = function(obj, key, fromList)
    {
        var replaced = undefined;

        var split = key.split('.');

        if(split.length == 1 && !fromList)
        {
            split.splice(0, 0, 'data');
            split.splice(0, 0, 'dialog');
        }

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

    OutputManager.prototype.make = function(context, userInput, dialog, output)
    {
        output = utils.clone(output);

        console.log();
        console.log(chalk.yellow('[[[ Output Makeup Before ]]]'));
        console.log(output.text);

        if(output && output.buttons)
        {
            console.log('-- buttons --');
            for(var i=0; i<output.buttons.length; i++)
            {
                console.log('[ ' + output.buttons[i].text + ' ]');
            }
        }

        var bot = context.bot;

        dialog = utils.clone(dialog);

        if(typeof dialog == 'object')
        {
            if(context.bot && context.bot.options && context.bot.options.commonButtons)
            {
                if(!output.buttons)
                {
                    output.buttons = [];
                }

                if(typeof output == 'string')
                {
                    output.text = output;
                }

                if(context.channel.name == 'kakao')
                {
                    if(output.buttons && output.buttons.length > 0)
                    {
                        output.buttons = (output.buttons || []).concat(context.bot.options.commonButtons);
                    }
                }
                else
                {
                    output.buttons = (output.buttons || []).concat(context.bot.options.commonButtons);
                }
            }

            if(output && output.text)
            {
                if(userInput.matchedEntity)
                {
                    var entityMatch = output.text.match(new RegExp('@' + userInput.matchedEntity.key, 'gi'));
                    if(entityMatch)
                    {
                        for(var i=0; i<entityMatch.length; i++)
                        {
                            output.text = output.text.replace(entityMatch[i], userInput.matchedEntity.matchedName);
                        }
                    }
                }

                output.text = output.text.replace(/\\\+/gi, '@#@').replace(/\\#/gi, '#@#');
                var result = output.text.replace(new RegExp(ARRAY_TAG + "([\\w가-힣\\d-_\\.]*)" + ARRAY_TAG + "([^" + ARRAY_TAG + "]*)" + ARRAY_TAG, "g"), function replacer(match, key)
                {
                    if(key)
                    {
                        var template = match.replace(ARRAY_TAG + key + ARRAY_TAG, '').replace(ARRAY_TAG, '');
                        var values = { context: context, dialog: dialog, bot: bot };
                        var list = getValue(values, key);
                        if(list)
                        {
                            var resultText = '';
                            var page = context.session.page || 1;
                            var countPerPage = bot.options.paging.perPage; //일단 디폴트 10;

                            var maxLength = page * countPerPage;
                            if(maxLength > list.length)
                            {
                                maxLength = list.length;
                            }

                            if(!bot.options.paging.use)
                            {
                                maxLength = list.length;
                                page = 1;
                            }

                            for(var i=(page-1) * 10; i<maxLength; i++)
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
                                        t = t.replace(matchs[j], getValue(list[i], matchs[j].replace(/\+/gi, ''), true));
                                    }
                                }

                                resultText += t;
                            }

                            if(bot.options.paging.use && list.length > countPerPage)
                            {
                                context.session.page = page;

                                var totalPage = Math.ceil(list.length / countPerPage);
                                context.session.totalPage = totalPage;

                                var description = '';

                                if(page > 1)
                                {
                                    description += '\n이전 페이지를 보시려면 <';
                                }

                                if(page < totalPage)
                                {
                                    description += '\n다음페이지를 보시려면 >';
                                }

                                resultText += '\n페이지 (' + page + '/' + totalPage + ') ' + description + '를 입력해주세요.';

                                context.session.isPaging = true;
                            }

                            return resultText;
                        }
                    }

                    return '';
                });

                result = result.replace(new RegExp(REPLACED_TAG + "([\\w가-힣\\d-_\\.@]+)" + REPLACED_TAG, "g"), function replacer(match, key)
                {
                    if(key)
                    {
                        var values = { context: context, dialog: dialog, bot: bot };
                        var replaced = getValue(values, key);
                        if(replaced !== undefined && replaced !== null)
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

                output.text = result.replace(/@#@/gi, '+').replace(/#@#/gi, '#');
            }
        }

        console.log();
        console.log(chalk.yellow('[[[ Output Makeup After ]]]'));
        console.log(output.text);
        if(output && output.buttons)
        {
            console.log('-- buttons --');
            for(var i=0; i<output.buttons.length; i++)
            {
                console.log('[ ' + output.buttons[i].text + ' ]');
            }
        }

        return output;
    };

    module.exports = new OutputManager();
})();
