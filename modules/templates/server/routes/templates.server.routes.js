'use strict';

/**
 * Module dependencies
 */
var templatesPolicy = require('../policies/templates.server.policy'),
  templates = require('../controllers/templates.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/templates')//all(templatesPolicy.isAllowed)
    .get(templates.list)
    .post(templates.create);

  app.route('/api/templates/:templateId')//all(templatesPolicy.isAllowed)
    .get(templates.read)
    .put(templates.update)
    .delete(templates.delete);

  // Finish by binding the Custom action middleware
  app.param('templateId', templates.templateByID);
};
