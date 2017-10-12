'use strict';

var mongoose = require(_botEngineModules.mongoose);
var Schema = mongoose.Schema;

var BotSchema = new Schema(
{
    id: { type: String },
    name: { type: String },
    description: { type: String },
    kakao: { type: Boolean, default: false },
    line: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    using: { type: Boolean, default: false },
    public: { type: Boolean, default: true },
    learn: { type: Boolean, default: false },
    imageFile: { type: String },
    dialogFile: { type:String },
    dialogsets: [{ type: Schema.Types.ObjectId, ref: 'Dialogset'}],
    followed: { type: Number, default: 0 },
    learning: { type: Boolean, default: false },
    templateId: { type: Schema.ObjectId, ref: 'Template' },
    templateDataId: { type: Schema.ObjectId, ref: 'TemplateData' },
    topicKeywords: Schema.Types.Mixed,
    user: { type: Schema.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now }
});

mongoose.model('Bot', BotSchema);

/**
 * Module dependencies.
 */
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

mongoose.model('BotDialogFile', BotDialogFileSchema);


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
// mongoose.model('BotDialog', BotDialogSchema);


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

mongoose.model('BotFollow', BotFollowSchema);


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

mongoose.model('BotComment', BotCommentSchema);


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

mongoose.model('BotDialog', BotDialogSchema);

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

mongoose.model('UserBotFbPage', UserBotFbPageSchema);
