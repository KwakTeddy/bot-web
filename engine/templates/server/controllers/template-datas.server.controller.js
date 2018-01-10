'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash');
  var mongoModule = require(path.resolve('./engine/bot/action/common/mongo'));

var util = require('util');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  createTemplateData(req.template, req.body.listName, req.body.upTemplateId, req.body._content, req.user, function(templateData, err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(templateData);
    }
  });
};

function createTemplateData(template, listName, upTemplateId, content, user, callback) {
  var TemplateData = getTemplateDataModel(template.dataSchema, listName);
  if (upTemplateId && upTemplateId != 'null') {
    upTemplateId = mongoose.Types.ObjectId(upTemplateId);
  }
  var _data;
  try {
    _data = JSON.parse(content);

    if(upTemplateId && upTemplateId != 'null') _data.upTemplateId = upTemplateId;
    else _data.templateId = template._id;

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

function readTemplateData(templateDataId, dataSchema, dataModel, callback) {
  var TemplateData = getTemplateDataModel(dataSchema, dataModel);

  TemplateData.findById(templateDataId).lean().populate('user').exec(function (err, templateData) {
    callback(templateData, err);
  });
}

exports.readTemplateData = readTemplateData;

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  updateTemplateData(req.templateData, req.body.templateId, req.body.listName, req.body.upTemplateId, req.body._content, req.user,
    function(templateData, err) {
      if (err) {
        return res.status(400).send({
          message: err.stack || err
        });
      } else {
        res.jsonp(templateData);
      }
  }, req.params);
};

function updateTemplateData(templateData, templateId, listName, upTemplateId, _content, user, callback, params) {
  var TemplateDataModel = mongoose.model('TemplateMenu');
  var _data;
  upTemplateId = mongoose.Types.ObjectId(upTemplateId);
  try {
    _data = JSON.parse(_content);

    if(upTemplateId && upTemplateId != 'null') _data.upTemplateId = upTemplateId;
    else _data.templateId = templateId;
  } catch(e) {
    console.log(e);
  }

  templateData = _.extend(templateData , _data);
  templateData._doc = _.extend(templateData._doc , _data);
  templateData.user = user;
  var keys = Object.keys(_data);
  keys.forEach(function (key) {
    templateData.markModified(key);
  });

  templateData.save(function(err) {
    callback(templateData, err);
  });
}

exports.updateTemplateData = updateTemplateData;

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var templateData = req.templateData ;

  templateData.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(templateData);
    }
  });
};

exports.deleteTemplateData = function(templateDataId, dataSchema, listName, callback) {
  var TemplateData = getTemplateDataModel(dataSchema, listName);

  TemplateData.remove({_id: templateDataId}, function(err) {
    callback(err);
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {
  var upTemplateObjectId = mongoose.Types.ObjectId(req.params.upTemplateId);
  listTemplateData(req.template, req.params.listName, upTemplateObjectId, function(templateDatas, err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      return res.jsonp(templateDatas);
    }
  }, req.query);
};


function listTemplateData(template, listName, upTemplateId, callback, reqQuery) {
  var TemplateData = getTemplateDataModel(template.dataSchema, listName);

  var query = {};
  var sort = {};
  if(upTemplateId && upTemplateId != 'null') query.upTemplateId = upTemplateId;
  else                                       query.templateId = template._id;
  if(reqQuery && reqQuery.sortCol && reqQuery.sortDir) sort[reqQuery.sortCol] = reqQuery.sortDir;
  if(reqQuery && reqQuery.search) {
    query = {$and: [
      query,
      {$or:[]}
    ]};
    console.log(util.inspect(TemplateData));
    var keys = Object.keys(TemplateData.schema.paths);
    keys.forEach(function (key) {
      if((TemplateData.schema.paths[key].instance == "String") && (TemplateData.schema.paths[key].path != "image") && (key.substring(0, 1) != '_')){
        var obj = {};
        obj[key] = new RegExp(reqQuery.search);
        query.$and[1].$or.push(obj)
      }
    });
  };

  console.log(util.inspect(query, {showHidden: false, depth: null}));
  TemplateData.find(query).sort(sort).populate('user', 'displayName').exec(function(err, templateDatas) {
    if(err) console.log(err);
    else {
      callback(templateDatas, err);
    }
  });
};

exports.listTemplateData = listTemplateData;

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

function getTemplateLists(dataSchema) {
  var TemplateSchema;
  try {
    TemplateSchema= eval('TemplateSchema = '+ dataSchema);
    var keys = Object.keys(TemplateSchema);
    var lists = [];
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = TemplateSchema[key];
      var type;
      if (val.type) type = val.type;
      else type = val;

      if (type == 'List') {
        lists.push(key);
      }
    }
  } catch(e) {
    console.log(e);
  }
  return lists;
}

exports.getTemplateLists = getTemplateLists;

function getTemplateDataModel(dataSchema, TemplateDataModelName) {
  var TemplateSchema;
  try {
    if(typeof dataSchema == "string") TemplateSchema= eval('TemplateSchema = '+ dataSchema);
    else                              TemplateSchema= dataSchema;


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
    // return getModel(TemplateDataModelName, TemplateSchema);
    // return mongoModule.getModel(TemplateDataModelName);
    return mongoModule.getModel(TemplateDataModelName, TemplateSchema, {strict : false});
  } else {
    // return getModel(TemplateDataModelName, TemplateSchema);
    return mongoModule.getModel('TemplateData');
  }
}

exports.getTemplateDataModel = getTemplateDataModel;
