'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CampaignUser = mongoose.model('CampaignUser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Custom action
 */
exports.create = function(req, res) {
  var campaign = new CampaignUser(req.body);
  campaign.campaign = req.campaign;
  campaign.user = req.user;

  campaign.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Show the current Custom action
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var campaign = req.campaignUser ? req.campaignUser.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  campaign.isCurrentUserOwner = req.user && campaign.user && campaign.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(campaign);
};

/**
 * Update a Custom action
 */
exports.update = function(req, res) {
  var campaign = req.campaignUser ;

  campaign = _.extend(campaign , req.body);

  campaign.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * Delete an Custom action
 */
exports.delete = function(req, res) {
  var campaign = req.campaignUser ;

  campaign.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaign);
    }
  });
};

/**
 * List of Custom actions
 */
exports.list = function(req, res) { 
  CampaignUser.find({campaign: req.campaign._id}).sort('-created').populate('user', 'displayName').populate('campaign').populate('botUser').exec(function(err, campaigns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campaigns);
    }
  });
};

/**
 * Custom action middleware
 */
exports.campaignUserByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Custom action is invalid'
    });
  }

  CampaignUser.findById(id).populate('user', 'displayName').populate('campaign').populate('botUser').exec(function (err, campaign) {
    if (err) {
      return next(err);
    } else if (!campaign) {
      return res.status(404).send({
        message: 'No Custom action with that identifier has been found'
      });
    }
    req.campaignUser = campaign;
    next();
  });
};
