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
  UserBotFbPage = mongoose.model('UserBotFbPage'),
  DialogsetDialog = mongoose.model('DialogsetDialog'),
  errorHandler = require(path.resolve('./engine/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  botLib = require(path.resolve('./engine/bot.js')),
  multer = require('multer'),
  fs = require('fs'),
  request = require('request');


  var Dialogset = mongoose.model('Dialogset');
  var dialogsetModule = require(path.resolve('engine/bot/engine/dialogset/dialogset.js'));

//temporary
const util = require('util');

/**
 * Create a userBot
 */
exports.create = function (req, res) {

  var userBot = new UserBot(req.body);
  userBot.user = req.user;

  userBot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      if (!req.body.originalFilename){
        return res.json(userBot);
      }else {
        var dialogset = new Dialogset({
            title: req.body.originalFilename,
            type: req.body.type,
            path: req.body.path,
            filename: req.body.filename,
            originalFilename: req.body.originalFilename,
            language: 'en',
            content: ''
        });
        dialogset.user = req.user;
        dialogset.save(function(err) {
            if (err) {
                callback(err);
            } else {
                dialogsetModule.convertDialogset1(dialogset, function(result) {
                    userBot.dialogsets = [dialogset];
                    userBot.save(function(err) {
                        res.json(userBot);
                    });

                    console.log(dialogset.filename + ' converted');
                })
            }
        });
      }
      // res.json(userBot);

      // dialogsetModule.convertDialogset(userBot.dialogFile, function(result) {
      //   userBot.dialogset = result;
      //   userBot.save(function(err) {
      //     if(console.log(err));
      //   })
      // });
    }
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
  console.log(req.userBot);
  console.log('server-read');
  res.json(req.userBot);
};

/**
 * Update a userBot
 */
exports.update = function (req, res) {
  var userBot = req.userBot;
  userBot = _.extend(userBot , req.body);

  userBot.user = req.user;

  userBot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.json(userBot);

      dialogsetModule .convertDialogset(userBot.dialogFile, function(result) {
        userBot.dialogset = result;
        userBot.save(function(err) {
          if(console.log(err));
        })
      });
    }
  });

  // dialogset.convertDialogset(userBot.dialogFile, function(result) {
  //   // res.json({result: 'ok'});
  //   userBot.dialogset = result;
  //
  //   userBot.save(function (err) {
  //     if (err) {
  //       return res.status(400).send({
  //         message: err.stack || err
  //       });
  //     } else {
  //       // userBotLib.buildUserBot(userBot.id);
  //       // userBotLib.loadUserBot(userBot.id);
  //       res.json(userBot);
  //     }
  //   });
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
        message: err.stack || err
      });
    } else {
      UserBotFile.remove({userBot: userBot._id}, function (err) {
        if (err) {
          return res.status(400).send({
            message: err.stack || err
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
  var perPage = req.body.perPage || 10;
  var query = {};
  query['public'] = true;

  if (req.body.listType == 'popular') sort = '-followed';
  if(req.body.listType == 'my') {
    delete query.public;
    query['user'] = req.body.botUserId;
  }
  if(req.query.my) {
    delete query.public;
    query['user'] =  req.query.botUserId;
  }
  if(req.body.query) query['name'] = new RegExp(req.body.query, 'i');
  console.log(util.inspect(query));
  console.log(req.body.currentPage);
  UserBot.find(query).sort(sort).populate('user').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, userBots) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.json(userBots);
    }
  });
};


exports.followList = function (req, res) {
  if (!req.body.botUserId) {
    return res.json();
  }
  var query = {};
  var search = {};
  var perPage = req.body.perPage || 10;
  query['followed'] = true;
  if(req.body.botUserId) query['botUserId'] = req.body.botUserId;
  if(req.body.userBot) query['userBot'] = req.body.userBot._id;
  if(req.body.query) search['name'] = new RegExp(req.body.query, 'i');
  var populateQuery = [];

  console.log(util.inspect(query));
  console.log(req.body.currentPage);
  UserBotFollow.find(query).populate('userBot', null, search).sort('-created').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, follows) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      var userBots = [];
      for(var i in follows) {
        if(follows[i].userBot && (follows[i].userBot.public == true)){
          userBots.push(follows[i].userBot);
        }
      }
      res.json(userBots);
      // res.json(follows);
    }
  });
};

