var path = require('path');
var globals = require(path.resolve('./engine/bot/engine/common/globals'));

var concepts =  {
  '네': ['응', '그래', '어', '네', '그렇다', '오케이', '오키', '오냐', '그려', '예스', '맞다', 'ㅇㅋ','ㅇ', 'ㅇㅇ', 'OK', 'ok', 'Ok', 'YES', 'yes', 'Yes', 'sp', 'SP'],
  '아니요': ['아니요','아니오','아니다','아니', '싫다', '않다', '노', 'ㄴ','ㄴㄴ', 'NO', 'no', 'No','하지마', '없다'],
  '휴대폰' : ['전화번호', '연락처'],
  '변경' : ['바꾸다', '틀리다', '알리다'],
  '시작' : ['처음', ':reset user','처음으로','맨 처음'],
  '무엇' : ['뭐']
};

globals.setGlobalConcepts(concepts);
