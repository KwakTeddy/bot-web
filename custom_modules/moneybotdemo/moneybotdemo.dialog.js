
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var moneybotdemo = require('./moneybotdemo');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'));
var type = require(path.resolve('modules/bot/action/common/type'));
var pre = /(?:~이전|~앞|^<$)/;
var next = /(?:~다음|~뒤|^>$)/;
var up = /(?:^0$)/
var first = /(?:~시작|~처음|^!$|취소)/

var dialogs = [
{
  name: '계좌선택셋',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: {call:'일주일조회'}
    },
    {
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: {call:'일주일조회'}
    },
    {
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: {call:'일주일조회'}
    },
    {
      input: ['4', '기업'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistoryfours';
          context.user.bankaccount.title = '[기업은행 010-2145-5984]';
          callback(task,context);
          }},
      output: {call:'일주일조회'}
    }
  ]
},
{
  name: '계좌선택넷',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: {call:'한달조회'}
    },
    {
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: {call:'한달조회'}
    },
    {
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: {call:'한달조회'}
    },
    {
      input: ['4', '기업'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistoryfours';
          context.user.bankaccount.title = '[기업은행 010-2145-5984]';
          callback(task,context);
          }},
      output: {call:'한조회'}
    }
  ]
},
{
  name: '계좌선택',
  input: ['다르다 계좌', '다른 계좌', '계좌 선택', '계좌 선택하다', '계좌 바꾸다'],
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: '[우리은행 1005-103-021653]계좌의 잔액은 다음과 같습니다.\n잔액: 1,230,200원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          input: '~네',
          output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: '[신한은행 203-5845-4856]계좌의 잔액은 다음과 같습니다.\n잔액: 330,000원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          input: '~네',
          output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: '[농협은행 302-0555-4515-54]계좌의 잔액은 다음과 같습니다.\n잔액: 3,730,200원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          input: '~네',
          output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      input: ['4', '기업'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistoryfours';
          context.user.bankaccount.title = '[기업은행 010-2145-5984]';
          callback(task,context);
          }},
      output: '[기업은행 010-2145-5984]계좌의 잔액은 다음과 같습니다.\n잔액: 11,200,000원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          input: '~네',
          output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '계좌선택둘',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
    },
    {
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
    },
    {
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
    },
    {
      input: ['4', '기업'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistoryfours';
          context.user.bankaccount.title = '[기업은행 010-2145-5984]';
          callback(task,context);
          }},
      output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'
    }
  ]
},
{
  name: '잔액조회',
  input: ['잔액 조회', '잔액 얼마', '남다 돈'],
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택', options: {returnDialog: '잔액조회', output: '잔액조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 잔액은 다음과 같습니다.\n잔액: 330,000원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      input: '~네',
      output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
    },
    {
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 잔액은 다음과 같습니다.\n잔액: 3,730,200원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      input: '~네',
      output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
    },
    {
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 잔액은 다음과 같습니다.\n잔액: 11,200,000원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      input: '~네',
      output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'
    },
    {
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 잔액은 다음과 같습니다.\n잔액: 1,230,200원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      input: '~네',
      output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
    },
    {
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}]
},
{
  name: '일주일조회',
  input: '일주일',
  task:   {action: moneybotdemo.searchBankHistoryweek},
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택셋', options: {returnDialog: '일주일조회', output: '내역조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}]
},
{
  name: '한달조회',
  input: '한 달',
  task:   {action: moneybotdemo.searchBankHistorymonth},
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택넷', options: {returnDialog: '한달조회', output: '내역조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}]
},
{
  name: '내역조회',
  input: ['내 역 조회', '내역 조회', '계좌 내역'],
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택둘', options: {returnDialog: '내역조회', output: '내역조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'}]
},
{
  name: '영업시간',
  input: ['영업 시간', '근무 시간', '몇 시'],
  output: '은행 영업시간은 9:00am ~ 4:00pm 입니다.'
},
{
  name: '지점검색',
  input: ['근처 지점', '지점 ~찾다', '지점 안내', '주변 은행', '주변 지점', '은행 찾다'],
  output: '현재 계신 지역을 말씀해 주세요.\n예시)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68|현재 계신 지역을 말씀해주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
        children: [
        {
          input: '~네',
          output: {call: '지점정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
        children: [
        {
          input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
          output: {call: '지점정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}]
    },
    {
      input: {if: 'true'},
      output: {repeat:1, options: {output: '죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  name: '지점정보',
  input: false,
  task:   {action: moneybotdemo.searchBranch},
  output: [
  {if: 'dialog.task.count >0', output: '주변에 +doc.length+ 개의 은행 지점이 있습니다.\n#item#+index+. +title+\n#어느 곳의 위치를 보내드릴까요?', 
    children: [
    {
      input: {types: [{name: 'bank', listName: 'item', typeCheck: 'listTypeCheck'}]},
      task:       {action: moneybotdemo.daumgeoCode},
      output: '[+bank.title+]\n주소: +bank.address+\n전화번호: +bank.telephone+\n아래 링크는 +bank.title+의 위치정보입니다+_docs.link_find+'
    }
  ]}, 
  {if: 'dialog.task.count == 0', output: '주변에 지점을 찾을 수 없습니다.'}]
},
{
  name: '예적금',
  input: '예 적금',
  output: '예금 혹은 적금 상품 중 어느 것을 추천해드릴까요?', 
    children: [
    {
      input: '예금',
      output: {call:'예금'}
    },
    {
      input: '적금',
      output: {call:'적금'}
    }
  ]
},
{
  name: '적금',
  input: ['적금 추천', '적금 알리다', '적금 보이다', '적금 보다', '적금 받다', '적금 찾다', '적금 알다', '적금 신청', '적금 가입', '적금 안내', '금리 적금'],
  task:   moneybotdemo.fssSavingQuery,
  output: '금리순 적금 상품 입니다.\n#savings#+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'saving', listName: 'savings', typeCheck: 'listTypeCheck'}]},
      output: '[+saving.fin_prdt_nm+ - +saving.kor_co_nm+]\n금리: +saving.intr_rate_type_nm+ +saving.intr_rate+% ~ +saving.intr_rate2+% (+saving.save_trm+개월 기준)\n최고한도: +saving.max_limit+\n가입방법: +saving.join_way+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '예금',
  input: ['예금 추천', '예금 알리다', '예금 보이다', '예금 보다', '예금 받다', '예금 찾다', '예금 알다', '예금 신청', '예금 가입', '예금 안내', '금리 예금'],
  task:   moneybotdemo.fssDepositQuery,
  output: '금리순 예금 상품 입니다.\n#deposits#+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'deposit', listName: 'deposits', typeCheck: 'listTypeCheck'}]},
      output: '[+deposit.fin_prdt_nm+ - +deposit.kor_co_nm+]\n금리: +deposit.intr_rate_type_nm+ +deposit.intr_rate+% ~ +deposit.intr_rate2+% (+deposit.save_trm+개월 기준)\n최고한도: +deposit.max_limit+\n가입방법: +deposit.join_way+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '연금',
  input: ['연금 추천', '연금 알리다', '연금 보이다', '연금 보다', '연금 받다', '연금 찾다', '연금 알다', '연금 신청', '연금 가입', '연금 안내', '금리 연금'],
  task:   moneybotdemo.fssAnnuitySavingQuery,
  output: '금리순 연금 상품 입니다.\n#annuitysavings#+index+. +kor_co_nm+ +fin_prdt_nm+ 연평균수익률 +avg_prft_rate+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'annuitysaving', listName: 'annuitysavings', typeCheck: 'listTypeCheck'}]},
      output: '[+annuitysaving.fin_prdt_nm+ - +annuitysaving.kor_co_nm+]\n종류:+annuitysaving.pnsn_kind_nm+ +annuitysaving.prdt_type_nm+\n수익률: +annuitysaving.avg_prft_rate+\n가입방법: +annuitysaving.join_way+\n연금납입: +annuitysaving.paym_prd_nm+ +annuitysaving.mon_paym_atm_nm+\n연금수령: +annuitysaving.pnsn_strt_age_nm+ +annuitysaving.pnsn_recp_trm_nm+ +annuitysaving.pnsn_recp_amt+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '주택담보대출',
  input: ['주택 대출 금리', '담보 대출 금리', '아파트 금리'],
  task:   moneybotdemo.fssMortgageLoanQuery,
  output: '금리순 대출 상품 입니다.\n#mortgageloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'mortgageloan', listName: 'mortgageloans', typeCheck: 'listTypeCheck'}]},
      output: '[+mortgageloan.fin_prdt_nm+ - +mortgageloan.kor_co_nm+]\n금리: +mortgageloan.rpay_type_nm+ +mortgageloan.lend_rate_min+% ~ +mortgageloan.lend_rate_max+%\n연체이자율: +mortgageloan.dly_rate+\n중도상환수수료: +mortgageloan.erly_rpay_fee+\n대출한도: +mortgageloan.loan_lmt+ 원\n가입방법: +mortgageloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '전세자금대출',
  input: '전세 대출 금리',
  task:   moneybotdemo.fssRentHouseLoanQuery,
  output: '금리순 대출 상품 입니다.\n#renthouseloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'renthouseloan', listName: 'renthouseloans', typeCheck: 'listTypeCheck'}]},
      output: '[+renthouseloan.fin_prdt_nm+ - +renthouseloan.kor_co_nm+]\n금리: +renthouseloan.rpay_type_nm+ +renthouseloan.lend_rate_min+% ~ +renthouseloan.lend_rate_max+%\n연체이자율: +renthouseloan.dly_rate+\n중도상환수수료: +renthouseloan.erly_rpay_fee+\n대출한도: +renthouseloan.loan_lmt+ 원\n가입방법: +renthouseloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '신용대출',
  input: '금리 신용 대출',
  task:   moneybotdemo.fssCreditLoanQuery,
  output: '금리순 신용 대출 상품 입니다.\n#creditloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +crdt_grad_avg+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      input: {types: [{name: 'creditloan', listName: 'creditloans', typeCheck: 'listTypeCheck'}]},
      output: '[+creditloan.fin_prdt_nm+ - +creditloan.kor_co_nm+]\n종류: +creditloan.crdt_prdt_type_nm+\n평균금리: +creditloan.crdt_lend_rate_type_nm+ +creditloan.crdt_grad_avg+ %\n가입방법: +creditloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '대출리스트',
  input: '금리 대출',
  output: '주택담보대출, 전세자금대출 혹은 신용대출 중 어느 상품을 안내해드릴까요?', 
    children: [
    {
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    }
  ]
},
{
  name: '제이대출',
  input: false,
  task:   {action: function(task, context, callback) {
                      context.user['mobile'] = context.dialog['mobile'];
                      context.user.updates = ['mobile'];
                      botUser.updateUserContext(context.user, context, function () {
                        context.user.updates = null;
                        context.dialog.smsAuth == null;
                        callback(task, context);
                      });
                    }},
  output: '머니봇이 고객님의 신용등급을 대입하여 국내 36개 금융사 상품을 비교 분석한 결과 최적의 상품을 찾았습니다.\n[머니저축은행 브레인론]\n금리: 4.58%\n한도: 3000만원\n이 상품으로 대출 신청을 도와드릴까요?\n(데모이므로 실제로 신청이 이루어지지는 않습니다.)', 
    children: [
    {
      input: '~네',
      output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
    },
    {
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '신용대출가입',
  input: ['신용 대출 추천', '신용 대출 알리다', '신용 대출 보이다', '신용 대출 보다', '신용 대출 받다', '신용 대출 찾다', '신용 대출 알다', '신용 대출 신청', '신용 대출 가입', '신용 대출 한도', '신용 대출 안내'],
  output: '신용등급 조회를 위해 주민등록번호를 입력해주세요.\n(데모이므로 실제 신용등급 조회를 진행하지는 않습니다.)', 
    children: [
    {
      input: {regexp: /\b((?:\d{6} ?[-.]? ?\d{7}))\b/},
      output: '휴대폰 번호를 입력해주세요', 
        children: [
        {
          input: {types: [{type : type.mobileType, context: false}]},
          task:           {
            preCallback: function(task, context, callback) {
              if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
              console.log('ddd');
              callback(task, context);
            },
            action: messages.sendSMSAuth
          },
          output: [{if: 'false' , output: {repeat: 1, options: {output: '문자 발송이 안되는데, 휴대폰 번호를 다시 말씀해주세요.'}}}, 
          {output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.', 
            children: [
            {
              input: {regexp: /[\d\s]+/},
              output: [
              {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);}, output: {call:'제이대출'}}, 
              {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') != context.dialog.smsAuth);}, output: {repeat:1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.'}}}]
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]}]
        },
        {
          input: {if: 'true'},
          output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      input: {if: 'true'},
      output: {repeat:1, options: {output: '주민등록번호의 형식이 틀렸습니다.\n제대로 된 주민등록번호를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  name: '담보대출가입',
  input: ['주택 대출 추천', '주택 대출 알리다', '주택 대출 보이다', '주택 대출 보다', '주택 대출 받다', '주택 대출 찾다', '주택 대출 알다', '주택 대출 신청', '주택 대출 가입', '주택 대출 한도', '주택 대출 안내', '담보 대출 추천', '담보 대출 알리다', '담보 대출 보이다', '담보 대출 보다', '담보 대출 받다', '담보 대출 찾다', '담보 대출 알다', '담보 대출 신청', '담보 대출 가입', '담보 대출 한도', '담보 대출 안내', '아파트 대출 추천', '아파트 대출 알리다', '아파트 대출 보이다', '아파트 대출 보다', '아파트 대출 받다', '아파트 대출 찾다', '아파트 대출 알다', '아파트 대출 신청', '아파트 대출 가입', '아파트 대출 한도', '아파트 대출 안내'],
  output: '상품의 상세 주소를 말씀해주세요', 
    children: [
    {
      input: {types: [{type: type.addressType, raw: true, context: true}]},
      output: [
      {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인주택담보대출]\n금리: 1.52%\n한도: 40000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
        children: [
        {
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
    },
    {
      input: {if:'true'},
      output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  name: '전세대출가입',
  input: ['전세 대출 추천', '전세 대출 알리다', '전세 대출 보이다', '전세 대출 보다', '전세 대출 받다', '전세 대출 찾다', '전세 대출 알다', '전세 대출 신청', '전세 대출 가입', '전세 대출 한도', '전세 대출 안내'],
  output: '상품의 상세 주소를 말씀해주세요', 
    children: [
    {
      input: {types: [{type: type.addressType, raw: true, context: true}]},
      output: [
      {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인전세자금대출]\n금리: 1.52%\n한도: 20000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
        children: [
        {
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
    },
    {
      input: {if:'true'},
      output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  name: '대출가입',
  input: ['대출 추천', '대출 알리다', '대출 보이다', '대출 보다', '대출 받다', '대출 찾다', '대출 알다', '대출 신청', '대출 가입', '대출 한도', '대출 안내'],
  output: '주택담보대출, 전세자금대출 혹은 신용대출 중 어느 상품을 안내해드릴까요?', 
    children: [
    {
      input: ['주택', '아파트', '담보'],
      output: '상품의 상세 주소를 말씀해주세요', 
        children: [
        {
          input: {types: [{type: type.addressType, raw: true, context: true}]},
          output: [
          {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인주택담보대출]\n금리: 1.52%\n한도: 40000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
            children: [
            {
              input: '~네',
              output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
              children: [
                {
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                },
                {
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            },
            {
              input: '~아니요',
              output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]}, 
          {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
        },
        {
          input: {if:'true'},
          output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      input: '신용',
      output: '신용등급 조회를 위해 주민등록번호를 입력해주세요.\n(데모이므로 실제 신용등급 조회를 진행하지는 않습니다.)', 
        children: [
        {
          input: {regexp: /\b((?:\d{6} ?[-.]? ?\d{7}))\b/},
          output: '휴대폰 번호를 입력해주세요', 
            children: [
            {
              input: {types: [{type : type.mobileType, context: false}]},
              task:               {
                preCallback: function(task, context, callback) {
                  if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
                  console.log('ddd');
                  callback(task, context);
                },
                action: messages.sendSMSAuth
              },
              output: [{if: 'false' , output: {repeat: 1, options: {output: '문자 발송이 안되는데, 휴대폰 번호를 다시 말씀해주세요.'}}}, 
              {output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.', 
                children: [
                {
                  input: {regexp: /[\d\s]+/},
                  output: [
                  {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);}, output: {call:'제이대출'}}, 
                  {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') != context.dialog.smsAuth);}, output: {repeat:1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.'}}}]
                },
                {
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]}]
            },
            {
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          input: {if: 'true'},
          output: {repeat:1, options: {output: '주민등록번호의 형식이 틀렸습니다.\n제대로 된 주민등록번호를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      input: '전세',
      output: '상품의 상세 주소를 말씀해주세요', 
        children: [
        {
          input: {types: [{type: type.addressType, raw: true, context: true}]},
          output: [
          {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인전세자금대출]\n금리: 1.52%\n한도: 20000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
            children: [
            {
              input: '~네',
              output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
              children: [
                {
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                },
                {
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            },
            {
              input: '~아니요',
              output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]}, 
          {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
        },
        {
          input: {if:'true'},
          output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    }
  ]
},
{
  name: '보험',
  input: ['보험 추천', '보험 알리다', '보험 보이다', '보험 보다', '보험 받다', '보험 찾다', '보험 알다', '보험 신청', '보험 가입'],
  output: '자동차 보험을 추천해드리겠습니다.\n차종 혹은 배기량을 말씀해주세요.', 
    children: [
    {
      input: [{regexp: /[가-힣]|[a-z]/}, 'cc'],
      output: '생년월일 6자리를 입력해주세요.', 
        children: [
        {
          input: {regexp: /\b((?:\d{6}))\b/},
          output: '최초 가입자이신가요?', 
            children: [
            {
              input: ['~네', '~아니요'],
              output: '피 보험자의 범위 중 1인, 부부, 가족 중 하나를 입력해주세요.', 
                children: [
                {
                  input: ['1 인', '부부', '가족'],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니손해보험 브레인자동차보험]\n보험료: 1,100,000원\n이 상품으로 가입하시겠습니까?', 
                    children: [
                    {
                      input: '~네',
                      output: '보험 가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
                      children: [
                        {
                          input: {types: [{type : type.mobileType, context: false}]},
                          output: '보험 가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                        },
                        {
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                        }
                      ]
                    },
                    {
                      input: '~아니요',
                      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          input: '~네',
                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                        },
                        {
                          input: '~아니요',
                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                },
                {
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '1인, 부부, 가족 중 하나를 말씀해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        },
        {
          input: {if: 'true'},
          output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      input: {if: 'true'},
      output: {repeat:1, options: {output: '잘못 입력하셨습니다.\n차종 혹은 배기량을 말씀해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  name: '대출',
  input: false,
  output: '신용대출, 전세자금대출, 주택담보대출 중 어떤 대출 정보를 안내해드릴까요?', 
    children: [
    {
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    }
  ]
},
{
  input: '상품 추천',
  output: '어떤 상품을 안내해드릴까요?\n머니봇은 현재 대출, 예적금, 자동차 보험 상품을 추천해드릴 수 있습니다.', 
    children: [
    {
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    },
    {
      input: '대출',
      output: {call:'대출'}
    },
    {
      input: '예금',
      output: {call:'예금'}
    },
    {
      input: '예 적금',
      output: {call:'예적금'}
    },
    {
      input: '적금',
      output: {call:'적금'}
    },
    {
      input: '연금',
      output: {call:'연금'}
    },
    {
      input: '보험',
      output: {call:'보험'}
    }
  ]
},
{
  name: '자주묻는질문',
  input: {types: [{type : type.faqType, raw: true, context: true}]},
  output: '아래 중에 궁금하신 내용이 있나요?\n#typeDoc#+index+. +title+\n#번호를 입력하면 상세 내용을 보여드립니다.\n0. 이전\n!. 처음', 
    children: [
    {
      input: ['0', '!'],
      output: {up:1}
    },
    {
      input: {types: [{name: 'faq', listName: 'faqDoc', typeCheck: 'listTypeCheck'}]},
      output: '[+faq.title+]\n+faq.content+\n더 필요하신 게 있으시면 말씀해주세요~\n0. 이전\n!. 처음', 
        children: [
        {
          input: '0',
          output: {up:1}
        },
        {
          input: '!',
          output: {call:'시작'}
        }
      ]
    }
  ]
}
];

var commonDialogs = [
{
  name: '시작',
  input: {regexp: first},
  output: '안녕하세요. 머니브레인 머니봇입니다.\n머니봇은 계좌잔액조회, 계좌내역조회, 금융상품추천, 고객상담 업무를 도와드리고있습니다.\n필요하신 걸 말씀해주세요.'
},
{
  input: {regexp: up},
  output: {up:1}
},
{
  input: {regexp: pre},
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  input: {regexp: next},
  output: {repeat: 1, options: {page: 'next'}}
},
{
  input: '콜센터',
  output: '고객센터 번호는 02-858-5683입니다'
},
{
  name: '답변없음',
  input: '',
  output: '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n머니봇은 계좌잔액조회, 계좌내역조회, 금융상품추천, 고객상담 업무를 도와드리고있습니다.\n필요하신 걸 말씀해주세요.',
  children: [
   {
     input: '~네',
     output: '고객센터 번호는 02-858-5683입니다.'
   },
   {
     input: '~아니요',
     output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
     children: [
       {
         input: '~네',
         output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
       },
       {
         input: '~아니요',
         output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 MB뉴스가 되겠습니다.\n머니봇 콜센터 번호는 02-858-5683입니다.\nMB뉴스에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
       }
     ]
   }
  ]
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('moneybotdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
