'use strict';

/**
 * Module dependencies
 */
var userDialogsPolicy = require('../policies/user-dialogs.server.policy'),
  userDialogs = require('../controllers/user-dialogs.server.controller');

module.exports = function(app) {
  app.route('/api/user-dialogs/:botName/:userKey')//all(userDialogsPolicy.isAllowed)
    .get(userDialogs.list);

  app.route('/api/user-dialogs/failedDialog')
    .put(userDialogs.update);

  app.route('/api/user-dialogs/liveChat')
    .post(userDialogs.liveChat)

  app.route('/api/user-dialogs/download')
    .post(userDialogs.download)
};
