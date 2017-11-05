'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var mongoWrapper = require('../utils/mongo-wrapper.js');

/**
 * Bot Schema
 */
var BotFileSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
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

mongoWrapper.model('BotFile', BotFileSchema);


