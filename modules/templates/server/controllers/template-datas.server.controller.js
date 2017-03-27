'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
  var mongoModule = require(path.resolve('./modules/bot/action/common/mongo'));

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var TemplateData = getTemplateDataModel(req.template.dataSchema);
  
  var _data;
  try {
    _data = JSON.parse(req.body._content);
    _data.templateId = req.body.templateId;
  } catch(e) {
    console.log(e);
  }
  var templateData = new TemplateData(_data);
  templateData.user = req.user;

  templateData.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templateData);
    }
  });
};


function createTemplateData(template, content, user, callback) {
  var TemplateData = getTemplateDataModel(template.dataSchema);

  var _data;
  try {
    _data = JSON.parse(content);
    _data.templateId = template._id;
  } catch(e) {
    console.log(e);
  }
  var templateData = new TemplateData(_data);
  templateData.user = user;

  templateData.save(function(err) {
    callback(templateData, err);
  });
}

exports.createTemplateData = createTemplateData;

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var templateData = req.templateData ? req.templateData.toJSON() : {};

  templateData.isCurrentUserOwner = req.user && templateData.user && templateData.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(templateData);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var templateData = req.templateData ;

  templateData = _.extend(templateData, req.body);

  templateData.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templateData);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var templateData = req.templateData ;

  templateData.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templateData);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  var TemplateData = getTemplateDataModel(req.template.dataSchema);

  TemplateData.find().sort('-created').populate('user', 'displayName').exec(function(err, templateDatas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templateDatas);
    }
  });
};

/**
 * Custom action middleware
 */
exports.templateDataByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  var TemplateData = getTemplateDataModel(req.template.dataSchema);

  TemplateData.findById(id).populate('user', 'displayName').exec(function (err, templateData) {
    if (err) {
      return next(err);
    } else if (!templateData) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.templateData = templateData;
    next();
  });
};


function getTemplateDataModel(dataSchema) {
  var TemplateSchema;
  try {
    TemplateSchema= eval('TemplateSchema = '+ dataSchema);
    TemplateSchema.templateId = {type: mongoose.Schema.ObjectId, ref: 'Template'};
  } catch(e) {
    console.log(e);
  }
  return mongoModule.getModel('TemplateData', TemplateSchema);
}

exports.getTemplateDataModel = getTemplateDataModel;