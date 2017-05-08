'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var EntitySchema = new Schema({
  name: {
    type: String
  },
  botId: {
    type: String
  },
  content: {},
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
 * Custom action Schema
 */
var EntityContentSchema = new Schema({
  name: {
    type: String
  },
  botId: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  entityId: {
    type: Schema.ObjectId,
    ref: 'Entity'
  }

});

mongoose.model('EntityContent', EntityContentSchema);
