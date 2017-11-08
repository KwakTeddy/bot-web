var openNLP = require("./opennlp.js");
var posTagger = new openNLP().posTagger;
var sentence = 'Pierre Vinken , 61 yearsold , will join the board as a nonexecutive director Nov. 29 .';

var tokenizer = new openNLP().tokenizer;
tokenizer.tokenize(sentence, function(err, results) {
    console.log(err, results);
})

posTagger.tag(sentence, function(err, tokens_arr) {
    console.log(tokens_arr)
});
