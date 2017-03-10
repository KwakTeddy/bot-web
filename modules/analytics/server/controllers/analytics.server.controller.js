'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser'),
  UserDialogLog = mongoose.model('UserDialogLog'),
  UserDialog = mongoose.model('UserDialog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * List of User count
 */
exports.list = function (req, res) {
  UserDialogLog.aggregate(
    [
      {$match: {year: 2017, month: 3}},
      {$group: {_id: {year: '$year', month: '$month', date: '$date'}, date: {$first: '$date'}, count: {$sum: 1}}},
      {$sort: {date: 1}},
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(userCounts);
      res.jsonp(userCounts);
    }
  });
};

exports.dialogList = function (req, res) {
  UserDialog.aggregate(
    [
      {$project:{year: { $year: "$created" }, month: { $month: "$created" },day: { $dayOfMonth: "$created" }, inOut: '$inOut', dialog: '$dialog'}},
      {$match: {year:  2017, month: 3, inOut: true}},
      {$group: {_id: '$dialog', count: {$sum: 1}}},
      {$sort: {count: -1}}
    ]
  ).exec(function (err, userCounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(userCounts);
      res.jsonp(userCounts);
    }
  });
};
/**
 * Analytics middleware
 */
exports.botUserByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot user is invalid'
    });
  }

  BotUser.findById(id).populate('currentBank').exec(function (err, botUser) {
    if (err) {
      return next(err);
    } else if (!botUser) {
      return res.status(404).send({
        message: 'No Bot user with that identifier has been found'
      });
    }
    req.botUser = botUser;
    next();
  });
};


