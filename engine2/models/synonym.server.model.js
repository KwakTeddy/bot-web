var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SynonymDictionarySchema = new Schema(
{
    botId: String,
    words: [String]
});

mongoose.model('SynonymDictionary', SynonymDictionarySchema);
