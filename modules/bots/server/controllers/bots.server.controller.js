'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  BotFile = mongoose.model('BotFile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  botLib = require(path.resolve('config/lib/bot')),
  fs = require('fs');

  var templateDatas = require(path.resolve('./modules/templates/server/controllers/template-datas.server.controller'));
  var async = require('async');

/**
 * Create a bot
 */
exports.create = function (req, res) {
  var bot = new Bot(req.body);
  bot.user = req.user;

  async.waterfall([
    function(cb) {
      if(req.body.isMakeFile) {
        var botFolder = generateBotFolder(bot.id);
        try {
          fs.statSync(botFolder);
        } catch (e) {
          try {
            fs.mkdirSync(botFolder);
          } catch (e) {
            return res.status(400).send({
              message: 'Create Directory Failed: ' + botFolder
            });
          }
        }

        var botFile = fs.readFileSync('./custom_modules/global/default.bot.js.template', 'utf8');
        botFile = botFile.replace(/__bot__/g, bot.id);
        fs.writeFileSync(botFolder + bot.id + '.bot.js', botFile, {flag: 'wx'});
        createFile(bot.id + '.bot.js', bot.user, bot);

        var dlgFile = fs.readFileSync('./custom_modules/global/default.dlg.template', 'utf8');
        dlgFile = dlgFile.replace(/__bot__/g, bot.name);
        fs.writeFileSync(botFolder + 'default.dlg', dlgFile, {flag: 'wx'});
        createFile('default.dlg', bot.user, bot);

        cb(null);
      } else {
        cb(null);
      }
    }, 
    
    function(cb) {
      if(req.body.template) {
        templateDatas.createTemplateData(req.body.template, 'null', req.body.template.templateData, req.user, function(data, err) {
          bot.templateId = req.body.template._id;
          bot.templateDataId = data._id;

          cb(null);
        });
      } else {
        cb(null);
      }
    }

  ], function(err) {
    bot.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        botLib.buildBot(bot.id);
        botLib.loadBot(bot.id);
        res.json(bot);
      }
    });
  })

};

function createFile(fileName, user, bot) {
  var botFile = new BotFile();
  botFile.bot = bot;
  botFile.name = fileName;
  botFile.user = user;
  console.log('botFile: ' + botFile.name);
  botFile.save(function (err) {
    if (err) {
      console.log(err);
    } else {
    }
  });
}


/**
 * Show the current bot
 */
exports.read = function (req, res) {
  res.json(req.bot);
};

/**
 * Update a bot
 */
exports.update = function (req, res) {
  var bot = req.bot;
  bot = _.extend(bot , req.body);
  async.waterfall([
    function(cb) {
      if (req.bot.template) {
        if (req.bot.template == null) {
          bot.templateId = null;
          bot.templateDataId = null;
          cb(null);
        } else {
          templateDatas.createTemplateData(req.bot.template, 'null', req.bot.template.templateData, req.user, function(data, err) {
            bot.templateId = req.bot.template._id;
            bot.templateDataId = data._id;
            cb(null);
          });
        }
      } else {
        cb(null);
      }
    }],

    function(err) {
      bot.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(bot);
        }
      });
    }
  );
};

/**
 * Delete an bot
 */
exports.delete = function (req, res) {
  var bot = req.bot;

  var botFolder = generateBotFolder(bot.id);
  try {
    // fs.rmdirSync(botFolder);
    deleteFolderRecursive(botFolder);
  } catch(e) {
    return res.status(400).send({
      message: 'Remove Directory Failed: ' + e.toString()
    });
  }

  bot.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      BotFile.remove({bot: bot._id}, function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(bot);
        }
      });
    }
  });
};

/**
 * List of Bots
 */
exports.list = function (req, res) {
  Bot.find().sort('-created').populate('user').exec(function (err, bots) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bots);
    }
  });
};

/**
 * Bot middleware
 */
exports.botByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot is invalid'
    });
  }

  Bot.findById(id).populate('user', 'displayName').exec(function (err, bot) {
    if (err) {
      return next(err);
    } else if (!bot) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
      });
    }
    req.bot = bot;

    async.waterfall([
      function(cb) {
        if (bot.templateId) {
          var TemplateModel = mongoose.model('Template');
          TemplateModel.findOne({_id: bot.templateId}).lean().exec(function (err, doc) {
            if (doc) {
              var templateDataModel = templateDatas.getTemplateDataModel(doc.dataSchema);
              templateDataModel.findOne({_id: bot.templateDataId}).lean().exec(function (err, doc1) {
                doc1.__v = undefined;
                doc1._id = undefined;
                doc1.templateId = undefined;
                req.bot._doc.templateData = doc1;

                cb(null);
              });
            } else {
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      },
      ], function(err) {
        next();
    });
  });

};
exports.fileByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'File is invalid'
    });
  }

  BotFile.findById(id).populate('user', 'displayName').populate('bot').exec(function (err, file) {
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
  BotFile.find({bot: req.bot._id}).populate('user', 'displayName').populate('bot').exec(function (err, files) {
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
  var bot = req.bot;
  var botFolder = generateBotFolder(bot.id);
  fs.writeFile(botFolder + req.body.fileName, '', {flag: 'wx'}, function(err) {
    console.log('writeFile Result: ' + err);
    var botFile = new BotFile();
    botFile.bot = bot;
    botFile.name = req.body.fileName;
    botFile.user = req.user;
    console.log('botFile: ' + botFile.name);
    botFile.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(botFile);
        console.log('res.json');
      }
    });

    // if(err) {
    //   res.status(400).send({
    //     message: 'File Already Exists'
    //   });
    // } else {
    //   var botFile = new BotFile();
    //   botFile.bot = bot;
    //   botFile.name = req.body.fileName;
    //   botFile.user = req.user;
    //   console.log('botFile: ' + botFile.name);
    //   botFile.save(function (err) {
    //     if (err) {
    //       return res.status(400).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else {
    //       res.json(botFile);
    //       console.log('res.json');
    //     }
    //   })
    // }
  });

};
exports.removeFile = function (req, res) {
  var file = req.file;
  var botFolder = generateBotFolder(file.bot.id);
  fs.unlink(botFolder + file.name, function (err) {
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
  var botFolder = generateBotFolder(file.bot.id);
  fs.rename(botFolder + file.name, botFolder + req.body.renameFileName, function (err) {
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
  var bot = req.bot;
  var file = req.file;
  var botFolder = generateBotFolder(file.bot.id);
  fs.readFile(botFolder + file.name, function (err, data) {
    if(err) {
      console.log(err.toString());
      res.status(400).send({
        message: 'Read File Failed'
      });
    } else {
      console.log('data: ' + data);
      res.json({botName: bot.name, name: file.name, data: data.toString()});
    }
  })
};
exports.editFile = function (req, res) {
  var file = req.file;
  var botFolder = generateBotFolder(file.bot.id);
  fs.writeFile(botFolder + file.name, req.body.fileData, {flag: 'w'}, function(err) {
    console.log('writeFile Result: ' + err);
    if(err) {
      res.status(400).send({
        message: 'Write File Failed'
      });
    }
    res.json({data: req.body.fileData});
  });
};

function generateBotFolder(botId) {
  // return config.chatServer + 'RAWDATA/' + botId + '/';
  return './custom_modules/' + botId + '/';
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



