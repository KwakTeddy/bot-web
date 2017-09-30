var path = require('path');
var async = require('async');
var tough = require('tough-cookie');
var botUser = require(path.resolve('./bot-engine/bot-users.server.controller'));
var botModule = require(path.resolve('./bot-engine/bot'));
var dialog = require(path.resolve('./bot-engine/action/common/dialog'));

exports.getContext = function(botName, channel, user, options, callback)
{
    var userContext = undefined;
    var botUserContext = undefined;
    var botContext = undefined;

    async.waterfall([
        function(cb)
        {
            // TODO global._users 에 저장된게 없으면 저장하는 목적과 botUser db에 저장하는 작업임.

            if (!global._channels[channel])
                global._channels[channel] = {};

            if (user == undefined)
            {
                cb(null);
            }
            else if (!global._users[user])
            {
                var _user = { userId: user, channel: channel, bot: botName };
                botUser.getUserContext(_user, null, function ()
                {
                    userContext = { userId: user, channel: channel, bot: botName };
                    userContext.userKey = user;

                    // TODO 당연히 동작하지 않는 코드임.
                    // if (userContext.address)
                    // {
                    //     userContext.addressCompact = userContext.address.지번주소.replace(/^([가-힣]+\s*)/, function (matched, p1) {
                    //         return ''
                    //     });
                    // }

                    global._users[user] = userContext;

                    cb(null);
                });
            }
            else
            {
                userContext = global._users[user];
                cb(null);
            }
        },
        function(cb)
        {
            if(user != undefined)
            {
                var botUserName;
                botUserName = botName + '_' + user;

                if(!global._botusers[botUserName])
                {
                    global._botusers[botUserName] = {};
                }

                botUserContext = global._botusers[botUserName];

                botUserContext.orgBot = global._bots[botName];

                if(!botUserContext._dialog) botUserContext._dialog = {};
                if(!botUserContext._task) botUserContext._task = {};

                if(options) botUserContext.options = options;

                if(botUserContext.curBotId) botName = botUserContext.curBotId;
            }

            cb(null);
        },
        function(cb)
        {
            getBotContext(botName, function(_botContext)
            {
                botContext = _botContext;
                cb(null);
            });
        }
    ],
    function()
    {
        var context =
        {
            global: global._context,
            bot: botContext,
            channel: global._channels[channel],
            user: userContext,
            botUser: botUserContext,
            dialog: (botUserContext ? botUserContext._dialog : undefined),
            task: (botUserContext ? botUserContext._task : undefined)
        };

        if(context.bot) context.bot.botName = botName;
        if(context.channel) context.channel.name = channel;
        if(context.user)
        {
            context.user.userId = user;
            if(!context.user.cookie) context.user.cookie = new tough.CookieJar();
        }

        context.bot.startDialog = dialog.findGlobalDialog(null, context, dialog.START_DIALOG_NAME);
        context.bot.noDialog = dialog.findGlobalDialog(null, context, dialog.NO_DIALOG_NAME);

        callback(context);
    });
};

function getBotContext(botName, cb)
{
    if(global._bots[botName])
    {
        cb(global._bots[botName]);
    }
    else
    {
        botModule.loadBot(botName, function(_bot)
        {
            if(_bot)
            {
                cb(_bot);
            }
            else
            {
                cb({});
            }
        });
    }
};
