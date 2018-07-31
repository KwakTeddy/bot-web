'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var EntitySchema = new Schema(
{
    name: { type: String },
    botId: { type: String },
    templateId: { type: String },
    content: {},
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    usable: Boolean
});

mongoose.model('Entity', EntitySchema);

/**
 * Custom action Schema
 */
var EntityContentSchema = new Schema(
{
    name: { type: String },
    botId: { type: String },
    templateId: { type: String },
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    entityId: { type: Schema.ObjectId, ref: 'Entity' },
    syn: {}
});

mongoose.model('EntityContent', EntityContentSchema);


/**
 * Custom action Schema
 */
var EntityContentSynonymSchema = new Schema(
{
    name: { type: String },
    created: { type: Date, default: Date.now },
    contentId: { type: Schema.ObjectId, ref: 'EntityContent' },
    entityId: { type: Schema.ObjectId, ref: 'Entity' },
    botId: { type: String }
});

mongoose.model('EntityContentSynonym', EntityContentSynonymSchema);
