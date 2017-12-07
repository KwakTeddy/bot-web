'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Bot auth Schema
 */
var BotAuthSchema = new Schema(
{
    created: { type: Date, default: Date.now },
    giver: { type: Schema.ObjectId, ref: 'User' },
    user: { type: Schema.ObjectId, ref: 'User' },
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    subjectSchema: { type: "String" },
    subject: { type: Schema.ObjectId },
    edit: { type: Boolean, default: false },
    read: { type: Boolean, default: true }
});

mongoose.model('BotAuth', BotAuthSchema);
