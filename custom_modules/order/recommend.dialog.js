
var dialogs = [
{
  input: ['~추천', '~무엇 먹다'],
  task:   'recommendTask',
  output: [
  {if: 'context.dialog.recommMenu != undefined && !Array.isArray(context.dialog.recommMenu)', output: '+recommMenu.adj+ "+recommMenu.name+" 어떠세요?', 
    children: [
    {
      input: '~네',
      output: '배달 주문해 드릴까요?',
      children: [
        {
          input: '~네',
          output: {call: '배달주문'}
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.recommMenu && Array.isArray(context.dialog.recommMenu)', output: '무엇을 좋아할지 몰라 여러게 골라 봤습니다 ^^\n\n#recommMenu#+index+.+adj+ "+name+"\n#\n원하시는 것을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'recommMenu', typeCheck: 'listTypeCheck'}]},
      output: {call: '배달주문'}
    }
  ]}, 
  {if: 'true', output: '어떤게 맛있을 지 잘 모르겠습니다 ㅜㅜ'}]
}
];



var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
