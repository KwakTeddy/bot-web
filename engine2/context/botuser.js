var mongoose = require('mongoose');
var BotUser = mongoose.model('BotUser');

(function()
{
    var MAX_CACHE_DIALOG = 500;
    var LIMIT_CACHE_DIALOG = 1000000;
    var BOTUSER_CACHE_INTERVAL = 60;

    var BotUserContext = function()
    {
        this.botUserCache = [];
    };

    BotUserContext.prototype.updateCacheBotUser = function(callback)
    {
        var that = this;

        try
        {
            var bulk = BotUser.collection.initializeOrderedBulkOp();
            for(var i = 0; i < this.botUserCache.length; i++)
            {
                bulk.find({userKey: this.botUserCache[i].userKey}).upsert().updateOne(this.botUserCache[i]);
            }

            bulk.execute(function(err, data)
            {
                if(!err)
                {
                    that.botUserCache.splice(0, data.nMatched);
                    console.log('botUsers: ' + data.nMatched + ' updated')
                }
                else
                {
                    callback(err);
                }
            });
        }
        catch(e)
        {
            console.log('updateCacheBotUser Err: ' + e);
            callback(e);
        }
    };

    BotUserContext.prototype.get = function(bot, user, channel, callback)
    {
        var that = this;
        BotUser.findOne({ userKey: user }, function(err, doc)
        {
            if(err)
            {
                return callback(err);
            }

            if(!doc)
            {
                if(that.botUserCache.length < LIMIT_CACHE_DIALOG)
                {
                    that.botUserCache.push({userKey: user, channel: channel, created: new Date()});
                }

                if(that.botUserCache.length >= MAX_CACHE_DIALOG)
                {
                    that.updateCacheBotUser(callback);
                }
                else
                {
                    callback(null);
                }
            }
            else
            {
                var check = false;
                for(var i=0; i<doc.botId.length; i++)
                {
                    if(doc.botId[i] == bot)
                    {
                        check = true;
                    }
                }

                if(!check)
                {
                    doc.botId.push(bot);
                    doc.markModified('botId');
                    doc.save(function (err)
                    {
                        if(err)
                        {
                            callback(err);
                        }
                        else
                        {
                            callback(null, doc);
                        }
                    });
                }
                else
                {
                    callback(null, doc);
                }
            }
        });
    };

    module.exports = new BotUserContext();
})();
