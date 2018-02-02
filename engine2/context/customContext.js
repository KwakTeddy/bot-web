var mongoose = require('mongoose');
var async = require('async');

var CustomContext = mongoose.model('CustomContext');
var CustomContextItem = mongoose.model('CustomContextItem');

var Logger = require('../logger.js');
var Error = require('../error.js');

(function()
{
    var findCustomContext = function(botContext, user, callback)
    {
        CustomContext.find({ bot: botContext.id }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return Error.delegate(err);
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
            }

            botContext.contexts = contexts;

            callback();
        })
    };

    var findCustomContextItem = function(botContext, user, callback)
    {
        CustomContextItem.find({ bot: botContext.id }).lean().exec(function(err, docs)
        {
            if(err)
            {
                return Error.delegate(err);
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

    var setContextDialogs = function(botContext, callback)
    {
        for(var i in botContext.dialogs)
        {
            var dialog = botContext.dialogs[i];
            for(var key in botContext.contexts)
            {
                if(dialog.context == key)
                {
                    dialog.context = botContext.contexts[key];

                    if(botContext.contexts[key].dialogs == undefined)
                    {
                        botContext.contexts[key].dialogs = [dialog];
                    }
                    else
                    {
                        botContext.contexts[key].dialogs.push(dialog);
                    }

                    break;
                }
            }
        }

        for(var i in botContext.contexts)
        {
            if(botContext.contexts[i].parent == null)
            {
                botContext.contextTree = botContext.contexts[i];
            }
        }

        callback(null);
    };

    var findDialogsetContext = function(botContext, dialogset, callback)
    {
        CustomContext.find({ dialogset: dialogset }).lean().exec(function(err, docs)
        {
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

            botContext.dialogsetContexts[dialogset] = dialogsetContexts;

            CustomContextItem.find({ dialogset: dialogset }).lean().exec(function(err, docs)
            {
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
        });
    };

    module.exports.load = function(botContext, user, callback)
    {
        findCustomContext(botContext, user, function()
        {
            findCustomContextItem(botContext, user, function()
            {
                setContextDialogs(botContext, function()
                {
                    botContext.dialogsetContexts = {};

                    async.eachSeries(bot.dialogsets, function(dialogset, next)
                    {
                        findDialogsetContext(botContext, dialogset, next);
                    },
                    function(err)
                    {
                        Logger.error(err);
                        callback();
                    });
                });
            });
        });
    };
})();
