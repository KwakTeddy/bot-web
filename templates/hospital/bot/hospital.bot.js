var path = require('path');
var botlib = require(path.resolve('engine/bot'));

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hospital = {
    use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["대화시작"]}
    },
    commonButtons: [{"text": "이전"}, {"text": "처음"}],
    commonQuickReplies: [{"text": "이전"}, {"text": "처음"}]
};

botlib.makeTemplateBot('hospital', hospital);

