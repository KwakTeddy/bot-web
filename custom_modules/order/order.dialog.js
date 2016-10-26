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

var commonDialogs = [
  { name: '시작',
    input: {regexp: /(처음|시작|:reset user)/g},
    output: function(dialog, context, print, callback) {
      print('안녕하세요 인공지능 배달봇 얌얌이에요~ \n드시고 싶은 메뉴나 음식점명을 입력해주시면 도와드릴게요!');
      context.botUser.currentDialog = null;
      context.user.pendingCallback = null;

      context.dialog.restaurant = null;
      context.dialog.menus = null;
    }
  },

  { input: {if: orderTypes.orderDialogCondition, regexp: /전화/}, output: {call: '전화주문'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~이전/}, output: {up : 1}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^,$/}, output: {up : 1}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~처음/}, output: {call: '주문취소'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^\.$/}, output: {call: '주문취소'}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~전페이지/}, output: {repeat: 1, options: {page: 'pre'}}},              // TODO 이전페이지, 다음페이지 구현
  { input: {if: orderTypes.orderDialogCondition, regexp: /^<$/}, output: {repeat: 1, options: {page: 'pre'}}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /~다음페이지/}, output: {repeat: 1, options: {page: 'next'}}},
  { input: {if: orderTypes.orderDialogCondition, regexp: /^>$/}, output: {repeat: 1, options: {page: 'next'}}},
  { name: dialogModule.NO_DIALOG_NAME, output: '미안해요 무슨 말인지 모르겠어요 ㅠ\n얌얌이는 주문을 하고 싶어요! 도와드릴까요?',
    children: [
      {
        input: '~네',
        output: {call: '배달주문'}
      },
      {
        input: '~아니요',
        output: '언제든지 기다릴게요~ 필요하실 때 불러주세요~'
      },
    ]}
];

exports.commonDialogs = commonDialogs;

