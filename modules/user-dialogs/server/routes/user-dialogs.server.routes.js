'use strict';

/**
 * Module dependencies
 */
var userDialogsPolicy = require('../policies/bot-users.server.policy'),
  userDialogs = require('../controllers/bot-users.server.controller');

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/bot-users').all(userDialogsPolicy.isAllowed)
    .post(userDialogs.create)
    .get(userDialogs.list);

  app.route('/api/bot-users/:userDialogId').all(userDialogsPolicy.isAllowed)
    .get(userDialogs.read)
    .put(userDialogs.update)
    .delete(userDialogs.delete);

  app.route('/api/bot-users/by-key/:userKey')
    .get(userDialogs.read)
    .post(userDialogs.create)
    .put(userDialogs.update)
    .delete(userDialogs.delete);


  // Finish by binding the Bot user middleware
  app.param('userDialogId', userDialogs.userDialogByID);
  app.param('userKey', userDialogs.userDialogByUserKey);
};
