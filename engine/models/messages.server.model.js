'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var MessageSchema = new Schema({
    botUser: {
        type: Schema.ObjectId,
        ref: 'BotUser'
    },
    status: {
        type: String
    },
    campaign: {
        type: Schema.ObjectId,
        ref: 'Campaign'
    },



    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Message', MessageSchema);
