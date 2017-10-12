var commonTypes = require('./common-types.js');
var typechecks = require('./common-typechecks.js');

const START_DIALOG_NAME = '시작';
exports.START_DIALOG_NAME = START_DIALOG_NAME;
const NO_DIALOG_NAME = '답변없음';
exports.NO_DIALOG_NAME = NO_DIALOG_NAME;

function findDialog(dialog, context, name)
{
    // if(findGlobalDepth > 100) return null;
    if (dialog == null)
    {
        for (var i = 0; context.bot.dialogs && i < context.bot.dialogs.length; i++)
        {
            var dialog = context.bot.dialogs[i];

            if(dialog == null)
                continue;

            var found = findDialog(dialog, context, name);

            if(found)
                return found;
        }

        for (var i = 0; context.bot.commonDialogs && i < context.bot.commonDialogs.length; i++)
        {
            var dialog = context.bot.commonDialogs[i];

            if(dialog == null)
                continue;
            var found = findDialog(dialog, context, name);

            if(found)
                return found;
        }

        return null;
    }
    else if(dialog.name == name)
    {
        return dialog;
    }
    else if(Array.isArray(dialog.children))
    {
        for (var i = 0; i < dialog.children.length; i++)
        {
            var rejoinder = dialog.children[i];

            if(rejoinder == null)
                continue;

            var found = findDialog(rejoinder, context, name);

            if (found)
                return found;
        }

        return null;
    }
    else if(Array.isArray(dialog.output))
    {
        for (var i = 0; i < dialog.output.length; i++)
        {
            var output = dialog.output[i];

            if(output == null)
                continue;

            var found = findDialog(output, context, name);

            if (found)
                return found;
        }

        return null;
    }
    else
    {
        return null;
    }
};

function findGlobalDialog(dialog, context, name)
{
    if (dialog == null)
    {
        for (var i = 0; context.bot.commonDialogs && i < context.bot.commonDialogs.length; i++)
        {
            var dialog = context.bot.commonDialogs[i];
            var found = findDialog(dialog, context, name);
            if(found) return found;
        }
        return null;
    }
    else if (dialog.name == name)
    {
        return dialog;
    }
    else if(Array.isArray(dialog.children))
    {
        for (var i = 0; i < dialog.children.length; i++)
        {
            var rejoinder = dialog.children[i];
            var found = findDialog(rejoinder, context, name);
            if(found)
                return found;
        }

        return null;
    }
    else
    {
        return null;
    }
};

module.exports.findDialog = findDialog;
module.exports.findGlobalDialog = findGlobalDialog;


