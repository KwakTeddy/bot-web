'use strict';

/**
 * Module dependencies
 */
var banksPolicy = require('../policies/banks.server.policy'),
  banks = require('../controllers/banks.server.controller');

module.exports = function(app) {
  app.route('/banks/save/:userKey')
    .get(banks.renderSave);

  // Banks Routes
  app.route('/api/banks/:userKey')
    .get(banks.list)
    .post(banks.create);


  // app.route('/api/banks/:bankId')
  //   .get(banks.read)
  //   .put(banks.update)
  //   .delete(banks.delete);


  // Finish by binding the Bank middleware
  app.param('bankId', banks.bankByID);
};
