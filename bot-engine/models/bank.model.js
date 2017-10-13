'use strict';

/**
 * Module dependencies.
 */
var mongoWrapper = require('./mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Bank Schema
 */
var BankSchema = new Schema({
  userKey: {
    type: String
  },
  bankName: {
    type: String
  },
  bankCode: {
    type: String
  },

  userID: {
    type : String
  },
  userPassword: {
    type: String
  },

  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('Bank', BankSchema);
