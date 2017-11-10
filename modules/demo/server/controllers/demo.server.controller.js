var path = require('path');

var bot = require(path.resolve('./engine/bot/server/controllers/bot.server.controller.js'));

var PROTO_PATH = __dirname + '/chatbotservice.proto';
//
var grpc = require('grpc');
// var ChatbotService = grpc.load(PROTO_PATH, 'proto').ChatbotService;
// var client = new ChatbotService.ChatbotService('10.7.9.39:50051', grpc.credentials.createInsecure());

module.exports = function (io, socket)
{
    console.log('데모 소켓 커넥션');
    socket.on('deeplearning', function(msg)
    {
        client.emotion({ sentence: msg.msg }, function(err, response)
        {
            if (err)
                console.error(err);
            else
                console.log('GRPC------------------' + response);

            socket.emit('response-dl', response);
        });
    });

    socket.on('analytics', function(msg)
    {
        console.log('에미 :  ', msg);
        bot.botProc(msg.bot, 'socket', msg.user, msg.msg, msg, function(_out, _task)
        {
            var nlp = '';
            var context = '';
            var suggestion = [];

            var entities = global._botusers[msg.bot + '_' + msg.user].entities;
            var nlu = global._botusers[msg.bot + '_' + msg.user].nlu;
            var turnTaking = global._botusers[msg.bot + '_' + msg.user].nlu.turnTaking;

            if(_task)
            {
                nlp = _task.inNLP;
                var typeDoc = _task.typeDoc;
                context = '';

                if(typeDoc && typeDoc.length > 1 && typeDoc[0].context)
                {
                    context = typeDoc[0].context.name;
                }

                suggestion = global._botusers[msg.bot + '_' + msg.user].nlu.matchInfo.qa;
            }

            socket.emit('response-analytics', { nlp : nlp, context: context, suggestion: suggestion, turnTaking: turnTaking, entities: entities, nlu: nlu });

        }, { dev: true, language: msg.options.language });
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
