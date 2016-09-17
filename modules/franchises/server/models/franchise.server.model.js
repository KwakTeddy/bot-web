'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var FranchiseSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },

  name: String,
  category: [String],
  post: String,
  address: String,
  address2: String,
  phone: String,
  homepage: String,
  photo: String,
  description: String,
  tag: String,

  isOpen: Boolean,
  minOrder: Number,
  payment: [String],
  businessHours: {
    day: String,
    hours: {
      from: Date,
      to: Date
    }
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

mongoose.model('Franchise', FranchiseSchema);
