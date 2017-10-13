var path = require('path');
var async = require('async');
var tough = require('tough-cookie');
var logger = require(path.resolve('./config/lib/logger.js'));

var commonDialogs = require('./common/common-dialogs.js');

var UserContextManager = require('./context/user-context.js');
var BotContextManager = require('./context/bot-context.js');

(function()
{
    var ContextManager = function()
    {
        this.users = {};
        this.botUsers = {};
        this.bots = {};
        this.channels = {};
        this.templates = {};
    };

    ContextManager.prototype.makeContext = function(botId, userId, channel, options, done)
    {
        var that = this;

        var userContext = this.users[userId];
        var botContext = this.bots[botId];
        var botUserContext = this.botUsers[botId + '_' + userId];
        var channelContext = this.channels[channel] || (this.channels[channel] = { name : channel });

        async.waterfall([
        function(next)
        {
            if(!userContext)
            {
                UserContextManager.getUserContext(userId, botId, channel, function(context)
                {
                    userContext = that.users[userId] = context;
                    next();
                });
            }
            else
            {
                next();
            }
        },
        function(next)
        {
            if(!botContext)
            {
                BotContextManager.getBotContext(botId, that.templates, function(context)
                {
                    botContext = that.bots[botId] = context;
                    next();
                });
            }
            else
            {
                next();
            }
        },
        function(next)
        {
            if(!botUserContext)
            {
                botUserContext = that.botUsers[botId + '_' + userId] = {};
            }

            if(!botUserContext.dialog)
            {
                botUserContext.dialog = {};
            }

            if(!botUserContext.task)
            {
                botUserContext.task = {};
            }

            if(options)
            {
                botUserContext.options = options;
            }

            next();

        }], function()
        {
            var context =
            {
                // global: global._context,
                bot: botContext,
                channel: channelContext,
                user: userContext,
                botUser: botUserContext,
                dialog: botUserContext._dialog,
                task: botUserContext._task
            };

            if(context.user)
            {
                if(!context.user.cookie) context.user.cookie = new tough.CookieJar();
            }

            context.bot.startDialog = commonDialogs.findGlobalDialog(null, context, commonDialogs.START_DIALOG_NAME);
            context.bot.noDialog = commonDialogs.findGlobalDialog(null, context, commonDialogs.NO_DIALOG_NAME);

            done(context);
        });
    };

    module.exports = new ContextManager();
})();
