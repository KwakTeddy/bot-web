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

// var dialogsetModule = require(path.resolve('./bot-engine/engine/dialogset/dialogset.js'));

// var util = require('util');

var Dialogset = mongoose.model('Dialogset');
var DialogsetDialog = mongoose.model('DialogsetDialog');
var Bot = mongoose.model('Bot');

exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    Dialogset.find({ bot: req.params.botId }).count(function(err, count)
    {
        if(err)
        {
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

    Dialogset.find({ bot: req.params.botId }).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, dialogsets)
    {
        if (err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp(dialogsets);
        }
    });
};

exports.findDialogsetByTitle = function(req, res)
{
    Dialogset.findOne({ bot: req.params.botId, title: req.query.title }).exec(function(err, dialogset)
    {
        if (err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp(dialogset);
        }
    });
};

exports.create = function(req, res)
{
    var dialogset = new Dialogset(req.body);
    dialogset.bot = req.params.botId;
    dialogset.user = req.user;

    dialogset.save(function(err)
    {
        if (err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.jsonp(dialogset);
            // 파일업로드 하면 바로 db에 저장하는 코드임.
            // if(dialogset.filename && dialogset.path)
            // {
            //     dialogsetModule.convertDialogset1(dialogset, null, function(result)
            //     {
            //         console.log(dialogset.filename + ' converted');
            //     });
            // }
        }
    });
};

var update = function(dialogset, res)
{
    dialogset.save(function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        res.jsonp(dialogset);
    });
};

exports.update = function(req, res)
{
    Dialogset.findOne({ _id: req.body._id, bot: req.params.botId }, function(err, dialogset)
    {
        if (err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        if(dialogset)
        {
            for(var key in req.body)
            {
                dialogset[key] = req.body[key];
            }

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
                                logger.systemError(err);
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
    Dialogset.remove({ _id: req.query._id, bot: req.params.botId }, function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        else
        {
            res.end();
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
            return res.status(400).send({ message: 'Error occurred while uploading file' });
        }
        else
        {
            console.log('uploadFile:' + req.file.filename);
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
                            console.log('kakao csv');
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
            logger.systemError(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }

        dialogset.usable = req.body.usable;

        dialogset.save(function(err)
        {
            if(err)
            {
                logger.systemError(err);
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            }

            res.end();
        });
    });
};

// exports.update = function(req, res) {
//   var dialogsetModule = utils.requireNoCache(path.resolve('modules_old/bot/engine/dialogset/dialogset.js'));
//
//   var dialogset = req.dialogset;
//   var fileUploaded = req.body.fileuploaded;
//
//   async.waterfall([
//     function(cb) {
//       if (fileUploaded) {
//         DialogsetDialog.remove({dialogset: dialogset._id}, function (err, num) {
//           cb(null);
//         });
//       } else {
//         cb(null);
//       }
//     },
//
//     function(cb) {
//       if (fileUploaded && dialogset.filename != req.body.filename) {
//         fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
//           cb(null);
//         })
//       } else {
//         cb(null);
//       }
//     },
//
//     function(cb) {
//       dialogset = _.extend(dialogset , req.body);
//
//       dialogset.save(function(err) {
//         if (err) {
//           return res.status(400).send({
//             message: errorHandler.getErrorMessage(err)
//           });
//         } else {
//           res.jsonp(dialogset);
//           cb(null);
//         }
//       });
//     },
//
//     function(cb) {
//       if(fileUploaded) {
//         dialogsetModule.convertDialogset1(dialogset, null, function(result) {
//           console.log(dialogset.filename + ' converted');
//         });
//       }
//     }
//   ]);

  // var dialogset = req.dialogset ;
  // dialogset = _.extend(dialogset , req.body);
  //
  // dialogset.save(function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(dialogset);
  //
  //     if(dialogset.fileuploaded) {
  //       DialogsetDialog.remove({dialogset: dialogset._id}, function(err, num) {
  //         fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
  //           dialogsetModule.convertDialogset1(dialogset, null, function(result) {
  //             console.log(dialogset.filename + ' converted');
  //           });
  //
  //           console.log('successfully converted: ' + dialogset.filename);
  //         });
  //       });
  //     }
  //   }
  // });
// };

// exports.delete = function(req, res) {
//   var dialogset = req.dialogset ;
//
//   dialogset.remove(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       Bot.find({dialogsets: req.dialogset._id}).exec(function (err, result) {
//         if(err){
//           console.log(err)
//         }else {
//           if(result.length){
//             async.eachSeries(result, function (bot, cb) {
//               if(bot.dialogsets && (bot.dialogsets.length > 0)){
//                 for(var i = 0; i < bot.dialogsets.length; i++){
//                   if(bot.dialogsets[i] == req.dialogset._id.toString()){
//                     bot.dialogsets.splice(bot.dialogsets.indexOf(bot.dialogsets[i], 1))
//                     bot.save(function (err) {
//                       if(err){
//                         console.log(err)
//                       }else {
//                         cb(null)
//                       }
//                     })
//                   }
//                 }
//                 cb(null)
//               }else {
//                 cb(null)
//               }
//             }, function (err) {
//               if(err){
//                 console.log(err)
//               }
//               DialogsetDialog.remove({dialogset: dialogset._id}, function(err, num) {
//                 res.jsonp(dialogset);
//                 if(dialogset.path && dialogset.filname){
//                   fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
//                     if (err) throw err;
//                     console.log('successfully deleted: ' + dialogset.filename);
//                   });
//                 }
//               })
//             })
//           }else {
//             DialogsetDialog.remove({dialogset: dialogset._id}, function(err, num) {
//               res.jsonp(dialogset);
//               if(dialogset.path && dialogset.filname){
//                 fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
//                   if (err) throw err;
//                   console.log('successfully deleted: ' + dialogset.filename);
//                 });
//               }
//             })
//           }
//         }
//       });
//     }
//   });
// };
//
//
// /**
//  * List of Custom actions
//  */
// exports.listByBot = function(req, res) {
//   Dialogset.find({bot: req.bot._id}).sort('-created').populate('user', 'displayName').exec(function(err, dialogsets) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       // console.log(dialogsets);
//       res.jsonp(dialogsets);
//     }
//   });
// };
//
// /**
//  * List of Custom actions
//  */
//
//
// /**
//  * Custom action middleware
//  */
// exports.dialogsetByID = function(req, res, next, id) {
//
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'Custom action is invalid'
//     });
//   }
//   Dialogset.findById(id).populate('user', 'displayName').exec(function (err, dialogset) {
//     if (err) {
//       return next(err);
//     } else if (!dialogset) {
//       return res.status(404).send({
//         message: 'No Custom action with that identifier has been found'
//       });
//     }
//     req.dialogset = dialogset;
//     next();
//   });
// };
//
//
//
// /***************** uploadFile ***********************/
//

//
//
// exports.convertFile = function (req, res) {
//   // var dir = path.resolve('custom_modules/private_bot/_data/');
//   var filename = req.body.filename;
//
//   dialogsetModule.convertDialogset(filename, function(result) {
//     res.json({result: 'ok'});
//   });
//
// }
