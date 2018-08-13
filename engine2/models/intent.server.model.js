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
var IntentSchema = new Schema({
  botId: {
    type: String
  },
  name: {
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

mongoWrapper.model('Intent', IntentSchema);

/**
 * Custom action Schema
 */
var IntentContentSchema = new Schema({
  botId: {
    type: String
  },
  name: {
    type: String
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

mongoWrapper.model('IntentContent', IntentContentSchema);

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

mongoWrapper.model('IntentUtterance', IntentUtteranceSchema);


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

mongoWrapper.model('BotIntent', BotIntentSchema);



var BotIntentFailSchema = new Schema({
  botId: {
    type: 'String'
  },
  intent: {
    type: Schema.ObjectId,
    ref: 'Intent'
  },
  userDialog: {
    type: Schema.ObjectId,
    ref: 'UserDialog'
  },
  clear: {
    type: Boolean
  }
});

mongoWrapper.model('BotIntentFail', BotIntentFailSchema);


var MatchedIntentSchema = new Schema(
{
    botId: String,
    intent: { type: Schema.ObjectId, ref: 'Intent' },
    created: { type: Date, default: Date.now },
});

mongoWrapper.model('MatchedIntent', MatchedIntentSchema);
