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
  name: {
    type: String
  },
  mobile: String,
  phone: {
    type: String
  },
  email: {
    type: String
  },
  isOn: {
    type: Boolean
  },

  address: Object,
  lng: Number,
  lat: Number,

  created: {
    type: Date,
    default: Date.now
  },

  confirmTerms: Boolean,
  botId: {
    type: String
  }
});

mongoose.model('BotUser', BotUserSchema);
