var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BotUserSchema = new Schema(
{
    userKey: { type: String },
    channel: { type: String },
    name: { type: String },
    mobile: String,
    phone: { type: String },
    email: { type: String },
    isOn: { type: Boolean },
    address: Object,
    lng: Number,
    lat: Number,
    created: { type: Date, default: Date.now },
    confirmTerms: Boolean,
    botId: []
});

mongoose.model('BotUser', BotUserSchema);

var BotUserMemoSchema = new Schema(
{
    userKey: { type: String },
    botId: { type: String },
    created: { type: Date, default: Date.now },
    memo: String
});

mongoose.model('BotUserMemo', BotUserMemoSchema);


var UserDialogSchema = new Schema(
{
    botId: { type: String },
    userId: { type: String },
    channel: { type: String },
    inOut: { type: Boolean },
    fail: { type: Boolean },
    dialog: { type: String },
    nlpDialog: { type: String },
    dialogId: { type: String },
    dialogName: { type: String },
    preDialogId: { type: String },
    preDialogName: { type: String },
    created: { type: Date, default: Date.now },
    clear: { type: String },
    liveChat: { type: Boolean }
});

mongoose.model('UserDialog', UserDialogSchema);


var UserDialogLogSchema = new Schema({
    botId: {
        type: String
    },

    userId: {
        type: String
    },

    channel: {
        type: String
    },

    year: {
        type: Number,
        default: (new Date()).getYear() + 1900
    },
    month: {
        type: Number,
        default: (new Date()).getMonth() + 1
    },
    date: {
        type: Number,
        default: (new Date()).getDate()
    },

    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('UserDialogLog', UserDialogLogSchema);
