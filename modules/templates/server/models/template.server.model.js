'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var TemplateSchema = new Schema({
  id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    unique: true
  },
  content: {
    type: String
  },
  dataSchema: {
    type:String
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

mongoose.model('Template', TemplateSchema);
