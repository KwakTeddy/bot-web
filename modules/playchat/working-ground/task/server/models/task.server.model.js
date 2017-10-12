'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var TaskSchema = new Schema(
{
    name: { type: String, unique: true },
    displayName: { type: String },
    description: { type: String },
    traffic: { type: Number, default: 0 },
    bots: { type: Array },
    action: { type: String },
    json: { type: String },
    paramSchema: { type: String },
    open: { type: Boolean },
    created: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    entity: {}
});

mongoose.model('Task', TaskSchema);

/**
 * Custom action Schema
 */
var TaskBotsSchema = new Schema(
{
    use: { type: Boolean },
    created: { type: Date, default: Date.now },
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    taskId: { type: Schema.ObjectId, ref: 'Task' }
});

mongoose.model('TaskBots', TaskBotsSchema);

/**
 * Custom action Schema
 */
var TaskEntitySchema = new Schema(
{
    required: { type: Boolean },
    use: { type: Boolean },
    created: { type: Date, default: Date.now },
    entityId: { type: Schema.ObjectId, ref: 'Entity' },
    taskId: { type: Schema.ObjectId, ref: 'Task' }
});

mongoose.model('TaskEntity', TaskEntitySchema);


/**
 * Custom action Schema
 */
var TaskContentSchema = new Schema(
{
    use: { type: Boolean },
    created: { type: Date, default: Date.now },
    bot: { type: Schema.ObjectId, ref: 'Bot' },
    taskId: { type: Schema.ObjectId, ref: 'Task' }
});

mongoose.model('TaskContent', TaskContentSchema);
