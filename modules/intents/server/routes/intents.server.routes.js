'use strict';

/**
 * Module dependencies
 */
var intentsPolicy = require('../policies/intents.server.policy'),
  intents = require('../controllers/intents.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/intents')//.all(intentsPolicy.isAllowed)
    .get(intents.list)
    .post(intents.create);

  app.route('/api/intents/:intentId')//.all(intentsPolicy.isAllowed)
    .get(intents.read)
    .put(intents.update)
    .delete(intents.delete);

  // Custom actions Routes
  app.route('/api/intentsContent')//.all(intentsPolicy.isAllowed)
    .get(intents.list)
    .post(intents.contentCreate)
    .delete(intents.contentDelete);


  app.route('/api/intentsContent/:intentId')//.all(intentsPolicy.isAllowed)
    .get(intents.read)
    .put(intents.update)
    .delete(intents.contentDelete);


  // Finish by binding the Custom action middleware
  app.param('intentId', intents.intentByID);
};
