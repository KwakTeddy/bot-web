'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserBot = mongoose.model('UserBot'),
  UserBotComment = mongoose.model('UserBotComment'),
  UserBotDialog = mongoose.model('UserBotDialog'),
  UserBotFile = mongoose.model('UserBotFile'),
  UserBotFollow = mongoose.model('UserBotFollow'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  botLib = require(path.resolve('config/lib/bot')),
  multer = require('multer'),
  fs = require('fs');

  var dialogset = require('./dialogset');

/**
 * Create a userBot
 */
exports.create = function (req, res) {
  var userBot = new UserBot(req.body);
  userBot.user = req.user;

  // var userBotFolder = generateUserBotFolder(userBot.id);
  // try {
  //   fs.statSync(userBotFolder);
  // } catch(e) {
  //   try {
  //     fs.mkdirSync(userBotFolder);
  //   } catch(e) {
  //     return res.status(400).send({
  //       message: 'Create Directory Failed: ' + userBotFolder
  //     });
  //   }
  // }
  //
  // var userBotFile = fs.readFileSync('./custom_modules/global/default.bot.js.template', 'utf8');
  // userBotFile = userBotFile.replace(/__userBot__/g, userBot.id);
  // fs.writeFileSync(userBotFolder + userBot.id + '.bot.js', userBotFile,  {flag: 'wx'});
  // createFile(userBot.id + '.bot.js', userBot.user, userBot);
  //
  // var dlgFile = fs.readFileSync('./custom_modules/global/default.dlg.template', 'utf8');
  // dlgFile = dlgFile.replace(/__userBot__/g, userBot.name);
  // fs.writeFileSync(userBotFolder + 'default.dlg', dlgFile,  {flag: 'wx'});
  // createFile('default.dlg', userBot.user, userBot);

  dialogset.convertDialogset(userBot.dialogFile, function(result) {
    // res.json({result: 'ok'});
    userBot.dialogset = result;

    userBot.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // userBotLib.buildUserBot(userBot.id);
        // userBotLib.loadUserBot(userBot.id);
        res.json(userBot);
      }
    });
  });

};

function createFile(fileName, user, userBot) {
  var userBotFile = new UserBotFile();
  userBotFile.userBot = userBot;
  userBotFile.name = fileName;
  userBotFile.user = user;
  console.log('userBotFile: ' + userBotFile.name);
  userBotFile.save(function (err) {
    if (err) {
      console.log(err);
    } else {
    }
  });
}


/**
 * Show the current userBot
 */
exports.read = function (req, res) {
  res.json(req.userBot);
};

/**
 * Update a userBot
 */
exports.update = function (req, res) {
  var userBot = req.userBot;
  userBot = _.extend(userBot , req.body);

  userBot.user = req.user;

  dialogset.convertDialogset(userBot.dialogFile, function(result) {
    // res.json({result: 'ok'});
    userBot.dialogset = result;

    userBot.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // userBotLib.buildUserBot(userBot.id);
        // userBotLib.loadUserBot(userBot.id);
        res.json(userBot);
      }
    });
  });

  // userBot.save(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(userBot);
  //   }
  // });
};

/**
 * Delete an userBot
 */
exports.delete = function (req, res) {
  var userBot = req.userBot;

  var userBotFolder = generateUserBotFolder(userBot.id);
  try {
    // fs.rmdirSync(userBotFolder);
    deleteFolderRecursive(userBotFolder);
  } catch(e) {
    return res.status(400).send({
      message: 'Remove Directory Failed: ' + e.toString()
    });
  }

  userBot.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      UserBotFile.remove({userBot: userBot._id}, function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(userBot);
        }
      });
    }
  });
};

/**
 * List of UserBots
 */
exports.list = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.query.my) query['user'] =  req.user;
  if(req.query.query) query['name'] = new RegExp(req.query.query, 'i');

  UserBot.find(query).sort(sort).populate('user').exec(function (err, userBots) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userBots);
    }
  });

  dialogset.nlpTest(function() {
    console.log('end analyze');
  })
};


exports.followList = function (req, res) {
  var query = {};
  if(req.body.userBot) query['userBot'] = req.body.userBot;
  if(req.body.botUserId) query['botUserId'] = req.body.botUserId;

  UserBotFollow.find(query).sort('-created').populate('userBot').exec(function (err, follows) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      var userBots = [];
      for(var i in follows) {
        userBots.push(follows[i].userBot);
      }

      res.json(userBots);
    }
  });
};

exports.followBot = function(req, res) {
  var userBotFollow = new UserBotFollow(req.body);
  userBotFollow.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(userBotFollow.userBot.followed) userBotFollow.userBot.followed++;
      else userBotFollow.userBot.followed = 1;
      userBotFollow.userBot.$save();

      res.json(userBotFollow);
    }
  });
}

