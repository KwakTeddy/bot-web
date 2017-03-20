var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var park = {
  use: true,
  useAutoCorrection: false,

  topicKeywords: ['탄핵', '최순실', '세월호', '구속', '검찰', '특검', '청와대', '박근령', '파면', '삼성동', '사저','뇌물', '드라마', '길라임', '보톡스', '성형', '시술', '머리', '삼성', '재벌'],

  slangQuibbles: require('./quibbles').slangQuibbles,
  sentenceQuibbles: require('./quibbles').sentenceQuibbles

};

botlib.makeBot('park', park);

