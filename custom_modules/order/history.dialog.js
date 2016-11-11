


var dialogs = [
{
  input: '~저번 ~배달',
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
  input: [{regexp: /(~무엇|~배달|~내역)/, types: [{name: 'date', typeCheck: 'dateRangeTypeCheck'}]}, '~무엇 ~배달', '~배달 ~내역', '~내역'],
  task:   'orderHistoryTask',
  output: [
  {if: 'dialog.task.doc != undefined && dialog.task.doc.length > 0', output: '배달 주문한 내역 알려드릴께요.\n#history#+index+. +orderDate+ +restaurantName+에서 +menu+ +totalPrice+원\n# \n똑같이 주문 하시려면 주문할 번호와 같이 "배달"이라고 말씀해주세요.', 
    children: [
    {
      input: { regexp: /~전페이지/},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: /^<$/},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: /~다음페이지/},
      output: {repeat: 1, options: {page: 'next'}}
    },
    {
      input: {regexp: /^>$/},
      output: {repeat: 1, options: {page: 'next'}}
    },
    {
      input: [{regexp: /~배달/, types: [{name: 'history', typeCheck: 'listTypeCheck'}]}, {types: [{name: 'history', typeCheck: 'listTypeCheck'}]}],
      task:       'historyToOrderTask',
      output: {call: '주문확인'}
    }
  ]}, 
  {if: 'dialog.task.doc == undefined || dialog.task.doc.length == 0', output: '배달 내역이 없습니다.'}]
},
{
  input: /취소/,
  task:   'currentOrderTask',
  output: [
  {if: 'dialog.task.doc != undefined && dialog.task.doc.length > 0', output: '배달 중인 목록 입니다.\n#history#+index+. [+status+] +orderDate+ +restaurantName+에서 +menu+ +totalPrice+원\n#\n"요청" 중인 주문만 취소할 수 있습니다.\n취소하시려는 주문의 번호를 말씀해주세요.', 
    children: [
    {
      input: { regexp: /~전페이지/},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: /^<$/},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: /~다음페이지/},
      output: {repeat: 1, options: {page: 'next'}}
    },
    {
      input: {regexp: /^>$/},
      output: {repeat: 1, options: {page: 'next'}}
    },
    {
      input: {types: [{name: 'history', typeCheck: 'listTypeCheck'}]},
      output: '정말 주문을 취소하시겠습니다?',
      children: [
        {
          input: '~네',
          task:           'orderCancel',
          output: '주문이 취소 되었습니다.'
        },
        {
          input: '~아니요',
          output: '감사합니다~ 필요하실 때 불러주세요~'
        }
      ]
    }
  ]}, 
  {if: 'dialog.task.doc == undefined || dialog.task.doc.length == 0', output: '배달 중인 주문이 없습니다.'}]
},
{
  input: 'yo',
  task:   {action: 'yoAddress'},
  output: '완료'
},
{
  input: 'yt',
  task:   {action: 'yo'},
  output: '완료'
},
{
  input: 'bae',
  task:   {action: 'bae'},
  output: '완료'
},
{
  input: 'bt',
  task:   {action: 'bt'},
  output: '완료'
},
{
  input: 'update dump',
  task:   {action: 'updateDump'},
  output: '완료'
},
{
  input: 'fran update',
  task:   {action: 'updateFranchiseRestaurant'},
  output: 'update 완료'
},
{
  input: 'check category',
  task:   {action: 'checkDumpCategory'},
  output: 'category check 완료'
},
{
  input: 'update category',
  task:   {action: 'updateDumpCategory'},
  output: 'category update 완료'
}
];

var commonDialogs = [

];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('order');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
