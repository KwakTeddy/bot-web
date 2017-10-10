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
var EntityContent = mongoose.model('EntityContent');
var EntityContentSynonym = mongoose.model('EntityContentSynonym');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    Entity.find({ botId: req.params.botId, user: req.user._id }).count(function(err, count)
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

    Entity.find({ botId: req.params.botId, user: req.user._id }).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, items)
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

exports.findOne = function(req, res)
{
    Entity.findOne({ botId: req.params.botId, user: req.user._id, _id: req.params._id }).populate('user', 'displayName').exec(function(err, entity)
    {
        var result = {};
        result.entity = {};
        result.model = entity;

        EntityContent.find({ botId: req.params.botId, user: req.user._id, entityId: req.params._id }).exec(function(err, entityContents)
        {
            if(err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }

            result.entity.contents = [];
            result.entity.models = entityContents;

            async.each(entityContents, function(entityContent, done)
            {
                var contents = {};
                contents.name = entityContent.name;
                result.entity.contents.push(contents);

                EntityContentSynonym.find({ botId: req.params.botId, entityId: req.params._id, contentId: entityContent._id }).exec(function(err, entityContentSynonyms)
                {
                    if(err)
                    {
                        logger.systemError(err);
                    }

                    contents.synonyms = entityContentSynonyms;

                    done();
                });
            },
            function()
            {
                res.jsonp(result);
            });
        });
    });
};

function saveEntityContentSynonyms(botId, user, entityId, contentId, synonyms, callback, errCallback)
{
    EntityContentSynonym.remove({ botId: botId, entityId: entityId, contentId: contentId }, function(err, result)
    {
        if(err)
        {
            return errCallback(err);
        }

        async.each(synonyms, function(item, done)
        {
            var synonym = new EntityContentSynonym();
            synonym.botId = botId;
            synonym.entityId = entityId;
            synonym.contentId = contentId;
            synonym.name = item;

            synonym.save(function(err)
            {
                if(err)
                {
                    logger.systemError(err);
                }
                else
                {
                }

                done();
            });
        },
        function()
        {
            callback();
        });
    });
};

function saveEntityContents(botId, user, entityId, contents, callback, errCallback)
{
    EntityContent.remove({ botId: botId, user: user._id, entityId: entityId }, function(err, result)
    {
        if(err)
        {
            return errCallback(err);
        }

        var errs = [];

        async.each(contents, function(item, done)
        {
            var content = new EntityContent();
            if(item._id)
                content._id = item._id;
            content.name = item.name;
            content.botId = botId;
            content.user = user;
            content.entityId = entityId;

            content.save(function(err)
            {
                if(err)
                {
                    logger.systemError(err);
                    errs.push(err);
                    done();
                }
                else
                {
                    saveEntityContentSynonyms(botId, user, entityId, content._id, item.synonyms, done, function(err)
                    {
                        errs.push(err);
                        done();
                    });
                }
            });
        },
        function()
        {
            if(errs.length > 0)
                errCallback(errs);
            else
                callback();
        });
    });
};

exports.create = function(req, res)
{
    var entity = new Entity(req.body);
    entity.botId = req.params.botId;
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
            saveEntityContents(req.params.botId, req.user, entity._id, req.body.entityContents, function()
            {
                res.jsonp(entity);
            },
            function(err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            });
        }
    });
};

exports.update = function(req, res)
{
    Entity.findOne({ _id: req.body._id, user: req.user._id, botId: req.params.botId }).populate('user', 'displayName').exec(function(err, item)
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

                item.user = req.user;

                saveEntityContents(req.params.botId, req.user, item._id, req.body.entityContents, function()
                {
                    res.jsonp(item);
                },
                function(err)
                {
                    logger.systemError(err);
                    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                });
            });
        }
        else
        {
            res.status(200).end();
        }
    });
};

exports.delete = function(req, res)
{
    Entity.remove({ _id: req.query._id }, function(err)
    {
        if(err)
        {
            logger.systemError(err);
        }

        EntityContent.remove({ botId: req.params.botId, user: req.user._id, entityId: req.query._id }).exec(function(err)
        {
            if(err)
            {
                logger.systemError(err);
            }

            EntityContentSynonym.remove({ botId: req.params.botId, entityId: req.query._id }).exec(function(err)
            {
                if (err)
                {
                    logger.systemError(err);
                }

                res.end();
            });
        });
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
