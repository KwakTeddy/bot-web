var path = require('path');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var task = require(path.resolve('modules/bot/action/common/task'));
var dialogModule = require(path.resolve('modules/bot/action/common/dialog'));
var orderTask = require(path.resolve('custom_modules/order/orderbot'));
var type = require(path.resolve('modules/bot/action/common/type'));
var orderTasks = utils.requireNoCache(path.resolve('custom_modules/order/order.task'));
var orderTypes = utils.requireNoCache(path.resolve('custom_modules/order/order.type'));
var mongoose = require('mongoose');
var bot = require(path.resolve('config/lib/bot')).getBot('order');

var address = require(path.resolve('modules/bot/action/common/address'));
var orderData = utils.requireNoCache(path.resolve('custom_modules/order/data'));

var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'))

var commonDialogs = [
  { name: '시작',
    input: {regexp: /(처음|시작|:reset user)/g},
    output: function(dialog, context, print, callback) {
    print("안녕하세요.\n인공지능 배달봇 얌얌이에요~ \n주문할 메뉴나 음식점을 말씀해 주세요!\n\n(현재 베타 서비스 중입니다.)\n(서울지역 치킨/중식/피자/햄버거 배달가능)|주문을 말씀해 주세요");
      context.botUser.currentDialog = null;
      context.user.pendingCallback = null;
      context.dialog.initTypes = {};

      context.dialog.orderble = null;
      context.dialog.orderRestaurant = null;
      context.dialog.orderMenu = null;
      context.dialog.orderOption = null;
      context.dialog.restaurant = null;
      context.dialog.menu = null;
      context.dialog.menus = null;
    }
  },

  { input: {if: orderTypes.orderDialogCondition, regexp: /전화/}, output: {call: '전화주문'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:~이전|^0$)/}, output: {up : 1}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:~전페이지|^<$)/}, output: {repeat: 1, options: {page: 'pre'}}},              // TODO 이전페이지, 다음페이지 구현
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:~다음|^>$)/}, output: {repeat: 1, options: {page: 'next'}}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:빼다|삭제|취소|~변경)/, types: [orderTasks.cartType]},output: {returnCall: '메뉴삭제1'} },
  // { input: {if: orderTypes.orderDialogCondition, regexp: /추가/g, types: [orderTasks.menuType]}, output: {returnCallChild: '메뉴입력', options: {commonCallChild: 1}}  },
  { input: {if: orderTypes.orderDialogCondition, regexp: /추가/g, types: [orderTasks.menuType]}, output: [
    {if: 'dialog.parent && dialog.parent.name == "메뉴입력"', output: {returnCallChild: '메뉴입력', options: {commonCallChild: 1, returnDialog: '주문주소확인'}}  },
    {output: {returnCallChild: '메뉴입력', options: {commonCallChild: 1}}  }
    ]
  },
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:(?:(?:음식점|가게|매장).*~변경)|(?:(?:다른\s*곳|다른\s*데|다른\s*대).*~배달))/g}, output: {returnCall: '음식점입력'}  },
  { input: {if: orderTypes.orderDialogCondition, regexp: /주소.*~변경/g}, output: {returnCall: '주소등록'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~휴대폰.*~변경/g}, output: {returnCall: '휴대폰번호등록'}  },
  // { input: {if: orderTypes.orderDialogCondition, regexp: /(?:여기|그만).*~배달/}, output: {returnCall: '주문확인'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /(?:~처음|^!$|취소)/}, output: {returnCall: '주문취소'}},
  { name: dialogModule.NO_DIALOG_NAME, output: [
      '죄송해요. 아직 안 배운 말이예요..\n배달 주문을 도와드릴까요?\n\n(얌얌이는 주문을 위주로 대화를 학습하었습니다.)',
      '죄송해요. 무슨 말인지 모르겠어요..\n배달 주문을 도와드릴까요?\n\n(얌얌이는 주문에 필요한 대화를 중심으로 학습되었습니다.)'
      // '미안하지만, 무슨 말인지 모르겠어요.\n(얌얌이는 주문에 필요한 대화를 중심으로 학습되었습니다.)\n배달 주문을 도와드릴까요?'
    ],
    children: [
      {
        input: /~네/,
        output: {call: '배달주문', options: {top: '배달주문'}}
      },
      {
        input: '~아니요',
        output: '언제든지 기다릴게요~ 필요하실 때 불러주세요~'
      }
    ]}
];

