'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var MenuSchema = new Schema({
  restaurant: {
    type: Schema.ObjectId,
    ref: 'Restaurant'
  },

  name: String,
  category: [String],
  price: Number,

  photo: String,
  description: String,

  options: Object,
  additions: Object,

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

mongoose.model('Menu', MenuSchema);
