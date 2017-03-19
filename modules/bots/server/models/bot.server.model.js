'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bot Schema
 */
var BotSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  kakao: {
    type: Boolean,
    default: false
  },
  line: {
    type: Boolean,
    default: false
  },
  facebook: {
    type: Boolean,
    default: false
  },
  using: {
    type: Boolean,
    default: false
  },

  dialogsets: Schema.Types.Mixed,

  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Bot', BotSchema);