exports.followBot = function(req, res) {
    console.log(1188);
  var query = {};
  query['botUserId'] = req.body.botUserId;
  query['userBot'] = req.body.userBot;
  UserBotFollow.findOne(query).exec(function (err, follows) {
    if (err){
      console.log(err);
      return res.status(400).send({
        message: err.stack || err
      });
    }else {
      if (!follows){
        var userBotFollow = new UserBotFollow(req.body);
        if(!userBotFollow.followed) {
            userBotFollow.followed = true;
        }
        userBotFollow.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: err.stack || err
                });
            } else {
                UserBot.findOne({_id: req.body.userBot}).exec(function (err, result) {
                    result.followed++;
                    result.save(function (err) {
                        console.log(err)
                        res.json(userBotFollow);
                    })
                });
            }
        });
      }else {
        follows.followed = true;
        follows.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: err.stack || err
                });
            }
            UserBot.findOne({_id: req.body.userBot}).exec(function (err, result) {
                result.followed++;
                result.save(function (err) {
                    console.log(err)
                    res.json(userBotFollow);
                })
            });
        });
      }
      // UserBot.findOne({_id: req.body.userBot}).exec(function (err, result) {
      //     if (err){
      //         console.log(err);
      //     }else {
      //         UserBotFollow.count({userBot : req.body.userBot, followed: true}).exec(function (err, followNum) {
      //             console.log(followNum);
      //             if (err){
      //                 console.log(err);
      //             }else {
      //                 result.followed = followNum;
      //                 result.save(function (err) {
      //                     if (err){
      //                         console.log(err);
      //                     }else {
      //                       return res.end();
      //                     }
      //                 });
      //             }
      //         })
      //     }
      // });
    }
  });
};

exports.unfollowBot = function(req, res) {
  UserBotFollow.findOne({userBot: req.query.userBot, botUserId: req.query.botUserId}).exec(function (err, result) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    }else {
      if (!result){
        var userBotFollow = new UserBotFollow(req.query);
        userBotFollow.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send({
                    message: err.stack || err
                });
            } else {
                UserBot.findOne({_id: req.query.userBot}).exec(function (err, result) {
                    result.followed--;
                    result.save(function (err) {
                        console.log(err);
                        res.json(userBotFollow);
                    })
                });
            }
        });
      }else {
        result.followed = false;
        result.save(function (err) {
          if (err){
            console.log(err);
            return res.status(400).send({
                message: err.stack || err
            });
          }else {
              UserBot.findOne({_id: req.query.userBot}).exec(function (err, result) {
                  result.followed--;
                  result.save(function (err) {
                      console.log(err)
                      res.end();
                  })
              });
          }
        });
      }
      // UserBot.findOne({_id: req.query.userBot}).exec(function (err, result) {
      //     if (err){
      //         console.log(err);
      //     }else {
      //         UserBotFollow.count({userBot : req.query.userBot, followed: true}).exec(function (err, followNum) {
      //             console.log(followNum);
      //             if (err){
      //                 console.log(err);
      //             }else {
      //                 result.followed = followNum;
      //                 result.save(function (err) {
      //                     if (err){
      //                         console.log(err);
      //                     }else {
      //                         return res.end();
      //                     }
      //                 });
      //             }
      //         })
      //     }
      // });
    }
  });
};



/**
 * Facebook Subscribe Page Information
 */
