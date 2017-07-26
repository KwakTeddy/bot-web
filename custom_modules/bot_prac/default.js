var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('bot_prac');
var logger = require(path.resolve('./config/lib/logger'));
// var regexpTypeCheck = require(path.resolve('./modules/bot/global/type/common.type'));


const IN_TAG_START = '{';
const IN_TAG_END = '}';




var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var myname = {
    name: 'myname',
    typeCheck: regexpTypeCheck,
    regexp: /(.*)/,
    raw: true
};
bot.setType("myname", myname);


function regexpTypeCheck (text, type, task, context, callback) {
    var re = type.regexp;
    var matched = false;
    console.log('typecheck11');
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
};
