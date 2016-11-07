'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  DeliveryOrder = mongoose.model('DeliveryOrder'),
  DeliveryOrderMenu = mongoose.model('DeliveryOrderMenu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var deliveryOrder = new DeliveryOrder(req.body);
  deliveryOrder.user = req.user;

  deliveryOrder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrder);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var deliveryOrder = req.deliveryOrder ? req.deliveryOrder.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  deliveryOrder.isCurrentUserOwner = req.user && deliveryOrder.user && deliveryOrder.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(deliveryOrder);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var deliveryOrder = req.deliveryOrder ;

  deliveryOrder = _.extend(deliveryOrder , req.body);

  deliveryOrder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrder);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var deliveryOrder = req.deliveryOrder ;

  deliveryOrder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrder);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  DeliveryOrder.find().sort('-created').populate('user', 'displayName').exec(function(err, deliveryOrders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrders);
    }
  });
};

/**
 * Custom action middleware
 */
exports.deliveryOrderByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  DeliveryOrder.findById(id).populate('user', 'displayName').exec(function (err, deliveryOrder) {
    if (err) {
      return next(err);
    } else if (!deliveryOrder) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.deliveryOrder = deliveryOrder;
    next();
  });
};

exports.readMenus = function(req, res) {
  DeliveryOrderMenu.find({deliveryOrder: req.params.deliveryOrderId}).sort('-created').exec(function(err, menus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({deliveryOrder: req.params.deliveryOrderId, _menus: menus});
    }
  });
};

exports.updateMenus = function(req, res) {
  var count = 0;
  for(var i = 0; i < req.body._menus.length; i++) {
    var _update = req.body._menus[i];
    if(_update.name == undefined || _update.name == '') continue;
    _update.deliveryOrder = req.body.deliveryOrder;

    if(_update._id == undefined) {
      DeliveryOrderMenu.create(_update, function(err, _doc) {
        count++;
        if(count >= req.body._menus.length) res.end();
      });
    } else {
      DeliveryOrderMenu.update({_id: _update._id}, _update, {upsert: true}, function(err) {
        count++;
        if(count >= req.body._menus.length) res.end();
      })
    }

  }
};


exports.linkTerms = function (req, res) {
  res.render('modules/deliveryOrders/server/views/terms', {});
};
