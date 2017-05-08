'use strict';


var path = require('path');
var dialogset = require(path.resolve('modules/bot/engine/dialogset/dialogset.js'));

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Intent = mongoose.model('Intent'),
  IntentContent = mongoose.model('IntentContent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var util = require('util'); //temporary

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var query = {botId: req.body.botName, user: req.user._id, name: req.body.name};
  Intent.findOne(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: err
      });
    } else {
      if (!result){
        var intent = new Intent();
        intent.botId = req.body.botName;
        intent.name = req.body.name;
        intent.user = req.user;

        var intentContent = new IntentContent();
        intentContent.user = req.user;
        intentContent.intentId = intent._id;
        intentContent.name = req.body.content;
        intentContent.botId = req.body.botName;

        dialogset.processInput(null, req.query.content, function(_input, _json) {
          intentContent.input = _input;

          intent.save(function(err) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                message: err
              });
            } else {
              intentContent.save(function (err) {
                console.log(err);
                if (err) {
                  console.log(err);
                  return res.status(400).send({
                    message: err
                  });
                }else {
                  console.log(intent);
                  res.jsonp(intent);
                }
              })
            }
          });
        });
      }else {
        return res.status(400).send({
          message:  '\'' + req.body.name + '\'' +' 이름의 인텐트가 존재합니다. 다른 이름으로 생성해주세요'
        });
      }
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var intent = req.intent ? req.intent.toJSON() : {};

  if (req.user && (String(req.user._id) == String(intent.user._id)) && (req.intent.botId == req.params.botName)){
    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    intent.isCurrentUserOwner = req.user && intent.user && intent.user._id.toString() === req.user._id.toString() ? true : false;

    IntentContent.find({intentId: intent._id}, function (err, result) {
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }else {
        // console.log(JSON.stringify(result));
        intent.content = result;
        // console.log(util.inspect(intent));
        res.jsonp(intent);
      }
    })
  }else {
    return res.end();
  }
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var intent = req.intent ;
  console.log(util.inspect(intent));
  console.log(util.inspect(req.body));
  intent = _.extend(intent , req.body);

  intent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(intent);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var intent = req.intent ;

  intent.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(intent);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  console.log(321312321312);

  Intent.find({botId: req.params.botName}).sort('-created').populate('user', 'displayName').exec(function(err, intents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(intents);
    }
  });
};

/**
 * Custom action middleware
 */
exports.intentByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Intent.findById(id).populate('user', 'displayName').exec(function (err, intent) {
    if (err) {
      return next(err);
    } else if (!intent) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.intent = intent;
    next();
  });
};

/**
 * Create a Custom action
 */
exports.contentCreate = function(req, res) {
  console.log(req.body.content);
  console.log('-----------------');
  IntentContent.find({user: req.user._id, intentId: req.body.intentId, name: req.body.content}).exec(function (err, data) {
    console.log(err);
    console.log(data);
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(!data.length){
        var intentContent = new IntentContent();
        intentContent.name = req.body.content;
        intentContent.user = req.user;
        intentContent.intentId = req.body.intentId;
        intentContent.botId = req.body.botId;

        dialogset.processInput(null, req.body.content, function(_input, _json) {
          intentContent.input = _input;

          intentContent.save(function (err, data) {
            console.log(err);
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }else {
              console.log(data);
              res.json(data);
            }
          });
        });

      }else {
        return res.status(400).send({
          message: '동일한 내용이 존재합니다.'
        });
      }
    }
  })

};


/**
 * Delete an Custom action
 */
exports.contentDelete = function(req, res) {
  IntentContent.remove({_id: req.query.contentId}, function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(data);
      console.log('--------------')
      res.jsonp(data);
    }
  })
};