var dialogs = [
  {
    name: '배달주문',
    input: [
      /~배달/,
      {types: [{name: 'orderble', typeCheck: orderTask.orderableTypeCheck}]}
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
              { name: '주문취소', input: '0', output: '주문을 취소하고 처음으로 가시겠습니까?',
                children: [
                  { input: {regexp: /~네/g}, output: {callGlobal: '시작'} },
                  { input: {regexp: /~아니요/g}, output: {call: '주소입력'} },
                  { output: {repeat: 1, output: '주문을 취소 하시려는지 아닌지 모르겠습니다.\n주문을 취소하시려면 "네",\n취소하지 않으시려면 "아니요"" 라고 말씀해주세요.'}}
                ]
              },
              { output: {repeat: 1, output: '정확한 주소를 찾을 수 없습니다. 주소를 정확히 입력해 주세요.\n이전.이전단계 처음. 처음으로'}}
            ]
          }
        ]
      },

      { name: '휴대폰번호입력', input: false,
        output: [
          { if: 'context.user.mobile && !dialog.returnDialog', output: {call: '음식점선택'}},
          { if: '!context.user.mobile || dialog.returnDialog', output: '휴대폰번호를 말씀해주세요.',
            children: [
              { input: {types: [{type : type.mobileType, context: true}]}, output: {call: '음식점선택', return: 1} },
              { output: {repeat: 1, output: '휴대폰 번호를 다시 입력해주세요.\n이전.이전단계 처음. 처음으로'} }
            ]
          }
        ]
      },

      { name: '음식점선택', input: false,
        output: [
          { if: 'context.dialog.restaurant && !dialog.returnDialog', output: {call: '메뉴선택'}},
          { if: function(dialog, context, callback) {
              context.dialog.address = context.user.address;
              if(!dialog.task) dialog.task = {};

              var restaurantType = orderTask.restaurantType;
              restaurantType.typeCheck(context.dialog.inRaw, restaurantType, dialog.task, context, function(_inRaw, inDoc, matched) {
                if(matched && dialog.task.restaurant && !Array.isArray(dialog.task.restaurant)) {
                  context.dialog.restaurant = dialog.task.restaurant;

                  // orderTasks.saveRestaurantTask(dialog.task, context, function(_task, _context) {
                  //   callback(true);
                  // });
                  callback(true);

                } else callback(false);
              });
            },
            output: {call: '메뉴선택'}
          },
          { if: function(dialog, context, callback) {
              context.dialog.address = context.user.address;
              if(!dialog.task) dialog.task = {};

              var restaurantType = orderTask.restaurantType;
              restaurantType.typeCheck(context.dialog.inRaw, restaurantType, dialog.task, context, function(_inRaw, inDoc, matched) {
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
          { if: function(dialog, context, callback) {
              // if(context.dialog.restaurant == undefined) {
                context.dialog.address = context.user.address;
                callback(true);
              // } else {
              //   callback(false);
              // }
            },
            output: '주문하실 음식점을 말씀해주세요.',
            children: [
              { input: {types: [orderTask.restaurantType]},
              // task: {action: orderTasks.saveRestaurantTask},
                output: [
                  { if: '!Array.isArray(dialog.task.restaurant)',
                    output: {call: '메뉴선택'}
                  },
                  { if: 'Array.isArray(dialog.task.restaurant)',
                    name: '음식점목록',
                    // task: {action: function(task, context, callback) {
                    //   if(task.restaurant) context.dialog.restaurant = task.restaurant;
                    //   else if(!task.restaurant && context.dialog.restaurant) task.restaurant = context.dialog.restaurant;
                    //   callback(task, context);
                    // }},
                    output: '말씀하신 곳과 가장 유사한 매장입니다.\n#restaurant#+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
                    children: [
                      { input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
                        // task: {action: function(task, context, callback) {context.dialog.restaurant = task.restaurant; callback(task, callback);}},
                        output: {call: '메뉴선택'/*, upCallback: orderTasks.upMenu1Callback*/}},
                      {input: {types: [orderTask.restaurantType]},output: {repeat: 1}},
                      {output: {call: '음식점구분'}}
                    ]}
                ]
              },

              { name: '음식점구분',
                output: '근처에서 해당 음식점을 찾을 수 없습니다.\n\n' +
                  '[음식점 종류 선택]\n1. 치킨\n2. 중국집\n3. 피자\n4. 족발/보쌈\n5. 패스트푸드\n\n' +
                  '목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
                children: [
                  { input: orderTypes.menuCategoryCheck,
                    task: orderTasks.categoryRestaurants,
                    output: '[+category+]\n##+index+. +name+\n#\n목록에서 번호를 선택하거나 음식점명을 입력해주세요.',
                    children: [
                      { input: {types: [{name: 'restaurant', typeCheck: 'listTypeCheck'}]},
                        output: {call: '메뉴선택'}},
                      {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
                      {output: {repeat: 1}}
                    ]
                  },
                  {input: {types: [orderTask.restaurantType]},output: {call: '메뉴선택'}},
                  {input: /~이전/, output: {up: 1}},
                  {output: {repeat: 1}}
                ]
              }
            ]
          }
        ]
      },

      { name: '메뉴선택', input: false,
        task: {action: orderTasks.menuResetAtion},
        output: [
          {if: 'context.dialog.restaurant.franchise != undefined', output: {call: '메뉴선택1'}},
          {if: 'context.dialog.restaurant.franchise == undefined', output: {call: '메뉴선택2'}}
        ]
      },

      { name: '메뉴선택1', input: false,
        output: [
          { if: 'context.dialog.menu != undefined', name: '메뉴추가확인1', output: '더 주문하실 메뉴가 있으신가요?',
            children: [
              { input: '~네', output: {call: '메뉴선택1'}},
              { input: '~아니요', output: {call: '주문확인', return: 1}},
              { output: {repeat: 1}}
            ]
          },
          { if: function(dialog, context, callback) {
              if(context.dialog.menus && context.dialog.menus.length > 0) {
                callback(false);
                return;
              }

              if(!dialog.task) dialog.task = {};

              var franchiseMenuType = orderTasks.franchiseMenuType;
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

              var franchiseMenuType = orderTasks.franchiseMenuType;
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
            output: '"+restaurant.name+"에서 어떤 메뉴를 시키시겠습니까?',
            children: [
              { name: '옵션추가확인', input: {types: [orderTasks.franchiseMenuType], if: 'context.dialog.menu && !Array.isArray(context.dialog.menu)'},
                output: [
                  {if: function(dialog, context, callback) {
                      var _bool = context.dialog.menu.options && context.dialog.menu.options.length > 0 &&
                        context.dialog.menu.options[0].optionName != '';
                      if(_bool) {
                        context.dialog['option'] = context.dialog.menu.options[0].optionValues;
                      }
                      callback(_bool);
                    },
                    output: '선택메뉴를 골라주세요. \n#option#+index+.+name+ +price+\n#',
                    children: [
                      { input: {types: [{name: 'option', typeCheck: 'listTypeCheck'}]},
                        task: {action: orderTasks.menuAddAction},
                        output: {call: '메뉴추가확인1'}}
                    ]
                  },
                  {if: 'true', task: {action: orderTasks.menuAddAction}, output: {call: '메뉴추가확인1'}}
                ]
              },
              { name: '메뉴목록', input: {types: [orderTasks.franchiseMenuType], if: 'Array.isArray(context.dialog.menu)'},
                task: {action: function(task, context, callback) {
                  if(task.menu) context.dialog.menu = task.menu;
                  else if(!task.menu && context.dialog.menu) task.menu = context.dialog.menu;
                  callback(task, context);
                }},
                output: '"+restaurant.name+"에서 아래 메뉴를 찾았습니다\n#menu#+index+. +name+ +price+\n#\n목록에서 번호를 선택하거나 메뉴명을 입력해주세요.\n모든 메뉴를 보려면 "메뉴판"이라고 얘기해주세요',
                children: [
                  { input: {types: [{name: 'menu', typeCheck: 'listTypeCheck'}]},
                    // task: {action: orderTasks.menuAddAction},
                    output: {call: '옵션추가확인'/*, upCallback: orderTasks.menuCallback*/}},
                  {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                  {input: /메뉴판/, output: {call: '메뉴판'}},
                  {output: {call: '메뉴판'}}
                  //{output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
                ]
              },
              { input: '전화', name: '전화주문', output: {text: '음식점 정보를 확인하시고,\n전화로 주문해주세요.\n\n음식점명: +restaurant.name+\n주메뉴: +restaurant.category+\n전화번호: +restaurant.phone+', urlMessage: '전화하기', url: 'tel: +restaurant.phone+'}},
              { input: /^\s*(취소|0)\s*$/g, output: {call: '주문취소'}  },
              { name: '메뉴판',
                task: {action: orderTasks.frachiseMenuCategoryAction},
                output: //'"+restaurant.name+"에서 그런 메뉴를 찾을 수 없습니다.\n' +
                '[메뉴판]\n##+index+. +name+\n#\n' +
                '메뉴판에서 번호를 선택하거나 메뉴명을 입력해주세요.',
                children: [
                  { input: {types: [{name: 'category', typeCheck: 'listTypeCheck'}]},
                    task: {action: orderTasks.franchiseMenuAction},
                    output: '[+category.name+]\n##+index+. +name+ +price+\n#\n메뉴판에서에서 번호를 선택하거나 메뉴명을 입력해주세요.',
                    children: [
                      { input: {types: [{name: 'menu', typeCheck: 'listTypeCheck'}]},
                        // task: {action: orderTasks.menuAddAction},
                        output: {call: '옵션추가확인'}},
                      {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                      {output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
                    ]
                  },
                  {input: {types: [orderTask.menuType]},output: {call: '옵션추가확인'}},
                  {output: {repeat: 1, postfix: '\n\n메뉴에 원하시는 것이 없거나, 전화주문은 "전화"라고 입력해주세요.'}}
                ]
              }
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
        output: '주문하실 내용을 확인해주세요.\n\n주소: +address.도로명주소+\n전화: +mobile+\n\n음식점: +restaurant.name+\n메뉴: #menus#+name+ +price+\n#\n매장전화: +restaurant.phone+\n\n' +
        '주문 하시겠습니까?',
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
        output: '배달 주문이 완료 되었습니다.\n인공지능 배달봇 "얌얌"을 이용해 주셔서 감사합니다.\n\n' +
        '"얌얌"은 카카오톡, 라인, 페이스북에서 모두 사용이 가능합니다.\n' +
        '친구 추가하실 때 "인공지능 배달봇 얌얌"을 기억해 주세요~ ^^'
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

  { name: '주소변경', input: ['주소 변경', '주소 바꾸다'],
    output: '주소를 말씀해 주세요.',
    children: [
      { input: {types: [{type: type.addressType, raw: true, context: true}]}, output: '주소가 변경되었습니다.' },
      { output: {repeat: 1, output: '정확한 주소를 찾을 수 없습니다. 주소를 정확히 입력해 주세요.'}}
    ]
  },

  { name: '휴대폰변경', input: ['연락처 변경', '휴대폰 변경', '휴대폰 바꾸다'],
    output: '휴대폰 번호를 말씀해 주세요.',
    children: [
      { input: {types: [{type: type.mobileType, raw: true, context: true}]}, output: '휴대폰 번호가 변경되었습니다.' },
      { output: {repeat: 1, output: '휴대폰 번호 형식이 틀렸습니다 휴대폰 번호를 다시 입력해주세요.'}}
    ]
  },

  {
    input: '프랜 메뉴',
    task: {
      action: orderTasks.frachiseMenuCategoryAction,
      preCallback: function(task, context, callback) {
        var model = mongoose.model('Restaurant');
        model.findOne({_id: mongoose.mongo.ObjectId("57db873914788b13327bd2c7")}, function(err, doc) {
          context.dialog.restaurant = doc._doc;
          callback(task, context);
        })
      }
    },
    output: '출력\n##+index+. +name+\n#'
  },

  {
    input: '실행',
    task: 'baemin',
    output: '완료'
  },

  {
    input: 'insert',
    task: {action: address.insertTest},
    output: '주소입력완료'
  }

];

exports.dialogs = dialogs;

bot.setDialogs(dialogs);
bot.setCommonDialogs(commonDialogs);
