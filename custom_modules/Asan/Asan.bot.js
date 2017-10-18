var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var Asan = {
  use: true,
  kakao: {
    keyboard: { type :"buttons", buttons:["대화 시작"]}
	}
};

botlib.makeBot('Asan', Asan);

