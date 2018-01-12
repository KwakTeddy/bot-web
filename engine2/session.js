(function()
{
    var Session = function()
    {
        this.bots = {};
        this.users = {};
        this.botUsers = {};
        this.channels = {};
    };

    Session.prototype.make = function(botId, userId, channel, options)
    {
        if(!this.bots[botId])
        {
            var botContext = { id: botId };
            this.bots[botId] = botContext;
        }

        if(!this.users[userId])
        {
            var userContext = { userId: userId, userKey: userId };
            this.users[userId] = userContext;
        }

        var botUserId = botId + '_' + userId;

        if(!this.botUsers[botUserId])
        {
            var botUserContext = { dialog: {}, task: {}, options: options };
            this.botUsers[botUserId] = botUserContext;
        }

        if(!this.channels[channel])
        {
            var channelContext = { name: channel };
            this.channels[channel] = channelContext;
        }

        var session =
        {
            bot: this.bots[botId],
            user: this.users[userId],
            botUser: this.botUsers[botUserId],
            channel: this.channels[channel]
        };

        return session;
    };

    module.exports = new Session();
})();
