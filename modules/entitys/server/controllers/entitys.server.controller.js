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

var util = require('util'); //temporary

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var entity = new Entity(req.body);
  entity.user = req.user;

  var entityContent = new EntityContent();
  entityContent.user = req.user;
  entityContent.entityId = entity._id;
  entityContent.name = req.query.content;

  entity.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: err
      });
    } else {
      entityContent.save(function (err) {
        console.log(err);
        if (err) {
          console.log(err);
          return res.status(400).send({
            message: err
          });
        }else {
          console.log(entity);
          res.jsonp(entity);
        }
      })
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var entity = req.entity ? req.entity.toJSON() : {};
  console.log(util.inspect(entity));

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  entity.isCurrentUserOwner = req.user && entity.user && entity.user._id.toString() === req.user._id.toString() ? true : false;

  EntityContent.find({entityId: entity._id}, function (err, result) {
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      console.log(JSON.stringify(result));
      entity.content = result;
      console.log(util.inspect(entity));
      res.jsonp(entity);
    }
  });
  // res.jsonp(entity);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var entity = req.entity ;
  console.log(util.inspect(entity));
  console.log(util.inspect(req.body));
  entity = _.extend(entity , req.body);

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
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var entity = req.entity ;

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
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Entity.find().sort('-created').populate('user', 'displayName').exec(function(err, entitys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entitys);
    }
  });
};

/**
 * Custom action middleware
 */
exports.entityByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Entity.findById(id).populate('user', 'displayName').exec(function (err, entity) {
    if (err) {
      return next(err);
    } else if (!entity) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.entity = entity;
    next();
  });
};

/**
 * Create a Custom action
 */
exports.contentCreate = function(req, res) {
  console.log(req.body.content);
  console.log('-----------------');
  EntityContent.find({user: req.user._id, entityId: req.body.entityId, name: req.body.content}).exec(function (err, data) {
    console.log(err);
    console.log(data);
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(!data.length){
        var entityContent = new EntityContent();
        entityContent.name = req.body.content;
        entityContent.user = req.user;
        entityContent.entityId = req.body.entityId;
        entityContent.save(function (err, data) {
          console.log(err);
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }else {
            console.log(data);
            res.json(data);
          }
        });
      }else {
        return res.status(400).send({
          message: '동일한 내용이 존재합니다.'
        });
      }
    }
  })

};


/**
 * Delete an Custom action
 */
exports.contentDelete = function(req, res) {
  EntityContent.remove({_id: req.query.contentId}, function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(data);
      console.log('--------------')
      res.jsonp(data);
    }
  })
};
