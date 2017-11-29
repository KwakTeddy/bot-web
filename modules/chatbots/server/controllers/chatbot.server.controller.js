var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

var ChatBot = mongoose.model('Bot');
var BotAuth = mongoose.model('BotAuth');
var Template = mongoose.model('Template');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = {  };

    if(req.query.name)
        query.name = { "$name": req.query.name, "$options": 'i' };

    ChatBot.find(query).count(function(err, count)
    {
        if(err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ totalPage: Math.ceil(count / countPerPage) });
        }
    });
};

exports.find = function (req, res)
{
    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = {  };

    if(req.query.name)
        query.name = { "$name": req.query.name, "$options": 'i' };

    ChatBot.find(query).sort('-created').populate('templateId').populate('user').skip(countPerPage*(page-1)).limit(countPerPage).exec(function (err, bots)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.json(bots);
        }
    });
};

exports.findOne = function(req, res)
{
    ChatBot.findOne({ _id: req.params.botId }).populate('templateId').exec(function(err, item)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.json(item);
        }
    });
};

exports.create = function(req, res)
{
    ChatBot.findOne({ id: req.body.id, name: req.body.name }).exec(function(err, bot)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        if(bot)
        {
            return res.status(400).send({ message: 'Duplicated Bot' });
        }

        var chatbot = new ChatBot(req.body);
        chatbot.user = req.user;
        chatbot.save(function(err)
        {
            if(err)
            {
                console.error(err);
                return res.status(400).send({ message: err.stack || err });
            }

            Template.populate(chatbot, {path:"templateId"}, function(err, chatbot)
            {
                var dir = path.resolve('./custom_modules/' + req.body.id);
                if(!fs.existsSync(dir))
                {
                    fs.mkdirSync(dir);
                }

                // 배달봇같은 서비스 형태의 봇은 카피하지 않고 원천소스를 그대로 사용한다.
                // if(chatbot.templateId)
                // {
                //     var templateDir = path.resolve('./templates/' + req.body.templateDir);
                //
                //     var files = fs.readdirSync(templateDir + '/bot');
                //     for(var i=0; i<files.length; i++)
                //     {
                //         if(files[i].endsWith('.js'))
                //         {
                //             var fileData = fs.readFileSync(templateDir + '/bot/' + files[i]).toString();
                //             fs.writeFileSync(dir + '/' + files[i], fileData.replace(/{botId}/gi, chatbot.id));
                //         }
                //     }
                // }
                // else
                // {
                if(!chatbot.templateId)
                {
                    // 템플릿 아이디가 없으면 아예 생성도 하지 않음.
                    // 이 기능은 서비스봇인경우에 templateId를 가지는데 custom_modules에 생성할 필요도 없음.
                    var botjs = fs.readFileSync(__dirname + '/bot.template');
                    var defaultjs = fs.readFileSync(__dirname + '/default.template');
                    var graphjs = fs.readFileSync(__dirname + '/graph.template');

                    fs.writeFileSync(dir + '/default.graph.js', graphjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));
                    fs.writeFileSync(dir + '/default.js', defaultjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));
                    fs.writeFileSync(dir + '/' + req.body.id + '.bot.js', botjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));
                }
                // }

                var botAuth = new BotAuth();
                botAuth.bot = chatbot._id;
                botAuth.user = req.user;
                botAuth.giver = req.user;
                botAuth.edit = true;

                botAuth.save(function(err)
                {
                    if(err)
                    {
                        console.error(err);
                        return res.status(400).send({ message: err.stack || err });
                    }

                    res.jsonp(chatbot);
                });
            });
        });
    });
};

exports.update = function(req, res)
{
    ChatBot.findOne({ _id: req.params.botId }).exec(function(err, item)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            for(var key in req.body)
            {
                item[key] = req.body[key];
            }

            item.save(function(err)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    res.end();
                }
            });
        }
    });
};

exports.duplicate = function(req, res)
{
    ChatBot.findOne({ _id: req.params.botId }).exec(function(err, item)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var clone = new ChatBot();
            clone.id = item.id + ' Clone';
            clone.name = item.name;
            clone.description = item.description;
            clone.user = req.user;

            clone.save(function(err)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                res.jsonp(item);
            });
        }
    });
};

exports.delete = function(req, res)
{
    ChatBot.remove({ _id: req.params.botId }).exec(function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var rimraf = require('rimraf');
            rimraf(path.resolve('./custom_modules') + '/' + req.query.botDisplayId, function () { res.end(); });
        }
    });
};
