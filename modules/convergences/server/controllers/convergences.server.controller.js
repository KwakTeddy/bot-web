'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Convergence = mongoose.model('Convergence'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Convergence
 */
exports.create = function(req, res) {
  var convergence = new Convergence(req.body);
  convergence.user = req.user;

  convergence.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(convergence);
    }
  });
};

/**
 * Show the current Convergence
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var convergence = req.convergence ? req.convergence.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  convergence.isCurrentUserOwner = req.user && convergence.user && convergence.user._id.toString() === req.user._id.toString();

  res.jsonp(convergence);
};

/**
 * Update a Convergence
 */
exports.update = function(req, res) {
  var convergence = req.convergence;

  convergence = _.extend(convergence, req.body);

  convergence.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(convergence);
    }
  });
};

/**
 * Delete an Convergence
 */
exports.delete = function(req, res) {
  var convergence = req.convergence;

  convergence.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(convergence);
    }
  });
};

/**
 * List of Convergences
 */
exports.list = function(req, res) {
  Convergence.find().sort('-created').populate('user', 'displayName').exec(function(err, convergences) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(convergences);
    }
  });
};

/**
 * Convergence middleware
 */
exports.convergenceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Convergence is invalid'
    });
  }

  Convergence.findById(id).populate('user', 'displayName').exec(function (err, convergence) {
    if (err) {
      return next(err);
    } else if (!convergence) {
      return res.status(404).send({
        message: 'No Convergence with that identifier has been found'
      });
    }
    req.convergence = convergence;
    next();
  });
};
