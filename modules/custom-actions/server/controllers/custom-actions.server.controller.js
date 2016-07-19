'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CustomAction = mongoose.model('CustomAction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var customAction = new CustomAction(req.body);
  customAction.user = req.user;

  customAction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customAction);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customAction = req.customAction ? req.customAction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customAction.isCurrentUserOwner = req.user && customAction.user && customAction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(customAction);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var customAction = req.customAction ;

  customAction = _.extend(customAction , req.body);

  customAction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customAction);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var customAction = req.customAction ;

  customAction.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customAction);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  CustomAction.find().sort('-created').populate('user', 'displayName').exec(function(err, customActions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customActions);
    }
  });
};

/**
 * Custom action middleware
 */
exports.customActionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  CustomAction.findById(id).populate('user', 'displayName').exec(function (err, customAction) {
    if (err) {
      return next(err);
    } else if (!customAction) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.customAction = customAction;
    next();
  });
};
