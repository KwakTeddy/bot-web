var path = require('path');
var mongoose = require('mongoose');
var logger = require(path.resolve('config/lib/logger'));
var manager = require(path.resolve('custom_modules/order/manager'));
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'))
var async = require('async');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var type = require(path.resolve('modules/bot/action/common/type'));
var _ = require('lodash');
var request = require('request');
var config = require(path.resolve('./config/config'));
var orderbot = require(path.resolve('custom_modules/order/orderbot'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));

// var checkTask = {
//
// }
//
// function orderCheckActoin(task, context, callback) {
//
//   var _menus = [], _menuStr = '';
//   context.dialog.totalPrice = 0;
//   if(context.dialog.menus == undefined) {
//     context.dialog.totalPrice = context.dialog.menu.price;
//   } else {
//     for(var i in context.dialog.menus) {
//       _menus.push({menu: context.dialog.menus[i]._id, name: context.dialog.menus[i].name, price: context.dialog.menus[i].price});
//       _menuStr += context.dialog.menus[i].name + ' ' + '1개';
//       context.dialog.totalPrice += context.dialog.menus[i].price;
//     }
//   }
//
//   callback(task, context, callback);
// }

var orderTask = {
  action: function(task, context, callback) {
    async.waterfall([
      function(cb) {
        if(!context.user.confirmTerms) {
          var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'))
          context.user.confirmTerms = true;
          context.user.updates = ['confirmTerms'];
          botUser.updateUserContext(context.user, context, function () {
            context.user.updates = null;
            cb(null);
          });
        } else {
          cb(null);
        }
      },

      function(cb) {
        var model = mongoose.model('DeliveryOrder');

        var _menus = [];
        context.dialog.menuStr = '';
        context.dialog.totalPrice = 0;
        if(context.dialog.menus == undefined) {
          context.dialog.totalPrice = context.dialog.menu.price;
        } else {
          for(var i in context.dialog.menus) {
            _menus.push({menu: context.dialog.menus[i]._id, name: context.dialog.menus[i].name, price: context.dialog.menus[i].price, count: context.dialog.menus[i].count});
            context.dialog.menuStr += context.dialog.menus[i].name + ' ' + context.dialog.menus[i].price + ' ' + context.dialog.menus[i].count + '개\n';
            context.dialog.totalPrice += context.dialog.menus[i].price * context.dialog.menus[i].count;
          }
        }

        var doc = {
          restaurant: context.dialog.orderRestaurant._id,
          restaurantName: context.dialog.orderRestaurant.name,
          menus: _menus,
          address: (context.dialog.address ? context.dialog.address.지번주소 : context.user.address.지번주소),
          totalPrice: context.dialog.totalPrice,
          status: ['요청'],
          memo: '',
          times: [
            {status: '요청', time: Date.now()}
          ],
          intervals: [
          ],
          manager: null,
          user: context.user.userId,
          botUser: context.user._id
        };

        model.create(doc, function(err, _docs) {
          if (err) {
            cb(true);
            throw err;
          } else {
            cb(null, _docs._id);
          }
        });
      },

      function(orderId, cb) {
        task.deliveryOrderId = orderId;
        if(!context.bot.testMode && context.bot.messages.manager === true)
          manager.checkOrder(task, context, null);

        if(!context.bot.testMode && context.bot.messages.call === true) {
          var message = "카카오톡에서 배달봇 얌얌 주문입니다. " +
            context.dialog.menuStr + ' 배달해 주세요.' +
            '주소는 ' + context.dialog.address.지번주소 + ' 입니다.' +
            '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
            '이 주문은 인공지능 배달봇 얌얌의 카카오톡에서 배달대행 주문입니다.';

          request.post(
            'https://bot.moneybrain.ai/api/messages/vms/send',
            // 'http://localhost:8443/api/messages/vms/send',
            {json: {callbackPhone: config.callcenter, phone: context.user.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                // callback(task, context);
              }
              cb(null);
            }
          );
        } else {
          cb(null);
        }
      },

      function(cb) {
        if(!context.bot.testMode && context.bot.messages.sms === true) {
          var message = "[인공지능 배달봇 얌얌]\n" +
            context.dialog.orderRestaurant.name + '/주문 요청/50분 이내 배달 예정';

          request.post(
            'https://bot.moneybrain.ai/api/messages/sms/send',
            {json: {callbackPhone: config.callcenter, phone: context.user.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                // callback(task, context);
              }
              cb(null);
            }
          );
        } else {
          cb(null);
        }
      }

    ], function(err) {
      task.isComplete = true;

      context.dialog.orderRestaurant = null;
      context.dialog.orderMenu = null;
      context.dialog.orderOption = null;
      context.dialog.restaurant = null;
      context.dialog.menu = null;
      context.dialog.menus = null;

      callback(task, context);
    });

  //   var model = mongoose.model('DeliveryOrder');
  //
  //   var _menus = [];
  //   context.dialog.menuStr = '';
  //   context.dialog.totalPrice = 0;
  //   if(context.dialog.menus == undefined) {
  //     context.dialog.totalPrice = context.dialog.menu.price;
  //   } else {
  //     for(var i in context.dialog.menus) {
  //       _menus.push({menu: context.dialog.menus[i]._id, name: context.dialog.menus[i].name, price: context.dialog.menus[i].price, count: context.dialog.menus[i].count});
  //       context.dialog.menuStr += context.dialog.menus[i].name + ' ' + context.dialog.menus[i].count + '개\n';
  //       context.dialog.totalPrice += context.dialog.menus[i].price * context.dialog.menus[i].count;
  //     }
  //   }
  //
  //   if(!context.user.confirmTerms) {
  //     var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'))
  //
  //     context.user.confirmTerms = true;
  //     context.user.updates = ['confirmTerms'];
  //     botUser.updateUserContext(context.user, context, function () {
  //       context.user.updates = null;
  //     });
  //   }
  //
  //   var doc = {
  //     restaurant: context.dialog.restaurant._id,
  //     restaurantName: context.dialog.restaurant.name,
  //     menus: _menus,
  //     address: context.dialog.address != undefined ? context.dialog.address.address : undefined,
  //     totalPrice: context.dialog.totalPrice,
  //     status: ['요청'],
  //     memo: '',
  //     times: [
  //       {status: '요청', time: Date.now()}
  //     ],
  //     intervals: [
  //     ],
  //     manager: null,
  //     user: context.user.userId
  //   };
  //
  //   model.create(doc, function(err, _docs) {
  //     if (err) {
  //       throw err;
  //     } else {
  //     }
  //
  //     task.deliveryOrderId = _docs._id;
  //     if(context.bot.messages.manager == true)
  //       manager.checkOrder(task, context, null);
  //
  //     if(context.bot.call) {
  //
  //       var request = require('request');
  //
  //       var vmsMessage = "카카오톡에서 배달봇 양얌 주문입니다. " +
  //         context.dialog.menuStr + ' 배달해 주세요.' +
  //         '주소는 ' + context.dialog.address.지번주소 + ' 입니다.' +
  //         '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
  //         '이 주문은 인공지능 배달봇 얌얌의 카카오톡에서 배달대행 주문입니다.';
  //
  //       request.post(
  //         'https://bot.moneybrain.ai/api/messages/vms/send',
  //         // 'http://localhost:8443/api/messages/vms/send',
  //         {json: {callbackPhone: '028585683', phone: context.user.mobile.replace(/,/g, ''), message: vmsMessage}},
  //         function (error, response, body) {
  //           if (!error && response.statusCode == 200) {
  //             // callback(task, context);
  //           }
  //           callback(task, context);
  //         }
  //       );
  //     }
  //
  //     task.isComplete = true;
  //     context.dialog.restaurant = null;
  //     context.dialog.menus = null;
  //     callback(task, context);
  //   });
  }
};

