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
var KnowledgeGraphSchema = new Schema(
{
    botId: String,
    userKey: String,
    node1: String,
    node1Ref: { type: Schema.ObjectId, ref: 'FactAtom' },
    node2: String,
    node2Ref: { type: Schema.ObjectId, ref: 'FactAtom' },
    link: String,
    LinkRef: { type: Schema.ObjectId, ref: 'FactAtom' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
});

mongoWrapper.model('KnowledgeGraph', KnowledgeGraphSchema);
