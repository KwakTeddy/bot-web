'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Entity = mongoose.model('Entity'),
  EntityContent = mongoose.model('EntityContent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Entity
 */
exports.create = function(req, res) {
  var entity = new Entity(req.body);
  entity.user = req.user;

  entity.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entity);
    }
  });
};

/**
 * Show the current Entity
 */
exports.read = function(req, res) {
  console.log(3333);
  // convert mongoose document to JSON
  var entity = req.entity ? req.entity.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  entity.isCurrentUserOwner = req.user && entity.user && entity.user._id.toString() === req.user._id.toString();

  res.jsonp(entity);
};

/**
 * Update a Entity
 */
exports.update = function(req, res) {
  var entity = req.entity;

  entity = _.extend(entity, req.body);

  entity.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entity);
    }
  });
};

/**
 * Delete an Entity
 */
exports.delete = function(req, res) {
  var entity = req.entity;

  entity.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entity);
    }
  });
};

/**
 * List of Entities
 */
exports.list = function(req, res) {
  Entity.find().sort('-created').populate('user', 'displayName').exec(function(err, entities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entities);
    }
  });
};

/**
 * Entity middleware
 */
exports.entityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Entity is invalid'
    });
  }

  Entity.findById(id).populate('user', 'displayName').exec(function (err, entity) {
    if (err) {
      return next(err);
    } else if (!entity) {
      return res.status(404).send({
        message: 'No Entity with that identifier has been found'
      });
    }
    req.entity = entity;
    next();
  });
};

/**
 * List of EntityContent
 */
exports.contentList = function(req, res) {
  console.log(req.params.entityId);
  EntityContent.find({entity: req.params.entityId}).sort('-created').populate('user', 'entity').exec(function(err, entityContent) {
    console.log(err);
    console.log(entityContent.length);
    console.log(4444);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // if(!entityContent.length){
      //  return res.jsonp();
      // }
      console.log(entityContent);
      res.jsonp(entityContent);
    }
  });
};

/**
 * Create a EntityContent
 */
exports.contentCreate = function(req, res) {
  console.log('----------------')
  console.log(req.body);
  var entityContent = new EntityContent(req.body);
  entityContent.user = req.user;
  entityContent.entity = req.params.entityId;

  entityContent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entityContent);
    }
  });
};