exports.commonDialogs = commonDialogs;

var dialogs = [
  { name: '주소확인', input: /주소.*(?:확인|무엇|뭐|알다)/, output: '현재 주소는 +address.지번주소+ 입니다.'},

  { name: '주소등록', input: {regexp: /주소.*~변경/g},
    output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.',
    children: [
      { input: {types: [{type: type.addressType, raw: true, context: true}]},
        output: [
          { if: 'context.dialog.address.지번본번 == undefined && context.dialog.forceAddress != true',
            output: '주문을 위해서는 번지수 및 동호수를 포함한 상세한 주소가 필요합니다.\n\n주소를 정확히 입력해 주세요.\n그냥 근처의 음식점을 먼저 검색하고 싶으면 "계속"이라고 말씀해주세요.',
            children: [
              {input: '계속', output: {call: '주소변경완료'}},
              {output: {callChild: '주소등록'}}
            ]},
          { if: 'context.dialog.address.지번본번 == undefined && context.dialog.forceAddress == true', output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전 !. 처음'}}},
          { if: 'context.dialog.address.상세주소 == undefined', output: '동호수나 몇층인지 까지 말씀해주세요.\n 있으면 말씀해주시고, 이게 전부이면 "거기까지"라고 얘기해주세요.',
            children: [
              {input: '거기까지', output: {call: '주소변경완료'}},
              { task: { action: function(task, context, callback) {
                  console.log('주소변경' + task.inRaw);
                  context.user.address.상세주소 = context.dialog.address.상세주소 = task.inRaw;
                  context.user.address.지번주소  = context.dialog.address.지번주소 = context.user.address.지번주소 + ' ' + task.inRaw;
                  context.user.address.도로명주소  = context.dialog.address.도로명주소 = context.user.address.도로명주소 + ' ' + task.inRaw;
                  callback(task, context);
                }},
                output: {call: '주소변경완료'}}
          ]},
          {if: 'true', output: {call: '주소변경완료'}}
        ]
      },
      { input: false,
        name: '주소변경완료',
        task: {action: function(task, context, callback) {
          task.address = context.dialog.address;
          context.user.addressCompact = context.user.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
          context.user.updates = ['address'];
          botUser.updateUserContext(context.user, context, function () {
            context.user.updates = null;
            address.naverGeocode(task, context, function(task, context) {
              context.dialog.lat = task.lat; context.dialog.lng = task.lng;

              if(context.botUser.returnCall &&
                context.botUser.currentDialog && context.botUser.currentDialog.top && context.botUser.currentDialog.top.name == '배달주문') {

                if(context.dialog.orderRestaurant) {
                  if(!orderTasks.isRestaurantIndistance(context, context.dialog.orderRestaurant)) {
                    // context.dialog.orderble = null;
                    context.dialog.orderRestaurant = null;
                    context.dialog.orderMenu = null;
                    context.dialog.orderOption = null;
                    context.dialog.restaurant = null;
                    context.dialog.menu = null;
                    context.dialog.menus = null;

                    context.dialog.typeInits['restaurant'] = null;
                    context.dialog.typeInits['menu'] = null;
                    context.dialog.음식점입력최초 == true;

                    context.botUser.returnCall.returnPrefix = '주소가 변경되어 음식점을 다시 검색해야 해요.\n';
                    context.botUser.returnCall.returnDialog = dialogModule.findDialog(null, context, '음식점입력');
                    context.botUser.returnCall.returnMethod = 'callChild';
                    context.botUser.returnCall.returnMethod = null;
                  }
                }
              }

              callback(task, context);
            });
          });
        }},
        output: {output: '주소가 등록되었습니다.', return: 1/*, options: {prefix: '주소가 바뀌어서 주문을 다시 할께요.\n'}*/}},
      { output: {repeat: 1, options: {output: '번지수 및 동호수를 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전 !. 처음 | 상세주소를 말씀해주세요'}}}
    ]
  },

  // { if: function(dialog, context, callback) {
  //   callback(dialog.inRaw.trim() == context.dialog.smsAuth);
  //   },
  //   output: {call: '음식점입력', options: {prefix: '처음에 입력한 동까지의 주소와 실제 배달을 위한 상세주소가 달라서 배달이 가능한 거리가 아니게 됐어요.\n 다시 주문을 진행해 주세요.\n'}}
  // },

  { name: '휴대폰확인', input: /휴대폰.*(?:확인|무엇|뭐|알다)/, output: '현재 휴대폰번호는 +mobile+ 입니다.'},

  { name: '휴대폰번호등록', input: {regexp: /~휴대폰.*~변경/g},
    output: '휴대폰번호를 말씀해주세요.',
      children: [
        { name: 'SMS발송',
          input: {types: [{type : type.mobileType, context: false}]},
          task: {
            preCallback: function(task, context, callback) {
              if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
              console.log('ddd');
              callback(task, context);
            },
            action: messages.sendSMSAuth
          },
          output: [
            {if: 'false' /*'dialog.task.result != "SUCCESS"'*/, output: {repeat: 1, options: {output: '문자 발송이 안되는데, 휴대폰 번호를 다시 말씀해주세요.'}}},
            {output: {call: 'SMS인증'}}   // TODO output에 1개 목록 있을 때 task 두번 호출되는 현상
          ]
        },
        { name: 'SMS인증',
          input: false,
          output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.',
          children: [
            {
              name: 'SMS재발송',
              input: '발송',
              output: {call: 'SMS발송'}
            },
            { name: 'SMS재인증',
              input: /[\d\s]+/,
              output: [
                { if: function(dialog, context, callback) {
                    callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);
                  },
                  task: {action: function(task, context, callback) {
                    context.user['mobile'] = context.dialog['mobile'];
                    context.user.updates = ['mobile'];
                    botUser.updateUserContext(context.user, context, function () {
                      context.user.updates = null;

                      context.dialog.smsAuth == null;
                      callback(task, context);
                    });
                  }},
                  output: {output: '휴대폰 번호가 등록 되었습니다.', return: 1}},
                {output: {call: 'SMS인증', options: {prefix: '인증번호가 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}}}
              ]},
            {output: {repeat: 1, options: {prefix: '인증번호가 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}}}
          ]
        },
        { output: {repeat: 1, options: {prefix: '휴대폰 번호 형식이 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}} }
      ]
  },

  {
    name: '배달주문',
    input: [
      /~배달/,
      {types: [{name: 'orderble', typeCheck: orderTask.orderableTypeCheck}]},
      {types: [{name: 'orderble', typeCheck: orderTask.restaurantTypeCheck, address: false, mongo: {model: 'restaurant', queryFields: ['name'], minMatch: 1}}]}
    ],
    task: {action: function(task, context, callback) {
      context.dialog.음식점입력최초 = true; context.dialog.메뉴입력최초 = true;callback(task, context);
    }},
    output: {call: '주소입력'},
    children: [
      { name: '주문취소', input: false, output: '주문을 취소하고 처음으로 가시겠습니까?',
        children: [
          { input: {regexp: /~네/g}, 
            task: {action: function(task, context, callback) {
              context.botUser.returnCall = null;
              callback(task, context);}
            },
            output: {callGlobal: '시작'} },
          { input: {regexp: /~아니요/g}, output: {output: '주문을 계속 하겠습니다', return: 1} },
          { output: {repeat: 1, output: '주문을 취소 하시려는지 아닌지 모르겠습니다.\n주문을 취소하시려면 "네",\n취소하지 않으시려면 "아니요"" 라고 말씀해주세요.'}}
        ]
      },

      { name: '주소입력', input: false,
        output: [
          { if: 'context.user.address',
            task: {action: function(task, context, callback) {
              task.address = context.dialog.address = context.user.address;
              address.naverGeocode(task, context, function(task, context) {context.dialog.lat = task.lat; context.dialog.lng = task.lng; callback(task, context);});
            }},
            output: {call: '휴대폰번호입력'}},
          { output: {returnCall: '주소등록', options: {returnDialog: '휴대폰번호입력'}}}
        ]
      },

      { name: '휴대폰번호입력', input: false,
        output: [
          { if: 'context.user.mobile', output: {call: '영업시간체크'}},
          { output: {returnCall: '휴대폰번호등록', options: {returnDialog: '영업시간체크'}}}
        ]
      },

      { name: '영업시간체크', input: false,
        output: [
          {if: function(dialog, context, callback) {
              if(context.bot.testMode) {
                callback(false);
              } else {
                var hhmm = new Date().toString().split(' ')[4].substring(0, 5);
                if(hhmm >= '02:00' && hhmm <= '11:30') {
                  callback(true);
                } else {
                  callback(false);
                }
              }
            },
            output: '배달봇 얌얌은 오전 11:30~새벽 2:00까지 배달하고 있습니다. 주문 가능한 시간에 사용해 주세요~'},
          {if: 'true', output: {callChild: '음식점입력'}}
        ]
      },

      { name: '음식점입력',
        input: false,
        output: '주문할 메뉴나 음식점을 말씀해 주세요~',
        children: [
          { name: '음식점메뉴단일',
            input: {types: [{type: orderTask.restaurantType, init: true}, orderTasks.menuType],
              if: 'context.dialog.restaurant && context.dialog.menu && !Array.isArray(context.dialog.restaurant) && !Array.isArray(context.dialog.menu)'},
            output: '가장 적합한 것으로 "+restaurant.name+"에서 "+menu.name+"를 찾았습니다.\n원하시는 것이 맞나요?\n\n아니시면 다른 음식점을 말씀해주세요.|+restaurant.name+에서 +menu.name+를 찾았습니다.\n원하시는 것이 맞나요',
            children: [
              { input: /~네/,
                task: {
                  action: function(task, context, callback) {
                    context.dialog.menus = [];
                    context.dialog.totalPrice = 0;
                    context.dialog.orderRestaurant = context.dialog.restaurant;
                    context.dialog.orderMenu = context.dialog.menu;
                    context.dialog.typeInits['menu'] = true;
                    callback(task, context);
                }},
                output: {call: '메뉴추가확인'}},
              { output: {callChild: '음식점입력'}}
            ]
          },

          { input: {types: [orderTask.restaurantType]},
            output: [
              { if: '!Array.isArray(dialog.task.restaurant)',
                name: '음식점단일',
                output: '가장 적합한 음식점으로 "+restaurant.name+"를 찾았습니다.\n원하시는 음식점이 맞나요?\n\n아니시면 다른 음식점을 말씀해주세요.|+restaurant.name+를 찾았습니다.\n원하시는 음식점이 맞나요',
                children: [
                  { input: /~네/,
                    task: {action: function(task, context, callback) {context.dialog.orderRestaurant = context.dialog.restaurant; callback(task, context);}},
                    output: {call: '메뉴선택'}},
                  { input: /~아니요/, output: {callChild: '음식점입력'}},
                  { output: {callChild: '음식점입력'}}
                ]
              },

              { if: 'Array.isArray(dialog.task.restaurant)',
                name: '음식점목록',
                output: '가장 적합한 음식점들을 찾았습니다. \n#restaurant#+index+. +name+ +openStatus+\n#0. 이전 \n!. 처음(주문취소)\n\n목록에서 번호나 음식점명을 입력해주세요|목록에서 선택해 주세요',
                children: [
                  { input: {types: [{name: 'orderRestaurant', listName: 'restaurant', typeCheck: 'listTypeCheck'}]},
                    output: [
                      { if: 'context.dialog.orderRestaurant.isOpen == false', output: '현재 영업 시간이 아닙니다.\n0. 이전 \n!. 처음(주문취소)',
                        children: [
                          { input: [/~이전/, /^0$/], output: {up : 1}},
                          { input: [/~처음/, /^!$/], output: {call: '주문취소'}}
                        ]
                      },
                      { if: 'true', output: {call: '메뉴선택'}}
                    ]
                  },
                  { input: {types: [{type: orderTask.restaurantType, failSave: false}]}, output: {callChild: '음식점입력'}},
                  { input: [/전단지/, /전단/, /^ㅈㄷㅈ$/], output: {call: '음식점구분'}},
                  { output: {repeat: 1, options: {prefix: '목록에 있는 번호나 음식점을 입력해 주세요!\n\n'}}}
                ]
              }
            ]
          },

          { name: '음식점구분',
            input: [/전단지/, /전단/, /^ㅈㄷㅈ$/],
            output: '[음식점구분]\n1. 치킨\n2. 중국집\n3. 피자\n4. 족발/보쌈\n5. 패스트푸드\n0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 입력해주세요~|목록에서 선택해 주세요',
            children: [
              { input: orderTypes.menuCategoryCheck,
                task: orderTasks.categoryRestaurants,
                output: [
                  {if: 'dialog.task.restaurant && dialog.task.restaurant.length > 0',
                    output: '[+category+]\n##+index+. +name+ +openStatus+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호나 음식점명을 입력해주세요~|목록에서 선택해주세요',
                    children: [
                      { input: {types: [{name: 'orderRestaurant', listName: 'restaurant', typeCheck: 'listTypeCheck'}]},
                        output: [
                          {if: 'context.dialog.orderRestaurant.isOpen == false', output: '현재 영업 시간이 아닙니다.\n0. 이전 \n!. 처음(주문취소)',
                            children: [
                              { input:  [/~이전/, /^0$/], output: {up : 1}},
                              { input: [/~처음/, /^!$/], output: {call: '주문취소'}}
                            ]
                          },
                          {if: 'true', output: {call: '메뉴선택'}}
                        ]
                      },
                      { input: {types: [{type: orderTask.restaurantType, failSave: false}]}, output: {callChild: '음식점입력'}},
                      {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 음식점을 입력해 주세요!\n\n'}}}
                    ]
                  },
                  {if: 'true', output: '[+category+]\n현 주소 근처에서 음식점을 찾지 못했습니다\n0. 이전 \n!. 처음(주문취소)',
                    children: [
                      { input:  [/~이전/, /^0$/], output: {up : 1}},
                      { input: [/~처음/, /^!$/], output: {call: '주문취소'}}
                    ]}
                ]
              },
              { input: {types: [{type: orderTask.restaurantType, failSave: false}]}, output: {callChild: '음식점입력'}},
              {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 음식점을 입력해 주세요!\n\n'}}}
            ]
          },

          { input: {if: 'context.dialog.orderble == undefined && context.dialog.음식점입력최초 == true'},
            task: {action: function(task, context, callback) {
              context.dialog.음식점입력최초 = false; callback(task, context);
            }},
            output: {call: '음식점입력'}
          },

          { output: {call: '음식점입력', options: {output: '"+address.법정읍면동명+ +address.지번본번+-+address.지번부번+" 근처에서 말씀하신 메뉴나 음식점명으로 등록된 음식점이 없는 것 같아요.\n(주문가능 매장은 확대 중입니다.)\n\n다른 메뉴나 음식점을 말씀해 주세요.\n모두 보려면 "전단지"(ㅈㄷㅈ)라고 입력해 주세요~|근처에서 말씀하신걸 못찾았어요. 다른 걸 말씀해주세요.'}}}
        ]
      },

      { name: '메뉴선택', input: false,
        task: {action: orderTasks.menuResetAtion},
        output: [
          // {if: 'context.dialog.restaurant.deliverable != undefined', output: {call: '메뉴선택1'}},
          {if: 'context.dialog.orderRestaurant.deliverable == true', output: {callChild: '메뉴입력'}}
        ]
      },

      { name: '메뉴입력',
        output: '"+orderRestaurant.name+"에서 원하시는 메뉴를 말씀해 주세요.\n모든 메뉴를 보려면 "메뉴판"(ㅁㄴㅍ) 이라고 얘기해주세요|메뉴를 말씀해 주세요',
        children: [
          { input: {if: 'context.dialog.menus && context.dialog.menus.length > 0', regexp: /~네/},
            output: [
              { if: 'context.dialog.orderRestaurant && context.dialog.totalPrice < context.dialog.orderRestaurant.minOrder',
                output: {call: '메뉴입력', options: {output: '최소 주문 금액은 +orderRestaurant.minOrder+원이고, 현재까지 주문금액은 +totalPrice+원 입니다.\n\n추가로 주문할 메뉴를 말씀해 주세요.|추가로 주문할 메뉴를 말씀해주세요'}}},
              { if: 'true', output: {call: '주문주소확인', return: 1}}
            ]
          },
          { input: {if: 'context.dialog.menus && context.dialog.menus.length > 0', regexp: /~아니요/}, output: {repeat: 1}},
          { input: {types: [{type: orderTasks.menuType, init: true}], if: 'context.dialog.menu && !Array.isArray(context.dialog.menu)'},
            task: {action: function(task, context, callback) {context.dialog.orderMenu = context.dialog.menu; callback(task, context);}},
            output: {call: '메뉴추가확인'}
          },

          { name: '메뉴목록', input: {types: [orderTasks.menuType], if: 'Array.isArray(context.dialog.menu)'},
            output: '"+orderRestaurant.name+"에서 적합한 메뉴를 찾았습니다.\n#menu#+index+. +name+ +price+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 선택하거나 메뉴명을 입력해주세요.\n모든 메뉴를 보려면 "메뉴판"(ㅁㄴㅍ) 이라고 얘기해주세요|목록에서 선택해주세요',
            children: [
              { input: {types: [{name: 'orderMenu', listName: 'menu', typeCheck: 'listTypeCheck'}]},
                output: {call: '메뉴추가확인'}},
              { input: [/메뉴판/, /^ㅁㄴㅍ$/, /^ㅁㄴ$/],
                output: {call: '메뉴판'}},
              { input: {types: [{type: orderTasks.menuType, failSave: false}]}, output: {callChild: '메뉴입력'}},
              { output: {repeat: 1, options: {prefix: '목록에 있는 번호나 메뉴를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
            ]
          },

          { name: '메뉴추가확인',
            input: false,
            task: {action: function(task, context, callback) {
              if(context.dialog.orderMenu && context.dialog.orderMenu.options && context.dialog.orderMenu.options.length > 0 && context.dialog.orderMenu.options[0].optionName != "")
                context.dialog['option'] = context.dialog.orderMenu.options[0].optionValues;

                context.dialog.orderOption = null;

                dialogModule.executeType(context.dialog.inRaw, context.dialog.inNLP, context.global.types.count,
                  task, context, function(_inRaw, inDoc, matched) {
                    if(matched) {
                      context.dialog.count = inDoc.count;
                    } else {
                      context.dialog.count = 1;
                    }

                    callback(task, context);
                  });
              }},
            output: [
              { if: 'context.dialog.orderMenu && context.dialog.orderMenu.options && context.dialog.orderMenu.options.length > 0 && context.dialog.orderMenu.options[0].optionName != ""',
                output: {call: '옵션추가확인'}
              },

              { if: 'true', output: {call: '메뉴추가확인3'}}
            ]
          },

          { name: '옵션추가확인',
            input: false,
            output: '"+orderMenu.name+"의 선택메뉴를 골라주세요~ \n#option#+index+.+name+ +price+\n# | 선택메뉴를 골라주세요',
            children: [
              { input: {types: [{name: 'orderOption', listName: 'option', typeCheck: 'listTypeCheck'}]},
                output: {call: '메뉴추가확인3'}
              },
              { output: {repeat: 1, options: {prefix: '목록에 있는 번호나 옵션을 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
            ]
          },

          { name: '메뉴추가확인3',
            input: false,
            output: [
              { if: 'context.dialog.totalPrice + (context.dialog.orderMenu.price || context.dialog.orderOption.price)  * context.dialog.count < context.dialog.orderRestaurant.minOrder',
                task: {action: orderTasks.menuAddAction},
                output: {call: '메뉴입력', options: {prefix: '"+orderRestaurant.name+"에서\n"+orderMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n최소 주문 금액은 +orderRestaurant.minOrder+원이고, 현재까지 주문금액은 +totalPrice+원 입니다.\n\n',
                  output: '추가로 주문할 메뉴를 말씀해 주세요.|추가로 주문할 메뉴를 말씀해주세요'}}
              },
              { if: 'true',
                task: {action: orderTasks.menuAddAction},
                output: { call: '메뉴입력', options: {prefix: '"+orderRestaurant.name+"에서\n"+orderMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n',
                  output: '추가로 주문할 것이 있으면 말씀해 주세요.\n더 주문할 것이 없으시면, 여기까지 주문을 확인해 드릴까요?|여기까지 주문할까요'}}
              }
            ]
          },

          // { input: [/메뉴판/, /^ㅁㄴㅍ$/, /^ㅁㄴ$/], output: {call: '메뉴판'}},
          { name: '메뉴판',
            input: [/메뉴판/, /^ㅁㄴㅍ$/, /^ㅁㄴ$/],
            task: {action: orderTasks.menuCategoryAction},
            output: '[메뉴판]\n##+index+. +name+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 입력해주세요.|목록에서 선택해주세요',
            children: [
              { input: {types: [{name: 'category', typeCheck: 'listTypeCheck'}]},
                task: {action: orderTasks.menuAction},
                output: '[+category.name+]\n##+index+. +name+ +price+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호나 메뉴명을 입력해주세요.|목록에서 선택해주세요',
                children: [
                  { input: {types: [{name: 'orderMenu', listName: 'menu', typeCheck: 'listTypeCheck'}]},
                    output: {call: '메뉴추가확인'}},
                  { input: {types: [{type: orderTasks.menuType, failSave: false}]}, output: {callChild: '메뉴입력'}},
                  {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 메뉴를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
                ]
              },
              { input: {types: [{type: orderTasks.menuType, failSave: false}]}, output: {callChild: '메뉴입력'}},
              {output: {repeat: 1, options: {prefix: '목록에 있는 번호를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
            ]
          },

          { input: '전화', name: '전화주문', output: {text: '음식점 정보를 확인하시고,\n전화로 주문해주세요\n\n음식점명: +orderRestaurant.name+\n주메뉴: +orderRestaurant.category+\n전화번호: +orderRestaurant.phone+', urlMessage: '전화하기', url: 'tel: +orderRestaurant.phone+'}},
          { input: /^\s*(취소|0)\s*$/g, output: {call: '주문취소'}  },

          { input: {if: 'context.dialog.메뉴입력최초 == true'},
            task: {action: function(task, context, callback) {context.dialog.메뉴입력최초 = false; callback(task, context);}},
            output: {call: '메뉴입력'}
          },

          { output: {call: '메뉴판', options: {prefix: '"+orderRestaurant.name+"에서 말씀하신 메뉴를 찾을 수 없어, 메뉴판을 보여드리겠습니다\n\n'}}}
        ]
      },

      { name: '메뉴선택2', input: false,
        output: [
          // { if: 'context.dialog.menu != undefined', name: '메뉴추가확인2', output: '더 주문하실 메뉴가 있으신가요?',
          //   children: [
          //     { input: '~네', output: {call: '메뉴선택'}},
          //     { input: '~아니요', output: {call: '주문확인', return: 1}}
          //   ]
          // },
          // { if: 'context.dialog.menu == undefined',
          //   task: orderTasks.nMapTask,
          //   output: '[+restaurant.name+ 추천메뉴]\n#menu#+index+. +name+ +price+\n#\n메뉴판에서 번호를 선택하거나 메뉴명을 입력해주세요.\n\n추천 메뉴에 원하시는 메뉴가 없거나, 전화주문은 "전화"라고 입력해주세요.',
          //   children: [
          //     { input: {types: [{name: 'menu', typeCheck: orderTypes.numberListTypeCheck}]},
          //       task: {action: orderTasks.menuAddAction},
          //       output: {call: '메뉴추가확인2'}
          //     },
          //     { output: {repeat: 1, prefix: '원하는 메뉴를 찾을 수 없습니다\n'}}
          //   ]
          // },
          { if: 'context.dialog.menu == undefined', output: {call: '전화주문'} }
        ]
      },

      { name: '메뉴삭제1',
        output: '"+delMenu.name+"를 주문 목록에서 삭제할까요?',
        children: [
          { input: /~네/,
            task: {action: function(task, context, callback) {
              for (var i = 0; i < context.dialog.menus.length; i++) {
                var menu = context.dialog.menus[i];
                console.log(context.dialog.delMenu.name, menu.name);

                if(context.dialog.delMenu && Array.isArray(context.dialog.delMenu)) {
                  for (var j = 0; j < context.dialog.delMenu.length; j++) {
                    var _delMenu = context.dialog.delMenu[j];
                    if(_delMenu.name == menu.name)
                      context.dialog.menu.splice(i, 1);
                  }
                } else if(context.dialog.delMenu) {
                  if(context.dialog.delMenu.name == menu.name) {
                    console.log('DEL ' + context.dialog.delMenu.name, menu.name);
                    context.dialog.menus.splice(i, 1);
                  }
                }

                context.dialog.totalPrice = 0;
                for(var j in context.dialog.menus) {
                  context.dialog.totalPrice += context.dialog.menus[j].price * context.dialog.menus[j].count;
                }
              }
              callback(task, context);
            }},
            output: [
              { if: 'context.dialog.menus && context.dialog.menus.length > 0',
                task: {action: function(task, context, callback) {
                  callback(task, context);
                }},
                output: {return: 1, options: {prefix: '+delMenu.name+를 주문 목록에서 삭제 하였습니다.\n\n'}}},
              { if: '!context.dialog.menus || context.dialog.menus.length == 0',
                task: {action: function(task, context, callback) {
                  context.botUser.returnCall = null;

                  callback(task, context);
                }},
                output: {call: '메뉴입력', options: {prefix: '+delMenu.name+를 주문 목록에서 삭제 하였습니다.\n\n'}}}
            ]
          },
          { input: /~아니요/,
            output: {return: 1, options: {prefix: '+delMenu.name+ 삭제를 취소했습니다.\n\n'}}
          },
          { output: {repeat: 1, options: {output: '네 또는 아니요로 말씀해주세요.'}}}
        ]
      },

      { name: '주문주소확인', input: false,
        output: [
          { if: 'context.dialog.address.지번본번 == undefined',
            task: {action: function(task, context, callback) {
              context.dialog.forceAddress = true;     // 상세주소까지 입력하도록 강제
              callback(task, context);
            }},
            output: {returnCall: '주소등록', options: {returnDialog: '주문확인', output: '배달을 위한 상세주소 입력이 필요합니다.\n예시) 강남구 삼성동 16-1 ㅇㅇ아파트 101동 101호\n예시) 강남구 학동로 426 ㅇㅇ아파트 101동 101호\n\n번지수 및 동호수를 포함한 주소를 말씀해주세요.'}}},
          { output: {call: '주문확인'}}
        ]
      },

      { name: '주문확인', input: false,
        task: {action: function(task, context, callback) {
          if(context.user.address) context.user.addressCompact = context.user.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
          if(!context.user.confirmTerms) task.confirmTermText = '최초 주문 시에는 약관을 확인해 주세요. 주문을 진행하시면 약관에 동의한 것으로 간주됩니다.\n약관: https://bot.moneybrain.ai/terms\n\n';
          else task.confirmTermText = '';
          callback(task, context);
        }},
        output: '주문하실 내용을 확인해주세요.\n\n주소: +addressCompact+\n전화: +mobile+\n매장명: +orderRestaurant.name+\n메뉴: #menus#+name+ +price+원 +count+개\n#매장전화: +orderRestaurant.phone+\n\n' +
        '+confirmTermText+'+'이대로 주문할까요?|주문을 확인해주세요. 주문할까요',
        children: [
          { input: {regexp: /~네/g}, output: {call: '배달주문요청'}  },
          { input: {regexp: /~아니요/g}, output: {returnCall: '주문취소'}  },
          // { input: {regexp: /(?:~변경|빼다|삭제|취소)/, types: [orderTasks.cartType]},output: {returnCall: '메뉴삭제1'} },
          { output: {repeat: 1, options: {postfix: '\n취소하시려면 "취소"라고 얘기해주세요.'}}}
        ]
      },

      { name: '배달주문요청', input: false,
        task: orderTasks.orderTask,
        output: '배달 주문이 완료 되었어요.\n인공지능 배달봇 "얌얌"을 이용해 주셔서 감사합니다. ^^'
      }
    ]
  },

  {
    input: {types: [{name: 'orderble', typeCheck: orderTask.orderableTypeCheck}]},
    output: '배달을 원하시나요?',
    children: [
      { input: {regexp: /~네/g}, output: {call: '배달주문'}  },
      { input: {regexp: /~아니요/g}, output: '다른 필요하신게 있으시면 말씀해주세요.' }
    ]
  }


];

exports.dialogs = dialogs;

bot.setDialogs(dialogs);
bot.setCommonDialogs(commonDialogs);
