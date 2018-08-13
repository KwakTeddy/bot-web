'use strict';

var mongoWrapper = require('../utils/mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

mongoWrapper.model('Entity', EntitySchema);

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
  },
  syn: {
  }

});

mongoWrapper.model('EntityContent', EntityContentSchema);


var EntityContentSynonymSchema = new Schema({
  name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  contentId: {
    type: Schema.ObjectId,
    ref: 'EntityContent'
  },
  entityId: {
    type: Schema.ObjectId,
    ref: 'Entity'
  },
  botId: {
    type: String
  }
});

mongoWrapper.model('EntityContentSynonym', EntityContentSynonymSchema);
