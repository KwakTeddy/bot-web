'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var DeliveryOrderMenuSchema = new Schema({
  deliveryOrder: {
    type: Schema.ObjectId,
    ref: 'DeliveryOrder'
  },

  name: String,
  category: [String],
  price: Number,

  photo: String,
  description: String,

  options: Object,
  additions: Object,

  id: String,     // 해당 사이트의 상품 아이디

  // options:
  //   {
  //     key: {
  //       name: String,
  //       price: Number
  //     }
  // },
  //
  // additions: {
  //   name: String,
  //   price: Number
  // },

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

mongoose.model('DeliveryOrderMenu', DeliveryOrderMenuSchema);
