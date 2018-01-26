var path = require('path');

var Context = require('./context.js');

(function()
{
    // 내부 channel을 레디스로
    var Session = function()
    {
        this.channel = {};
    };

    Session.prototype.load = function(json, botId, userId, channel)
    {
        this.channel[channel] = {};
        this.channel[channel][botId + '_' + userId] = JSON.parse(json);
    };

    Session.prototype.make = function(botId, userId, channel)
    {
        if(!this.channel[channel])
        {
            this.channel[channel] = {};
        }

        var session = this.channel[channel][botId + '_' + userId];
        if(!session)
        {
            session = this.channel[channel][botId + '_' + userId] = {};
            session.context = new Context();
            session.userData = {};
        }
        else
        {
            session.context.make();
        }

        return session;
    };

    module.exports = new Session();
})();
