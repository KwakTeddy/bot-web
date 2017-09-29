
var path = require('path');
var address = require(path.resolve('./modules/bot/action/common/address'));
var medical = require('./medical');

var dialogs = [
{
  name: '방문경로',
  input: ['어떻다 찾다', '어떻다 ~가다', '경로', '가 방법', '교통'],
  output: '현재 계신 지역을 말씀해 주세요.\n예시)\n1.동명: 가산동, 구로동\n2.지번주소: 금천구 가산동 60-3\n3.도로명주소: 금천구 디지털로9길 68\n4.건물명: 조은아트빌|지역을 말씀해 주세요.', 
    children: [
    {
      input: {types: [{name: 'address', typeCheck: address.addressTypeCheck2, raw: true}]},
      output: [
      {if: '!Array.isArray(context.dialog.address)', output: '+address.시군구명+ +address.법정읍면동명+ 맞나요?', 
        children: [
        {
          input: '~네',
          output: {call: '서비스센터정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}, 
      {if: 'Array.isArray(context.dialog.address)', output: '다음 중 어떤 지역이신가요?\n#address#+index+. +지번주소+ +시군구용건물명+\n#', 
        children: [
        {
          input: {types: [{name: 'address', listName: 'address', typeCheck: 'listTypeCheck'}]},
          output: {call: '서비스센터정보'}
        },
        {
          input: {if: 'true'},
          output: {up: 1}
        }
      ]}]
    },
    {
      input: {if: 'true'},
      output: {repeat: 1, options: {output: '지역을 찾을 수 없습니다. 동명을 말씀해주세요.'}}
    }
  ]
},
{
  name: '서비스센터정보',
  input: false,
  task:   medical.ang,
  output: '경로안내입니다 \n +_docs.link_find+\n방문 예약을 하시겠습니까?|경로안내입니다. 방문예약을 하시겠습니까?', 
    children: [
    {
      input: '~네',
      output: {call:'방문예약'}
    },
    {
      input: '~아니요',
      output: '더 필요하신 게 있으신가요?',
      children: [
        {
          input: '~네',
          output: '궁금하신 걸 말씀해주세요~'
        },
        {
          input: '~아니요',
          output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '좋은 하루 보내세요.\n감사합니다.'
            },
            {
              input: '~아니요',
              output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '토요일영업',
  input: ['~월요일', '~화요일', '~수요일', '~목요일', '~금요일', '~토요일'],
  output: '네 영업일입니다.\n서울 아산 병원의 진료시간은 8시30분 ~ 17시30분 (토요일 8시30분~12시30분, 일요일 휴진)입니다.\n더 필요하신 게 있으신가요?|네 영업일 입니다.', 
    children: [
    {
      input: '~네',
      output: '궁금하신 걸 말씀해주세요~'
    },
    {
      input: '~아니요',
      output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '좋은 하루 보내세요.\n감사합니다.'
        },
        {
          input: '~아니요',
          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '공휴일영업',
  input: ['~공휴일', '일요일'],
  output: '죄송합니다. 영업일이 아닙니다.\n서울 아산 병원의 진료시간은 8시30분 ~ 17시30분 (토요일 8시30분~12시30분, 일요일 휴진)입니다.\n더 필요하신 게 있으신가요?|죄송합니다. 영업일이 아닙니다.', 
    children: [
    {
      input: '~네',
      output: '궁금하신 걸 말씀해주세요~'
    },
    {
      input: '~아니요',
      output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '좋은 하루 보내세요.\n감사합니다.'
        },
        {
          input: '~아니요',
          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '영업시간',
  input: ['~영업 ~시간', '몇 시'],
  output: '서울 아산 병원의 진료시간은 8시30분 ~ 17시30분 (토요일 8시30분~12시30분, 일요일 휴진)입니다.\n더 필요하신 게 있으신가요?|진료시간은 8시 30분 ~ 17시 30분 입니다.', 
    children: [
    {
      input: '~네',
      output: '궁금하신 걸 말씀해주세요~'
    },
    {
      input: '~아니요',
      output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '좋은 하루 보내세요.\n감사합니다.'
        },
        {
          input: '~아니요',
          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '전화번호안내',
  input: '~번호',
  output: '서울 아산 병원 콜센터 번호는 1688-7575 입니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      input: '~네',
      output: '궁금하신 걸 말씀해주세요~'
    },
    {
      input: '~아니요',
      output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '좋은 하루 보내세요.\n감사합니다.'
        },
        {
          input: '~아니요',
          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '주차안내',
  input: '~주차',
  output: '네, 중앙주차장, 신관주차장, 후문주차장 세 곳에 주차 가능합니다.\n더 필요하신 게 있으신가요?', 
    children: [
    {
      input: '~네',
      output: '궁금하신 걸 말씀해주세요~'
    },
    {
      input: '~아니요',
      output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
      children: [
        {
          input: '~네',
          output: '좋은 하루 보내세요.\n감사합니다.'
        },
        {
          input: '~아니요',
          output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
        }
      ]
    }
  ]
},
{
  name: '예약확인',
  input: '예약 확인',
  output: '이름과 생년월일을 입력해주세요', 
    children: [
    {
      input: '전용원',
      output: '전용원 고객님의 예약 일자는\n2/21 14:30\n담당의사:김지원 입니다.\n더 필요하신게 있으신가요?|예약내역은 다음과 같습니다. 더 필요하신 게 있으신가요?', 
        children: [
        {
          input: '~네',
          output: '궁금하신 걸 말씀해주세요~'
        },
        {
          input: '~아니요',
          output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
          children: [
            {
              input: '~네',
              output: '좋은 하루 보내세요.\n감사합니다.'
            },
            {
              input: '~아니요',
              output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
            }
          ]
        }
      ]
    }
  ]
},
{
  name: '방문예약',
  input: '예약',
  output: '병원 방문 예약은 아래 서울 아산 병원 홈페이지에서 가능합니다.\nwww.amc.seoul.kr/asan/reservation/main.do\n경로를 안내해드릴까요?|방문 예약은 홈페이지에서 가능합니다. 경로를 안내해드릴까요?', 
    children: [
        {
          input: '~네',
          output: {call:'방문경로'}
        },
        {
          input: '~아니요',
          output: '더 필요하신 게 있으신가요?',
          children: [
            {
              input: '~네',
              output: '궁금하신 걸 말씀해주세요~'
            },
            {
              input: '~아니요',
              output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
              children: [
                {
                  input: '~네',
                  output: '좋은 하루 보내세요.\n감사합니다.'
                },
                {
                  input: '~아니요',
                  output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
                }
              ]
            }
          ]
        }
  ]
}
];

var commonDialogs = [
{
  name: '시작',
  input: '시작',
  task:   {action: 'startAction'},
  output: '안녕하세요. 서울 아산 병원 고객센터 데모 입니다.'
},
{
  input: '이전',
  output: {up:1}
},
{
  input: '전페이지',
  output: {repeat: 1, options: {page: 'pre'}}
},
{
  input: '다음페이지',
  output: {repeat: 1, options: {page: 'next'}}
},
{
  input: '콜센터',
  output: '고객센터 번호는 1688-7575입니다.'
},
{
  name: '답변없음',
  input: '',
  output: '알아듣지 못하는 말입니다.\n고객센터로 연결해드릴까요?',
  children: [
   {
     input: '~네',
     output: '고객센터 번호는 1688-7575입니다.'
   },
   {
     input: '~아니요',
     output: '서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\nChatbot에서 제공해드린 답변이 도움이 되었습니까?|Chatbot에서 제공해드린 답변이 도움이 되었습니까?',
     children: [
       {
         input: '~네',
         output: '좋은 하루 보내세요.\n감사합니다.'
       },
       {
         input: '~아니요',
         output: 'Chatbot을 통해 만족스러운 답변을 드리지 못해 죄송합니다.\n서울 아산 병원 콜센터 번호는 1688-7575입니다.\n서울 아산 병원에서 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.\n감사합니다.'
       }
     ]
   }
  ]
}
];


var _bot = require(require('path').resolve("./engine/core/bot")).getBot('medical');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
