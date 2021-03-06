var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeleBookDataSchema = new Schema(
    {
        bookId : { type: String },
        name : { type: String },
        number : { type: String },
        useYN : { type: Number, default:1 },
        created: { type: Date, default: Date.now }
    });


var TeleBookSchema = new Schema(
    {
        userId : { type: String },
        tag: { type: String },
        fileName : { type: String },
        total : { type: Number, default:0 },
        useYN : { type: Number, default:1 },
        created: { type: Date, default: Date.now }
    });

var SchedulerSchema = new Schema(
    {
        botId : { type: String },
        userId : { type: String },
        registerSeq : { type: Number },
        sender : { type: String },
        totalReceiver : { type: Number },
        sendDate: { type: String },
        created: { type: Date, default: Date.now }
    });

mongoose.model('TeleBookData', TeleBookDataSchema);
mongoose.model('TeleBook', TeleBookSchema);
mongoose.model('Scheduler', SchedulerSchema);

