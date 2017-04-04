var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getTemplateBot('restaurant');
var type = require(path.resolve('./modules/bot/action/common/type'));
var dateformat = require('dateformat');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('modules/bot-users/server/controllers/bot-users.server.controller'))
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var mongoose = require('mongoose');
var request = require('request');
var _ = require('lodash');

var startTask = {
  action: function (task, context, callback) {
    if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
      context.botUser.isOwner = true;
      // context.bot.authKey = null;
    }

    task.result = {smartReply: ['예약', '위치', '영업시간', '메뉴']};

    context.dialog.날짜입력최초 = undefined;
    context.dialog.시간입력최초 = undefined;
    context.dialog.인원선택최초 = undefined;

    if(context.botUser.isOwner) {
      reserveCheck.action(task, context, function(_task, context) {
        callback(task, context);
      })
    } else {
      callback(task, context);
    }
  }
};

exports.startTask = startTask;

exports.mapTask = {
  action: function(task, context, callback) {
    task.address = context.bot.address;
    task.name = context.bot.name;

    daumgeoCode(task, context, function(_task, context) {
      task.result = {
        buttons: [
          {text: '지도보기', url: task.url}
        ]
      };
      callback(task, context);
    });
  }
};

exports.menuImageTask = {
  action: function(task, context, callback) {
    task.result = {
      image: {url: context.bot.menuImage},
      buttons: [
        {text: '자세히보기', url: context.bot.menuImage}
        ]
    };
    callback(task, context);
  }
};

function naverGeocode(task, context, callback) {
  var query = {query: task.address};
  var request = require('request');

  request({
    url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
    method: 'GET',
    qs: query,
    headers: {
      'Host': 'openapi.naver.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': context.bot.naver.clientId,
      'X-Naver-Client-Secret': context.bot.naver.clientSecret
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      task.lng=doc.result.items[0].point.x;
      task.lat=doc.result.items[0].point.y;
      console.log('lat: ' + task.lat + ', lng: ' + task.lng);
    }
    callback(task, context);
  });
}

exports.naverGeocode = naverGeocode;


function daumgeoCode (task, context, callback) {
  // if (context.dialog.bank == undefined) {
  //   callback(false);
  // } else {
    naverGeocode(task, context, function(task, context) {
      var request = require('request');
      var query = {q: task.address, output: "json"};
      task._doc = {
        lng: '',
        lat: '',
        link_find: '',
        link_map: '',
        address: ''
      };
      request({
        url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
        method: 'GET',
        qs: query
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body);
          var doc = JSON.parse(body);
          task._doc.link_map = 'http://map.daum.net/link/map/' + task.name + ',' + task.lat + ',' + task.lng;

          task.url = task._doc.link_map;
          task.urlMessage = '지도에서 위치보기';
        }
        callback(task, context);
      });
    })
  // }
}
exports.daumgeoCode = daumgeoCode;

function numOfPersonTypeCheck(inRaw, _type, inDoc, context, callback) {
  var re;
  if(_type.init) re = /(\d)\s*명/g;
  else re = /(\d)(?:\s*명)?/g;

  var matched = inRaw.match(re);
  if(matched != null) {
    try {
      context.dialog.numOfPerson = parseInt(matched[0]);
      callback(inRaw, inDoc, true);
    } catch(e) {
      console.log(e);
      callback(inRaw, inDoc, false);
    }
  } else {
    var num = type.parseNumber(inRaw);
    if(num != inRaw) {
      try {
        context.dialog.numOfPerson = parseInt(num);
        callback(inRaw, inDoc, true);
      } catch(e) {
        console.log(e);
        callback(inRaw, inDoc, false);
      }
    } else {
      callback(inRaw, inDoc, false);
    }
  }
}

bot.setTypeCheck('numOfPersonTypeCheck', numOfPersonTypeCheck);

