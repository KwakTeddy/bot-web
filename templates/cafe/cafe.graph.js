
var path = require('path')
var address = require(path.resolve('./modules/bot/action/common/address'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var shop = require(path.resolve('./modules/bot/common/shop'));
var start = require('./start');

var dialogs = [
{
  id: 'cafe0',
  filename: 'cafe',
  input: ['전화', '전화번호'],
  output: '전화번호는 +phone+ 입니다.'
},
{
  id: 'cafe1',
  filename: 'cafe',
  input: ['위치', '찾아가다', '어떻다 가다', '가다 방법'],
  task:   shop.mapTask,
  output: '저희 매장의 주소는\n+address+\n입니다.'
},
{
  id: 'cafe8',
  filename: 'cafe',
  input: ['세일', '행사', '이벤트'],
  task:   {action:shop.eventCategoryAction},
  output: [
  {if: 'context.dialog.categorys == undefined', output: '아직 이벤트 정보를 등록하지 않았습니다.'}, 
  {if: 'context.dialog.categorys.length != 1', output: '[이벤트]\n##+index+. +name+\n#번호를 선택해주세요.', 
    children: [
    {
      id: 'cafe4',
      filename: 'cafe',
      input: {types: [{name: 'category', listName: 'categorys', typeCheck: 'listTypeCheck'}]},
      task:       {action: shop.eventAction},
      output: [
      {if: 'context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
      {output: '[+category.name+]\n##+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.', 
        children: [
        {
          id: 'cafe2',
          filename: 'cafe',
          input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
          task:           shop.menuDetailTask,
          output: '+menu.name+ +menu.subject+\n+menu.description+'
        },
        {
          id: 'cafe3',
          filename: 'cafe',
          input: {if:'true'},
          output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
        }
      ]}]
    },
    {
      id: 'cafe5',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}, 
  {if: 'context.dialog.categorys.length == 1 && context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
  {if: 'context.dialog.categorys.length == 1', output: '##+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.', 
    children: [
    {
      id: 'cafe6',
      filename: 'cafe',
      input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
      task:       shop.menuDetailTask,
      output: '+menu.name+ +menu.subject+\n+menu.description+'
    },
    {
      id: 'cafe7',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}]
},
{
  id: 'cafe15',
  filename: 'cafe',
  input: ['시설', '장비', '기구', '매장 사진'],
  task:   {action:shop.previewCategoryAction},
  output: [
  {if: 'context.dialog.categorys == undefined', output: '아직 시설 정보를 등록하지 않았습니다.'}, 
  {if: 'context.dialog.categorys.length != 1', output: '[시설정보]\n##+index+. +name+\n#번호를 선택해주세요.', 
    children: [
    {
      id: 'cafe11',
      filename: 'cafe',
      input: {types: [{name: 'category', listName: 'categorys', typeCheck: 'listTypeCheck'}]},
      task:       {action: shop.previewAction},
      output: [
      {if: 'context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
      {output: '[+category.name+]\n##+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.', 
        children: [
        {
          id: 'cafe9',
          filename: 'cafe',
          input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
          task:           shop.menuDetailTask,
          output: '+menu.name+ +menu.description+'
        },
        {
          id: 'cafe10',
          filename: 'cafe',
          input: {if:'true'},
          output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
        }
      ]}]
    },
    {
      id: 'cafe12',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}, 
  {if: 'context.dialog.categorys.length == 1 && context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
  {if: 'context.dialog.categorys.length == 1', output: '##+index+. +name+\n#\n번호나 메뉴명을 입력해주세요.', 
    children: [
    {
      id: 'cafe13',
      filename: 'cafe',
      input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
      task:       shop.menuDetailTask,
      output: '+menu.name+ +menu.description+'
    },
    {
      id: 'cafe14',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}]
},
{
  id: 'cafe22',
  filename: 'cafe',
  input: ['무엇 서비스', '서비스 알리다', '서비스', '메뉴', '메뉴', '메뉴판', '메뉴 알리다', '메뉴 뭐', '가격', '가격표', '얼마', '비용'],
  task:   {action: shop.menuCategoryAction},
  output: [
  {if: 'context.dialog.categorys == undefined && (context.bot.menuImage == undefined || context.bot.menuImage == "")', output: '아직 메뉴를 등록하지 않았습니다.'}, {if: 'context.dialog.categorys == undefined && context.bot.menuImage != undefined', task: shop.menuImageTask, output: '[메뉴판보기]'}, 
  {if: 'context.dialog.categorys.length != 1', output: '[가격표]\n##+index+. +name+\n#번호를 선택해주세요.', 
    children: [
    {
      id: 'cafe18',
      filename: 'cafe',
      input: {types: [{name: 'category', listName: 'categorys', typeCheck: 'listTypeCheck'}]},
      task:       {action: shop.menuAction},
      output: [
      {if: 'context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
      {output: '[+category.name+]\n##+index+. +name+ +price+원\n#\n번호나 메뉴명을 입력해주세요.', 
        children: [
        {
          id: 'cafe16',
          filename: 'cafe',
          input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
          task:           shop.menuDetailTask,
          output: '+menu.name+ +menu.price+원'
        },
        {
          id: 'cafe17',
          filename: 'cafe',
          input: {if:'true'},
          output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
        }
      ]}]
    },
    {
      id: 'cafe19',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}, 
  {if: 'context.dialog.categorys.length == 1 && context.user.channel == \'socket\'', output: '정보가 등록되지 않았습니다.'}, 
  {if: 'context.dialog.categorys.length == 1', output: '##+index+. +name+ +price+원\n#\n번호나 메뉴명을 입력해주세요.', 
    children: [
    {
      id: 'cafe20',
      filename: 'cafe',
      input: {types: [{name: 'menu', listName: 'menus', typeCheck: 'listTypeCheck'}]},
      task:       shop.menuDetailTask,
      output: '+menu.name+ +menu.price+원\n+menu.description+'
    },
    {
      id: 'cafe21',
      filename: 'cafe',
      input: {if:'true'},
      output: {repeat: 1, options: {postfix: '\n처음으로 가려면\n "시작"이라고 입력해주세요.'}}
    }
  ]}]
},
{
  id: 'cafe23',
  filename: 'cafe',
  name: '날짜체크',
  input: {types: [{name: 'date', typeCheck: 'dateTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: shop.checkDate},
  output: [
  {if: 'context.dialog.check == true', output: '죄송합니다. 해당 일자는 영업일이 아닙니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.'}, 
  {if: 'context.dialog.check == false', output: '네 영업일입니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.'}]
},
{
  id: 'cafe24',
  filename: 'cafe',
  name: '시간체크',
  input: {types: [{name: 'time', typeCheck: 'timeTypeCheck', raw: true}], regexp: /~영업/},
  task:   {action: shop.checkTime},
  output: [
  {if: 'context.dialog.check == \'re\'', output: '오후 / 오전을 붙여서 이야기 해주세요.\n예시: 오후 2시 영업해?, 14시 영업해?'}, 
  {if: 'context.dialog.check == true', output: '죄송합니다. 영업시간이 아닙니다.\n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.'}, 
  {if: 'context.dialog.check == false', output: '네 영업시간 입니다. \n영업시간은 +startTime+부터\n+endTime+까지이며,\n+holiday+은 휴무입니다.'}]
},
{
  id: 'cafe25',
  filename: 'cafe',
  input: ['영업 시간', '몇 시', '언제 끝', '언제 시작'],
  output: 
  {if: 'context.bot.holiay == \'휴무없음\'', output: '영업시간은 +startTime+ 에서 +endTime+ 입니다.\n 휴무일은 없습니다.'}
},
{
  id: 'cafe35',
  filename: 'cafe',
  name: '예약내역',
  input: ['예약 취소', '예약 확인', '예약 내역'],
  task:   shop.reserveCheck,
  output: [
  {if: 'context.botUser.isOwner && context.dialog.reserves != undefined', output: '미처리 예약내역입니다.\n#reserves#+index+. +name+ +dateStr+ +time+ +numOfPerson+명 [+status+]\n#\n처리할 예약번호를 말씀해주세요.', 
    children: [
    {
      id: 'cafe30',
      filename: 'cafe',
      input: {types: [{name: 'reserve', listName: 'reserves', typeCheck: 'listTypeCheck'}]},
      task:       {action: function(task, context, callback) { task.result = {smartReply: ['예약확정', '예약취소']}; callback(task, context);}},
      output: '상세 예약내역입니다.\n상태: +reserve.status+\n예약자명: +reserve.name+\n일시: +reserve.dateStr+ +reserve.time+\n인원: +reserve.numOfPerson+명\n연락처: +reserve.mobile+\n\n"확정", "취소"를 선택해 주세요.', 
        children: [
        {
          id: 'cafe26',
          filename: 'cafe',
          input: '~확정',
          task:           'reserveOwnerConfirm',
          output: {call: '예약내역', options: {prefix: '예약이 확정 되었습니다. 고객님에게 문자가 발송되었습니다.\n\n'}}
        },
        {
          id: 'cafe28',
          filename: 'cafe',
          input: '~취소',
          output: '취소 이유를 입력해주세요.', 
            children: [
            {
              id: 'cafe27',
              filename: 'cafe',
              input: {if: 'true'},
              task:               'reserveOwnerCancel',
              output: {call: '예약내역', options: {prefix: '예약이 취소 되었습니다.\n\n'}}
            }
          ]
        },
        {
          id: 'cafe29',
          filename: 'cafe',
          input: {if: 'true'},
          output: {repeat: 1, options: {output: '"확정" 또는 "취소"라고 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'cafe31',
      filename: 'cafe',
      input: {if: 'true'},
      output: {repeat: 1, options: {prefix: '목록에서 선택해주세요.\n'}}
    }
  ]}, 
  {if: 'context.botUser.isOwner && context.dialog.reserves == undefined', output: '미처리 예약내역이 없습니다.'}, 
  {if: 'context.dialog.reserves != undefined', output: '고객님의 예약 내역입니다.\n#reserves#+index+. +dateStr+ +time+ +numOfPerson+명 [+status+]\n#\n예약을 취소하시려면, 취소할 번호를 말씀해주세요.', 
    children: [
    {
      id: 'cafe32',
      filename: 'cafe',
      input: {types: [{name: 'reserve', listName: 'reserves', typeCheck: 'listTypeCheck'}]},
      task:       'reserveCancel',
      output: '예약이 취소되었습니다.'
    },
    {
      id: 'cafe33',
      filename: 'cafe',
      input: {if: 'true'},
      output: {repeat: 1, options: {prefix: '목록에서 선택해주세요.\n'}}
    }
  ]}, 
  {if: 'context.dialog.reserve != undefined', output: '고객님의 예약 내역입니다.\n상태: +reserve.status+\n일시: +reserve.dateStr+ +reserve.time+\n인원: +reserve.numOfPerson+명\n예약자명: +reserve.name+\n연락처: +reserve.mobile+\n\n예약을 취소하시려면 "취소"라고 말씀해주세요.', 
    children: [
    {
      id: 'cafe34',
      filename: 'cafe',
      input: '취소',
      task:       'reserveCancel',
      output: '예약이 취소되었습니다.'
    }
  ]}, '고객님의 예약내역이 없습니다.']
},
{
  id: 'cafe57',
  filename: 'cafe',
  input: '예약',
  output: {callChild: '날짜선택'}, 
    children: [
    {
      id: 'cafe39',
      filename: 'cafe',
      name: '날짜선택',
      input: false,
      output: '예약하실 일자를 말씀해 주세요.', 
        children: [
        {
          id: 'cafe36',
          filename: 'cafe',
          input: {types: [{name: 'date', typeCheck: 'dateTypeCheck'}]},
          task:           {action: shop.checkDate},
          output: {callChild: '시간선택'}
        },
        {
          id: 'cafe37',
          filename: 'cafe',
          input: {if: 'context.dialog.날짜입력최초 == undefined'},
          task:           {
            action: function(task, context, callback) {
              context.dialog.날짜입력최초 = true; callback(task, context);
            }
          },
          output: {call: '날짜선택'}
        },
        {
          id: 'cafe38',
          filename: 'cafe',
          input: {if: 'true'},
          output: {repeat: 1, options: {prefix: '날짜가 아닙니다.\n', postfix: '\n\n취소하고 처음으로가려면\n"시작"이라고 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'cafe43',
      filename: 'cafe',
      name: '시간선택',
      input: false,
      output: '예약하실 시간을 말씀해 주세요.', 
        children: [
        {
          id: 'cafe40',
          filename: 'cafe',
          input: {types: [{name: 'time', typeCheck: 'timeTypeCheck'}]},
          task:           {action: shop.checkTime},
          output: [
          {if: 'context.dialog.check == \'re\'', output: {call : '시간선택', options: {prefix: '시간은 오전/오후를 붙여서 이야기 해주세요.\n예시: 오후 2시, 14시\n\n'}}}, 
          {if: 'true', output: {callChild: '인원선택'}}]
        },
        {
          id: 'cafe41',
          filename: 'cafe',
          input: {if: 'context.dialog.시간입력최초 == undefined'},
          task:           {
            action: function(task, context, callback) {
              context.dialog.시간입력최초 = true; callback(task, context);
            }
          },
          output: {call: '시간선택'}
        },
        {
          id: 'cafe42',
          filename: 'cafe',
          input: {if: 'true'},
          output: {repeat: 1, options: {prefix: '시간이 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'cafe47',
      filename: 'cafe',
      name: '인원선택',
      input: false,
      output: '몇명이 오실지 말씀해 주세요', 
        children: [
        {
          id: 'cafe44',
          filename: 'cafe',
          input: {types: [{name: 'numOfPerson', typeCheck: 'numOfPersonTypeCheck', init: true}]},
          output: {call: '예약자명'}
        },
        {
          id: 'cafe45',
          filename: 'cafe',
          input: {if: 'context.dialog.인원선택최초 == undefined'},
          task:           {
            action: function(task, context, callback) {
              context.dialog.인원선택최초 = true; callback(task, context);
            }
          },
          output: {call: '인원선택'}
        },
        {
          id: 'cafe46',
          filename: 'cafe',
          input: {if: 'true'},
          output: {repeat: 1, options: {prefix: '인원수가 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'cafe49',
      filename: 'cafe',
      name: '예약자명',
      input: false,
      output: '예약하실 이름을 입력해주세요.', 
        children: [
        {
          id: 'cafe48',
          filename: 'cafe',
          input: {if: 'true'},
          task:           'reserveNameTask',
          output: [
          {if: 'context.user.mobile == undefined', output: {call: '휴대폰번호입력'}}, 
          {if: 'true', output: {call: '예약내용확인'}}]
        }
      ]
    },
    {
      id: 'cafe54',
      filename: 'cafe',
      name: '휴대폰번호입력',
      input: false,
      output: '휴대폰 번호를 말씀해주세요.', 
        children: [
        {
          id: 'cafe52',
          filename: 'cafe',
          input: {types: [{type : type.mobileType, context: false}]},
          task:           'smsAuth',
          output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.', 
            children: [
            {
              id: 'cafe50',
              filename: 'cafe',
              input: {regexp: /[\d\s]+/},
              output: [{if: shop.smsAuthValid, task: 'smsAuthTask', output: {call: '예약내용확인'}}, {if: shop.smsAuthinValid, repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}]
            },
            {
              id: 'cafe51',
              filename: 'cafe',
              input: {if: 'true'},
              output: {repeat: 1, options: {output:'인증번호가 틀렸습니다.\n제대로 된 인증번호를 입력해주세요.\n0. 이전\n!. 처음'}}
            }
          ]
        },
        {
          id: 'cafe53',
          filename: 'cafe',
          input: {if: 'true'},
          output: {repeat: 1, options: {prefix: '휴대폰 번호가 아닙니다.\n', postfix: '\n\n예약 진행을 취소하시려면\n"시작"이라고 말씀해주세요.'}}
        }
      ]
    },
    {
      id: 'cafe56',
      filename: 'cafe',
      name: '예약내용확인',
      input: false,
      task:       {action: 'reserveConfirm'},
      output: '예약내용을 확인해주세요.\n일시: +dateStr+ +time+\n인원: +numOfPerson+명\n연락처: +mobile+\n다음과 같이 예약신청하시겠습니까?', 
        children: [
        {
          id: 'cafe55',
          filename: 'cafe',
          input: '~네',
          task:           {action: 'reserveRequest'},
          output: '예약을 요청하였습니다.\n\n아직 확정이 아닙니다.\n좌석 확인 후 예약완료 문자를 보내 드리겠습니다.'
        }
      ]
    }
  ]
},
{
  id: 'cafe58',
  filename: 'cafe',
  input: '안녕',
  output: '안녕하세요.'
}
];

var commonDialogs = [
{
  id: 'cafecommon0',
  filename: 'cafecommon',
  name: '시작',
  input: '시작',
  task:   start.startTask,
  output: [{if: 'context.botUser.isOwner', output: {call: '예약내역', options: {prefix: '+name+ 인공지능 챗봇입니다.\n사장님께서 접속 하였습니다.\n\n'}}}, '+name+ 인공지능 챗봇입니다.\n문의할 내용을 말씀해주세요.\n\n예시) 위치, 영업시간, 메뉴\n예시) 내일 저녁 7시에 4명 예약']
},
{
  id: 'cafecommon3',
  filename: 'cafecommon',
  name: '답변없음',
  input: '',
  output: '불편을 끼쳐드려 죄송합니다. 현재 고객님께서 무슨 말씀을 하시는지 이해를 못하였습니다.\n 매장으로 전화하여 안내받으시겠습니까?',
  children: [
   {
     id: 'cafecommon1',
     filename: 'cafecommon',
     input: '~네',
     output: '매장 전화번호는 +phone+ 입니다.'
   },
   {
     id: 'cafecommon2',
     filename: 'cafecommon',
     input: '~아니요',
     output: '+name+에서는 보다 빠르고 정확한 도움을 드리기 위해 노력하겠습니다.'
   }
  ]
}
];


var _bot = require(require('path').resolve("config/lib/bot")).getTemplateBot('cafe');
_bot.setDialogs(dialogs);
_bot.setCommonDialogs(commonDialogs);
