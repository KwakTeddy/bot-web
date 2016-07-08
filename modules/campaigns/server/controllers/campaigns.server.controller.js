'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Campaign = mongoose.model('Campaign'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a campaign
 */
exports.create = function (req, res) {
  var campaign = new Campaign(req.body);
  campaign.user = req.user;

  campaign.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign);
    }
  });
};

/**
 * Show the current campaign
 */
exports.read = function (req, res) {
  res.json(req.campaign);
};

/**
 * Update a campaign
 */
exports.update = function (req, res) {
  var campaign = req.campaign;

  campaign.title = req.body.title;
  campaign.content = req.body.content;

  campaign.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign);
    }
  });
};

/**
 * Delete an campaign
 */
exports.delete = function (req, res) {
  var campaign = req.campaign;

  campaign.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign);
    }
  });
};

/**
 * List of Campaigns
 */
exports.list = function (req, res) {
  Campaign.find().sort('-created').populate('user', 'displayName').exec(function (err, campaigns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaigns);
    }
  });
};

/**
 * Campaign middleware
 */
exports.campaignByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Campaign is invalid'
    });
  }

  Campaign.findById(id).populate('user', 'displayName').exec(function (err, campaign) {
    if (err) {
      return next(err);
    } else if (!campaign) {
      return res.status(404).send({
        message: 'No campaign with that identifier has been found'
      });
    }
    req.campaign = campaign;
    next();
  });
};
