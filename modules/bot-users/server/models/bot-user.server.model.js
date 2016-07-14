'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bot user Schema
 */
var BotUserSchema = new Schema({
  userKey: {
    type: String
  },
  channel: {
    type: String,
    default: 'kakao'
  },
  currentBank: {
    type: Schema.ObjectId,
    ref: 'Bank'
  },
  currentAccount: {
    type: String
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('BotUser', BotUserSchema);