exports.unfollowBot = function(req, res) {

  UserBotFollow.remove({userBot: req.query.userBot, botUserId: req.query.botUserId}, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({userBotId: req.body.userBotId, botUserId: req.body.botUserId});
    }
  });
}


/**
 * UserBot middleware
 */
exports.userBotByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserBot is invalid'
    });
  }

  UserBot.findById(id).populate('user').exec(function (err, userBot) {
    if (err) {
      return next(err);
    } else if (!userBot) {
      return res.status(404).send({
        message: 'No userBot with that identifier has been found'
      });
    }
    req.userBot = userBot;
    next();
  });
};

exports.fileByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'File is invalid'
    });
  }

  UserBotFile.findById(id).populate('user', 'displayName').populate('userBot').exec(function (err, file) {
    if (err) {
      return next(err);
    } else if (!file) {
      return res.status(404).send({
        message: 'No file with that identifier has been found'
      });
    }
    req.file = file;
    next();
  });
};


exports.listFile = function (req, res) {
  UserBotFile.find({userBot: req.userBot._id}).populate('user', 'displayName').populate('userBot').exec(function (err, files) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(files);
    }
  });
};

exports.createFile = function (req, res) {
  var userBot = req.userBot;
  var userBotFolder = generateUserBotFolder(userBot.id);
  fs.writeFile(userBotFolder + req.body.fileName, '', {flag: 'wx'}, function(err) {
    console.log('writeFile Result: ' + err);
    var userBotFile = new UserBotFile();
    userBotFile.userBot = userBot;
    userBotFile.name = req.body.fileName;
    userBotFile.user = req.user;
    console.log('userBotFile: ' + userBotFile.name);
    userBotFile.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(userBotFile);
        console.log('res.json');
      }
    });

    // if(err) {
    //   res.status(400).send({
    //     message: 'File Already Exists'
    //   });
    // } else {
    //   var userBotFile = new UserBotFile();
    //   userBotFile.userBot = userBot;
    //   userBotFile.name = req.body.fileName;
    //   userBotFile.user = req.user;
    //   console.log('userBotFile: ' + userBotFile.name);
    //   userBotFile.save(function (err) {
    //     if (err) {
    //       return res.status(400).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else {
    //       res.json(userBotFile);
    //       console.log('res.json');
    //     }
    //   })
    // }
  });

};
exports.removeFile = function (req, res) {
  var file = req.file;
  var userBotFolder = generateUserBotFolder(file.userBot.id);
  fs.unlink(userBotFolder + file.name, function (err) {
    file.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(file);
      }
    });

    // if(err) {
    //   res.status(400).send({
    //     message: 'Remove File Failed'
    //   });
    // } else {
    //   file.remove(function (err) {
    //     if (err) {
    //       return res.status(400).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else {
    //       res.json(file);
    //     }
    //   })
    // }
  })
};
exports.renameFile = function (req, res) {
  var file = req.file;
  var userBotFolder = generateUserBotFolder(file.userBot.id);
  fs.rename(userBotFolder + file.name, userBotFolder + req.body.renameFileName, function (err) {
    if(err) {
      res.status(400).send({
        message: 'Rename File Failed'
      });
    } else {
      file.name = req.body.renameFileName;
      file.updated = Date.now();
      file.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(file);
        }
      })
    }
  })
};
exports.readFile = function (req, res) {
  var userBot = req.userBot;
  var file = req.file;
  var userBotFolder = generateUserBotFolder(file.userBot.id);
  fs.readFile(userBotFolder + file.name, function (err, data) {
    if(err) {
      console.log(err.toString());
      res.status(400).send({
        message: 'Read File Failed'
      });
    } else {
      console.log('data: ' + data);
      res.json({userBotName: userBot.name, name: file.name, data: data.toString()});
    }
  })
};
exports.editFile = function (req, res) {
  var file = req.file;
  var userBotFolder = generateUserBotFolder(file.userBot.id);
  fs.writeFile(userBotFolder + file.name, req.body.fileData, {flag: 'w'}, function(err) {
    console.log('writeFile Result: ' + err);
    if(err) {
      res.status(400).send({
        message: 'Write File Failed'
      });
    }
    res.json({data: req.body.fileData});
  });
};

