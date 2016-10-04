var path = require('path');
var task = require(path.resolve('modules/bot/action/common/task'));
var dialogModule = require(path.resolve('modules/bot/action/common/dialog'));
var chat = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
var orderTask = require(path.resolve('custom_modules/order/orderbot'));
var type = require(path.resolve('modules/bot/action/common/type'));

var globalDialogs = [
  {
    name: '시작',
    input: {regexp: /(처음|시작|:reset user)/g},
    output: function(dialog, context, print, callback) {
      print('인공지능 배달봇 얌얌 입니다.\n원하시는 배달을 말씀해 주세요~\n예시) 비비큐 후라이드 배달, 짜장면 배달');
      context.botUser.pendingDialog = null;
      context.user.pendingCallback = null;
    }
    // output: '인공지능 배달봇 얌얌 입니다.\n원하시는 배달을 말씀해 주세요~\n예시) 비비큐 후라이드 배달, 짜장면 배달'
  },
  {
    name: '이전',
    input: '9',
    output: {up : 1}
  },
  {
    name: dialogModule.NO_DIALOG_NAME,
    output: '무슨 말인지 모르겠습니다.^^\n 다른 말로 말씀해주세요.'
  }
];

exports.globalDialogs = globalDialogs;

var dialogs = [
  {
    name: '배달주문',
    input: '배달',
    output: {call: '주소입력'}
  },

  { name: '주소입력', input: false,
    output: [
      { condition: 'context.user.address != undefined', output: {call: '휴대폰번호입력'}},
      { condition: 'context.user.address == undefined', output: '주소를 말씀해 주세요.\n(최초 한번만 입력, 테스트중에는 서버재시작시 초기화)',
        children: [
          // { input: {regexp: /주소/g}, output: {call: '휴대폰번호입력'} },
          { input: {types: [{type: type.addressType, context: true}]}, output: {call: '휴대폰번호입력'} },
          { name: '주문취소', input: '0', output: '주문을 취소하고 처음으로 가시겠습니까?',
            children: [
              { input: {regexp: /~네/g}, output: {callGlobal: '시작'} },
              { input: {regexp: /~아니요/g}, output: {call: '주소입력'} },
              { output: {repeat: 1, output: '주문을 취소 하시려는지 아닌지 모르겠습니다.\n주문을 취소하시려면 "네",\n취소하지 않으시려면 "아니요"" 라고 말씀해주세요.'}}
            ]
          },
          { output: {repeat: 1, output: '정확한 주소를 찾을 수 없습니다. 주소를 정확히 입력해 주세요.\n9.이전단계 0. 처음으로'}}
        ]
      }
    ]
  },

  { name: '휴대폰번호입력', input: false,
    output: [
      { condition: 'context.user.mobile != undefined', output: {call: '음식점선택'}},
      { condition: 'context.user.mobile == undefined', output: '휴대폰번호를 말씀해주세요.\n(최초 한번만 입력, 테스트중에는 서버재시작시 초기화)',
        children: [
          { input: {types: [{type : type.mobileType, context: true}]}, output: {call: '음식점선택'} },
          { input: '0', output: {call: '주문취소'}  },
          { output: {repeat: 1, output: '휴대폰 번호를 다시 입력해주세요.\n9.이전단계 0. 처음으로'} }
        ]
      }
    ]
  },
  
  { name: '음식점선택', input: false,
    output: [
      { condition: 'context.botUser.dialog.restaurant != undefined', output: {call: '메뉴선택입력'}},
      { condition: function(dialog, context, callback) {
          if(context.botUser.dialog.restaurant == undefined) {
            context.botUser.dialog.address = context.user.address;
            callback(true);
          } else {
            callback(false);
          }
        },
        output: '주문하실 음식점을 말씀해주세요.',
        children: [
          { input: {types: [orderTask.restaurantType]},
            output: [
              { condition: function(dialog, context, callback) {
                  if (!Array.isArray(context.botUser.dialog.restaurant)) {
                    callback(true);
                  } else if (context.botUser.dialog.restaurant.length == 1) {
                    context.botUser.dialog.restaurant = context.botUser.dialog.restaurant[0];
                    callback(true);
                  }
                },
                output: {call: '메뉴선택'}
              },           // TODO type match 개수 조건
              { condition: 'context.botUser.dialog.restaurant  != undefined', output: '말씀하신 곳과 가장 유사한 매장입니다.\n##+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
                children: [
                  { input: function(inRaw, inNLP, dialog, context, callback) {
                      var num = Number(inRaw);
                      if (num >= 1 && num <= context.botUser.dialog.restaurant.length) {
                        context.botUser.dialog.restaurant = context.botUser.dialog.restaurant[num - 1];

                        // TODO 목록 선택시 텍스트 변경
                        // if (task.in && task[paramDef.name]['matchOriginal']) {
                        //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
                        //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
                        // }

                        callback(true);
                      } else {
                        callback(false);
                      }
                    },
                    output: {call: '메뉴선택'}},
                  {input: {types: [orderTask.restaurantType]},output: {repeat: 1}},
                  {input: '0', output: {call: '주문취소'}},
                  {input: '<', output: {call: '이전페이지'}},            // TODO 이전페이지, 다음페이지 구현
                  {input: '>', output: {call: '다음페이지'}},
                  {output: {repeat: 1}}
                ]}
            ]
          },
          { input: '0', output: {call: '주문취소'}},
          { output: '입력된 주소 근처에서 해당 음식점을 찾을 수 없습니다.\n' +
              '[배달 음식점 구분]\n1. 치킨\n2. 중국집\n3. 피자\n4. 족발/보쌈\n5. 패스트푸드\n9. 이전단계\n0. 처음으로\n\n' +
              '목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
            children: [
              { input: function(inRaw, inNLP, dialog, context, callback) {
                  var num = Number(inRaw);
                  if (num >= 1 && num <= 5) {
                    if(num == 1) context.botUser.dialog.restaurantCategory = '치킨';
                    else if(num == 2) context.botUser.dialog.restaurantCategory = '중국집';
                    else if(num == 3) context.botUser.dialog.restaurantCategory = '피자';
                    else if(num == 4) context.botUser.dialog.restaurantCategory = '족발';
                    else if(num == 5) context.botUser.dialog.restaurantCategory = '패스트푸드';

                    // TODO 목록 선택시 텍스트 변경
                    // if (task.in && task[paramDef.name]['matchOriginal']) {
                    //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
                    //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
                    // }

                    callback(true);
                  } else {
                    callback(false);
                  }
                }, // 유효번호 선택 또는 목록에서 메뉴입력
                // TODO 카테코리별 음식점 조회 TASK
                output: '[+category+]##+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
                children: [
                  { input: function(inRaw, inNLP, dialog, context, callback) {
                      var num = Number(inRaw);
                      if (num >= 1 && num <= context.botUser.dialog.restaurant.length) {
                        context.botUser.dialog.restaurant = context.botUser.dialog.restaurant[num - 1];

                        // TODO 목록 선택시 텍스트 변경
                        // if (task.in && task[paramDef.name]['matchOriginal']) {
                        //   task.in = task.in.replace(task[paramDef.name]['matchOriginal'], type.IN_TAG_START + paramDef.name + type.IN_TAG_END);
                        //   task[paramDef.name + 'Original'] = task[paramDef.name]['matchOriginal'];
                        // }

                        callback(true);
                      } else {
                        callback(false);
                      }
                    },
                    output: {call: '메뉴선택'}},
                  {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
                  {input: '0', output: {call: '주문취소'}},
                  {input: '<', output: {call: '이전페이지'}},
                  {input: '>', output: {call: '다음페이지'}},
                  {output: {repeat: 1}}
                ]
              },
              {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
              {input: '0', output: {call: '주문취소'}},
              {output: {repeat: 1}}
            ]
          }
        ]
      }
    ]
  },

  { name: '메뉴선택', input: false,
    output: [
      {condition: 'context.botUser.dialog.restaurant.franchise != undefined', output: {call: '메뉴선택1'}},               // TODO 메뉴 종류 구분 조건
      {condition: 'context.botUser.dialog.restaurant.franchise != undefined', output: {call: '메뉴선택2'}}
    ]
  },

  { name: '메뉴선택1', input: false,
    output: [
      { condition: 'context.botUser.dialog.menu != undefined', name: '메뉴추가확인1', output: '더 주문하실 메뉴가 있으신가요?',
        children: [
          { input: {regexp: /~네/g}, output: {call: '메뉴선택'}},
          { input: {regexp: /~아니요/g}, output: {call: '주문확인'}}

        ]
      },
      { condition: 'context.botUser.dialog.menu == undefined',
        output: '+restaurant.name+에서 어떤 메뉴를 시키시겠습니까?',                   // TODO output 텍스트 변환
        children: [
          { name: '메뉴추가확인1',
            input: {types: [orderTask.menuType], condition: '하나매칭'},
            output: {call: '메뉴추가확인1'}
          },
          { input: {types: [orderTask.menuType], condition: '복수'},
            output: '{음식점}에서 말씀하신 것과 가장 유사한 메뉴입니다.\n##+index+. +name+\n#\n목록에서 번호를 선택하거나 메뉴명을 입력해주세요.',
            children: [
              {input: function() {},output: {call: '메뉴추가확인1'}},    // TODO 숫자 매치 조건
              {input: {types: [orderTask.menuType]},output: {call: '메뉴추가확인1'}},
              {input: '전화', output: {call: '전화주문'}},
              {input: '0', output: {call: '주문취소'}},
              {input: '<', output: {call: '이전페이지'}},              // TODO 이전페이지, 다음페이지 구현
              {input: '>', output: {call: '다음페이지'}},
              {output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
            ]
          },
          { input: '전화', name: '전화주문', output: '음식점 정보를 확인하시고,\n전화로 주문해주세요.\n\n음식점명: 비비큐 신중동점\n주메뉴: 치킨\n전화번호: 032-111-3333\n\nbutton: 전화하기'},
          { input: '0', output: {call: '주문취소'}  },
          { task: orderTask.menuTask,
            output: '"{음식점명}"에서 그런 메뉴를 찾을 수 없습니다.\n' +
            '[메뉴판]\n##+index+. +name+\n#9. 이전단계\n0. 처음으로\n\n' +
            '메뉴판에서 번호를 선택하거나 메뉴명을 입력해주세요.',
            children: [
              { input: function() {},                                 // TODO 유효번호 선택 또는 목록에서 메뉴입력
                // TODO 음식점 메뉴 조회 TASK
                output: '[+category+]##+index+. +name+\n#\n메뉴판에서에서 번호를 선택하거나 메뉴명을 입력해주세요.',
                children: [
                  {input: function() {}, output: {call: '메뉴추가확인1'}},
                  {input: {types: [orderTask.menuType]},output: {call: '메뉴추가확인1'}},
                  {input: '전화', output: {call: '전화주문'}},
                  {input: '0', output: {call: '주문취소'}},
                  {input: '<', output: {call: '이전페이지'}},
                  {input: '>', output: {call: '다음페이지'}},
                  {output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
                ]
              },
              {input: {types: [orderTask.menuType]},output: {call: '메뉴추가확인1'}},
              {input: '전화', output: {call: '전화주문'}},
              {input: '0', output: {call: '주문취소'}},
              {output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
            ]
          }
        ]
      }
    ]
  },

  { name: '메뉴선택2', input: false,
    // TODO 네이버 정보 조회 TASK
    output: [
      { condition: '메뉴있음', name: '메뉴추가확인2', output: '더 주문하실 메뉴가 있으신가요?',
        children: [
          { input: {regexp: /~네/g}, output: {call: '메뉴선택'}},
          { input: {regexp: /~아니요/g}, output: {call: '주문확인'}}

        ]
      },
      { condition: '상점정보 있는 경우',
        output: '[{음식점} 추천메뉴]\n##+index+. +name+\n#\n메뉴판에서 번호를 선택하거나 메뉴명을 입력해주세요.\n\n추천 메뉴에 원하시는 메뉴가 없거나, 전화주문은 "전화"라고 입력해주세요.',
        children: [
          { name: '메뉴추가확인2',
            input: function() {},
            output: {call: '메뉴추가확인2'}
          },
          { input: '전화', output: {call: '전화주문'}},
          { input: '0', output: {call: '주문취소'}},
          { input: '<', output: {call: '이전페이지'}},                       // TODO 이전페이지, 다음페이지 구현
          { input: '>', output: {call: '다음페이지'}},
          { output: {repeat: 1, prefix: '원하는 메뉴를 찾을 수 없습니다\n'}}     // TODO prefix 추가
        ]
      },
      { condition: '상점정보 없는 경우', output: {call: '전화주문'} }
    ]
  },

  { name: '주문확인', input: false,
    output: '주문하실 내용을 확인해주세요.\n\n주소: +address+\n전화: +mobile+\n\n음식점: +restaurant.name+\n메뉴: +menu.name+ +menu.price+\n매장전화: +restaurant.phone+\n\n' +
    '주문 하시겠습니까?',
    children: [
      { input: '0', output: {call: '주문취소'}  },
      { input: {regexp: /~네/g}, output: {call: '배달주문요청'}  },
      { input: {regexp: /~아니요/g}, output: {call: '주문취소'}  },
      { input: {regexp: /주소.*~변경/g}, output: {call: '주소입력', options: {reuse: 1}}  },     //TODO 주소변경 후 다시 여기(주문확인)으로 돌아오기
      { input: {regexp: /(?:전화|휴대폰).*~변경/g}, output: {call: '휴대폰번호입력', options: {reuse: 1}}  }, //TODO 휴대폰번호변경 후 다시 여기(주문확인)으로 돌아오기
      { input: {regexp: /음식점.*~변경/g}, output: {call: '음식점선택', options: {reuse: 1}}  },     //TODO 음식점변경 후 다시 여기(주문확인)으로 돌아오기
      { input: {regexp: /메뉴.*~변경/g}, output: {call: '메뉴선택', options: {reuse: 1}}  },     //TODO 메뉴변경 후 다시 여기(주문확인)으로 돌아오기
      { input: {regexp: /메뉴.*~추가/g}, output: {call: '메뉴선택', options: {reuse: 1}}  }     //TODO 메뉴삭제 후 다시 여기(주문확인)으로 돌아오기
    ]
  },

  { name: '배달주문요청', input: false,
    task: orderTask.deliveryOrder,                              // TODO 배달 Task 연결
    output: '배달 주문이 완료 되었습니다.\n\n인공지능 배달봇 "얌얌"을 이용해 주셔서 감사합니다.\n\n' +
    '"얌얌"은 카카오톡, 라인, 페이스북에서 모두 사용이 가능합니다.\n\n' +
    '친구 추가하실 때 "인공지능 배달봇 얌얌"을 기억해 주세요~ ^^'
  }
];


exports.dialogs = dialogs;
