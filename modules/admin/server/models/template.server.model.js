'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateCategorySchema = new Schema({
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('TemplateCategory', TemplateCategorySchema);


var TemplateSchema = new Schema(
{
    user: { type: Schema.ObjectId, ref: 'User' },
    id: String,
    name: String,
    description: String,
    icon: String,
    category: { type: Schema.ObjectId, ref: 'TemplateCategory' },
    language: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

mongoose.model('Template', TemplateSchema);
