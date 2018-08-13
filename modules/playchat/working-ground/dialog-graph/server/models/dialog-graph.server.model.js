'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BotFileSchema = new Schema(
{
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    name: { type: String },
    user: { type: Schema.ObjectId, ref: 'User' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
});

mongoose.model('BotFile', BotFileSchema);
