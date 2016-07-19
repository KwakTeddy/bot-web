'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var CampaignUserSchema = new Schema({
  campaign: {
    type: Schema.ObjectId,
    ref: 'Campaign'
  },
  botUser: {
    type: Schema.ObjectId,
    ref: 'BotUser'
  },
  result: {
    type: String,
    default: '전송대기'
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

mongoose.model('CampaignUser', CampaignUserSchema);
