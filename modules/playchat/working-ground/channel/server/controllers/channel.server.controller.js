var mongoose = require('mongoose');
var request = require('request');
var UserBotFbPage = mongoose.model('UserBotFbPage');
var Bot = mongoose.model('Bot');

module.exports.getLineAccessToken = function(req, res)
{
    var botId = req.params.botId;
    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }
        else
        {
            if(bot)
            {
                res.send(bot.lineChannel);
            }
            else
            {
                res.send({ accessToken: '', channelId: '', secret: '' });
            }
        }
    });
};

module.exports.saveLineAccessToken = function(req, res)
{
    var channelId = req.body.channelId;
    var secret = req.body.secret;
    var accessToken = req.body.accessToken;
    var botId = req.params.botId;

    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }
        else
        {
            bot.lineChannel = { accessToken: accessToken, channelId: channelId, secret: secret };

            bot.save(function(err)
            {
                res.end();
            });
        }
    });
};

exports.facebookPage = function (req, res) {
    if (!req.body.list){ //change the information about facebook page connected
        UserBotFbPage.findOne({pageId : req.body.page.id}, function (err, data) {
            if(err){
                console.log(err);
            }else {
                if (data){
                    data.accessToken = req.body.page.access_token;
                    data.bot = req.body.userBot;
                    data.userBotId = req.body.userBotId;
                    data.connect = req.body.connect;
                    data.user = req.user._id;
                    data.save(function (err) {
                        if (err){
                            console.log(err);
                        }else {
                            return res.json(data);
                        }
                    })
                }else {
                    var info = {};
                    info['picture'] = req.body.page.picture.data.url;
                    info['name'] = req.body.page.name;
                    info['link'] = req.body.page.link;
                    info['accessToken'] = req.body.page.access_token;
                    info['pageId'] = req.body.page.id;
                    info['user'] = req.body.user;
                    info['bot'] = req.body.userBot;
                    info['userBotId'] = req.body.userBotId;
                    info['connect'] = req.body.connect;
                    var userBotFbPage = new UserBotFbPage(info);
                    userBotFbPage.save(function (err) {
                        if (err){
                            console.log(err);
                        }else {
                            return res.json(data);
                        }
                    })

                }
            }

        })
    }else { //get facebook pages connected
        var pageIds = [];
        for(var i = 0; i < req.body.pageInfo.length; i++){
            pageIds.push(req.body.pageInfo[i].id)
        }
        UserBotFbPage.find({pageId: {$in: pageIds}}).populate('bot').exec(function (err, data) {
            if(err){
                console.log(err);
            }else {
                return res.json(data);
            }

        })
    }
};

// 서버 재시작시 텔레그램 웹훅 연결을
(function()
{
    function requestWebHook(bot)
    {
        var options = {};
        if(process.env.NODE_ENV == 'production')
        {
            options.qs = { url: 'https://www.playchat.ai/telegram/' + bot.telegram }
        }
        else if(process.env.HOST)
        {
            options.qs = { url: process.env.HOST + '/telegram/' + bot.telegram }
        }
        else
        {
            //ngrok 로컬
            options.qs = { url: 'https://cbfb83b5.ngrok.io/telegram/' + bot.telegram }
        }

        options.method = 'POST';
        options.url = 'https://api.telegram.org/bot' + bot.telegram + '/deleteWebHook';
        options.simple = false;
        options.resolveWithFullResponse = true;
        options.forever = true;

        request(options, function(err, response, body)
        {
            if(err)
            {
                return console.error(err);
            }

            options.url = 'https://api.telegram.org/bot' + bot.telegram + '/setWebHook';

            request(options, function(err, response, body)
            {
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    console.log(body);
                }
            });
        });
    };

    Bot.find().exec(function(err, botList)
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            for(var i=0; i<botList.length; i++)
            {
                if(botList[i].telegram)
                {
                    requestWebHook(botList[i]);
                }
            }
        }
    });
})();

module.exports.getWechatToken = function(req, res)
{
    var botId = req.params.botId;
    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            res.status(400).send({ error: err });
        }
        else if(bot)
        {
            res.send(bot.wechat);
        }
        else
        {
            res.status(404).end();
        }
    });
};

module.exports.saveWechatToken = function(req, res)
{
    var botId = req.params.botId;
    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            res.status(400).send({ error: err });
        }
        else if(bot)
        {
            bot.wechat = { appId: req.body.appId, encodingAESKey: req.body.encodingAESKey };
            bot.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                res.send(bot.wechat);
            });
        }
        else
        {
            res.status(404).end();
        }
    });
};

module.exports.saveTelegramToken = function(req, res)
{
    var botId = req.params.botId;
    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            res.status(400).send({ error: err });
        }
        else if(bot)
        {
            bot.telegram = req.body.token;
            bot.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                var options = {};
                if(process.env.NODE_ENV == 'production')
                {
                    options.qs = { url: 'https://www.playchat.ai/telegram/' + bot.telegram }
                }
                else if(process.env.HOST)
                {
                    options.qs = { url: process.env.HOST + '/telegram/' + bot.telegram }
                }
                else
                {
                    //ngrok 로컬
                    options.qs = { url: 'https://cbfb83b5.ngrok.io/telegram/' + bot.telegram }
                }

                options.method = 'POST';
                options.url = 'https://api.telegram.org/bot' + bot.telegram + '/deleteWebHook';
                options.simple = false;
                options.resolveWithFullResponse = true;
                options.forever = true;

                request(options, function(err, response, body)
                {
                    if(err)
                    {
                        console.error(err);
                        return res.status(400).send({ error: err });
                    }


                    options.url = 'https://api.telegram.org/bot' + bot.telegram + '/setWebHook';

                    request(options, function(err, response, body)
                    {
                        if(err)
                        {
                            console.error(err);
                            return res.status(400).send({ error: err });
                        }

                        res.send({ token: bot.telegram });
                    });
                });
            });
        }
        else
        {
            res.status(404).end();
        }
    });
};

module.exports.getTelegramToken = function(req, res)
{
    var botId = req.params.botId;
    Bot.findOne({ id: botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            res.status(400).send({ error: err });
        }
        else if(bot)
        {
            res.send({ token: bot.telegram });
        }
        else
        {
            res.status(404).end();
        }
    });
};