exports.facebookPage = function (req, res) {
  if (!req.body.list){ //change the information about facebook page connected
    UserBotFbPage.findOne({pageId : req.body.page.id}, function (err, data) {
      if(err){
        console.log(err);
      }else {
        if (data){
          data.accessToken = req.body.page.access_token;
          data.bot = req.body.userBot;
          data.userBotId = req.body.userBotId;
          data.connect = req.body.connect;
          data.user = req.user._id;
          data.save(function (err) {
            if (err){
              console.log(err);
            }else {
              return res.json(data);
            }
          })
        }else {
          var info = {};
          info['picture'] = req.body.page.picture.data.url;
          info['name'] = req.body.page.name;
          info['link'] = req.body.page.link;
          info['accessToken'] = req.body.page.access_token;
          info['pageId'] = req.body.page.id;
          info['user'] = req.body.user;
          info['bot'] = req.body.userBot;
          info['userBotId'] = req.body.userBotId;
          info['connect'] = req.body.connect;
          var userBotFbPage = new UserBotFbPage(info);
          userBotFbPage.save(function (err) {
            if (err){
              console.log(err);
            }else {
              return res.json(data);
            }
          })

        }
      }

    })
  }else { //get facebook pages connected
    var pageIds = [];
    for(var i = 0; i < req.body.pageInfo.length; i++){
      pageIds.push(req.body.pageInfo[i].id)
    }
    UserBotFbPage.find({pageId: {$in: pageIds}}).populate('bot').exec(function (err, data) {
      if(err){
        console.log(err);
      }else {
        return res.json(data);
      }

    })
  }
};


/**
 * dailogue Num
 */
exports.dialogueNum = function (req, res) {
 DialogsetDialog.count({dialogset: req.params.dialogsets}).exec(function (err, result) {
   if(err){
     console.log(err)
   }else {
     console.log(result);
     var count = { count : result};
     return res.json(count);
   }
 })
};


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

exports.userBotByNameID = function (req, res, next, id) {

  UserBot.findOne({id: id}).populate('user').exec(function (err, userBot) {
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
        message: err.stack || err
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
          message: err.stack || err
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
    //         message: err.stack || err
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
          message: err.stack || err
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
    //         message: err.stack || err
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
            message: err.stack || err
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
      // console.log('data: ' + data);
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

exports.uploadImageFileReplace = function (req, res) {
  var newname = req.cookies.default_bot + Date.now();
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
      console.log(file.originalname +','+ newname);
      cb(null,newname + path.parse(file.originalname).ext);
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
      res.json({result: 'ok', displayname:req.file.originalname , filename: req.file.filename});
    }
  });
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
        message: err.stack || err
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
        message: err.stack || err
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
        message: err.stack || err
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
        message: err.stack || err
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

  dialogsetModule.processInput(null, dialog.inputRaw, function(_input) {
    dialog.input = _input;

    console.log('createDialog:' + dialog.userBot);
    dialog.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
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

  dialogsetModule.processInput(null, dialog.inputRaw, function(_input) {
    dialog.input = _input;

    dialog.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
        });
      } else {
        res.json(dialog);
      }
    });
  });

  // dialog.save(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: err.stack || err
  //     });
  //   } else {
  //     res.json(dialog);
  //   }
  // });
};

exports.deleteDialog = function (req, res) {
  var dialog = req.dialog;

  dialog.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.json(dialog);
    }
  });
};

