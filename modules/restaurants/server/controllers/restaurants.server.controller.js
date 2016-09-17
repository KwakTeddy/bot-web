'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Restaurant = mongoose.model('Restaurant'),
  Menu = mongoose.model('Menu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var restaurant = new Restaurant(req.body);
  restaurant.user = req.user;

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var restaurant = req.restaurant ? req.restaurant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  restaurant.isCurrentUserOwner = req.user && restaurant.user && restaurant.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(restaurant);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var restaurant = req.restaurant ;

  restaurant = _.extend(restaurant , req.body);

  restaurant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var restaurant = req.restaurant ;

  restaurant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurant);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Restaurant.find().sort('-created').populate('user', 'displayName').exec(function(err, restaurants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(restaurants);
    }
  });
};

/**
 * Custom action middleware
 */
exports.restaurantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Restaurant.findById(id).populate('user', 'displayName').exec(function (err, restaurant) {
    if (err) {
      return next(err);
    } else if (!restaurant) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.restaurant = restaurant;
    next();
  });
};

exports.readMenus = function(req, res) {
  Menu.find({restaurant: req.params.restaurantId}).sort('-created').exec(function(err, menus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({restaurant: req.params.restaurantId, _menus: menus});
    }
  });
};

exports.updateMenus = function(req, res) {
  var count = 0;
  for(var i = 0; i < req.body._menus.length; i++) {
    var _update = req.body._menus[i];
    _update.restaurant = req.body.restaurant;

    if(_update._id == undefined) {
      Menu.create(_update, function(err, _doc) {
        count++;
        if(count >= req.body._menus.length) res.end();
      });
    } else {
      Menu.update({_id: _update._id}, _update, {upsert: true}, function(err) {
        count++;
        if(count >= req.body._menus.length) res.end();
      })
    }

  }
};
