var cron = require('node-cron');
var chalk = require('chalk');

var mongoose = require('mongoose');
var BotUser = mongoose.model('BotUser');
var UserDialog = mongoose.model('UserDialog');
var UserDialogLog = mongoose.model('UserDialogLog');

(function()
{
    var dialogCache = [];
    var dialoglogCache = [];
    var MAX_CACHE_DIALOG = 500;
    var LIMIT_CACHE_DIALOG = 1000000;

    var botUserCache = [];

    var Logger = function()
    {
    };

    function updateCacheBotUser()
    {
        try
        {
            var bulk = BotUser.collection.initializeOrderedBulkOp();
            for(var i = 0; i < botUserCache.length; i++)
            {
                bulk.find({userKey: botUserCache[i].userKey}).upsert().updateOne(botUserCache[i]);
            }

            bulk.execute(function(err, data)
            {
                if(!err)
                {
                    botUserCache.splice(0, data.nMatched);
                    console.log('botUsers: ' + data.nMatched + ' updated')
                }

            })

        }
        catch(e)
        {
            console.log('updateCacheBotUser Err: ' + e);
        }
    };

    function updateCacheUserDialog()
    {
        try
        {
            UserDialog.collection.insert(dialogCache, function(err, docs)
            {

                if(docs && docs.insertedCount)
                {
                    dialogCache.splice(0, docs.insertedCount);
                    console.log('userdialogs: ' + docs.insertedCount + ' inserted')
                }

                var bulk = UserDialogLog.collection.initializeOrderedBulkOp();
                for(var i = 0; i < dialoglogCache.length; i++)
                {
                    bulk.find(dialoglogCache[i]).upsert().updateOne(dialoglogCache[i]);
                }

                bulk.execute(function(err, data)
                {
                    if(!err)
                    {
                        dialoglogCache.splice(0, data.nMatched);
                        console.log('userdialoglogs: ' + data.nMatched + ' updated')
                    }

                })

            });
        }
        catch(e)
        {
            console.error(e);
        }
    };

    cron.schedule('* * * * *', function()
    {
        updateCacheBotUser();
        updateCacheUserDialog();
    });

    Logger.prototype.logBotUser = function(botId, channel, userKey)
    {
        userKey = new Date().getTime();

        BotUser.findOne({ userKey: userKey }).exec(function(err, data)
        {
            if(err)
            {
                return console.error(err);
            }

            if(!data)
            {
                if(botUserCache.length < LIMIT_CACHE_DIALOG)
                {
                    botUserCache.push({userKey: userKey, channel: channel, created: new Date()});
                }

                if(botUserCache.length >= MAX_CACHE_DIALOG)
                {
                    updateCacheBotUser();
                }
            }
            else
            {
                var check = false;
                for(var i=0; i<data.botId.length; i++)
                {
                    if(data.botId[i] == botId)
                    {
                        check = true;
                        break;
                    }
                }

                if(!check)
                {
                    data.botId.push(botId);
                    data.markModified('botId');
                    data.save(function (err)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                    })
                }
            }
        });
    };

    Logger.prototype.logUserDialog = function(botId, userKey, channel, inputRaw, nlpText, outputText, dialogId, dialogName, preDialogId, preDialogName, isFail, dialogType)
    {
        var inQuery = {};
        inQuery.botId = botId;
        inQuery.userId = userKey;
        inQuery.channel = channel;
        inQuery.inOut = true;
        inQuery.isFail = isFail;
        inQuery.dialogId = dialogId;
        inQuery.dialogName = dialogName;
        inQuery.dialogType = dialogType;
        inQuery.preDialogId = preDialogId;
        inQuery.preDialogName = preDialogName;
        inQuery.nlpDialog = nlpText;
        inQuery.clear = '';
        inQuery.created = new Date();

        var outQuery = {};
        outQuery.botId = botId;
        outQuery.userId = userKey;
        outQuery.channel = channel;
        outQuery.inOut = false;
        outQuery.isFail = isFail;
        outQuery.dialogId = dialogId;
        outQuery.dialogName = dialogName;
        outQuery.dialogType = dialogType;
        outQuery.preDialogId = preDialogId;
        outQuery.preDialogName = preDialogName;
        outQuery.dialog = outputText;
        outQuery.clear = '';
        outQuery.created = new Date();

        if(dialogType == 'qna')
        {
            inQuery.dialogId = undefined;
            inQuery.dialogName = undefined;
            inQuery.preDialogId = undefined;
            inQuery.preDialogName = undefined;
            outQuery.dialogId = undefined;
            outQuery.dialogName = undefined;
            outQuery.preDialogName = inputRaw; // 대화학습입력 통계를 위한 데이터
        }

        var logQuery = {
            botId: botId,
            userId: userKey,
            channel: channel,
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1,
            date: (new Date()).getDate()
        };

        if(dialogCache.length < LIMIT_CACHE_DIALOG)
        {
            dialogCache.push(inQuery);
            dialogCache.push(outQuery);
        }

        if(dialoglogCache.length < LIMIT_CACHE_DIALOG)
        {
            dialoglogCache.push(logQuery);
        }

        if(dialogCache.length >= MAX_CACHE_DIALOG || dialoglogCache.length >= MAX_CACHE_DIALOG)
        {
            updateCacheUserDialog();
        }
    };

    Logger.prototype.now = function()
    {
        var now = new Date();

        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();

        var hour = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();

        month = month < 10 ? '0' + month : month;
        date = date < 10 ? '0' + date : date;
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;

        return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    };

    Logger.prototype.log = function()
    {
        console.log();
        console.log(chalk.green('================ Engine Error ' + this.now() + ' ================'));
        console.log.apply(null, arguments);
        console.log(chalk.green('=================================================================='));
        console.log();
    };

    Logger.prototype.error = function(err)
    {
        console.error();
        console.error(chalk.red('================ Engine Error ' + this.now() + ' ================'));
        console.error(err);
        console.error(chalk.red('=================================================================='));
        console.error();
    };

    module.exports = new Logger();
})();
