'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  BotComment = mongoose.model('BotComment'),
  BotDialog = mongoose.model('BotDialog'),
  BotFile = mongoose.model('BotFile'),
  BotFollow = mongoose.model('BotFollow'),
  BotAuth = mongoose.model('BotAuth'),
  errorHandler = require(path.resolve('./engine/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  botLib = require(path.resolve('./engine/bot.js')),
  multer = require('multer'),
  fs = require('fs');

var util = require("util"); //temporary

var templateDatas = require(path.resolve('./engine/templates/server/controllers/template-datas.server.controller'));
var async = require('async');

var Dialogset = mongoose.model('Dialogset');
var dialogsetModule = require(path.resolve('engine/bot/engine/dialogset/dialogset.js'));

exports.graph = function (req, res) {
  var bot = req.bot;
  bot = _.extend(bot , req.body);
  if (bot.dialogsets){
    for (var i=0; i < bot.dialogsets.length; ++i) {
      bot.dialogsets[i] = mongoose.Types.ObjectId(bot.dialogsets[i]);
    }
  }
  botLib.buildBot(bot.id, bot.path);
  botLib.loadBot(bot.id, function (realbot) {
    var result = "";
    async.waterfall([
      function (cb) {
        async.eachSeries(realbot.dialogsets, function(dialogset, cb2) {
          dialogsetModule.analyzeKnowledge(dialogset, bot.id, result, function () {
            cb2();
          });
        }, function(err) {
          cb(null);
        });
      },
      function (cb) {
        dialogsetModule.analyzeKnowledgeDialog(realbot.dialogs, bot.id, bot.id, result, function() {
          cb(null);
        });
      },
    ], function (err) {
      return res.json({message:"failed to create graph"});
    });
  });
};

/**
 * Create a bot
 */
exports.create = function (req, res) {
  var bot = new Bot(req.body);
  bot.user = req.user;

  async.waterfall([
    function(cb) {
      var botFolder = generateBotFolder(bot.id);
      if(req.body.isMakeFile && !fs.existsSync(botFolder)) {
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

        // default.dlg remains only to pass build process
        // var dlgFile = fs.readFileSync('./custom_modules/global/default.dlg.template', 'utf8');
        // dlgFile = dlgFile.replace(/__bot__/g, bot.name);
        // fs.writeFileSync(botFolder + 'default.dlg', dlgFile, {flag: 'wx'});
        //createFile('default.dlg', bot.user, bot);

        var taskFile = fs.readFileSync('./custom_modules/global/default.task.js.template', 'utf8');
        taskFile= taskFile.replace(/__bot__/g, bot.id);
        fs.writeFileSync(botFolder + 'default.js', taskFile, {flag: 'wx'});
        createFile('default.js', bot.user, bot);

        var graphFile = fs.readFileSync('./custom_modules/global/default.graph.js.template', 'utf8');
        graphFile = graphFile.replace(/__bot__/g, bot.id);
        fs.writeFileSync(botFolder + 'default.graph.js', graphFile, {flag: 'wx'});
        createFile('default.graph.js', bot.user, bot);

        cb(null);
      } else {
        createFile(bot.id + '.bot.js', bot.user, bot);
        createFile('default.js', bot.user, bot);
        createFile('default.graph.js', bot.user, bot);
        cb(null);
      }
    }, 
    
    function(cb) {
      if(req.body.template) {
        templateDatas.createTemplateData(req.body.template, 'null', 'null', JSON.stringify(req.body.template.templateData), req.user, function(data, err) {
          bot.templateId = req.body.template._id;
          bot.templateDataId = data._id;
          bot.path = 'templates/' + req.body.template.id;

          var lists = templateDatas.getTemplateLists(req.body.template.dataSchema);
          if (lists) {
            lists.forEach(function(list) {
              async.eachSeries(req.body.template.templateData[list], function(item, cb) {
                templateDatas.createTemplateData(req.body.template, list, data._id, JSON.stringify(item), req.user, function(res, err) {
                  cb(null);
                });
              });
            });
          }
          cb(null);
        });
      } else {
        cb(null);
      }
    },

    function(cb) {
      bot.save(function (err) {
        if(err) cb(err);
        else cb(null);
      });
    },

    function(cb) {
      if (!req.body.originalFilename){
        cb(null);
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
            cb(err);
          } else {
            dialogsetModule.convertDialogset1(dialogset, bot.id, function(result) {
              bot.dialogsets = [dialogset];
              bot.save(function(err) {
                if(err) cb(err);
                else cb(null);
              });

              console.log(dialogset.filename + ' converted');
            })
          }
        });
      }
    }
  ], function(err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      if(bot.templateId) {
        botLib.buildBot(req.body.template.id, bot.path);
      } else {
        botLib.buildBot(bot.id, bot.path);
      }

      botLib.loadBot(bot.id, function (realbot) {
        var result = "";
        async.waterfall([
          function (cb) {
            async.eachSeries(realbot.dialogsets, function(dialogset, cb2) {
              dialogsetModule.analyzeKnowledge(dialogset, bot.id, result, function () {
                cb2();
              });
            }, function(err) {
              cb(null);
            });
          },
          function (cb) {
            dialogsetModule.analyzeKnowledgeDialog(realbot.dialogs, bot.id, bot.id, result, function() {
               cb(null);
            });
          },
        ], function (err) {
          res.json(bot);
        });
      });
    }
  });
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
  // Dialogset.find({user: req.user._id}).exec(function (err, data) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: err.stack || err
  //     });
  //   }else {
  //     if(!req.bot.dialogsets){
  //       req.bot['dialogsets'] = [];
  //     }
  //     req.bot.dialogsets.push(data);
  //     res.json(req.bot);
  //   }
  // });
};

