
var dialogs = [
{
  input: ['~무엇 ~배달', '~배달 ~내역', {regexp: /(무엇|~배달|~내역)/, types: [{name: 'date', typeCheck: 'dateRangeTypeCheck'}]}],
  task:   'orderHistoryTask',
  output: '배달 주문한 내역 알려드릴께요.\n##+index+. +orderDate+\n+restaurantName+\n+menu+ +totalPrice+원\n\n#',
  children: [
    {
      input: {regexp: /~배달/, types: [{name: 'history', typeCheck: 'listTypeCheck'}]},
      task:       'historyToOrderTask',
      output: {call: '주문확인'}
    }
  ]
},
{
  input: {types: [{name: 'date', typeCheck: 'dateRangeTypeCheck'}]},
  output: '+from+ 부터 +to+ 까지'
}
];



var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
