var path = require('path');
var botlib = require(path.resolve('engine/bot.js'));

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var hotel = {
  use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["대화 시작"]}
    },
    commonButtons: [{"text": "이전"}, {"text": "처음"}],
    commonQuickReplies: [{"text": "이전"}, {"text": "처음"}]
};

botlib.makeTemplateBot('hotel', hotel);