/**
 * Update a bot
 */
exports.update = function (req, res) {
  var bot = req.bot;
  bot = _.extend(bot , req.body);

  async.waterfall([
      function(cb) {
        if (bot.template) {
          if (bot.template == null) {
            bot.templateId = null;
            bot.templateDataId = null;
            cb(null);
          } else {
            templateDatas.createTemplateData(bot.template, 'null', 'null', JSON.stringify(req.bot.template.templateData), req.user, function(data, err) {
              bot.templateId = bot.template._id;
              bot.templateDataId = data._id;
              var lists = templateDatas.getTemplateLists(req.body.template.dataSchema);
              if (lists) {
                lists.forEach(function(list) {
                  async.eachSeries(req.body.template.templateData[list], function(item, cb) {
                    templateDatas.createTemplateData(req.body.template, list, data._id, JSON.stringify(item), req.user, function(res, err) {
                      cb(null);
                    });
                  });
                });
              }
              cb(null);
            });
          }
        } else {
          cb(null);
        }
      },

      function(cb) {
        // if (bot.dialogsets && bot.dialogsets.length){
        //   for (var i=0; i < bot.dialogsets.length; ++i) {
        //     bot.dialogsets[i] = bot.dialogsets[i]._id;
        //   }
        // }

        bot.save(function (err, doc) {
          if(err)
            cb(err);
          else
            cb(null);
        });
      },

      function(cb) {
        if (!bot.originalFilename) {
          cb(null);
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
              cb(err);
            } else {
              dialogsetModule.convertDialogset1(dialogset, bot.id, function(result) {
                bot.dialogsets = [dialogset];
                bot.save(function(err) {
                  if(err) cb(err);
                  else cb(null);
                });

                console.log(dialogset.filename + ' converted');
              })
            }
          });
        }
      }
    ],

    function(err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
        });
      } else {
        if(bot.templateId) {
          botLib.buildBot(bot.templateId, bot.path);
        } else {
          botLib.buildBot(bot.id, bot.path);
        }

        botLib.loadBot(bot.id, function(realbot) {
          var result = "";
          async.waterfall([
            function (cb) {
              async.eachSeries(realbot.dialogsets, function(dialogset, cb2) {
                dialogsetModule.analyzeKnowledge(dialogset, bot.id, bot.id, result, function () {
                  cb2();
                });
              }, function(err) {
                cb(null);
              });
            },
            function (cb) {
              dialogsetModule.analyzeKnowledgeDialog(realbot.dialogs, bot.id, bot.id, result, function() {
                cb(null);
              });
            },
          ], function (err) {
            res.json(bot);
          });
        });
      }
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
        message: err.stack || err
      });
    } else {
      BotFile.remove({bot: bot._id}, function (err) {
        if (err) {
          return res.status(400).send({
            message: err.stack || err
          });
        } else {
          res.json(bot);
        }
      });
    }
  });
};
//
// /**
//  * List of Bots
//  */
// exports.list = function (req, res) {
//   // TODO 관리자에서는 모든 봇 목록 보이게
//   var sort = req.query.sort || '-created';
//   var perPage = req.body.perPage || 10;
//   var query = {};
//
//   if (req.body.listType == 'popular') {
//     query['public'] = true;
//     sort = '-followed';
//   } else if(req.body.listType == 'recent') {
//     query['public'] = true;
//   } else if(req.body.listType == 'my' || req.query.my) {
//     // query['user'] = req.body.botUserId;
//     query['user'] = req.user;
//   } else if(req.body.query) {
//     query['public'] = true;
//     query['name'] = new RegExp(req.body.query, 'i');
//   }
//   console.log(util.inspect(query))
//   Bot.find(query).sort(sort).populate('user').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, bots) {
//     if (err) {
//       return res.status(400).send({
//         message: err.stack || err
//       });
//     } else {
//       res.json(bots);
//     }
//   });
// };


