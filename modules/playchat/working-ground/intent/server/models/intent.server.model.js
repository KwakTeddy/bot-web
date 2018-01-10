'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var IntentSchema = new Schema(
{
    botId: { type: String },
    templateId: { type: String },
    name: { type: String },
    content: {},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

mongoose.model('Intent', IntentSchema);

/**
 * Custom action Schema
 */
var IntentContentSchema = new Schema(
{
    botId: { type: String },
    templateId: { type: String },
    name: { type: String },
    input: String,
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    intentId: { type: Schema.ObjectId, ref: 'Intent' }
});

mongoose.model('IntentContent', IntentContentSchema);

var IntentContext = new Schema(
{
    botId: String,
    word: String,
    count: Number,
    __v: Number
});

mongoose.model('IntentContext', IntentContext);


var IntentUtteranceSchema = new Schema(
{
    utterance: { type: String, default: '', required: 'Please fill utterance name', trim: true },
    input: { type: String },
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    intent: { type: Schema.ObjectId, ref: 'Intent' }
});

mongoose.model('IntentUtterance', IntentUtteranceSchema);


var BotIntentSchema = new Schema(
{
    botId: { type: 'String' },
    intent: { type: Schema.ObjectId, ref: 'Intent' },
    dialogId: { type: String }
});

mongoose.model('BotIntent', BotIntentSchema);


var BotIntentFailSchema = new Schema(
{
    botId: { type: 'String' },
    intent: { type: Schema.ObjectId, ref: 'Intent' },
    userDialog: { type: Schema.ObjectId, ref: 'UserDialog' },
    clear: { type: Boolean }
});

mongoose.model('BotIntentFail', BotIntentFailSchema);

var MatchedIntentSchema = new Schema(
{
    botId: String,
    intent: { type: Schema.ObjectId, ref: 'Intent' },
    created: { type: Date, default: Date.now },
});

mongoose.model('MatchedIntent', MatchedIntentSchema);
