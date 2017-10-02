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

var mongoModule = require(path.resolve('modules/bot/action/common/mongo.js'));
var fs = require('fs');
var multer = require('multer');
var dialogsetModule = require(path.resolve('modules/bot/engine/dialogset/dialogset.js'));

var util = require('util'); // temporary

exports.lgfaq = function(req, res) {
  var model = mongoModule.getModel('lgfaqs');
  model.find({}).lean().exec(function(err, docs) {
    res.json(docs);
  });
};

exports.concepts = function(req, res) {
  var model = mongoModule.getModel('conceptlists');
  model.find({}).lean().exec(function(err, docs) {
    res.json(docs);
  });
};

exports.create = function (req, res) {
  var dialog = new DialogsetDialog(req.body);
  console.log(util.inspect(req.body))
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
  var sort = req.query.sort || 'created';
  var currentPage = null;
  var perPage = null;
  var query = {$and: []};

  if(req.params.dialogsetId) query.$and.push({dialogset : mongoose.Types.ObjectId(req.params.dialogsetId)});
  if(req.query.currentPage) currentPage = req.query.currentPage ;
  if(req.query.perPage) perPage = Number(req.query.perPage) ;

  if(req.query.inputRaw) query.$and.push({inputRaw : {$regex: req.query.inputRaw}});
  if(req.query.output) query.$and.push({output :{$regex: req.query.output}});
  if(req.query.category) query.$and.push({category : {$regex: req.query.category}});
  if(req.query.all){
    var searchQuery ={
      $or: [
        { inputRaw: {$regex: req.query.all}},
        { output: {$regex: req.query.all}},
        { category: {$regex: req.query.all}}
      ]
    };
    query.$and.push(searchQuery)

  }
  console.log(util.inspect(query));
  console.log(util.inspect(sort));
  DialogsetDialog.find(query).skip(currentPage*perPage).limit(perPage).lean().sort(sort).exec(function (err, dialogs) {
  // DialogsetDialog.aggregate([
  //   {$match: query},
  //   {$skip: currentPage*perPage},
  //   {$limit: perPage},
  //   {$group: {_id: {randomGroupId : "$randomGroupId", groupId: "$groupId"}, data: {$push: "$$ROOT"}}},
  //   {$group: {_id: "$_id.groupId", data: {$push: "$$ROOT"}}}
  //   ]).exec(function (err, dialogs) {
    if (err) {
      console.log(err);
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
