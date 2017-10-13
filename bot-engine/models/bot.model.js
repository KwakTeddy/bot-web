'use strict';

/**
 * Module dependencies.
 */
var mongoWrapper = require('./mongo-wrapper.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BotDialogFileSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
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

mongoWrapper.model('BotDialogFile', BotDialogFileSchema);


// var BotDialogSchema = new Schema({
//   bot: {
//     type: Schema.ObjectId,
//     ref: 'Bot'
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
// mongoWrapper.model('BotDialog', BotDialogSchema);


var BotFollowSchema = new Schema({
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
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

mongoWrapper.model('BotFollow', BotFollowSchema);


var BotCommentSchema = new Schema({
  text: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  bot: {
    type: Schema.ObjectId,
    ref: 'Bot'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoWrapper.model('BotComment', BotCommentSchema);


var BotDialogSchema = new Schema({
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
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'BotDialog'
  },
  depth: {
    type: Number
  }
});

mongoWrapper.model('BotDialog', BotDialogSchema);

var UserBotFbPageSchema = new Schema({
    bot: {
        type: Schema.ObjectId,
        ref: 'Bot'
    },
    userBotId: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    pageId: {
        type: String
    },
    accessToken: {
        type: String
    },
    link: {
        type: String
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    connect: {
      type: Boolean
    }
});

mongoWrapper.model('UserBotFbPage', UserBotFbPageSchema);
