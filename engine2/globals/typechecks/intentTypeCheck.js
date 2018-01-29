module.exports = function(globals)
{
    var intentCheck = {
        name: 'intentDoc',
        typeCheck: globals.typeChecks['dialogTypeCheck'], //type.mongoDbTypeCheck,
        limit: 10,
        matchRate: 0.4,
        matchCount: 4,
        // exclude: ['하다', '이다'],
        mongo: {
            model: 'intentcontent',
            queryFields: ['input'],
            fields: 'input intentId' ,
            taskFields: ['input', 'intentId', 'matchCount', 'matchRate'],
            minMatch: 1
        },
        preType: function(task, context, type, callback) {
            type.mongo.queryStatic = {};
            if(type.typeCheck == undefined) type.typeCheck =globals.typeChecks['dialogTypeCheck'];

            if(context.bot.intents && context.bot.intents.length > 0) {
                var _intents = [];
                for(var i in context.bot.intents) {
                    _intents.push(context.bot.intents[i]._id);
                }
                type.mongo.queryStatic = {intentId: {$in: _intents}};
            } else {
                type.mongo.queryStatic.intentId = null;
            }

            callback(task, context);
        }
    };

    globals.setTypeChecks('intentCheck', intentCheck);
};
