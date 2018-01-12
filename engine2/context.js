var path = require('path');
var tough = require('tough-cookie');

var Error = require('./error.js');
var Logger = require('./logger.js');

// var BotUserContext = require('./context/botUserContext.js');
// var BotContext = require('./context/botContext.js');

(function()
{
    var Context = function()
    {
        this.bots = {};
        this.users = {};
        this.botusers = {};
        this.channels = {};
    };

    Context.prototype.makeUserContext = function(bot, channel, user, callback)
    {
        var that = this;
        if(user)
        {
            var userContext = this.users[user];
            if(userContext)
            {
                //이미 로딩된 컨텍스트가 있으면
                callback();
            }
            else
            {
                //메모리에 로드된 컨텍스트가 없으면 생성한다.
                //FIXME 이건 봇과 유저의 링크를 db에 저장하기 위함인데 개선이 필요해 보임.
                BotUserContext.get(bot, user, channel, function(err, botUser)
                {
                    if(err)
                    {
                        callback(err);
                    }
                    else
                    {
                        var userContext = {
                            bot: bot,
                            userId: user,
                            userKey: user,
                            channel: channel,
                            doc: botUser
                        };

                        that.users[user] = userContext;
                        callback();
                    }
                });
            }
        }
        else
        {
            //이건 에러인거지.
            callback('User is undefined : ' + bot + ' ' + channel);
        }
    };

    Context.prototype.makeBotUserContextContext = function(bot, user, options, callback)
    {
        var botUserName = bot + '_' + user;
        var botUserContext = this.botusers[botUserName];

        if(!botUserContext)
        {
            botUserContext = this.botusers[botUserName] = {
                dialog: {},
                task: {}
            };
        }

        botUserContext.orgBot = this.bots[bot];

        if(options)
        {
            botUserContext.options = options;
        }

        callback();
    };

    Context.prototype.makeBotContext = function(bot, user, callback)
    {
        var that = this;
        if(this.bots[bot])
        {
            callback(this.bots[bot]);
        }
        else
        {
            BotContext.load(bot, user, function(botContext)
            {
                if(!botContext)
                {
                    botContext = {};
                }

                that.bots[bot] = botContext;

                callback();
            });
        }
    };

    Context.prototype.make = function()
    {
        var context =
        {
            nlu:
            {
                contextInfo:
                {
                    contextHistory: [], // 발화의 상태를 history로 저장한다
                    matchContextHistory: [], // 발화의 상태를 history로 저장한다
                    answerHistory: [], // 발화에 대한 대답의 history로 저장한다 (일반, 멀티context 등..)
                    queryHistory: [], // 사용자 발화를 history로 저장한다
                    context: [] // 현재 발화의 상태
                },
                dialog: {}, // dialog를 저장한다.
                matchInfo: // 현재 발화의 매치 정보
                {
                    qa: [],
                    contextNames: {},
                    contexts: {},
                    topScoreCount: 0
                },
                sentence: '',
                pos: '',
                nlpCorrection: '',
                inRawCorrection: '',
                wordCorrection: ''
            }
        };

        return context;

        // if (!this.channels[channel])
        // {
        //     this.channels[channel] = {};
        // }
        //
        // var that = this;
        // this.makeUserContext(bot, channel, user, function(err)
        // {
        //     if(err)
        //     {
        //         return callback(err);
        //     }
        //
        //     that.makeBotUserContextContext(bot, user, options, function()
        //     {
        //         that.makeBotContext(bot, user, function()
        //         {
        //             var userContext = that.users[user];
        //             var botContext = that.bots[bot];
        //             var botUserContext = that.botusers[bot + '_' + user];
        //             var channelContext = that.channels[channel];
        //
        //             var context = {
        //                 // global: global._context,
        //                 bot: botContext,
        //                 channel: channelContext,
        //                 user: userContext,
        //                 botUser: botUserContext,
        //                 dialog: (botUserContext ? botUserContext.dialog : undefined),
        //                 task: (botUserContext ? botUserContext.task : undefined)
        //             };
        //
        //             if(context.bot)
        //             {
        //                 context.bot.botName = bot;
        //             }
        //
        //             if(context.channel)
        //             {
        //                 context.channel.name = channel;
        //             }
        //
        //             if(context.user)
        //             {
        //                 context.user.userId = user;
        //                 if(!context.user.cookie)
        //                 {
        //                     context.user.cookie = new tough.CookieJar();
        //                 }
        //             }
        //
        //             context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
        //             context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);
        //
        //             callback(context);
        //         });
        //     });
        // });
    };

    module.exports = new Context();
})();
