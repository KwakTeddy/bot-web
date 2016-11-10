'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserDialog = mongoose.model('UserDialog'),
  Bank = mongoose.model('Bank'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  UserDialog.find({userId: req.params.userKey}).sort('+created').exec(function (err, userDialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userDialogs);
    }
  });
};

