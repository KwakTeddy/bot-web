


var dialogs = [
{
  input: '~저번 배달',
  task:   'orderHistoryTask',
  output: [
  {if: function(dialog, context, callback) {if(dialog.task.doc != undefined && dialog.task.doc.length == 1) {context.dialog['restaurant'] = dialog.task.doc[0]['restaurant'];context.dialog['menus'] = dialog.task.doc[0]['menus']; callback(true);} else {callback(false);}}, output: {call: '주문확인'}}, 
  {if: 'dialog.task.doc != undefined && dialog.task.doc.length > 1', output: '어떤 걸 배달해 드릴까요?\n#history#+index+. +orderDate+\n+restaurantName+\n+menu+ +totalPrice+원\n\n#', 
    children: [
    {
      input: [{regexp: /~배달/, types: [{name: 'history', typeCheck: 'listTypeCheck'}]}, 'types: [{name: \'history\', typeCheck: \'listTypeCheck\'}]}'],
      task:       'historyToOrderTask',
      output: {call: '주문확인'}
    }
  ]}, 
  {if: 'dialog.task.doc == undefined || dialog.task.doc.length == 0', output: '배달 내역이 없습니다.'}]
},
{
  input: [{regexp: /(~무엇|~배달|~내역)/, types: [{name: 'date', typeCheck: 'dateRangeTypeCheck'}]}, '~무엇 ~배달', '~배달 ~내역'],
  task:   'orderHistoryTask',
  output: [
  {if: 'dialog.task.doc != undefined && dialog.task.doc.length > 0', output: '배달 주문한 내역 알려드릴께요.\n#history#+index+. +orderDate+\n+restaurantName+\n+menu+ +totalPrice+원\n\n# 똑같이 주문 하시려면 주문할 번호와 같이 "배달"이라고 말씀해주세요.', 
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
