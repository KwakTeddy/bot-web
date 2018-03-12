'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var async = require('async');
var mongoose = require('mongoose');
var logger = require(path.resolve('./config/lib/logger.js'));

var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');
var Bot = mongoose.model('Bot');

// var uploadModule = require('./uploader/dialogset-uploader');

var dialogsetUploader = require('./dialog-set-uploader.js');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { bot: req.params.botId };

    if(req.query.title)
        query.title = { "$regex": req.query.title, "$options": 'i' };

    Dialogset.find(query).count(function(err, count)
    {
        if(err)
        {
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

    var query = { bot: req.params.botId };

    if(req.query.title)
        query.title = { "$regex": req.query.title, "$options": 'i' };

    Dialogset.find(query).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, dialogsets)
    {
        if (err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(dialogsets);
        }
    });
};

exports.findOne = function(req, res)
{
    Dialogset.findOne({ _id: req.params.dialogsetId }).exec(function(err, dialogset)
    {
        if (err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(dialogset);
        }
    });
};

exports.findDialogsetByTitle = function(req, res)
{
    Dialogset.findOne({ bot: req.params.botId, title: req.query.title }).exec(function(err, dialogset)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(dialogset);
        }
    });
};

exports.checkUploadEnd = function(req, res)
{
    Dialogset.findOne({ _id: req.params.dialogsetId }).exec(function(err, dialogset)
    {
        if(err)
        {
            console.error(err);
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            if(dialogset)
            {
                if(!dialogset.importState)
                {
                    res.send({ result: 'ok' });
                }
                else
                {
                    res.send({ result: 'no' });
                }
            }
            else
            {
                res.send({ result: 'nothing' });
            }
        }
    });
};

exports.create = function(req, res)
{
    var dialogset = new Dialogset(req.body);
    dialogset.bot = req.params.botId;
    dialogset.user = req.user;
    dialogset.language = req.body.language || 'ko';
    if(dialogset.filename && dialogset.path)
        dialogset.importState = 'start';

    dialogset.save(function(err)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            if(dialogset.title == 'default')
            {
                Bot.findOne({ _id: req.params.botId }).exec(function(err, bot)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    var list = bot.dialogsets;
                    if(!list)
                        list = [];

                    list.push(dialogset._id);

                    bot.dialogsets = list;

                    bot.save(function(err)
                    {
                        if(err)
                        {
                            return res.status(400).send({ message: err.stack || err });
                        }

                        res.jsonp(dialogset);
                    });
                });
            }
            else
            {
                // 파일업로드 하면 바로 db에 저장하는 코드임.
                if(dialogset.filename && dialogset.path)
                {
                    // uploadModule.importFile(req.body.language, dialogset, function()
                    // {
                    //     dialogset.importState = '';
                    //     dialogset.save(function(){});
                    // });

                    dialogsetUploader.upload(req.params.botId, req.body.language || 'ko', dialogset._id, dialogset.filename, function(err)
                    {
                        dialogset.importState = err || '';
                        dialogset.save(function()
                        {

                        });
                    });

                    res.jsonp(dialogset);
                    // dialogsetModule.convertDialogset1(dialogset, null, function(result)
                    // {
                    //     console.log(dialogset.filename + ' converted');
                    // });
                }
                else
                {
                    res.jsonp(dialogset);
                }
            }
        }
    });
};

var update = function(dialogset, res)
{
    dialogset.save(function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.jsonp(dialogset);
    });
};

