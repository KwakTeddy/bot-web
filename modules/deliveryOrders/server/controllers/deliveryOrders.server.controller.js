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

  var isChange = false;
  var changeStatus = deliveryOrder.status;

  deliveryOrder = _.extend(deliveryOrder , req.body);

  if(changeStatus != deliveryOrder.status) {
    isChange = true;
  }

  deliveryOrder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrder);
      if(isChange && (deliveryOrder.status == '접수' || deliveryOrder.status == '취소')) {
        changeOrderStatus(deliveryOrder);
      }
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
  DeliveryOrder.find({status: '요청'}).sort({created: 'desc'}).populate('restaurant botUser').exec(function(err, deliveryOrders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deliveryOrders);
    }
  });
};

exports.updateStatus = function(deliveryOrderId, status) {
  DeliveryOrder.findOne({_id: deliveryOrderId}, function(err, doc) {

    doc.status = status;
    doc.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if(status != doc.status && (status == '접수' || status == '취소')) {
          changeOrderStatus(doc);
        }
      }
    });
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

  DeliveryOrder.findById(id).populate('restaurant botUser').exec(function (err, deliveryOrder) {
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


exports.linkTerms = function (req, res) {
  res.render('modules/deliveryOrders/server/views/terms', {});
};


exports.linkPrivacy = function (req, res) {
  res.render('modules/deliveryOrders/server/views/privacy', {});
};

var facebook = require(path.resolve('./modules/bot/server/controllers/facebook.server.controller.js'));

function changeOrderStatus(deliveryOrder) {
  var bot = global._bots['order'];
  for(var i = 0; i <  bot.managers.length; i++) {
    var manager = bot.managers[i];

    facebook.respondMessage(manager.userId,
      '[' + deliveryOrder.status + '완료]\n' +
      '배달주소: ' + deliveryOrder.address + '\n' +
      '매장명:' + deliveryOrder.restaurantName, bot.botName);
  }

  if(deliveryOrder.status == '취소' &&  deliveryOrder.botUser && deliveryOrder.botUser.mobile) {
    var request = require('request');

    var message = "[인공지능 배달봇 얌얌]\n" +
      deliveryOrder.restaurantName + '/주문 취소/매장이 바쁘거나 영업 중이 아닙니다.';

    request.post(
      'https://bot.moneybrain.ai/api/messages/sms/send',
      {json: {callbackPhone: '028585683', phone: deliveryOrder.botUser.mobile.replace(/,/g, ''), message: message}},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // callback(task, context);
        }
      }
    );
  }
}