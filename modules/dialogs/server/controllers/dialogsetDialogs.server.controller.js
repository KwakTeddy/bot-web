'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Dialogset = mongoose.model('Dialogset'),
  DialogsetDialog = mongoose.model('DialogsetDialog'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var fs = require('fs');
var multer = require('multer');
var dialogsetModule = require(path.resolve('modules/bot/engine/dialogset/dialogset.js'));


exports.create = function (req, res) {
  var dialog = new DialogsetDialog(req.body);
  dialog.user = req.user;

  dialogsetModule.processInput(null, dialog.inputRaw, function(_input) {
    dialog.input = _input;

    console.log('createDialog:' + dialog.userBot);
    dialog.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(dialog);
      }
    });
  });
};

exports.read = function (req, res) {
  res.json(req.dialog);
};

exports.update = function (req, res) {
  var dialog = req.dialog;
  dialog = _.extend(dialog, req.body);

  dialog.user = req.user;
  dialog.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialog);
    }
  });
};

exports.delete = function (req, res) {
  var dialog = req.dialog;

  dialog.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialog);
    }
  });
};

exports.list = function (req, res) {
  var sort = req.query.sort || '-created';

  var query = {};
  if(req.params.dialogsetId) query['dialogset'] =  mongoose.Types.ObjectId(req.params.dialogsetId);

  DialogsetDialog.find(query).lean().sort(sort).populate('user').exec(function (err, dialogs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(dialogs);
    }
  });
};

exports.dialogsetDialogByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserBot is invalid'
    });
  }

  DialogsetDialog.findById(id).exec(function (err, dialog) {
    if (err) {
      return next(err);
    } else if (!dialog) {
      return res.status(404).send({
        message: 'No userBot with that identifier has been found'
      });
    }
    req.dialog = dialog;
    next();
  });
};
