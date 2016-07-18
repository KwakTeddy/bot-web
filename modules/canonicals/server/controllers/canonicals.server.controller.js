'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Canonical = mongoose.model('Canonical'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var canonical = new Canonical(req.body);
  canonical.user = req.user;

  canonical.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canonical);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var canonical = req.canonical ? req.canonical.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  canonical.isCurrentUserOwner = req.user && canonical.user && canonical.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(canonical);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var canonical = req.canonical ;

  canonical = _.extend(canonical , req.body);

  canonical.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canonical);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var canonical = req.canonical ;

  canonical.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canonical);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Canonical.find().sort('-created').populate('user', 'displayName').exec(function(err, canonicals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(canonicals);
    }
  });
};

/**
 * Custom action middleware
 */
exports.canonicalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Canonical.findById(id).populate('user', 'displayName').exec(function (err, canonical) {
    if (err) {
      return next(err);
    } else if (!canonical) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.canonical = canonical;
    next();
  });
};
