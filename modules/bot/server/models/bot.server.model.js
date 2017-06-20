'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Channel Schema
 */
var ChannelSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Channel', ChannelSchema);

/**
 * Media Save Schema
 */
var MediaSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String
  },
  botId: {
    type: String
  },
  channel: {
    type: String
  },
  user: {
    type: String
  },
  context: {
    type: String
  },
  type: {
    type: String
  }

});

mongoose.model('Media', MediaSchema);

/**
 * OvertextLink Schema
 */
var overTextLinkSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
    expires: 60*60*24*30
  },
  text: {
    type: String
  },
  index: {
    type: String
  }
});

mongoose.model('OverTextLink', overTextLinkSchema);
