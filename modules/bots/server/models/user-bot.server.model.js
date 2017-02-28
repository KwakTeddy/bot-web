'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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

  imageFile: {
    type: String
  },

  dialogFile: {
    type:String
  },
  dialogset: {
    type:String
  },
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
  }
});

mongoose.model('UserBot', UserBotSchema);


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

mongoose.model('UserBotDialogFile', UserBotDialogFileSchema);


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
// mongoose.model('UserBotDialog', UserBotDialogSchema);


var UserBotFollowSchema = new Schema({

  botUserId: {
    type: String
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

mongoose.model('UserBotFollow', UserBotFollowSchema);


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

mongoose.model('UserBotComment', UserBotCommentSchema);


var UserBotDialogSchema = new Schema({
  userBot: {
    type: Schema.ObjectId,
    ref: 'UserBot'
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

mongoose.model('UserBotDialog', UserBotDialogSchema);
