'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var IntentSchema = new Schema({
  botId: {
    type: String
  },
  name: {
    type: String,
    unique: true
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

mongoose.model('Intent', IntentSchema);

/**
 * Custom action Schema
 */
var IntentContentSchema = new Schema({
  botId: {
    type: String
  },
  name: {
    type: String,
    unique: true
  },
  input: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  intentId: {
    type: Schema.ObjectId,
    ref: 'Intent'
  }

});

mongoose.model('IntentContent', IntentContentSchema);

var IntentUtteranceSchema = new Schema({
  utterance: {
    type: String,
    default: '',
    required: 'Please fill utterance name',
    trim: true
  },
  input: {
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
  intent: {
    type: Schema.ObjectId,
    ref: 'Intent'
  }
});

mongoose.model('IntentUtterance', IntentUtteranceSchema);


var BotIntentSchema = new Schema({
  botId: {
    type: 'String'
  },
  intent: {
    type: Schema.ObjectId,
    ref: 'Intent'
  },
  dialogId: {
    type: String
  }
});

mongoose.model('BotIntent', BotIntentSchema);
