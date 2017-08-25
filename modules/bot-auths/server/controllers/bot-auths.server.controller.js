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
          BotAuth.findOne({_id: _doc._id}).populate("subject", null, _doc.subjectSchema).lean().exec(function (err2, data) {
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
      return false;
    }else {
      if(!doc){
        return res.send({
          message: "해당하는 사용자가 없습니다"
        });
      }else {
        async.eachSeries(req.body.authData, function (data, cb) {
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
        }, function (err) {
          res.end();
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
  var botAuth = req.botAuth;

  botAuth = _.extend(botAuth, req.body);

  botAuth.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(botAuth);
    }
  });
};

/**
 * Delete an Bot auth
 */
exports.delete = function(req, res) {
  var botAuth = req.botAuth;

  botAuth.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(botAuth);
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
