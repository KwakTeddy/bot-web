'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Franchise = mongoose.model('Franchise'),
  FranchiseMenu = mongoose.model('FranchiseMenu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var franchise = new Franchise(req.body);
  franchise.user = req.user;

  franchise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(franchise);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var franchise = req.franchise ? req.franchise.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  franchise.isCurrentUserOwner = req.user && franchise.user && franchise.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(franchise);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var franchise = req.franchise ;

  franchise = _.extend(franchise , req.body);

  franchise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(franchise);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var franchise = req.franchise ;

  franchise.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(franchise);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Franchise.find().sort('-created').populate('user', 'displayName').exec(function(err, franchises) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(franchises);
    }
  });
};

/**
 * Custom action middleware
 */
exports.franchiseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Franchise.findById(id).populate('user', 'displayName').exec(function (err, franchise) {
    if (err) {
      return next(err);
    } else if (!franchise) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.franchise = franchise;
    next();
  });
};

exports.readMenus = function(req, res) {
  FranchiseMenu.find({franchise: req.params.franchiseId}).sort('-created').exec(function(err, menus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({franchise: req.params.franchiseId, _menus: menus});
    }
  });
};

exports.updateMenus = function(req, res) {
  var count = 0;
  for(var i = 0; i < req.body._menus.length; i++) {
    var _update = req.body._menus[i];
    if(_update.name == undefined || _update.name == '') continue;
    _update.franchise = req.body.franchise;

    if(_update._id == undefined) {
      FranchiseMenu.create(_update, function (err, _doc) {
        count++;
        if (count >= req.body._menus.length) res.end();
      });
    } else if(_update._remove) {
      FranchiseMenu.remove({_id: _update._id}, function(err) {
        count++;
        if(count >= req.body._menus.length) res.end();
      });
    } else {
      FranchiseMenu.update({_id: _update._id}, _update, {upsert: true}, function(err) {
        count++;
        if(count >= req.body._menus.length) res.end();
      });
    }
  }
};