/**
 * List of UserBots
 */
exports.list = function (req, res) {
    // console.log(util.inspect(req.query))
    var sort = req.query.sort || '-created';
    var perPage = req.body.perPage || 10;
    if(req.query.developer){
      perPage = 0;
    }
    var query = {};
    query['public'] = true;

    if (req.body.listType == 'popular') sort = '-followed';
    if(req.body.listType == 'my') {
        delete query.public;
        query['user'] = req.body.botUserId;
    }
    if(req.query.my) {
        delete query.public;
        if(req.user) query['user'] =  req.user._id;
        else query['user'] = 'xxx';
    }
    if(req.body.query) query['name'] = new RegExp(req.body.query, 'i');
    // console.log(util.inspect(query));
    if(req.query.role && (req.query.role == 'admin')){
      query = {};
    }
    Bot.find(query).sort(sort).populate('user').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, bots) {
        if (err) {
            return res.status(400).send({
                message: err.stack || err
            });
        } else {
            res.json(bots);
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
  if(req.body.userBot) query['bot'] = req.body.userBot._id;
  if(req.body.query) search['name'] = new RegExp(req.body.query, 'i');
  search['public'] = true;
  var populateQuery = [];

  // console.log(util.inspect(query));

  // BotFollow.find(query).populate({path: 'bot', match: {public: 'true'}}).sort('-created').exec(function (err, follows) {
  BotFollow.find(query).populate('bot', null, search).sort('-created').skip(req.body.currentPage * perPage).limit(perPage).exec(function (err, follows) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      var bots = [];

      for(var i = 0; i < follows.length; i++) {
        if(follows[i].bot && (follows[i].bot.public == true)){
          bots.push(follows[i].bot);
        }
        if(req.body.check){
          bots.push(follows[i].bot);
        }
      }
      res.json(bots);
      // res.json(follows);
    }
  });
};

exports.followBot = function(req, res) {
  var query = {};
  query['botUserId'] = req.body.botUserId;
  query['bot'] = req.body.userBot;
  BotFollow.findOne(query).exec(function (err, follows) {
    if (err){
      console.log(err);
      return res.status(400).send({
        message: err.stack || err
      });
    }else {
      if (!follows){
        var changer = req.body;
        Object.defineProperty(changer, 'bot', Object.getOwnPropertyDescriptor(changer, 'userBot'));
        delete changer['userBot'];

        var botFollow = new BotFollow(changer);
        if(!botFollow.followed) {
          botFollow.followed = true;
        }
        botFollow.save(function (err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: err.stack || err
            });
          } else {
            Bot.findOne({_id: req.body.bot}).populate('user').exec(function (err, result) {
              result.followed++;
              result.save(function (err, data) {
                console.log(err)
                res.json(data);
              })
            });
          }
        });
      }else {
        if (follows.followed == true){
          return res.end();
        }
        follows.followed = true;
        follows.save(function (err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: err.stack || err
            });
          }
          Bot.findOne({_id: req.body.userBot}).populate('user').exec(function (err, result) {
            result.followed++;
            result.save(function (err, data) {
              console.log(err);
              res.json(data);
            })
          });
        });
      }
    }
  });
};

