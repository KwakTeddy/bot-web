'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var RestaurantDumpSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },

  site: String,               // 사이트
  restaurantId: String,       // 사이트의 아이디

  name: String,
  category: [String],
  post: String,
  address: Object,
  address1: String,
  address2: String,
  phone: String,
  phone1: String,
  homepage: String,
  photo: String,
  description: String,
  tag: String,

  lat: Number,
  lng: Number,

  isOpen: Boolean,
  minOrder: Number,
  payment: [String],
  businessHours: [
    {
      day: String,
      start: String,
      end: String
    }
  ],
  businessHourStr: String,

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
  franchise: {
    type: Schema.ObjectId,
    ref: 'Franchise'
  }
});

mongoose.model('RestaurantDump', RestaurantDumpSchema);
