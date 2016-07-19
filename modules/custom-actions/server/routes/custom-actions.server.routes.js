'use strict';

/**
 * Module dependencies
 */
var customActionsPolicy = require('../policies/custom-actions.server.policy'),
  customActions = require('../controllers/custom-actions.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/custom-actions')//.all(customActionsPolicy.isAllowed)
    .get(customActions.list)
    .post(customActions.create);

  app.route('/api/custom-actions/:customActionId')//.all(customActionsPolicy.isAllowed)
    .get(customActions.read)
    .put(customActions.update)
    .delete(customActions.delete);

  // Finish by binding the Custom action middleware
  app.param('customActionId', customActions.customActionByID);
};
