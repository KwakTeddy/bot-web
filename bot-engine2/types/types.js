var mongoose = require('mongoose');

var typechecker = require('./typechecker.js');

module.exports.mobileType =
{
    name: 'mobile',
    raw: true,
    typeCheck: typechecker.regexpTypeCheck.bind(this),
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text)
    {
        if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
        else if(text.length < 13) return '자리수가 맞지 않습니다';
        else return '휴대폰전화번호 형식으로 입력해 주세요';
    }
};

module.exports.dateType =
{
    name: 'date',
    typeCheck: typechecker.regexpTypeCheck.bind(this),
    regexp: /(\d{4}[-/.년][ ]?(?:0[1-9]|1[012]|[1-9])[-/.월][ ]?(?:0[1-9]|[12][0-9]|3[0-1]|[1-9])[일]?)/g
};

module.exports.userDialogType =
    {
        name: 'typeDoc',
        typeCheck: typechecker.dialogTypeCheck, //type.mongoDbTypeCheck,
        preType: function(task, context, type, callback)
        {
            type.mongo.queryStatic.botId = context.bot.botName;
            callback(task, context);
        },
        limit: 5,
        matchRate: 0.3,
        matchCount: 4,
        mongo:
            {
                model: 'BotDialog',
                queryStatic: {botId: undefined},
                queryFields: ['input'],
                fields: 'input output' ,
                taskFields: ['input', 'output', 'matchRate'],
                minMatch: 1
            }
    };

module.exports.dialogsType =
    {
        name: 'typeDoc',
        typeCheck: typechecker.dialogTypeCheck, //type.mongoDbTypeCheck,
        preType: function(task, context, type, callback)
        {
            if(context.bot.dialogsets)
            {
                if(context.bot.dialogsetOption)
                {
                    if(context.bot.dialogsetOption.limit) type.limit = context.bot.dialogsetOption.limit;
                    if(context.bot.dialogsetOption.matchRate) type.matchRate = context.bot.dialogsetOption.matchRate;
                    if(context.bot.dialogsetOption.matchCount) type.matchCount = context.bot.dialogsetOption.matchCount;
                }

                type.mongo.queryStatic = {$or: []};
                for(var i = 0; i < context.bot.dialogsets.length; i++)
                {
                    if(context.bot.dialogsets[i])
                        type.mongo.queryStatic.$or.push({dialogset: context.bot.dialogsets[i]});
                }

                if(type.mongo.queryStatic.$or.length == 0)
                {
                    type.mongo.queryStatic = { dialogset: '' };
                }
            }
            else
            {
                type.mongo.queryStatic = { dialogset: '' };
            }

            callback(task, context);
        },
        limit: 5,
        matchRate: 0.4,
        matchCount: 4,
        exclude: ['하다', '이다'],
        mongo:
            {
                model: 'dialogsetdialogs',
                queryStatic: { dialogset: '' },
                queryFields: ['input'],
                fields: 'dialogset input inputRaw output context' ,
                taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
                minMatch: 1,
                schema: {
                    dialogset:
                        {
                            type: mongoose.Schema.ObjectId,
                            ref: 'Dialogset'
                        },
                    id: Number,
                    input: mongoose.Schema.Types.Mixed,
                    inputRaw: mongoose.Schema.Types.Mixed,
                    output: mongoose.Schema.Types.Mixed,
                    tag: [String],
                    parent: mongoose.Schema.Types.Mixed,
                    context:
                        {
                            type: mongoose.Schema.ObjectId,
                            ref: 'CustomContext'
                        }
                }
            }
    };