exports.orderTask = orderTask;

var categoryRestaurants = {
  action: function(task, context, callback) {
    // console.log('categoryRestaurant');
    var model = mongoose.model('Restaurant');

    var category = context.dialog.restaurantCategory;
    task.category = category;

    // var address;
    // if(address == undefined || address == true) {
    //   address = context.dialog.address;
    //   if (!address) address = context.user.address;
    // }

    var address, lng, lat;
    if(context.dialog.address) {
      address = context.dialog.address;
      lng = context.dialog.lng;
      lat = context.dialog.lat;
    } else if(context.user.address) {
      address = context.user.address;
      lng = context.user.lng;
      lat = context.user.lat;
    }

    var query = {category: category, deliverable: true};
    query['$or'] = [
      {'address.시도명': address.시도명, 'address.시군구명': address.시군구명, 'address.법정읍면동명': address.법정읍면동명},
      {lat: {$gt: lat - orderbot.LAT_DIST, $lt: lat + orderbot.LAT_DIST}, lng: {$gt: lng - orderbot.LNG_DIST, $lt: lng + orderbot.LNG_DIST}}
    ];
    // query['address.시도명'] = address.시도명;
    // query['address.시군구명'] = address.시군구명;
    // // query['address.행정동명'] = address.행정동명;
    // query['address.법정읍면동명'] = address.법정읍면동명;
    // query.lat = {$gt: lat - orderbot.LAT_DIST, $lt: lat + orderbot.LAT_DIST};
    // query.lng = {$gt: lng - orderbot.LNG_DIST, $lt: lng + orderbot.LNG_DIST};

    model.find(query).limit(type.MAX_LIST).lean().exec(function(err, docs) {
      console.log(err);
      // console.log(docs);
      var hhmm = new Date().toString().split(' ')[4].substring(0, 5);
      // hhmm = '03:00';
      var defaultStart = '12:00', defautEnd = '24:00';
      for (var i = 0; docs && i < docs.length; i++) {
        var doc = docs[i];

        var dist;
        if(doc.franchise) dist = orderbot.franchiseDist[doc.franchise.toString()];
        if(!dist && doc.category && doc.category.length > 0) dist = orderbot.categoryDist[doc.category[0]];

        if(dist) {
          var distance = addressModule.getDistanceFromGeocode(lat, lng, doc.lat, doc.lng);
          // console.log(doc.name, distance, JSON.stringify(dist));

          if (dist.dist && dist.법정동) {
            if (dist.dist < distance && doc.address.법정읍면동명 != address.법정읍면동명) {
              docs.splice(i, 1);
              i--;
              continue;
            }
          } else if (dist.dist) {
            if(dist.dist < distance) {
              docs.splice(i, 1); i--;
              continue;
            }
          } else if (dist.법정동 === 1) {
            if(doc.address.법정읍면동명 != address.법정읍면동명) {
              docs.splice(i, 1); i--;
              continue;
            }
          }
        }

        if(doc.businessHours && doc.businessHours.length > 0) {
          if((doc.businessHours[0].end > doc.businessHours[0].start && (hhmm < doc.businessHours[0].start || hhmm > doc.businessHours[0].end)) ||
            (doc.businessHours[0].end < doc.businessHours[0].start && (hhmm < doc.businessHours[0].start && hhmm > doc.businessHours[0].end))) {
            docs[i].openStatus = '(배달 준비중)';
            docs[i].isOpen = false;
            // docs[i].isOpen = true;
          } else {
            docs[i].isOpen = true;
          }
        } else {
          if (hhmm < defaultStart || hhmm > defautEnd) {
            docs[i].openStatus = '(배달 준비중)';
            docs[i].isOpen = false;
            // docs[i].isOpen = true;
          } else {
            docs[i].isOpen = true;
          }
        }

        if(!docs[i].minOrder && docs[i].minOrder == 0) docs[i].minOrder = 10000;

      }

      // 프랜차이즈 중복 없애기
      var franchises = {};
      for (var i = 0; docs && i < docs.length; i++) {
        var doc = docs[i];
        if(doc.franchise) franchises[doc.franchise] = true;
      }

      for (var i = 0; Object.keys(franchises).length > 0 && i < docs.length; i++) {
        var doc = docs[i];
        if (franchises[doc.franchise] === true) {
          console.log('first' ,i, doc.name, franchises[doc.franchise]);
          franchises[doc.franchise] = false;
        } else if (franchises[doc.franchise] === false) {
          console.log('del' ,i, doc.name, franchises[doc.franchise]);
          docs.splice(i, 1);
          i--;
        }
      }

      if(docs) {
        task.doc = docs;
        task.restaurant = docs;
        context.dialog.restaurant = docs;
      }

      // console.log(docs);

      callback(task, context);
    });
  }
};

