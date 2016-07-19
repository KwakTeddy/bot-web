'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  BotUser = mongoose.model('BotUser'),
  Bank = mongoose.model('Bank'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bot user
 */
exports.create = function (req, res) {
  var botUser = null;
  if (!req.botUser) {
    botUser = new BotUser(req.body);
    // botUser.userKey = req.params.userKey;
  } else {
    botUser = req.botUser;
  }

  if (req.body.bank
    && req.body.account) {
    Bank.findOne({userKey: botUser.userKey, bankName: req.body.bank}).exec(function (err, b) {
      if (!err && b) {
        botUser.currentBank = b;
        botUser.currentAccount = req.body.account;
      }
      save();
    })
  } else {
    save();
  }

  function save() {
    botUser.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(botUser);
      }
    });
  }
};

/**
 * Show the current Bot user
 */
exports.read = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }
  // convert mongoose document to JSON
  var botUser = req.botUser ? req.botUser.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  botUser.isCurrentUserOwner = req.user && botUser.user && botUser.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(botUser);
};

/**
 * Update a Bot user
 */
exports.update = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var botUser = req.botUser;

  botUser = _.extend(botUser, req.body);

  botUser.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(botUser);
    }
  });
};

/**
 * Delete an Bot user
 */
exports.delete = function (req, res) {
  if (!req.botUser) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var botUser = req.botUser;

  botUser.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(botUser);
    }
  });
};

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  BotUser.find().sort('-created').populate('currentBank').exec(function (err, botUsers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(botUsers);
    }
  });
};

/**
 * Bot user middleware
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
exports.botUserByUserKey = function (req, res, next, userKey) {
  BotUser.findOne({userKey: userKey}).populate('currentBank').exec(function (err, botUser) {
    if (err) {
      return next(err);
    }

    req.botUser = botUser;
    next();
  });
};