function generateUserBotFolder(userBotId) {
  // return config.chatServer + 'RAWDATA/' + userBotId + '/';
  return './custom_modules/' + userBotId + '/';
}
function deleteFolderRecursive(path) {
  var files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


exports.uploadImageFile = function (req, res) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      // cb(null, req.params.filename + path.parse(file.originalname).ext);
    }
  });

  // var user = req.user;
  var upload = multer({storage: storage}).single('uploadImageFile');

  // Filtering to upload only images
  upload.fileFilter = function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };

  // if (user) {
  upload(req, res, function (uploadError) {
    if(uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading file'
      });
    } else {
      console.log('uploadFile:' + req.file.filename);
      res.json({result: 'ok', filename: req.file.filename});
    }
  });
  // } else {
  //   res.status(400).send({
  //     message: 'User is not signed in'
  //   });
  // }
};


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
      return res.status(400).send({
        message: 'Error occurred while uploading file'
      });
    } else {
      console.log('uploadFile:' + req.file.filename);
      res.json({result: 'ok', filename: req.file.filename});
    }
  });
  // } else {
  //   res.status(400).send({
  //     message: 'User is not signed in'
  //   });
  // }
};


exports.convertFile = function (req, res) {
  // var dir = path.resolve('custom_modules/private_bot/_data/');
  var filename = req.body.filename;

  dialogset.convertDialogset(filename, function(result) {
    res.json({result: 'ok'});
  });

}



/********************** comment ****************************/

exports.createComment = function (req, res) {
  var comment = new UserBotComment(req.body);
  comment.user = req.user;

  comment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // userBotLib.buildUserBotComment(userBot.id);
      // userBotLib.loadUserBotComment(userBot.id);
      res.json(comment);
    }
  });

};

exports.readComment = function (req, res) {
  res.json(req.comment);
};

exports.updateComment = function (req, res) {
  var comment = req.comment;
  comment = _.extend(comment, req.body);

  comment.user = req.user;
  comment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

exports.deleteComment = function (req, res) {
  var comment = req.comment;

  comment.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

exports.listComment = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.params.userBotId) query['userBot'] =  req.userBot;

  UserBotComment.find(query).sort(sort).populate('user').exec(function (err, comments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comments);
    }
  });
};

exports.userBotCommentByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserBot is invalid'
    });
  }

  UserBotComment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No userBot with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};

/********************** dialog ****************************/

exports.createDialog = function (req, res) {
  var dialog = new UserBotDialog(req.body);
  dialog.user = req.user;

  dialogset.processInput(null, dialog.inputRaw, function(_input) {
    dialog.input = _input;

    console.log('createDialog:' + dialog.userBot);
    dialog.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(dialog);
      }
    });
  });
};

exports.readDialog = function (req, res) {
  res.json(req.dialog);
};

exports.updateDialog = function (req, res) {
  var dialog = req.dialog;
  dialog = _.extend(dialog, req.body);

  dialog.user = req.user;
  dialog.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialog);
    }
  });
};

exports.deleteDialog = function (req, res) {
  var dialog = req.dialog;

  dialog.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialog);
    }
  });
};

exports.listDialog = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.params.userBotId) query['userBot'] =  req.userBot;

  UserBotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialogs);
    }
  });
};

exports.userBotDialogByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserBot is invalid'
    });
  }

  UserBotDialog.findById(id).populate('user', 'displayName').exec(function (err, dialog) {
    if (err) {
      return next(err);
    } else if (!dialog) {
      return res.status(404).send({
        message: 'No userBot with that identifier has been found'
      });
    }
    req.dialog = dialog;
    next();
  });
};

/********************** analytics ****************************/

var type = require(path.resolve('./modules/bot/action/common/type'));
exports.contextAnalytics = function (req, res) {

  var faqType = {
    name: 'result',
    typeCheck: type.dialogTypeCheck,
    // preType: function(task, context, type, callback) {
    //   type.mongo.queryStatic.dialogset = bot.dialogset;
    //   callback(task, context);
    // },
    limit: 10,
    mongo: {
      model: 'DialogSet',
      // queryStatic: {dialogset: '기본대화1'},
      queryFields: ['input'],
      fields: 'input output' ,
      taskFields: ['input', 'output', 'matchRate'],
      minMatch: 1
    }
  };

  dialogset.processInput(null, req.query.input, function(_input) {
    type.executeType(_input, faqType, {}, {bot: {}}, function(_text, _result) {
      res.json(_result);
    });
  });


  // var dialog = {
  //   input: {types: [faqType]},
  //   task:   {
  //     action: function(task, context, callback) {
  //       console.log(JSON.stringify(task.typeDoc));
  //       if(Array.isArray(task.typeDoc)) {
  //         if(task.typeDoc.length > 1) task._output = task.typeDoc[1].output;
  //         else task._output = task.typeDoc[0].output;
  //       } else {
  //         task._output = task.typeDoc.output;
  //       }
  //       callback(task, context);
  //     }
  //   },
  //   output: '+_output+'
  // };
  //
  // var sort = req.query.sort || '-created';
  //
  // var query = {};
  // if(req.params.userBotId) query['userBot'] =  req.userBot;
  //
  // UserBotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(dialogs);
  //   }
  // });
};


exports.contextLearning = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.params.userBotId) query['userBot'] =  req.userBot;

  UserBotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialogs);
    }
  });
};

