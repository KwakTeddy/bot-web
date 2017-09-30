'use strict';

/**
 * Module dependencies.
 */
var path = require('path');

var mongoose = require('mongoose');
var BotUser = mongoose.model('BotUser');
var UserBotFbPage = mongoose.model('UserBotFbPage');
var Bank = mongoose.model('Bank');

var logger = require(path.resolve('./config/lib/logger.js'));

(function()
{
    var botUserCache = [];
    var botUserCacheLock = false;
    var MAX_CACHE_DIALOG = 500;
    var LIMIT_CACHE_DIALOG = 1000000;

    function updateCacheBotUser()
    {
        try
        {
            BotUser.collection.insert(botUserCache, function(err, docs)
            {

                if(docs && docs.insertedCount)
                {
                    botUserCache.splice(0, docs.insertedCount);
                    logger.systemLog('botUsers: ' + docs.insertedCount + ' inserted')
                }
            });
        }
        catch(e)
        {
        }
    }

    function getUserContext(task, context, callback)
    {
        BotUser.findOne({ userKey: task.userId }, function(err, doc)
        {
            if(doc == undefined)
            {
                if(false)
                {
                    BotUser.create({ userKey: task.userId, channel: task.channel, creaated: Date.now(), botId: task.bot }, function(err, _doc)
                    {
                        task.doc = _doc;
                        callback(task, context);
                    });
                }
                else
                {
                    if(botUserCache.length < LIMIT_CACHE_DIALOG)
                    {
                        botUserCache.push({ userKey: task.userId, channel: task.channel, created: new Date() });
                    }

                    if(!botUserCacheLock && botUserCache.length >= MAX_CACHE_DIALOG)
                    {
                        updateCacheBotUser();
                    }

                    callback(task, context);
                }
            }
            else
            {
                var botExist = false;
                doc.botId.forEach(function (botId)
                {
                    if(botId == task.bot)
                    {
                        botExist = true
                    }
                });

                if(!botExist)
                {
                    doc.botId.push(task.bot);
                    doc.markModified('botId');
                    doc.save(function (err)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            task.doc = doc;
                            callback(task, context);
                        }
                    });
                }
                else
                {
                    task.doc = doc;
                    callback(task, context);
                }
            }
        });
    };

    exports.getUserContext = getUserContext;
})();
