var path = require('path');
var mongoose = require('mongoose');

var async = require('async');
var fs = require('fs');

var utils = require('../utils/utils.js');
var Logger = require('../logger.js');
var Error = require('../error.js');
var Globals = require('../globals.js');

var Intent = require('./intent.js');
var Entity = require('./entity.js');
var CustomContext = require('./customContext.js');

var Bot = require('./bot.js');

var BotModel = mongoose.model('Bot');
var TemplateModel = mongoose.model('Template');

(function()
{
    var getRecursiveFiles = function(dir, fileFilter)
    {
        var files = utils.readdirRecursive(dir);
        for (var i = 0; i < files.length; i++)
        {
            var file = files[i];
            if(file != file.normalize('NFC'))
            {
                files[i] = file.normalize('NFC');
            }
        }

        return files.filter(fileFilter);
    };

    function changeDialogPattern(obj, params)
    {
        if ('string' == typeof obj)
        {
            var matched = obj.match(/^{(.*)}$/);
            if (matched != null && params && params[matched[1]])
            {
                return params[matched[1]];
            }
            else if(params)
            {
                obj = obj.replace(/{(.*)}/g, function(match, p1)
                {
                    return params[p1];
                });

                return obj;
            }
        }

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Array
        if (obj instanceof Array)
        {
            for (var i = 0, len = obj.length; i < len; i++)
            {
                obj[i] = changeDialogPattern(obj[i], params);
            }

            return obj;
        }

        // Handle Object
        if (obj instanceof Object)
        {
            for (var attr in obj)
            {
                if (obj.hasOwnProperty(attr)) obj[attr] = changeDialogPattern(obj[attr], params);
            }

            return obj;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    var checkChangeDialogPattern = function(botContext, key)
    {
        for(var i=0; botContext && i < botContext[key].length; i++)
        {
            var dialog = botContext[key][i];

            if(dialog.input && dialog.input.pattern)
            {
                var patternDialog = undefined;
                if('string' == typeof dialog.input.pattern)
                {
                    patternDialog = botContext.patterns[dialog.input.pattern];
                }
                else
                {
                    patternDialog = dialog.input.pattern;
                }

                if(patternDialog != undefined)
                {
                    botContext[key][i] = changeDialogPattern(patternDialog, dialog.input.params);
                }
            }
        }
    };

    var BotContext = function()
    {

    };

    BotContext.prototype.loadBot = function(bot, user, callback)
    {
        var that = this;
        BotModel.findOne({ id: bot }).lean().exec(function(err, doc)
        {
            if(err)
            {
                return Error.delegate(err);
            }

            if(!doc)
            {
                return Error.delegate(bot + ' is not registered bot');
            }
            else
            {
                var botContext = new Bot(doc);

                botContext.setDialogs(Globals.dialogs.startDialogs);

                callback(botContext, user);
            }
        });
    };

    BotContext.prototype.loadTemplateData = function(botContext, user, callback)
    {
        if(!botContext.templateId || botContext.template)
        {
            return callback();
        }

        //템플릿봇일경우 템플릿 데이터를 바인딩 해주는것.
        TemplateModel.findOne({_id: bot.templateId}).lean().exec(function(err, doc)
        {
            if(err)
            {
                return Error.delegate(err);
            }

            if(doc)
            {
                try
                {
                    //실제 봇 파일 로딩
                    utils.requireNoCache('templates/' + doc.id + '/bot/' + doc.id + '.bot.js', true);

                    botContext.template = doc;

                    botContext.commonDialogs = botContext.commonDialogs.concat(botContext.template.commonDialogs);
                    botContext.dialogs = botContext.dialogs.concat(botContext.template.dialogs);

                    utils.merge(botContext.tasks, botContext.template.tasks);
                    utils.merge(botContext.actions , botContext.template.actions);
                    utils.merge(botContext.types, botContext.template.types);
                    utils.merge(botContext.typeChecks, botContext.template.typeChecks);
                    utils.merge(botContext.concepts, botContext.template.concepts);
                    utils.merge(botContext.messages, botContext.template.messages);
                    utils.merge(botContext.patterns, botContext.template.patterns);
                    botContext.dialogsets = botContext.dialogsets.concat(botContext.template.dialogsets);

                    var files = fs.readdirSync(path.resolve('./templates/' + doc.id));
                    async.eachSeries(files, function(file, next)
                    {
                        if(!file.startsWith('playchat-') && file.endsWith('.json'))
                        {
                            var data = fs.readFileSync(path.resolve('./templates/' + doc.id + '/' + file));

                            var schemaPostFix = file.split('-')[0];

                            var json = JSON.parse(data);
                            json.botId = 'String';

                            var schema = new mongoose.Schema(json);
                            if(mongoose.models[doc.id + '-' + schemaPostFix])
                                schema = mongoose.model(doc.id + '-' + schemaPostFix);
                            else
                                schema = mongoose.model(doc.id + '-' + schemaPostFix, schema);

                            schema.find({ botId: bot.id }).lean().exec(function(err, doc1)
                            {
                                if(schemaPostFix == 'data')
                                {
                                    if(doc1.length == 1 && doc1[0])
                                    {
                                        for(var key in doc1[0])
                                        {
                                            botContext[key] = doc1[0][key];
                                        }
                                    }
                                }
                                else
                                {
                                    var tempData = {};
                                    tempData[schemaPostFix] = doc1 || [];

                                    utils.merge(botContext, tempData);
                                }

                                next();
                            });
                        }
                        else
                        {
                            next();
                        }
                    },
                    function()
                    {
                        callback();
                    });
                }
                catch(err)
                {
                    Error.delegate(err);
                }
            }
            else
            {
                callback();
            }
        });
    };

    BotContext.prototype.extractTopicKeywordFromDialogset = function(botContext, callback)
    {
        for(var i in botContext.dialogsets)
        {
            if(botContext.dialogsets[i].topicKeywords)
            {
                if(botContext.topicKeywords)
                {
                    botContext.topicKeywords = botContext.topicKeywords.concat(botContext.dialogsets[i].topicKeywords);
                }
                else
                {
                    botContext.topicKeywords = botContext.dialogsets[i].topicKeywords;
                }
            }
        }

        callback();
    };


    BotContext.prototype.load = function(bot, user, callback)
    {
        // TODO 개발 시 node 재시작 안하려고 임시로
        // utils.requireNoCache(path.resolve('./engine2/bot/action/common/dialog'));
        // utils.requireNoCache(path.resolve('./engine2/bot/action/common/task'));
        // utils.requireNoCache(path.resolve('./engine2/bot/action/common/type'));

        console.log('Loading Bot: ' + bot);

        var that = this;
        this.loadBot(bot, user, function(botContext)
        {
            that.loadTemplateData(botContext, user, function()
            {
                Intent.load(bot, user, function()
                {
                    Entity.load(bot, function()
                    {
                        CustomContext.load(botContext, user, function()
                        {
                            that.extractTopicKeywordFromDialogset(botContext, function()
                            {
                                botContext.setDialogs(globals.endDialogs);
                                callback(botContext);
                            });
                        });
                    });
                });
            });
        });
    };

    module.exports = new BotContext();
})();
