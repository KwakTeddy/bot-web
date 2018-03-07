var mongoose = require('mongoose');

module.exports = function(globals)
{
    // var userDialogType =
    // {
    //     name: 'typeDoc',
    //     typeCheck: globals.typeChecks.dialogTypeCheck, //type.mongoDbTypeCheck,
    //     preType: function(task, context, type, callback)
    //     {
    //         type.mongo.queryStatic.botId = context.bot.botName;
    //         callback(task, context);
    //     },
    //     limit: 5,
    //     matchRate: 0.3,
    //     matchCount: 4,
    //     mongo:
    //         {
    //             model: 'BotDialog',
    //             queryStatic: {botId: undefined},
    //             queryFields: ['input'],
    //             fields: 'input output' ,
    //             taskFields: ['input', 'output', 'matchRate'],
    //             minMatch: 1
    //         }
    // };
    //
    // globals.setTypes('userDialogType', userDialogType);
    //
    // var dialogsType =
    // {
    //     name: 'typeDoc',
    //     typeCheck: globals.typeChecks.dialogTypeCheck, //type.mongoDbTypeCheck,
    //     preType: function(task, context, type, callback)
    //     {
    //         if(context.bot.dialogsets)
    //         {
    //             if(context.bot.dialogsetOption)
    //             {
    //                 if(context.bot.dialogsetOption.limit)
    //                 {
    //                     type.limit = context.bot.dialogsetOption.limit;
    //                 }
    //
    //                 if(context.bot.dialogsetOption.matchRate)
    //                 {
    //                     type.matchRate = context.bot.dialogsetOption.matchRate;
    //                 }
    //
    //                 if(context.bot.dialogsetOption.matchCount)
    //                 {
    //                     type.matchCount = context.bot.dialogsetOption.matchCount;
    //                 }
    //             }
    //
    //             type.mongo.queryStatic = {$or: []};
    //             for(var i = 0; i < context.bot.dialogsets.length; i++)
    //             {
    //                 if(context.bot.dialogsets[i])
    //                 {
    //                     type.mongo.queryStatic.$or.push({dialogset: context.bot.dialogsets[i]});
    //                 }
    //             }
    //
    //             if(type.mongo.queryStatic.$or.length == 0)
    //             {
    //                 type.mongo.queryStatic = {dialogset: ''};
    //             }
    //         }
    //         else
    //         {
    //             type.mongo.queryStatic = {dialogset: ''};
    //         }
    //
    //         callback(task, context);
    //     },
    //     limit: 5,
    //     matchRate: 0.4,
    //     matchCount: 4,
    //     exclude: ['하다', '이다'],
    //     mongo: {
    //         model: 'dialogsetdialogs',
    //         queryStatic: {dialogset: ''},
    //         queryFields: ['input'],
    //         fields: 'dialogset input inputRaw output context' ,
    //         taskFields: ['input', 'inputRaw', 'output', 'matchCount', 'matchRate', 'dialogset', 'context'],
    //         minMatch: 1,
    //         schema:
    //             {
    //                 dialogset:  { type: mongoose.Schema.ObjectId, ref: 'Dialogset' },
    //                 id: Number,
    //                 input: mongoose.Schema.Types.Mixed,
    //                 inputRaw: mongoose.Schema.Types.Mixed,
    //                 output: mongoose.Schema.Types.Mixed,
    //                 tag: [String],
    //                 parent: mongoose.Schema.Types.Mixed,
    //                 context: { type: mongoose.Schema.ObjectId, ref: 'customcontext' }
    //             }
    //     }
    // };
    //
    // globals.setTypes('dialogsType', dialogsType);
};
