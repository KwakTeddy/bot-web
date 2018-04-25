var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var accepts = require('accepts');
var async = require('async');


var S3 = require(path.resolve('./modules/common/s3.js'));

var ncp = require('ncp').ncp;
ncp.limit = 16;

var ChatBot = mongoose.model('Bot');
var BotAuth = mongoose.model('BotAuth');
var Template = mongoose.model('Template');
var User = mongoose.model('User');

var Intent = mongoose.model('Intent');
var IntentContent = mongoose.model('IntentContent');
var Entity = mongoose.model('Entity');
var EntityContent = mongoose.model('EntityContent');

var IntentController = require(path.resolve('./modules/playchat/working-ground/intent/server/controllers/intent.server.controller.js'));
var EntityController = require(path.resolve('./modules/playchat/working-ground/entity/server/controllers/entity.server.controller.js'));

var lanService = require(path.resolve('./modules/core/server/controllers/front.language.js'));
exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { user: req.user._id };

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

    var query = { user: req.user._id };

    if(req.query.name)
        query.name = { "$name": req.query.name, "$options": 'i' };

    ChatBot.find(query).sort('-created').populate('templateId').populate('user').skip(countPerPage*(page-1)).limit(countPerPage).exec(function (err, bots)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.json(bots);
        }
    });
};

exports.sharedList = function(req, res)
{
    BotAuth.find({ user: req.user._id, giver: { $ne : req.user._id } }).populate('bot').exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(list);
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

var deleteBotObjectFromS3 = function(botId, callback)
{
    if(process.env.NODE_ENV == 'production')
    {
        // var params = {  Bucket: 'playchat-custom-modules', Key: botId };
        // s3.deleteObject(params, function(err, data)
        // {
        //     if(callback)
        //     {
        //         callback(err, data);
        //     }
        // });
    }
};

exports.create = function(req, res)
{
    ChatBot.findOne({ id: req.body.id }).exec(function(err, bot)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        if(bot)
        {
            return res.status(400).send({ message: 'Duplicated Bot Id' });
        }

        ChatBot.findOne({ name: req.body.name }).exec(function(err, bot)
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
                    var type = req.body.type || 'blank';
                    var dir = path.resolve('./custom_modules/' + req.body.id);
                    if(!fs.existsSync(dir))
                    {
                        fs.mkdirSync(dir);
                    }

                    var language = req.body.language;
                    if(language === undefined) language = 'en';

                    if(type == 'sample')
                    {
                        var botjs = fs.readFileSync(__dirname + '/sample/' + req.body.sampleCategory + '/bot.template');
                        var defaultjs = fs.readFileSync(__dirname + '/sample/' + req.body.sampleCategory + '/default.template');
                        var graphjs = fs.readFileSync(__dirname + '/sample/' + req.body.sampleCategory + '/graph.' + language + '.template');

                        var graphData = graphjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);
                        var defaultData = defaultjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);
                        var botData = botjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);
                        fs.writeFileSync(dir + '/default.graph.js', graphData);
                        fs.writeFileSync(dir + '/default.js', defaultData);
                        fs.writeFileSync(dir + '/' + req.body.id + '.bot.js', botData);

                        if(process.env.NODE_ENV == 'production')
                        {
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.graph.js', dir + '/default.graph.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.js', dir + '/default.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'bot.js', dir + '/bot.js');
                        }

                        var contents = IntentController.parseXlsx(__dirname + '/sample/' + req.body.sampleCategory + '/intent.' + language + '.xlsx');
                        if(contents.length > 0)
                        {
                            var intent = new Intent();
                            intent.botId = req.body.id;
                            intent.name = 'sample';
                            intent.user = req.user;

                            intent.save(function(err)
                            {
                                if(err)
                                {
                                    console.error(err);
                                }
                                else
                                {
                                    IntentController.saveIntentContents(req.body.id, '', req.body.language, req.user, intent._id, contents, function()
                                    {
                                    },
                                    function(err)
                                    {
                                        console.error(err);
                                    });
                                }
                            });
                        }

                        var entities = EntityController.parseXlsx(__dirname + '/sample/' + req.body.sampleCategory + '/entity.' + language + '.xlsx');
                        if(entities.length > 0)
                        {
                            var entity = new Entity();
                            entity.botId = req.body.id;
                            entity.name = 'sample';
                            entity.user = req.user;

                            entity.save(function(err)
                            {
                                if(err)
                                {
                                    console.error(err);
                                }
                                else
                                {
                                    EntityController.saveEntityContents(req.body.id, '', req.user, entity._id, entities, function(){}, function(err)
                                    {
                                        console.error(err);
                                    });
                                }
                            });
                        }
                    }
                    else if(type == 'blank')
                    {
                        var botjs = fs.readFileSync(__dirname + '/sample/blank/bot.template');
                        var defaultjs = fs.readFileSync(__dirname + '/sample/blank/default.template');
                        var graphjs = fs.readFileSync(__dirname + '/sample/blank/graph.' + language + '.template');

                        var graphData = graphjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);
                        var defaultData = defaultjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);
                        var botData = botjs.toString().replace(/{id}/gi, req.body.id).replace(/{name}/gi, req.body.name);

                        fs.writeFileSync(dir + '/default.graph.js', graphData);
                        fs.writeFileSync(dir + '/default.js', defaultData);
                        fs.writeFileSync(dir + '/' + req.body.id + '.bot.js', botData);

                        if(process.env.NODE_ENV == 'production')
                        {
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.graph.js', dir + '/default.graph.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.js', dir + '/default.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'bot.js', dir + '/bot.js');
                        }
                    }
                    else
                    {
                        var botjs = fs.readFileSync(path.resolve('./custom_modules/' + type + ( chatbot.language == 'ko' ? '' : '_' + chatbot.language ) + '/bot.js'));
                        var defaultjs = fs.readFileSync(path.resolve('./custom_modules/' + type + ( chatbot.language == 'ko' ? '' : '_' + chatbot.language ) + '/default.js'));
                        var graphjs = fs.readFileSync(path.resolve('./custom_modules/' + type + ( chatbot.language == 'ko' ? '' : '_' + chatbot.language ) + '/default.graph.js'));

                        fs.writeFileSync(dir + '/default.graph.js', graphjs.toString());
                        fs.writeFileSync(dir + '/default.js', defaultjs.toString());
                        fs.writeFileSync(dir + '/bot.js', botjs.toString());

                        if(process.env.NODE_ENV == 'production')
                        {
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.graph.js', dir + '/default.graph.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'default.js', dir + '/default.js');
                            S3.uploadFile('playchat-custom-modules', req.body.id, 'bot.js', dir + '/bot.js');
                        }
                    }

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

