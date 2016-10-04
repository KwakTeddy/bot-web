var path = require('path');
var type = require(path.resolve('modules/bot/action/common/type'));
var sampleTasks = require(path.resolve('custom_modules/sample/sampleTasks'));

var i = 0 ;
var dialogs = [
  { name: '시작', input: '~시작', output: '초기화 메세지 입니다 '},

  { input: '일치', output: '텍스트 내용을 출력합니다.'},
  { input: /정규식/g, output: 'RegExp 매치 되면 내용 출력합니다.'},
  { input: {condition: function(inRaw, inNLP, dialog, context, callback) {
      if(inRaw == '함수')callback(true);else callback(false);
    }},
    output: '조건이 true이면 내용을 출력합니다'
  },
  { input: {regexp: /string 조건/g, condition: 'context.bot.botName == "sample"'},
    output: 'string 조건이 true이면 내용을 출력합니다'
  },
  { input: {types: [type.mobileType]}, output: '휴대폰 +mobile+ 매치 되면 내용을 출력합니다.'},
  { input: {regexp: /정규식/g, type: [type.mobileType], condition: function(inRaw, inNLP, dialog, context, callback) {callback(true);}},
    output: '모두 매치 되면 내용을 출력합니다.'},
  { input: [
      '여러',
      /여러/g
    ],
    output: '여러개 중에 하나 일치 되면 표시합니다.'
  },

  { input: '추가 표시', output: {text: '추가표시', buttons: ['메뉴1', '메뉴2']}},

  // Task 호출
  { input: 'Task 호출',
    task: {
      name: 'helloworld',
      action: function (task, context, callback) {
        task.doc = { text: 'hello world' };
        callback(task, context);
      }
    },
    output: '+text+\n task에서 저장한 내용 표시'},

  { input: '외부 Task',
    task: sampleTasks.helloworldTask,
    output: '+text+\n task에서 저장한 내용 표시'},

  { input: 'Task 리스트',
    task: sampleTasks.sampleListTask,
    output: '#doc#+index+. +title+\n# task에서 저장한 내용 표시'},

  { name: '호출1', input: '호출대기', output: '첫번째 다이얼로그가 호출되었을 때 출력됩니다.'},
  { input: '호출 하다 1', output: {call: '호출1'}},

  { name: '호출2', input: false, output: '두번째 다이얼로그가 호출되었을 때 출력됩니다.'},      // 사용자 입력에 대한 match 없이 호출에만 사용됨
  { input: '호출 하다 2', output: {call: '호출2'}},

  { input: '재시', output: {start: 1}},     // 시작
  { input: '이전', output: {up: 1}},        // 상위 (대부분은 이전에 사용됨)
  { input: '뒤로', output: {back: 1}},      // 뒤로 숫자 만큼
  { input: '다시', output: {repeat: 1}},    // 재질문
  { input: 'custom', output: function(dialog, context, print, callback) {
      print('직접 출력 및 custom 처리');
      callback(true);
    }
  },

  { input: '옵션 1', output: {call: '호출1', options: {output: '표시되는 내용 교체'}}},
  { input: '옵션 2', output: {call: '호출1', options: {prefix: '앞에\n'}}},
  { input: '옵션 3', output: {call: '호출1', options: {postfix: '\n뒤에'}}},
  { input: '옵션 4', output: {call: '호출1', options: {return: 1}}},              // 호출한 곳으로 다시 돌아옴
  { input: '옵션 5', output: {call: '호출1', options: {returnable: 1}}},          // reuse와 같이 쓰면 다음으로 가지않고 호출한 곳으로 돌아감

  // 하위이동 children
  { input: '하위 질문', output: '1.메뉴1\n2.메뉴2\n3.메뉴3',
    children: [
      { input: '1', output: '메뉴1 내용입니다.'},
      { input: '2', output: '메뉴2 내용입니다.'},
      { input: '3', output: '메뉴3 내용입니다.'}
    ]
  },

  // 상위이동 {up: 1}
  { input: '상위 질문', output: '1.메뉴1\n2.메뉴2',
    children: [
      { input: '1', output: '메뉴1 내용입니다.\n9.이전',
        children: [
          {input: '9', output: {up: 1}}
        ]},
      { input: '2', output: '메뉴2 내용입니다.\n9.이전',
        children: [
          {input: '9', output: {up: 1}}
        ]
      }
    ]
  },

  { input: '랜덤',
    output: [
      '랜덤 첫번재 경우입니다.',
      '랜덤 두번째 경우입니다.'
    ]
  },

  { input: '조건',
    output: [
      {condition: 'context.bot.botName == "sample"', output: '첫번재 조건이 참인 경우입니다.'},
      {condition: function(dialog, context, callback) {callback(false);}, output: '두번째 조건이 참인 경우입니다.'},
      {condition: function(dialog, context, callback) {callback(true);}, output: '세번째 조건이 참인 경우입니다.'}
    ]
  },

  { name: '호출3', input: false, output: '호출되었을 때만 표시됩니다 '},
  { output: '매칭되는 문장이 없습니다.'}                                     // input이 없으면 순서가 오면 무조건 표시 gambit 역활
];

exports.dialogs = dialogs;






var menuNavi = [
  {
    name: '시작',
    gambit: {call: '1.메뉴1\n2.메뉴2\n3.메뉴3'},
    rejoinders: [
      {
        input: '1',
        output: '[메뉴1]1.서브1\n2.서브2\n3.서브3\n9.이전\n0.처음',
        rejoinders: [
          {
            input: '1',
            output: '[서브1]서브1 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '2',
            output: '[서브2]서브2 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '2',
            output: '[서브2]서브2 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          }
        ]
      },
      {
        input: '2',
        output: '[메뉴2]1.서브1\n2.서브2\n3.서브3\n9.이전\n0.처음',
        rejoinders: [
          {
            input: '1',
            output: '[메뉴2 서브1]서브1 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '2',
            output: '[메뉴2 서브2]서브2 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '3',
            output: '[메뉴2 서브3]서브3 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          }
        ]
      },
      {
        input: '3',
        output: '[메뉴3]1.서브1\n2.서브2\n3.서브3\n9.이전\n0.처음',
        rejoinders: [
          {
            input: '1',
            output: '[메뉴3 서브1]서브1 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '2',
            output: '[메뉴3 서브2]서브2 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          },
          {
            input: '3',
            output: '[메뉴3 서브3]서브3 컨텐츠 표시 \n\n9.이전\n0.처음',
            rejoinders: [
              {input: '9', output: {up: 1}},
              {input: '0', output: {start: 1}}
            ]
          }
        ]
      }
    ]
  }
];