module.exports.globalStartDialogs =
[
    {
        input: { types: [{ typeCheck: typechecks.factsTypeCheck }] },
        output: '+_output+'
    },
    {
        input: {if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useBotDialog != false', types: [commonTypes.userDialogType]},
        task:
            {
                action: function(task, context, callback)
                {
                    if(Array.isArray(task.typeDoc))
                    {
                        if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
                        else task._output = task.typeDoc[0].output;
                    }
                    else
                    {
                        task._output = task.typeDoc.output;
                    }

                    if(Array.isArray(task._output))
                    {
                        task._output = task._output[Math.floor(Math.random() * task._output.length)];
                    }

                    callback(task, context);
                }
            },
        output: '+_output+'
    }
];

module.exports.globalEndDialogs =
[
    {
        input: {if: 'context.bot.dialogsetOption == undefined || context.bot.dialogsetOption.useDialogset != false', types: [commonTypes.dialogsType]},
        task:   {
            action: function(task, context, callback) {

                if(Array.isArray(task.typeDoc)) {
                    if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList &&
                       (context.bot.dialogsetOption.matchOneRate == undefined || context.bot.dialogsetOption.matchOneRate > task.typeDoc[0].matchRate) &&
                       (context.bot.dialogsetOption.matchOneCount == undefined || context.bot.dialogsetOption.matchOneCount > task.typeDoc[0].matchCount)) {
                        context.dialog.typeDoc = task.typeDoc;
                        if(context.bot.dialogsetOption.listOutput) {
                            context.dialog.output = context.bot.dialogsetOption.listOutput;
                        } else {
                            context.dialog.output = '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n\n# 번호를 입력해 주세요.';
                        }

                        context.dialog.children = [
                            {
                                input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
                                output: (context.bot.dialogsetOption.contentOutput ?
                                    context.bot.dialogsetOption.contentOutput
                                    : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
                            }
                        ];
                    } else if(context.bot.dialogsetOption && context.bot.dialogsetOption.matchList && task.typeDoc.length > 1 &&
                              (task.typeDoc[0].matchCount == task.typeDoc[1].matchCount)) {

                        var dialogs = [];
                        for(var i = 0; i < task.typeDoc.length; i++) {
                            if(i == 0) dialogs.push(task.typeDoc[i]);
                            else if(dialogs[dialogs.length - 1].matchCount != task.typeDoc[i].matchCount) break;
                            else dialogs.push(task.typeDoc[i]);
                        }
                        task.typeDoc = dialogs;

                        context.dialog.typeDoc = task.typeDoc;
                        // if (context.bot.dialogsetOption.listOutput) {
                        //   context.dialog.output = context.bot.dialogsetOption.listOutput;
                        // } else {
                        context.dialog.output = "아래 중에 궁금하신 내용이 있나요?\n\n#typeDoc#+index+. +inputRaw+\n\n#번호를 입력하면 상세 내용을 보여드립니다.\n다시 검색하시려면 검색어를 입력해주세요.\n처음으로 돌아가시려면 '시작'이라고 말씀해주세요";
                        // }

                        context.dialog.children = [
                            {
                                input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
                                output: (context.bot.dialogsetOption.contentOutput ?
                                    context.bot.dialogsetOption.contentOutput
                                    : '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n')
                            }
                        ];

                    } else {
                        if(task.typeDoc.length > 1) task._output = task.typeDoc[0].output;
                        else task._output = task.typeDoc[0].output;

                        if(Array.isArray(task._output)) {
                            task._output = task._output[Math.floor(Math.random() * task._output.length)];
                        }

                        context.dialog.output = '+_output+';
                        context.dialog.children = null;
                        //
                        // console.log(task.typeDoc[0].inputRaw + ', ' + task.typeDoc[0].input + '(' + task.typeDoc[0].matchCount + ', ' + task.typeDoc[0].matchRate + ')');
                    }

                } else {
                    task._output = task.typeDoc.output;

                    if(Array.isArray(task._output)) {
                        task._output = task._output[Math.floor(Math.random() * task._output.length)];
                    }

                    context.dialog.output = '+_output+';
                    context.dialog.children = null;
                    // console.log(task.typeDoc.inputRaw + ', ' + task.typeDoc.input + '(' + task.typeDoc.matchCount + ', ' + task.typeDoc.matchRate + ')');
                }

                callback(task, context);
            }

            // postCallback: function(task, context, callback) {
            //   var toneType = context.botUser.tone;
            //   if(toneType == undefined) toneType = '해요체';
            //
            //   tone.toneSentence(task._output, toneType, function(_output) {
            //     task._output = _output;
            //     callback(task, context);
            //   });
            // }
        },
        output: '+_output+'
        // output: '질문에 가장 유사한 답변을 찾았습니다.\n\n#typeDoc#+index+. +inputRaw+\n# 번호를 입력해 주세요.',
        // children: [
        //   {
        //     input: {types: [{name: 'doc1', listName: 'typeDoc', typeCheck: 'listTypeCheck'}]},
        //     output: '[+doc1.inputRaw+]\n+doc1.output+\n\n더 필요하신 게 있으시면 말씀해주세요~\n'
        //   }
        // ]
    }
];