exports.update = function(req, res)
{
    Dialogset.findOne({ _id: req.body._id, bot: req.params.botId }).populate('user', 'displayName').exec(function(err, dialogset)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        if(dialogset)
        {
            for(var key in req.body)
            {
                dialogset[key] = req.body[key];
            }

            dialogset.user = req.user;

            if(req.body.filename && req.body.path)
            {
                DialogsetDialog.remove({ dialogset: dialogset._id }, function (err, num)
                {
                    if(req.body.filename != dialogset.filename)
                    {
                        fs.unlink(path.join(dialogset.path, dialogset.filename), function (err)
                        {
                            if(err)
                            {
                                logger.systemError(err.stack || err);
                            }
                            // dialogsetModule.convertDialogset1(dialogset, null, function(result)
                            // {
                            //     console.log(dialogset.filename + ' converted');
                            //
                            //     update(dialogset, res);
                            // });
                        });
                    }

                    update(dialogset, res);
                });
            }
            else
            {
                update(dialogset, res);
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
    Dialogset.remove({ _id: req.params.dialogsetId, bot: req.params.botId }, function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            DialogsetDialog.remove({ dialogset: req.params.dialogsetId }).exec(function(err)
            {
                if(err)
                {
                    return res.status(400).send({ message: err.stack || err });
                }

                Bot.findOne({ _id: req.params.botId }).exec(function(err, bot)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    var list = bot.dialogsets;
                    if(!list)
                        list = [];

                    if(list)
                    {
                        for(var i=0; i<list.length; i++)
                        {
                            if(req.params.dialogsetId == list[i])
                            {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }

                    bot.dialogsets = list;

                    bot.save(function(err)
                    {
                        if(err)
                        {
                            return res.status(400).send({ message: err.stack || err });
                        }

                        res.end();
                    });
                });
            });
        }
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
            console.error(uploadError);
            return res.status(400).send({ message: 'Error occurred while uploading file' });
        }
        else
        {
            var info = path.parse(req.file.filename);
            if (info.ext === ".csv" || info.ext === ".txt" || info.ext === ".xls" || info.ext === ".xlsx")
            {
                var filepath = req.file.destination + req.file.filename;

                async.waterfall([
                    function(cb)
                    {
                        var data = fs.readFileSync(filepath);
                        var head = data.toString().split('\n')[0];
                        if (head === "Date,User,Message" || head.startsWith("Talk_"))
                        {
                            // kakao file
                            return res.status(400).send({ message: '카카오 대화파일은 현재 지원되지 않습니다' });
                        }
                        else if ( (head.match(/,/g) || []).length == 1)
                        {
                            cb(null);
                        }
                        else
                        {
                            //FIXME: sample inputs are not in the correct format
                            //return res.status(400).send({ message: '대화파일이 아닙니다' });
                            cb(null);
                        }
                    },
                    function()
                    {
                        res.json({ result: 'ok', path: req.file.destination, filename: req.file.filename, originalFilename: req.file.originalname });
                    }
                ]);
            }
            else
            {
                //TODO: need to check other types
                res.status(400).send({ message: '지원되지 않는 파일 입니다' });
            }
        }
    });
};

exports.updateUsable = function(req, res)
{
    Dialogset.findOne({ bot: req.params.botId, _id: req.body._id }, function(err, dialogset)
    {
        if(err)
        {
            logger.systemError(err.stack || err);
            return res.status(400).send({ message: err.stack || err });
        }

        dialogset.usable = req.body.usable;

        dialogset.save(function(err)
        {
            if(err)
            {
                logger.systemError(err.stack || err);
                return res.status(400).send({ message: err.stack || err });
            }

            if(dialogset.usable)
            {
                Bot.findOne({ _id: req.params.botId }).exec(function(err, bot)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    var list = bot.dialogsets;
                    if(!list)
                        list = [];

                    if(list)
                    {
                        for(var i=0; i<list.length; i++)
                        {
                            if(dialogset._id == list[i])
                            {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }

                    list.push(dialogset._id);

                    bot.dialogsets = list;

                    bot.save(function(err)
                    {
                        if(err)
                        {
                            return res.status(400).send({ message: err.stack || err });
                        }

                        res.end();
                    });
                });
            }
            else
            {
                Bot.findOne({ _id: req.params.botId }).exec(function(err, bot)
                {
                    if(err)
                    {
                        return res.status(400).send({ message: err.stack || err });
                    }

                    var list = bot.dialogsets;
                    if(list)
                    {
                        for(var i=0; i<list.length; i++)
                        {
                            if(req.body._id == list[i])
                            {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }

                    bot.dialogsets = list;

                    bot.save(function(err)
                    {
                        if(err)
                        {
                            return res.status(400).send({ message: err.stack || err });
                        }

                        res.end();
                    });
                });
            }
        });
    });
};
