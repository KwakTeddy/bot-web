'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bot = mongoose.model('Bot'),
  BotFile = mongoose.model('BotFile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  fs = require('fs');

/**
 * Create a bot
 */
exports.create = function (req, res) {
  var bot = new Bot(req.body);
  bot.user = req.user;

  var botFolder = config.chatServer + 'RAWDATA/' + bot.id;
  try {
    fs.statSync(botFolder);
  } catch(e) {
    try {
      fs.mkdirSync(botFolder);
    } catch(e) {
      return res.status(400).send({
        message: 'Create Directory Failed'
      });
    }
  }

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
  bot = _.extend(bot , req.body);

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

  var botFolder = config.chatServer + 'RAWDATA/' + bot.id;
  try {
    fs.rmdirSync(botFolder);
  } catch(e) {
    return res.status(400).send({
      message: 'Remove Directory Failed'
    });
  }

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



exports.createFile = function (req, res) {
  var bot = req.bot;
  var botFolder = config.chatServer + 'RAWDATA/' + bot.id + '/';
  fs.writeFile(botFolder + req.body.fileName, '# Created By ...', {flag: 'wx'}, function(err) {
    if(err) {
      res.status(400).send({
        message: 'File Already Exists'
      });
    } else {
      var botFile = new BotFile();
      botFile.bot = bot;
      botFile.name = req.body.fileName;
      botFile.user = req.user;
      botFile.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(botFile);
        }
      })
    }
  });

};
exports.removeFile = function (req, res) {

};
exports.renameFile = function (req, res) {

};
exports.editFile = function (req, res) {

};
exports.listFile = function (req, res) {
  BotFile.find({bot: req.bot._id}).populate('user', 'displayName').exec(function (err, files) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(files);
    }
  });
};
