var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var logger = require(path.resolve('config/lib/logger'));
var utils = require(path.resolve('modules/bot/action/common/utils'));
var type = require(path.resolve('modules/bot/action/common/type'));
var manager = require(path.resolve('custom_modules/order/manager'));
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'))
var dateformat = require('dateformat');

var restaurantCategory = [
  {category: '치킨', alias: '치킨 통닭 닭 chicken'},
  {category: '중국집', alias: '중국 중국집 중식 짱깨 짱께 중식당 chinese'},
  {category: '피자', alias: '피자 핏자 pizza'},
  {category: '패스트푸드', alias: '햄버거 버거 burger'},
  {category: '족발', alias: '족발 돼지발'},
  {category: '보쌈', alias: '보쌈'}
];

var menuCategory = [
  {category: '치킨', 'menu': '치킨 닭 후라이드 양념치킨 양념닭 chicken 바베큐'},
  {category: '중국집', 'menu': '짜장 짜장면 간짜장 자장면 짬뽕 잠뽕 우동 볶음밥 짬뽕밥 짜장밥 잡채밥 마파두부 쟁반짜장 탕수육 깐풍 깐소 라조 유산슬 양장피 팔보채 고추잡채 난자완스 오향장육'},
  {category: '피자', 'menu': '피자 핏자 pizza 스파케티 스파게리'},
  {category: '패스트푸드', 'menu': '햄버거 버거 burger'}
];

exports.text = function (task, context, successCallback, errorCallback) {
    successCallback(task, context);
};

var restaurantType = {
  name: 'restaurant',
  typeCheck: restaurantTypeCheck,
  limit: 5,
  mongo: {
    model: 'restaurant',
    queryFields: ['name'],
    // fields: 'title sort price' ,
    // taskFields: ['_id', 'title', 'sort', 'price'],
    //query: {},
    //sort: "-rate1",
    limit: 5,
    minMatch: 1
  },
  out: '다음 중 원하시는 것을 선택해주세요.\n#restaurant#+index+. +name+\n#'
};

exports.restaurantType = restaurantType;


// var menuType = {
//   typeCheck: restaurantTypeCheck,
//   limit: 5,
//   mongo: {
//     model: 'franchisemenu',
//     queryFields: ['name'],
//     // fields: 'title sort price' ,
//     // taskFields: ['_id', 'title', 'sort', 'price'],
//     //query: {},
//     //sort: "-rate1",
//     limit: 5,
//     minMatch: 1
//   }
// };

var menuType =
{
  name: 'menu',
  type: {
    typeCheck: mongoTypeCheck,
      mongo: {
      model: 'franchiseMenus',
        queryFields: ['name'],
        limit: 5,
        minMatch: 1
    },
    out: '다음 중 원하시는 메뉴를 선택해주세요.\n#menu#+index+. +name+ +price+\n#'
  },
  preType: function(task, context, type, callback) {
    // task.in = task.topTask.in;
    // task.inRaw = task.topTask.inRaw;
    callback(task, context);
  },
  display: '메뉴', required: true, question: '주문할 메뉴를 말씀해 주세요.'
};

exports.menuType = menuType;

