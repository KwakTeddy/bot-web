'use strict';

/**
 * Module dependencies.
 */
var mongoWrapper = require('../utils/mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var FactLinkSchema = new Schema({
  botUser: {
    type: String
  },

  node1: {
    type: String
  },
  node1Ref: {
    type: Schema.ObjectId,
    ref: 'FactAtom'
  },

  node2: {
    type: String
  },
  node2Ref: {
    type: Schema.ObjectId,
    ref: 'FactAtom'
  },

  link: {
    type: String
  },
  LinkRef: {
    type: Schema.ObjectId,
    ref: 'FactAtom'
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
  },
  bot_id: {
    type: String,
  }
});

mongoWrapper.model('FactLink', FactLinkSchema);
