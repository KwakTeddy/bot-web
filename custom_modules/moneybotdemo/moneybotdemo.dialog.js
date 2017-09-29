
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
  id: 4,
  name: '계좌선택셋',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      id: 0,
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: {call:'일주일조회'}
    },
    {
      id: 1,
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: {call:'일주일조회'}
    },
    {
      id: 2,
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: {call:'일주일조회'}
    },
    {
      id: 3,
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
  id: 9,
  name: '계좌선택넷',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      id: 5,
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: {call:'한달조회'}
    },
    {
      id: 6,
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: {call:'한달조회'}
    },
    {
      id: 7,
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: {call:'한달조회'}
    },
    {
      id: 8,
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
  id: 10,
  input: '사망 보험',
  output: '사망보험금 청구시 구비서류는 다음과 같습니다.\n보험금 청구서, 수익자 신분증 사본(주민등록증, 운전면허증, 여권, 외국인등록증), 수익자의 통장(단, 수익자 통장에서 보험료 자동이체 되는 경우는 생략 가능), 재해입증서류 (재해사고일 경우에만 해당), 초진진료기록부 \n- 가입일(부활일)로부터 2년 이내 청구(단, 가입당시 본회의 방문 진단 절차를 받은 경우는 가입일(부활일)로부터 1년 이내 청구) 건인 경우에는 필수로 제출해 주시기 바랍니다.\n재직증명서 또는 퇴직증명서 (단체보험금 청구 건일 경우)\n자세한 서류정보는 아래 파일에서 확인해주세요.\n보험금청구시_구비서류_표준안_170118.pptx \(다운로드 : http:\/\/210.124.234.116\/KakaoTalkGateway\/attachments?id=101\)'
},
{
  id: 31,
  name: '계좌선택',
  input: ['다르다 계좌', '다른 계좌', '계좌 선택', '계좌 선택하다', '계좌 바꾸다'],
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      id: 15,
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: '[우리은행 1005-103-021653]계좌의 잔액은 다음과 같습니다.\n잔액: 1,230,200원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          id: 11,
          input: '~네',
          output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
        },
        {
          id: 14,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 12,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 13,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      id: 20,
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: '[신한은행 203-5845-4856]계좌의 잔액은 다음과 같습니다.\n잔액: 330,000원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          id: 16,
          input: '~네',
          output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
        },
        {
          id: 19,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 17,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 18,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      id: 25,
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: '[농협은행 302-0555-4515-54]계좌의 잔액은 다음과 같습니다.\n잔액: 3,730,200원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          id: 21,
          input: '~네',
          output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
        },
        {
          id: 24,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 22,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 23,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    },
    {
      id: 30,
      input: ['4', '기업'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistoryfours';
          context.user.bankaccount.title = '[기업은행 010-2145-5984]';
          callback(task,context);
          }},
      output: '[기업은행 010-2145-5984]계좌의 잔액은 다음과 같습니다.\n잔액: 11,200,000원\n내역 조회를 도와드릴까요?', 
        children: [
        {
          id: 26,
          input: '~네',
          output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'
        },
        {
          id: 29,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 27,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 28,
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
  id: 36,
  name: '계좌선택둘',
  input: false,
  output: '주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984', 
    children: [
    {
      id: 32,
      input: ['1', '우리'],
      task:       {action: function(task,context,callback) {
      context.user.bankaccount = 'bankhistoryones';
      context.user.bankaccount.title = '[우리은행 1005-103-021653]';
      callback(task,context);
      }},
      output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
    },
    {
      id: 33,
      input: ['2', '신한'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorytwos';
          context.user.bankaccount.title = '[신한은행 203-5845-4856]';
          callback(task,context);
          }},
      output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
    },
    {
      id: 34,
      input: ['3', '농협'],
      task:       {action: function(task,context,callback) {
          context.user.bankaccount = 'bankhistorythrees';
          context.user.bankaccount.title = '[농협은행 302-0555-4515-54]';
          callback(task,context);
          }},
      output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
    },
    {
      id: 35,
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
  id: 53,
  name: '잔액조회',
  input: ['잔액 조회', '잔액 얼마', '남다 돈'],
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택', options: {returnDialog: '잔액조회', output: '잔액조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 잔액은 다음과 같습니다.\n잔액: 330,000원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      id: 37,
      input: '~네',
      output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 김철수 입금 15,000\n20170218 이유미 입금 220,000\n20170216 김동현 출금 140,000\n20170216 백지영 입금 5,000\n20170216 김도연 출금 7,000\n20170216 이유미 출금 170,000'
    },
    {
      id: 40,
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 38,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 39,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 잔액은 다음과 같습니다.\n잔액: 3,730,200원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      id: 41,
      input: '~네',
      output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 배성연 입금 15,000\n20170218 오지환 입금 220,000\n20170216 박새롬 출금 140,000\n20170216 신수인 입금 5,000\n20170216 장어준 출금 7,000\n20170216 오지환 출금 170,000'
    },
    {
      id: 44,
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 42,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 43,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 잔액은 다음과 같습니다.\n잔액: 11,200,000원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      id: 45,
      input: '~네',
      output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 백지환 입금 15,000\n20170218 김민아 입금 220,000\n20170216 이동주 출금 140,000\n20170216 고나영 입금 5,000\n20170216 오유리 출금 7,000\n20170216 김민아 출금 170,000'
    },
    {
      id: 48,
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 46,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 47,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 잔액은 다음과 같습니다.\n잔액: 1,230,200원\n내역 조회를 도와드릴까요?', 
    children: [
    {
      id: 49,
      input: '~네',
      output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n20170219 전용원 입금 15,000\n20170218 지아혜 입금 220,000\n20170216 유준승 출금 140,000\n20170216 이성재 입금 5,000\n20170216 장세영 출금 7,000\n20170216 지아혜 출금 170,000'
    },
    {
      id: 52,
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 50,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 51,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]}]
},
{
  id: 62,
  name: '일주일조회',
  input: '일주일',
  task:   {action: moneybotdemo.searchBankHistoryweek},
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택셋', options: {returnDialog: '일주일조회', output: '내역조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 54,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 55,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 56,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 57,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 58,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 59,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 일주일 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 60,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 61,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}]
},
{
  id: 71,
  name: '한달조회',
  input: '한 달',
  task:   {action: moneybotdemo.searchBankHistorymonth},
  output: [
  {if: 'context.user.bankaccount == undefined', output: {returnCall: '계좌선택넷', options: {returnDialog: '한달조회', output: '내역조회 하기에 앞서, 주거래 계좌를 선택해주세요.\n1. 우리은행 1005-103-021653\n2. 신한은행 203-5845-4856\n3. 농협은행 302-0555-4515-54\n4. 기업은행 010-2145-5984'}}}, 
  {if: 'context.user.bankaccount == \'bankhistorytwos\'', output: '[신한은행 203-5845-4856]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 63,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 64,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistorythrees\'', output: '[농협은행 302-0555-4515-54]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 65,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 66,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryfours\'', output: '[기업은행 010-2145-5984]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 67,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 68,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}, 
  {if: 'context.user.bankaccount == \'bankhistoryones\'', output: '[우리은행 1005-103-021653]계좌의 한달 입출금 내역은 다음과 같습니다.\n#bankhistory#+거래일시1+ +기재내용+ +type+ +입금++출금+\n#', 
    children: [
    {
      id: 69,
      input: {regexp: pre},
      output: {repeat: 1, options: {page: 'pre'}}
    },
    {
      id: 70,
      input: {regexp: next},
      output: {repeat: 1, options: {page: 'next'}}
    }
  ]}]
},
{
  id: 72,
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
  id: 73,
  name: '영업시간',
  input: ['영업 시간', '근무 시간', '몇 시'],
  output: '은행 영업시간은 9:00am ~ 4:00pm 입니다.'
},
{
  id: 80,
  name: '지점검색',
  input: ['근처 지점', '지점 ~찾다', '지점 안내', '주변 은행', '주변 지점', '은행 찾다'],
  output: '현재 계신 지역을 말씀해 주세요.\n예시)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68|현재 계신 지역을 말씀해주세요.', 
    children: [
    {
      id: 78,
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '(context.dialog.address.시군구명||context.dialog.address.시도명) && context.dialog.address.법정읍면동명 == undefined && context.dialog.address.도로명 == undefined && context.dialog.address.건물본번 == undefined', output: {repeat: 1, options: {output: '고객님, 정확한 안내를 드리기 위하여 +address.시도명+ +address.시군구명+의 하위 상세주소를 입력 부탁드립니다.'}}}, 
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?|이 주소가 맞나요?', 
        children: [
        {
          id: 74,
          input: '~네',
          output: {call: '지점정보'}
        },
        {
          id: 75,
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#|다음 중 어떤 지역이신가요?', 
        children: [
        {
          id: 76,
          input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
          output: {call: '지점정보'}
        },
        {
          id: 77,
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}]
    },
    {
      id: 79,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '죄송합니다. 지금 입력하신 주소는 찾을수 없는 주소입니다.\n 아래 예시와 같이 다시 말씀해주세요.\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 82,
  name: '지점정보',
  input: false,
  task:   {action: moneybotdemo.searchBranch},
  output: [
  {if: 'dialog.task.count >0', output: '주변에 +doc.length+ 개의 은행 지점이 있습니다.\n#item#+index+. +title+\n#어느 곳의 위치를 보내드릴까요?', 
    children: [
    {
      id: 81,
      input: {types: [{name: 'bank', listName: 'item', typeCheck: 'listTypeCheck'}]},
      task:       {action: moneybotdemo.daumgeoCode},
      output: '[+bank.title+]\n주소: +bank.address+\n전화번호: +bank.telephone+\n아래 링크는 +bank.title+의 위치정보입니다+_docs.link_find+'
    }
  ]}, 
  {if: 'dialog.task.count == 0', output: '주변에 지점을 찾을 수 없습니다.'}]
},
{
  id: 85,
  name: '예적금',
  input: '예 적금',
  output: '예금 혹은 적금 상품 중 어느 것을 추천해드릴까요?', 
    children: [
    {
      id: 83,
      input: '예금',
      output: {call:'예금'}
    },
    {
      id: 84,
      input: '적금',
      output: {call:'적금'}
    }
  ]
},
{
  id: 90,
  name: '적금',
  input: ['적금 추천', '적금 알리다', '적금 보이다', '적금 보다', '적금 받다', '적금 찾다', '적금 알다', '적금 신청', '적금 가입', '적금 안내', '금리 적금'],
  task:   moneybotdemo.fssSavingQuery,
  output: '금리순 적금 상품 입니다.\n#savings#+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 89,
      input: {types: [{name: 'saving', listName: 'savings', typeCheck: 'listTypeCheck'}]},
      output: '[+saving.fin_prdt_nm+ - +saving.kor_co_nm+]\n금리: +saving.intr_rate_type_nm+ +saving.intr_rate+% ~ +saving.intr_rate2+% (+saving.save_trm+개월 기준)\n최고한도: +saving.max_limit+\n가입방법: +saving.join_way+\n가입하시겠습니까?', 
        children: [
        {
          id: 88,
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 86,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 87,
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
  id: 95,
  name: '예금',
  input: ['예금 추천', '예금 알리다', '예금 보이다', '예금 보다', '예금 받다', '예금 찾다', '예금 알다', '예금 신청', '예금 가입', '예금 안내', '금리 예금'],
  task:   moneybotdemo.fssDepositQuery,
  output: '금리순 예금 상품 입니다.\n#deposits#+index+. +kor_co_nm+ +fin_prdt_nm+ 세전 +intr_rate2+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 94,
      input: {types: [{name: 'deposit', listName: 'deposits', typeCheck: 'listTypeCheck'}]},
      output: '[+deposit.fin_prdt_nm+ - +deposit.kor_co_nm+]\n금리: +deposit.intr_rate_type_nm+ +deposit.intr_rate+% ~ +deposit.intr_rate2+% (+deposit.save_trm+개월 기준)\n최고한도: +deposit.max_limit+\n가입방법: +deposit.join_way+\n가입하시겠습니까?', 
        children: [
        {
          id: 93,
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 91,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 92,
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
  id: 100,
  name: '연금',
  input: ['연금 추천', '연금 알리다', '연금 보이다', '연금 보다', '연금 받다', '연금 찾다', '연금 알다', '연금 신청', '연금 가입', '연금 안내', '금리 연금'],
  task:   moneybotdemo.fssAnnuitySavingQuery,
  output: '금리순 연금 상품 입니다.\n#annuitysavings#+index+. +kor_co_nm+ +fin_prdt_nm+ 연평균수익률 +avg_prft_rate+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 99,
      input: {types: [{name: 'annuitysaving', listName: 'annuitysavings', typeCheck: 'listTypeCheck'}]},
      output: '[+annuitysaving.fin_prdt_nm+ - +annuitysaving.kor_co_nm+]\n종류:+annuitysaving.pnsn_kind_nm+ +annuitysaving.prdt_type_nm+\n수익률: +annuitysaving.avg_prft_rate+\n가입방법: +annuitysaving.join_way+\n연금납입: +annuitysaving.paym_prd_nm+ +annuitysaving.mon_paym_atm_nm+\n연금수령: +annuitysaving.pnsn_strt_age_nm+ +annuitysaving.pnsn_recp_trm_nm+ +annuitysaving.pnsn_recp_amt+\n가입하시겠습니까?', 
        children: [
        {
          id: 98,
          input: '~네',
          output: '가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 96,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 97,
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
  id: 108,
  name: '주택담보대출',
  input: ['주택 대출 금리', '담보 대출 금리', '아파트 금리'],
  task:   moneybotdemo.fssMortgageLoanQuery,
  output: '금리순 대출 상품 입니다.\n#mortgageloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 107,
      input: {types: [{name: 'mortgageloan', listName: 'mortgageloans', typeCheck: 'listTypeCheck'}]},
      output: '[+mortgageloan.fin_prdt_nm+ - +mortgageloan.kor_co_nm+]\n금리: +mortgageloan.rpay_type_nm+ +mortgageloan.lend_rate_min+% ~ +mortgageloan.lend_rate_max+%\n연체이자율: +mortgageloan.dly_rate+\n중도상환수수료: +mortgageloan.erly_rpay_fee+\n대출한도: +mortgageloan.loan_lmt+ 원\n가입방법: +mortgageloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          id: 103,
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 101,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 102,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 106,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 104,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 105,
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
  id: 116,
  name: '전세자금대출',
  input: '전세 대출 금리',
  task:   moneybotdemo.fssRentHouseLoanQuery,
  output: '금리순 대출 상품 입니다.\n#renthouseloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +lend_rate_min+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 115,
      input: {types: [{name: 'renthouseloan', listName: 'renthouseloans', typeCheck: 'listTypeCheck'}]},
      output: '[+renthouseloan.fin_prdt_nm+ - +renthouseloan.kor_co_nm+]\n금리: +renthouseloan.rpay_type_nm+ +renthouseloan.lend_rate_min+% ~ +renthouseloan.lend_rate_max+%\n연체이자율: +renthouseloan.dly_rate+\n중도상환수수료: +renthouseloan.erly_rpay_fee+\n대출한도: +renthouseloan.loan_lmt+ 원\n가입방법: +renthouseloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          id: 111,
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 109,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 110,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 114,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 112,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 113,
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
  id: 124,
  name: '신용대출',
  input: '금리 신용 대출',
  task:   moneybotdemo.fssCreditLoanQuery,
  output: '금리순 신용 대출 상품 입니다.\n#creditloans#+index+. +kor_co_nm+ +fin_prdt_nm+ +crdt_grad_avg+%\n#상세 정보를 보고싶으신 상품을 선택해주세요.', 
    children: [
    {
      id: 123,
      input: {types: [{name: 'creditloan', listName: 'creditloans', typeCheck: 'listTypeCheck'}]},
      output: '[+creditloan.fin_prdt_nm+ - +creditloan.kor_co_nm+]\n종류: +creditloan.crdt_prdt_type_nm+\n평균금리: +creditloan.crdt_lend_rate_type_nm+ +creditloan.crdt_grad_avg+ %\n가입방법: +creditloan.join_way+\n가입하시겠습니까?', 
        children: [
        {
          id: 119,
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 117,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 118,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 122,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 120,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 121,
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
  id: 128,
  name: '대출리스트',
  input: '금리 대출',
  output: '주택담보대출, 전세자금대출 혹은 신용대출 중 어느 상품을 안내해드릴까요?', 
    children: [
    {
      id: 125,
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      id: 126,
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      id: 127,
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    }
  ]
},
{
  id: 133,
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
      id: 129,
      input: '~네',
      output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
    },
    {
      id: 132,
      input: '~아니요',
      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          id: 130,
          input: '~네',
          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
        },
        {
          id: 131,
          input: '~아니요',
          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  id: 140,
  name: '신용대출가입',
  input: ['신용 대출 추천', '신용 대출 알리다', '신용 대출 보이다', '신용 대출 보다', '신용 대출 받다', '신용 대출 찾다', '신용 대출 알다', '신용 대출 신청', '신용 대출 가입', '신용 대출 한도', '신용 대출 안내'],
  output: '신용등급 조회를 위해 주민등록번호를 입력해주세요.\n(데모이므로 실제 신용등급 조회를 진행하지는 않습니다.)', 
    children: [
    {
      id: 138,
      input: {regexp: /\b((?:\d{6} ?[-.]? ?\d{7}))\b/},
      output: '휴대폰 번호를 입력해주세요', 
        children: [
        {
          id: 136,
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
              id: 134,
              input: {regexp: /[\d\s]+/},
              output: [
              {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);}, output: {call:'제이대출'}}, 
              {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') != context.dialog.smsAuth);}, output: {repeat:1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.'}}}]
            },
            {
              id: 135,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]}]
        },
        {
          id: 137,
          input: {if: 'true'},
          output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      id: 139,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '주민등록번호의 형식이 틀렸습니다.\n제대로 된 주민등록번호를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 149,
  name: '담보대출가입',
  input: ['주택 대출 추천', '주택 대출 알리다', '주택 대출 보이다', '주택 대출 보다', '주택 대출 받다', '주택 대출 찾다', '주택 대출 알다', '주택 대출 신청', '주택 대출 가입', '주택 대출 한도', '주택 대출 안내', '담보 대출 추천', '담보 대출 알리다', '담보 대출 보이다', '담보 대출 보다', '담보 대출 받다', '담보 대출 찾다', '담보 대출 알다', '담보 대출 신청', '담보 대출 가입', '담보 대출 한도', '담보 대출 안내', '아파트 대출 추천', '아파트 대출 알리다', '아파트 대출 보이다', '아파트 대출 보다', '아파트 대출 받다', '아파트 대출 찾다', '아파트 대출 알다', '아파트 대출 신청', '아파트 대출 가입', '아파트 대출 한도', '아파트 대출 안내'],
  output: '상품의 상세 주소를 말씀해주세요', 
    children: [
    {
      id: 147,
      input: {types: [{type: type.addressType, raw: true, context: true}]},
      output: [
      {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인주택담보대출]\n금리: 1.52%\n한도: 40000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
        children: [
        {
          id: 143,
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 141,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 142,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 146,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 144,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 145,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
    },
    {
      id: 148,
      input: {if:'true'},
      output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 158,
  name: '전세대출가입',
  input: ['전세 대출 추천', '전세 대출 알리다', '전세 대출 보이다', '전세 대출 보다', '전세 대출 받다', '전세 대출 찾다', '전세 대출 알다', '전세 대출 신청', '전세 대출 가입', '전세 대출 한도', '전세 대출 안내'],
  output: '상품의 상세 주소를 말씀해주세요', 
    children: [
    {
      id: 156,
      input: {types: [{type: type.addressType, raw: true, context: true}]},
      output: [
      {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인전세자금대출]\n금리: 1.52%\n한도: 20000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
        children: [
        {
          id: 152,
          input: '~네',
          output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
          children: [
            {
              id: 150,
              input: {types: [{type : type.mobileType, context: false}]},
              output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
            },
            {
              id: 151,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 155,
          input: '~아니요',
          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              id: 153,
              input: '~네',
              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
            },
            {
              id: 154,
              input: '~아니요',
              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]}, 
      {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
    },
    {
      id: 157,
      input: {if:'true'},
      output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 184,
  name: '대출가입',
  input: ['대출 추천', '대출 알리다', '대출 보이다', '대출 보다', '대출 받다', '대출 찾다', '대출 알다', '대출 신청', '대출 가입', '대출 한도', '대출 안내'],
  output: '주택담보대출, 전세자금대출 혹은 신용대출 중 어느 상품을 안내해드릴까요?', 
    children: [
    {
      id: 167,
      input: ['주택', '아파트', '담보'],
      output: '상품의 상세 주소를 말씀해주세요', 
        children: [
        {
          id: 165,
          input: {types: [{type: type.addressType, raw: true, context: true}]},
          output: [
          {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인주택담보대출]\n금리: 1.52%\n한도: 40000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
            children: [
            {
              id: 161,
              input: '~네',
              output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
              children: [
                {
                  id: 159,
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                },
                {
                  id: 160,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            },
            {
              id: 164,
              input: '~아니요',
              output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 162,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 163,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]}, 
          {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
        },
        {
          id: 166,
          input: {if:'true'},
          output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      id: 174,
      input: '신용',
      output: '신용등급 조회를 위해 주민등록번호를 입력해주세요.\n(데모이므로 실제 신용등급 조회를 진행하지는 않습니다.)', 
        children: [
        {
          id: 172,
          input: {regexp: /\b((?:\d{6} ?[-.]? ?\d{7}))\b/},
          output: '휴대폰 번호를 입력해주세요', 
            children: [
            {
              id: 170,
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
                  id: 168,
                  input: {regexp: /[\d\s]+/},
                  output: [
                  {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);}, output: {call:'제이대출'}}, 
                  {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') != context.dialog.smsAuth);}, output: {repeat:1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.'}}}]
                },
                {
                  id: 169,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]}]
            },
            {
              id: 171,
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 173,
          input: {if: 'true'},
          output: {repeat:1, options: {output: '주민등록번호의 형식이 틀렸습니다.\n제대로 된 주민등록번호를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      id: 183,
      input: '전세',
      output: '상품의 상세 주소를 말씀해주세요', 
        children: [
        {
          id: 181,
          input: {types: [{type: type.addressType, raw: true, context: true}]},
          output: [
          {if: 'context.dialog.address.지번본번 != undefined', output: '머니봇이 국내 36개 금융사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니은행 브레인전세자금대출]\n금리: 1.52%\n한도: 20000만원\n이 상품으로 대출 신청을 도와드릴까요?\n[데모이므로 실제로 신청이 이루어지지는 않습니다.]', 
            children: [
            {
              id: 177,
              input: '~네',
              output: '대출 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
              children: [
                {
                  id: 175,
                  input: {types: [{type : type.mobileType, context: false}]},
                  output: '대출 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                },
                {
                  id: 176,
                  input: {if: 'true'},
                  output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            },
            {
              id: 180,
              input: '~아니요',
              output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  id: 178,
                  input: '~네',
                  output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                },
                {
                  id: 179,
                  input: '~아니요',
                  output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]}, 
          {if: 'context.dialog.address.지번본번 == undefined', output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}}]
        },
        {
          id: 182,
          input: {if:'true'},
          output: {repeat:1, options: {output: '상세 지번 혹은 도로명 주소를 정확히 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    }
  ]
},
{
  id: 189,
  name: '보험가입',
  input: false,
  output: '휴대폰 번호를 입력해주세요', 
    children: [
    {
      id: 187,
      input: {types: [{type : type.mobileType, context: false}]},
      task:       {
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
          id: 185,
          input: {regexp: /[\d\s]+/},
          output: [
          {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);}, output: {call:'보험가입둘'}}, 
          {if: function(dialog, context, callback) {callback(dialog.inRaw.replace(/\s*/g, '') != context.dialog.smsAuth);}, output: {repeat:1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.'}}}]
        },
        {
          id: 186,
          input: {if: 'true'},
          output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]}]
    },
    {
      id: 188,
      input: {if: 'true'},
      output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 190,
  name: '보험가입둘',
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
  output: '전화상담 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
},
{
  id: 212,
  name: '종신보험',
  input: ['종신 보험', '정기 보험'],
  output: '종신 보험을 추천해드리겠습니다.\n생년월일 6자리를 입력해주세요.', 
    children: [
    {
      id: 210,
      input: {regexp: /\b((?:\d{6}))\b/},
      output: '성별을 말씀해주세요.', 
        children: [
        {
          id: 209,
          input: {regexp: /[가-힣]/},
          output: '직업(직종)을 말씀해주세요.', 
            children: [
            {
              id: 208,
              input: {regexp: /[가-힣]|[a-z]/},
              output: '가계의 평균 월 소득을 말씀해주세요', 
                children: [
                {
                  id: 206,
                  input: ['억', '원', '만', '만원', {regexp:/[0-9]/}],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n1. ING 종신보험 표준형(무배당) 예상보험료: 52,634원\n2. ING 스마트 정기보험 1종(무배당) 예상보험료: 27,550원\n3. ING 라이프케어 CI정기보험(무배당) 예상보험료: 68,520원\n상세 정보를 보고싶으신 상품을 선택해주세요.', 
                    children: [
                    {
                      id: 195,
                      input: ['1', '표준'],
                      output: '[ING 종신보험 표준형(무배당)]\n예상보험료: 52,634원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우 - 1억원 (기준:가입금액 1억원)\n특징:\n1.가족의 미래까지 책임지는 평생 보장 혜택\n2.내게 필요한 특약 선택 가능\n3.연 최대 100만원 소득공제\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 191,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 194,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 192,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 193,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 200,
                      input: ['2', '스마트'],
                      output: '[ING 스마트 정기보험 1종(무배당)]\n예상보험료: 27,550원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우 - 1억원 (기준:가입금액 1억원)\n특징:\n1.저렴한 보험료로 원하는 기간만큼 집중보장\n2.내게 필요한 특약 선택 가능\n3.종신보험으로 전환 가능\n4.연 최대 100만원 소득공제\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 196,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 199,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 197,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 198,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 205,
                      input: ['3', '라이프'],
                      output: '[ING 스마트 정기보험 2종(무배당)]\n예상보험료: 28,520원\n지급기준:\n1.피보험자가 보험기간 중 사망하였을 경우 1억원 (기준:가입금액 1억원)\n2.피보험자가 보험기간이 끝날 때까지 살아있을 경우 - 이미 납입한 주계약 보험료\n특징:\n1.저렴한 보험료로 원하는 기간만큼 집중보장\n2.납입한 주계약 보험료 100% 환급 가능\n3.종신보험으로 전환 가능\n4.연 최대 100만원 소득공제\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 201,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 204,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 202,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 203,
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
                  id: 207,
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '월 소득의 형식이 틀렸습니다.\n제대로 된 월소득을 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 211,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 229,
  name: '연금보험',
  input: ['연금 보험', '저축 보험'],
  output: '연금 보험을 추천해드리겠습니다.\n생년월일 6자리를 입력해주세요.', 
    children: [
    {
      id: 227,
      input: {regexp: /\b((?:\d{6}))\b/},
      output: '성별을 말씀해주세요.', 
        children: [
        {
          id: 226,
          input: {regexp: /[가-힣]/},
          output: '직업(직종)을 말씀해주세요.', 
            children: [
            {
              id: 225,
              input: {regexp: /[가-힣]|[a-z]/},
              output: '가계의 평균 월 소득을 말씀해주세요', 
                children: [
                {
                  id: 223,
                  input: ['억', '원', '만', '만원', {regexp:/[0-9]/}],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n1. ING 프리스타일 연금보험 플러스(무배당) 최소 보험료: 15만원\n2. ING 포춘 일시납 연금보험(무배당) 최소 보험료: 1500만원\n상세 정보를 보고싶으신 상품을 선택해주세요.', 
                    children: [
                    {
                      id: 217,
                      input: ['1', '프리스타일'],
                      output: '[ING 프리스타일 연금보험 플러스(무배당)]\n최소 보험료: 15만원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우 - 기본보험료의 600% + 사망시까지 적립한 책임준비금\n특징:\n1.소득공백기에는 연금을 2배로\n2.목돈이 필요할 땐 행복이벤트자금에서 원하는 대로\n3.공시이율, 연복리 적용으로 안정적인 노후 자금 마련\n4.추가납입, 중도인출, 납입일시중지를 통한 유연한 자금 운용\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 213,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 216,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 214,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 215,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 222,
                      input: ['2', '포춘'],
                      output: '[ING 포춘 일시납 연금보험(무배당)]\n최소 보험료: 1500만원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우 - 1억원 (기준:가입금액 1억원)\n특징:\n1.소득공백기에는 연금을 2배로\n2.목돈이 필요할 땐 행복이벤트자금에서 원하는 대로\n3.공시이율, 연복리 적용으로 안정적인 노후 자금 마련\n4.추가납입, 중도인출, 납입일시중지를 통한 유연한 자금 운용\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 218,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 221,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 219,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 220,
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
                  id: 224,
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '월 소득의 형식이 틀렸습니다.\n제대로 된 월소득을 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 228,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 251,
  name: '변액보험',
  input: '변액 보험',
  output: '변액 보험을 추천해드리겠습니다.\n생년월일 6자리를 입력해주세요.', 
    children: [
    {
      id: 249,
      input: {regexp: /\b((?:\d{6}))\b/},
      output: '성별을 말씀해주세요.', 
        children: [
        {
          id: 248,
          input: {regexp: /[가-힣]/},
          output: '직업(직종)을 말씀해주세요.', 
            children: [
            {
              id: 247,
              input: {regexp: /[가-힣]|[a-z]/},
              output: '가계의 평균 월 소득을 말씀해주세요', 
                children: [
                {
                  id: 245,
                  input: ['억', '원', '만', '만원', {regexp:/[0-9]/}],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n1. ING 모으고 키우는 변액적립보험 v2.0(무배당) 최소보험료: 20만원\n2. ING Two X Two 변액적립보험(무배당) 최소보험료: 20만원\n3. ING 오렌지 변액연금보험(무배당) 최소보험료: 20만원\n상세 정보를 보고싶으신 상품을 선택해주세요.', 
                    children: [
                    {
                      id: 234,
                      input: '1',
                      output: '[ING 모으고 키우는 변액적립보험 v2.0(무배당)]\n최소보험료: 20만원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우\n1.[적립형] 기본보험료의 520% + 사망당시 계약자적립금\n2.[거치형] 기본보험료의 10% + 사망당시 계약자적립금\n특징:\n1.고객의 투자성향에 맞는 다양한 운용방법\n2.다양한 투자관리 옵션 선택으로 안정적인 수익을 추구\n3.장기납입 보너스 혜택(적립형, 주계약에 한함)\n4.노후를 편안하게 연금전환 혜택\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 230,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 233,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 231,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 232,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 239,
                      input: ['2', 'Two'],
                      output: '[ING Two X Two 변액적립보험(무배당)]\n최소보험료: 20만원\n지급기준: 피보험자가 보험기간 중 사망하였을 경우\n1.[적립형] 5년납 :기본보험료의 300% + 사망당시 계약자적립금\n7년납 :기본보험료의 400% + 사망당시 계약자적립금\n10,15,20년납 :기본보험료의 520% + 사망당시 계약자적립금\n2.[거치형] 기본보험료의 10% + 사망당시 계약자적립금\n특징:\n1.고객의 투자성향에 맞는 다양한 운용방법\n2.다양한 투자관리 옵션 선택으로 안정적인 수익을 추구\n3.장기납입 보너스 혜택(적립형, 주계약에 한함)\n4.노후를 편안하게 연금전환 혜택\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 235,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 238,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 236,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 237,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 244,
                      input: ['3', '오렌지'],
                      output: '[ING 오렌지 변액연금보험(무배당)]\n최소보험료: 20만원\n지급기준:\n피보험자가 장해분류표 중 동일한 재해를 직접적인 원인으로 여러 신체부위의 장해지급률을 더하여 80%이상인 장해상태가 된 경우(최초 1회한) - 1000만원\n특징:\n1.안전한 노후를 위한 투자 방법\n2.엄선된 펀드로 키워주고\n3.100~200%보증으로 든든하게\n4.오래될 수록 혜택은 더욱 크게\n5.자금운용은 유연하게\n6.연금종류는 다양하게\n7.연금수령은 유연하게\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 240,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 243,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 241,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 242,
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
                  id: 246,
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '월 소득의 형식이 틀렸습니다.\n제대로 된 월소득을 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 250,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 273,
  name: '건강보험',
  input: '건강 보험',
  output: '건강 보험을 추천해드리겠습니다.\n생년월일 6자리를 입력해주세요.', 
    children: [
    {
      id: 271,
      input: {regexp: /\b((?:\d{6}))\b/},
      output: '성별을 말씀해주세요.', 
        children: [
        {
          id: 270,
          input: {regexp: /[가-힣]/},
          output: '직업(직종)을 말씀해주세요.', 
            children: [
            {
              id: 269,
              input: {regexp: /[가-힣]|[a-z]/},
              output: '가계의 평균 월 소득을 말씀해주세요', 
                children: [
                {
                  id: 267,
                  input: ['억', '원', '만', '만원', {regexp:/[0-9]/}],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n1. ING 든든암보험(무배당) 예상보험료: 20,050원\n2. ING 간편가입 오렌지 건강보험(무배당) 예상보험료: 24,750원\n3. ING 간편가입 오렌지 건강보험(무배당) 예상보험료: 13,600원\n상세 정보를 보고싶으신 상품을 선택해주세요.', 
                    children: [
                    {
                      id: 256,
                      input: ['1', '암'],
                      output: '[ING 든든암보험(무배당)]\n예상보험료: 20,050원\n지급기준: “암에 대한 보장개시일” 이후에 「고액암」으로 진단확정 시 (최초 1회에 한함)\n1.[2년 미만] 1,000만원\n2.[2년 이상] 2,000만원\n특징:\n1.처음 보험료 그대로 끝까지 가는 암보험 상품\n2.암진단비와 치료비까지 평생 보장\n3.두 번째 암까지 다시 한번 보장\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 252,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 255,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 253,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 254,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 261,
                      input: ['2', '케어'],
                      output: '[ING 오렌지 3케어보험(무배당)]\n예상보험료: 24,750원\n지급기준: 1.피보험자가 보험기간 중\'암에 대한 보장개시일\' 이후에 \'일반암\'으로 진단확정 되었을 경우\n2.피보험자가 보험기간 중 \'뇌출혈\'로 진단확정 되었을 경우\n3.피보험자가 보험기간 중 \'급성심근경색증\'으로 진단확정 되었을 경우\n최초 1회에 한하여 2,000만원(보험가입금액의 200%)\n※ 다만, 계약일부터 2년 미만에 보험금 지급사유가 발생한 경우에는 1,000만원(보험가입금액의 100%)\n특징:\n1.암, 뇌출혈, 급성심근경색증! 한국인의 3대 사망 원인 보장!\n2.다양한 종류의 옵션 선택!\n3.놓칠 수 있는 소액암까지 든든하고 꼼꼼하게 보장!\n4.처음 보험료 그대로 끝까지 가는 비갱신형 상품!\n5.인생에 어려움이 오면 보험료 납입면제 혜택!\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 257,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 260,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 258,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 259,
                              input: '~아니요',
                              output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 266,
                      input: ['3', '간편'],
                      output: '[ING 간편가입 오렌지 건강보험(무배당)]\n예상보험료: 13,600원\n지급기준:\n“암보장개시일” 이후에 “일반암”으로 진단확정 되었을 경우 (최초 1회)\n1.[1년 미만] 1,000만원\n2.[1년 이상] 2,000만원\n특징:\n1.나이가 많아도!\n2.병이 있어도!\n3.3가지 질문만 통과하면 가입가능\n4.든든한 건강플랜\n자세한 상담 혹은 가입신청을 위해서는 상담원 연결이 필요합니다. 도와드릴까요?', 
                        children: [
                        {
                          id: 262,
                          input: '~네',
                          output: {call:'보험가입'}
                        },
                        {
                          id: 265,
                          input: '~아니요',
                          output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                          children: [
                            {
                              id: 263,
                              input: '~네',
                              output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                            },
                            {
                              id: 264,
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
                  id: 268,
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '월 소득의 형식이 틀렸습니다.\n제대로 된 월소득을 입력해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 272,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 287,
  name: '자동차보험',
  input: '자동차 보험',
  output: '자동차 보험을 추천해드리겠습니다.\n차종 혹은 배기량을 말씀해주세요.', 
    children: [
    {
      id: 285,
      input: [{regexp: /[가-힣]|[a-z]/}, 'cc'],
      output: '생년월일 6자리를 입력해주세요.', 
        children: [
        {
          id: 283,
          input: {regexp: /\b((?:\d{6}))\b/},
          output: '최초 가입자이신가요?', 
            children: [
            {
              id: 282,
              input: ['~네', '~아니요'],
              output: '피 보험자의 범위 중 1인, 부부, 가족 중 하나를 입력해주세요.', 
                children: [
                {
                  id: 280,
                  input: ['1 인', '부부', '가족'],
                  output: '머니봇이 국내 36개 보험사 상품을 비교 분석한 결과 고객님께 맞춤화된 최적의 상품을 찾았습니다.\n[머니손해보험 브레인자동차보험]\n보험료: 1,100,000원\n이 상품으로 가입하시겠습니까?', 
                    children: [
                    {
                      id: 276,
                      input: '~네',
                      output: '보험 가입 신청을 도와드리겠습니다.\n휴대폰번호를 입력해주세요.',
                      children: [
                        {
                          id: 274,
                          input: {types: [{type : type.mobileType, context: false}]},
                          output: '보험 가입 신청이 완료되었습니다.\n30분내 상담사가 전화를 드릴 예정입니다.\n이용해주셔서 감사합니다.'
                        },
                        {
                          id: 275,
                          input: {if: 'true'},
                          output: {repeat: 1, options: {output:'휴대폰 번호 형식이 틀렸습니다.\n제대로 된 휴대폰번호를 입력해주세요.\n0. 이전\n!. 처음'}}
                        }
                      ]
                    },
                    {
                      id: 279,
                      input: '~아니요',
                      output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
                      children: [
                        {
                          id: 277,
                          input: '~네',
                          output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
                        },
                        {
                          id: 278,
                          input: '~아니요',
                          output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 머니봇이 되겠습니다.\머니봇 콜센터 번호는 02-858-5683입니다.\n머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 281,
                  input: {if: 'true'},
                  output: {repeat:1, options: {output: '1인, 부부, 가족 중 하나를 말씀해주세요.\n0. 이전\n!. 처음'}}
                }
              ]
            }
          ]
        },
        {
          id: 284,
          input: {if: 'true'},
          output: {repeat:1, options: {output: '생년월일의 형식이 틀렸습니다.\n제대로 된 생년월일 6자리를 입력해주세요.\n0. 이전\n!. 처음'}}
        }
      ]
    },
    {
      id: 286,
      input: {if: 'true'},
      output: {repeat:1, options: {output: '잘못 입력하셨습니다.\n차종 혹은 배기량을 말씀해주세요.\n0. 이전\n!. 처음'}}
    }
  ]
},
{
  id: 291,
  name: '대출',
  input: false,
  output: '신용대출, 전세자금대출, 주택담보대출 중 어떤 대출 정보를 안내해드릴까요?', 
    children: [
    {
      id: 288,
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      id: 289,
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      id: 290,
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    }
  ]
},
{
  id: 297,
  name: '보험',
  input: '보험',
  output: '종신보험, 변액보험, 연금보험, 건강보험, 자동차보험 중 어떤 보험의 정보를 안내해드릴까요?', 
    children: [
    {
      id: 292,
      input: ['종신', '정기'],
      output: {call:'종신보험'}
    },
    {
      id: 293,
      input: '변액',
      output: {call:'변액보험'}
    },
    {
      id: 294,
      input: ['연금', '저축'],
      output: {call:'연금보험'}
    },
    {
      id: 295,
      input: '건강',
      output: {call:'건강보험'}
    },
    {
      id: 296,
      input: '자동차',
      output: {call:'자동차보험'}
    }
  ]
},
{
  id: 312,
  input: '상품 추천',
  output: '어떤 상품을 안내해드릴까요?\n머니봇은 현재 대출, 예적금, 자동차 보험 상품을 추천해드릴 수 있습니다.', 
    children: [
    {
      id: 298,
      input: '신용',
      output: {call:'신용대출'}
    },
    {
      id: 299,
      input: '전세',
      output: {call:'전세자금대출'}
    },
    {
      id: 300,
      input: ['담보', '아파트'],
      output: {call:'주택담보대출'}
    },
    {
      id: 301,
      input: '대출',
      output: {call:'대출'}
    },
    {
      id: 302,
      input: '예금',
      output: {call:'예금'}
    },
    {
      id: 303,
      input: '예 적금',
      output: {call:'예적금'}
    },
    {
      id: 304,
      input: '적금',
      output: {call:'적금'}
    },
    {
      id: 305,
      input: '연금',
      output: {call:'연금'}
    },
    {
      id: 306,
      input: ['종신', '정기'],
      output: {call:'종신보험'}
    },
    {
      id: 307,
      input: '변액',
      output: {call:'변액보험'}
    },
    {
      id: 308,
      input: ['연금', '저축'],
      output: {call:'연금보험'}
    },
    {
      id: 309,
      input: '건강',
      output: {call:'건강보험'}
    },
    {
      id: 310,
      input: '자동차',
      output: {call:'자동차보험'}
    },
    {
      id: 311,
      input: '보험',
      output: {call:'보험'}
    }
  ]
},
{
  id: 317,
  name: '자주묻는질문',
  input: {types: [{type : type.faqType, raw: true, context: true}]},
  output: '아래 중에 궁금하신 내용이 있나요?\n#typeDoc#+index+. +title+\n#번호를 입력하면 상세 내용을 보여드립니다.\n0. 이전\n!. 처음', 
    children: [
    {
      id: 313,
      input: ['0', '!'],
      output: {up:1}
    },
    {
      id: 316,
      input: {types: [{name: 'faq', listName: 'faqDoc', typeCheck: 'listTypeCheck'}]},
      output: '[+faq.title+]\n+faq.content+\n더 필요하신 게 있으시면 말씀해주세요~\n0. 이전\n!. 처음', 
        children: [
        {
          id: 314,
          input: '0',
          output: {up:1}
        },
        {
          id: 315,
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
  id: 0,
  name: '시작',
  input: {regexp: first},
  output: '안녕하세요. 머니브레인 머니봇입니다.\n머니봇은 계좌잔액조회, 계좌내역조회, 금융상품추천, 고객상담 업무를 도와드리고있습니다.\n필요하신 걸 말씀해주세요.'
},
{
  id: 1,
  input: {regexp: up},
  output: {up:1}
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
  id: 9,
  name: '답변없음',
  input: '',
  output: '고객님, 불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n머니봇은 계좌잔액조회, 계좌내역조회, 금융상품추천, 고객상담 업무를 도와드리고있습니다.\n필요하신 걸 말씀해주세요.',
  children: [
   {
     id: 5,
     input: '~네',
     output: '고객센터 번호는 02-858-5683입니다.'
   },
   {
     id: 8,
     input: '~아니요',
     output: '머니봇에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?',
     children: [
       {
         id: 6,
         input: '~네',
         output: '더 좋은 서비스가 되도록 노력하겠습니다. \n감사합니다.'
       },
       {
         id: 7,
         input: '~아니요',
         output: '고객님, 만족스러운 답변을 드리지 못해 죄송합니다. 더 노력하는 MB뉴스가 되겠습니다.\n머니봇 콜센터 번호는 02-858-5683입니다.\nMB뉴스에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.|만족스러운 답변을 드리지 못해 죄송합니다 더 노력하겠습니다.'
       }
     ]
   }
  ]
}
];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('moneybotdemo');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
