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

var commonDialogs = [
  { name: '시작',
    input: {regexp: /(처음|시작|:reset user)/g},
    output: function(dialog, context, print, callback) {
    print("안녕하세요.\n인공지능 배달봇 얌얌이에요~ \n주문할 메뉴나 음식점을 말씀해 주세요!\n\n(현재 베타 서비스 중입니다.)\n(서울지역 치킨/중식/피자/햄버거 배달가능)");
      context.botUser.currentDialog = null;
      context.user.pendingCallback = null;

      context.dialog.restaurant = null;
      context.dialog.menus = null;
    }
  },

  { input: {if: orderTypes.orderDialogCondition, regexp: /전화/}, output: {call: '전화주문'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~이전/}, output: {up : 1}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^0$/}, output: {up : 1}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~처음/}, output: {call: '주문취소'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^!$/}, output: {call: '주문취소'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~전페이지/}, output: {repeat: 1, options: {page: 'pre'}}},              // TODO 이전페이지, 다음페이지 구현
  { input: {if: orderTypes.orderDialogCondition, regexp: /^<$/}, output: {repeat: 1, options: {page: 'pre'}}},              // TODO 이전페이지, 다음페이지 구현
  { input: {if: orderTypes.orderDialogCondition, regexp: /~다음페이지/}, output: {repeat: 1, options: {page: 'next'}}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^>$/}, output: {repeat: 1, options: {page: 'next'}}},
  { name: dialogModule.NO_DIALOG_NAME, output: [
      '죄송해요. 아직 안 배운 말이예요..\n배달 주문을 도와드릴까요?\n\n(얌얌이는 주문을 위주로 대화를 학습하었습니다.)',
      '죄송해요. 무슨 말인지 모르겠어요..\n배달 주문을 도와드릴까요?\n\n(얌얌이는 주문에 필요한 대화를 중심으로 학습되었습니다.)'
      // '미안하지만, 무슨 말인지 모르겠어요.\n(얌얌이는 주문에 필요한 대화를 중심으로 학습되었습니다.)\n배달 주문을 도와드릴까요?'
    ],
    children: [
      {
        input: '~네',
        // task: {action: function(task, context, callback) {
        //   context.botUser.currentDialog.top = dialogModule.findDialog(null, context, '배달주문');
        //   callback(task, context);
        // }},
        output: {call: '배달주문', options: {top: '배달주문'}}
      },
      {
        input: '~아니요',
        output: '언제든지 기다릴게요~ 필요하실 때 불러주세요~'
      },
    ]}
];

exports.commonDialogs = commonDialogs;

