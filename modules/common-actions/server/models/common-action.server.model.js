'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var CommonActionSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  name: {
    type: String,
    unique: true
  },
  type: { // DB, REST
    type: String
  },
  collectionName: { // for DB Ation
    type: String
  },
  method: { // for both of actions
    type: String
  },
  params: {
    type: String
  },
  message: { // output message format
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

mongoose.model('CommonAction', CommonActionSchema);
