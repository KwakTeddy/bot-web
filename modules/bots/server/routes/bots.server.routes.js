'use strict';

/**
 * Module dependencies.
 */
var botsPolicy = require('../policies/bots.server.policy'),
  bots = require('../controllers/bots.server.controller');

module.exports = function (app) {
  // Bots collection routes
  app.route('/api/bots').all(botsPolicy.isAllowed)
    .get(bots.list)
    .post(bots.create);

  // Single bot routes
  app.route('/api/bots/:botId').all(botsPolicy.isAllowed)
    .get(bots.read)
    .put(bots.update)
    .delete(bots.delete);

  // Finish by binding the bot middleware
  app.param('botId', bots.botByID);
};
