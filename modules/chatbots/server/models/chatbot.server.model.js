'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Bot Schema
 */
var BotSchema = new Schema(
{
    id: { type: String },
    name: { type: String },
    description: String,
    language: { type: String, default: 'ko' },
    kakao: { type: Boolean, default: false },
    line: { type: Boolean, default: false },
    lineChannel: Object,
    facebook: { type: Boolean, default: false },
    telegram: String,
    wechat: Object,
    using: { type: Boolean, default: false },
    public: { type: Boolean, default: true },
    learn: { type: Boolean, default: false },
    imageFile: { type: String },
    dialogFile: { type:String },
    dialogsets: [{ type: Schema.Types.ObjectId, ref: 'Dialogset'}],
    followed: { type: Number, default: 0 },
    learning: { type: Boolean, default: false },
    templateId: { type: Schema.ObjectId, ref: 'Template' },
    templateDataId: { type: Schema.ObjectId, ref: 'TemplateData' },
    topicKeywords: Schema.Types.Mixed,
    user: { type: Schema.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now }
});

mongoose.model('Bot', BotSchema);
