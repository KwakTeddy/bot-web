var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');

var utils = require('../utils/utils.js');

var BotModel = mongoose.model('Bot');
var TemplateModel = mongoose.model('Template');
var IntentModel = mongoose.model('Intent');
var IntentContextModel = mongoose.model('IntentContext');
var EntityModel = mongoose.model('Entity');
var EntityContentModel = mongoose.model('EntityContent');
var CustomContextModel = mongoose.model('CustomContext');
var CustomContextItemModel = mongoose.model('CustomContextItem');
var Dialogset = mongoose.model('Dialogset');

(function()
{
    var Bot = function(botId)
    {
        this.botId = botId;

        this.options = {
            use: true,
            kakao: {},
            globalSearch: {
                use: false,
                limitOfSimilarAnswer: 1,
                memory: false
            },
            hybrid: {
                use: false
            },
            dialogsetMinMatchRate: 0.5,
            dialoggraphMinMatchRate: 0.5,
            intentMinMatchRate: 0.5,
            useQuibble: false,
            paging: {
                use: false,
                perPage: 10
            },
            useAutoCorrection: false,
            useSynonymDictionary: false
        };
        this.dialogMap = {};
        this.parentDialogMap = {};
        this.dialogs = [];
        this.commonDialogs = [];
        this.tasks = {};
        this.actions = {};
        this.types = {};
        this.typeChecks = {};
        this.concepts = {};
        this.messages = {};
        this.patterns = {};
        this.dialogsets = [];
        this.quibbles = [];
    };

    Bot.prototype.loadBotData = function(callback)
    {
        var that = this;
        BotModel.findOne({ id: this.botId }).lean().exec(function(err, doc)
        {
            if(err)
            {
                return callback(err);
            }

            if(!doc)
            {
                return callback(bot + ' is not registered bot');
            }
            else
            {
                var data = JSON.parse(JSON.stringify(doc));
                for(var key in data)
                {
                    if(!that.hasOwnProperty(key))
                    {
                        that[key] = data[key];
                    }
                }

                // that.setDialogs(Globals.dialogs.startDialogs);

                that.loadTemplateBotData(function(err)
                {
                    if(err)
                    {
                        return callback(err);
                    }

                    that.loadIntent(function(err)
                    {
                        if(err)
                        {
                            return callback(err);
                        }

                        that.loadEntity(function(err)
                        {
                            if(err)
                            {
                                return callback(err);
                            }

                            that.loadDialogsets(function(err)
                            {
                                if(err)
                                {
                                    return callback(err);
                                }

                                that.loadCustomContext(function(err)
                                {
                                    if(err)
                                    {
                                        return callback(err);
                                    }

                                    that.extractTopicKeywordFromDialogset();
                                    // that.setDialogs(Globals.dialogs.endDialogs);

                                    callback();
                                });
                            });
                        });
                    });
                });
            }
        });
    };

    Bot.prototype.loadIntent = function(callback)
    {
        var query = {};
        if(this.templateId)
        {
            query.templateId = this.templateId;
        }
        else
        {
            query.botId = this.id;
        }


        var that = this;
        IntentModel.find(query).lean().exec(function(err, docs)
        {
            if(err)
            {
                return callback(err);
            }

            that.intents = docs;

            console.log('intents: ', docs);

            IntentContextModel.find({ botId: that.id }).lean().exec(function(err, doc)
            {
                if(err)
                {
                    return callback(err);
                }

                var words = doc, nWords = {};
                for(var i in words)
                {
                    nWords[words[i].word] = words[i].count;
                }

                that.intentTopics = nWords;
                if(callback)
                {
                    callback();
                }
            });
        });
    };

    Bot.prototype.loadEntity = function(callback)
    {
        var that = this;
        EntityModel.find({ botId: this.id }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return callback(err);
            }

            that.entityContents = docs;
            for(var i in docs)
            {
                docs[i].name = '@' + docs[i].name;
            }

            console.log('entities: ', docs);

            EntityContentModel.find({ botId: that.id }).lean().populate('entityId').exec(function(err, docs)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i in docs)
                {
                    docs[i].name = docs[i].name + '@' + (docs[i].entityId ? docs[i].entityId.name : '');
                }

                that.entityContents = that.entityContents.concat(docs);
                that.entities = that.entityContents;

                if(callback)
                {
                    callback();
                }
            });
        });
    };

    var findCustomContext = function(botId, callback)
    {
        var contexts = {};

        CustomContextModel.find({ bot: botId }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return callback(err);
            }

            for(var i in docs)
            {
                if(docs[i].parent)
                {
                    docs[i].parentId = docs[i].parent;
                    for (var j in docs)
                    {
                        if (docs[j]._id.toString() == docs[i].parentId.toString())
                        {
                            docs[i].parent = docs[j];
                            break;
                        }
                    }
                }
            }

            var getPath = function(context)
            {
                if(context.parent == null)
                {
                    return context.name;
                }
                else
                {
                    return getPath(context.parent) + '.' + context.name;
                }
            };

            for(var i in docs)
            {
                docs[i].path = getPath(docs[i]);
                contexts[docs[i].path] = docs[i];
            }

            callback(null, docs, contexts);
        })
    };

    var findCustomContextItem = function(botId, list, callback)
    {
        CustomContextItemModel.find({ bot: botId }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return callback(err);
            }

            for(var i in docs)
            {
                var item = docs[i];

                for(var j in list)
                {
                    if(list[j]._id.toString() == item.context.toString())
                    {
                        var context = list[j];
                        if(context.items == undefined)
                        {
                            context.items = [];
                        }

                        context.items.push({type: item.itemType, name: item.name});
                        break;
                    }
                }
            }

            callback();
        })
    };

    var setContextDialogs = function(contextTree, contexts, dialogs)
    {
        for(var i in dialogs)
        {
            var dialog = dialogs[i];
            for(var key in contexts)
            {
                if(dialog.context == key)
                {
                    dialog.context = contexts[key];

                    if(contexts[key].dialogs == undefined)
                    {
                        contexts[key].dialogs = [dialog];
                    }
                    else
                    {
                        contexts[key].dialogs.push(dialog);
                    }

                    break;
                }
            }
        }

        for(var i in contexts)
        {
            if(contexts[i].parent == null)
            {
                contextTree = contexts[i];
            }
        }
    };

    var findDialogsetContext = function(dialogset, callback)
    {
        CustomContextModel.find({ dialogset: dialogset }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return callback(err);
            }

            var list = docs;
            var dialogsetContexts = {};

            for(var i in docs)
            {
                if(docs[i].parent)
                {
                    docs[i].parentId = docs[i].parent;
                    for (var j in docs)
                    {
                        if (docs[j]._id.toString() == docs[i].parentId.toString())
                        {
                            docs[i].parent = docs[j];
                            break;
                        }
                    }
                }
            }

            var getPath = function(context)
            {
                if(context.parent == null)
                {
                    return context.name;
                }
                else
                {
                    return getPath(context.parent) + '.' + context.name;
                }
            };

            for(var i in docs)
            {
                docs[i].path = getPath(docs[i]);
                dialogsetContexts[docs[i]._id] = docs[i];
            }

            CustomContextItemModel.find({ dialogset: dialogset }).lean().exec(function(err, docs)
            {
                if(err)
                {
                    return callback(err);
                }

                for(var i in docs)
                {
                    var item = docs[i];

                    for(var j in list)
                    {
                        if(list[j]._id.toString() == item.context.toString())
                        {
                            var context = list[j];
                            if(context.items == undefined)
                            {
                                context.items = [];
                            }

                            context.items.push({type: item.itemType, name: item.name});
                            break;
                        }
                    }
                }

                callback(dialogsetContexts);
            })
        });
    };

    Bot.prototype.loadCustomContext = function(callback)
    {
        var that = this;
        findCustomContext(this.id, function(err, contextList, contexts)
        {
            if(err)
            {
                return callback();
            }

            that.contexts = contexts;

            findCustomContextItem(that.id, contextList, function(err)
            {
                if(err)
                {
                    return callback();
                }

                var contextTree = that.contextTree;
                setContextDialogs(contextTree, that.contexts, that.dialogs);

                that.dialogsetContexts = {};

                async.eachSeries(that.dialogsets, function(dialogset, next)
                {
                    findDialogsetContext(dialogset, function(dialogsetContexts)
                    {
                        that.dialogsetContexts[dialogset] = dialogsetContexts;
                        next();
                    });
                },
                function(err)
                {
                    callback(err);
                });
            });
        });
    };

    Bot.prototype.loadDialogsets = function(callback)
    {
        var that = this;
        Dialogset.find({ bot: this._id, usable: true }).lean().exec(function(err, dialogsets)
        {
            if(err)
            {
                return callback(err);
            }

            that.dialogsets = dialogsets;

            console.log('dialogset: ', dialogsets);
            callback();
        });
    };

    Bot.prototype.extractTopicKeywordFromDialogset = function()
    {
        for(var i in this.dialogsets)
        {
            if(this.dialogsets[i].topicKeywords)
            {
                if(this.topicKeywords)
                {
                    this.topicKeywords = this.topicKeywords.concat(this.dialogsets[i].topicKeywords);
                }
                else
                {
                    this.topicKeywords = this.dialogsets[i].topicKeywords;
                }
            }
        }
    };

    Bot.prototype.loadTemplateBotData = function(callback)
    {
        if(!this.templateId)
        {
            return callback();
        }

        var that = this;
        TemplateModel.findOne({ _id: this.templateId }).lean().exec(function(err, doc)
        {
            if(err)å
            {
                return callback(err);
            }

            if(doc)
            {
                try
                {
                    //실제 템플릿 봇 파일 로딩
                    // utils.requireNoCache('templates/' + doc.id + '/bot/' + doc.id + '.bot.js', true);

                    that.template = doc;

                    console.log('Template: ', doc);

                    // that.setCommonDialogs(that.template.commonDialogs);
                    // that.setDialogs(that.template.dialogs);
                    //
                    // utils.merge(that.tasks, that.template.tasks);
                    // utils.merge(that.actions , that.template.actions);
                    // utils.merge(that.types, that.template.types);
                    // utils.merge(that.typeChecks, that.template.typeChecks);
                    // utils.merge(that.concepts, that.template.concepts);
                    // utils.merge(that.messages, that.template.messages);
                    // utils.merge(that.patterns, that.template.patterns);
                    // that.dialogsets = that.dialogsets.concat(that.template.dialogsets);

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
                                            that[key] = doc1[0][key];
                                        }
                                    }
                                }
                                else
                                {
                                    var tempData = {};
                                    tempData[schemaPostFix] = doc1 || [];

                                    utils.merge(that, tempData);
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
                    callback(err);
                }
            }
            else
            {
                callback();
            }
        });
    };

    Bot.prototype.setDialogMap = function(dialogs, parent)
    {
        for(var i=0; i<dialogs.length; i++)
        {
            this.dialogMap[dialogs[i].id] = dialogs[i];

            if(parent)
            {
                this.parentDialogMap[dialogs[i].id] = parent;
            }

            if(dialogs[i].children)
            {
                this.setDialogMap(dialogs[i].children, dialogs[i]);
            }
        }
    };

    Bot.prototype.setDialogs = function(dialogs)
    {
        this.dialogs = this.dialogs.concat(dialogs);
        this.setDialogMap(dialogs);
    };

    Bot.prototype.setCommonDialogs = function(dialogs)
    {
        this.commonDialogs = this.commonDialogs.concat(dialogs);
        this.setDialogMap(dialogs);

        for(var i=0; i<this.dialogs.length; i++)
        {
            this.parentDialogMap[this.dialogs[i].id] = this.commonDialogs[0];
        }
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

    Bot.prototype.setQuibbles = function(quibbles)
    {
        this.quibbles = this.quibbles.concat(quibbles);
    };

    module.exports = Bot;
})();
