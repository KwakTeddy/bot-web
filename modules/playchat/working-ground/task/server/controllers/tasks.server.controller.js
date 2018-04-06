'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var mongoose = require('mongoose');
var _ = require('lodash');

var Task = mongoose.model('Task');
var TaskEntity = mongoose.model('TaskEntity');

var utils = require(path.resolve('./engine2/utils/utils.js'));

var fs = require('fs');


var Globals = require(path.resolve('./engine2/globals.js'));


exports.findTotalPage = function(req, res)
{
    var countPerPage = req.query.countPerPage || 10;

    var query = { bots: req.params.botId, user: req.user._id };
    if(req.query.templateId)
    {
        delete query.botId;
        query.templateId = req.query.templateId;
    }

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Task.find(query).count(function(err, count)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp({ totalPage: Math.ceil(count / countPerPage) });
        }
    });
};

exports.find = function(req, res)
{
    var page = req.query.page || 1;
    var countPerPage = parseInt(req.query.countPerPage) || 10;

    var query = { bots: req.params.botId, user: req.user._id };
    if(req.query.templateId)
    {
        delete query.botId;
        query.templateId = req.query.templateId;
    }

    if(req.query.name)
        query.name = { "$regex": req.query.name, "$options": 'i' };

    Task.find(query).sort('-created').populate('user', 'displayName').skip(countPerPage*(page-1)).limit(countPerPage).exec(function(err, dialogsets)
    {
        if (err)
        {
            return res.status(400).send({ message: err.stack || err });
        }
        else
        {
            res.jsonp(dialogsets);
        }
    });
};

exports.findTaskFiles = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId);
    if(req.query.templateId)
    {
        filePath = path.resolve('./templates/' + req.query.templateId + '/bot');
    }

    if(!fs.existsSync(filePath))
    {
        return res.jsonp([]);
    }

    fs.readdir(filePath, function(err, list)
    {
        if (err)
        {
            return res.status(400).send({message: err.stack || err});
        }

        var result = [];
        for (var i = 0, l = list.length; i < l; i++)
        {
            if (list[i].endsWith('.graph.js') || list[i].endsWith('.bot.js') || list[i].endsWith('.test.js') || !list[i].endsWith('.js'))
            {
                continue;
            }

            result.push(list[i]);
        }

        res.jsonp(result);
    });
};

exports.findTasks = function(req, res)
{
    var filePath = path.resolve('./custom_modules/' + req.params.botId);
    if(req.query.templateId)
    {
        filePath = path.resolve('./templates/' + req.query.templateId + '/bot');
    }

    if(!fs.existsSync(filePath))
    {
        return res.jsonp([]);
    }

    fs.readdir(filePath, function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        var result = [];
        for(var i=0; i<list.length; i++)
        {
            if(list[i].endsWith('.graph.js') || list[i].endsWith('.bot.js') || list[i].endsWith('.test.js') || !list[i].endsWith('.js'))
            {
                continue;
            }

            result.push(list[i]);
        }

        var tasks = [];
        for(var i=0; i<result.length; i++)
        {
            (function(index)
            {
                var bot = {};
                bot.setTask = function(name)
                {
                    tasks.push({ fileName: result[index], name: name });
                };

                bot.setType = function()
                {

                };

                bot.setQuibbles = function()
                {

                };

                utils.requireNoCache(filePath + '/' + result[i], true)(bot);
            })(i);
            // var content = fs.readFileSync(filePath + '/' + result[i]);
            // if(content)
            // {
            //     content = content.toString();
            //
            //     var match = content.match(/bot.setTask\([^,]*,/gi);
            //     if(match)
            //     {
            //         for(var j=0; j<match.length; j++)
            //         {
            //             var name = match[j].replace('bot.setTask(', '').replace(',', '').replace(/"/gi, '').replace(/'/gi, '');
            //             if(tasks.indexOf(name) == -1)
            //                 tasks.push({ fileName: result[i], name: name });
            //         }
            //     }
            // }
        }

        res.jsonp(tasks);
    });
};

