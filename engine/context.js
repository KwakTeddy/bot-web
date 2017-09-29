var path = require('path');
var async = require('async');
var tough = require('tough-cookie');

var config = require(path.resolve('./config/config.js'));
var logger = require(path.resolve('./config/lib/logger.js'));

var botModule = require('./core/bot.js');
var dialog = require('../../action/common/dialog.js');
var BotUser = require('./models/bot-user.model.js');

(function()
{
    // private datas
    var channels = {};
    var userContexts = {};
    var botUserContexts = {};
    var bots = {};
    var context = {};


    // TODO 캐시 저장 개선. redis 활용.
    var SaveUsingCache = (function()
    {
        var LIMIT_CACHE = 1000000;
        var cache = [];

        var f = function(model, data, callback)
        {
            if(cache.length < LIMIT_CACHE)
            {
                cache.push(data);
                callback();
            }
            else
            {
                model.collection.insert(cache, function(err, docs)
                {
                    if(err)
                    {
                        // TODO 에러에 대한 처리.
                        callback();
                        return;
                    }

                    if(docs && docs.insertedCount)
                    {
                        cache.splice(0, docs.insertedCount);
                        callback(docs.insertedCount);
                    }
                });
            }
        };

        return f;
    })();

    var getUserContext = function(context, callback)
    {
        BotUser.findOne({ userKey: context.userId }, function(err, doc)
        {
            if(err)
            {
                // TODO
                logger.error(err);
                return;
            }

            if(doc == undefined)
            {
                SaveUsingCache(BotUser, { userKey: context.userId, channel: context.channel, created: new Date() }, function(count)
                {
                    if(count)
                    {
                        logger.systemLog('[getUserContext] botUsers: ' + docs.insertedCount + ' inserted.');
                    }
                    else
                    {
                        logger.systemLog('[getUserContext] botUser is added to cache.');
                    }
                });

                callback();
            }
            else
            {
                var botExist = false;

                // TODO
                // 좀더 나은 방법으로 개선하는게 좋겠음.
                doc.botId.forEach(function (id)
                {
                    if(id == context.botId)
                    {
                        botExist = true;
                    }
                });

                if(!botExist)
                {
                    // TODO
                    // 여기도 마찬가지로 세이브 할때 느릴 수 있을텐데.. cache 세이브 가능하다면.
                    doc.botId.push(context.botId);
                    doc.markModified('botId');
                    doc.save(function (err)
                    {
                        if(err)
                        {
                            // TODO
                            console.log(err);
                        }
                        else
                        {
                            callback(doc);
                        }
                    });
                }
                else
                {
                    callback(doc);
                }
            }
        });
    };

    var getBotContext = function(botName, callback)
    {
        if(bots[botName])
        {
            callback(bots[botName]);
        }
        else
        {
            botModule.loadBot(botName, function(bot)
            {
                if(bot)
                {
                    callback(bot);
                }
                else
                {
                    callback({});
                }
            });
        }
    };

    var getContext = function(channel, botId, userId, options, callback)
    {
        // 1. UserContext 확보.
        //   - user 객체가 undefined 면 다음 단계로 넘어간다.
        //   - user context 가 존재하면 저장 후 다음 단계로. 없으면 DB를 통해서 만들어낸다.

        var userContext = undefined;
        var botContext = undefined;
        var botUserContext = undefined;

        async.waterfall(
        [
            function(cb)
            {
                // 과연 정말 global이 필요한걸까?
                // global._channels[channel] = global._channels[channel] || {};

                if(!userContexts[userId])
                {
                    userContext = { botId: botId, channel: channel, userId: userId };
                    getUserContext(userContext, function(doc)
                    {
                        userContext.doc = doc;
                        userContext.userKey = userId;
                        if (userContext.address)
                        {
                            // 코드상 이 부분이 호출될 일은 없어 보인다.
                            // 만약 context.doc에 address가 있고 그놈을 아래 코드로 처리해야 한다면?
                            // userContext.addressCompact = userContext.address.지번주소.replace(/^([가-힣]+\s*)/, function (matched, p1)
                            // {
                            //     return '';
                            // });
                        }

                        userContexts[userId] = userContext;
                        cb();
                    });
                }
                else
                {
                    userContext = userContexts[userId];
                    cb();
                }
            },

            function(cb)
            {
                var botName = undefined
                if(userId != undefined)
                {
                    botUserContext = botUserContexts[botId + '_' + userId] || {};
                    botUserContext.dialog = botUserContext.dialog || {};
                    botUserContext.task = botUserContext.task || {};
                    botUserContext.options = options;

                    if(botUserContext.curbotId)
                    {
                        botName = botUserContext.curBotId;
                    }
                }

                cb(null, botName);
            },

            function(botName, cb)
            {
                console.log('봇네임 : ', botName);
                getBotContext(botName, function(bot)
                {
                    console.log('봇컨텍스트 : ', bot);
                    botContext = bot;
                    botContext.botName = botName;
                    cb(null);
                });
            }
        ],
        function(err)
        {
            var context =
            {
                global: _context,
                bot: botContext,
                channel: channels[channel],
                user: userContext,
                botUser: botUserContext,
                dialog: (botUserContext ? botUserContext.dialog : undefined),
                task: (botUserContext ? botUserContext.task : undefined)
            };

            if(context.channel)
            {
                context.channel.name = channel;
            }

            if(context.user)
            {
                if(!context.user.cookie)
                {
                    context.user.cookie = new tough.CookieJar();
                }
            }

            context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
            context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);

            callback(context);
        });
    };


    exports.getBotContext = getBotContext;
    exports.getContext = getContext;
})();