exports.unfollowBot = function(req, res) {
  BotFollow.findOne({bot: req.query.userBot, botUserId: req.query.botUserId}).exec(function (err, result) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    }else {
      if (!result){
        var changer = {};
        changer = req.query;
        Object.defineProperty(changer, 'bot', Object.getOwnPropertyDescriptor(changer, 'userBot'));
        delete changer['userBot'];

        var botFollow = new BotFollow(changer);
        botFollow.save(function (err) {
          if (err) {
            console.log(err);
            return res.status(400).send({
              message: err.stack || err
            });
          } else {
            Bot.findOne({_id: req.query.bot}).populate('user').exec(function (err, result) {
              if (result.followed <= 0){
                result.followed = 0;
              }else {
                result.followed--;
              }
              result.save(function (err, data) {
                console.log(err);
                res.json(data);
              })
            });

          }
        });
      }else {
        if (result.followed == false){
          return res.end();
        }
        result.followed = false;
        result.save(function (err) {
          if (err){
            console.log(err);
            return res.status(400).send({
              message: err.stack || err
            });
          }else {
            Bot.findOne({_id: req.query.userBot}).populate('user').exec(function (err, result) {
              if (result.followed <= 0){
                result.followed = 0;
              }else {
                result.followed--;
              }
              result.save(function (err, data) {
                console.log(err);
                res.json(data);
              })
            });
          }
        });
      }
    }
  });
};

exports.botExist = function(req, res) {
  Bot.findOne({
    id: req.query.bot_id,
  }, function (err, bot) {
    if (bot) {
      res.json(bot);
    } else {
      res.status(200).send({message: 'No Bot exists'});
    }
  });
};

exports.sharedBotList = function (req, res) {
  BotAuth.aggregate(
    [
      {$match: {user: req.user._id}},
      {$group: {_id: {bot: "$bot"}}}
    ]
  ).exec(function (err, doc) {
    if(err){
      console.log(err);
      return false
    }else {
      if(!doc){
        return false
      }else {
        Bot.populate(doc, {path: "_id.bot"}, function (err, result) {
          res.json(result);
        });
      }
    }
  })
};

/*
exports.nluProcess = function(req, res) {
  var input = '';
  var nlp = require(path.resolve('engine/bot/engine/nlp/processor'));
  var nlpKo = new nlp({
    stemmer: true,      // (optional default: true)
    normalizer: true,   // (optional default: true)
    spamfilter: true     // (optional default: false)
  });

  nlpKo.tokenize(req.params.input, function(err, result) {
    var _nlp = [], _in;
    for (var i = 0; i < result.length; i++) {

      if(result[i].pos !== 'Josa' && result[i].pos !== 'Punctuation') _nlp.push(result[i].text);
    }

    _in = _nlp.join(' ');

    input = _in;

    res.json(input);
  });
};
*/

// 엔터티 입력 시 실시간 분석 결과 by dsyoon (2017. 09. 29.)
exports.nluProcess = function(req, res) {
    var koNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ko'));
    var enNLP = require(path.resolve('./engine/bot/engine/nlp/processor_en'));
    var jaNLP = require(path.resolve('./engine/bot/engine/nlp/processor_ja'));
    var zhNLP = require(path.resolve('./engine/bot/engine/nlp/processor_zh'));

    var input = '';

    if (req.body.language=="en") {
        enNLP.processLiveInput(req.params.input, function(err, result) {
            input = result;
            res.json(input);
        });
    } else if (req.body.language=="zh") {
        zhNLP.processLiveInput(req.params.input, function(err, result) {
            input = result;
            res.json(input);
        });
    } else if (req.body.language=="ja") {
        jaNLP.processLiveInput(req.params.input, function(err, result) {
            input = result;
            res.json(input);
        });
    } else {
        koNLP.processLiveInput(req.params.input, function(err, result) {
            input = result;
            res.json(input);
        });
    }
};

/**
 * Bot middleware
 */
