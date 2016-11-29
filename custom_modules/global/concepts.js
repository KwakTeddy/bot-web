var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var concepts =  {
  '네': ['응', '그래', '어', '네', '그렇다', '오케이', '오키', '오냐', '그려', '예스', '맞다', 'ㅇㅋ', 'ㅇㅇ', 'OK', 'ok', 'Ok', 'YES', 'yes', 'Yes', 'sp', 'SP'],
  '아니요': ['아니다', '싫다', '않다', '노', 'ㄴㄴ', 'NO', 'no', 'No'],
  '휴대폰' : ['전화번호', '연락처'],
  '변경' : ['바꾸다', '틀리다', '알리다'],
  '시작' : ['처음', ':reset user'],
  '무엇' : ['뭐']
};

botlib.setGlobalConcepts(concepts);
