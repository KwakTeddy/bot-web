'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Menu navigation Schema
 */
var MenuNavigationSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'enterprise','admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  }
});

mongoose.model('MenuNavigation', MenuNavigationSchema);

var SubMenuNavigationSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  MenuNavigation: {
    type: Schema.ObjectId,
    ref: "MenuNavigation"
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'enterprise','admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  }
});

mongoose.model('SubMenuNavigation', SubMenuNavigationSchema);