var deliverOrder = {
  module: 'task',
  action: 'sequence',
  paramDefs: [
    {type: 'address', name: 'address', display: '주소', match: false, required: true, context: true, raw: true, question: '주소를 말씀해 주세요.\n(최초 한번만 입력, 테스트중에는 서버재시작시 초기화)'},
    {type: 'mobile', name: 'mobile', required: true, context: true, raw: true, question: '휴대폰 번호를 말씀해 주세요.\n(최초 한번만 입력, 테스트중에는 서버재시작시 초기화)'},
    {type: restaurantType, name: 'restaurant', required: true, question: '음식점을 말씀해 주세요.'}
    // {type: menuType, name: 'menu', required: false, question: '메뉴를 입력해주세요'},
    // {type: 'count', name: 'orderCount', required: false, question: '주문개수를 입력해주세요'}
  ],
  preCallback : function(task, context, callback) {
    callback(task, context);
  },
  actions: [

    {
      module: 'task',
      action: 'if',
      actions: [
        // 프랜차이즈 메뉴 검색
        {
          module: 'task',
          action: 'sequence',
          condition: function(task, context) {
            return task.topTask.restaurant.franchise != undefined;
          },
          actions: [
            // {
            //   module: 'task',
            //   paramDefs: [
            //     {
            //       preType: function (task, context, type, paramDef, callback) {
            //         task.in = task.topTask.in;
            //         task.inRaw = task.topTask.inRaw;
            //         callback(task, context);
            //       },
            //       type: {
            //         typeCheck: mongoTypeCheck,
            //         mongo: {
            //           model: 'franchiseMenus',
            //           queryFields: ['name'],
            //           limit: 5,
            //           minMatch: 1
            //         },
            //         out: '다음 중 원하시는 메뉴를 선택해주세요.\n#menu#+index+. +name+ +price+\n#'
            //       },
            //       name: 'menu', display: '메뉴', required: false, question: '주문할 메뉴를 말씀해 주세요.'
            //     }
            //   ],
            //   action: function (task, context, callback) {
            //     if(task.menu == undefined) {
            //       task.topTask.pendingCallback = function (inRaw, inNLP, inDoc, context, print) {
            //
            //       };
            //       task.print('주문할 메뉴를 말씀해 주세요.');
            //     }
            //   }
            // },
            {
              module: 'task',
              action: 'question',
              paramDefs: [
                {
                  type: {
                    typeCheck: mongoTypeCheck,
                    mongo: {
                      model: 'franchiseMenus',
                      queryFields: ['name'],
                      limit: 5,
                      minMatch: 1
                    },
                    out: '다음 중 원하시는 메뉴를 선택해주세요.\n#menu#+index+. +name+ +price+\n#'
                  },
                  preType: function(task, context, type, paramDef, callback) {
                    task.in = task.topTask.in;
                    task.inRaw = task.topTask.inRaw;
                    callback(task, context);
                  },
                  name: 'menu', display: '메뉴', required: true, question: '주문할 메뉴를 말씀해 주세요.'}
              ],
              postCallback: function(task, context, callback) {
                task.topTask.menu = task.menu;
                callback(task, context);
              }
            },

            {
              module: 'task',
              action: 'question',
              condition: function(task, context) {
                return task.topTask['menu'] == undefined || task.topTask['menu'].length == 0;
              },
              postCallback: function(task, context, callback) {
                task.url = 'tel: ' + task.topTask.restaurant.phone;
                task.urlMessage = '전화걸기';

                task.topTask._ended = true;
                task.topTask.out = null;
                task.topTask.print('해당 음식점의 메뉴판 정보가 입력되지 않아 전화주문이 가능합니다. 전화로 주문해주세요.', task);
                callback(task, context);
              }
            }

          ]
        },

        // 네이버 메뉴 검색
        {
          module: 'task',
          action: 'sequence',
          condition: function(task, context) {
            return task.topTask.restaurant.franchise == undefined;
          },
          actions: [
            {
              module: 'http',
              action: 'json',
              url: 'http://map.naver.com',
              path: '/common2/getToken.nhn',
              method: 'GET',
              headers: {
                Referer: 'http://map.naver.com/'
              },
              preCallback: function(task, context, callback) {
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                callback(task, context);
              }
            },

            {
              module: 'http',
              action: 'json',
              url: 'http://map.naver.com',
              path: '/search2/local.nhn',
              // path: '/search2/local.nhn?sm=hty&searchCoord=&isFirstSearch=true&query=%EC%A7%AC%EB%BD%95%ED%83%80%EC%9E%84+%EC%A4%91%EB%8F%99%EC%A0%90&menu=location&mpx=09140550%3A37.5676848%2C126.9772482%3AZ11%3A0.0111993%2C0.0113795',
              method: 'GET',
              param: {
                sm: 'hty',
                searchCoord: '126.7765231;37.4948703',
                isFirstSearch: 'true',
                query: '',
                menu: 'location',
                mpx : '02190670:37.4948703,126.7765231:Z12:0.0056436,0.0092404'
              },
              headers: {
                Referer: 'http://map.naver.com/'
              },
              preCallback: function(task, context, callback) {
                task.param.query = task.topTask.restaurant.name;
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                if(task.doc.result.totalCount != 0) {
                  var item = task.doc.result.site.list[0];
                  // item.name;item.tel;item.address;item.roadAddress;
                  task.topTask.code = item.id.substring(1);
                }
                callback(task, context);
              }
            },

            {
              module: 'http',
              action: 'plaintext',
              url: 'http://map.naver.com',
              path: '/local/checkSiteviewTicket.nhn',
              method: 'GET',
              param: {
                code: ''
              },
              regexp: {
                doc: {
                  url: /var url = "(.*)";/g
                }
              },
              condition: function(task, context) {
                return task.topTask.code;
              },
              preCallback: function(task, context, callback) {
                task.param.code = task.topTask.code;
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                callback(task, context);
              }
            },

            {
              module: 'http',
              action: 'xpathRepeat',
              url: 'http://map.naver.com',
              path: '/local/siteview.nhn',
              method: 'GET',
              param: {
                code: ''
              },
              xpath: {
                repeat: '//dd[contains(@class, "section_detail_pay")]/ul/li',
                doc: {
                  name: '/strong/text()',
                  price: '/em/strong/text()'
                }
              },
              condition: function(task, context) {
                return task.topTask.code;
              },
              preCallback: function(task, context, callback) {
                task.path = task.preTask.doc.url;
                task.param.code = task.topTask.code;
                callback(task, context);
              },
              postCallback: function(task, context, callback) {
                task.topTask['menu'] = task.doc;
                context.user['menu'] = task.doc;
                callback(task, context);
              }
            },

            {
              module: 'task',
              action: 'question',
              condition: function(task, context) {
                return task.topTask['menu'] == undefined || task.topTask['menu'].length == 0;
              },
              postCallback: function(task, context, callback) {
                task.url = 'tel: ' + task.topTask.restaurant.phone;
                task.urlMessage = '전화걸기';

                task.topTask._ended = true;
                task.topTask.out = null;
                task.topTask.print('해당 음식점의 메뉴판 정보가 입력되지 않아 전화주문이 가능합니다.\n\n전화로 주문해주세요.', task);
                callback(task, context);
              }
            },

            {
              module: 'task',
              action: 'question',
              condition: function(task, context) {
                return !(task.topTask['menu'] == undefined || task.topTask['menu'].length == 0);
              },
              paramDefs: [
                {
                  type: {typeCheck: nMenuTypeCheck, out: '다음 중 원하시는 메뉴를 선택해주세요.\n#menu#+index+. +name+ +price+\n#'},
                  preType: function(task, context, type, paramDef, callback) {
                    task.in = task.topTask.in;
                    task.inRaw = task.topTask.inRaw;
                    callback(task, context);
                  },
                  name: 'menu', display: '메뉴', match: true, required: true, question: '주문할 메뉴를 말씀해 주세요.'}
              ],
              postCallback: function(task, context, callback) {
                task.topTask.menu = task.menu;
                callback(task, context);
              }
            }
          ]
        }
      ]
    },
    
    // 주문 완료
    {
      module: 'task',
      action: 'question',
      condition: function(task, context) {
        return !(task.topTask['menu'] == undefined || task.topTask['menu'].length == 0);
      },
      paramDefs: [
        {type: 'string', name: 'complete', required: true, question: function(task, context) {
          var q = '다음과 같이 주문을 요청합니다. \n\n';
          q += '배달주소: ' + task.topTask.address.도로명주소 + '\n';
          q += '주문자휴대폰: ' + task.topTask.mobile + '\n\n';
          q += '음식점: ' + task.topTask.restaurant.name + '\n';
          q += '메뉴: ' + task.topTask.menu.name + ' ' + task.topTask.menu.price + '\n';
          q += '전화: ' + task.topTask.restaurant.phone + '\n\n';
          q += '주문을 요청하시겠습니까?';

          return q;
        }}
      ],
      postCallback: function(task, context, callback) {
        var re = new RegExp(context.global.messages.yesRegExp, 'g');
        if(task.complete.search(re) != -1) {

          var model = mongoose.model('DeliveryOrder');

          logger.debug(task.topTask.address);

          task.topTask.totalPrice = 0;
          if(task.topTask.menus == undefined) {
            task.topTask.totalPrice = task.topTask.menu.price;
          } else {
            for(var i in task.topTask.menus) {
              task.topTask.totalPrice += menus[i].price;
            }
          }

          var doc = {
            restaurant: task.topTask.restaurant._id,
            restaurantName: task.topTask.restaurant.name,
            menus: [
              {menu: task.topTask.menu._id, name: task.topTask.menu.name, price: task.topTask.menu.price}
            ],
            address: task.topTask.address != undefined ? task.topTask.address.address : undefined,
            totalPrice: task.topTask.totalPrice,
            status: ['요청'],
            memo: '',
            times: [
              {status: '요청', time: Date.now()}
            ],
            intervals: [
            ],
            manager: null,
            user: context.user.userId
          };

          model.create(doc, function(err, _docs) {
            if (err) {
              throw err;
            } else {
            }

            task.deliveryOrderId = _docs._id;
            if(context.bot.messages.manager == true)
              manager.checkOrder(task, context, null);

            var vmsMessage = "카카오톡에서 배달봇 양얌 주문입니다. " +
              task.topTask.menu.name + ' ' + '1개' + ' 배달해 주세요.' +
              '주소는 ' + task.topTask.address.지번주소 + ' 입니다.' +
              '전화번호는 ' + task.topTask.mobile + ' 입니다.' +
              '이 주문은 인공지능 배달봇 얌얌의 카카오톡에서 배달대행 주문입니다.';

            messages.sendVMS({callbackPhone: '028585683', phone: context.user.mobile.replace(/,/g, ''), message: vmsMessage},
              context, function(_task, _context) {
              });

            task.isComplete = true;
            callback(task, context);
          });

        } else {
          task.topTask.out = '배달이 취소 되었습니다.';
          task.isComplete = false;
          callback(task, context);
        }
      }
    }
  ]
};

