var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var mongoWrapper = require('../utils/mongo-wrapper.js');

var CustomContextSchema = new Schema(
{
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    name: { type: String },
    parent: { type: Schema.ObjectId, ref: 'CustomContext' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

mongoWrapper.model('CustomContext', CustomContextSchema);

var CustomContextItemSchema = new Schema(
{
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    itemType: { type: String },
    name: { type: String },
    contextId: { type: Schema.ObjectId, ref: 'CustomContext' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

mongoWrapper.model('CustomContextItem', CustomContextItemSchema);
