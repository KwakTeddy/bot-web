'use strict';

/**
 * Module dependencies.
 */
var campaignsPolicy = require('../policies/campaigns.server.policy'),
  campaigns = require('../controllers/campaigns.server.controller');

module.exports = function (app) {
  // Campaigns collection routes
  app.route('/api/campaigns').all(campaignsPolicy.isAllowed)
    .get(campaigns.list)
    .post(campaigns.create);

  // Single campaign routes
  app.route('/api/campaigns/:campaignId').all(campaignsPolicy.isAllowed)
    .get(campaigns.read)
    .put(campaigns.update)
    .delete(campaigns.delete);

  // Finish by binding the campaign middleware
  app.param('campaignId', campaigns.campaignByID);
};
