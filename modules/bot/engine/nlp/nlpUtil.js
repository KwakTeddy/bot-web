var NLPUtil = function () {
    return this;
};

NLPUtil.prototype.convertJSON = function (sentence, tokens) {
    var i, ret = '';

    ret  = '{"sentence" : {"str":"' + sentence + '"}';
    ret += ',"morpheme":[';
    for (i = 0; i < tokens.length; i ++) {
        if (tokens[i].stem != undefined && tokens[i].stem != null) {
            ret += '{"text":"' + tokens[i].text + '", "stem":"' + tokens[i].stem + '", "pos":"' + tokens[i].pos + '"}';
        } else {
            ret += '{"text":"' + tokens[i].text + '", "pos":"' + tokens[i].pos + '"}';
        }

        if (i < tokens.length - 1) {
            ret += ',';
        }
    }
    ret += ']}'
    return ret;
};

// for node.js library export
if (typeof exports !== 'undefined')
    module.exports = NLPUtil;
