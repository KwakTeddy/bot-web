'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  FactLink = mongoose.model('FactLink'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var factLink = new FactLink(req.body);
  factLink.user = req.user;

  factLink.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factLink);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var factLink = req.factLink ? req.factLink.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  factLink.isCurrentUserOwner = req.user && factLink.user && factLink.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(factLink);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var factLink = req.factLink ;

  factLink = _.extend(factLink , req.body);

  factLink.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factLink);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var factLink = req.factLink ;

  factLink.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factLink);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  FactLink.find().sort('-created').populate('user', 'displayName').exec(function(err, factLinks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factLinks);
    }
  });
};

exports.find = function(req, res) {
  // FactLink.find({botUser: req.params.factBotUserId}).sort('-created').exec(function(err, factLinks) {
  FactLink.find({}).limit(500).sort('-created').exec(function(err, factLinks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(factLinks);
    }
  });
};

/**
 * Custom action middleware
 */
exports.factLinkByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  FactLink.findById(id).populate('user', 'displayName').exec(function (err, factLink) {
    if (err) {
      return next(err);
    } else if (!factLink) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.factLink = factLink;
    next();
  });
};
