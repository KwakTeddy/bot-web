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
  botId: {
    type: String
  },

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

  dialogId: {
    type: String
  },

  dialogName: {
    type: String
  },

  preDialogId: {
    type: String
  },

  preDialogName: {
    type: String
  },

  created: {
    type: Date,
    default: Date.now
  },
  clear: {
    type: Boolean
  }
});

mongoose.model('UserDialog', UserDialogSchema);


var UserDialogLogSchema = new Schema({
  botId: {
    type: String
  },

  userId: {
    type: String
  },

  channel: {
    type: String
  },

  year: {
    type: Number,
    default: (new Date()).getYear() + 1900
  },
  month: {
    type: Number,
    default: (new Date()).getMonth() + 1
  },
  date: {
    type: Number,
    default: (new Date()).getDate()
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserDialogLog', UserDialogLogSchema);
