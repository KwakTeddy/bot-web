


var dialogs = [
{
  name: '로그인',
  input: false,
  output: [
  {if: '계좌 있으면', output: {output: '로그인되어 있습니다', return: 1}}, '계좌등록해주세요. 링크']
},
{
  input: '다른 은행',
  output: '은행을 선택해주세요. 링크'
},
{
  input: '다른 계좌',
  output: [
  {if: '\'등록된계좌없으면\'', output: {returnCall: '로그인'}}, '계좌목록']
},
{
  input: '잔액 조회',
  output: [
  {if: '\'등록된계좌없으면\'', output: {returnCall: '로그인'}}, '잔액은 +amount+ 입니다']
},
{
  input: '내역 조회',
  output: [
  {if: '\'등록된계좌없으면\'', output: {returnCall: '로그인'}}, '+startDate+ 부터 +endDate+ 까지 내역입니다. \n ##+amount+#']
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('moneybot');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