exports.deliverOrder = deliverOrder;


exports.orderHistory = orderHistory;
function orderHistory(task, context, successCallback, errorCallback) {
  var model = mongoose.model('DeliveryOrder');

  model.find({user: context.user.userId}).
  limit(5).
  sort({created: -1}).
  exec(function(err, docs) {

    task.doc = [];
    var _doc;
    for(var i in docs) {
      _doc = docs[i]._doc;
      _doc.orderDate = dateformat(_doc.created + 9 * 60 * 60, 'yyyy.mm.dd HH:MM');
      //_doc.created.getMonth() + '/' + _doc.created.getDate();
      _doc.menu = _doc.menus[0].name;
      if(_doc.menus.length > 1) _doc.menu += '등';
      task.doc.push(_doc);
    }

    successCallback(task, context);
  });
}


function mongoTypeCheck(text, format, inDoc, context, callback) {
  logger.debug('');
  try {
    logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
  } catch(e) {
    logger.debug('type.js:mongoTypeCheck: START ' + format.name + ' "' + text + '"');
  }

  var model;
  if (mongoose.models[format.mongo.model]) {
    model = mongoose.model(format.mongo.model);
  } else {
    model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
  }

  var matchedWord = '';
  var matchedDoc = [];
  var words = text.split(' '), wordsCount = 0;
  for(var i = 0 ; i < words.length; i++) {
    var word = words[i];

    var query = {};
    for(var j = 0; j < format.mongo.queryFields.length; j++) {
      try {
        query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
      } catch(e) {}
    }

    var _query = model.find(query, format.mongo.fields, format.mongo.options);
    if(format.mongo.sort) _query.sort(format.mongo.sort);
    if(format.mongo.limit) _query.limit(format.mongo.limit);

    _query.lean().exec(function (err, docs) {
      wordsCount++;

      if (err || !docs || docs.length <= 0) {
        //callback(text, inDoc);
      } else {

        for(var k = 0; k < docs.length; k++) {
          var doc = docs[k];

          var matchCount = 0;
          matchedWord = '';
          var matchIndex = -1, matchMin = -1, matchMax = -1;
          for(var l = 0; l < format.mongo.queryFields.length; l++) {
            for(var m = 0; m < words.length; m++) {
              matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(words[m], 'i'));

              if(matchIndex != -1) {
                matchCount++;
                matchedWord += words[m];

                var matchOrgIndex = text.search(new RegExp(words[m], 'i'));
                if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
              }
            }
          }

          if(matchCount >= format.mongo.minMatch) {
            var bExist = false;
            for(var l = 0; l < matchedDoc.length; l++) {
              if(matchedDoc[l]._id.id == doc._id.id) {
                bExist = true;
                break;
              }
            }

            if(!bExist) {
              doc.matchWord = matchedWord;
              doc.matchCount = matchCount;
              doc.matchMin = matchMin;
              doc.matchMax = matchMax;

              matchedDoc.push(doc);
            }
          }
        }
      }

      if(wordsCount >= words.length) {

        if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
          matchedDoc.sort(format.mongo.taskSort);
        } else {
          matchedDoc.sort(function (a, b) {
            return b.matchCount - a.matchCount;
          });
        }

        if (matchedDoc.length > 0) {

          inDoc[format.name] = [];
          for (var _l = 0; _l < matchedDoc.length; _l++) {
            var matchDoc = matchedDoc[_l];

            var matchText = '';
            for (var l = 0; l < format.mongo.queryFields.length; l++) {
              var _text = matchDoc[format.mongo.queryFields[l]]
              if (matchText == '') matchText = matchText.concat(_text);
              else matchText = matchText.concat(' ', _text);
            }
            matchDoc['matchText'] = matchText;

            var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
            matchDoc['matchOriginal'] = matchOriginal;

            if (format.mongo.taskFields) {
              var addDoc = {};
              for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
                addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
              }
              inDoc[format.name].push(addDoc);
            } else {
              inDoc[format.name].push(matchDoc);
            }

            if(matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
              break;
            if (inDoc[format.name].length >= format.limit) break;
          }

          if(inDoc[format.name].length == 1) {
            inDoc[format.name] = inDoc[format.name][0];

            text = text.replace(inDoc[format.name]['matchOriginal'], type.IN_TAG_START + format.name + type.IN_TAG_END);
            inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
          }

          try {
            logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
          } catch (e) {
            logger.debug('type.js:mongoTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
          }

          callback(text, inDoc, true);
        } else {
          try {
            logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
          } catch (e) {
            logger.debug('type.js:mongoTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
          }

          callback(text, inDoc, false);
        }
      }
    });
  }
}


