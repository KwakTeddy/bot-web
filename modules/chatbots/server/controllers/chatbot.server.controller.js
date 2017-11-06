var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');

var Common = require(path.resolve('./modules/core/server/services/common.server.service.js'));

var ChatBot = mongoose.model('Bot');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = {  };
    if(req.user)
    {
        query.user = req.user._id;

        if(Common.isAdmin(req.user))
        {
            delete query.user;
        }
    }

    if(req.query.name)
        query.name = { "$name": req.query.name, "$options": 'i' };

    ChatBot.find(query).count(function(err, count)
    {
        if(err)
        {
            logger.systemError(err);
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
    if(req.user)
    {
        query.user = req.user._id;

        if(Common.isAdmin(req.user))
        {
            delete query.user;
        }
    }

    if(req.query.name)
        query.name = { "$name": req.query.name, "$options": 'i' };

    ChatBot.find(query).sort('-created').populate('user').skip(countPerPage*(page-1)).limit(countPerPage).exec(function (err, bots)
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
    ChatBot.findOne({ _id: req.params.botId }).exec(function(err, item)
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
        chatbot.save(function(err)
        {
            if(err)
            {
                return res.status(400).send({ message: err.stack || err });
            }

            var dir = path.resolve('./custom_modules/' + req.body.id);
            if(!fs.existsSync(dir))
            {
                fs.mkdirSync(dir);
            }

            var botjs = fs.readFileSync(__dirname + '/bot.template');
            var defaultjs = fs.readFileSync(__dirname + '/default.template');
            var graphjs = fs.readFileSync(__dirname + '/graph.template');

            fs.writeFileSync(dir + '/default.graph.js', graphjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));
            fs.writeFileSync(dir + '/default.js', defaultjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));
            fs.writeFileSync(dir + '/' + req.body.id + '.bot.js', botjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name));

            res.jsonp(chatbot);
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

            console.log('허허하하하 : ', item);

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
            res.end();
        }
    });
};
