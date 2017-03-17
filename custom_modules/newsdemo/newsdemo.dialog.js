
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var newsdemo = require('./newsdemo');
var pre = /(?:~이전|^<$)/;
var next = /(?:~다음|^>$)/;
var up = /(?:^0$)/

var dialogs = [
{
  id: 1,
  input: '환율',
  output: '환율코드(ex) USDKRW)?', 
    children: [
    {
      id: 0,
      input: {regexp: /[A-Z]/g},
      task:       {action: newsdemo.exchangerate},
      output: 
      {if: 'context.dialog.item.length != 0', output: '+date+ 현재 환율은 +rate+입니다.'}
    }
  ]
},
{
  id: 3,
  input: '주가',
  output: '회사코드(ex) AAPL)?', 
    children: [
    {
      id: 2,
      input: {regexp: /[A-Z]/g},
      task:       {action: newsdemo.stockprice},
      output: 
      {if: 'context.dialog.item.length != 0', output: '+name+의 +lastTradeDate+ 종가는 +lastTradePriceOnly+입니다.'}
    }
  ]
},
{
  id: 6,
  input: '뉴스',
  output: '조선일보 뉴스를 검색할까요? 아니면 전체 언론사 뉴스를 검색할까요?', 
    children: [
    {
      id: 4,
      input: ['조선', '조선일보'],
      output: {call:'조선'}
    },
    {
      id: 5,
      input: '전체',
      output: {call:'전체'}
    }
  ]
},
{
  id: 12,
  name: '조선',
  input: false,
  output: '검색어를 말씀해주세요', 
    children: [
    {
      id: 11,
      input: {regexp: /[가-힣]/g},
      task:       {action: newsdemo.searchNaver},
      output: [
      {if: 'context.dialog.item.length != 0', output: '#item#+index+. +title+\n#0.이전\n!.다른뉴스검색', 
        children: [
        {
          id: 7,
          input: ['!', '다른'],
          output: {call:'조선'}
        },
        {
          id: 9,
          input: {types: [{name: 'news', listName: 'item', field: 'title', typeCheck: 'listTypeCheck'}]},
          output: '+news.title+\n+news.description+\n+news.originallink+\n0.이전\n!.다른뉴스검색', 
            children: [
            {
              id: 8,
              input: ['!', '다른'],
              output: {call:'조선'}
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.item.length == 0', output: {repeat: 1, options : {output: '죄송합니다. 관련된 기사를 찾을 수 없습니다. 다른 검색어를 말씀해주세요\n0.이전\n!.다른뉴스검색'}}, 
        children: [
        {
          id: 10,
          input: '!',
          output: {call:'조선'}
        }
      ]}]
    }
  ]
},
{
  id: 18,
  name: '전체',
  input: false,
  output: '검색어를 말씀해주세요', 
    children: [
    {
      id: 17,
      input: {regexp: /[가-힣]/g},
      task:       {action: newsdemo.searchallNaver},
      output: [
      {if: 'context.dialog.item.length != 0', output: '#item#+index+. +title+\n#0.이전\n!.다른뉴스검색', 
        children: [
        {
          id: 13,
          input: ['!', '다른'],
          output: {call:'전체'}
        },
        {
          id: 15,
          input: {types: [{name: 'news', listName: 'item', field: 'title', typeCheck: 'listTypeCheck'}]},
          output: '+news.title+\n+news.description+\n+news.originallink+\n0.이전\n!.다른뉴스검색', 
            children: [
            {
              id: 14,
              input: ['!', '다른'],
              output: {call:'전체'}
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.item.length == 0', output: {repeat: 1, options : {output: '죄송합니다. 관련된 기사를 찾을 수 없습니다. 다른 검색어를 말씀해주세요\n0.이전\n!.다른뉴스검색'}}, 
        children: [
            {
              id: 16,
              input: '!',
              output: {call:'전체'}
            }
      ]}]
    }
  ]
}
];

var commonDialogs = [
{
  id: 0,
  name: '시작',
  input: ['시작', '처음'],
  task:   {action: 'startAction'},
  output: '안녕하세요. MB뉴스 데모입니다.\n데모를 시작하시려면 \'뉴스 검색해줘\'라고 입력해주세요.'
},
{
  id: 1,
  input: {regexp: up},
  output: {up : 1}
},
{
  id: 2,
  input: {regexp: pre},
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  id: 3,
  input: {regexp: next},
  output: {repeat: 1, options: {page: 'next'}}
},
{
  id: 4,
  input: '콜센터',
  output: '고객센터 번호는 02-858-5683입니다'
},
{
  id: 5,
  name: '답변없음',
  input: '',
  output: '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n데모를 시작하시려면 \'뉴스 검색해줘\'라고 입력해주세요.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('newsdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);

// TEST
var json = JSON.stringify(dialogs);
console.log(json);
var fs = require('fs');
fs.writeFile(require('path').resolve("public/js") + "/dialog.json", json, function(err) {
if(err) { return console.log(err); }
console.log("dialog.json was saved!"); });