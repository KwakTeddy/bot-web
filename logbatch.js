var cron = require('node-cron');
var path = require('path');
var fs = require('fs');

var mongoose = require('mongoose');

var BotUserModel = require('./engine2/models/bot-user.model.js');

var LIMIT_CACHE_DIALOG = 1000000;

var botUserCache = [];

mongoose.Promise = require('bluebird');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function()
{
    console.log("Connected to mongod server");
    (function()
    {
        cron.schedule('* * * * *', function()
        {
            if(botUserCache.length > 0)
            {
                var bulk = BotUserModel.collection.initializeOrderedBulkOp();
                for(var i = 0; i < botUserCache.length; i++)
                {
                    bulk.find({userKey: botUserCache[i].userKey}).upsert().updateOne(botUserCache[i]);
                }

                bulk.execute(function(err, data)
                {
                    if(!err)
                    {
                        botUserCache.splice(0, data.nMatched);
                    }
                });
            }
        });

        cron.schedule('10 * * * * *', function()
        {
            fs.readdir('./logs', function(err, list)
            {
                console.log(list);
                for(var i=0; i<list.length; i++)
                {
                    if(list[i].startsWith('botUser'))
                    {
                        var filename = list[i].replace('botUser-', '');
                        var split = filename.split('_');

                        var botId = split[0];
                        var userKey = split[1];
                        var channel = split[2];

                        var data = fs.readFileSync(path.resolve('./logs') + '/' + list[i]);
                        data = JSON.parse(data);

                        (function(fileName, botId, channel, userKey, data)
                        {
                            BotUserModel.findOne({ userKey: userKey }).exec(function(err, result)
                            {
                                if(err)
                                {
                                    console.error(err);
                                }
                                else if(result)
                                {
                                    for(var key in data)
                                    {
                                        result[key] = data[key];
                                    }

                                    for(var i=0; i<result.botId.length; i++)
                                    {
                                        if(result.botId[i] == botId)
                                        {
                                            fs.unlinkSync(path.resolve('./logs') + '/' + fileName);
                                            return;
                                        }
                                    }

                                    result.botId.push(botId);

                                    result.save(function(err)
                                    {
                                        if(err)
                                        {
                                            console.error(err);
                                        }
                                        else
                                        {
                                            console.log('저장합니다 : ', userKey, botId);
                                            fs.unlinkSync(path.resolve('./logs') + '/' + fileName);
                                        }
                                    });
                                }
                                else
                                {
                                    botUserCache.push({ userKey: userKey, channel: channel, botId: [botId] });

                                    if(botUserCache.length >= LIMIT_CACHE_DIALOG)
                                    {
                                        var bulk = BotUserModel.collection.initializeOrderedBulkOp();
                                        for(var i = 0; i < botUserCache.length; i++)
                                        {
                                            bulk.find({userKey: botUserCache[i].userKey}).upsert().updateOne(botUserCache[i]);
                                        }

                                        bulk.execute(function(err, data)
                                        {
                                            if(!err)
                                            {
                                                botUserCache.splice(0, data.nMatched);
                                            }
                                        });
                                    }

                                    // var botUser = new BotUserModel();
                                    // botUser.botId = [botId];
                                    // botUser.channel = channel;
                                    // botUser.userKey = userKey;
                                    //
                                    // for(var key in data)
                                    // {
                                    //     botUser[key] = data[key];
                                    // }
                                    //
                                    // botUser.save(function(err)
                                    // {
                                    //     if(err)
                                    //     {
                                    //         console.error(err);
                                    //     }
                                    //     else
                                    //     {
                                    //         console.log('저장합니다 : ', userKey, botId);
                                    //         fs.unlinkSync(path.resolve('./logs') + '/' + fileName);
                                    //     }
                                    // });
                                }
                            });
                        })(list[i], botId, channel, userKey, data);
                    }
                }
            });
        });
    })();
});

mongoose.connect('mongodb://' + (process.env.MONGOLAB_URI || 'localhost') + ':27017' + (process.env.NODE_ENV == 'production' ? '/bot' : '/bot-dev'), {useMongoClient : true});
