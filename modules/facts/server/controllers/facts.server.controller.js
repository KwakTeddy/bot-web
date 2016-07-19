'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fact = mongoose.model('Fact'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var fact = new Fact(req.body);
  fact.user = req.user;

  fact.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fact);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fact = req.fact ? req.fact.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fact.isCurrentUserOwner = req.user && fact.user && fact.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(fact);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var fact = req.fact ;

  fact = _.extend(fact , req.body);

  fact.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fact);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var fact = req.fact ;

  fact.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fact);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Fact.find().sort('-created').populate('user', 'displayName').exec(function(err, facts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(facts);
    }
  });
};

/**
 * Custom action middleware
 */
exports.factByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Fact.findById(id).populate('user', 'displayName').exec(function (err, fact) {
    if (err) {
      return next(err);
    } else if (!fact) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.fact = fact;
    next();
  });
};
