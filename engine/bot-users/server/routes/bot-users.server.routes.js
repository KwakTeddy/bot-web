'use strict';

/**
 * Module dependencies
 */
var botUsersPolicy = require('../policies/bot-users.server.policy'),
  botUsers = require('../controllers/bot-users.server.controller');

module.exports = function(app) {
  // Bot users Routes
  app.route('/api/bot-users')//all(botUsersPolicy.isAllowed)
    .post(botUsers.create)
    .get(botUsers.list);

  app.route('/api/bot-users/:botUserId')//all(botUsersPolicy.isAllowed)
    .get(botUsers.read)
    .put(botUsers.update)
    .delete(botUsers.delete);

  app.route('/api/bot-users/by-key/:userKey')//all(botUsersPolicy.isAllowed)
    .get(botUsers.read)
    .post(botUsers.create)
    .put(botUsers.update)
    .delete(botUsers.delete);


  // Finish by binding the Bot user middleware
  app.param('botUserId', botUsers.botUserByID);
  app.param('userKey', botUsers.botUserByUserKey);
};
