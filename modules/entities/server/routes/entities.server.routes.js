'use strict';

/**
 * Module dependencies
 */
var entitiesPolicy = require('../policies/entities.server.policy'),
  entities = require('../controllers/entities.server.controller');

module.exports = function(app) {
  // Entities Routes
  app.route('/api/entities').all(entitiesPolicy.isAllowed)
    .get(entities.list)
    .post(entities.create);

  app.route('/api/entities/:entityId').all(entitiesPolicy.isAllowed)
    .get(entities.read)
    .put(entities.update)
    .delete(entities.delete);

  // Entities Routes
  app.route('/api/entityContent').all(entitiesPolicy.isAllowed)
    .post(entities.contentCreate);


  app.route('/api/entityContent/:entityId').all(entitiesPolicy.isAllowed)
    .get(entities.contentList)
    .post(entities.contentCreate);
  // .put(entities.contentUpdate)
  // .delete(entities.contentDelete);


  // Finish by binding the Entity middleware
  app.param('entityId', entities.entityByID);
};
