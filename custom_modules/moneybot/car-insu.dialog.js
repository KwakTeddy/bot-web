
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 자동차보험_가입:

var dialogs = [
{
  input: '자동자 보험 가입',
  output: {call: '자동차보험_휴대폰'}
},
{
  input: false,
  output: [
  {if: '\'휴대폰등록되어 있는 경우\'', output: {call: '자동차보험_주민등록번호'}}, {returnCall: '휴대폰번호_입력', options: {returnDialog: '자동차보험_주민등록번호'}}]
},
{
  input: false,
  output: [
  {if: '\'주민번호 있는 경우\'', output: {call: '자동차보험_차량번호입력'}}, {returnCall: '주민등록번호_입력', options: {returnDialog: '자동차보험_차량번호입력'}}]
},
{
  input: '차량번호입력',
  output: '차량번호를 전체를 말씀해 주세요.', 
    children: [
    {
      input: '차량번호맞는경우',
      output: {returnCall: '주민번호입력', options: {returnDialog: '자동차보험_가입조회'}}
    },
    {
      input: '',
      output: '차량번호 형식이 틀렸습니다.'
    }
  ]
},
{
  input: '자동차보험가입조회',
  output: '총 ㅇ개 보험사에서 가장 저렴한 보험을 찾았습니다.', 
    children: [
    {
      input: '선택',
      output: 'ㅇㅇ보험사 보험료 내역입니다. 가입하시겠습니까? (이미지)', 
        children: [
        {
          input: '선택',
          output: '청약서와 상품설명서 입니다. 서명하셔서 카톡, 이메일, 팩스로 발송 부탁드립니다'
        }
      ]
    }
  ]
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