function restaurantTypeCheck(text, format, inDoc, context, callback) {
  try {
    logger.debug('type.js:restaurantTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
  } catch(e) {
    logger.debug('type.js:restaurantTypeCheck: START ' + format.name + ' "' + text + '"');
  }

  var model;
  if (mongoose.models[format.mongo.model]) {
    model = mongoose.model(format.mongo.model);
  } else {
    model = mongoose.model(format.mongo.model, new mongoose.Schema(format.mongo.schema));
  }

  var matchedWord = '';
  var matchedDoc = [];
  var words = text.split(' '), wordsCount = 0;

  async.waterfall([
    function(_cb) {
      async.eachSeries(words, function (word, _callback){
        // var word = words[i];

        var query = {};
        for(var j = 0; j < format.mongo.queryFields.length; j++) {
          try {
            word = RegExp.escape(word);
            query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
          } catch(e) {}
        }

        query['address.시도명'] = context.dialog.address.시도명;
        query['address.시군구명'] = context.dialog.address.시군구명;
        query['address.행정동명'] = context.dialog.address.행정동명;
        // query['address.법정읍면동명'] = context.dialog.address.법정읍면동명;

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit);

        _query.lean().exec(function (err, docs) {
          wordsCount++;

          if (err || !docs || docs.length <= 0) {
            //callback(text, inDoc);
          } else {

            for(var k = 0; k < docs.length; k++) {
              var doc = docs[k];

              var matchCount = 0;
              matchedWord = '';
              var matchIndex = -1, matchMin = -1, matchMax = -1;
              for(var l = 0; l < format.mongo.queryFields.length; l++) {
                for(var m = 0; m < words.length; m++) {
                  var _word = words[m];
                  _word = RegExp.escape(_word);
                  matchIndex = doc[format.mongo.queryFields[l]].search(new RegExp(_word, 'i'));

                  if(matchIndex != -1) {
                    matchCount++;
                    matchedWord += _word;

                    var matchOrgIndex = text.search(new RegExp(_word, 'i'));
                    if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
                    if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + _word.length> matchMax)) matchMax = matchOrgIndex + _word.length;
                  }
                }
              }

              if(matchCount >= format.mongo.minMatch) {
                var bExist = false;
                for(var l = 0; l < matchedDoc.length; l++) {
                  if(matchedDoc[l]._id.id == doc._id.id) {
                    bExist = true;
                    break;
                  }
                }

                if(!bExist) {
                  doc.matchWord = matchedWord;
                  doc.matchCount = matchCount;
                  doc.matchMin = matchMin;
                  doc.matchMax = matchMax;

                  matchedDoc.push(doc);
                }
              }
            }
          }

          _callback(null);
        });
      }, function(err) {
        if(matchedDoc.length > 0) _cb(true);
        else _cb(null);
      })
    },

    // 음식점 종류 검색
    function(_cb) {
      var category, word, rCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        for(var j in restaurantCategory) {
          rCategory = restaurantCategory[j];

          word = RegExp.escape(word);
          if(rCategory.alias.search(new RegExp(word, 'i')) != -1) {
            category = rCategory.category;
            break;
          }
        }
      }

      if(category) {
        var query = {category: category};

        query['address.시도명'] = context.dialog.address.시도명;
        query['address.시군구명'] = context.dialog.address.시군구명;
        query['address.행정동명'] = context.dialog.address.행정동명;
        // query['address.법정읍면동명'] = context.dialog.address.법정읍면동명;

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit);

        _query.lean().exec(function (err, _docs) {
          if(_docs && _docs.length > 0) {
            matchedDoc = _docs;
            _cb(true);
          } else {
            _cb(null);
          }
        });
      } else {
        _cb(null);
      }
    },

    // 메뉴 종류 검색
    function(_cb) {
      var category, word, mCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        for(var j in menuCategory) {
          mCategory = menuCategory[j];

          word = RegExp.escape(word);
          if(mCategory.menu.search(new RegExp(word, 'i')) != -1) {
            category = mCategory.category;
            break;
          }
        }
      }

      if(category) {
        var query = {category: category};

        query['address.시도명'] = context.dialog.address.시도명;
        query['address.시군구명'] = context.dialog.address.시군구명;
        query['address.행정동명'] = context.dialog.address.행정동명;
        // query['address.법정읍면동명'] = context.dialog.address.법정읍면동명;

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit);

        _query.lean().exec(function (err, _docs) {
          if(_docs && _docs.length > 0) {
            matchedDoc = _docs;
            _cb(true);
          } else {
            _cb(null);
          }
        });
      } else {
        _cb(null);
      }
    }

  ], function(err) {

    if (format.mongo.taskSort && format.mongo.taskSort instanceof Function) {
      matchedDoc.sort(format.mongo.taskSort);
    } else {
      matchedDoc.sort(function (a, b) {
        return b.matchCount - a.matchCount;
      });
    }

    if (matchedDoc.length > 0) {

      inDoc[format.name] = [];
      for (var _l = 0; _l < matchedDoc.length; _l++) {
        var matchDoc = matchedDoc[_l];

        var matchText = '';
        for (var l = 0; l < format.mongo.queryFields.length; l++) {
          var _text = matchDoc[format.mongo.queryFields[l]]
          if (matchText == '') matchText = matchText.concat(_text);
          else matchText = matchText.concat(' ', _text);
        }
        matchDoc['matchText'] = matchText;

        if(matchDoc.matchMin != undefined && matchDoc.matchMax != undefined) {
          var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
          matchDoc['matchOriginal'] = matchOriginal;
        }

        if (format.mongo.taskFields) {
          var addDoc = {};
          for (var l = 0; format.mongo.taskFields && l < format.mongo.taskFields.length; l++) {
            addDoc[format.mongo.taskFields[l]] = matchDoc[format.mongo.taskFields[l]];
          }
          inDoc[format.name].push(addDoc);
        } else {
          inDoc[format.name].push(matchDoc);
        }

        if(matchDoc.matchWord && matchDoc.matchWord.replace(/ /i, '') == matchDoc[format.mongo.queryFields[0]].replace(/ /i, ''))
          break;
        if (inDoc[format.name].length >= format.limit) break;
      }

      if(inDoc[format.name].length == 1) {
        inDoc[format.name] = inDoc[format.name][0];

        if(inDoc[format.name]['matchOriginal']) {
          text = text.replace(inDoc[format.name]['matchOriginal'], type.IN_TAG_START + format.name + type.IN_TAG_END);
          inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
        }
      }

      try {
        logger.debug('type.js:restaurantTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
      } catch (e) {
        logger.debug('type.js:restaurantTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
      }

      callback(text, inDoc, true);
    } else {

      try {
        logger.debug('type.js:restaurantTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
      } catch (e) {
        logger.debug('type.js:restaurantTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
      }

      callback(text, inDoc, false);
    }
  });
  
}

function nMenuTypeCheck(text, format, inDoc, context, callback) {

  logger.debug('');
  try {
    logger.debug('orderbot.js:nMenuTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
  } catch(e) {
    logger.debug('orderbot.js:nMenuTypeCheck: START ' + format.name + ' "' + text + '"');
  }

  if(text == undefined) text = inDoc.topTask.in;

  var menus = inDoc.topTask['menu'];

  var matchedDoc = [];
  var words = text.split(' '), wordsCount = 0;

  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    for(var j = 0; j < menus.length; j++) {
      var doc = menus[j];

      if(doc.name.search(new RegExp(word, 'i')) != -1) {
        var matchCount = 0;
        var matchOrgIndex = -1, matchMin = -1, matchMax = -1;
        for(var m = 0; m < words.length; m++) {
          matchOrgIndex = doc.name.search(new RegExp(words[m], 'i'));

          if(matchOrgIndex != -1) {
            matchCount++;
            if(matchOrgIndex != -1 && (matchMin == -1 || matchOrgIndex < matchMin)) matchMin = matchOrgIndex;
            if(matchOrgIndex != -1 && (matchMax == -1 || matchOrgIndex + words[m].length> matchMax)) matchMax = matchOrgIndex + words[m].length;
          }
        }

        if(matchCount > 0) {
          var bExist = false;
          for(var l = 0; l < matchedDoc.length; l++) {
            if(matchedDoc[l].name == doc.name) {
              bExist = true;
              break;
            }
          }

          if(!bExist) {
            doc.matchCount = matchCount;
            doc.matchMin = matchMin;
            doc.matchMax = matchMax;
            matchedDoc.push(doc);
          }
        }
      }
    }
  }


  matchedDoc.sort(function (a, b) {
    return b.matchCount - a.matchCount;
  });


  if (matchedDoc.length > 0) {

    inDoc[format.name] = [];
    for (var _l = 0; _l < matchedDoc.length; _l++) {
      var matchDoc = matchedDoc[_l];

      var matchOriginal = text.substring(matchDoc.matchMin, matchDoc.matchMax);
      matchDoc['marchOriginal'] = matchOriginal;

      inDoc[format.name].push(matchDoc);

      if (inDoc[format.name].length >= format.limit) break;
    }

    if(inDoc[format.name].length == 1) {
      inDoc[format.name] = inDoc[format.name][0];

      text = text.replace(inDoc[format.name]['matchOriginal'], type.IN_TAG_START + format.name + type.IN_TAG_END);
      inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
    }

    try {
      logger.debug('type.js:nMenuTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    } catch (e) {
      logger.debug('type.js:nMenuTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
    }

    callback(text, inDoc, true);
  } else {
    try {
      logger.debug('type.js:nMenuTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
    } catch (e) {
      logger.debug('type.js:nMenuTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
    }

    callback(text, inDoc, false);
  }

}

exports.nMapDetail = {
  module: 'task',
  action: 'sequence',
  // paramDefs: [
  //   {type: 'string', name: 'restaurant', required: true, question: '음식점을 입력해주세요'}
  // ],
  restaurant: '짬뽕타임 중동점',
  actions: [
    {
      module: 'http',
      action: 'json',
      url: 'http://map.naver.com',
      path: '/common2/getToken.nhn',
      method: 'GET',
      headers: {
        Referer: 'http://map.naver.com/'
      },
      preCallback: function(task, context, callback) {
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        callback(task, context);
      }
    },

    {
      module: 'http',
      action: 'json',
      url: 'http://map.naver.com',
      path: '/search2/local.nhn',
      // path: '/search2/local.nhn?sm=hty&searchCoord=&isFirstSearch=true&query=%EC%A7%AC%EB%BD%95%ED%83%80%EC%9E%84+%EC%A4%91%EB%8F%99%EC%A0%90&menu=location&mpx=09140550%3A37.5676848%2C126.9772482%3AZ11%3A0.0111993%2C0.0113795',
      method: 'GET',
      param: {
        sm: 'hty',
        searchCoord: '126.7765231;37.4948703',
        isFirstSearch: 'true',
        query: '',
        menu: 'location',
        mpx : '02190670:37.4948703,126.7765231:Z12:0.0056436,0.0092404'
      },
      headers: {
        Referer: 'http://map.naver.com/'
      },
      preCallback: function(task, context, callback) {
        task.param.query = task.topTask.restaurant;
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        var item = task.doc.result.site.list[0];
        // item.name;item.tel;item.address;item.roadAddress;
        task.topTask.code = item.id.substring(1);
        callback(task, context);
      }
    },

    {
      module: 'http',
      action: 'plaintext',
      url: 'http://map.naver.com',
      path: '/local/checkSiteviewTicket.nhn?code=35021973',
      method: 'GET',
      regexp: {
        doc: {
          url: /var url = "(.*)";/g
        }
      },
      postCallback: function(task, context, callback) {
        callback(task, context);
      }
    },

    {
      module: 'http',
      action: 'xpathRepeat',
      url: 'http://map.naver.com',
      path: '/local/siteview.nhn?code=35021973',
      method: 'GET',
      param: {
        code: ''
      },
      xpath: {
        repeat: '//dd[@class="ldi section_detail_pay "]/ul/li',
        doc: {
          menu: '/strong/text()',
          price: '/em/strong/text()'
        }
      },
      preCallback: function(task, context, callback) {
        task.path = task.preTask.doc.url;
        task.param = task.topTask.code;
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        callback(task, context);
      }
    }
  ]
};


function testVMS(task, context, callback) {
  messages.sendSMS({callbackPhone: '028585683', phone: '01063165683', message: '주문전화테스트'}, context, function() {
    callback(task, context);
  });
}

exports.testVMS = testVMS;


function orderableTypeCheck(text, format, inDoc, context, callback) {

  var matched = false;
  var words = text.split(' ');

  async.waterfall([

    // 음식점 종류 검색
    function(_cb) {
      var category, word, rCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        for(var j in restaurantCategory) {
          rCategory = restaurantCategory[j];

          word = RegExp.escape(word);
          if(rCategory.alias.search(new RegExp(word, 'i')) != -1) {
            category = rCategory.category;
            break;
          }
        }
      }

      if(category) {
        matched = true;
        _cb(true);
      } else {
        _cb(null);
      }
    },

    // 메뉴 종류 검색
    function(_cb) {
      var category, word, mCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        for(var j in menuCategory) {
          mCategory = menuCategory[j];

          word = RegExp.escape(word);
          if(mCategory.menu.search(new RegExp(word, 'i')) != -1) {
            category = mCategory.category;
            break;
          }
        }
      }

      if(category) {
        matched = true;
        _cb(true);
      } else {
        _cb(null);
      }
    }

  ], function(err) {
    callback(text, inDoc, matched);
  });
}

exports.orderableTypeCheck = orderableTypeCheck;