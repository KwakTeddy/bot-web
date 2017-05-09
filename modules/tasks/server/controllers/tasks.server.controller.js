'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  TaskEntity = mongoose.model('TaskEntity'),
  Entity = mongoose.model('Entity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  botLib = require(path.resolve('config/lib/bot'));


var util = require('util'); //temporary

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  console.log(util.inspect(req.body));
  console.log(util.inspect('------------------------'));
  var task = new Task(req.body.task);
  task.user = req.user;
  task.open = true;
  if(req.body.task.paramDefs){
    task.entity = req.body.task.paramDefs;
  }
  // if (req.body.task.paramDefs){
  //   Entity.find()
  //  var taskEntity= new TaskEntity();
  //  taskEntity.entityId =
  //  taskEntity.taskId = task._id
  //  taskEntity.use = true;
  //  taskEntity.save(function (err) {
  //    if (err) {
  //      console.log(err);
  //      return res.status(400).send({message: err});
  //    } else {
  //      res.jsonp(task);
  //    }
  //  })
  // }

  task.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({message: err});
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  console.log('---------------------====');
  console.log(util.inspect(req.params));
  console.log(util.inspect(req.body));
  var taskList = global._bots['athena'].tasks;
  var task = taskList[req.params.name];
  res.jsonp(task);
  // Task.findOne({name: req.params.name}).exec(function (err, result) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(400).send({message: err});
  //   } else {
  //
  //
  //     res.jsonp(result);
  //   }
  // });
  //
  // var test = global._bots['athena'].tasks[req.params.name];
  // console.log(util.inspect(test));
  // res.jsonp(test);

  // convert mongoose document to JSON
  // var task = req.task ? req.task.toJSON() : {};
  // console.log(util.inspect(task));
  //
  // // Add a custom field to the Article, for determining if the current User is the "owner".
  // // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // task.isCurrentUserOwner = req.user && task.user && task.user._id.toString() === req.user._id.toString() ? true : false;
  //
  // TaskContent.find({taskId: task._id}, function (err, result) {
  //   if(err){
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   }else {
  //     console.log(JSON.stringify(result));
  //     task.content = result;
  //     console.log(util.inspect(task));
  //     res.jsonp(task);
  //   }
  // });
  // res.jsonp(task);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {

  // var task = req.task ;
  console.log(util.inspect(req.body));
  console.log('=-=-===--.................');
  // task = _.extend(task , req.body);
  Task.findOne({name: req.body.name}, function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(!data){
        res.end();
      }else {
        data = _.extend(data, req.body);
        data.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(data);
          }
        });
      }
    }
  });
  //
  // task.save(function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(task);
  //   }
  // });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var task = req.task ;

  task.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(task);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) {

  if (!global._bot && global._bots[req.bot.id]){
    var taskList = global._bots[req.bot.id].tasks;
    taskList = [taskList];
    res.jsonp(taskList);
  }else {
    botLib.loadBot(req.bot.id, function () {
      var taskList = global._bots[req.bot.id].tasks;
      taskList = [taskList];
      res.jsonp(taskList);
    });
  }
};

/**
 * Custom action middleware
 */
exports.taskByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  Task.findById(id).populate('user', 'displayName').exec(function (err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};

/**
 * Create a Custom action
 */
exports.contentCreate = function(req, res) {
  console.log(req.body.content);
  console.log('-----------------');
  TaskContent.find({user: req.user._id, taskId: req.body.taskId, name: req.body.content}).exec(function (err, data) {
    console.log(err);
    console.log(data);
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }else {
      if(!data.length){
        var taskContent = new TaskContent();
        taskContent.name = req.body.content;
        taskContent.user = req.user;
        taskContent.taskId = req.body.taskId;
        taskContent.save(function (err, data) {
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
  TaskContent.remove({_id: req.query.contentId}, function (err, data) {
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


/**
 * List of Custom actions
 */
exports.openList = function(req, res) {
  Task.find({}).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tasks);
    }
  });

};

/**
 * Show the current Custom action
 */
exports.openRead = function(req, res) {
  console.log('opencustest');
  console.log(util.inspect(req.params));
  console.log(util.inspect(req.body));
  Task.findOne({name: req.params.name}).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send({message: err});
    } else {
      res.jsonp(result);
    }
  });
};
