'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * UserBot Schema
 */
var UserBotFileSchema = new Schema({
  userBot: {
    type: Schema.ObjectId,
    ref: 'UserBot'
  },
  name: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('UserBotFile', UserBotFileSchema);
