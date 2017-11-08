var path = require('path');
var type = require(path.resolve('./engine/bot/action/common/type.js'));

var dialogset = require(path.resolve('./engine/bot/engine/dialogset/dialogset.js'));

var NLPManager = require(path.resolve('./engine/bot/engine/nlp/nlp-manager.js'));

module.exports.contextAnalytics = function(req, res)
{
    var faqType = {
        name: 'result',
        typeCheck: type.dialogTypeCheck,
        limit: 10,
        matchRate: 0,
        exclude: ['하다', '이다'],
        mongo: {
            model: 'DialogsetDialog',
            // queryStatic: {dialogset: '기본대화1'},
            queryFields: ['input'],
            fields: 'dialogset input output' ,
            taskFields: ['input', 'output', 'matchRate', 'matchCount'],
            minMatch: 1
        }
    };

    if(req.query.dialogsets) {
        var dialogsetIds = undefined;
        if(Array.isArray(req.query.dialogsets)) dialogsetIds = req.query.dialogsets;
        else dialogsetIds = [req.query.dialogsets];

        faqType.mongo.queryStatic = {$or: []};
        for(var i = 0; i < dialogsetIds.length; i++) {
            faqType.mongo.queryStatic.$or.push({dialogset: dialogsetIds[i]});
        }
    }

    var context = { bot: global._bots[req.query.botId], botUser: global._botusers[req.query.botId + ' ' + req.query.userId] };

    var language = 'ko'; //temporary
    NLPManager.processInput(context, req.query.input, language, function(_input, json)
    {
        if(context.botUser == undefined) context.botUser = {};
        // context.botUser.nlp = json._nlp;;
        context.botUser.analytics = true;
        context.botUser.analytics2 = null;

        type.executeType(_input, faqType, {}, context, function(_text, _result)
        {
            _result.context = {botUser: {nlp: context.botUser.nlp, topic: context.botUser.topic}};
            res.json(_result);
            console.log('context analytics: ');
        });
    });
};
