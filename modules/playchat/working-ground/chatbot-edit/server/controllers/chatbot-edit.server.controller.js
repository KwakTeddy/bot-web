var path = require('path');
var fs = require('fs');

var mongoose = require('mongoose');

var utils = require(path.resolve('./engine2/utils/utils.js'));

var Bot = mongoose.model('Bot');
var BotAuth = mongoose.model('BotAuth');

module.exports.find = function(req, res)
{
    Bot.findOne({ _id: req.params.botId }).exec(function(err, bot)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        if(bot)
        {
            var options = {};
            try
            {
                var dir = path.resolve('./custom_modules/' + bot.id);

                var list = fs.readdirSync(dir);
                for(var i=0; i<list.length; i++)
                {
                    if(list[i].endsWith('bot.js'))
                    {
                        utils.requireNoCache(dir + '/' + list[i])(options);
                    }
                }
            }
            catch(err)
            {
            }

            BotAuth.find({ bot: req.params.botId}).populate('user').exec(function(err, list)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                for(var i=0; i<list.length; i++)
                {
                    delete list[i].password;
                    delete list[i].salt;
                }

                res.jsonp({ version: options.version, list: list });
            });
        }
        else
        {
            console.error(err);
            return res.status(400).send({ message: 'bot not found' });
        }
    });
};

module.exports.updateBotAuth = function(req, res)
{
    BotAuth.findOne({ bot: req.params.botId, _id: req.params._id }).exec(function(err, item)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        if(item)
        {
            item.read = req.body.read;
            item.edit = req.body.edit;

            item.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                res.jsonp(item);
            });
        }
        else
        {
            res.status(404).send({ error: 'Data is not found' });
        }
    });
};

module.exports.deleteBotAuth = function(req, res)
{
    BotAuth.remove({ _id: req.params._id }).exec(function(err)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        res.end();
    });
};

module.exports.findBot = function(req, res)
{
    Bot.findOne({ _id: req.params.botId }).exec(function(err, item)
    {
        if (err)
        {
            console.error(err);
            return res.status(400).send({error: err});
        }

        if (item)
        {
            res.jsonp(item);
        }
        else
        {
            res.status(404).send({ error: 'Bot is not found' });
        }
    });
};

module.exports.updateBot = function(req, res)
{
    Bot.findOne({ _id: req.params.botId }).exec(function(err, item)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ error: err });
        }

        if(item)
        {
            item.name = req.body.name;
            item.description = req.body.description;
            item.language = req.body.language;
            item.imageFile = req.body.imageFile;

            item.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ error: err });
                }

                res.jsonp(item);
            });
        }
        else
        {
            res.status(404).end('Bot is not found');
        }
    });
};

module.exports.getBotOptions = function(req, res)
{
    try
    {
        var list = fs.readdirSync(path.resolve('./custom_modules/' + req.params.botId));
        for(var i=0; i<list.length; i++)
        {
            if(list[i].endsWith('bot.js'))
            {
                var options = {};
                utils.requireNoCache(path.resolve('./custom_modules/' + req.params.botId + '/' + list[i]), true)(options);

                return res.send(options);
            }
        }

        res.end();
    }
    catch(err)
    {
        res.status(400).send({ error: err });
    }
};

module.exports.updateBotOptions = function(req, res)
{
    try
    {
        var list = fs.readdirSync(path.resolve('./custom_modules/' + req.params.botId));
        for(var i=0; i<list.length; i++)
        {
            if(list[i].endsWith('bot.js'))
            {
                var options = {};
                utils.requireNoCache(path.resolve('./custom_modules/' + req.params.botId + '/' + list[i]), true)(options);
                for(var key in req.body.options)
                {
                    options[key] = req.body.options[key];
                }

                var content = 'module.exports = function(options)\r\n';
                content += '{';

                for(var key in options)
                {
                    content += '\r\n\toptions.' + key + ' = ';
                    if(typeof options[key] == 'object')
                    {
                        content += '\r\n' + JSON.stringify(options[key], null, 4);
                    }
                    else
                    {
                        if(typeof options[key] == 'string')
                        {
                            content += '\'' + options[key] + '\'';
                        }
                        else
                        {
                            content += options[key];
                        }
                    }

                    content += ';';
                }

                content += '\r\n};';

                fs.writeFileSync(path.resolve('./custom_modules/' + req.params.botId + '/' + list[i]), content);

                break;
            }
        }

        res.end();
    }
    catch(err)
    {
        res.status(400).send({ error: err });
    }
};
