


var dialogs = [
{
  input: '찾다',
  output: '텍스트 내용을 출력합니다.2'
},
{
  input: /정규식/g,
  output: 'RegExp 매치 되면 내용 출력합니다.'
},
{
  input: {if: function(inRaw, inNLP, dialog, context, callback) { if(inRaw == '함수')callback(true);else callback(false); }},
  output: '조건이 true이면 내용을 출력합니다'
},
{
  input: {regexp: /string 조건/g, if: "context.bot.botName == 'sample'"},
  output: 'string 조건이 true이면 내용을 출력합니다'
},
{
  input: {types: ['mobileType']},
  output: '휴대폰 +mobile+ 매치 되면 내용을 출력합니다.'
},
{
  input: {regexp: /정규식/g, type: ['mobileType'], if: function(inRaw, inNLP, dialog, context, callback) {callback(true);}},
  output: '모두 매치 되면 내용을 출력합니다.'
},
{
  input: '추가 표시',
  output: {text: '추가표시', buttons: ['메뉴1', '메뉴2']}
},
{
  input: 'Task 호출',
  task:   { name: 'helloworld',
    action: function (task, context, callback) {
      task.doc = { text: 'hello world' };
      callback(task, context);
    }
  },
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  input: '외부 Task',
  task:   'helloworldTask2',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  input: 'Task 리스트',
  task:   'sampleListTask',
  output: '#doc#+index+. +title+\n# task에서 저장한 내용 표시'
},
{
  input: '호출 하다 1',
  output: {call: '호출1'}
},
{
  input: false,
  output: '두번째 다이얼로그가 호출되었을 때 출력됩니다.'
},
{
  input: '호출 하다 2',
  output: {call: '호출2'}
},
{
  input: '재시',
  output: {start: 1}
},
{
  input: '이전',
  output: {up: 1}
},
{
  input: '뒤로',
  output: {back: 1}
},
{
  input: '다시',
  output: {repeat: 1}
},
{
  input: 'custom',
  output: function(dialog, context, print, callback) { print('직접 출력 및 custom 처리'); callback(true); }
},
{
  input: '옵션 1',
  output: {call: '호출1', options: {output: '표시되는 내용 교체'}}
},
{
  input: '옵션 2',
  output: {call: '호출1', options: {prefix: '앞에\n'}}
},
{
  input: '옵션 3',
  output: {call: '호출1', options: {postfix: '\n뒤에'}}
},
{
  input: '완료 확인',
  output: '다음 내용으로 처리하시겠습니가? 추가할 일이 있으면 "추가"라고 말씀해주세요,', 
    children: [
    {
      input: '추가',
      output: {returnCall: '반환'}
    },
    {
      input: '네',
      output: '완료되었습니다'
    }
  ]
},
{
  name: '반환',
  input: '반환,',
  output: '추가할 내용을 말씀해주세요.,', 
    children: [
    {
      input: '호출 반환',
      output: {call: '호출1', return: 1}
    }
  ]
},
{
  input: '하위 질문',
  output: '1.메뉴1\n2.메뉴2\n3.메뉴3', 
    children: [
    {
      input: '1',
      output: '메뉴1 내용입니다.'
    },
    {
      input: '2',
      output: '메뉴2 내용입니다.'
    },
    {
      input: '3',
      output: '메뉴3 내용입니다.'
    }
  ]
},
{
  input: '상위 질문',
  output: '1.메뉴1\n2.메뉴2,',
  children: [
    {
      input: '1',
      output: '메뉴1 내용입니다.\n9.이전,',
      children: [
        {
          input: '9',
          output: {up: 1 }
        }
      ]
    },
    {
      input: '2',
      output: '메뉴2 내용입니다.\n9.이전,',
      children: [
        {
          input: '9',
          output: {up: 1}
        }
      ]
    }
  ]
},
{
  input: '랜덤',
  output: ['랜덤 첫번재 경우입니다.', '랜덤 두번째 경우입니다.']
},
{
  input: '조건',
  output: [
  {if: 'context.bot.botName == \'sample\'', output: '첫번재 조건이 참인 경우입니다.'}, 
  {if: function(dialog, context, callback) {callback(false);}, output: '두번째 조건이 참인 경우입니다.'}, 
  {if: function(dialog, context, callback) {callback(true);}, output: '세번째 조건이 참인 경우입니다.'}]
},
{
  input: false,
  output: '호출되었을 때만 표시됩니다'
},
{
  input: '네이버 예약',
  task:   {action: 'naverTest'},
  output: '+name+ 예약 완료되었습니다.'
},
{
  input: '네이버',
  task:   {action: 'naversearch'},
  output: '삼성동 코엑스 맛집 검색결과입니다.\n1. 바이킹뷔페 오크우드호텔점\n2. 그랜츠 키친\n3. 케르반 코엑스몰점\n4. 브래서리\n5. 오리옥스 코엑스점\n6. 온더보더 코엑스점'
},
{
  input: '삼성',
  task:   {action: 'samsung'},
  output: '삼성카드 VIP카드 조회 결과입니다.\n1. RAUME O(포인트,스카이패스,아시아나)\n2. THE O(포인트,스카이패스,아시아나)\n3. THE 1(포인트,스카이패스,BIZ)\n4. The Platinum Card\n5. Amex Gold Card'
},
{
  input: '현대',
  task:   {action: 'hyundai'},
  output: '현대'
},
{
  input: '신한',
  task:   {action: 'shinhan'},
  output: '신한'
},
{
  input: '롯데',
  task:   {action: 'lotte'},
  output: '롯데'
},
{
  input: '모든',
  task:   {action: 'allCard'},
  output: '모든 신용카드 조회 결과입니다.\n\n삼성카드\n1. RAUME O(포인트,스카이패스,아시아나)\n2. THE O(포인트,스카이패스,아시아나)\n3. THE 1(포인트,스카이패스,BIZ)\n4. The Platinum Card\n5. Amex Gold Card\n\n신한카드\n1. The PREMIER\n2. The Ace\n3. The BEST-T\n4. The BEST-F\n5. The LADY BEST\n6. The BEST\n7. The Lady CLASSIC\n8. The CLASSIC+\n9. INFINITE\n10. Super Triple\n\n롯데카드\n1. VEEX 플래티넘 카드\n2. 샤롯데 플래티넘 카드\n3. 플래티넘 스타 카드\n4. SKYPASS 플래티넘 카드\n5. 비엔 플래티넘카드\n6. OPTIN 플래티넘 카드\n7. 위버스카이 카드\n8. DC플러스 플래티넘카드\n\n현대카드\n1. the Black\n2. the Red\n3. the Purple'
},
{
  input: 'moneybrain',
  task:   'moneybrainTask',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  input: 'sample 3',
  task:   'sampleTask3',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  input: 'test ',
  output: ''
},
{
  input: 'other task',
  task:   'otherTask',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  input: 'button',
  task:   {
      action: function(task, context, callback) {
          task.result = {
              title: '제목테스트',
              text: '링크 테스트 입니다. 링크 테스트 입니다. 링크 테스트 입니다. 링크 테스트 입니다. 링크 테스트 입니다. ',
              buttons: [
                  {text: '상세보기', url: 'http://www.google.com'},
                  {text: '상세보기', url: 'http://www.google.com'},
                  {text: '상세보기', url: 'http://www.google.com'}
              ],
              smartReply: ['버튼1', '버튼2', '버튼3']
          };
          callback(task, context);
      }
  },
  output: 'button 결과'
},
{
  input: 'items',
  task:   {
      action: function(task, context, callback) {
          task.result = {
              items: [
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기', url: 'http://www.google.com'},
                      ]
                  },
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기', url: 'http://www.google.com'},
                      ]
                  },
                  {
                      text: '박근혜 대통령 측이 이달 24일로 예정된 탄핵심판의 최종 변론기일을 3월 초로 연기해달라고 헌법재판소에 공식 요청한 것으로 확인됐다',
                      imageUrl: '/images/news_image.jpg',
                      buttons: [
                          {text: '상세보기', url: 'http://www.google.com'},
                      ]
                  }
              ],
              smartReply: ['버튼1', '버튼2', '버튼3']
          };
          callback(task, context);
      }
  },
  output: 'items 결과'
},
{
  input: '',
  output: '매칭되는 문장이 없습니다.'
}
];

var commonDialogs = [
{
  name: '시작',
  input: '~시작',
  output: '초기화 메세지 입니다'
},
{
  input: ['여러', /여러/g],
  output: '여러개 중에 하나 일치 되면 표시합니다.'
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getBot('sample');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
