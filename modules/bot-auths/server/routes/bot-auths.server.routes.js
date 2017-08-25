'use strict';

/**
 * Module dependencies
 */
var botAuthsPolicy = require('../policies/bot-auths.server.policy'),
  botAuths = require('../controllers/bot-auths.server.controller');

module.exports = function(app) {
  // Bot auths Routes
  app.route('/api/bot-auths').all(botAuthsPolicy.isAllowed)
    .get(botAuths.list)
    .post(botAuths.create);

  app.route('/api/bot-auths/getAuth')//.all(botAuthsPolicy.isAllowed)
    .post(botAuths.getAuth)

  app.route('/api/bot-auths/:botId/:userId').all(botAuthsPolicy.isAllowed)
    .get(botAuths.read)
    .put(botAuths.update)
    .delete(botAuths.delete);

  // Finish by binding the Bot auth middleware
  app.param('botAuthId', botAuths.botAuthByID);
};
