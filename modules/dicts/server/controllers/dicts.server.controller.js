'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dict = mongoose.model('Dict'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var dict = new Dict(req.body);
  dict.user = req.user;

  dict.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dict);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var dict = req.dict ? req.dict.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  dict.isCurrentUserOwner = req.user && dict.user && dict.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(dict);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var dict = req.dict ;

  dict = _.extend(dict , req.body);

  dict.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dict);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var dict = req.dict ;

  dict.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dict);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Dict.find().sort('-created').populate('user', 'displayName').exec(function(err, dicts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(dicts);
    }
  });
};

/**
 * Custom action middleware
 */
exports.dictByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Dict.findById(id).populate('user', 'displayName').exec(function (err, dict) {
    if (err) {
      return next(err);
    } else if (!dict) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.dict = dict;
    next();
  });
};
