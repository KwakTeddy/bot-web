


var dialogs = [
{
  id: 'sample0',
  filename: 'sample',
  input: '찾다',
  output: '텍스트 내용을 출력합니다.2'
},
{
  id: 'sample1',
  filename: 'sample',
  input: /정규식/g,
  output: 'RegExp 매치 되면 내용 출력합니다.'
},
{
  id: 'sample2',
  filename: 'sample',
  input: {if: function(inRaw, inNLP, dialog, context, callback) { if(inRaw == '함수')callback(true);else callback(false); }},
  output: '조건이 true이면 내용을 출력합니다'
},
{
  id: 'sample3',
  filename: 'sample',
  input: {regexp: /string 조건/g, if: "context.bot.botName == 'sample'"},
  output: 'string 조건이 true이면 내용을 출력합니다'
},
{
  id: 'sample4',
  filename: 'sample',
  input: {types: ['mobileType']},
  output: '휴대폰 +mobile+ 매치 되면 내용을 출력합니다.'
},
{
  id: 'sample5',
  filename: 'sample',
  input: {regexp: /정규식/g, type: ['mobileType'], if: function(inRaw, inNLP, dialog, context, callback) {callback(true);}},
  output: '모두 매치 되면 내용을 출력합니다.'
},
{
  id: 'sample6',
  filename: 'sample',
  input: '추가 표시',
  output: {text: '추가표시', buttons: ['메뉴1', '메뉴2']}
},
{
  id: 'sample7',
  filename: 'sample',
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
  id: 'sample8',
  filename: 'sample',
  input: '외부 Task',
  task:   'helloworldTask2',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  id: 'sample9',
  filename: 'sample',
  input: 'Task 리스트',
  task:   'sampleListTask',
  output: '#doc#+index+. +title+\n# task에서 저장한 내용 표시'
},
{
  id: 'sample10',
  filename: 'sample',
  input: '호출 하다 1',
  output: {call: '호출1'}
},
{
  id: 'sample11',
  filename: 'sample',
  input: false,
  output: '두번째 다이얼로그가 호출되었을 때 출력됩니다.'
},
{
  id: 'sample12',
  filename: 'sample',
  input: '호출 하다 2',
  output: {call: '호출2'}
},
{
  id: 'sample13',
  filename: 'sample',
  input: '재시',
  output: {start: 1}
},
{
  id: 'sample14',
  filename: 'sample',
  input: '이전',
  output: {up: 1}
},
{
  id: 'sample15',
  filename: 'sample',
  input: '뒤로',
  output: {back: 1}
},
{
  id: 'sample16',
  filename: 'sample',
  input: '다시',
  output: {repeat: 1}
},
{
  id: 'sample17',
  filename: 'sample',
  input: 'custom',
  output: function(dialog, context, print, callback) { print('직접 출력 및 custom 처리'); callback(true); }
},
{
  id: 'sample18',
  filename: 'sample',
  input: '옵션 1',
  output: {call: '호출1', options: {output: '표시되는 내용 교체'}}
},
{
  id: 'sample19',
  filename: 'sample',
  input: '옵션 2',
  output: {call: '호출1', options: {prefix: '앞에\n'}}
},
{
  id: 'sample20',
  filename: 'sample',
  input: '옵션 3',
  output: {call: '호출1', options: {postfix: '\n뒤에'}}
},
{
  id: 'sample23',
  filename: 'sample',
  input: '완료 확인',
  output: '다음 내용으로 처리하시겠습니가? 추가할 일이 있으면 "추가"라고 말씀해주세요,', 
    children: [
    {
      id: 'sample21',
      filename: 'sample',
      input: '추가',
      output: {returnCall: '반환'}
    },
    {
      id: 'sample22',
      filename: 'sample',
      input: '네',
      output: '완료되었습니다'
    }
  ]
},
{
  id: 'sample25',
  filename: 'sample',
  name: '반환',
  input: '반환,',
  output: '추가할 내용을 말씀해주세요.,', 
    children: [
    {
      id: 'sample24',
      filename: 'sample',
      input: '호출 반환',
      output: {call: '호출1', return: 1}
    }
  ]
},
{
  id: 'sample29',
  filename: 'sample',
  input: '하위 질문',
  output: '1.메뉴1\n2.메뉴2\n3.메뉴3', 
    children: [
    {
      id: 'sample26',
      filename: 'sample',
      input: '1',
      output: '메뉴1 내용입니다.'
    },
    {
      id: 'sample27',
      filename: 'sample',
      input: '2',
      output: '메뉴2 내용입니다.'
    },
    {
      id: 'sample28',
      filename: 'sample',
      input: '3',
      output: '메뉴3 내용입니다.'
    }
  ]
},
{
  id: 'sample34',
  filename: 'sample',
  input: '상위 질문',
  output: '1.메뉴1\n2.메뉴2,',
  children: [
    {
      id: 'sample31',
      filename: 'sample',
      input: '1',
      output: '메뉴1 내용입니다.\n9.이전,',
      children: [
        {
          id: 'sample30',
          filename: 'sample',
          input: '9',
          output: {up: 1 }
        }
      ]
    },
    {
      id: 'sample33',
      filename: 'sample',
      input: '2',
      output: '메뉴2 내용입니다.\n9.이전,',
      children: [
        {
          id: 'sample32',
          filename: 'sample',
          input: '9',
          output: {up: 1}
        }
      ]
    }
  ]
},
{
  id: 'sample35',
  filename: 'sample',
  input: '랜덤',
  output: ['랜덤 첫번재 경우입니다.', '랜덤 두번째 경우입니다.']
},
{
  id: 'sample36',
  filename: 'sample',
  input: '조건',
  output: [
  {if: 'context.bot.botName == \'sample\'', output: '첫번재 조건이 참인 경우입니다.'}, 
  {if: function(dialog, context, callback) {callback(false);}, output: '두번째 조건이 참인 경우입니다.'}, 
  {if: function(dialog, context, callback) {callback(true);}, output: '세번째 조건이 참인 경우입니다.'}]
},
{
  id: 'sample37',
  filename: 'sample',
  input: false,
  output: '호출되었을 때만 표시됩니다'
},
{
  id: 'sample38',
  filename: 'sample',
  input: '네이버 예약',
  task:   {action: 'naverTest'},
  output: '+name+ 예약 완료되었습니다.'
},
{
  id: 'sample39',
  filename: 'sample',
  input: '네이버',
  task:   {action: 'naversearch'},
  output: '삼성동 코엑스 맛집 검색결과입니다.\n1. 바이킹뷔페 오크우드호텔점\n2. 그랜츠 키친\n3. 케르반 코엑스몰점\n4. 브래서리\n5. 오리옥스 코엑스점\n6. 온더보더 코엑스점'
},
{
  id: 'sample40',
  filename: 'sample',
  input: '삼성',
  task:   {action: 'samsung'},
  output: '삼성카드 VIP카드 조회 결과입니다.\n1. RAUME O(포인트,스카이패스,아시아나)\n2. THE O(포인트,스카이패스,아시아나)\n3. THE 1(포인트,스카이패스,BIZ)\n4. The Platinum Card\n5. Amex Gold Card'
},
{
  id: 'sample41',
  filename: 'sample',
  input: '현대',
  task:   {action: 'hyundai'},
  output: '현대'
},
{
  id: 'sample42',
  filename: 'sample',
  input: '신한',
  task:   {action: 'shinhan'},
  output: '신한'
},
{
  id: 'sample43',
  filename: 'sample',
  input: '롯데',
  task:   {action: 'lotte'},
  output: '롯데'
},
{
  id: 'sample44',
  filename: 'sample',
  input: '모든',
  task:   {action: 'allCard'},
  output: '모든 신용카드 조회 결과입니다.\n\n삼성카드\n1. RAUME O(포인트,스카이패스,아시아나)\n2. THE O(포인트,스카이패스,아시아나)\n3. THE 1(포인트,스카이패스,BIZ)\n4. The Platinum Card\n5. Amex Gold Card\n\n신한카드\n1. The PREMIER\n2. The Ace\n3. The BEST-T\n4. The BEST-F\n5. The LADY BEST\n6. The BEST\n7. The Lady CLASSIC\n8. The CLASSIC+\n9. INFINITE\n10. Super Triple\n\n롯데카드\n1. VEEX 플래티넘 카드\n2. 샤롯데 플래티넘 카드\n3. 플래티넘 스타 카드\n4. SKYPASS 플래티넘 카드\n5. 비엔 플래티넘카드\n6. OPTIN 플래티넘 카드\n7. 위버스카이 카드\n8. DC플러스 플래티넘카드\n\n현대카드\n1. the Black\n2. the Red\n3. the Purple'
},
{
  id: 'sample45',
  filename: 'sample',
  input: 'moneybrain',
  task:   'moneybrainTask',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  id: 'sample46',
  filename: 'sample',
  input: 'sample 3',
  task:   'sampleTask3',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  id: 'sample47',
  filename: 'sample',
  input: 'test ',
  output: ''
},
{
  id: 'sample48',
  filename: 'sample',
  input: 'other task',
  task:   'otherTask',
  output: '+text+\n task에서 저장한 내용 표시'
},
{
  id: 'sample49',
  filename: 'sample',
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
  id: 'sample50',
  filename: 'sample',
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
  id: 'sample51',
  filename: 'sample',
  input: {intent: '테스트 인텐트', entities: ['가전제품']},
  task:   'helloworldTask',
  output: '인텐트, 엔터티 인식'
},
{
  id: 'sample52',
  filename: 'sample',
  input: {intent: '테스트 인텐트'},
  task:   'helloworldTask',
  output: '인텐트 인식'
},
{
  id: 'sample53',
  filename: 'sample',
  input: {entities: ['가전제품']},
  output: '엔터티 인식'
},
{
  id: 'sample54',
  filename: 'sample',
  input: '',
  output: '매칭되는 문장이 없습니다.'
}
];

var commonDialogs = [
{
  id: 'samplecommon0',
  filename: 'samplecommon',
  input: ['여러', /여러/g],
  output: '여러개 중에 하나 일치 되면 표시합니다.'
},
{
  id: 'samplecommon1',
  filename: 'samplecommon',
  name: '시작',
  input: '시작',
  output: 'sample 입니다.'
}
];


var _bot = require(require('path').resolve("./bot-engine/bot")).getBot('sample');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
