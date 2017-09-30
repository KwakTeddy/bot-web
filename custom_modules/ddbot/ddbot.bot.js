var path = require('path');
var botlib = require(path.resolve('./bot-engine/bot'));

var ddbot = {
  use: true,
  name: '뚜봇',
  useAutoCorrection: false,
  topicKeywords: ['사진', '찍다', '포토샵', '이름', '영문', '발급', '미성년', '아이', '대리', '병역', '군인', '전역', '대체', '전자',
    '비자', '발급', '신청', '분실', '잃다', '기간', '복수', '단수', '기간', '비용', '금액', '즉시', '긴급', '시간', '걸리다', '갱신']
};

botlib.makeBot('ddbot', ddbot);

