module.exports = function(globals)
{
    // var globalStartDialogs =
    // [
    //     {
    //         input: {types: [{typeCheck: globals.typeChecks.factsTypeCheck}]},
    //         output: '+_output+'
    //     },
    //     {
    //         input: [{if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useBotDialog != false', types: [globals.types.userDialogType]}],
    //         task:
    //             {
    //                 action: function(task, context, callback)
    //                 {
    //                     if(Array.isArray(task.typeDoc))
    //                     {
    //                         if(task.typeDoc.length > 1)
    //                         {
    //                             task._output = task.typeDoc[0].output;
    //                         }
    //                         else
    //                         {
    //                             task._output = task.typeDoc[0].output;
    //                         }
    //                     }
    //                     else
    //                     {
    //                         task._output = task.typeDoc.output;
    //                     }
    //
    //                     if(Array.isArray(task._output))
    //                     {
    //                         task._output = task._output[Math.floor(Math.random() * task._output.length)];
    //                     }
    //
    //                     callback(task, context);
    //                 }
    //             },
    //         output: '+_output+'
    //     }
    // ];
    //
    // globals.setDialogs('startDialogs', globalStartDialogs);
    //
    // var globalEndDialogs = [
    // {
    //     input: [{if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useDialogset != false', types: [globals.types.dialogsType]}],
    //     task:
    //         {
    //             action: function(task, context, callback)
    //             {
    //                 if(Array.isArray(task.typeDoc))
    //                 {
    //                     if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList && (context.bot.dialogsetOption.matchOneRate == undefined || context.bot.dialogsetOption.matchOneRate > task.typeDoc[0].matchRate) && (context.bot.dialogsetOption.matchOneCount == undefined || context.bot.dialogsetOption.matchOneCount > task.typeDoc[0].matchCount))
    //                     {
    //                         context.dialog.typeDoc = task.typeDoc;
    //                         if(context.bot.dialogsetOption.listOutput)
    //                         {
    //                             context.dialog.output = context.bot.dialogsetOption.listOutput;
    //                         }
    //                         else
    //                         {
    //                             context.dialog.output = '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n\n# 번호를 입력해 주세요.';
    //                         }
    //
    //                         context.dialog.children =
    //                             [
    //                                 {
    //                                     input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
    //                                     output: (context.bot.dialogsetOption.contentOutput ? context.bot.dialogsetOption.contentOutput : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
    //                                 }
    //                             ];
    //                     }
    //                     else if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList && task.typeDoc.length > 1 && (task.typeDoc[0].matchCount == task.typeDoc[1].matchCount))
    //                     {
    //                         var dialogs = [];
    //                         for(var i = 0; i < task.typeDoc.length; i++)
    //                         {
    //                             if(i == 0)
    //                             {
    //                                 dialogs.push(task.typeDoc[i]);
    //                             }
    //                             else if(dialogs[dialogs.length - 1].matchCount != task.typeDoc[i].matchCount)
    //                             {
    //                                 break;
    //                             }
    //                             else
    //                             {
    //                                 dialogs.push(task.typeDoc[i]);
    //                             }
    //                         }
    //
    //                         task.typeDoc = dialogs;
    //
    //                         context.dialog.typeDoc = task.typeDoc;
    //                         context.dialog.output = "아래 중에 궁금하신 내용이 있나요?\n\n#typeDoc#+index+. +inputRaw+\n\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요";
    //
    //                         context.dialog.children =
    //                             [
    //                                 {
    //                                     input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
    //                                     output: (context.bot.dialogsetOption.contentOutput ? context.bot.dialogsetOption.contentOutput : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
    //                                 }
    //                             ];
    //                     }
    //                     else
    //                     {
    //                         if(task.typeDoc.length > 1)
    //                         {
    //                             task._output = task.typeDoc[0].output;
    //                         }
    //                         else
    //                         {
    //                             task._output = task.typeDoc[0].output;
    //                         }
    //
    //                         if(Array.isArray(task._output))
    //                         {
    //                             task._output = task._output[Math.floor(Math.random() * task._output.length)];
    //                         }
    //
    //                         context.dialog.output = '+_output+';
    //                         context.dialog.children = null;
    //                     }
    //                 }
    //                 else
    //                 {
    //                     if(Array.isArray(task.typeDoc.output))
    //                     {
    //                         var index = Math.floor(Math.random() * task.typeDoc.output.length);
    //                         task._output = task.typeDoc.output[index];
    //                         console.log('index: ' + index + ', ' + task._output)
    //                     }
    //                     else
    //                     {
    //                         task._output = task.typeDoc.output;
    //                     }
    //
    //                     context.dialog.output = '+_output+';
    //                     context.dialog.children = null;
    //                 }
    //
    //                 callback(task, context);
    //             }
    //         },
    //     output: '+_output+'
    // }];
    //
    // globals.setDialogs('endDialogs', globalEndDialogs);
};
