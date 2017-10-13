'use strict';


var path = require('path');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

// var dialogset = require(path.resolve('modules_old/bot/engine/dialogset/dialogset'));
// var intentModule = require(path.resolve('modules_old/bot/engine/nlu/intent'));

var Intent = mongoose.model('Intent');
var IntentContent = mongoose.model('IntentContent');
var IntentContext = mongoose.model('IntentContext');

var errorHandler = require(path.resolve('./modules_old/core/server/controllers/errors.server.controller'));

var nlpManager = require(path.resolve('./bot-engine2/nlp-manager.js'));

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { botId: req.params.botId, user: req.user._id };

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Intent.find(query).count(function(err, count)
    {
        if(err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp({ totalPage: Math.ceil(count / countPerPage) });
        }
    });
};

exports.find = function(req, res)
{
    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = { botId: req.params.botId, user: req.user._id };

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Intent.find(query).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, items)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp(items);
        }
    });
};

exports.findIntentContent = function(req, res)
{
    IntentContent.find({ botId: req.params.botId, intentId: req.params.intentId, user: req.user._id }).exec(function(err, items)
    {
        if(err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        res.jsonp(items);
    });
};

var saveIntentContexts = function(botId, success, error)
{
    var words = {};

    IntentContent.find({ botId: botId }).exec(function(err, items)
    {
        if(err)
        {
            return error(err);
        }

        for(var i in items)
        {
            var ws = items[i].input.split(' ');

            for(var j in ws)
            {
                var word = ws[j];
                if(words[word] == undefined)
                {
                    words[word] = 1;
                }
                else
                {
                    words[word]++;
                }
            }
        }

        var list = [];
        for(var i in words)
        {
            if(i.length > 1)
                list.push({ word: i, count: words[i], botId: botId });
        }

        IntentContext.remove({ botId: botId }).exec(function(err)
        {
            if(err)
            {
                return error(err);
            }

            IntentContext.collection.insert(list, function (err, result)
            {
                if(err)
                {
                    return error(err);
                }

                success();
            });
        });
    });
};

var saveIntentContents = function(botId, user, intentId, contents, success, error)
{
    IntentContent.remove({ botId: botId, user: user, intentId: intentId }).exec(function(err)
    {
        if(err)
        {
            return error(err);
        }

        var list = [];

        async.each(contents, function(name, done)
        {
            var intentContent = {};
            intentContent.botId = botId;
            intentContent.user = user._id;
            intentContent.intentId = intentId;
            intentContent.name = name;

            nlpManager.tokenize(user.language, name, function(result)
            {
                var processed = result.processed;

                var nlp = [];
                for(var i in processed)
                {
                    if(processed[i].pos !== 'Josa' && processed[i].pos !== 'Punctuation')
                    {
                        nlp.push(processed[i].text);
                    }
                }

                var input = nlp.join(' ');

                intentContent.input = input;
                list.push(intentContent);

                done();

            }, function(err)
            {
                logger.systemError(err);
                return error(err);
            });
        }, function()
        {
            IntentContent.collection.insert(list, function (err, result)
            {
                if(err)
                {
                    return error(err);
                }
                else
                {
                    saveIntentContexts(botId, success, error);
                }
            });
        });
    });
};

exports.create = function(req, res)
{
    if(!req.body.name)
    {
        return res.status(400).send({ message: 'Name is not found' });
    }

    Intent.findOne({ botId: req.params.botId, user: req.user._id, name: req.body.name }, function (err, intent)
    {
        if (err)
        {
            return res.status(400).send({ message: err });
        }
        else
        {
            if(intent)
            {
                return res.status(400).send({ message: 'Duplicated name' });
            }

            var intent = new Intent();
            intent.botId = req.params.botId;
            intent.name = req.body.name;
            intent.user = req.user;

            intent.save(function (err)
            {
                if (err)
                {
                    logger.systemError(err);
                    return res.status(400).send({ message: err });
                }
                else
                {
                    var contents = req.body.intentContents;
                    saveIntentContents(req.params.botId, req.user, intent._id, contents, function()
                    {
                        res.jsonp(intent);
                    },
                    function(err)
                    {
                        return res.status(400).send({ message: err });
                    });
                }
            });
        }
    });
};

exports.update = function(req, res)
{
    if(!req.body.name)
    {
        return res.status(400).send({ message: 'Name is not found' });
    }

    Intent.findOne({ _id: req.body._id, botId: req.params.botId, user: req.user._id }).populate('user', 'displayName').exec(function(err, intent)
    {
        if(err)
        {
            return res.status(400).send({ message: err });
        }

        async.waterfall([function(done)
        {
            if(intent.name != req.body.name)
            {
                //기존 저장된 이름과 새로운 이름이 다르면 변경하는것이므로 중복 검사 해야함.
                Intent.findOne({ botId: req.params.botId, name: req.body.name }).exec(function(err, item)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err });
                    }

                    if(item)
                    {
                        return res.status(400).send({ message: 'Duplicated name' });
                    }
                    else
                    {
                        intent.name = req.body.name;
                        intent.save(function(err)
                        {
                            if(err)
                            {
                                return res.status(400).send({ message: err });
                            }

                            done();
                        });
                    }
                });
            }
            else
            {
                done();
            }
        }],
        function()
        {
            var contents = req.body.intentContents;
            saveIntentContents(req.params.botId, req.user, intent._id, contents, function()
            {
                res.jsonp(intent);
            },
            function()
            {
                return res.status(400).send({ message: err });
            });
        });
    });
};


exports.delete = function(req, res)
{
    IntentContent.remove({ botId: req.params.botId, intentId: req.params.intentId, user: req.user._id }).exec(function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err });
        }

        Intent.remove({ botId: req.params.botId, _id: req.params.intentId }).exec(function(err)
        {
            if(err)
            {
                return res.status(400).send({ message: err });
            }

            res.end();
        });
    });
};
