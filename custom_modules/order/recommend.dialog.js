


var dialogs = [
{
  input: ['추천', '~찾다', '~알리다', '있다', '없다', '~무엇 먹다', '~맛있다 있다', '~맛있다 없다'],
  task:   'recommendTask',
  output: [
  {if: 'context.dialog.recommMenu != undefined && !Array.isArray(context.dialog.recommMenu)', output: '+recommMenu.desc+ "+recommMenu.name+" 어떠세요?', 
    children: [
    {
      input: ['~네', '배달'],
      output: '배달 주문해 드릴까요?',
      children: [
        {
          input: '~네',
          output: {call: '배달주문'}
        }
      ]
    }
  ]}, 
  {if: 'context.dialog.recommMenu && Array.isArray(context.dialog.recommMenu)', output: '무엇을 좋아할지 몰라 여러게 골라 봤습니다 ^^\n\n#recommMenu#+index+.+desc+ "+name+"\n#\n원하시는 것을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'recommMenu', typeCheck: 'listTypeCheck'}]},
      task:       'recommendToOrderTask',
      output: {call: '배달주문'}
    }
  ]}, 
  {if: 'true', output: '어떤게 맛있을 지 잘 모르겠습니다 ㅜㅜ'}]
},
{
  input: '배민',
  task:   'baeminDetail',
  output: '##+name+ +price+\n#'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
