'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Dialogset Schema
 */
var DialogsetSchema = new Schema(
{
    user: { type: Schema.ObjectId, ref: 'User' },
    title: { type: String, default: '', trim: true },
    content: { type: String, default: '' },
    type: { type: String },
    path: { type: String },
    filename: { type: String },
    originalFilename: { type: String },
    public: { type: Boolean },
    language: { type: String, default: 'en' },
    limit: { type: Number },
    matchRate: { type: Number },
    matchCount: { type: Number },
    topicKeywords: Schema.Types.Mixed,
    created: { type: Date, default: Date.now },
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    usable: {type: Boolean },
    importState: String
});

mongoose.model('Dialogset', DialogsetSchema);
