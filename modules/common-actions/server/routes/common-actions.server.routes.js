'use strict';

/**
 * Module dependencies
 */
var commonActionsPolicy = require('../policies/common-actions.server.policy'),
  commonActions = require('../controllers/common-actions.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/common-actions')//all(commonActionsPolicy.isAllowed)
    .get(commonActions.list)
    .post(commonActions.create);

  app.route('/api/common-actions/:commonActionId')//all(commonActionsPolicy.isAllowed)
    .get(commonActions.read)
    .put(commonActions.update)
    .delete(commonActions.delete);

  // Finish by binding the Custom action middleware
  app.param('commonActionId', commonActions.commonActionByID);
};