function checkTime(task, context, callback) {
  var day = new Date().getDay();
  var holiday = dateStringToNumber(context.bot.holiday);

  if (day == holiday) {
    context.dialog.check = true;
  } else {
    if (context.dialog.time > context.bot.endTime || context.dialog.time < context.bot.startTime) {
      context.dialog.check = true;
    } else if (context.dialog.time == 're'){
      context.dialog.check = 're';
    } else {
      context.dialog.check = false;
    }
  }
  callback(task, context);
}

exports.checkTime = checkTime;

function checkDate(task, context, callback) {
  var day = context.dialog.date.getDay();

  var holiday = dateStringToNumber(context.bot.holiday);

  if (day == holiday) {
    context.dialog.check = true;
  } else {
    context.dialog.check = false;
  }

  callback(task, context);
}

exports.checkDate = checkDate;


function dateStringToNumber(dateString) {
  if(dateString == '일요일' || dateString == '일') return 0;
  else if(dateString == '월요일' || dateString == '월') return 1;
  else if(dateString == '화요일' || dateString == '화') return 2;
  else if(dateString == '수요일' || dateString == '수') return 3;
  else if(dateString == '목요일' || dateString == '목') return 4;
  else if(dateString == '금요일' || dateString == '금') return 5;
  else if(dateString == '토요일' || dateString == '토') return 6;
  else return dateString;

}

/********************* SMS *********************/

var smsAuth = {
  preCallback: function(task, context, callback) {
    if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
    callback(task, context);
  },
  action: messages.sendSMSAuth
};

bot.setTask('smsAuth', smsAuth);


function smsAuthValid(dialog, context, callback) {
  callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);
}

exports.smsAuthValid = smsAuthValid;

var smsAuthTask = {
  action: function (task, context, callback) {
    context.user['mobile'] = context.dialog['mobile'];
    context.user.updates = ['mobile'];
    botUser.updateUserContext(context.user, context, function () {
      context.user.updates = null;

      context.dialog.smsAuth == null;
      callback(task, context);
    });
  }
};

bot.setTask('smsAuthTask', smsAuthTask);

/********************* 예약 *********************/

function reserveConfirm(task, context, callback) {
  context.dialog['dateStr'] = dateformat(context.dialog.date + 9 * 60 * 60, 'mm월dd일');

  callback(task, context);
}

bot.setAction('reserveConfirm', reserveConfirm);


function reserveRequest(task, context, callback) {

  var doc = {
    name: context.dialog.name,
    mobile: context.dialog.mobile,
    date: context.dialog.date,
    time: context.dialog.time,
    numOfPerson: context.dialog.numOfPerson,
    status: '예약요청중',
    upTemplateId: context.bot.templateDataId,
    userKey: context.user.userKey
  };

  var TemplateReservation = mongoModule.getModel('TemplateReservation');
  var templateReservation = new TemplateReservation(doc);

  templateReservation.save(function(err) {
    if(!context.bot.testMode) {
      var randomNum = '';
      randomNum += '' + Math.floor(Math.random() * 10);
      randomNum += '' + Math.floor(Math.random() * 10);
      randomNum += '' + Math.floor(Math.random() * 10);
      randomNum += '' + Math.floor(Math.random() * 10);

      var url = 'http://192.168.1.78:8443/mobile#/chat/' + context.bot.id + '?authKey=' + randomNum;
      context.bot.authKey = randomNum;

      var query = {url: url};
      var request = require('request');

      request({
        url: 'https://openapi.naver.com/v1/util/shorturl',
        method: 'POST',
        form: query,
        headers: {
          'Host': 'openapi.naver.com',
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'X-Naver-Client-Id': context.bot.naver.clientId,
          'X-Naver-Client-Secret': context.bot.naver.clientSecret
        }
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var shorturl;
          try {shorturl = JSON.parse(body).result.url; } catch(e) {console.log(e);}
          var message = '[플레이챗]' + '\n' +
            context.dialog.name + '/' +
            context.dialog.dateStr + '/' + context.dialog.time + '/' +
            context.dialog.numOfPerson + '명\n' +
            context.dialog.mobile + '\n' +
            '예약접수: ' + shorturl;

          request.post(
            'https://bot.moneybrain.ai/api/messages/sms/send',
            {json: {callbackPhone: context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              callback(task, context);
            }
          );
        } else {
          callback(task, context);
        }
      });
    } else {
      callback(task, context);
    }
  });

}

