'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Entity = mongoose.model('Entity'),
  EntityContent = mongoose.model('EntityContent'),
  EntityContent = mongoose.model('EntityContent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var util = require('util'); //temporary

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  console.log(req.body.botName);
  console.log('----------------------------');
  console.log(util.inspect(req.body.content));

  var query = {botId: req.body.botName, user: req.user._id, name: req.body.name};
  Entity.findOne(query, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: err
      });
    } else {
      if (!result){
        if (req.body.content){
          var entity = new Entity();
          entity.botId = req.body.botName;
          entity.name = req.body.name;
          entity.user = req.user;
          entity.save(function (err) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                message: err
              });
            } else {
              for(var i = 0; i < req.body.content.length; i++){
                req.body.content[i]['entityId'] = entity._id ;
                req.body.content[i]['botId'] = req.body.botName;
                req.body.content[i]['user'] = req.user._id;
              }
              EntityContent.collection.insert(req.body.content, function (err, result) {
                if(err){
                  console.log(util.inspect(err))
                }else {
                  res.jsonp(entity);
                }
              })
            }
          });
        }else {
          res.status(400).send({
            message: '적어도 하나의 엔터티 내용을 입력해주세요'
          })
        }
      }else {
        return res.status(400).send({
          message:  '\'' + req.body.name + '\'' +' 이름의 엔터티가 존재합니다. 다른 이름으로 생성해주세요'
        });
      }
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

  if (req.user && entity.user && (String(req.user._id) == String(entity.user._id)) && (req.entity.botId == req.params.botName)) {
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
  }else {
    return res.end();
  }
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var entity = req.entity ;
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
 * Update a Custom action
 */
exports.updateContent = function(req, res) {
  EntityContent.findOne({name: req.body.name, botId: req.body.botId, _id: {$ne: req.body._id}}).exec(function (error, result) {
    console.log(util.inspect(result));
    if (error){
      console.log(error)
    }else {
      if (result){
        return res.status(400).send({
          message : '동일한 이름의 엔터티가 존재합니다'
        })
      }else {
        EntityContent.findOne({_id: req.body._id}).exec(function (err, data) {
          if (err){
            console.log(err)
          }else {
            data.name = req.body.name;
            data.syn = req.body.syn;
            data.save(function (err) {
              if (err){
                console.log(err)
              }else {
                res.end();
              }
            })
          }
        })
      }
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
  Entity.find({botId: req.params.botName}).sort('-created').populate('user', 'displayName').exec(function(err, entitys) {
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
        entityContent.botId = req.body.botId;
        entityContent.user = req.user;
        entityContent.entityId = req.body.entityId;
        entityContent.syn = [];
        entityContent.syn.push(req.body.content);
        entityContent.save(function (err, data) {
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
