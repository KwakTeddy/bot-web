'use strict';

/**
 * Module dependencies.
 */
var mongoWrapper = require('../utils/mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * UserBot Schema
 */
var UserBotSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  kakao: {
    type: Boolean,
    default: false
  },
  line: {
    type: Boolean,
    default: false
  },
  facebook: {
    type: Boolean,
    default: false
  },
  using: {
    type: Boolean,
    default: false
  },

  public: {
    type: Boolean,
    default: true
  },

  learn: {
    type: Boolean,
    default: false
  },

  imageFile: {
    type: String
  },

  dialogFile: {
    type:String
  },
  dialogsets: Schema.Types.Mixed,

  followed: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  learning: {
    type: Boolean,
    default: false
  }
});

mongoWrapper.model('UserBot', UserBotSchema);


var UserBotDialogFileSchema = new Schema({
  userBot: {
    type: Schema.ObjectId,
    ref: 'UserBot'
  },
  filename: {
    type: String
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('UserBotDialogFile', UserBotDialogFileSchema);


// var UserBotDialogSchema = new Schema({
//   userBot: {
//     type: Schema.ObjectId,
//     ref: 'UserBot'
//   },
//   input: {
//     type: String
//   },
//   task: {
//     type: String
//   },
//   output: {
//     type: String
//   },
//   updated: {
//     type: Date,
//     default: Date.now
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   }
// });
//
// mongoWrapper.model('UserBotDialog', UserBotDialogSchema);


var UserBotFollowSchema = new Schema({
  userBot: {
      type: Schema.ObjectId,
      ref: 'UserBot'
  },
  botUserId: {
    type: String
  },
  followed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('UserBotFollow', UserBotFollowSchema);


var UserBotCommentSchema = new Schema({
  text: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  userBot: {
    type: Schema.ObjectId,
    ref: 'UserBot'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('UserBotComment', UserBotCommentSchema);


var UserBotDialogSchema = new Schema({
  botId: {
    type: String
  },
  id: {
    type: String
  },
  input: {
    type: String
  },
  inputRaw: {
    type: String
  },
  output: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('UserBotDialog', UserBotDialogSchema);

