var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));
var type = require(path.resolve('./engine/bot/action/common/type.js'));

var dialogset = require(path.resolve('./engine/bot/engine/dialogset/dialogset.js'));

var NLPManager = require(path.resolve('./engine/bot/engine/nlp/nlp-manager.js'));

var bot = require(path.resolve('./engine/bot/server/controllers/bot.server.controller.js'));

module.exports.contextAnalytics = function(req, res)
{
    var msg = {};
    msg.bot = req.query.botId;
    msg.user = req.query.userId;
    msg.channel = 'socket';
    msg.msg = req.query.input;

    bot.botProc(msg.bot, 'socket', msg.user, msg.msg, msg, function(_out, _task)
    {
        var nlp = _task.inNLP;
        var typeDoc = _task.typeDoc;
        var context = '';

        if(typeDoc && typeDoc.length > 1)
        {
            context = typeDoc[0].context.name;
        }

        var suggestion = global._botusers[msg.bot + '_' + msg.user].nlu.matchInfo.qa;

        res.jsonp({ nlp : nlp, context: context, suggestion: suggestion });
    });
    //     name: 'result',
    //     typeCheck: type.dialogTypeCheck,
    //     limit: 10,
    //     matchRate: 0,
    //     exclude: ['하다', '이다'],
    //     mongo: {
    //         model: 'DialogsetDialog',
    //         // queryStatic: {dialogset: '기본대화1'},
    //         queryFields: ['input'],
    //         fields: 'dialogset input output' ,
    //         taskFields: ['input', 'output', 'matchRate', 'matchCount'],
    //         minMatch: 1
    //     }
    // };

    // if(req.query.dialogsets) {
    //     var dialogsetIds = undefined;
    //     if(Array.isArray(req.query.dialogsets)) dialogsetIds = req.query.dialogsets;
    //     else dialogsetIds = [req.query.dialogsets];
    //
    //     faqType.mongo.queryStatic = {$or: []};
    //     for(var i = 0; i < dialogsetIds.length; i++) {
    //         faqType.mongo.queryStatic.$or.push({dialogset: dialogsetIds[i]});
    //     }
    // }
    //
    // faqType.mongo.queryStatic = {$or: [{ dialogset: '5a02d191e012fa941181061b' }]};
    //
    // console.log('봇 : ' + JSON.stringify(global._bots[req.query.botId]));
    //
    // var context = { bot: {}, botUser: global._botusers[req.query.botId + ' ' + req.query.userId] };
    //
    // var language = 'ko'; //temporary
    // NLPManager.processInput(context, req.query.input, language, function(_input, json)
    // {
    //     if(context.botUser == undefined) context.botUser = {};
    //     // context.botUser.nlp = json._nlp;;
    //     context.botUser.analytics = true;
    //     context.botUser.analytics2 = null;
    //
    //     type.executeType(_input, faqType, {}, context, function(_text, _result)
    //     {
    //         console.log('컨텍스트 : ' + JSON.stringify(context.botUser.nlu));
    //         _result.context = {botUser: {nlp: context.botUser.nlp, topic: context.botUser.topic}};
    //         res.json(_result);
    //         console.log('context analytics: ');
    //     });
    // });
};