exports.categoryRestaurants = categoryRestaurants;

var menuType = {
  name: 'menu',
  typeCheck: type.mongoTypeCheck,
  // dialog: true,
  mongo: {
    model: 'franchiseMenus',
    queryFields: ['name'],
    minMatch: 1
  },
  exclude: ['치킨', '피자', '버거', '햄버거'],
  preType: function(task, context, type, callback) {
    var restaurant;

    if(context.dialog.orderRestaurant) restaurant = context.dialog.orderRestaurant;
    else restaurant = context.dialog.restaurant;

    if(restaurant.franchise &&
      (restaurant.isMenuExist !== true)) {
      type.query = {franchise: restaurant.franchise};
      type.mongo.model = 'franchiseMenus';
    } else {
      type.query = {restaurant: restaurant._id};
      type.mongo.model = 'menus';
    }

    callback(task, context);
  }
};

exports.menuType = menuType;


var cartType = {
  name: 'delMenu',
  typeCheck: type.contextListCheck,
  list: 'menus',
  mongo: {
    queryFields: ['name'],
    minMatch: 1
  }
};

exports.cartType = cartType;

function mongoQueryTypeCheck(text, format, inDoc, context, callback) {
  logger.debug('');
  try {
    logger.debug('order.task.js:mongoQueryTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
  } catch(e) {
    logger.debug('order.task.js:mongoQueryTypeCheck: START ' + format.name + ' "' + text + '"');
  }

  if(text == null) {
    callback(text, inDoc, false);
    return;
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

        if(format.query) query = utils.merge(query, format.query);

        var _query = model.find(query, format.mongo.fields, format.mongo.options);
        if(format.mongo.sort) _query.sort(format.mongo.sort);
        if(format.mongo.limit) _query.limit(format.mongo.limit || type.MAX_LIST);

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
                  words[m] = RegExp.escape(words[m]);
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

          _callback(null);
        });
      }, function(err) {
        if(matchedDoc.length > 0) _cb(true);
        else _cb(null);
      })
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
        if (inDoc[format.name].length >= (format.limit || type.MAX_LIST)) break;
      }

      if(inDoc[format.name].length == 1) {
        inDoc[format.name] = inDoc[format.name][0];

        if(inDoc[format.name]['matchOriginal']) {
          text = text.replace(inDoc[format.name]['matchOriginal'], type.IN_TAG_START + format.name + type.IN_TAG_END);
          inDoc[format.name+'Original'] = inDoc[format.name]['matchOriginal'];
        }
      }

      try {
        logger.debug('order.task.js:mongoQueryTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
      } catch (e) {
        logger.debug('order.task.js:mongoQueryTypeCheck: MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
      }

      callback(text, inDoc, true);
    } else {

      try {
        logger.debug('order.task.js:mongoQueryTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
      } catch (e) {
        logger.debug('order.task.js:mongoQueryTypeCheck: NOT MATCHED ' + format.name + ' "' + text + '" inDoc.' + format.name + ': ' + inDoc[format.name] + ' inDoc.typeDoc: ' + JSON.stringify(inDoc.typeDoc));
      }

      callback(text, inDoc, false);
    }
  });
}

