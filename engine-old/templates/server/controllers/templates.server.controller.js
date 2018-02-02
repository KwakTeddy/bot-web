'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Template = mongoose.model('Template'),
  TemplateCategory = mongoose.model('TemplateCategory'),
  errorHandler = require(path.resolve('./engine2/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var template = new Template(req.body);
  template.user = req.user;
  TemplateCategory.findOne({name: req.body.category.name}, function (err, data) {
    if (!data){
      var templateCategory = new TemplateCategory({name: req.body.category.name});
      templateCategory.save(function (err) {
        if (err){
          console.log(err)
        }else {
          template.category = templateCategory;
          template.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: err.stack || err
              });
            } else {
              res.jsonp(template);
            }
          });
        }
      })
    }else {
      template.category = data;
      template.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: err.stack || err
          });
        } else {
          res.jsonp(template);
        }
      });
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var template = req.template ? req.template.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  template.isCurrentUserOwner = req.user && template.user && template.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(template);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var template = req.template ;
  if (!req.template.category){
    TemplateCategory.findOne({name: req.body.category.name}, function (err, data) {
      if(err){
        console.log(err)
      }else {
        if(!data){
          var templateCategory = new TemplateCategory({name: req.body.category.name});
          templateCategory.save(function (err) {
            if (err){
              console.log(err)
            }else {
              req.template.category = templateCategory;
              req.body.category = templateCategory;
              template = _.extend(template , req.body);
              template.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: err.stack || err
                  });
                } else {
                  res.jsonp(template);
                }
              });
            }
          })
        }else {
          req.template.category = data;
          req.body.category = data;
          template = _.extend(template , req.body);
          template.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: err.stack || err
              });
            } else {
              res.jsonp(template);
            }
          });
        }
      }
    })

  }else {
    TemplateCategory.findOne({name: req.body.category.name}, function (err, data) {
      if(err){
        console.log(err)
      }else {
        if(!data){
          var templateCategory = new TemplateCategory({name: req.body.category.name});
          templateCategory.save(function (err) {
            if (err){
              console.log(err)
            }else {
              req.body.category = templateCategory;
              template = _.extend(template , req.body);
              template.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: err.stack || err
                  });
                } else {
                  res.jsonp(template);
                }
              });
            }
          })
        }else {
          req.body.category = data;
          template = _.extend(template , req.body);
          template.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: err.stack || err
              });
            } else {
              res.jsonp(template);
            }
          });
        }
      }
    })
  }
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var template = req.template ;

  template.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(template);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  Template.find().sort('-created').populate('user', 'displayName').populate('category').exec(function(err, templates) {
    if (err) {
      return res.status(400).send({
        message: err.stack || err
      });
    } else {
      res.jsonp(templates);
    }
  });
};

/**
 * Custom action middleware
 */
exports.templateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Template.findById(id).populate('user', 'displayName').populate('category').exec(function (err, template) {
    if (err) {
      return next(err);
    } else if (!template) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.template = template;
    next();
  });
};
