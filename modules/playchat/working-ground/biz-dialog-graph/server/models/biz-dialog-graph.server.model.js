var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SentencesSchema = new Schema(
    {
        templateId : {type : String},
        name: { type: String },
        input: Schema.Types.Mixed,
        inputRaw: Schema.Types.Mixed,
        output: Schema.Types.Mixed,
        children: Schema.Types.Mixed,
        useYN : { type: Number, default:1 },
        created: { type: Date, default: Date.now }
    });

mongoose.model('Sentences', SentencesSchema);


var ScriptsSchema = new Schema(
    {
        name: { type: String },
        code: { type: String },
        type: { type: String },
        useYN : { type: Number, default:1 },
        created: { type: Date, default: Date.now }
    });

mongoose.model('Scripts', ScriptsSchema);
