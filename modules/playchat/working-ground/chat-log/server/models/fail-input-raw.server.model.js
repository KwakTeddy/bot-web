var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FailInputRawSchema = new Schema(
{
    botId: String,
    inputRaw: String,
    input: String,
    ignored: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

mongoose.model('FailInputRaw', FailInputRawSchema);
