
신용대출_가입:

var dialogs = [
{
  input: '신용 대출 가입',
  output: {call: '신용대출_휴대폰'}
},
{
  input: false,
  output: [
  {if: '\'휴대폰등록되어 있는 경우\'', output: {call: '신용대출_주민등록번호'}}, {returnCall: '휴대폰번호_입력', options: {returnDialog: '신용대출_주민등록번호'}}]
},
{
  input: false,
  output: [
  {if: '\'주민번호 있는 경우\'', output: {call: '신용대출_조회'}}, {returnCall: '주민등록번호_입력', options: {returnDialog: '신용대출_조회'}}]
},
{
  input: '신용등급 입력',
  output: '신용등급을 입력해주세요',
  children: [
    {
      input: '신용등급 형식 맞으면',
      output: {call: '신용대출_조회'}
    },
    {
      input: '',
      output: {repeat: 1, options: {output: '신용등급은 1등급, 2등급과 같이 입력해 주세요.'}}
    }
  ]
},
{
  input: '신용대출 가입조회',
  output: '금리순 대출 상품 입니다. ##+index+. +name+ +rate+\n# 번호를 선택해주세요.',
  children: [
    {
      input: '선택',
      output: '상품 설명 금리 등. 가입을 안내해 드릴까요?',
      children: [
        {
          input: '~네',
          output: {call: '신용대출가입'}
        }
      ]
    }
  ]
},
{
  input: false,
  output: [
  {if: '\'사이트이동인경우\'', output: '가입 사이트로 이동합니다.'}, 
  {if: '\'전화상담이 필요한 경우\'', output: '신속하게 상담원이 전화드리겠습니다.'}, 
  {if: '\'직접가입이 가능한경우\'', output: '비대면 가입 프로세스'}]
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
