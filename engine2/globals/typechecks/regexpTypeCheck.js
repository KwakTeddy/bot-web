module.exports = function(globals)
{
    globals.setTypeChecks('regexpTypeCheck', function (text, type, task, context, callback)
    {
        var re = type.regexp;
        var matched = false;

        logger.debug('');
        logger.debug('type.js:regexpTypeCheck: START ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

        text = text.replace(re, function(match, p1, offset, string) {
            matched = true;

            // if(task[type.name]) {
            //   if(Array.isArray(task[type.name])) task[type.name].push(p1);
            //   else task[type.name] = [task[type.name], p1];
            // } else {
            task[type.name] = p1;
            // }

            return IN_TAG_START + type.name + IN_TAG_END;
        });

        if(matched)
            logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

        callback(text, task, matched);
    });
};
