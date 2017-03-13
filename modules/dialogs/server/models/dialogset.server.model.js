'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  languange: {
    type: String,
    default: 'en'
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Dialogset', DialogsetSchema);


var DialogsetDialogSchema = new Schema({

  dialogset: {
    type: Schema.ObjectId,
    ref: 'Dialogset'
  },
  id: Number,
  input: Schema.Types.Mixed,
  inputRaw: Schema.Types.Mixed,
  output: Schema.Types.Mixed,
  tag: [String]
});

mongoose.model('DialogsetDialog', DialogsetDialogSchema);

DialogsetDialogSchema.index({dialogset: 1, input: 1});