exports.rename = function(req, res)
{
    ChatBot.update({ _id: req.params.botId }, { $set: { name: req.body.name } }).exec(function(err, result)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }

        res.jsonp(result);
    });
};

var getCloneName = function(name, index, callback)
{
    ChatBot.findOne({ name: name + (index == 0 ? '' : index) }).exec(function(err, item)
    {
        if(err)
        {
            callback(err);
        }
        else if(item)
        {
            getCloneName(name, index+1, callback);
        }
        else
        {
            callback(null, index);
        }
    });
};

var duplicateIntent = function(srcBotId, destBotId, callback)
{
    Intent.find({ botId: srcBotId }).exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return callback();
        }

        async.eachSeries(list, function(intent, next)
        {
            var newIntent = new Intent();
            newIntent.user = intent.user;
            newIntent.name = intent.name;
            newIntent.botId = destBotId;

            newIntent.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return next();
                }

                IntentContent.find({ intentId: intent._id }).exec(function(err, list)
                {
                    if(err)
                    {
                        console.error(err);
                        return next();
                    }

                    async.eachSeries(list, function(intentContent, next)
                    {
                        var newIntentContent = new IntentContent();
                        newIntentContent.input = intentContent.input;
                        newIntentContent.name = intentContent.name;
                        newIntentContent.intentId = newIntent._id;
                        newIntentContent.botId = destBotId;
                        newIntentContent.user = intentContent.user;

                        newIntentContent.save(function()
                        {
                            next();
                        });
                    },
                    function()
                    {
                        next();
                    });
                });
            });
        },
        function()
        {
            callback();
        });
    });
};

