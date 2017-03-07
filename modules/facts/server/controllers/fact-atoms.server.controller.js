'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  FactAtom = mongoose.model('FactAtom'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var factAtom = new FactAtom(req.body);
  factAtom.user = req.user;

  factAtom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factAtom);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var factAtom = req.factAtom ? req.factAtom.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  factAtom.isCurrentUserOwner = req.user && factAtom.user && factAtom.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(factAtom);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var factAtom = req.factAtom ;

  factAtom = _.extend(factAtom , req.body);

  factAtom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factAtom);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var factAtom = req.factAtom ;

  factAtom.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factAtom);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  FactAtom.find().sort('-created').populate('user', 'displayName').exec(function(err, factAtoms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factAtoms);
    }
  });
};

/**
 * Custom action middleware
 */
exports.factAtomByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  FactAtom.findById(id).populate('user', 'displayName').exec(function (err, factAtom) {
    if (err) {
      return next(err);
    } else if (!factAtom) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.factAtom = factAtom;
    next();
  });
};
