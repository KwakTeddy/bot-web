var path = require('path');
var mongoose = require('mongoose');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var logger = require(path.resolve('./config/lib/logger.js'));

var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 50;

    DialogsetDialog.find({ dialogset: req.params.dialogsetId }).count(function(err, count)
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
    var countPerPage = parseInt(req.query.countPerPage) || 50;

    DialogsetDialog.find({ dialogset: req.params.dialogsetId }).sort('-id').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, dialogs)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp(dialogs);
        }
    });
};

exports.create = function(req, res)
{
    var dialog = new DialogsetDialog(req.body);

    DialogsetDialog.find({ dialogset: req.params.dialogsetId }).sort('-id').limit(1).exec(function(err, dialogs)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        dialog.id = dialogs && dialogs.length > 0 ? dialogs[0].id + 1 : 0;
        dialog.save(function(err)
        {
            if (err)
            {
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }
            else
            {
                res.jsonp(dialog);
            }
        });
    });
};

exports.update = function(req, res)
{
    DialogsetDialog.findOne({ _id: req.body._id }).exec(function(err, dialog)
    {
        if(err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        dialog.inputRaw = req.body.inputRaw;
        dialog.output = req.body.output;
        dialog.save(function(err)
        {
            if(err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }

            res.jsonp(dialog);
        });
    });
};

exports.delete = function(req, res)
{
    DialogsetDialog.remove({ _id: req.params.dialogsetId }).exec(function(err)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        res.end();
    });
};
