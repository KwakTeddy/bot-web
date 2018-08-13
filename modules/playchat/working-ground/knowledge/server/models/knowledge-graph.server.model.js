'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var FactSchema = new Schema({
    bot: {
        type: Schema.ObjectId,
        ref: 'Bot'
    },
    subject: {
        type: String
    },
    verb: {
        type: String
    },
    object: {
        type: String
    },




    updated: {
        type: Date,
        default: Date.now
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

mongoose.model('Fact', FactSchema);

var FactLinkSchema = new Schema({
    botUser: {
        type: String
    },

    node1: {
        type: String
    },
    node1Ref: {
        type: Schema.ObjectId,
        ref: 'FactAtom'
    },

    node2: {
        type: String
    },
    node2Ref: {
        type: Schema.ObjectId,
        ref: 'FactAtom'
    },

    link: {
        type: String
    },
    LinkRef: {
        type: Schema.ObjectId,
        ref: 'FactAtom'
    },

    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    bot_id: {
        type: String,
    }
});

mongoose.model('FactLink', FactLinkSchema);

var FactAtomSchema = new Schema({
    id: Number,

    botUser: {
        type: String
    },

    name: {
        type: String
    },

    updated: {
        type: Date,
        default: Date.now
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

mongoose.model('FactAtom', FactAtomSchema);
