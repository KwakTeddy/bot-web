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
    default: '카카오톡'
  },
  currentBank: {
    type: Schema.ObjectId,
    ref: 'Bank'
  },
  currentAccount: {
    type: String
  },

  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  isOn: {
    type: Boolean
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('BotUser', BotUserSchema);
