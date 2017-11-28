'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateSchema = new Schema(
{
    user: { type: Schema.ObjectId, ref: 'user' },
    id: String,
    name: String,
    description: String,
    image: String,
    category: { type: Schema.ObjectId, ref: 'templatecategories' },
    language: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

mongoose.model('Template', TemplateSchema);


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
