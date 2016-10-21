'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bot user Schema
 */
var UserDialogSchema = new Schema({
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

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserDialog', UserDialogSchema);
