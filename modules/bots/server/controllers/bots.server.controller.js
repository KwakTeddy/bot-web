'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a bot
 */
exports.create = function (req, res) {
  var bot = new Bot(req.body);
  bot.user = req.user;

  bot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bot);
    }
  });
};

/**
 * Show the current bot
 */
exports.read = function (req, res) {
  res.json(req.bot);
};

/**
 * Update a bot
 */
exports.update = function (req, res) {
  var bot = req.bot;

  bot.title = req.body.title;
  bot.content = req.body.content;

  bot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bot);
    }
  });
};

/**
 * Delete an bot
 */
exports.delete = function (req, res) {
  var bot = req.bot;

  bot.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bot);
    }
  });
};

/**
 * List of Bots
 */
exports.list = function (req, res) {
  Bot.find().sort('-created').populate('user').exec(function (err, bots) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bots);
    }
  });
};

/**
 * Bot middleware
 */
exports.botByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot is invalid'
    });
  }

  Bot.findById(id).populate('user', 'displayName').exec(function (err, bot) {
    if (err) {
      return next(err);
    } else if (!bot) {
      return res.status(404).send({
        message: 'No bot with that identifier has been found'
      });
    }
    req.bot = bot;
    next();
  });
};
