'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var ConceptSchema = new Schema({
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

mongoose.model('Concept', ConceptSchema);

var CustomConceptSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  name: {
    type: String,
    unique: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'CustomConcept'
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

mongoose.model('CustomConcept', CustomConceptSchema );

var CustomConceptWord = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  name: {
    type: String,
    unique: true
  },
  concept: {
    type: Schema.ObjectId,
    ref: 'CustomConcept'
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

mongoose.model('CustomConceptWord', CustomConceptWord);

