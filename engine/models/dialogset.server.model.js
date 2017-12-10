'use strict';

/**
 * Module dependencies.
 */
var mongoWrapper = require('../utils/mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Dialogset Schema
 */
var DialogsetSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: ''
  },

  type: {
    type: String
  },
  path: {
    type: String
  },
  filename: {
    type: String
  },
  originalFilename: {
    type: String
  },
  public: {
    type: Boolean
  },
  language: {
    type: String,
    default: 'en'
  },

  limit: {
    type: Number
  },
  matchRate: {
    type: Number
  },
  matchCount: {
    type: Number
  },
    importState: String,
  topicKeywords: Schema.Types.Mixed,

  created: {
    type: Date,
    default: Date.now
  },
  bot:{
    type: Schema.ObjectId,
    ref: 'Bot'
  }
});

mongoWrapper.model('Dialogset', DialogsetSchema);


var DialogsetDialogSchema = new Schema({

  dialogset: {
    type: Schema.ObjectId,
    ref: 'Dialogset'
  },
  id: Number,
  input: Schema.Types.Mixed,
  inputRaw: Schema.Types.Mixed,
  output: Schema.Types.Mixed,
  tag: [String],
  parent: Schema.Types.Mixed,
  context: {
    type: Schema.ObjectId,
    ref: 'CustomContext'
  },
  depth: {
    type: Number,
    default: 0
  },
  groupId: {
    type: String
  },
  randomGroupId: {
    type: String
  }
});

mongoWrapper.model('DialogsetDialog', DialogsetDialogSchema);
DialogsetDialogSchema.index({dialogset: 1, input: 1});

var lgfaqSchema = new Schema({
  conceptId: {
    type: Schema.ObjectId,
    ref: 'conceptlists'
  },
  body: {
    type: String
  },
  cate1: {
    type: String
  },
  cate2: {
    type: String
  },
  keyword: {
    type: String
  },
  title: {
    type: String
  },
});
mongoWrapper.model('lgfaq', lgfaqSchema);

var conceptlists = new Schema({
  parent: {
    type: Schema.ObjectId,
    ref: 'conceptlists'
  },
  name: {
    type: String
  },
});
mongoWrapper.model('conceptlists', conceptlists);
