var openNLP = require("./opennlp.js");
var posTagger = new openNLP().posTagger;
var sentence = 'Pierre Vinken , 61 yearsold , will join the board as a nonexecutive director Nov. 29 .';

<<<<<<< HEAD
// var tokenizer = new openNLP().tokenizer;
// tokenizer.tokenize(sentence, function(err, results) {
//     console.log(err, results);
// })
=======
var tokenizer = new openNLP().tokenizer;
tokenizer.tokenize(sentence, function(err, results) {
    console.log(err, results);
})
>>>>>>> 51a839c60dfe146625faf23e2ea8b3c5c33ea36a

posTagger.tag(sentence, function(err, tokens_arr) {
    console.log(tokens_arr)
});
