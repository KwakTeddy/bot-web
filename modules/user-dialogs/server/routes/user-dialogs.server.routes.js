'use strict';

/**
 * Module dependencies
 */
var userDialogsPolicy = require('../policies/user-dialogs.server.policy'),
  userDialogs = require('../controllers/user-dialogs.server.controller');

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/user-dialogs').all(userDialogsPolicy.isAllowed)
    .post(userDialogs.create)
    .get(userDialogs.list);

  app.route('/api/user-dialogs/:userDialogId').all(userDialogsPolicy.isAllowed)
    .get(userDialogs.read)
    .put(userDialogs.update)
    .delete(userDialogs.delete);

  app.route('/api/user-dialogs/by-key/:userKey')
    .get(userDialogs.read)
    .post(userDialogs.create)
    .put(userDialogs.update)
    .delete(userDialogs.delete);


  // Finish by binding the Bot user middleware
  app.param('userDialogId', userDialogs.userDialogByID);
  app.param('userKey', userDialogs.userDialogByUserKey);
};
