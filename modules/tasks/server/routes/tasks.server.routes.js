'use strict';

/**
 * Module dependencies
 */
var tasksPolicy = require('../policies/tasks.server.policy'),
  tasks = require('../controllers/tasks.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/tasks')//.all(tasksPolicy.isAllowed)
    .get(tasks.list)
    .post(tasks.create)
    .put(tasks.update);

  app.route('/api/tasks/:name')//.all(tasksPolicy.isAllowed)
    .get(tasks.read)
    .put(tasks.update)
    .delete(tasks.delete);

  // Custom actions Routes
  app.route('/api/openTasks')//.all(tasksPolicy.isAllowed)
    .get(tasks.openList)
    .post(tasks.contentCreate)
    .delete(tasks.contentDelete);

  app.route('/api/openTasks/:name')//.all(tasksPolicy.isAllowed)
    .get(tasks.openRead)
    .put(tasks.update)
    .delete(tasks.contentDelete);


  // Finish by binding the Custom action middleware
  app.param('taskId', tasks.taskByID);
};
