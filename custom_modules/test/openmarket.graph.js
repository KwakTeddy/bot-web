
var path = require('path');
var openmarket = require('./openmarket');

var dialogs = [
{
  id: 'openmarket0',
  filename: 'openmarket',
  input: '쿠팡',
  task:   openmarket.coupangCsStoCoupang,
  output: '쿠팡'
},
{
  id: 'openmarket1',
  filename: 'openmarket',
  input: '상담',
  task:   openmarket.coupangCsCoupangtoS,
  output: '상담'
},
{
  id: 'openmarket2',
  filename: 'openmarket',
  input: '배송',
  task:   openmarket.coupangShipment,
  output: '배송번호를 입력해주세요'
},
{
  id: 'openmarket3',
  filename: 'openmarket',
  input: '주문',
  task:   openmarket.coupangOrderInquiry,
  output: '배송번호를 입력해주세요'
},
{
  id: 'openmarket4',
  filename: 'openmarket',
  input: '내 역',
  task:   openmarket.coupangOrderInquiryList,
  output: '확인할 내역의 시작일시, 종료일시, 발주서 상태를 입력해주세요'
},
{
  id: 'openmarket5',
  filename: 'openmarket',
  input: '상태 변경',
  task:   openmarket.coupangOrderStatusChangeDelivery,
  output: '상태를 변경'
},
{
  id: 'openmarket6',
  filename: 'openmarket',
  input: '발주',
  task:   openmarket.coupangOrderInquiryListDaily,
  output: '발주 목록입니다'
},
{
  id: 'openmarket7',
  filename: 'openmarket',
  input: '취소',
  task:   openmarket.coupangCanceal,
  output: '취소'
},
{
  id: 'openmarket8',
  filename: 'openmarket',
  input: '문의',
  task:   openmarket.coupangCsCtoS,
  output: '문의'
},
{
  id: 'openmarket9',
  filename: 'openmarket',
  input: '대답',
  task:   openmarket.coupangCsStoC,
  output: '대답'
},
{
  id: 'openmarket10',
  filename: 'openmarket',
  input: '그렇다',
  output: '그래'
},
{
  id: 'openmarket11',
  filename: 'openmarket',
  input: '옥션 내 계좌',
  task:   openmarket.auctionGetMyAccount,
  output: '옥션 내 계좌'
},
{
  id: 'openmarket12',
  filename: 'openmarket',
  input: '옥션 구매 자 쪽지',
  task:   openmarket.auctionBuyerNoteList,
  output: '옥션 구매자 쪽지'
},
{
  id: 'openmarket13',
  filename: 'openmarket',
  input: '네이버',
  task:   openmarket.naver,
  output: '네이버'
},
{
  id: 'openmarket14',
  filename: 'openmarket',
  input: {types: [{name: 'image', typeCheck: openmarket.imageTypeCheck, raw: true}]},
  task:   openmarket.imageSave,
  output: '저장할까요?'
},
{
  id: 'openmarket15',
  filename: 'openmarket',
  input: '정보',
  task:   openmarket.info,
  output: '정보'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('test');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
