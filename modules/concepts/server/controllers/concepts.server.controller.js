'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Concept = mongoose.model('Concept'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var concept = new Concept(req.body);
  concept.user = req.user;

  concept.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(concept);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var concept = req.concept ? req.concept.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  concept.isCurrentUserOwner = req.user && concept.user && concept.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(concept);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var concept = req.concept ;

  concept = _.extend(concept , req.body);

  concept.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(concept);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var concept = req.concept ;

  concept.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(concept);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Concept.find().sort('-created').populate('user', 'displayName').exec(function(err, concepts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(concepts);
    }
  });
};

/**
 * Custom action middleware
 */
exports.conceptByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Concept.findById(id).populate('user', 'displayName').exec(function (err, concept) {
    if (err) {
      return next(err);
    } else if (!concept) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.concept = concept;
    next();
  });
};
