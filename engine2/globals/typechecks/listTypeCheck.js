module.exports = function(globals)
{
    globals.setTypeChecks('listTypeCheck', function(text, type, task, context, callback)
    {
        var inRawText = text.replace(/\s/g, '');

        var listName;
        if(type.listName) listName = type.listName;
        else listName= type.name;
        var list = (task[listName] ? task[listName] : context.dialog[listName]);

        for (var j = 0; list && j < list.length; j++) {
            var item;
            if(type.field) item = list[j][type.field];
            else if(list[j]['name']) item = list[j]['name'];
            else if(typeof list[j] == 'string') item = list[j];
            else continue;

            if(item) {
                item = item.replace(' ', '');

                var re = new RegExp(inRawText, 'i');
                if(item.search(re) != -1) {
                    context.dialog[type.name] = /*task[type.name] = */list[j];

                    callback(text, task, true);
                    return;
                }
            }
        }

        var words = text.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];

            var _num = Number(word);

            if(!_num) {
                _num = Number(typelib.parseNumber(word));
            }

            var num;
            if(context.dialog.page) {
                num = (context.dialog.page - 1) * typelib.LIST_PER_PAGE + _num;
            } else {
                num = _num;
            }

            list = (task[listName] ? task[listName] : context.dialog[listName]);
            if(list && num >= 1 && num <= list.length) {
                context.dialog[type.name] = /*task[type.name] = */list[num - 1];

                callback(text, task, true);
                return;
            }
        }

        // list word match
        var maxEqual = false;
        var maxIndex = -1, maxCount = 0;
        var matchedList = [];
        list = (task[listName] ? task[listName] : context.dialog[listName]);
        for (var j = 0; list && j < list.length; j++) {
            var item;
            if(type.field) item = list[j][type.field];
            else if(list[j]['name']) item = list[j]['name'];
            else if(typeof list[j] == 'string') item = list[j];

            if(item) {
                var matchCount = 0;
                var words = text.split(' ');
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];

                    if(word.length == 1) continue;
                    word = RegExp.escape(word);
                    // console.log(item);

                    var re = new RegExp(word, 'i');
                    if(item.search(re) != -1) matchCount++;
                    // if(item.search(word) != -1) matchCount++;
                }

                if(matchCount > maxCount) {
                    maxCount = matchCount;
                    maxIndex = j;
                } else if(matchCount > 0 && matchCount == maxCount) {
                    matchedList.push(list[j]);
                    maxEqual = true;
                }
            }
        }

        if(maxIndex != -1 && !maxEqual) {
            context.dialog[type.name] = /*task[type.name] = */list[maxIndex];
            callback(text, task, true);
        } else if(maxIndex != -1 && maxEqual) {
            context.dialog[type.name] = matchedList;
            callback(text, task, false);
        } else
            callback(text, task, false);
    });
};
