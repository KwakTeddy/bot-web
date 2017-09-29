


var dialogs = [
{
  input: ['추천', '~찾다', '~알리다', '있다', '없다', '~무엇 먹다', '~맛있다 있다', '~맛있다 없다', '먹다 싶다'],
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
  {if: 'context.dialog.recommMenu && Array.isArray(context.dialog.recommMenu)', output: '고객님이 좋아하실 만한 것들로 골라봤어요~ 어때요?\n\n#recommMenu#+index+.+desc+ "+name+"\n#\n원하시는 것을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'recommMenu', typeCheck: 'listTypeCheck'}]},
      task:       'recommendToOrderTask',
      output: {call: '배달주문'}
    }
  ]}, 
  {if: 'true', output: '어떤게 맛있을 지 잘 모르겠어요 ㅜㅜ'}]
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
