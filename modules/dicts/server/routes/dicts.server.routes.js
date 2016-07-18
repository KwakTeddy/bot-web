'use strict';

/**
 * Module dependencies
 */
var dictsPolicy = require('../policies/dicts.server.policy'),
  dicts = require('../controllers/dicts.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/dicts')//.all(dictsPolicy.isAllowed)
    .get(dicts.list)
    .post(dicts.create);

  app.route('/api/dicts/:dictId')//.all(dictsPolicy.isAllowed)
    .get(dicts.read)
    .put(dicts.update)
    .delete(dicts.delete);

  // Finish by binding the Custom action middleware
  app.param('dictId', dicts.dictByID);
};