exports.listDialog = function (req, res) {
  var sort = req.query.sort || '-created';
  var user = req.user;
  var query = {};

  if (user)
    query['user'] =  user;
  if(req.params.dBotId) query['botId'] =  req.params.dBotId;
  query['input'] = {"$ne":""};
  query['output'] = {"$ne":""};

  UserBotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
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

var type = require(path.resolve('./engine/bot/action/common/type'));
exports.contextAnalytics = function (req, res) {

  var faqType = {
    name: 'result',
    typeCheck: type.dialogTypeCheck,
    limit: 10,
    matchRate: 0,
    exclude: ['하다', '이다'],
    mongo: {
      model: 'DialogsetDialog',
      // queryStatic: {dialogset: '기본대화1'},
      queryFields: ['input'],
      fields: 'dialogset input output' ,
      taskFields: ['input', 'output', 'matchRate', 'matchCount'],
      minMatch: 1
    }
  };

  if(req.query.dialogsets) {
    var dialogsetIds = undefined;
    if(Array.isArray(req.query.dialogsets)) dialogsetIds = req.query.dialogsets;
    else dialogsetIds = [req.query.dialogsets];

    faqType.mongo.queryStatic = {$or: []};
    for(var i = 0; i < dialogsetIds.length; i++) {
      faqType.mongo.queryStatic.$or.push({dialogset: dialogsetIds[i]});
    }
  }

  var context = {bot: global._bots[req.query.botId], botUser: global._botusers[req.query.botUser]};
  dialogsetModule.processInput(null, req.query.input, function(_input, json) {
    if(context.botUser == undefined) context.botUser = {};
    context.botUser.nlp = json._nlp;
    context.botUser.analytics = true;
    context.botUser.analytics2 = null;

    type.executeType(_input, faqType, {}, context, function(_text, _result) {
      _result.context = {botUser: {nlp: context.botUser.nlp, topic: context.botUser.topic}};
      res.json(_result);
      console.log('context analytics: ');
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
  //       message: err.stack || err
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
        message: err.stack || err
      });
    } else {
      res.json(dialogs);
    }
  });
};

exports.nlp = function (req, res) {
  dialogsetModule.processInput(null, req.query.input, function(_input) {
    res.json({result: _input});
  });
};

var autoCorrection = require(path.resolve('engine/bot/engine/nlp/autoCorrection'));

exports.autoCorrection = function (req, res) {

  // autoCorrection.batchCorrectionDB(function() {
  //   autoCorrection.spellerTest('서바스 센터 차다줘');
  //   autoCorrection.spellerTest('영압시간 어떻게 되지?');
  //
  //   res.json({});
  // });
  //

  autoCorrection.loadWordCorrections(function() {
    autoCorrection.correction('서바스 센터 차다줘');
    autoCorrection.correction('영압시간 어떻게 되지?');

    res.json({});
  })
};

exports.speech = function (req, res) {
  var client_id = 'c7VNVyIG3s95N4q2LWZQ';
  var client_secret =  'HXWvXdrKi7';

  var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';
  var request = require('request');

  console.log(req.params.msg);
  var options = {
    url: api_url,
    form: {'speaker':'jinho', 'speed':'0', 'text':req.params.msg},
    headers: {
      'Content-Type':'application/x-www-form-urlencoded', 'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  var _req = request.post(options).on('response', function(response) {
    console.log(response.statusCode);// 200
    console.log(response.headers['content-type']);
  });
  _req.pipe(res); // 브라우저로 출력
};

var typeModule = require(path.resolve('engine/bot/action/common/type.js'));

exports.analyzeIntent = function(req, res) {
  var context = {
    bot: global._bots[req.query['botId']],
    dialog: {},
    botUser: {}
  };

  typeModule.processInput(context, req.query.input, function(_inNLP, entities, _doc) {
    var doc = {
      context: context.botUser.context,
      intent: _doc.intent,
      entities: _doc.entities
    };

    if(_doc.intentDialog) {
      doc.dialog = {
        name: _doc.intentDialog.name,
        input: _doc.intentDialog.input,
        output: _doc.intentDialog.output
      };

      if(_doc.intentDialog.task) {
        doc.dialog.task = {
          name: typeof _doc.intentDialog.task === 'string' ? _doc.intentDialog.task :_doc.intentDialog.task.name,
          paramDefs: _doc.intentDialog.task.paramDefs
        }
      }

    }


    res.json(doc);
  })
};

