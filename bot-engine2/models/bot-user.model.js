'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BotUserSchema = new Schema(
{
    userKey: { type: String },
    channel: { type: String },
    name: { type: String },
    mobile: String,
    phone: { type: String },
    email: { type: String },
    isOn: { type: Boolean },
    address: Object,
    lng: Number,
    lat: Number,
    created: { type: Date, default: Date.now },
    confirmTerms: Boolean,
    botId: []
});

module.exports = mongoose.model('BotUser', BotUserSchema);
