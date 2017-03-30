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
  var TemplateData = getTemplateDataModel(req.template.dataSchema, req.body.listName);
  
  var _data;
  try {
    _data = JSON.parse(req.body._content);

    if(req.body.upTemplateId && req.body.upTemplateId != 'null') _data.upTemplateId = req.body.upTemplateId;
    else _data.templateId = req.body.templateId;

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


function createTemplateData(template, listName, content, user, callback) {
  var TemplateData = getTemplateDataModel(template.dataSchema, listName);

  var _data;
  try {
    _data = content;
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
  // var templateData = req.templateData ? JSON.stringify(req.templateData) : {};

  // templateData.isCurrentUserOwner = req.user && templateData.user && templateData.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(templateData);
};

// exports.readTemplateData = function(templateDataId, dataSchema, dataModel, callback) {
//   var TemplateData = getTemplateDataModel(dataSchema, dataModel);
//
//   TemplateData.findById(templateDataId).lean().populate('user').exec(function (err, templateData) {
//     callback(templateData, err);
//   });
// };

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var templateData= req.templateData ;

  var _data;
  try {
    _data = JSON.parse(req.body._content);

    if(req.body.upTemplateId && req.body.upTemplateId != 'null') _data.upTemplateId = req.body.upTemplateId;
    else _data.templateId = req.body.templateId;

  } catch(e) {
    console.log(e);
  }

  templateData = _.extend(templateData , _data);

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

// exports.deleteTemplateData = function(templateDataId, dataSchema, dataModel, callback) {
//   var TemplateData = getTemplateDataModel(dataSchema, dataModel);
//
//   TemplateData.remove({_id: templateDataId}, function(err) {
//     callback(err);
//   });
// };

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  var TemplateData = getTemplateDataModel(req.template.dataSchema, req.params.listName);

  var query = {};
  if(req.params.upTemplateId && req.params.upTemplateId != 'null') query.upTemplateId = req.params.upTemplateId;
  else query.templateId = req.template._id;

  TemplateData.find(query).sort('-created').populate('user', 'displayName').exec(function(err, templateDatas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(templateDatas);
    }
  });
};


// exports.listTemplateData = function(templateId, dataSchema, dataModel, callback) {
//   var TemplateData = getTemplateDataModel(dataSchema, dataModel);
//
//   TemplateData.find({templateId: templateId}).lean().sort('-created').populate('user').exec(function(err, templateDatas) {
//     callback(templateDatas, err);
//   });
// };

/**
 * Custom action middleware
 */
exports.templateDataByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  var TemplateData = getTemplateDataModel(req.template.dataSchema, req.params.listName);

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


function getTemplateDataModel(dataSchema, TemplateDataModelName) {
  var TemplateSchema;
  try {
    TemplateSchema= eval('TemplateSchema = '+ dataSchema);

    var keys = Object.keys(TemplateSchema);
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = TemplateSchema[key];

      var type;
      if(val.type) type = val.type;
      else type = val;

      if(type == 'String') {
        val.type = String;
      } else if(type == 'Number') {
        val.type = Number;
      } else if(type == 'Time') {
        val.type = String;
      } else if(type == 'Enum') {
        val.type = mongoose.Schema.Types.Mixed;
      } else if(type == 'Image') {
        val.type = String;
      } else if(type == 'List' && TemplateDataModelName == key) {
        return getTemplateDataModel(TemplateSchema[TemplateDataModelName].schema, TemplateSchema[TemplateDataModelName].model);
      } else if(type == 'List') {
        delete TemplateSchema[key];
        // TemplateSchema[key] == undefined;
      }
    }

    if(TemplateDataModelName && TemplateDataModelName != 'null') {
      TemplateSchema.upTemplateId = {type: mongoose.Schema.Types.Mixed};
    } else {
      TemplateSchema.templateId = {type: mongoose.Schema.ObjectId, ref: 'Template'};
    }
  } catch(e) {
    console.log(e);
  }

  if(TemplateDataModelName && TemplateDataModelName != 'null') {
    return mongoModule.getModel(TemplateDataModelName, TemplateSchema);
  } else {
    return mongoModule.getModel('TemplateData', TemplateSchema);
  }
}

exports.getTemplateDataModel = getTemplateDataModel;