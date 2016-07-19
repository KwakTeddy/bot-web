'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var CanonicalSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  name: {
    type: String,
    unique: true
  },
  words: {
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

mongoose.model('Canonical', CanonicalSchema);
