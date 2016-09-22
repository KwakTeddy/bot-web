'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Custom action Schema
 */
var DeliveryOrderSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },

  restaurant: {
    type: Schema.ObjectId,
    ref: 'Restaurant'
  },
  restaurantName: String,
  menus: Array,
  address: String,
  address2: String,
  payment: [String],
  totalPrice: Number,

  status: String, // 요청(사용자주문) 접수(음식점전달) 준비중 배달중 배달완료
                  // 주문취소(사용자) 주문불가(음식점전화X) 주문미확인(5분내확인안함) 주문거부(전화받았으나거부) 배달실패(주소오류, 연락두절) 배달성공
  memo: String,

  times: Array,        // status time
  intervals: Array,    // input, order, check, cook, delivery, total (seconds)

  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: String
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('DeliveryOrder', DeliveryOrderSchema);
