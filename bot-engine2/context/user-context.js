var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

var mongoose = require('../utils/mongo-wrapper.js');

var BotUser = mongoose.model('BotUser');

(function()
{
    var LIMIT_CACHE_DIALOG = 1000000;
    var botUserCache = [];

    function updateCacheBotUser()
    {
        BotUser.collection.insert(botUserCache, function(err, docs)
        {
            if(err)
            {
                return logger.systemError(err);
            }

            if(docs && docs.insertedCount)
            {
                botUserCache.splice(0, docs.insertedCount);
                logger.systemLog('botUsers: ' + docs.insertedCount + ' inserted')
            }
        });
    }

    module.exports.getUserContext = function(userId, botId, channel, done)
    {
        BotUser.findOne({ userKey: userId }, function(err, doc)
        {
            if(err)
                return done(null);

            if(doc == undefined)
            {
                if(botUserCache.length < LIMIT_CACHE_DIALOG)
                {
                    botUserCache.push({ userKey: userId, channel: channel, created: new Date() });
                }

                updateCacheBotUser();

                done({ userId: userId, userKye: userId, channel: channel, bot: botId });
            }
            else
            {
                var botExist = doc.botId.indexOf(botId) != -1;
                if(!botExist)
                {
                    doc.botId.push(botId);
                    doc.markModified('botId');
                    doc.save(function (err)
                    {
                        if(err)
                        {
                            logger.systemError(err);
                        }
                        else
                        {
                            done({ userId: userId, userKye: userId, channel: channel, bot: botId });
                        }
                    });
                }
                else
                {
                    done({ userId: userId, userKye: userId, channel: channel, bot: botId });
                }
            }
        });
    };
})();
