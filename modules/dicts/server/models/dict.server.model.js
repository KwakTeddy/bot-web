'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var DictSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  word: {
    type: String,
    unique: true
  },
  class: {
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

mongoose.model('Dict', DictSchema);