var duplicateEntity = function(srcBotId, destBotId, callback)
{
    Entity.find({ botId: srcBotId }).exec(function(err, list)
    {
        if(err)
        {
            console.error(err);
            return callback();
        }

        async.eachSeries(list, function(entity, next)
        {
            var newEntity = new Entity();
            newEntity.user = entity.user;
            newEntity.name = entity.name;
            newEntity.botId = destBotId;

            newEntity.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return next();
                }

                EntityContent.find({ entityId: entity._id }).exec(function(err, list)
                {
                    if(err)
                    {
                        console.error(err);
                        return next();
                    }

                    async.eachSeries(list, function(entityContent, next)
                    {
                        var newEntityContent = new EntityContent();
                        newEntityContent.name = entityContent.name;
                        newEntityContent.intentId = newEntity._id;
                        newEntityContent.user = entityContent.user;
                        newEntityContent.botId = destBotId;

                        newEntityContent.save(function()
                        {
                            next();
                        });
                    },
                    function()
                    {
                        next();
                    });
                });
            });
        },
        function()
        {
            callback();
        });
    });
};

exports.duplicate = function(req, res)
{
    ChatBot.findOne({ _id: req.params.botId }).exec(function(err, item)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            getCloneName(item.name + 'Clone', 0, function(err, index)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ message: err.stack || err });
                }

                var clone = new ChatBot();
                clone.id = item.id + '_Clone' + (index == 0 ? '' : index);
                clone.name = item.name + 'Clone' + (index == 0 ? '' : index);
                clone.description = item.description;
                clone.user = req.user;

                clone.save(function(err)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    if(!item.templateId)
                    {
                        var dest = path.resolve('./custom_modules/' + item.id + '_Clone' + (index == 0 ? '' : index));
                        ncp(path.resolve('./custom_modules/' + item.id), dest, function (err)
                        {
                            if (err)
                            {
                                console.error(err);
                                return res.status(400).send({ message: err.stack || err });
                            }

                            var fileList = fs.readdirSync(dest);
                            for(var i=0; i<fileList.length; i++)
                            {
                                var content = fs.readFileSync(path.resolve('./custom_modules/' + clone.id + '/' + fileList[i]));
                                content = content.toString();
                                content = content.replace(new RegExp('Bot\\([\'\"]+' + item.id, 'gi'), 'Bot(\'' + clone.id);

                                fs.writeFile(path.resolve('./custom_modules/' + clone.id + '/' + fileList[i]), content);

                                if(process.env.NODE_ENV == 'production')
                                {
                                    S3.uploadFile('playchat-custom-modules', clone.id, fileList[i], path.resolve('./custom_modules/' + clone.id + '/' + fileList[i]));
                                }
                            }

                            var botAuth = new BotAuth();
                            botAuth.giver = req.user;
                            botAuth.user = req.user;
                            botAuth.bot = clone._id;
                            botAuth.read = true;
                            botAuth.edit = true;

                            botAuth.save(function(err)
                            {
                                if (err)
                                {
                                    console.error(err);
                                    return res.status(400).send({ message: err.stack || err });
                                }

                                duplicateIntent(item.id, clone.id, function()
                                {
                                    duplicateEntity(item.id, clone.id, function()
                                    {
                                        res.jsonp(clone);
                                    });
                                });
                            });
                        });
                    }
                    else
                    {
                        res.jsonp(clone);
                    }
                });
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
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            var rimraf = require('rimraf');
            rimraf(path.resolve('./custom_modules') + '/' + req.query.botDisplayId, function () { res.end(); });

            deleteBotObjectFromS3(req.params.botId);
        }
    });
};

exports.share = function(req, res)
{
    var language = req.body.language;

    User.findOne({ $or: [{ email: req.body.data.email }, { username: req.body.data.email }] }).exec(function(err, item)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }

        if(item)
        {
            var botAuth = new BotAuth();
            botAuth.bot = req.params.botId;
            botAuth.user = item._id;
            botAuth.giver = req.user;
            botAuth.edit = req.body.data.edit ? true : false;

            botAuth.save(function(err)
            {
                if(err)
                {
                    console.error(err);
                    return res.status(400).send({ message: err.stack || err });
                }

                res.end();
            });
        }
        else
        {
            res.status(404).send({ message: req.body.data.email + ' ' + lanService(language)['L091'] });
        }
    });
};
