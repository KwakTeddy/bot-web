var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var samchully = {
    use: true,
    kakao: {
        keyboard: { type :"buttons", buttons:["시작"]}
    },
    commonButtons: [{"text": "이전"}, {"text": "처음"}]
};

botlib.makeBot('samchully', samchully);
