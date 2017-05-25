'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dialogset = mongoose.model('Dialogset'),
  DialogsetDialog = mongoose.model('DialogsetDialog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  dialogsetModule = require(path.resolve('modules/bot/engine/dialogset/dialogset.js')),
  _ = require('lodash');

var async = require('async');
var fs = require('fs');
var multer = require('multer');

var utils = require(path.resolve('modules/bot/action/common/utils'));

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var dialogset = new Dialogset(req.body);
  dialogset.user = req.user;

  dialogset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dialogset);

      dialogsetModule.convertDialogset1(dialogset, null, function(result) {
        console.log(dialogset.filename + ' converted');
      })
    }
  });

};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dialogset = req.dialogset ? req.dialogset.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dialogset.isCurrentUserOwner = req.user && dialogset.user && dialogset.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(dialogset);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var dialogsetModule = utils.requireNoCache(path.resolve('modules/bot/engine/dialogset/dialogset.js'));

  var dialogset = req.dialogset;
  var fileUploaded = req.body.fileuploaded;

  async.waterfall([
    function(cb) {
      if (fileUploaded) {
        DialogsetDialog.remove({dialogset: dialogset._id}, function (err, num) {
          cb(null);
        });
      } else {
        cb(null);
      }
    },

    function(cb) {
      if (fileUploaded && dialogset.filename != req.body.filename) {
        fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
          cb(null);
        })
      } else {
        cb(null);
      }
    },

    function(cb) {
      dialogset = _.extend(dialogset , req.body);

      dialogset.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(dialogset);
          cb(null);
        }
      });
    },

    function(cb) {
      if(fileUploaded) {
        dialogsetModule.convertDialogset1(dialogset, null, function(result) {
          console.log(dialogset.filename + ' converted');
        });
      }
    }
  ]);

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
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var dialogset = req.dialogset ;

  dialogset.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dialogset);

      DialogsetDialog.remove({dialogset: dialogset._id}, function(err, num) {
        fs.unlink(path.join(dialogset.path, dialogset.filename), function (err) {
          if (err) throw err;
          console.log('successfully deleted: ' + dialogset.filename);
        });
      });
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  Dialogset.find({user: req.user._id}).sort('-created').populate('user', 'displayName').exec(function(err, dialogsets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(dialogsets);
      res.jsonp(dialogsets);
    }
  });
};

/**
 * Custom action middleware
 */
exports.dialogsetByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Dialogset.findById(id).populate('user', 'displayName').exec(function (err, dialogset) {
    if (err) {
      return next(err);
    } else if (!dialogset) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.dialogset = dialogset;
    next();
  });
};



/***************** uploadFile ***********************/

exports.uploadFile = function (req, res) {
  console.log('uploadFile:' );


  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      // cb(null, req.params.filename + path.parse(file.originalname).ext);
      // cb(null, req.params.filename)
    }
  });

  // var user = req.user;
  var message = null;
  var upload = multer({storage: storage}).single('uploadFile');
  // var dialogUploadFileFilter = require(path.resolve('./config/lib/multer')).dialogUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = function (req, file, cb) {
    if (file.mimetype !== 'text/plain' && file.mimetype !== 'text/csv') {
      return cb(new Error('Only txt/csv files are allowed!'), false);
    }
    cb(null, true);
  };

  // if (user) {
  upload(req, res, function (uploadError) {
    if(uploadError) {
      return res.status(400).send({ message: 'Error occurred while uploading file' });
    } else {
      console.log('uploadFile:' + req.file.filename);
      var count = 0;
      // check file
      var info = path.parse(req.file.filename);
      if (info.ext === ".csv" || info.ext === ".txt" || info.ext === ".xls" || info.ext === ".xlsx") {
        var filepath = req.file.destination + req.file.filename;
        async.waterfall( [
          function(cb) {
            utils.readFirstLine(filepath).then(function(head) {
              if (head === "Date,User,Message" || head.startsWith("Talk_")) {
                // kakao file
                console.log('kakao csv');
                return res.status(400).send({ message: '카카오 대화파일은 현재 지원되지 않습니다' });
              } else if ( (head.match(/,/g) || []).length == 1) {
                // two column csv
                cb(null);
              } else {
                //FIXME: sample inputs are not in the correct format
                //return res.status(400).send({ message: '대화파일이 아닙니다' });
                cb(null);
              }
            });
          },
          function(cb) {
            fs.createReadStream(filepath)
              .on('data', function(chunk) {
                for (var i=0; i < chunk.length; ++i)
                  if (chunk[i] = 10) ++count;
              })
              .on('end', function() {
                console.log(count);
                cb(null);
              });
          },
          function(cb) {
            res.json({result: 'ok', count: count, path: req.file.destination, filename: req.file.filename, originalFilename: req.file.originalname});
            cb(null);
          }
        ]);
      } else if (info.ext === ".xls" || info.ext === ".xlsx") {

      } else {
        //TODO: need to check other types
        res.json({result: 'ok', path: req.file.destination, filename: req.file.filename, originalFilename: req.file.originalname});
      }
    }
  });
};


exports.convertFile = function (req, res) {
  // var dir = path.resolve('custom_modules/private_bot/_data/');
  var filename = req.body.filename;

  dialogsetModule.convertDialogset(filename, function(result) {
    res.json({result: 'ok'});
  });

}