bot.setAction('reserveRequest', reserveRequest);


var reserveCheck = {
  action: function (task, context, callback) {

    if(context.botUser.isOwner) {
      var TemplateReservation = mongoModule.getModel('TemplateReservation');
      TemplateReservation.find({
        upTemplateId: context.bot.templateDataId,
        status: '예약요청중',
        date: {$gte: new Date()}
      }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
        if(docs && docs.length > 0) {
          for(var i in docs) {
            docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
          }
          context.dialog.reserves = docs;
          context.dialog.reserve = undefined;
        } else {
          context.dialog.reserves = undefined;
          context.dialog.reserve = undefined;
        }
        callback(task, context);
      });
    } else {
      var TemplateReservation = mongoModule.getModel('TemplateReservation');
      TemplateReservation.find({
        upTemplateId: context.bot.templateDataId,
        userKey: context.user.userKey,
        status: {$ne: '취소'},
        date: {$gte: new Date()}
      }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
        if(docs && docs.length > 1) {
          for(var i in docs) {
            docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
          }
          context.dialog.reserves = docs;
          context.dialog.reserve = undefined;
        } else if(docs && docs.length > 0) {
          docs[0].dateStr = dateformat(docs[0].date + 9 * 60 * 60, 'mm월dd일');
          context.dialog.reserve = docs[0];
          context.dialog.reserves = undefined;
        } else {
          context.dialog.reserves = undefined;
          context.dialog.reserve = undefined;
        }
        callback(task, context);
      })
    }
  }
};

// bot.setTask('reserveCheck', reserveCheck);
exports.reserverCheck = reserveCheck;

var reserveCancel = {
  action: function (task, context, callback) {
    if(context.dialog.reserve) {
      var TemplateReservation = mongoModule.getModel('TemplateReservation');
      TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '취소'}}, function (err) {

        if(!context.bot.testMode) {
          var message = '[' + context.bot.name + ']' + '\n' +
            context.dialog.reserve.name + '/' +
            context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/' +
            context.dialog.reserve.numOfPerson + '명\n' +
            context.dialog.reserve.mobile + '\n' +
            '예약취소';

          request.post(
            'https://bot.moneybrain.ai/api/messages/sms/send',
            {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              callback(task, context);
            }
          );
        } else {
          callback(task, context);
        }
      });
    } else {
      callback(task, context);
    }
  }
};

bot.setTask('reserveCancel', reserveCancel);

var reserveOwnerCancel = {
  action: function (task, context, callback) {
    if(context.dialog.reserve) {
      var TemplateReservation = mongoModule.getModel('TemplateReservation');
      TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '업주취소'}}, function (err) {

        if(!context.bot.testMode) {
          var message = '[' + context.bot.name + ']' + '\n' +
            context.dialog.reserve.name + '/' +
            context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/' +
            context.dialog.reserve.numOfPerson + '명\n' +
            '예약취소: '+
            task.inRaw + '\n' +
            '매장전화: ' + context.bot.phone;

          request.post(
            'https://bot.moneybrain.ai/api/messages/sms/send',
            {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.dialog.reserve.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              reserveCheck.action(task, context, function(_task, context) {
                callback(task, context);
              });
            }
          );
        } else {
          callback(task, context);
        }
      });

    } else {
      callback(task, context);
    }
  }
};

bot.setTask('reserveOwnerCancel', reserveOwnerCancel);