exports.botByID = function (req, res, next, id) {
  // console.log(id);
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Bot is invalid'
  //   });
  // }

  Bot.findById(id).populate('dialogsets').populate('user').exec(function (err, bot) {
    if (err) {
      console.log(err);
      return next(err);
    } else if (!bot) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
      });
    }
    req.bot = bot;

    async.waterfall([
      function(cb) {
        if (bot.dialogsets && bot.dialogsets.length) {
          Dialogset.findOne({_id: bot.dialogsets[0]}).lean().exec(function(err, doc) {
            req.bot._doc.filename = doc.filename;
            cb(null);
          })
        } else {
          cb(null);
        }
      },
      function(cb) {
        if (bot.templateId) {
          var TemplateModel = mongoose.model('Template');
          TemplateModel.findOne({_id: bot.templateId}).lean().exec(function (err, template) {
            if (template) {
              try {
                var schema = JSON.parse(template.dataSchema);
                var lists = [];
                Object.keys(schema).forEach(function(key,index) {
                  if(schema[key].type == 'List' && !schema[key].hidden) {
                    schema[key]._key = key;
                    lists.push(schema[key]);
                  }
                });
              } catch(e) {}
              var templateDataModel = templateDatas.getTemplateDataModel(template.dataSchema);
              templateDataModel.findOne({_id: bot.templateDataId}).lean().exec(function (err, data) {

                  data = (data || {});
                async.eachSeries(lists, function(list, cb1) {
                  templateDatas.listTemplateData(template, list._key, bot.templateDataId, function(listData) {
                    data[list._key] = [];
                    listData.forEach(function(mod) {
                      var elem = mod._doc;
                      elem.__v = undefined;
                      elem._id = undefined;
                      elem.upTemplateId = undefined;
                      data[list._key].push(elem)
                    });
                    cb1(null);
                  });
                }, function(err) {
                  data.__v = undefined;
                  data._id = undefined;
                  data.templateId = undefined;
                  req.bot._doc.templateData = data;
                  cb(null);
                });
              });
            } else {
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      }
    ], function(err) {
      next();
    });
  })
};


exports.botByNameID = function (req, res, next, id) {

  Bot.findOne({id: id}).populate('dialogsets').populate('user').exec(function (err, bot) {
    if (err) {
      console.log(err);
      return next(err);
    } else if (!bot) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
      });
    }
    req.bot = bot;

    async.waterfall([
      function(cb) {
        if (bot.dialogsets && bot.dialogsets.length) {
          Dialogset.findOne({_id: bot.dialogsets[0]}).lean().exec(function(err, doc) {
            req.bot._doc.filename = doc.filename;
            cb(null);
          })
        } else {
          cb(null);
        }
      },
      function(cb) {
        if (bot.templateId) {
          var TemplateModel = mongoose.model('Template');
          TemplateModel.findOne({_id: bot.templateId}).lean().exec(function (err, template) {
            if (template) {
              try {
                var schema = JSON.parse(template.dataSchema);
                var lists = [];
                // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
                // console.log(util.inspect(schema));
                Object.keys(schema).forEach(function(key,index) {
                  if(schema[key].type == 'List' && !schema[key].hidden) {
                    schema[key]._key = key;
                    lists.push(schema[key]);
                  }
                });
              } catch(e) {}
              var templateDataModel = templateDatas.getTemplateDataModel(template.dataSchema);
              templateDataModel.findOne({_id: bot.templateDataId}).lean().exec(function (err, data) {
                // console.log(util.inspect(lists));
                // console.log(util.inspect(data));
                // console.log('###################################')
                  data = (data || {});
                async.eachSeries(lists, function(list, cb1) {
                  templateDatas.listTemplateData(template, list._key, bot.templateDataId, function(listData) {
                    data[list._key] = [];
                    listData.forEach(function(mod) {
                      var elem = mod._doc;
                      elem.__v = undefined;
                      elem._id = undefined;
                      elem.upTemplateId = undefined;
                      data[list._key].push(elem)
                    });
                    cb1(null);
                  });
                }, function(err) {
                  data.__v = undefined;
                  data._id = undefined;
                  data.templateId = undefined;
                  req.bot._doc.templateData = data;
                  cb(null);
                });
              });
            } else {
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      }
    ], function(err) {
      next();
    });
  });
};

exports.fileByID = function (req, res, next, id) {
  // console.log(util.inspect(req.bot));
  async.waterfall([
    function(cb) {
      if (id == 'none') {
        BotFile.find({bot: req.bot._id}).exec(function (err, files) {
          // console.log(util.inspect(err))
          // console.log(util.inspect(files))
          if (err) {
            return res.status(400).send({
              message: err.stack || err
            });
          } else {
            for(var i in files) {
              var file = files[i];
              if(file.name == 'default.graph.js') {
                id = file._id;
                break;
              } else if(file.name.endsWith('graph.js')) {
                id = file._id;
              }
            }
            if (id == 'none') {
              // old version without .graph.js
              for(var i in files) {
                var file = files[i];
                if(file.name == 'default.dialog.js') {
                  id = file._id;
                  break;
                } else if(file.name.endsWith('dialog.js')) {
                  id = file._id;
                }
              }
            }

            cb(null);
          }
        })
      } else if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'File is invalid'
        });
      } else {
        cb(null);
      }
    }
  ], function(err) {
    // console.log(id)
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
    })
  })
