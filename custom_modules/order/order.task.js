var path = require('path');
var mongoose = require('mongoose');
var logger = require(path.resolve('config/lib/logger'));
var manager = require(path.resolve('custom_modules/order/manager'));
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'))
var async = require('async');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var type = require(path.resolve('modules/bot/action/common/type'));
var _ = require('lodash');

var orderTask = {
  action: function(task, context, callback) {
    var model = mongoose.model('DeliveryOrder');

    logger.debug(context.dialog.address);

    var _menus = [], _menuStr = '';
    context.dialog.totalPrice = 0;
    if(context.dialog.menus == undefined) {
      context.dialog.totalPrice = context.dialog.menu.price;
    } else {
      for(var i in context.dialog.menus) {
        _menus.push({menu: context.dialog.menus[i]._id, name: context.dialog.menus[i].name, price: context.dialog.menus[i].price});
        _menuStr += context.dialog.menus[i].name + ' ' + '1개';
        context.dialog.totalPrice += context.dialog.menus[i].price;
      }
    }

    var doc = {
      restaurant: context.dialog.restaurant._id,
      restaurantName: context.dialog.restaurant.name,
      menus: _menus,
      address: context.dialog.address != undefined ? context.dialog.address.address : undefined,
      totalPrice: context.dialog.totalPrice,
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
        _menuStr + ' 배달해 주세요.' +
        '주소는 ' + context.dialog.address.지번주소 + ' 입니다.' +
        '전화번호는 ' + context.dialog.mobile + ' 입니다.' +
        '이 주문은 인공지능 배달봇 얌얌의 카카오톡에서 배달대행 주문입니다.';

      messages.sendVMS({callbackPhone: '028585683', phone: context.user.mobile.replace(/,/g, ''), message: vmsMessage},
        context, function(_task, _context) {
        });

      task.isComplete = true;
      callback(task, context);
    });
  }
};

exports.orderTask = orderTask;

var categoryRestaurants = {
  action: function(task, context, callback) {
    var model = mongoose.model('Restaurant');

    var category = context.dialog.restaurantCategory;
    task.category = category;

    var query = {category: category};
    query['address.시도명'] = context.dialog.address.시도명;
    query['address.시군구명'] = context.dialog.address.시군구명;
    query['address.행정동명'] = context.dialog.address.행정동명;

    model.find(query).limit(10).lean().exec(function(err, docs) {
      task.doc = docs;
      context.dialog.restaurant = docs;
      callback(task, context);
    });

  }
};

exports.categoryRestaurants = categoryRestaurants;

var franchiseMenuType = {
  name: 'menu',
  typeCheck: mongoQueryTypeCheck,
  mongo: {
    model: 'franchiseMenus',
    queryFields: ['name'],
    limit: 5,
    minMatch: 1
  },
  preType: function(task, context, type, callback) {
    type.query = {franchise: context.dialog.restaurant.franchise};
    callback(task, context);
  }
};

exports.franchiseMenuType = franchiseMenuType;


function mongoQueryTypeCheck(text, format, inDoc, context, callback) {
  logger.debug('');
  try {
    logger.debug('order.task.js:mongoQueryTypeCheck: START ' + format.name + ' "' + text + '" inDoc: ' + JSON.stringify(inDoc));
  } catch(e) {
    logger.debug('order.task.js:mongoQueryTypeCheck: START ' + format.name + ' "' + text + '"');
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
            query[format.mongo.queryFields[j]] = new RegExp(word, 'i');
          } catch(e) {}
        }

        if(format.query) query = utils.merge(query, format.query);

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


function frachiseMenuCategoryAction(task, context, callback) {
  var model = mongoose.model('FranchiseMenu');

  var query = {franchise: context.dialog.restaurant.franchise};

  model.aggregate([
    {$match: query},
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

exports.frachiseMenuCategoryAction = frachiseMenuCategoryAction;

function franchiseMenuAction(task, context, callback) {
  var model = mongoose.model('FranchiseMenu');

  var query = {franchise: context.dialog.restaurant.franchise,
  category: context.dialog.category.name};

  model.find(query).limit(10).lean().exec(function(err, docs) {
    task.doc = docs;
    context.dialog.menu = docs;
    callback(task, context);
  });

  callback(task, context);
}

exports.franchiseMenuAction = franchiseMenuAction;


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
      condition: function(task, context) {
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
      condition: function(task, context) {
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
  if(!context.dialog.menus) context.dialog.menus = [];
  if((task && task.menu) || context.dialog.menu) context.dialog.menus.push(task.menu || context.dialog.menu);
  context.dialog.menu = undefined;

  callback(task, context);
}

exports.menuAddAction = menuAddAction;
 
function upMenu1Callback(dialog, context, callback) {
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
  context.dialog.menus = undefined;
  context.dialog.menu = undefined;

  callback(task, context);
}

exports.menuResetAtion = menuResetAction;
