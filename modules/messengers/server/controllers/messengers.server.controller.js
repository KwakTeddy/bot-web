'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Messenger = mongoose.model('Messenger'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a messenger
 */
exports.create = function (req, res) {
  var messenger = new Messenger(req.body);
  messenger.user = req.user;

  messenger.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(messenger);
    }
  });
};

/**
 * Show the current messenger
 */
exports.read = function (req, res) {
  res.json(req.messenger);
};

/**
 * Update a messenger
 */
exports.update = function (req, res) {
  var messenger = req.messenger;

  messenger.title = req.body.title;
  messenger.content = req.body.content;

  messenger.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(messenger);
    }
  });
};

/**
 * Delete an messenger
 */
exports.delete = function (req, res) {
  var messenger = req.messenger;

  messenger.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(messenger);
    }
  });
};

/**
 * List of Messengers
 */
exports.list = function (req, res) {
  Messenger.find().sort('-created').populate('user').exec(function (err, messengers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(messengers);
    }
  });
};

/**
 * Messenger middleware
 */
exports.messengerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Messenger is invalid'
    });
  }

  Messenger.findById(id).populate('user', 'displayName').exec(function (err, messenger) {
    if (err) {
      return next(err);
    } else if (!messenger) {
      return res.status(404).send({
        message: 'No messenger with that identifier has been found'
      });
    }
    req.messenger = messenger;
    next();
  });
};
