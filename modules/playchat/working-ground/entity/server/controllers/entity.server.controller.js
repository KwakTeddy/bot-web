'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var async = require('async');
var mongoose = require('mongoose');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var logger = require(path.resolve('./config/lib/logger.js'));

var Entity = mongoose.model('Entity');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    Entity.find({ bot: req.params.botId, user: req.user._id }).count(function(err, count)
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

    Entity.find({ bot: req.params.botId, user: req.user._id }).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, items)
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

exports.create = function(req, res)
{
    Entity.findOne({ bot: req.params.botId, user: req.user._id, name: req.body.name }).exec(function(err, item)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        if(item)
        {
            return res.status(200).send({ message: 'duplicated name' });
        }

        var entity = new Entity(req.body);
        entity.bot = req.params.botId;
        entity.user = req.user;

        entity.save(function(err)
        {
            if (err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }
            else
            {
                res.jsonp(entity);
            }
        });
    });
};

exports.update = function(req, res)
{
    Entity.findOne({ bot: req.params.botId, user: req.user._id, name: req.body.name }).exec(function(err, item)
    {
        if (err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        if (item)
        {
            return res.status(200).send({ message: 'duplicated name' });
        }

        Entity.findOne({ _id: req.body._id, user: req.user._id, bot: req.params.botId }, function(err, item)
        {
            if (err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }

            if(item)
            {
                for(var key in req.body)
                {
                    item[key] = req.body[key];
                }

                item.save(function(err)
                {
                    if(err)
                    {
                        logger.systemError(err);
                        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                    }

                    res.jsonp(entity);
                });
            }
            else
            {
                res.status(200).end();
            }
        });
    });
};

exports.delete = function(req, res)
{
    Entity.remove({ _id: req.query._id, user: req.user._id, bot: req.params.botId }, function(err)
    {
        if(err)
        {
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.end();
        }
    });
};

// exports.uploadFile = function (req, res)
// {
//     var storage = multer.diskStorage(
//     {
//         destination: function (req, file, cb)
//         {
//             cb(null, './public/files/')
//         },
//         filename: function (req, file, cb)
//         {
//             cb(null, file.originalname);
//         }
//     });
//
//     var upload = multer({ storage: storage }).single('uploadFile');
//
//     upload.fileFilter = function (req, file, cb)
//     {
//         if (file.mimetype !== 'text/plain' && file.mimetype !== 'text/csv')
//         {
//             return cb(new Error('Only txt/csv files are allowed!'), false);
//         }
//
//         cb(null, true);
//     };
//
//     upload(req, res, function (uploadError)
//     {
//         if(uploadError)
//         {
//             return res.status(400).send({ message: 'Error occurred while uploading file' });
//         }
//         else
//         {
//             console.log('uploadFile:' + req.file.filename);
//             var info = path.parse(req.file.filename);
//             if (info.ext === ".csv" || info.ext === ".txt" || info.ext === ".xls" || info.ext === ".xlsx")
//             {
//                 var filepath = req.file.destination + req.file.filename;
//
//                 // 파일 업로드 후처리
//             }
//             else
//             {
//                 //TODO: need to check other types
//                 res.status(400).send({ message: '지원되지 않는 파일 입니다' });
//             }
//         }
//     });
// };