;
};


exports.listFile = function (req, res) {
  // console.log(util.inspect(req.bot));
  // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  BotFile.find({bot: req.bot._id}).populate('user', 'displayName').populate('bot').exec(function (err, files) {
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
          message: err.stack || err
        });
      } else {
        // Bot.findOne({_id: req.bot._id}).exec(function (err, data) {
        //   if (err) {
        //     return res.status(400).send({
        //       message: err.stack || err
        //     });
        //   }else {
        //     console.log(data);
        //     if(!data.dialogsets){
        //       data['dialogsets'] = [];
        //     }
        //     console.log(botFile);
        //     data.dialogsets.push(botFile);
        //     console.log(data.dialogsets);
        //     console.log('---------------------------------------------------------');
        //     console.log(data);
        //     data.markModified('dialogsets');
        //
        //     data.save(function (err, result) {
        //       console.log(err);
        //       if (err) {
        //         return res.status(400).send({
        //           message: err.stack || err
        //         });
        //       }else {
        //         console.log(result);
        //         res.json(botFile);
        //         console.log('res.json');
        //       }
        //     })
        //   }
        // })
        res.json(botFile);
        // console.log('res.json');
      }
    });
  });
};


exports.removeFile = function (req, res) {
  var file = req.file;
  var botFolder = generateBotFolder(file.bot.id);
  fs.unlink(botFolder + file.name, function (err) {
    file.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
        });
      } else {
        res.json(file);
      }
    });
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
      // console.log('data: ' + data);
      res.json({botName: bot.name, name: file.name, data: data.toString(), _id: file._id});
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
}


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

exports.convertFile = function (req, res) {
  // var dir = path.resolve('custom_modules/private_bot/_data/');
  var filename = req.body.filename;

  dialogset.convertDialogset(filename, function(result) {
    res.json({result: 'ok'});
  });

};



/********************** comment ****************************/

exports.createComment = function (req, res) {
  var comment = new BotComment(req.body);
  comment.user = req.user;

  comment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      // botLib.buildBotComment(bot.id);
      // botLib.loadBotComment(bot.id);
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
  if(req.params.botId) query['bot'] =  req.bot;

  BotComment.find(query).sort(sort).populate('user').exec(function (err, comments) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.json(comments);
    }
  });
};

exports.botCommentByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot is invalid'
    });
  }

  BotComment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};

/********************** dialog ****************************/

exports.createDialog = function (req, res) {
  var dialog = new BotDialog(req.body);
  dialog.user = req.user;

  dialogsetModule.processInput(null, dialog.inputRaw, function(_input) {
    dialog.input = _input;

    console.log('createDialog:' + dialog.botId);
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

  // BotDialog.find({'parent': dialog._id}).exec(function (err, result) {
  //   if(err){
  //     console.log(err)
  //   }else {
  //     console.log(util.inspect(result));
  //     var childIds = [];
  //     for(var i = 0; i < result.length; i++){
  //       childIds.push(result[i]._id)
  //     }
  //     console.log(util.inspect(childIds));
  //     BotDialog.remove({_id: {$in: childIds}}).exec(function (err, data) {
  //       if(err){
  //         console.log(err)
  //       }else {
  //         dialog.remove(function (err) {
  //           if (err) {
  //             return res.status(400).send({
  //               message: err.stack || err
  //             });
  //           } else {
  //             res.json(dialog);
  //           }
  //         });
  //       }
  //     })
  //   }
  // });
};

exports.listDialog = function (req, res) {
  var sort = req.query.sort || '+created';
  var user = req.user;
  var query = {};

  if (user) query['user'] =  user._id;
  if(req.params.dBotId) query['botId'] =  req.params.dBotId;
  // query['input'] = {"$ne":""};
  // query['output'] = {"$ne":""};

  BotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      // console.log(util.inspect(dialogs))
      res.json(dialogs);
    }
  });
};

exports.botDialogByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot is invalid'
    });
  }

  BotDialog.findById(id).populate('user', 'displayName').exec(function (err, dialog) {
    if (err) {
      return next(err);
    } else if (!dialog) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
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
      // console.log('context analytics: ');
    });
  });

};


exports.contextLearning = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.params.botId) query['bot'] =  req.bot;

  BotDialog.find(query).sort(sort).populate('user').exec(function (err, dialogs) {
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

  // console.log(req.params.msg);
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
