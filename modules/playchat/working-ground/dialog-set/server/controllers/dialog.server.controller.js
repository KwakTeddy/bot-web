var path = require('path');
var mongoose = require('mongoose');
var async = require('async');
var logger = require(path.resolve('./config/lib/logger.js'));

var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');
var CustomContext = mongoose.model('CustomContext');

var NLPManager = require(path.resolve('./engine2/input/nlp.js'));

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 50;

    var query = { dialogset: req.params.dialogsetId };

    if(req.query.rawText)
        query.inputRaw = { "$regex": req.query.rawText, "$options": 'i' };

    DialogsetDialog.find(query).count(function(err, count)
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

exports.find = function(req, res)
{
    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 50;

    var query = { dialogset: req.params.dialogsetId };

    if(req.query.rawText)
    {
        query.$or = [{
            inputRaw: { "$regex": req.query.rawText, "$options": 'i' }
        },
        {
            output: { "$regex": req.query.rawText, "$options": 'i' }
        }];
    }

    DialogsetDialog.find(query).sort('-id').lean().populate('context').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, dialogs)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            async.eachSeries(dialogs, function(dialog, next)
            {
                if(dialog.context && dialog.context.parent)
                {
                    CustomContext.findOne({ _id: dialog.context.parent }).lean().exec(function(err, parent)
                    {
                        if(parent)
                        {
                            dialog.context.parent = parent;
                            if(parent.parent)
                            {
                                CustomContext.findOne({ _id: parent.parent }).lean().exec(function(err, grandParent)
                                {
                                    if(grandParent)
                                    {
                                        parent.parent = grandParent;
                                        next();
                                    }
                                });
                            }
                            else
                            {
                                next();
                            }
                        }
                    });
                }
                else
                {
                    next();
                }
            },
            function()
            {
                res.jsonp(dialogs);
            });
        }
    });
};
//
// exports.findContexts = function(req, res)
// {
//     CustomContext.find({ bot: req.params.botId, user: req.user._id })
// };

exports.create = function(req, res)
{
    var dialog = new DialogsetDialog(req.body);

    DialogsetDialog.find({ dialogset: req.params.dialogsetId }).sort('-id').limit(1).exec(function(err, dialogs)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        dialog.id = dialogs && dialogs.length > 0 ? dialogs[0].id + 1 : 0;

        var inputList = [];

        async.eachSeries(dialog.inputRaw, function(inputRaw, done)
        {
            inputRaw = inputRaw.trim();

            var language = 'ko'; //temporary
            NLPManager.getNlpedText(language, inputRaw, function(err, lastChar, nlpText, nlp)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                inputList.push(nlpText);
                done();
            });
        },
        function()
        {
            dialog.input = inputList;
            dialog.save(function(err)
            {
                if (err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    res.jsonp(dialog);
                }
            });
        });
    });
};

exports.update = function(req, res)
{
    DialogsetDialog.findOne({ _id: req.body._id }).exec(function(err, dialog)
    {
        if(err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        dialog.inputRaw = req.body.inputRaw;
        dialog.output = req.body.output;

        var inputList = [];
        async.eachSeries(dialog.inputRaw, function(inputRaw, done)
        {
            inputRaw = inputRaw.trim();
            var language = req.query.language;
            NLPManager.getNlpedText(language, inputRaw, function(err, lastChar, nlpText, nlp)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                inputList.push(nlpText);
                done();
            });
        },
        function()
        {
            dialog.input = inputList;
            dialog.save(function(err)
            {
                if (err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }
                else
                {
                    res.jsonp(dialog);
                }
            });
        });

    });
};

exports.delete = function(req, res)
{
    DialogsetDialog.remove({ _id: req.params.dialogsId }).exec(function(err)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        res.end();
    });
};
