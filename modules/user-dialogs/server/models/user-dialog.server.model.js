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
  userId: {
    type: String
  },

  channel: {
    type: String
  },

  inOut: {
    type: Boolean
  },

  fail: {
    type: Boolean
  },

  dialog: {
    type: String
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserDialog', UserDialogSchema);
