var request = require("request");
var queryString = require('querystring');
var async = require('async');

function processInput(context, inRaw, callback) {

    var inNLP, nlpAll = [], _nlp = [];

    async.waterfall([
        function(cb) {
            var text = queryString.escape(inRaw);
            var url = 'http://localhost:8080/moneybrain.ncue?cmd=analyzePOS&language=en'+'&text='+text;
            request.get(url, function (err, result) {
                if (err) throw err;

                var nlpJsonPOS = result.body
                context.botUser["nlu"] = {};
                context.botUser.nlu["sentence"] = inRaw;
                context.botUser.nlu["pos"] = nlpJsonPOS;

                context.botUser["inNLP"] = text;
                context.botUser.nlpAll = nlpJsonPOS;
                context.botUser.nlp = nlpJsonPOS;
            });
        },
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze(context);
            context.botUser.nlu["sentenceInfo"] = value;

            cb(null);
        }
    ], function(err) {
        context.botUser.nlpCorrection = undefined;
        context.botUser.inRawCorrection = undefined;
        context.botUser.wordCorrection = undefined;

        callback(inNLP, null, null);
    });

}

exports.processInput = processInput;
