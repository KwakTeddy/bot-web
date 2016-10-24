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
 * Create a Bot user
 */
exports.create = function (req, res) {
  var userDialog = null;
  if (!req.userDialog) {
    userDialog = new UserDialog(req.body);
    // userDialog.userKey = req.params.userKey;
  } else {
    userDialog = req.userDialog;
  }

  if (req.body.bank
    && req.body.account) {
    Bank.findOne({userKey: userDialog.userKey, bankName: req.body.bank}).exec(function (err, b) {
      if (!err && b) {
        userDialog.currentBank = b;
        userDialog.currentAccount = req.body.account;
      }
      save();
    })
  } else {
    save();
  }

  function save() {
    userDialog.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(userDialog);
      }
    });
  }
};

/**
 * Show the current Bot user
 */
exports.read = function (req, res) {
  if (!req.userDialog) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }
  // convert mongoose document to JSON
  var userDialog = req.userDialog ? req.userDialog.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userDialog.isCurrentUserOwner = req.user && userDialog.user && userDialog.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(userDialog);
};

/**
 * Update a Bot user
 */
exports.update = function (req, res) {
  if (!req.userDialog) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var userDialog = req.userDialog;

  userDialog = _.extend(userDialog, req.body);

  userDialog.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userDialog);
    }
  });
};

/**
 * Delete an Bot user
 */
exports.delete = function (req, res) {
  if (!req.userDialog) {
    return res.status(404).send({
      message: 'No Bot user with that identifier has been found'
    });
  }

  var userDialog = req.userDialog;

  userDialog.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userDialog);
    }
  });
};

/**
 * List of Bot users
 */
exports.list = function (req, res) {
  UserDialog.find().sort('-created').populate('currentBank').exec(function (err, userDialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userDialogs);
    }
  });
};

/**
 * Bot user middleware
 */
exports.userDialogByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bot user is invalid'
    });
  }

  UserDialog.findById(id).populate('currentBank').exec(function (err, userDialog) {
    if (err) {
      return next(err);
    } else if (!userDialog) {
      return res.status(404).send({
        message: 'No Bot user with that identifier has been found'
      });
    }
    req.userDialog = userDialog;
    next();
  });
};
exports.userDialogByUserKey = function (req, res, next, userKey) {
  UserDialog.findOne({userKey: userKey}).populate('currentBank').exec(function (err, userDialog) {
    if (err) {
      return next(err);
    }

    req.userDialog = userDialog;
    next();
  });
};


function addDialog(inText, outText, isFail, context, callback) {
  var inQuery = {
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: true,
    fail: isFail,
    dialog: inText
  };

  var outQuery = {
    userId : context.user.userKey,
    channel: context.channel.name,
    inOut: false,
    fail: isFail,
    dialog: outText
  };


  UserDialog.create([inQuery, outQuery], function(err) {
    if(err) {}
    else {}

    callback();
  });
}

exports.addDialog = addDialog;

function getUserContext(task, context, callback) {
  UserDialog.findOne({userKey: task.userId}, function(err, doc) {
    if(doc == undefined) {
      UserDialog.create({userKey: task.userId, channel: task.channel, creaated: Date.now()}, function(err, _doc) {
        task.doc = _doc;
        callback(task, context);
      });
    } else {
      task.doc = doc;
      callback(task, context);
    }
  });
}

exports.getUserContext = getUserContext;

function updateUserContext(task, context, callback) {
  var update = {};
  for (var i = 0; i < task.updates.length; i++) {
    var key = task.updates[i];
    update[key] = task[key];
  }

  UserDialog.update({userKey: task.userId}, update, function(err, num) {
    callback(task, context);
  });
}

exports.updateUserContext = updateUserContext;

