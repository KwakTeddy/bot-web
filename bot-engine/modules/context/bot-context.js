var _ = require('lodash');
var path = require('path');
var async = require('async');
var fs = require('fs');
var logger = require(path.resolve('./config/lib/logger.js'));
var utils = require('../utils/utils.js');

var commonDialogs = require('../common/common-dialogs.js');

var mongoose = require('../utils/mongo-wrapper.js');
var BotModel = mongoose.model('Bot');
var TemplateModel = mongoose.model('Template');
var Intent = mongoose.model('Intent');
var IntentContext = mongoose.model('IntentContext');
var Entity = mongoose.model('Entity');
var EntityContent = mongoose.model('EntityContent');

var customContext = require('./custom-context.js');

(function()
{
    function Bot(schema)
    {
        utils.merge(this, schema);

        this.dialogs = this.dialogs || [];
        this.commonDialogs = this.commonDialogs || [];
        this.tasks = this.tasks || {};
        this.actions = this.actions || {};
        this.types = this.types || {};
        this.typeChecks = this.typeChecks || {};
        this.concepts = this.concepts || {};
        this.messages = this.messages || {};
        this.patterns = this.patterns || {};
        this.dialogsets = this.dialogsets || [];
    }

    Bot.prototype.setDialogs = function(dialogs)
    {
        this.dialogs = this.dialogs.concat(dialogs);
    };

    Bot.prototype.setCommonDialogs = function(dialogs)
    {
        this.commonDialogs = this.commonDialogs.concat(dialogs);
    };

    Bot.prototype.setTask = function(taskName, task)
    {
        task.name = taskName;
        this.tasks[taskName] = task;
    };

    Bot.prototype.setAction = function(actionName, action)
    {
        this.actions[actionName] = action;
    };

    Bot.prototype.setType = function(typeName, type)
    {
        type.name = typeName;
        this.types[typeName] = type;
    };

    Bot.prototype.setTypeCheck = function(typeCheckName, typeCheck)
    {
        this.typeChecks[typeCheckName] = typeCheck;
    };

    Bot.prototype.setConcepts = function(concepts)
    {
        for (var key in concepts)
        {
            this.concepts[key] = concepts[key];
        }
    };

    Bot.prototype.setMessages = function(messages)
    {
        for (var key in messages)
        {
            this.messages[key] = messages[key];
        }
    };

    Bot.prototype.setDialogPattern = function(patternName, pattern)
    {
        this.patterns[patternName] = pattern;
    };

    function getTemplateDataModel(dataSchema, TemplateDataModelName)
    {
        var TemplateSchema = undefined;
        try
        {
            if(typeof dataSchema == "string")
            {
                TemplateSchema= eval('TemplateSchema = '+ dataSchema);
            }
            else
            {
                TemplateSchema= dataSchema;
            }

            var keys = Object.keys(TemplateSchema);
            for(var i = 0; i < keys.length; i++)
            {
                var key = keys[i];
                var val = TemplateSchema[key];

                var type;
                if(val.type) type = val.type;
                else type = val;

                if(type == 'String') {
                    val.type = String;
                } else if(type == 'Number') {
                    val.type = Number;
                } else if(type == 'Time') {
                    val.type = String;
                } else if(type == 'Enum') {
                    val.type = mongoose.Schema.Types.Mixed;
                } else if(type == 'Image') {
                    val.type = String;
                } else if(type == 'List' && TemplateDataModelName == key) {
                    return getTemplateDataModel(TemplateSchema[TemplateDataModelName].schema, TemplateSchema[TemplateDataModelName].model);
                } else if(type == 'List') {
                    delete TemplateSchema[key];
                }
            }

            if(TemplateDataModelName && TemplateDataModelName != 'null')
            {
                TemplateSchema.upTemplateId = { type: mongoose.Schema.Types.Mixed };
            }
            else
            {
                TemplateSchema.templateId = { type: mongoose.Schema.ObjectId, ref: 'Template' };
            }
        }
        catch(e)
        {
            logger.systemError(e);
        }

        if(TemplateDataModelName && TemplateDataModelName != 'null')
        {
            return mongoModule.getModel(TemplateDataModelName, TemplateSchema, { strict : false });
        }
        else
        {
            return mongoModule.getModel('TemplateData');
        }
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
                obj = obj.replace(/{(.*)}/g, function(match, p1) {
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
    };

    function loadBot(botId, templates, next)
    {
        var botDir = '';
        var botContext = undefined;
        var isTemplateLoaded = false;
        BotModel.findOne({ id: botId }).lean().exec(function(err, doc)
        {
            if(err)
                return errorCallback(err);

            if(doc != undefined)
            {
                botContext = new Bot(doc);
                botContext.error = [];
                if(botContext.path)
                {
                    botDir = path.resolve(botContext.path);
                }

                isTemplateLoaded = (botContext.template && templates[botContext.template.id] && templates[botContext.template.id].loaded == true);
            }

            next(null, botContext, botDir, isTemplateLoaded);
        });
    }

    function loadDialogTemplates(botContext, botDir, isTemplateLoaded, next)
    {
        if(botContext && botContext.templateId)
        {
            TemplateModel.findOne({ _id: botContext.templateId }).lean().exec(function(err, doc)
            {
                if(doc)
                {
                    logger.systemLog('Loading Bot\'s Template : ' + JSON.stringify(doc));
                    botContext.template = doc;
                    if(!botContext.path)
                    {
                        botContext.path = 'templates/' + doc.id;
                    }

                    if(templates[botContext.template.id] && templates[botContext.template.id].loaded != true)
                    {
                        templates[botContext.template.id] = undefined;
                    }

                    var templateDataModel = getTemplateDataModel(doc.dataSchema);
                    templateDataModel.findOne({ _id: botContext.templateDataId }).lean().exec(function(err, templateDataDoc)
                    {
                        if(templateDataDoc)
                        {
                            logger.systemLog('Loading Bot\'s Template data : ' + JSON.stringify(templateDataDoc));
                            utils.merge(botContext, templateDataDoc);
                        }

                        next(null, botContext, botDir, isTemplateLoaded);
                    });
                }
                else
                {
                    next(null, botContext, botDir, isTemplateLoaded);
                }
            });
        }
        else
        {
            next(null, botContext, botDir, isTemplateLoaded);
        }
    };

    function loadBotContextFiles(botContext, botDir, isTemplateLoaded, next)
    {
        if(isTemplateLoaded)
        {
            next(null, botContext, botDir, isTemplateLoaded);
        }
        else
        {
            if(fs.existsSync(botDir))
            {
                var fileFilter = function(file) { return file.endsWith('.botContext.js'); };
                loadDialogsFromFile(botDir, botContext, fileFilter);
            }

            next(null, botContext, botDir, isTemplateLoaded);
        }
    }

    function setGlobalStartDialogs(botContext, botDir, isTemplateLoaded, next)
    {
        botContext.setDialogs(commonDialogs.globalStartDialogs);
        next(null, botContext, botDir, isTemplateLoaded);
    };

    function loadDialogsFromBotContext(botDir, filePaths, botContext)
    {
        if(botContext.dialogFiles)
        {
            logger.systemLog(botName + ' has dialogFiles');
            for (var i = 0; i < botContext.dialogFiles.length; i++)
            {
                var file = botContext.dialogFiles[i];
                var filePath = path.join(botDir, file);
                filePaths.push(filePath);

                try
                {
                    logger.systemLog('\tLoading Dialog file that bot has: ' + file);
                    utils.requireNoCache(filePath, true);
                }
                catch(e)
                {
                    logger.systemLog('\tLoading Dialog file: ' + file + ' error or not found');
                    logger.systemError(e);
                    botContext.error.push(e.stack);
                }
            }
        }
    };

    function loadDialogsFromFile(botDir, botContext, fileFilter)
    {
        var files = undefined;

        try
        {
            files = utils.readdirRecursive(botDir);
            for (var i = 0; i < files.length; i++)
            {
                var file = files[i];
                if(file != file.normalize('NFC'))
                {
                    files[i] = file.normalize('NFC');
                }
            }

            files = files.filter(fileFilter);
        }
        catch(e)
        {
            logger.systemError('loadBot: ' + botDir + ' 경로 없음');
            botContext.error.push(e.stack);
            return;
        }

        for (var i = 0; i < files.length; i++)
        {
            var file = files[i];

            try
            {
                logger.systemLog('\tLoading Dialog file: ' + file);
                utils.requireNoCache(file, true);
            }
            catch(e)
            {
                logger.systemLog(e);
                botContext.error.push(e.stack);
            }
        }
    };

    function loadDialogs(dialogs)
    {
        for (var i = 0; i < dialogs.length; i++)
        {
            var dialog = dialogs[i];

            if(dialog.input && dialog.input.pattern)
            {
                var patternDialog = undefined;
                if('string' == typeof dialog.input.pattern)
                {
                    patternDialog = patterns[dialog.input.pattern];
                }
                else
                {
                    patternDialog = dialog.input.pattern;
                }

                if(patternDialog != undefined)
                {
                    logger.systemLog('\tCheck the dialog Pattern');
                    dialogs[i] = changeDialogPattern(patternDialog, dialog.input.params);
                    logger.systemLog('\t\t - ' + JSON.stringify(dialogs[i]));
                }
            }
        }
    };

    function loadBotDialogs(botContext, isTemplateLoaded, botDir, next)
    {
        if(isTemplateLoaded)
        {
            next();
        }
        else
        {
            var filePaths = [];
            if(fs.existsSync(botDir))
            {
                loadDialogsFromBotContext(botDir, filePaths, botContext);

                loadDialogsFromFile(botDir, botContext, function(file)
                {
                    if(botContext.dialogFiles && _.includes(filePaths, file)) return false;
                    else return file.endsWith('.dialog.js');
                });

                loadDialogsFromFile(botDir, botContext, function(file)
                {
                    if(botContext && botContext.dialogFiles && _.includes(filePaths, file))
                    {
                        return false;
                    }
                    else if(file.endsWith('.js') && !file.endsWith('.dialog.js') && !file.endsWith('.test.js') && !file.endsWith('.botContext.js'))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });

                loadDialogs(botContext.dialogs);
                loadDialogs(botContext.commonDialogs);
            }

            next(null, botContext);
        }
    };

    function mergeTemplates(botContext, next)
    {
        if(botContext.template && templates[botContext.template.id])
        {
            utils.merge(botContext.template, templates[botContext.template.id]);
            if(botContext.template.loaded == undefined)
            {
                botContext.template.loaded = true;
            }

            utils.merge(bot, botContext.template);

            botContext.commonDialogs = botContext.commonDialogs.concat(botContext.template.commonDialogs);
            botContext.dialogs = botContext.dialogs.concat(botContext.template.dialogs);
            utils.merge(botContext.tasks, botContext.template.tasks);
            utils.merge(botContext.actions , botContext.template.actions );
            utils.merge(botContext.types, botContext.template.types);
            utils.merge(botContext.typeChecks, botContext.template.typeChecks);
            utils.merge(botContext.concepts, botContext.template.concepts);
            utils.merge(botContext.messages, botContext.template.messages);
            utils.merge(botContext.patterns, botContext.template.patterns);
            botContext.dialogsets = botContext.dialogsets.concat(botContext.template.dialogsets);
        }

        next(null, botContext);
    }

    function setGlobalEndDialogs(botContext, next)
    {
        botContext.setDialogs(commonDialogs.globalEndDialogs);
        next(null, botContext);
    }

    function loadIntents(botContext, next)
    {
        Intent.find({ botId: botContext.id }).lean().exec(function(err, docs)
        {
            botContext.intents = docs;

            IntentContext.find({ botId: botContext.id }).lean().exec(function(err, docs)
            {
                var nWords = {};
                var words = docs;
                for(var i in words)
                {
                    nWords[words[i].word] = words[i].count;
                }

                botContext.intentTopcis = nWords;

                var topicKeywords = [];
                for(var key in botContext.intentTopics)
                {
                    if(key.length > 1)
                    {
                        topicKeywords.push(key);
                    }
                }

                if(botContext.topicKeywords)
                {
                    botContext.topicKeywords = botContext.topicKeywords.concat(topicKeywords);
                }
                else
                {
                    botContext.topicKeywords = topicKeywords;
                }

                next(null, botContext);
            });
        });
    }

    function loadEntities(botContext, next)
    {
        Entity.find({ botId: botContext.id }).lean().exec(function(err, docs)
        {
            botContext.entityContents = docs;
            for(var i in docs)
            {
                docs[i].name = '@' + docs[i].name;
            }

            EntityContent.find({ botId: botContext.id }).lean().populate('entityId').exec(function(err, docs)
            {
                for(var i in docs)
                {
                    docs[i].name = docs[i].name + '@' + (docs[i].entityId ? docs[i].entityId.name : '');
                }

                botContext.entityContents = botContext.entityContents.concat(docs);
                botContext.entities = botContext.entityContents;

                next(null, botContext);
            });
        });
    }

    function loadCustomContext(botContext, next)
    {
        customContext.loadCustomContext(botContext, function()
        {
            next(null, botContext);
        });
    };

    function loadDialogsets(botContext, next)
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

        next(null, botContext);
    }

    module.exports.getBotContext = function(botId, templates, done)
    {
        async.waterfall(
        [
            function(next){ loadBot(botId, templates, next); },
            loadDialogTemplates,
            loadBotContextFiles,
            setGlobalStartDialogs,
            loadBotDialogs,
            mergeTemplates,
            setGlobalEndDialogs,
            loadIntents,
            loadEntities,
            loadCustomContext,
            loadDialogsets
        ],
        function(err, botContext)
        {
            if(botContext.error.length === 0)
            {
                delete botContext.error;
            }

            done(botContext);
        });
    };
})();
