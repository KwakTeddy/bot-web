'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CommonAction = mongoose.model('CommonAction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var commonAction = new CommonAction(req.body);
  commonAction.user = req.user;

  commonAction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commonAction);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var commonAction = req.commonAction ? req.commonAction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  commonAction.isCurrentUserOwner = req.user && commonAction.user && commonAction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(commonAction);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var commonAction = req.commonAction ;

  commonAction = _.extend(commonAction , req.body);

  commonAction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commonAction);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var commonAction = req.commonAction ;

  commonAction.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commonAction);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  CommonAction.find().sort('-created').populate('user', 'displayName').exec(function(err, commonActions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(commonActions);
    }
  });
};

/**
 * Custom action middleware
 */
exports.commonActionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  CommonAction.findById(id).populate('user', 'displayName').exec(function (err, commonAction) {
    if (err) {
      return next(err);
    } else if (!commonAction) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.commonAction = commonAction;
    next();
  });
};
