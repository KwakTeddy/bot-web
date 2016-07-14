'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bank = mongoose.model('Bank'),
  BotUser = mongoose.model('BotUser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.renderSave = function (req, res) {
  res.render('modules/banks/server/views/bank-save', {
    userKey: req.params.userKey
  });
};

/**
 * Create a Bank
 */
exports.create = function(req, res) {
  if(!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var bank = undefined;
  Bank.findOne({userKey: req.params.userKey, bankName: req.body.bankName}).exec(function (err, b) {
    if(err || !b) {
      bank = new Bank(req.body);
      bank.userKey = req.params.userKey;
    } else {
      bank = b;
      bank.userID = req.body.userID;
      bank.userPassword = req.body.userPassword;
    }

    if(!bank) {
      return res.status(400).send({
        message: 'Something went wrong..'
      });
    } else {
      bank.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if(!req.botUser.currentBank) {
            req.botUser.currentBank = bank;
            req.botUser.save(function (err) {
              if(err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
              res.jsonp(bank);
            })
          } else {
            res.jsonp(bank);
          }
        }
      });
    }
  });
};

/**
 * Show the current Bank
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bank = req.bank ? req.bank.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bank.isCurrentUserOwner = req.user && bank.user && bank.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(bank);
};

/**
 * Update a Bank
 */
exports.update = function(req, res) {
  var bank = req.bank ;

  bank = _.extend(bank , req.body);

  bank.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bank);
    }
  });
};

/**
 * Delete an Bank
 */
exports.delete = function(req, res) {
  var bank = req.bank ;

  bank.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bank);
    }
  });
};

/**
 * List of Banks
 */
exports.list = function(req, res) { 
  Bank.find({userKey: req.params.userKey}).sort('-bankName').exec(function(err, banks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(banks);
    }
  });
};

/**
 * Bank middleware
 */
exports.bankByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bank is invalid'
    });
  }

  Bank.findById(id).populate('user', 'displayName').exec(function (err, bank) {
    if (err) {
      return next(err);
    } else if (!bank) {
      return res.status(404).send({
        message: 'No Bank with that identifier has been found'
      });
    }
    req.bank = bank;
    next();
  });
};
