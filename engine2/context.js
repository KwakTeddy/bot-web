var path = require('path');
var tough = require('tough-cookie');

var Error = require(path.resolve('./engine/error.js'));
var Logger = require(path.resolve('./engine/logger.js'));

var BotUser = require('./context/botuser.js');
var BotFactory = require('./bot.js');

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
                BotUser.get(bot, user, channel, function(err, botUser)
                {
                    if(err)
                    {
                        Error.delegate(user, err);
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

                        this.users[user] = userContext;
                        callback();
                    }
                });
            }
        }
        else
        {
            //이건 에러인거지.
            Error.delegate(user, 'User is undefined : ' + bot + ' ' + channel);
        }
    };

    Context.prototype.makeBotUserContext = function(bot, user, options)
    {
        var botUserName = bot + '_' + user;
        var botUserContext = this.botusers[botUserName];

        if(!botUserContext)
        {
            //언더바 없애고싶다.
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
            BotFactory.load(bot, user, function(botContext)
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

    Context.prototype.makeContext = function(bot, channel, user, options, callback)
    {
        if (!this.channels[channel])
        {
            this.channels[channel] = {};
        }

        var that = this;
        this.makeUserContext(bot, channel, user, function()
        {
            that.makeBotUserContext(function()
            {
                that.makeBotContext(bot, user, function()
                {
                    var userContext = that.users[user];
                    var botContext = that.bots[bot];
                    var botUserContext = that.botusers[bot + '_' + user];
                    var channelContext = that.channels[channel];

                    var context = {
                        global: global._context,
                        bot: botContext,
                        channel: channelContext,
                        user: userContext,
                        botUser: botUserContext,
                        dialog: (botUserContext ? botUserContext.dialog : undefined),
                        task: (botUserContext ? botUserContext.task : undefined)
                    };

                    if(context.bot)
                    {
                        context.bot.botName = bot;
                    }

                    if(context.channel)
                    {
                        context.channel.name = channel;
                    }

                    if(context.user)
                    {
                        context.user.userId = user;
                        if(!context.user.cookie)
                        {
                            context.user.cookie = new tough.CookieJar();
                        }
                    }

                    context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
                    context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);
                });
            });
        });
    };

    module.exports = new Context();
})();
