'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Entity Schema
 */
var EntitySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Entity name',
    trim: true
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

mongoose.model('Entity', EntitySchema);

/**
 * Entity Schema
 */
var EntityContentSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Entity name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  entity: {
    type: Schema.ObjectId,
    ref: 'Entity'
  }
});

mongoose.model('EntityContent', EntityContentSchema);
