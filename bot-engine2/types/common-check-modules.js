var path = require('path');
var logger = require(path.resolve('./config/lib/logger.js'));

const IN_TAG_START = '{';
const IN_TAG_END = '}';

module.exports.regexpTypeCheck = function (rawText, done)
{
    var result = {};
    var re = this.regexp;
    var matched = false;

    logger.systemLog('');
    logger.systemLog('this.js:regexpTypeCheck: START ' + this.name + ' "' + text));

    var replacedText = rawText.replace(re, function(match, p1)
    {
        matched = true;
        result[this.name] = p1;
        return IN_TAG_START + this.name + IN_TAG_END;
    });

    if(matched)
        logger.systemLog('this.js:regexpTypeCheck: MATCHED ' + this.name + ' "' + text));

    done(replacedText, matched, result);
};
