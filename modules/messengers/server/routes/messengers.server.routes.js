'use strict';

/**
 * Module dependencies.
 */
var messengersPolicy = require('../policies/messengers.server.policy'),
  messengers = require('../controllers/messengers.server.controller');

module.exports = function (app) {
  // Messengers collection routes
  app.route('/api/messengers')//all(messengersPolicy.isAllowed)
    .get(messengers.list)
    .post(messengers.create);

  // Single messenger routes
  app.route('/api/messengers/:messengerId')//all(messengersPolicy.isAllowed)
    .get(messengers.read)
    .put(messengers.update)
    .delete(messengers.delete);

  // Finish by binding the messenger middleware
  app.param('messengerId', messengers.messengerByID);
};
