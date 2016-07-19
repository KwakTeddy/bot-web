'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var CampaignSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  name: {
    type: String,
    unique: true
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  start: {
    type: Date
  },
  end: {
    type: Date
  },

  messageText: {
    type: String
  },
  messageLinkMessage: {
    type: String
  },
  messageLinkAddress: {
    type: String
  },
  image: {
    type: String
  },


  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Campaign', CampaignSchema);
