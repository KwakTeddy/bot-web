var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var park = {
  use: true,
  useQuibble: true,
  useAutoCorrection: false,
  topicKeywords: ['탄핵', '최순실', '세월호', '구속', '감옥', '검찰', '특검', '청와대', '박근령', '파면', '삼성동', '사저','뇌물',
    '드라마', '길라임', '보톡스', '성형', '시술', '머리', '삼성', '문재인', '안철수', '안희정', '이재명', '이재용', '재벌', '우병우', '김기춘', '장시호', '정유'],

  slangQuibbles: require('./quibbles').slangQuibbles,
  nounQuibbles: require('./quibbles').nounQuibbles,
  verbQuibbles: require('./quibbles').verbQuibbles,
  sentenceQuibbles: require('./quibbles').sentenceQuibbles

};

botlib.makeBot('park', park);

