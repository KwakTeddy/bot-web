var request = require("request");
var queryString = require('querystring');
var async = require('async');
var path = require('path');
var SentenceInfo = require(path.resolve('./modules/bot/engine/nlp/sentenceInfo.js'));
var TurnTaking = require(path.resolve('./modules/bot/engine/nlp/turnTaking.js'));


function processInput(context, inRaw, callback) {

    var inNLP, nlpAll = [], _nlp = [];

    async.waterfall([
        function(cb) {
            var text = queryString.escape(inRaw);
            var url = 'http://localhost:8080/moneybrain.ncue?cmd=analyzePOS&language=en'+'&text='+text;
            request.get(url, function (err, result) {
                if (err) throw err;

                inNLP = inRaw;

                if (context == null) {
                    context = {};
                }
                if (!("botUser" in context)) {
                    context["botUser"] = {}
                }
                if (!("nlu" in context["botUser"])) {
                    context.botUser["nlu"] = {};
                }

                // 추후 Json parsing해서 수정 필요함 (dsyoon)
                var nlpJsonPOS = result.body
                context.botUser.nlu["sentence"] = inRaw;
                context.botUser.nlu["pos"] = nlpJsonPOS;

                context.botUser["inNLP"] = text;
                context.botUser.nlpAll = nlpJsonPOS;
                context.botUser.nlp = nlpJsonPOS;
            });
        },
        // 문장의 형식 찾기
        // dsyoon (2017. 09. 13.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var sentenceInfo = new SentenceInfo();
            var value = sentenceInfo.analyze("en", context.botUser.nlu);
            context.botUser.nlu["sentenceInfo"] = value;

            cb(null);
        },
        // turn taking할지 분석 (0: 사용자가 계속 말하게 둔다. 1: 봇이 발화한다.
        // dsyoon (2017. 09. 19.)
        // 사용자 사전 경로: ./external_module/resources/ko/user.pos
        function(cb) {
            var turnTaking = new TurnTaking();
            var value = turnTaking.analyze("en", context.botUser.nlu);
            context.botUser.nlu["turnTaking"] = value;

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
