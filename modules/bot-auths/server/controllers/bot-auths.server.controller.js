'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  BotAuth = mongoose.model('BotAuth'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
var util =require("util");
var async = require("async")

exports.getAuth = function (req, res) {
  var user = req.body.user || req.user._id;
  BotAuth.find({user: user, bot: req.body.bId}).exec(function (err, doc) {
    if(err){
      console.log(err);
      return false;
    }else {
      if(!doc){
        return false;
      }else {
        var result = [];
        async.eachSeries(doc, function (_doc, cb) {
          BotAuth.findOne({_id: _doc._id}).populate("subject", null, _doc.subjectSchema).populate("user").lean().exec(function (err2, data) {
            if(err2){
              return false
            }else {
              if(data){
                result.push(data);
              }
              cb(null);
            }
          })
        }, function (err) {
          res.json(result);
        });
      }
    }
  })

};


/**
 * Create a Bot auth
 */
exports.create = function(req, res) {
  User.findOne({email: req.body.email}).exec(function (err, doc) {
    if(err){
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(!doc){
        return res.status(400).send({
          message: "해당하는 사용자가 없습니다"
        });
      }else {
        BotAuth.findOne({user: doc._id, bot: req.body.authData[0].bot}).exec(function (err2, doc2) {
          if(err2){
            console.log(err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }else {
            if(doc2){
              return res.status(400).send({
                message: "권한을 이미 부여받은 사용자입니다"
              });
            }else {
              async.eachSeries(req.body.authData, function (data, cb) {
                if(data.view){
                  var botAuth = new BotAuth(data);
                  botAuth.giver = req.user._id;
                  botAuth.user = doc._id;
                  botAuth.save(function(err) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      cb(null)
                    }
                  });
                }else {
                  cb(null);
                }
              }, function (err) {
                res.end();
              });
            }
          }
        });
      }
    }
  });
};

/**
 * Show the current Bot auth
 */
exports.read = function(req, res) {

  res.jsonp();
};

/**
 * Update a Bot auth
 */
exports.update = function(req, res) {
  console.log(util.inspect(req.body));
  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')

  BotAuth.find({bot: req.params.botId, user: req.params.userId}).exec(function (err, data) {
    if(err){
      console.log(err);
      return false
    }else {
      if(data){
        async.eachSeries(req.body.authData, function (input, cb) {
          var create = false;
          var update = false;
          var remove = false;
          data.forEach(function (doc) {
            if((input.subject == doc.subject) && (input.subjectSchema == doc.subjectSchema)){
              if(input.view) update = true;
              else remove = true;
            }else {
              if(input.view) create = true;
            }
          });
          if(update){
            BotAuth.update({subject: input.subject, subjectSchema: input.subjectSchema}, {edit: input.edit}, {upsert: true}).exec(function (err, doc) {
              if(err){
                console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }else {
                cb(null);
              }
            });
          }else if(create){
            var botAuth = new BotAuth(input);
            botAuth.giver = req.user._id;
            botAuth.user = req.params.userId;
            botAuth.save(function(err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                cb(null)
              }
            });
          }else if(remove){
            BotAuth.remove({subject: input.subject, subjectSchema: input.subjectSchema}).exec(function (err, doc) {
              if(err){
                console.log(err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }else {
                cb(null)
              }
            });
          }else {
            cb(null)
          }
        }, function (err) {
          res.json("완료")
        });
      }else {
        return res.send({
          message: "권한이 주어지지 않았어요"
        });
      }
    }
  });
};

/**
 * Delete an Bot auth
 */
exports.delete = function(req, res) {
  BotAuth.remove({bot: req.params.botId, user: req.params.userId}).exec(function (err, doc) {
    if(err){
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      res.json(doc);
    }
  });
};

/**
 * List of Bot auths
 */
exports.list = function(req, res) {
  var botId = req.query.botId;
  botId = mongoose.Types.ObjectId(botId);
  BotAuth.aggregate(
    [
      {$match: {bot:botId}},
      {$group:
        {
          _id: {user: "$user", subjectSchema: "$subjectSchema"}
        }
      },
      {$group:
        {
          _id: {user: "$_id.user"}, subjectSchema: {$push: "$_id.subjectSchema"}
        }
      }
    ]
  ).exec(function (err, doc) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      User.populate(doc, {path: "_id.user"}, function (err2, _doc) {
        res.json(_doc);
      });
    }
  });

  // BotAuth.find({bot: req.query.botId}).sort('-created').exec(function(err, doc) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     var result = [];
  //     async.eachSeries(doc, function (_doc, cb) {
  //       BotAuth.findById(_doc._id).populate("subject", null, _doc.subjectSchema).populate('user', 'displayName email').populate('giver', 'displayName email').lean().exec(function (err2, data) {
  //         if(err2){
  //           return false
  //         }else {
  //           if(data){
  //             result.push(data);
  //           }
  //           cb(null);
  //         }
  //       })
  //     }, function (err) {
  //       res.json(result);
  //     });
  //   }
  // });
};

/**
 * Bot auth middleware
 */
exports.botAuthByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot auth is invalid'
    });
  }

  BotAuth.findById(id).populate('user', 'displayName').exec(function (err, botAuth) {
    if (err) {
      return next(err);
    } else if (!botAuth) {
      return res.status(404).send({
        message: 'No Bot auth with that identifier has been found'
      });
    }
    req.botAuth = botAuth;
    next();
  });
};
