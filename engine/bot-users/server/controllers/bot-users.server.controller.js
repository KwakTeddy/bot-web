'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var mongoose = require('mongoose');

var  BotUser = mongoose.model('BotUser'),
  UserBotFbPage = mongoose.model('UserBotFbPage'),
  Bank = mongoose.model('Bank'),
  _ = require('lodash'),
  request = require('request'),
  async = require('async'),
  util = require('util'),
  utils = require(path.resolve('engine/bot/action/common/utils'));



/**
 * Create a Bot user
 */
exports.create = function (req, res) {
  var botUser = null;
  if (!req.botUser) {
    botUser = new BotUser(req.body);
    // botUser.userKey = req.params.userKey;
  } else {
    botUser = req.botUser;
  }

  if (req.body.bank
    && req.body.account) {
    Bank.findOne({userKey: botUser.userKey, bankName: req.body.bank}).exec(function (err, b) {
      if (!err && b) {
        botUser.currentBank = b;
        botUser.currentAccount = req.body.account;
      }
      save();
    })
  } else {
    save();
  }

  function save() {
    botUser.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
        });
      } else {
        res.jsonp(botUser);
      }
    });
  }
};

/**
 * Show the current Bot user
 */
exports.read = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }
  // convert mongoose document to JSON
  var botUser = req.botUser ? req.botUser.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  botUser.isCurrentUserOwner = req.user && botUser.user && botUser.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(botUser);
};

/**
 * Update a Bot user
 */
exports.update = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var botUser = req.botUser;

  botUser = _.extend(botUser, req.body);

  botUser.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(botUser);
    }
  });
};

/**
 * Delete an Bot user
 */
exports.delete = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var botUser = req.botUser;

  botUser.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(botUser);
    }
  });
};

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  console.log(util.inspect(req.query, {showHidden: false, depth: null}));
  var query = {};
  query['botId'] = req.query.botId;
  // query['channel'] = {$ne: "socket"};
  var currentPage = 0;
  var perPage = 10;
  var sort = {};
  // if(req.query.role && (req.query.role == 'admin')){
  //   query = {};
  // }
  if(req.query.currentPage) currentPage = req.query.currentPage;
  if(req.query.perPage) perPage = req.query.perPage;
  if(req.query.sortDir && req.query.sortCol) sort[req.query.sortCol] = req.query.sortDir;
  if(req.query.search){
    var searchQuery = {};
    searchQuery['$and'] = [];
    searchQuery.$and.push(query);
    searchQuery.$and.push({
      $or : [
        {channel: { $regex: req.query.search}},
        {userKey: { $regex: req.query.search}}
        ]
    })
    query = searchQuery;
  };
  console.log(util.inspect(currentPage));
  console.log(util.inspect(sort));
  console.log(util.inspect(query));
  console.log(util.inspect('+++++++++++++++++++++++++++++++++++++'));

  BotUser.find(query).sort(sort).skip(currentPage*perPage).limit(perPage).exec(function (err, botUsers) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      if(botUsers.length){
        var botUsers = JSON.parse(JSON.stringify(botUsers));
        BotUser.count(query, function (err2, count) {
          if (err2) console.log(err2);
          else {
            async.eachSeries(botUsers, function(botUser, cb) {
              if(false) {
                UserBotFbPage.findOne({pageId: '1886604644926791'}).exec(function (err3, data) {
                  if(err3) {
                    console.log(err3);
                  }else {
                    request({
                      uri: 'https://graph.facebook.com/v2.6/' + botUser.userKey,
                      qs: { access_token: data.accessToken },
                      method: 'GET'
                    }, function (error, response, body) {
                      if (!error && response.statusCode == 200) {
                        botUser['facebookData'] = body;
                        botUser.facebookData = JSON.parse(botUser.facebookData);
                        cb(null)
                      } else {
                        cb(null);
                        console.log(error);
                      }
                    });
                  }
                })
              }else {
                cb(null)
              }
            }, function (err) {
              if(err) console.log(err);
              var result = [{data: botUsers, recordsTotal: count}];
              res.jsonp(result);
            });

          }
        });
      }else {
        var result = [{data: [], recordsTotal: 0}];
        res.jsonp(result);
      }
    }
  });
};

