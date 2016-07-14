'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Faq Schema
 */
var FaqSchema = new Schema({
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

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Faq', FaqSchema);
