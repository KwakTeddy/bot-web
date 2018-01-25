'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Log Schema
 */
var UserLogSchema = new Schema(
    {
        created: { type: Date, default: Date.now },
        userId: { type: Schema.ObjectId, ref: 'User' },
        url: {type: String},
        botId: { type: Schema.ObjectId, ref: 'Bot' }
    });

mongoose.model('UserLog', UserLogSchema);
