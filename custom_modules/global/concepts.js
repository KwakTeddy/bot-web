var path = require('path');
var botlib = require(path.resolve('config/lib/bot'));

var concepts =  {
  '네': ['응', '그래', '네', '그렇다', '오케이', '예스', 'ㅇㅋ', 'ㅇㅇ', 'OK', 'ok', 'Ok', 'YES', 'yes', 'Yes', 'sp', 'SP'],
  '아니요': ['아니다', '싫다', '않다', '노', 'ㄴㄴ', 'NO', 'no', 'No'],
  '변경' : ['바꾸다', '틀리다'],
  '시작' : ['처음', ':reset user'],
  '무엇' : ['뭐']
};

botlib.setGlobalConcepts(concepts);