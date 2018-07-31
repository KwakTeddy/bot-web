'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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

mongoose.model('Bank', BankSchema);
