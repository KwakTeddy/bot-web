'use strict';

/**
 * Module dependencies
 */
var faqsPolicy = require('../policies/faqs.server.policy'),
  faqs = require('../controllers/faqs.server.controller');

module.exports = function(app) {
  // Faqs Routes
  app.route('/api/faqs')//all(faqsPolicy.isAllowed)
    .get(faqs.list)
    .post(faqs.create);

  app.route('/api/faqs/:faqId')//all(faqsPolicy.isAllowed)
    .get(faqs.read)
    .put(faqs.update)
    .delete(faqs.delete);

  // Finish by binding the Faq middleware
  app.param('faqId', faqs.faqByID);
};
