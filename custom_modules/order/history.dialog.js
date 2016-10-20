
var dialogs = [
{
  input: [{regexp: /(~무엇|~배달|~내역)/, types: [{name: 'date', typeCheck: 'dateRangeTypeCheck'}]}, '~무엇 ~배달', '~배달 ~내역'],
  task:   'orderHistoryTask',
  output: [
  {if: 'dialog.task.doc != undefined && dialog.task.doc.length > 0', output: '배달 주문한 내역 알려드릴께요.\n#history#+index+. +orderDate+\n+restaurantName+\n+menu+ +totalPrice+원\n\n#', 
    children: [
    {
      input: [{regexp: /~배달/, types: [{name: 'history', typeCheck: 'listTypeCheck'}]}, 'types: [{name: \'history\', typeCheck: \'listTypeCheck\'}]}'],
      task:       'historyToOrderTask',
      output: {call: '주문확인'}
    }
  ]}, 
  {if: 'dialog.task.doc == undefined || dialog.task.doc.length == 0', output: '배달 내역이 없습니다.'}]
}
];



var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
