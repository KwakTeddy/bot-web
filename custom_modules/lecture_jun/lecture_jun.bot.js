var path = require('path');
var botlib = require(path.resolve('./engine/bot.js'));

var lecture_jun = {
    use: true
};

botlib.makeBot('lecture_jun', lecture_jun);