var dialogs = [
  { name: '주소변경', input: ['주소 변경', '주소 바꾸다'],
    output: '주소를 말씀해 주세요.',
    children: [
      { input: {types: [{type: type.addressType, raw: true, context: true}]},
        task: {action: function(task, context, callback) {
          context.user.addressCompact = context.user.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
          // context.user.addressCompact = context.user.addressCompact.replace(/(\s+\(.*\))/, function(matched, p1) {return ''});
          callback(task, context);
        }},
        output: '주소가 변경되었습니다.' },
      { output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전단계 !. 처음으로'}}}
    ]
  },

  {
    name: '배달주문',
    input: [
      /~배달/,
      {types: [{name: 'orderble', typeCheck: orderTask.orderableTypeCheck}]},
      {types: [{name: 'orderble', typeCheck: orderTask.restaurantTypeCheck, address: false, mongo: {model: 'restaurant', queryFields: ['name'], minMatch: 1}}]}
    ],
    output: {call: '주소입력'},
    children: [
      { name: '주소입력', input: false,
        output: [
          { if: 'context.user.address && !dialog.returnDialog', output: {call: '휴대폰번호입력'}},
          { if: '!context.user.address || dialog.returnDialog', output: '주소를 말씀해 주세요.',
            children: [
              // { input: {regexp: /주소/g}, output: {call: '휴대폰번호입력'} },
              { input: {types: [{type: type.addressType, raw: true, context: true}]}, output: {call: '휴대폰번호입력', return: 1} },
              { name: '주문취소', input: /^0$/, output: '주문을 취소하고 처음으로 가시겠습니까?',
                children: [
                  { input: {regexp: /~네/g}, output: {callGlobal: '시작'} },
                  { input: {regexp: /~아니요/g}, output: {call: '주소입력'} },
                  { output: {repeat: 1, output: '주문을 취소 하시려는지 아닌지 모르겠습니다.\n주문을 취소하시려면 "네",\n취소하지 않으시려면 "아니요"" 라고 말씀해주세요.'}}
                ]
              },
              { output: {repeat: 1, options: {output: '지번 또는 도로명을 포함한 상세주소를 말씀해주세요.\n예시) 강남구 삼성동 16-1 101동 101호\n예시) 강남구 학동로 426 101동 101호\n\n주소를 정확히 입력해 주세요.\n0.이전단계 !. 처음으로'}}}
            ]
          }
        ]
      },

      { name: '휴대폰번호입력', input: false,
        output: [
          { if: 'context.user.mobile && !dialog.returnDialog', output: {call: '음식점선택'}},
          { if: '!context.user.mobile || dialog.returnDialog', output: '휴대폰번호를 말씀해주세요.',
            children: [
              { input: {types: [{type : type.mobileType, context: true}]},
                task: {action: messages.sendSMSAuth},
                output: {call: 'SMS인증'}
              },
              {
                name: 'SMS인증',
                input: false,
                output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.',
                children: [
                  { name: 'SMS재인증',
                    input: /\d{4}/,
                    output: [
                      { if: function(dialog, context, callback) {
                          callback(dialog.inRaw.trim() == context.dialog.smsAuth);
                        },
                        task: {action: function(task, context, callback) {
                          context.dialog.smsAuth == null;
                          callback(task, context);
                        }},
                        output: {call: '음식점선택', return: 1}},
                      {output: {call: 'SMS인증', options: {prefix: '인증번호가 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}}}
                    ]},
                  {output: {repeat: 1, options: {prefix: '인증번호가 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}}}
                ]
              },
              { output: {repeat: 1, options: {prefix: '휴대폰 번호 형식이 틀렸습니다.\n', postfix: '\n0. 이전\n!. 처음'}} }

            ]
          }
        ]
      },

      { name: '음식점선택', input: false,
        output: [
          // { if: 'context.dialog.restaurant && !Array.isArray(dialog.task.restaurant) && !dialog.returnDialog', output: {call: '음식점단일'}},
          // { if: 'context.dialog.restaurant && Array.isArray(dialog.task.restaurant) && dialog.task.restaurant.length > 0 && !dialog.returnDialog', output: {call: '음식점목록'}},
          { if: function(dialog, context, callback) {
              context.dialog.address = context.user.address;
              if(!dialog.task) dialog.task = {};

              context.dialog.restaurants = null;
              var inRaw = context.dialog.inRawExt || context.dialog.inRaw;
              var restaurantType = orderTask.restaurantType;
              restaurantType.typeCheck(inRaw, restaurantType, dialog.task, context, function(_inRaw, inDoc, matched) {
                if(matched && dialog.task.restaurant && !Array.isArray(dialog.task.restaurant)) {
                  context.dialog.restaurant = dialog.task.restaurant;

                  // orderTasks.saveRestaurantTask(dialog.task, context, function(_task, _context) {
                  //   callback(true);
                  // });
                  callback(true);

                } else callback(false);
              });
            },
            output: {call: '음식점단일'}
          },
          { if: function(dialog, context, callback) {
              context.dialog.address = context.user.address;
              if(!dialog.task) dialog.task = {};

              var inRaw = context.dialog.inRawExt || context.dialog.inRaw;
              var restaurantType = orderTask.restaurantType;
              restaurantType.typeCheck(inRaw, restaurantType, dialog.task, context, function(_inRaw, inDoc, matched) {
                if(matched && Array.isArray(dialog.task.restaurant)) {
                  context.dialog.restaurant = dialog.task.restaurant;

                  // orderTasks.saveRestaurantTask(dialog.task, context, function(_task, _context) {
                  //   callback(true);
                  // });
                  callback(true);
                } else callback(false);
              });
            },
            output: {call: '음식점목록'}
          },
          { if: 'context.dialog.orderble != undefined',
            output: {call: '음식점입력', options: {output: '"+address.법정읍면동명+ +address.지번본번+-+address.지번부번+" 근처에서 말씀하신 메뉴나 음식점명으로 등록된 음식점이 없는 것 같아요...\n(주문가능 매장은 확대 중입니다.)\n\n다른 메뉴나 음식점을 말씀해 주세요.\n모두 보려면 "전단지"라고 입력해 주세요~'}}
          },
          { if: function(dialog, context, callback) {
              // if(context.dialog.restaurant == undefined) {
                context.dialog.restaurants = null;
                context.dialog.address = context.user.address;
                callback(true);
              // } else {
              //   callback(false);
              // }
            },
            name: '음식점입력',
            output: '주문할 메뉴나 음식점을 말씀해 주세요~',
            children: [
              { input: {types: [orderTask.restaurantType]},
              // task: {action: orderTasks.saveRestaurantTask},
                output: [
                  { if: '!Array.isArray(dialog.task.restaurant)',
                    name: '음식점단일',
                    output: '가장 적합한 음식점으로 "+restaurant.name+"를 찾았습니다.\n원하시는 음식점이 맞나요?\n\n아니시면 다른 음식점을 말씀해주세요.',
                    children: [
                      {input: /~네/, output: {call: '메뉴선택'}},
                      // {input: {types: [orderTask.restaurantType]}, output: {call: '음식점선택'}},
                      { task: {action: function(task, context, callback) {
                          context.dialog.inRawExt = context.dialog.inCurRaw;
                          callback(task, context);
                        }},
                        output: {call: '음식점선택'}
                      }
                    ]
                    // output: {call: '메뉴선택'}
                  },
                  { if: 'Array.isArray(dialog.task.restaurant)',
                    name: '음식점목록',
                    task: {action: function(task, context, callback) {
                      if(context.dialog.restaurants) context.dialog.restaurant = context.dialog.restaurants;
                      else if(!context.dialog.restaurants && context.dialog.restaurant) context.dialog.restaurants = context.dialog.restaurant;
                      callback(task, context);
                    }},
                    output: '가장 적합한 음식점들을 찾았습니다. \n#restaurant#+index+. +name+ +openStatus+\n#0. 이전 !. 처음(주문취소)\n\n목록에서 번호나 음식점명을 입력해주세요',
                    children: [
                      {
                        input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
                        // task: {action: function(task, context, callback) {context.dialog.restaurant = task.restaurant; callback(task, callback);}},
                        output: [
                          { if: 'context.dialog.restaurant.isOpen == false', output: '현재 영업 시간이 아닙니다.\n0. 이전 \n!. 처음(주문취소)',
                            children: [
                              { input: [/~이전/, /^0$/], output: {up : 1}},
                              { input: [/~처음/, /^!$/], output: {call: '주문취소'}}
                            ]
                          },
                          { if: 'true', output: {call: '메뉴선택'}}
                        ]
                      },
                      // {input: {types: [orderTask.restaurantType]},output: {repeat: 1}},
                      {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 음식점을 입력해 주세요!\n\n'}}}
                    ]}
                ]
              },

              { name: '음식점구분',
                input: /전단지/,
                output:
                  '[음식점구분]\n1. 치킨\n2. 중국집\n3. 피자\n4. 족발/보쌈\n5. 패스트푸드\n0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 입력해주세요~',
                children: [
                  { input: orderTypes.menuCategoryCheck,
                    task: orderTasks.categoryRestaurants,
                    output: [
                      {if: 'dialog.task.restaurant.length > 0',
                        output: '[+category+]\n##+index+. +name+ +openStatus+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호나 음식점명을 입력해주세요~',
                        children: [
                          { input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
                            output: [
                              {if: 'context.dialog.restaurant.isOpen == false', output: '현재 영업 시간이 아닙니다.\n0. 이전 \n!. 처음(주문취소)',
                                children: [
                                  { input:  [/~이전/, /^0$/], output: {up : 1}},
                                  { input: [/~처음/, /^!$/], output: {call: '주문취소'}}
                                ]
                              },
                              {if: 'true', output: {call: '메뉴선택'}}
                              ]
                          },
                          // {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
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
                  // {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
                  {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 음식점을 입력해 주세요!\n\n'}}}
                ]
              },

              { output: {repeat: 1, options: {output: '"+address.법정읍면동명+ +address.지번본번+-+address.지번부번+" 근처에서 말씀하신 메뉴나 음식점명으로 등록된 음식점이 없는 것 같아요.\n(주문가능 매장은 확대 중입니다.)\n\n다른 메뉴나 음식점을 말씀해 주세요.\n모두 보려면 "전단지"라고 입력해 주세요~'}}}
              // { output: {call: '음식점구분', options: {prefix: '말씀하신 음식점을 찾을 수 없어, 근처 음식점을 안내합니다.\n\n'}}}
            ]
          }
        ]
      },

      { name: '메뉴선택', input: false,
        task: {action: orderTasks.menuResetAtion},
        output: [
          // {if: 'context.dialog.restaurant.deliverable != undefined', output: {call: '메뉴선택1'}},
          {if: 'context.dialog.restaurant.deliverable == true', output: {call: '메뉴선택1'}}
        ]
      },

      { name: '메뉴선택1', input: false,
        output: [
          { if: 'context.dialog.menu != undefined', name: '메뉴추가확인1', output: '더 주문하실 메뉴가 있으세요?',
            children: [
              { input: '~네', output: {call: '메뉴선택1'}},
              { input: ['~아니요',/주문/, /없다/], output: {call: '주문확인', return: 1}},
              { input: /메뉴판/, output: {call: '메뉴판'}},
              { output: {repeat: 1, options: {prefix: '"네" 또는 "아니요"로 말씀해주세요\n'}}}
            ]
          },
          { if: function(dialog, context, callback) {
              if(context.dialog.menus && context.dialog.menus.length > 0) {
                callback(false);
                return;
              }

              if(!dialog.task) dialog.task = {};

              var franchiseMenuType = orderTasks.menuType;
              dialogModule.executeType(context.dialog.inRaw, context.dialog.inNLP, franchiseMenuType, dialog.task, context, function(_inRaw, inDoc, matched) {
                if(matched && dialog.task.menu && !Array.isArray(dialog.task.menu)) {
                  context.dialog.menu = dialog.task.menu;

                  // context.dialog.inRaw = null;
                  // context.dialog.inNLP = null;

                  callback(true);
                } else callback(false);
              });
           },
            output: {call: '옵션추가확인'}
          },
          { if: function(dialog, context, callback) {
              if(context.dialog.menus && context.dialog.menus.length > 0) {
                callback(false);
                return;
              }

              if(!dialog.task) dialog.task = {};

              var franchiseMenuType = orderTasks.menuType;
              dialogModule.executeType(context.dialog.inRaw, context.dialog.inNLP, franchiseMenuType, dialog.task, context, function(_inRaw, inDoc, matched) {
                if(matched && Array.isArray(dialog.task.menu)) {
                  context.dialog.menu = dialog.task.menu;

                  // context.dialog.inRaw = null;
                  // context.dialog.inNLP = null;

                  callback(true);
                } else callback(false);
                });
            },
            output: {call: '메뉴목록'}
          },
          { if: 'context.dialog.menu == undefined',
            name: '메뉴입력',
            output: '"+restaurant.name+"에서 원하시는 메뉴를 말씀해 주세요.\n모든 메뉴를 보려면 "메뉴판"이라고 얘기해주세요',
            children: [
              { name: '옵션추가확인', input: {types: [orderTasks.menuType], if: 'context.dialog.menu && !Array.isArray(context.dialog.menu)'},
                output: [
                  {if: function(dialog, context, callback) {
                      var _bool = context.dialog.menu.options && context.dialog.menu.options.length > 0 &&
                        context.dialog.menu.options[0].optionName != '';
                      if(_bool) {
                        context.dialog['option'] = context.dialog.menu.options[0].optionValues;
                      }

                      if(!context.dialog.totalPrice) context.dialog.totalPrice = 0;

                      if(!dialog.task) dialog.task = {};
                      dialogModule.executeType(context.dialog.inRaw, context.dialog.inNLP, context.global.types.count,
                          dialog.task, context, function(_inRaw, inDoc, matched) {
                        if(matched) {
                          context.dialog.count = dialog.task.count;
                        } else {
                          context.dialog.count = 1;
                        }

                        callback(_bool);
                      });
                    },
                    output: '"+menu.name+"의 선택메뉴를 골라주세요~ \n#option#+index+.+name+ +price+\n#',
                    children: [
                      { input: {types: [{name: 'option', typeCheck: 'listTypeCheck'}]},
                        output: [
                          { if: 'context.dialog.totalPrice + context.dialog.option.price * context.dialog.count < context.dialog.restaurant.minOrder',
                            task: {action: orderTasks.menuAddAction},
                            output: {call: '메뉴입력', options: {prefix: '"+restaurant.name+"에서\n"+addedMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n최소 주문 금액은 +restaurant.minOrder+원이고, 현재까지 주문금액은 +totalPrice+원 입니다.\n\n'}
                            }
                          },
                          { if: 'true',
                            task: {action: orderTasks.menuAddAction},
                            output: {call: '메뉴추가확인1', options: {prefix: '"+restaurant.name+"에서\n"+addedMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n'}
                            }
                          }
                        ]
                      },
                      {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 옵션을 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
                    ]
                  },
                  { if: 'context.dialog.totalPrice + context.dialog.menu.price * context.dialog.count < context.dialog.restaurant.minOrder',
                    task: {action: orderTasks.menuAddAction},
                    output: {call: '메뉴입력', options: {prefix: '"+restaurant.name+"에서\n"+addedMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n최소 주문 금액은 +restaurant.minOrder+원이고, 현재까지 주문금액은 +totalPrice+원 입니다.\n\n'}}
                  },
                  { if: 'true',
                    task: {action: orderTasks.menuAddAction},
                    output: {call: '메뉴추가확인1', options: {prefix: '"+restaurant.name+"에서\n"+addedMenu.name+" +count+개를\n배달 목록에 추가했습니다.\n\n'}}
                  }
                ]
              },
              { name: '메뉴목록', input: {types: [orderTasks.menuType], if: 'Array.isArray(context.dialog.menu)'},
                // task: {action: function(task, context, callback) {
                //   if(task.menu) context.dialog.menu = task.menu;
                //   else if(!task.menu && context.dialog.menu) task.menu = context.dialog.menu;
                //   callback(task, context);
                // }},
                output: '"+restaurant.name+"에서 적합한 메뉴를 찾았습니다.\n#menu#+index+. +name+ +price+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 선택하거나 메뉴명을 입력해주세요.\n모든 메뉴를 보려면 "메뉴판"이라고 얘기해주세요',
                children: [
                  { input: {types: [{name: 'menu', typeCheck: 'listTypeCheck'}]},
                    // task: {action: orderTasks.menuAddAction},
                    output: {call: '옵션추가확인'/*, upCallback: orderTasks.menuCallback*/}},
                  // {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                  {input: /메뉴판/, output: {call: '메뉴판'}},
                  // {output: {call: '메뉴판', options: {prefix: '"+restaurant.name+"에서 말씀하신 메뉴를 찾을 수 없어, 메뉴판을 보여드리겠습니다\n\n'}}}
                  {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 메뉴를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
                ]
              },
              {input: /메뉴판/, output: {call: '메뉴판'}},
              { input: '전화', name: '전화주문', output: {text: '음식점 정보를 확인하시고,\n전화로 주문해주세요\n\n음식점명: +restaurant.name+\n주메뉴: +restaurant.category+\n전화번호: +restaurant.phone+', urlMessage: '전화하기', url: 'tel: +restaurant.phone+'}},
              { input: /^\s*(취소|0)\s*$/g, output: {call: '주문취소'}  },
              { name: '메뉴판',
                input: false,
                task: {action: orderTasks.menuCategoryAction},
                output: '[메뉴판]\n##+index+. +name+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호를 입력해주세요.',
                children: [
                  { input: {types: [{name: 'category', typeCheck: 'listTypeCheck'}]},
                    task: {action: orderTasks.menuAction},
                    output: '[+category.name+]\n##+index+. +name+ +price+\n#0. 이전\n!. 처음(주문취소)\n\n목록에서 번호나 메뉴명을 입력해주세요.',
                    children: [
                      { input: {types: [{name: 'menu', typeCheck: 'listTypeCheck'}]},
                        // task: {action: orderTasks.menuAddAction},
                        output: {call: '옵션추가확인'}},
                      // {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                      {output: {repeat: 1, options: {prefix: '목록에 있는 번호나 메뉴를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
                    ]
                  },
                  // {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                  {output: {repeat: 1, options: {prefix: '목록에 있는 번호를 입력해 주세요!\n\n', postfix: '\n전화로 주문하시려면 "전화"라고 입력해주세요.'}}}
                ]
              },
              { output: {call: '메뉴판', options: {prefix: '"+restaurant.name+"에서 말씀하신 메뉴를 찾을 수 없어, 메뉴판을 보여드리겠습니다\n\n'}}}
            ]
          }
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

      { name: '주문확인', input: false,
        task: {action: function(task, context, callback) {
          if(context.user.address) context.user.addressCompact = context.user.address.지번주소.replace(/^([가-힣]+\s*)/, function(matched, p1) { return ''});
          if(!context.user.confirmTerms) task.confirmTermText = '최초 주문 시에는 약관을 확인해 주세요. 주문을 진행하시면 약관에 동의한 것으로 간주됩니다.\n약관: https://bot.moneybrain.ai/terms\n\n';
          else task.confirmTermText = '';
          callback(task, context);
        }},
        output: '주문하실 내용을 확인해주세요.\n\n주소: +addressCompact+\n전화: +mobile+\n매장명: +restaurant.name+\n메뉴: #menus#+name+ +price+원 +count+개\n#매장전화: +restaurant.phone+\n\n' +
        '+confirmTermText+'+'이대로 주문할까요?',
        children: [
          { input: '0', output: {call: '주문취소'}  },
          { input: {regexp: /~네/g}, output: {call: '배달주문요청'}  },
          { input: {regexp: /~아니요/g}, output: {call: '주문취소'}  },
          { input: {regexp: /주소.*~변경/g}, output: {returnCall: '주소입력'}  },
          { input: {regexp: /(?:전화|휴대폰).*~변경/g}, output: {returnCall: '휴대폰번호입력'}  },
          { input: {regexp: /음식점.*~변경/g}, output: {returnCall: '음식점선택'}  },
          { input: {regexp: /메뉴.*~변경/g}, output: {returnCall: '메뉴선택'}  },
          { input: {regexp: /메뉴.*~추가/g}, output: {returnCall: '메뉴선택'}  }
        ]
      },

      { name: '배달주문요청', input: false,
        task: orderTasks.orderTask,
        output: '배달 주문이 완료 되었어요.\n인공지능 배달봇 "얌얌"을 이용해 주셔서 감사합니다. ^^'
        // '"얌얌"은 카카오톡, 라인, 페이스북에서 모두 사용이 가능해요.\n' +
        // '친구 추가하실 때 "인공지능 배달봇 얌얌"을 기억해 주세요~ ^^'
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
  },

  { name: '휴대폰변경', input: ['연락처 변경', '휴대폰 변경', '휴대폰 바꾸다'],
    output: '휴대폰 번호를 말씀해 주세요.',
    children: [
      { input: {types: [{type : type.mobileType, context: true}]},
        task: {action: messages.sendSMSAuth},
        output: {call: 'SMS인증2'}
      },
      {
        name: 'SMS인증2',
        input: false,
        output: '문자메세지(SMS)로 발송된 인증번호를 입력해주세요.',
        children: [
          { input: /\d{4}/,
            output: [
              {
                if: function (dialog, context, callback) {
                  callback(dialog.inRaw.trim() == context.dialog.smsAuth);
                },
                task: {
                  action: function (task, context, callback) {
                    context.dialog.smsAuth == null;
                    callback(task, context);
                  }
                },
                output: '휴대폰 번호가 변경 되었습니다.'
              },
              {if: 'true', output: {call: 'SMS인증2', options: {prefix: '인증번호가 틀렸습니다.\n'}}}
            ]},
          {output: {repeat: 1, options: {prefix: '인증번호가 틀렸습니다.\n'}}}
        ]
      },
      { output: {repeat: 1, options: {prefix: '휴대폰 번호 형식이 틀렸습니다.\n'}} }
    ]
  },

];

exports.dialogs = dialogs;

bot.setDialogs(dialogs);
bot.setCommonDialogs(commonDialogs);
