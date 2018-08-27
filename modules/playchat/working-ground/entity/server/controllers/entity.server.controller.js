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
var logger = require(path.resolve('./config/lib/logger.js'));

var XLSX = require('xlsx');
var csv = require('fast-csv');

var Entity = mongoose.model('Entity');
var EntityContent = mongoose.model('EntityContent');
var EntityContentSynonym = mongoose.model('EntityContentSynonym');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { botId: req.params.botId };
    if(req.query.templateId)
    {
        delete query.botId;
        query.templateId = req.query.templateId;
    }

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Entity.find(query).count(function(err, count)
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
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = { botId: req.params.botId };
    if(req.query.templateId)
    {
        delete query.botId;
        query.templateId = req.query.templateId;
    }

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Entity.find(query).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, items)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(items);
        }
    });
};

exports.findOne = function(req, res)
{
    Entity.findOne({ _id: req.params._id }).exec(function(err, item)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ error: err.stack || err });
        }
        else
        {
            res.jsonp(item);
        }
    });
};

exports.findEntityContents = function(req, res)
{
    EntityContent.find({ botId: req.params.botId, entityId: req.params.entityId }).exec(function(err, entityContents)
    {
        if(err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        var list = [];
        async.each(entityContents, function(entityContent, done)
        {
            var json = entityContent.toJSON();
            EntityContentSynonym.find({ botId: req.params.botId, entityId: req.params.entityId, contentId: entityContent._id }).exec(function(err, entityContentSynonyms)
            {
                if(err)
                {
                    logger.systemError(err.stack || err);
                }

                json.synonyms = entityContentSynonyms;

                list.push(json);

                done();
            });
        },
        function()
        {
            res.jsonp(list);
        });
    });
};

function saveEntityContentSynonyms(botId, templateId, user, entityId, contentId, synonyms, callback, errCallback)
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
            if(templateId)
                synonym.templateId = templateId;
            synonym.entityId = entityId;
            synonym.contentId = contentId;
            synonym.name = item;

            synonym.save(function(err)
            {
                if(err)
                {
                    logger.systemError(err.stack || err);
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

function saveEntityContents(botId, templateId, user, entityId, contents, callback, errCallback)
{
    EntityContent.remove({ botId: botId, user: user._id, entityId: entityId }, function(err, result)
    {
        if(err)
        {
            if(errCallback)
            {
                return errCallback(err);
            }

            console.error(err);
            return;
        }

        var errs = [];

        async.eachSeries(contents, function(item, done)
        {
            var content = new EntityContent();
            if(item._id)
                content._id = item._id;
            content.name = item.name;
            content.botId = botId;
            if(templateId)
                content.templateId = templateId;
            content.user = user;
            content.entityId = entityId;

            content.save(function(err)
            {
                if(err)
                {
                    logger.systemError(err.stack || err);
                    errs.push(err);
                    done();
                }
                else
                {
                    saveEntityContentSynonyms(botId, templateId, user, entityId, content._id, item.synonyms, done, function(err)
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

module.exports.saveEntityContents = saveEntityContents;

function parseText(text)
{
    var contents = [];
    var lines = text.split('\n');

    var lastEntityContent = {};
    for(var i=0; i<lines.length; i++)
    {
        var line = lines[i].trim();

        if(!line)
            continue;

        if(i % 2 == 0)
        {
            lastEntityContent.name = line.replace('[', '').replace(']', '');
            lastEntityContent.synonyms = [];
        }
        else
        {
            var split = line.split(/\s/gi);
            for(var j=0; j<split.length; j++)
            {
                if(split[j])
                {
                    lastEntityContent.synonyms.push(split[j]);
                }
            }

            contents.push(lastEntityContent);
            lastEntityContent = {};
        }
    }

    return contents;
};

function parseXlsx(filepath)
{
    var contents = [];
    var workbook = XLSX.readFile(filepath);
    var first_sheet_name = workbook.SheetNames[0];
    var ws = workbook.Sheets[first_sheet_name];

    var range = XLSX.utils.decode_range(ws['!ref']);

    var entity = undefined;
    for(var r=1; r<=range.e.r; r++)
    {
        var name = ws[XLSX.utils.encode_cell({ c:0, r:r })];
        var synonym = ws[XLSX.utils.encode_cell({ c:1, r:r })];

        name = name ? name.v : undefined;
        synonym = synonym ? synonym.v : undefined;

        if(name)
        {
            if(!entity)
            {
                entity = { synonyms: [] };
            }
            else
            {
                contents.push(entity);
                entity = { synonyms: [] };
            }

            entity.name = name;

            if(synonym)
                entity.synonyms.push(synonym);
        }
        else if(synonym)
        {
            entity.synonyms.push(synonym);
        }
    }

    if(entity)
        contents.push(entity);

    return contents;
};

module.exports.parseXlsx = parseXlsx;

function parseCsv(filepath, callback)
{
    var contents = [];
    var stream = fs.createReadStream(filepath);

    var entity = undefined;
    var csvStream = csv().on("data", function(data)
    {
        var name = data[0];
        var synonym = data[1];

        if(name)
        {
            if(!entity)
            {
                entity = { synonyms: [] };
            }
            else
            {
                contents.push(entity);
                entity = { synonyms: [] };
            }

            entity.name = name;

            if(synonym)
                entity.synonyms.push(synonym);
        }
        else if(synonym)
        {
            entity.synonyms.push(synonym);
        }

    }).on("end", function()
    {
        if(entity)
            contents.push(entity);

        callback(contents);
    });

    stream.pipe(csvStream);
};

function getContentFromFile(req, res, callback)
{
    var filename = req.body.filename;

    var dir = path.resolve('public/files/');
    var filepath = path.join(dir, filename);

    if(filepath.endsWith('.txt'))
    {
        fs.readFile(filepath, function(err, data)
        {
            if(err)
            {
                return res.status(400).send({ message: err });
            }

            callback(parseText(data.toString()));
        });
    }
    else if(filepath.endsWith('.xlsx'))
    {
        callback(parseXlsx(filepath));
    }
    else if(filepath.endsWith('.csv'))
    {
        parseCsv(filepath, callback);
    }
};

exports.create = function(req, res)
{
    Entity.findOne({ botId : req.params.botId, name: req.body.name}).exec(function(err, item)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        if(item)
        {
            return res.status(400).send({ message: 'Duplicated entity name' });
        }

        var entity = new Entity(req.body);
        entity.botId = req.params.botId;
        if(req.body.templateId)
            entity.templateId = req.body.templateId;
        entity.user = req.user;

        entity.save(function(err)
        {
            if (err)
            {
                logger.systemError(err.stack || err);
                return res.status(400).send({ message: err.stack || err });
            }
            else
            {
                if(req.body.filename && req.body.path)
                {
                    getContentFromFile(req, res, function(contents)
                    {
                        if(contents.length > 0)
                        {
                            saveEntityContents(req.params.botId, req.body.templateId, req.user, entity._id, contents, function()
                            {
                                res.jsonp(entity);
                            },
                            function(err)
                            {
                                return res.status(400).send({ message: err });
                            });
                        }
                        else
                        {
                            res.jsonp(entity);
                        }
                    });
                }
                else
                {
                    saveEntityContents(req.params.botId, req.body.templateId, req.user, entity._id, req.body.entityContents, function()
                    {
                        res.jsonp(entity);
                    },
                    function(err)
                    {
                        logger.systemError(err.stack || err);
                        return res.status(400).send({ message: err.stack || err });
                    });
                }
            }
        });
    });
};

exports.update = function(req, res)
{
    Entity.findOne({ _id: req.body._id, botId: req.params.botId }).populate('user', 'displayName').exec(function(err, item)
    {
        if (err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        if(item)
        {
            if(item.name != req.body.name)
            {
                Entity.findOne({ botId: req.params.botId, name: req.body.name }).exec(function(err, duplicatedItem)
                {
                    if (err)
                    {
                        logger.systemError(err.stack || err);
                        return res.status(400).send({ message: err.stack || err });
                    }

                    if(duplicatedItem)
                    {
                        return res.status(400).send({ message: 'Duplicated entity name'});
                    }

                    item.name = req.body.name;
                    item.save(function(err)
                    {
                        if (err)
                        {
                            logger.systemError(err.stack || err);
                            return res.status(400).send({ message: err.stack || err });
                        }

                        saveEntityContents(req.params.botId, req.body.templateId, req.user, item._id, req.body.entityContents, function()
                        {
                            res.jsonp(item);
                        },
                        function(err)
                        {
                            logger.systemError(err.stack || err);
                            return res.status(400).send({ message: err.stack || err });
                        });
                    });
                });
            }
            else
            {
                saveEntityContents(req.params.botId, req.body.templateId, req.user, item._id, req.body.entityContents, function()
                {
                    res.jsonp(item);
                },
                function(err)
                {
                    logger.systemError(err.stack || err);
                    return res.status(400).send({ message: err.stack || err });
                });
            }
        }
        else
        {
            res.status(200).end();
        }
    });
};

exports.delete = function(req, res)
{
    Entity.remove({ _id: req.params.entityId }, function(err)
    {
        if(err)
        {
            logger.systemError(err.stack || err);
        }

        EntityContent.remove({ botId: req.params.botId, entityId: req.params.entityId }).exec(function(err)
        {
            if(err)
            {
                logger.systemError(err.stack || err);
            }

            EntityContentSynonym.remove({ botId: req.params.botId, entityId: req.params.entityId }).exec(function(err)
            {
                if (err)
                {
                    logger.systemError(err.stack || err);
                }

                res.end();
            });
        });
    });
};

exports.uploadFile = function (req, res)
{
    var storage = multer.diskStorage(
        {
            destination: function (req, file, cb)
            {
                cb(null, './public/files/')
            },
            filename: function (req, file, cb)
            {
                cb(null, file.originalname);
            }
        });

    var upload = multer({ storage: storage }).single('uploadFile');

    upload.fileFilter = function (req, file, cb)
    {
        if (file.mimetype !== 'text/plain' && file.mimetype !== 'text/csv')
        {
            return cb(new Error('Only txt/csv files are allowed!'), false);
        }

        cb(null, true);
    };

    upload(req, res, function (uploadError)
    {
        if(uploadError)
        {
            return res.status(400).send({ message: 'Error occurred while uploading file' });
        }
        else
        {
            var info = path.parse(req.file.filename);
            if (info.ext === ".csv" || info.ext === ".txt" || info.ext === ".xls" || info.ext === ".xlsx")
            {
                res.json({ result: 'ok', path: req.file.destination, filename: req.file.filename, originalFilename: req.file.originalname });
            }
            else
            {
                //TODO: need to check other types
                res.status(400).send({ message: '지원되지 않는 파일 입니다' });
            }
        }
    });
};
