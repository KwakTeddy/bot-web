var async = require('async');

var SimiliarSentences = function () {
    return this;
};

SimiliarSentences.prototype.unionArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) tmp[b[i]]=1;
    for(var k in tmp) res.push(k);
    return res;
}

SimiliarSentences.prototype.intersectArray = function(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) if(tmp[b[i]]) res.push(b[i]);
    return res;
}

SimiliarSentences.prototype.getJarccardScore = function(question, answer) {
    var questionArray = question.split(' ');
    var answerArray = answer.split(' ');
    var intersection = this.intersectArray(questionArray, answerArray);
    var union = this.unionArray(questionArray, answerArray);
    return (parseFloat(intersection.length) / parseFloat(union.length));
}

SimiliarSentences.prototype.stripArray = function(docs) {
    var result = [];
    for (var i=0; i<docs.length; i++) {
        var answer = docs[i];
        if (Array.isArray(answer.inputRaw)) {
            for (var j=0; j<answer.inputRaw.length; j++) {
                //var tempAnswer = docs[i];
                var tempAnswer = Object.assign({}, docs[i]);
                tempAnswer.input = docs[i].input[j];
                tempAnswer.inputRaw = docs[i].inputRaw[j];
                tempAnswer.output = docs[i].output[j];
                result.push(tempAnswer);
            }
        } else {
            result.push(answer);
        }
    }
    return result;
}

function getSimiliarInutRaw(context, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/bot-dev";

    var docs = [];

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        async.eachSeries(context.botUser.nlu.nlp, function (words, _callback) {
            if (words.length <= 1) {
                _callback(null);
            } else {
                var text = words.text;
                var query = {inputRaw: new RegExp('(?:^|\\s)' + text + '(?:$|\\s)', 'i')};
                db.collection("dialogsetdialogs").find(query).toArray(function (err, result) {
                    if (err) throw err;
                    result = SimiliarSentences.prototype.stripArray(result);
                    /*
                    var distance = SimiliarSentences.prototype.getJarccardScore(context.botUser.nlu.sentence.toLowerCase(), result[0].inputRaw.toLowerCase());
                    console.log("sentence: "+context.botUser.nlu.sentence + " / inputRaw: " + result[0].inputRaw + " / " + distance);
                    */


                     for (var i=0; i<result.length; i++) {
                         console.log("sentence: "+context.botUser.nlu.sentence + " / inputRaw: " + result[i].inputRaw + " / " + distance);
                         var distance = SimiliarSentences.prototype.getJarccardScore(context.botUser.nlu.sentence.toLowerCase(), result[i].inputRaw.toLowerCase());
                         result[i]["distance"] = distance;
                         docs.push(result[i]);
                    }

                    db.close();
                    _callback(docs)
                });
            }

        }, function() {
            var uniqDocs = docs.reduce(function(doc1, doc2){
                var isExist = false;
                for (var i=0; i<doc1.length; i++) {
                    if (doc1[i].context && doc2.context) {
                        if (doc1[i].inputRaw == doc2.inputRaw &&
                            doc1[i].context.name == doc2.context.name) {
                            isExist = true;
                            break;
                        }
                    } else {
                        if (doc1[i].inputRaw == doc2.inputRaw && doc1[i].output == doc2.output) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    doc1.push(doc2);
                }
                return doc1;
            },[]);
            callback(uniqDocs);
        });
    });
}
exports.getSimiliarInutRaw = getSimiliarInutRaw;


function getSimiliarOutput(context, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/bot-dev";

    var docs = [];

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        async.eachSeries(context.botUser.nlu.nlp, function (words, _callback) {
            if (words.length <= 1) {
                _callback(null);
            } else {
                var text = words.text;
                var query = {output: new RegExp('(?:^|\\s)' + text + '(?:$|\\s)', 'i')};
                db.collection("dialogsetdialogs").find(query).toArray(function (err, result) {
                    if (err) throw err;
                    result = SimiliarSentences.prototype.stripArray(result);
                    /*
                    var distance = SimiliarSentences.prototype.getJarccardScore(context.botUser.nlu.sentence.toLowerCase(), result[0].inputRaw.toLowerCase());
                    console.log("sentence: "+context.botUser.nlu.sentence + " / inputRaw: " + result[0].inputRaw + " / " + distance);
                    */


                    for (var i=0; i<result.length; i++) {
                        console.log("sentence: "+context.botUser.nlu.sentence + " / output: " + result[i].output + " / " + distance);
                        var distance = SimiliarSentences.prototype.getJarccardScore(context.botUser.nlu.sentence.toLowerCase(), result[i].output.toLowerCase());
                        result[i]["distance"] = distance;
                        docs.push(result[i]);
                    }

                    db.close();
                    _callback(docs)
                });
            }

        }, function() {
            var uniqDocs = docs.reduce(function(doc1, doc2){
                var isExist = false;
                for (var i=0; i<doc1.length; i++) {
                    if (doc1[i].context && doc2.context) {
                        if (doc1[i].inputRaw == doc2.inputRaw &&
                            doc1[i].context.name == doc2.context.name) {
                            isExist = true;
                            break;
                        }
                    } else {
                        if (doc1[i].inputRaw == doc2.inputRaw && doc1[i].output == doc2.output) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    doc1.push(doc2);
                }
                return doc1;
            },[]);
            callback(uniqDocs);
        });
    });
}
exports.getSimiliarOutput = getSimiliarOutput;



/*
    // 입력 문장과 inputRaw 비교
    similiarSentences.getSimiliarInutRaw(context, function (docs) {
        console.log("0-----------------------------");
        console.log(docs.length);
        docs = docs.sort(function(doc1, doc2) {
            return doc2.distance - doc1.distance;
        });
        for (var i=0; i<docs.length; i++) {
            console.log("sentence: " + context.botUser.nlu.sentence + " / inputRaw: " + docs[i].inputRaw + " / " + docs[i].distance);
        }

        console.log("0-----------------------------");
    });

    // 입력 문장과 output 비교
    similiarSentences.getSimiliarOutput(context, function (docs) {
        console.log("0-----------------------------");
        console.log(docs.length);
        docs = docs.sort(function(doc1, doc2) {
            return doc2.distance - doc1.distance;
        });
        for (var i=0; i<docs.length; i++) {
            console.log("sentence: " + context.botUser.nlu.sentence + " / output: " + docs[i].output + " / " + docs[i].distance);
        }

        console.log("0-----------------------------");
    });
 */
