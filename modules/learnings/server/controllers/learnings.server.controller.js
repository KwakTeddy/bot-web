'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Learning = mongoose.model('Learning'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a learning
 */
exports.create = function (req, res) {
  var learning = new Learning(req.body);
  learning.user = req.user;

  learning.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(learning);
    }
  });
};

/**
 * Show the current learning
 */
exports.read = function (req, res) {
  res.json(req.learning);
};

/**
 * Update a learning
 */
exports.update = function (req, res) {
  var learning = req.learning;

  learning.title = req.body.title;
  learning.content = req.body.content;

  learning.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(learning);
    }
  });
};

/**
 * Delete an learning
 */
exports.delete = function (req, res) {
  var learning = req.learning;

  learning.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(learning);
    }
  });
};

/**
 * List of Learnings
 */
exports.list = function (req, res) {
  Learning.find().sort('-created').populate('user').exec(function (err, learnings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(learnings);
    }
  });
};

/**
 * Learning middleware
 */
exports.learningByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Learning is invalid'
    });
  }

  Learning.findById(id).populate('user', 'displayName').exec(function (err, learning) {
    if (err) {
      return next(err);
    } else if (!learning) {
      return res.status(404).send({
        message: 'No learning with that identifier has been found'
      });
    }
    req.learning = learning;
    next();
  });
};
