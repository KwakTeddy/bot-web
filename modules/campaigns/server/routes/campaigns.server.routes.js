'use strict';

/**
 * Module dependencies
 */
var campaignsPolicy = require('../policies/campaigns.server.policy'),
  campaigns = require('../controllers/campaigns.server.controller'),
  campaignUsers = require('../controllers/user-campaign.server.controller');

module.exports = function(app) {
  // Custom actions Routes
  app.route('/api/campaigns')//.all(campaignsPolicy.isAllowed)
    .get(campaigns.list)
    .post(campaigns.create);

  app.route('/api/campaigns/:campaignId')//.all(campaignsPolicy.isAllowed)
    .get(campaigns.read)
    .put(campaigns.update)
    .delete(campaigns.delete);

  app.route('/api/campaign-users/:campaignId')//.all(campaignsPolicy.isAllowed)
    .get(campaignUsers.list)
    .post(campaignUsers.create);

  app.route('/api/campaign-users/:campaignId/:campaignUserId')//.all(campaignsPolicy.isAllowed)
    .get(campaignUsers.read)
    .put(campaignUsers.update)
    .delete(campaignUsers.delete);

  // Finish by binding the Custom action middleware
  app.param('campaignId', campaigns.campaignByID);
  app.param('campaignUserId', campaignUsers.campaignUserByID);
};
