var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    content: String,
    created: { type: Date, default: Date.now },
    email: String
});

mongoose.model('Report', ReportSchema);
