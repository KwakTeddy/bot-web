var path = require('path');

// var PROTO_PATH = __dirname + '/chatbotservice.proto';
//
// var grpc = require('grpc');
// var ChatbotService = grpc.load(PROTO_PATH, 'proto').ChatbotService;
// var client = new ChatbotService.ChatbotService('52.38.34.39:50051', grpc.credentials.createInsecure());

var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

module.exports = function (io, socket)
{
    socket.on('deeplearning', function(msg)
    {
        client.emotion({ sentence: msg.msg }, function(err, response)
        {
            if (err)
                console.error(err);

            socket.emit('response-dl', response);
        });
    });

    socket.on('analytics', function(msg)
    {
        var Engine = require(path.resolve('./engine2/core.js'));
        Engine.process(msg.bot, 'socket', msg.user, msg.msg, {}, function(context, result)
        {
            var nlp = context.userInput.nlp;
            var suggestion = context.demo;
            var turnTaking = context.userInput.turnTaking;
            var entities = context.userInput.entities;
            var intents = context.userInput.intents;
            var language = lngDetector.detect(msg.msg);
            var context = context.session.currentCategory;

            socket.emit('response-analytics', { nlp: nlp, context: context, suggestion: suggestion, turnTaking: turnTaking, entities: entities, intents: intents, language: language  });

        });
        // bot.botProc(msg.bot, 'socket', msg.user, msg.msg, msg, function(_out, _task)
        // {
        //     var nlp = '';
        //     var context = '';
        //     var suggestion = [];
        //
        //     var entities = global._botusers[msg.bot + '_' + msg.user].entities;
        //     var nlu = global._botusers[msg.bot + '_' + msg.user].nlu;
        //     var turnTaking = global._botusers[msg.bot + '_' + msg.user].nlu.turnTaking;
        //
        //     if(_task)
        //     {
        //         nlp = _task.inNLP;
        //         var typeDoc = _task.typeDoc;
        //         context = '';
        //
        //         if(typeDoc && typeDoc.length > 1 && typeDoc[0].context)
        //         {
        //             context = typeDoc[0].context.name;
        //         }
        //
        //         suggestion = global._botusers[msg.bot + '_' + msg.user].nlu.matchInfo.qa;
        //     }
        //
        //     console.log(msg.msg);
        //
        //     socket.emit('response-analytics', { nlp : nlp, context: context, suggestion: suggestion, turnTaking: turnTaking, entities: entities, nlu: nlu, language: lngDetector.detect(msg.msg) });
        //
        // }, { dev: true, language: 'ko' });
    })
};

// module.exports.deepLearning = function(req, res)
// {
//     // client.sayHello({name: req.query.user}, function(err, response)
//     // {
//     //     res.jsonp({ message: 'Greeting:' + response.message });
//     // });
// };
//
// module.exports.contextAnalytics = function(req, res)
// {
//     var msg = {};
//     msg.bot = req.query.botId;
//     msg.user = req.query.userId;
//     msg.channel = 'socket';
//     msg.msg = req.query.input;
//
//     bot.botProc(msg.bot, 'socket', msg.user, msg.msg, msg, function(_out, _task)
//     {
//         var nlp = '';
//         var context = '';
//         var suggestion = [];
//
//         var entities = global._botusers[msg.bot + '_' + msg.user].entities;
//         var nlu = global._botusers[msg.bot + '_' + msg.user].nlu;
//         var turnTaking = global._botusers[msg.bot + '_' + msg.user].nlu.turnTaking;
//
//         if(_task)
//         {
//             nlp = _task.inNLP;
//             var typeDoc = _task.typeDoc;
//             context = '';
//
//             if(typeDoc && typeDoc.length > 1 && typeDoc[0].context)
//             {
//                 context = typeDoc[0].context.name;
//             }
//
//             suggestion = global._botusers[msg.bot + '_' + msg.user].nlu.matchInfo.qa;
//         }
//
//
//
//     }, { dev: true, language: req.query.language });
// };
