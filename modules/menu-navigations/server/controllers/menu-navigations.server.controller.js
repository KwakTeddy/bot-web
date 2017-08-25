'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MenuNavigation = mongoose.model('MenuNavigation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Menu navigation
 */
exports.create = function(req, res) {
  var menuNavigation = new MenuNavigation(req.body);
  menuNavigation.user = req.user;

  menuNavigation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menuNavigation);
    }
  });
};

/**
 * Show the current Menu navigation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var menuNavigation = req.menuNavigation ? req.menuNavigation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  menuNavigation.isCurrentUserOwner = req.user && menuNavigation.user && menuNavigation.user._id.toString() === req.user._id.toString();

  res.jsonp(menuNavigation);
};

/**
 * Update a Menu navigation
 */
exports.update = function(req, res) {
  var menuNavigation = req.menuNavigation;

  menuNavigation = _.extend(menuNavigation, req.body);

  menuNavigation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menuNavigation);
    }
  });
};

/**
 * Delete an Menu navigation
 */
exports.delete = function(req, res) {
  var menuNavigation = req.menuNavigation;

  menuNavigation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menuNavigation);
    }
  });
};

/**
 * List of Menu navigations
 */
exports.list = function(req, res) {
  MenuNavigation.find().sort('-created').populate('user', 'displayName').exec(function(err, menuNavigations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menuNavigations);
    }
  });
};

/**
 * Menu navigation middleware
 */
exports.menuNavigationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Menu navigation is invalid'
    });
  }

  MenuNavigation.findById(id).populate('user', 'displayName').exec(function (err, menuNavigation) {
    if (err) {
      return next(err);
    } else if (!menuNavigation) {
      return res.status(404).send({
        message: 'No Menu navigation with that identifier has been found'
      });
    }
    req.menuNavigation = menuNavigation;
    next();
  });
};
