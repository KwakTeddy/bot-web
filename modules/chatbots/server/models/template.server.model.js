'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
// var TemplateSchema = new Schema({
//     id: {
//         type: String,
//         unique: true
//     },
//     name: {
//         type: String,
//         unique: true
//     },
//     image: {
//         type: String,
//     },
//     content: {
//         type: String
//     },
//     dataSchema: {
//         type:Object
//     },
//     updated: {
//         type: Date,
//         default: Date.now
//     },
//     created: {
//         type: Date,
//         default: Date.now
//     },
//     user: {
//         type: Schema.ObjectId,
//         ref: 'User'
//     },
//     category: {
//         type: Schema.ObjectId,
//         ref: 'TemplateCategory'
//     },
//     collectionName: { type: String }
// });
//
// mongoose.model('Template', TemplateSchema);

/**
 * Custom action Schema
 */
// var TemplateCategorySchema = new Schema({
//     name: {
//         type: String
//     },
//     created: {
//         type: Date,
//         default: Date.now
//     }
// });
// mongoose.model('TemplateCategory', TemplateCategorySchema);
