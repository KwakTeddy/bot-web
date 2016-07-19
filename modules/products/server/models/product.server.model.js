'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  bankCode: {
    type: String
  },
  category: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  link: {
    type: String
  },

  rate: {
    type: Number
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

mongoose.model('Product', ProductSchema);
