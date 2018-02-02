module.exports = function(globals)
{
    globals.setTypeChecks('numberListTypeCheck', function(text, type, task, context, callback)
    {
        var num = Number(text);

        if (task[type.name] && num >= 1 && num <= task[type.name].length) {
            context.dialog[type.name] = task[type.name] = task[type.name][num - 1];

            // TODO 목록 선택시 텍스트 변경
            // if (task.in && task[paramDef.name]['matchOriginal']) {
            //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
            //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
            // }

            callback(text, task, true);
        } else if (context.dialog[type.name] && num >= 1 && num <= context.dialog[type.name].length) {
            context.dialog[type.name] = task[type.name] = context.dialog[type.name][num - 1];

            callback(text, task, true);
        } else {
            callback(text, task, false);
        }
    });
};