var reserveOwnerConfirm = {
  action: function (task, context, callback) {
    if(context.dialog.reserve) {
      var TemplateReservation = mongoModule.getModel('TemplateReservation');
      TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '확정'}}, function (err) {

        if(!context.bot.testMode) {
          var message = '[' + context.bot.name + ']' + '\n' +
            context.dialog.reserve.name + '/' +
            context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/' +
            context.dialog.reserve.numOfPerson + '명\n' +
            '예약확정\n'+
            '매장전화: ' + context.bot.phone;

          request.post(
            'https://bot.moneybrain.ai/api/messages/sms/send',
            {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.dialog.reserve.mobile.replace(/,/g, ''), message: message}},
            function (error, response, body) {
              reserveCheck.action(task, context, function(_task, context) {
                callback(task, context);
              })
            }
          );
        } else {
          callback(task, context);
        }
      });
    } else {
      callback(task, context);
    }
  }
};

bot.setTask('reserveOwnerConfirm', reserveOwnerConfirm);


var reserveNameTask = {
  action: function (task, context, callback) {
    context.dialog.name = task.inRaw;
    callback(task, context);
  }
};

bot.setTask('reserveNameTask', reserveNameTask);

var menuType = {
  name: 'menus',
  typeCheck: type.mongoDbTypeCheck,
  limit: 5,
  mongo: {
    model: 'templatemenu',
    queryFields: ['name'],
    fields: 'name price image' ,
    taskFields: ['_id', 'name', 'price', 'image'],
    taskSort: function(a, b) {
      if(b.matchCount > a.matchCount) return 1;
      else if(b.matchCount < a.matchCount) return -1;
      else {
        if(b.created.getTime() < a.created.getTime()) return 1;
        else if(b.created.getTime() > a.created.getTime()) return -1;
        else return 0;
      }
    },
    //query: {},
    // sort: "-created",
    // limit: 5,
    minMatch: 1
  }
};

exports.menuType = menuType;

var menuTask = {
  action: function (task, context, callback) {
    context.dialog.menus = task.typeDoc;
    // var items = [];
    // for(var i = 0; i < menus.length; i++) {
    //   items.push({
    //     title: menus[i].name,
    //     text: menus[i].price + '원',
    //     imageUrl: menus[i].image, buttons: [{input: menus[i].name, text: '상세보기'}]
    //   });
    // }
    //
    // if(items.length > 0) task.result = {items: items};

    callback(task, context);
  }
};

bot.setTask('menuTask', menuTask);


function menuCategoryAction(task, context, callback) {
  if(context.bot.menuImage) {
    task.result = {
      image: {url: context.bot.menuImage},
      buttons: [
        {text: '메뉴판 사진 보기', url: context.bot.menuImage}
      ]
    };
  }
  var model, query, sort;

  model = mongoose.model('TemplateMenu');
  query = {upTemplateId: context.bot.templateDataId};
  sort = {'_id': -1};


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

        var category = doc.category;
        if(!_.includes(categorys, category)){
          categorys.push({name: category});
        }

        // for (var j = 0; j < doc.category.length; j++) {
        //   var category = doc.category[j];
        //   if(!_.includes(categorys, category)){
        //     categorys.push({name: category});
        //   }
        // }
      }

      task.doc = categorys;
      context.dialog.categorys = categorys;
      callback(task, context);
    }
  });
}


exports.menuCategoryAction = menuCategoryAction;

function menuAction(task, context, callback) {
  var model, query, sort;

  model = mongoose.model('TemplateMenu');
  query = {upTemplateId: context.bot.templateDataId,
    category: context.dialog.category.name};
  sort = {'_id': +1};

  model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
    task.doc = docs;
    context.dialog.menus = docs;
    callback(task, context);
  });
}

exports.menuAction = menuAction;

var menuDetailTask = {
  action: function(task, context, callback) {
    if(context.dialog.menu.image) {
      task.result = {
        image: {url: context.dialog.menu.image},
        buttons: [
          {text: '사진보기', url: context.dialog.menu.image}
        ]
      };
    }
    callback(task, context);
  }
};

exports.menuDetailTask = menuDetailTask;