exports.mongoQueryTypeCheck = mongoQueryTypeCheck;


function menuCategoryAction(task, context, callback) {
  var model, query, sort;
  if(context.dialog.orderRestaurant.franchise &&
    (context.dialog.orderRestaurant.isMenuExist !== true)) {
    model = mongoose.model('FranchiseMenu');
    query = {franchise: context.dialog.orderRestaurant.franchise};
    sort = {'created': -1};
  } else {
    model = mongoose.model('Menu');
    query = {restaurant: context.dialog.orderRestaurant._id};
    sort = {'_id': -1};
  }

  model.aggregate([
    {$match: query},
    {$sort: sort},
    {$group: {
      _id: '$category',
      category: {$first: '$category'}
    }}
  ], function(err, docs) {
    if(docs == undefined) {
      callback(task, context);
    } else {
      var categorys = [];
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];

        for (var j = 0; j < doc.category.length; j++) {
          var category = doc.category[j];
          if(!_.includes(categorys, category)){
            categorys.push({name: category});
          }
        }
      }

      task.doc = categorys;
      context.dialog.category = categorys;
      callback(task, context);
    }
  });
}

exports.menuCategoryAction = menuCategoryAction;

function menuAction(task, context, callback) {
  var model, query, sort;
  if(context.dialog.orderRestaurant.franchise &&
    (context.dialog.orderRestaurant.isMenuExist !== true)) {
    model = mongoose.model('FranchiseMenu');
    query = {franchise: context.dialog.orderRestaurant.franchise,
      category: context.dialog.category.name};
    sort = {'created': +1};
  } else {
    model = mongoose.model('Menu');
    query = {restaurant: context.dialog.orderRestaurant._id,
      category: context.dialog.category.name};
    sort = {'_id': +1};
  }

  // console.log(query);

  model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
    task.doc = docs;
    context.dialog.menu = docs;
    callback(task, context);
  });
}

exports.menuAction = menuAction;