exports.findTypes = function(req, res)
{
    var types = [];

    for(var key in Globals.types)
    {
        types.push({ fileName: '', name: Globals.types[key].name });
    }

    var filePath = path.resolve('./custom_modules/' + req.params.botId);
    if(req.query.templateId)
    {
        filePath = path.resolve('./templates/' + req.query.templateId + '/bot');
    }

    fs.readdir(filePath, function(err, list)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        var result = [];
        for(var i=0, l=list.length; i<l; i++)
        {
            if(list[i].endsWith('.graph.js') || list[i].endsWith('.bot.js') || list[i].endsWith('.test.js') || !list[i].endsWith('.js'))
            {
                continue;
            }

            result.push(list[i]);
        }

        // var types = [];
        for(var i=0, l=result.length; i<l; i++)
        {
            var content = fs.readFileSync(filePath + '/' + result[i]);
            if(content)
            {
                content = content.toString();

                var match = content.match(/bot.setType\([^,]*,/gi);
                if(match)
                {
                    for(var j=0; j<match.length; j++)
                    {
                        var name = match[j].replace('bot.setType(', '').replace(',', '').replace(/"/gi, '').replace(/'/gi, '');
                        if(types.indexOf(name) == -1)
                            types.push({ fileName: result[i], name: name });
                    }
                }
            }
        }

        res.jsonp(types);
    });
};

exports.readTask = function(req, res)
{
    var fileName = req.params.fileName;
    var taskName = req.params.taskName;

    if(!fileName.endsWith('.js'))
        fileName += '.js';

    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + (fileName ? fileName : 'default.js'));
    if(req.query.templateId)
    {
        filePath = path.resolve('./templates/' + req.query.templateId + '/bot/' + (fileName ? fileName : 'default.js'));
    }

    var content = '';
    if(fs.existsSync(filePath))
    {
        content = fs.readFileSync(filePath).toString();

        // var sdf2 = {
        //     name: 'sdf2',
        //     action: function(task, context, callback) {
        //         callback(task, context);
        //     }
        // };
        // bot.setTask('sdf2', sdf2);

        var start = content.indexOf('var ' + taskName);
        var end = content.indexOf('bot.setTask', start);

        content = content.substring(start, end);

        start = content.indexOf('{');
        end = content.lastIndexOf('}');

        content = content.substring(start + 1, end);

        start = content.indexOf('{');
        end = content.lastIndexOf('}');

        content = content.substring(start + 1, end);

        res.jsonp({ content : content });

        // var match = content.match(new RegExp('var ' + taskName + '[^}]*}', 'gi'));
        // if(match && match.length == 1)
        // {
        //     var start = match[0].indexOf('action:');
        //     var end = match[0].indexOf('callback(task, context);');
        //
        //     match = match[0].substring(start, end);
        //     console.log('매치 : ', match);
        //
        //     match = match.split('function(task')[1];
        //
        //     console.log('매치 : ', match);
        //     match = match.replace(/\([^{]*{/g, '');
        //
        //     res.jsonp({ content: (match + '\r\n callback(task, context);').trim() });
        //     // match = match[0].match(new RegExp('function(task, context, callback)[^}]*}', 'gi'));
        //     //
        //     // console.log(match);
        //     // res.jsonp({ content : match[0].replace('function(task, context, callback) {', '') });
        // }
        // else
        // {
        //     res.status(404).end();
        // }
    }
    else
    {
        res.status(404).end();
    }
};

exports.saveTaskToFile = function(req, res)
{
    var fileName = req.body.fileName;

    if(!fileName.endsWith('.js'))
        fileName += '.js';

    var filePath = path.resolve('./custom_modules/' + req.params.botId + '/' + (fileName ? fileName : 'default.js'));
    if(req.body.templateId)
    {
        filePath = path.resolve('./templates/' + req.query.templateId + '/bot/' + (fileName ? fileName : 'default.js'));
    }

    var content = '';
    if(fs.existsSync(filePath))
    {
        content = fs.readFileSync(filePath).toString();
        content += '\r\n\r\n';
    }
    else
    {
        content = "var path = require('path');\r\n";
        content += "var bot = require(path.resolve('./engine2/bot.js')).getBot('" + req.params.botId + "');\r\n\r\n";
    }

    if(!req.body.editMode && content.indexOf('var ' + req.body.name) != -1)
    {
        return res.status(400).send({ message: 'Duplicated task name'});
    }

    if(req.body.content)
        content += req.body.content;

    fs.writeFile(filePath, content, function(err)
    {
        if(err)
        {
            return res.status(400).send({ message: err.stack || err });
        }

        res.end();
    });
};

/**
 * Create a Custom action
 */
exports.create = function(req, res)
{
    var task = new Task(req.body.task);
    task.user = req.user;
    task.open = true;

    task.save(function(err)
    {
        if (err)
        {
            console.log(err);
            return res.status(400).send({message: err});
        }
        else
        {
            res.jsonp(task);
        }
    });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  console.log('---------------------====');
  var taskList = global._bots[req.params.botNameId].tasks;
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
  Task.findOne({name: req.params.name}).exec(function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send({message: err});
    } else {
      res.jsonp(result);
    }
  });
};
