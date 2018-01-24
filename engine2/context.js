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
        this.history = [];

        // 사용자가 한 번 말할때마다 저장.
        // 총 history를 10개까지 들고 있음
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
                wordCorrection: '',
                entities: [],
                intents: []
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