var nMapTask = {
  module: 'task',
  action: 'sequence',
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
        task.param.query = context.dialog.restaurant.name;
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        if(task.doc.result.totalCount != 0) {
          var item = task.doc.result.site.list[0];
          context.dialog.code = item.id.substring(1);
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
      if: function(task, context) {
        return context.dialog.code;
      },
      preCallback: function(task, context, callback) {
        task.param.code = context.dialog.code;
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
      if: function(task, context) {
        return context.dialog.code;
      },
      preCallback: function(task, context, callback) {
        task.path = task.preTask.doc.url;
        task.param.code = context.dialog.code;
        callback(task, context);
      },
      postCallback: function(task, context, callback) {
        for (var i = 0; task.doc && i < task.doc.length; i++) {
          var doc = task.doc[i];
          if(doc.price) {
            doc.price = doc.price.replace(/,/g, '');
            doc.price = doc.price.replace(/원/g, '');
          }
        }
        context.dialog['menu'] = task.doc;
        callback(task, context);
      }
    }

  ]
};

exports.nMapTask = nMapTask;

function menuAddAction(task, context, callback) {
  // if(!context.dialog.menus) context.dialog.menus = [];

  if(/*(task && task.menu) || */context.dialog.orderMenu) {
    var _menu = /*task.menu || */context.dialog.orderMenu;
    if(context.dialog.orderOption) {
      _menu.name += ' ' + context.dialog.orderOption.name;
      _menu.price = context.dialog.orderOption.price;
    }
    _menu.count = context.dialog.count;

    context.dialog.menus.push(_menu);
  }

  context.dialog.totalPrice = 0;
  for(var i in context.dialog.menus) {
    context.dialog.totalPrice += context.dialog.menus[i].price * context.dialog.menus[i].count;
  }

  // context.dialog.addedMenu = utils.clone(context.dialog.menu);

  // context.dialog.menu = undefined;
  // context.dialog.option = undefined;

  callback(task, context);
}

exports.menuAddAction = menuAddAction;

function optionAddAction(task, context, callback) {
  if(!context.dialog.options) context.dialog.options = [];
  if((task && task.option) || context.dialog.option) context.dialog.options.push(task.option || context.dialog.option);
  context.dialog.option = undefined;
  callback(task, context);
}

exports.optionAddAction = optionAddAction;


function upMenu1Callback(dialog, context, callback) {
  if(context.dialog.restaurants != undefined)
    context.dialog.restaurant = context.dialog.restaurants;
  callback(null);
}

exports.upMenu1Callback = upMenu1Callback;

function saveRestaurantTask(task, context, callback) {
  if(Array.isArray(context.dialog.restaurant))
    context.dialog.restaurants = context.dialog.restaurant;
  callback(task, context);
}

exports.saveRestaurantTask = saveRestaurantTask;

function menuResetAction(task, context, callback) {
  context.dialog.menus = [];
  // context.dialog.menus = undefined;
  context.dialog.menu = undefined;
  context.dialog.totalPrice = 0;

  callback(task, context);
}

exports.menuResetAtion = menuResetAction;

function saveMenuTask(task, context, callback) {
  if(Array.isArray(context.dialog.menu))
    context.dialog.menus = context.dialog.menu;
  callback(task, context);
}
exports.saveMenuTask = saveMenuTask;

function menuCallback(dialog, context, callback) {
  // if(context.botUser.currentDialog.parent) {
  //   var _dialog = context.botUser.currentDialog.parent;
  //   context.dialog.menu = _dialog.task.menu;
  // }

  if(context.dialog.menus != undefined)
    context.dialog.menu = context.dialog.menus;

  callback(null);
}

exports.menuCallback = menuCallback;

function isRestaurantIndistance(context, restaurant) {
    var lng, lat;
    if(context.dialog.address) {
      lng = context.dialog.lng;
      lat = context.dialog.lat;
    } else if(context.user.address) {
      lng = context.user.lng;
      lat = context.user.lat;
    }

    var dist;
    var doc = restaurant;
    if(doc.franchise) dist = orderbot.franchiseDist[doc.franchise.toString()];
    if(!dist && doc.category && doc.category.length > 0) dist = orderbot.categoryDist[doc.category[0]];

    if(dist) {
      var distance = addressModule.getDistanceFromGeocode(lat, lng, doc.lat, doc.lng);

      console.log(lat, lng, doc.lat, doc.lng, dist.dist, distance);

      if (dist.dist && dist.법정동) {
        if (dist.dist < distance && doc.address.법정읍면동명 != addressModule.법정읍면동명) {
          return false;
        }
      } else if (dist.dist) {
        if(dist.dist < distance) {
          return false;
        }
      } else if (dist.법정동 === 1) {
        if(doc.address.법정읍면동명 != addressModule.법정읍면동명) {
          return false;
        }
      }
    }

    return true;
}


exports.isRestaurantIndistance = isRestaurantIndistance;
