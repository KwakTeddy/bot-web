var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoWrapper = require('../utils/mongo-wrapper.js');

var FailInputRawSchema = new Schema(
{
    botId: String,
    inputRaw: String,
    input: String,
    ignored: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

mongoWrapper.model('FailInputRaw', FailInputRawSchema);