/**
 * Bot user middleware
 */
exports.botUserByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot user is invalid'
    });
  }

  BotUser.findById(id).populate('currentBank').exec(function (err, botUser) {
    if (err) {
      return next(err);
    } else if (!botUser) {
      return res.status(404).send({
        message: 'No Bot user with that identifier has been found'
      });
    }
    req.botUser = botUser;
    next();
  });
};
exports.botUserByUserKey = function (req, res, next, userKey) {
  BotUser.findOne({userKey: userKey}).populate('currentBank').exec(function (err, botUser) {
    if (err) {
      return next(err);
    }

    req.botUser = botUser;
    next();
  });
};


var botUserCache = [];
var botUserCacheLock = false;
var MAX_CACHE_DIALOG = 500;
var LIMIT_CACHE_DIALOG = 1000000;
var BOTUSER_CACHE_INTERVAL = 60;

function updateCacheBotUser() {
  if(botUserCacheLock) return;
  botUserCacheLock = true;

  try {
    // BotUser.collection.insert(botUserCache, function(err, docs) {
    //   botUserCacheLock = false;
    //
    //   console.log('updateCacheBotUser err: ' + err);
    //
    //   if(docs && docs.insertedCount) {
    //     botUserCache.splice(0, docs.insertedCount);
    //     console.log('botUsers: ' + docs.insertedCount + ' inserted')
    //   }
    // });

    var bulk = BotUser.collection.initializeOrderedBulkOp();
    for(var i = 0; i < botUserCache.length; i++) {
      bulk.find({userKey: botUserCache[i].userKey}).upsert().updateOne(botUserCache[i]);
    }
    bulk.execute(function(err, data) {
      botUserCacheLock = false;

      if(!err) {
        botUserCache.splice(0, data.nMatched);
        console.log('botUsers: ' + data.nMatched + ' updated')
      }

    })

  } catch(e) {
    botUserCacheLock = false;
    console.log('updateCacheBotUser Err: ' + e);
  }
}

// insert userdialog cache every minute
setInterval(function() {
  // console.log('processing botuser cache check: ' + (new Date()));

  if (!botUserCacheLock && botUserCache.length > 0) {
    console.log('processing botuser cache: ' + botUserCache.length);

    updateCacheBotUser();
  }
}, BOTUSER_CACHE_INTERVAL*1000);

function getUserContext(task, context, callback) {
  var botExist;
  BotUser.findOne({userKey: task.userId}, function(err, doc) {
    if(doc == undefined) {
      if(false) {
        BotUser.create({userKey: task.userId, channel: task.channel, created: Date.now(), botId: task.bot}, function(err, _doc) {
          task.doc = _doc;
          callback(task, context);
        });
      } else {
        if(botUserCache.length < LIMIT_CACHE_DIALOG) {
          botUserCache.push({userKey: task.userId, channel: task.channel, created: new Date()});
        }

        if(!botUserCacheLock &&
          botUserCache.length >= MAX_CACHE_DIALOG) {
          updateCacheBotUser();
        }

        callback(task, context);
      }
    } else {
      doc.botId.forEach(function (botId) {
        if(botId == task.bot) botExist = true
      });
      if(!botExist){
       doc.botId.push(task.bot);
       doc.markModified('botId');
       doc.save(function (err) {
         if(err) console.log(err);
         else {
           task.doc = doc;
           callback(task, context);
         }
       })
      }else {
        task.doc = doc;
        callback(task, context);
      }
      // task.doc = doc;
      // callback(task, context);
    }
  });
}

exports.getUserContext = getUserContext;

function updateUserContext(task, context, callback) {
  var update = {};
  for (var i = 0; i < task.updates.length; i++) {
    var key = task.updates[i];
    update[key] = task[key];
  }

  BotUser.update({userKey: task.userId}, update, function(err, num) {
    callback(task, context);
  });
}

exports.updateUserContext = updateUserContext;
