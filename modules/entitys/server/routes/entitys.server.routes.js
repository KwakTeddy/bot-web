'use strict';

/**
 * Module dependencies
 */
var entitysPolicy = require('../policies/entitys.server.policy'),
  entitys = require('../controllers/entitys.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/entitys')//.all(entitysPolicy.isAllowed)
    .get(entitys.list)
    .post(entitys.create);

  app.route('/api/entitys/:entityId')//.all(entitysPolicy.isAllowed)
    .get(entitys.read)
    .put(entitys.update)
    .delete(entitys.delete);

  // Custom actions Routes
  app.route('/api/entitysContent')//.all(entitysPolicy.isAllowed)
    .get(entitys.list)
    .post(entitys.contentCreate)
    .delete(entitys.contentDelete);


  app.route('/api/entitysContent/:entityId')//.all(entitysPolicy.isAllowed)
    .get(entitys.read)
    .put(entitys.update)
    .delete(entitys.contentDelete);


  // Finish by binding the Custom action middleware
  app.param('entityId', entitys.entityByID);
};