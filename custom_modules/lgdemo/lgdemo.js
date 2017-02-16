var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('config/lib/bot')).getBot('lgdemo');
var async = require('async');

var asCategory = [
  {category: '휴대폰', alias: '스마트폰 핸드폰 폰 휴대폰'},
  {category: 'PC', alias: '노트북 컴퓨터 PC 데스크탑'},
  {category: '스마트워치', alias: '스마트워치 스마트와치 워치 와치 Watch'},
  {category: 'Friends', alias: 'Friends'},
  {category: '패드', alias: '패드 PAD 태블릿 탭북'},
  {category: '헤드셋', alias: '헤드셋 이어폰 헤드폰 블루투스헤드셋'},
  {category: '청소기', alias: '청소기 스팀청소기 로봇청소기 로보킹 무선청소기'},
  {category: '컴퓨터주변기기', alias: '컴퓨터주변기기 모니터 프린터'},
  {category: '프로젝터', alias: '빔프로젝터 프로젝터 빔'},
  {category: '전자레인지', alias: '전자레인지 전자렌지'},
  {category: '블루레이', alias: '블루레이 DVD Bluray'},
  {category: '가습기', alias: '가습기'},
  {category: '제습기', alias: '제습기'},

  {category: '에어컨', alias: '온풍기 시스템에어컨 에어컨 에어콘'},
  {category: '텔레비전', alias: '텔레비전 TV 텔레비젼 티비'},
  {category: '냉장고', alias: '냉장고 냉동고 김채낭장고 와인셀러 업소용냉장고'},
  {category: '가스레인지', alias: '가스레인지 가스렌지 가스오븐레인지 가스오브렌지 오븐'},
  {category: '세탁기', alias: '세탁기 건조기 의류건조기 스타일러'},
  {category: '식기세척기', alias: '식기세척기'},
  {category: '정수기', alias: '정수기 온수기 냉온수기 이온수기'},
  {category: '안마의자', alias: '안마의자'},
  {category: '홈시어터', alias: '홈시어터 사운드바'},

  {category: '불가물품', alias: '불가물품 키폰 홈오토메이션 UP3 마우스 하이패스'}
];

var ang = {
  action: daumgeoCode,
  preCallback: function(task,context,callback) {
    // console.log(context.user.address);
    task._doc.address = context.user.address.시도명 + ' ' + context.user.address.시군구명 + ' ' + context.user.address.행정동명;
    // console.log(JSON.stringify(context.dialog.address));
    // console.log(JSON.stringify(context.dialog.address.시도명));
    // console.log(task._doc.address);
    callback(task, context);
  },
  _doc: {
    lng: '',
    lat: '',
    link_find: '',
    link_map: '',
    address: ''
  }
};
exports.ang = ang;

function daumgeoCode (task, context, callback) {
  if (context.user.center == undefined) {
    callback(false);
  } else {
    var request = require('request');
    var query = {q: context.user.center.address3, output: "json"};
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
        // task._doc.lng = doc.channel.item[0].lng;
        // task._doc.lat = doc.channel.item[0].lat;
        // task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
        task._doc.link_map = 'http://map.daum.net/link/map/' + context.user.center.svc_center_name + ',' + context.user.center.lat + ',' + context.user.center.lng;
        // console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
        // console.log('link: ' + task._doc.link_find);
        // console.log('link: ' + task._doc.link_map);

        task.url = task._doc.link_map;
        task.urlMessage = '지도에서 위치보기';
      }
      callback(task, context);

    });
  }
}
exports.daumgeoCode = daumgeoCode;

function startAction(task, context, callback) {
  context.user.address = null;
  callback(task, context);
}

bot.setAction("startAction", startAction);

// 위치정보를 context.dialog.location 에 저정하기로 한다. location.lat location.lng
function locationNotExists(dialog, context, callback) {
  if(context.user.address == undefined) callback(true);
  else callback(false);
}
exports.locationNotExists = locationNotExists;

function locationExists(dialog, context, callback) {
  if(context.user != undefined && context.user.address != undefined) callback(true);
  else callback(false);
}
exports.locationExists = locationExists;

function locationExistsIN(inRaw, inNLP, dialog, context, callback) {
  if(context.user != undefined && context.user.address != undefined) callback(true);
  else callback(false);
}
exports.locationExistsIN = locationExistsIN;

function locationNotExistsIN(inRaw, inNLP, dialog, context, callback) {
  if(context.user.address == undefined) callback(true);
  else callback(false);
}
exports.locationNotExistsIN = locationNotExistsIN;




var searchCenterTask = {
  action: searchCenter,
  postCallback: function(task, context, callback) {
    callback(task, context);
  }
};
exports.searchCenterTask = searchCenterTask;

var searchUsaCenterTask = {
  action: searchUsaCenter,
  postCallback: function(task, context, callback) {
    callback(task, context);
  }
};

exports.searchUsaCenterTask = searchUsaCenterTask;

function searchUsaCenter (task, context, callback) {
  var center = mongo.getModel('lgcenter_usa', undefined);
  var lng, lat;

  task.address = context.user.address = context.dialog.address;

  if(context.dialog.address) {
    lng = context.dialog.address.lng;
    lat = context.dialog.address.lat;
  } else if(context.user.address) {
    lng = context.user.address.lng;
    lat = context.user.address.lat;
  }

  center.find({}).lean().exec(function(err, docs) {
    if(err) {
      console.log(err);
      callback(task, context);
    } else {
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        doc.distance = addressModule.getDistanceFromGeocode(lat, lng, doc.LATITUDE, doc.LONGITUDE);
        doc.distance = doc.distance.toPrecision(2);
        // console.log(doc.name, doc.distance, JSON.stringify(dist));
      }
      // if (i == docs.length) {
      docs.sort(function (a, b) {
        return a.distance - b.distance;
      });
      // }
      context.dialog.item = docs;

      callback(task,context)
    }
  });
}
exports.searchUsaCenter = searchUsaCenter;

function searchCenter (task, context, callback) {
  var center = mongo.getModel('lgcenter', undefined);  var address, lng, lat;
  task.address = context.user.address = context.dialog.address;

  addressModule.naverGeocode(task, context, function(task, context) {
    context.user.lat = context.dialog.lat = task.lat;
    context.user.lng = context.dialog.lng = task.lng;

    if(context.dialog.address) {
      address = context.dialog.address;
      lng = context.dialog.lng;
      lat = context.dialog.lat;
    } else if(context.user.address) {
      address = context.user.address;
      lng = context.user.lng;
      lat = context.user.lat;
    }

    center.find({}).lean().exec(function(err, docs) {
      if(err) {
        console.log(err);
        callback(task, context);
      } else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          doc.distance = addressModule.getDistanceFromGeocode(lat, lng, doc.lat, doc.lng);
          doc.distance = doc.distance.toPrecision(2);
          // console.log(doc.name, doc.distance, JSON.stringify(dist));
        }
        // if (i == docs.length) {
        docs.sort(function (a, b) {
          return a.distance - b.distance;
        });
        // }
        context.dialog.item = docs.slice(0, 2);

        callback(task,context)
      }
    });

  })
}

exports.searchCenter = searchCenter;

function searchNaver(task, context, callback) {
  task.query=context.dialog.inCurRaw;

  addressModule.naverGeoSearch(task, context, function(task, context) {
    for(var i = 0; i < task.doc.length; i++) {
      var item = task.doc[i];
      item.title = item.title.replace(/<[^>]+>/, '');
      item.title = item.title.replace(/<\/[^>]+>/, '');
    }

    if(task.doc && task.doc.length > 0) task.count = task.doc.length;
    else task.count = 0;

    context.dialog.item = task.doc[0];
    if (context.dialog.item) {
      context.dialog.address = context.dialog.item.address.replace(' ', '');
      callback(task,context);
    } else {
      context.dialog.check = 're';
      callback(task, context);
    }
  });

}

exports.searchNaver = searchNaver;

function checkTime(task, context, callback) {
  var center = mongo.getModel('lgcenter', undefined);
  center.find({}).lean().exec(function(err,docs) {
    if (context.bot.testMode) {
      context.dialog.check = false;
    } else {
      var day = new Date().getDay();

      if (day <= 5) {
        if (context.dialog.time <= docs[0].winter_week_close && context.dialog.time >= docs[0].winter_week_open) {
          context.dialog.check = false;
        } else if (context.dialog.time == 're'){
          context.dialog.check = 're';
        } else {
          context.dialog.check = true;
        }
      } else if (day == 6) {
        if (context.dialog.time <= docs[0].winter_sat_close && context.dialog.time >= docs[0].winter_sat_open) {
          context.dialog.check = false;
        } else if (context.dialog.time == 're'){
          context.dialog.check = 're';
        } else {
          context.dialog.check = true;
        }
      } else {
        context.dialog.check = true;
      }
      callback(task, context);
    }
  })
}

exports.checkTime = checkTime;

function checkDate(task, context, callback) {
  var day = context.dialog.date.getDay();

  if (day <=5) {
    context.dialog.check = false;
  } else if (day >= 6) {
    context.dialog.check = true;
  }
  callback(task, context);
}

exports.checkDate = checkDate;

function repairableList(task, context, callback) {

  if (context.user.center == undefined) {
    callback(false);
  } else {
    context.user.center.productlist = context.user.center.product.map ( function(elem){
      return elem.category;
    }).join(", ");
  }
  callback(task,context);
}

exports.repairableList = repairableList;

function repairableCheck(task, context, callback) {

  async.waterfall([
    function (_cb) {
      var category, word, rCategory;

      word = context.dialog.ascategory;

      if (word == "에어컨" | word == "텔레비전" | word == "냉장고" | word == "가스레인지" | word == "세탁기" | word == "식기세척기" | word == "정수기" | word == "안마의자" | word == "홈시어터") {
        context.user.category = word;
        context.dialog.repairable = 'remote';
        _cb(true);
      } else if (context.user.center == undefined) {
        callback(false);
      } else {

        for (var j in context.user.center.product) {
          rCategory = context.user.center.product[j];

          word = RegExp.escape(word);
          if (rCategory.alias.search(new RegExp(word, 'i')) != -1) {
            category = rCategory.category;
            break;
          }
        }

        if (category == "휴대폰" | category == "PC" | category == "스마트워치" | category == "Friends" | category == "헤드셋" | category == "청소기" | category == "컴퓨터주변기기" | category == "프로젝터" | category == "전자레인지" | category == "블루레이" | category == "가습기" | category == "제습기") {
          context.user.category = category;
          context.dialog.repariable = true;
          _cb(true);
        } else {
          context.dialog.repairable = false;
          _cb(null);
        }
      }
    }

  ], function (err) {
    callback(task,context,callback);
  })
}

exports.repairableCheck = repairableCheck;

function repairableTypecheck(inRaw, inNLP, inDoc, context, callback) {

  var matched = false;
  var words = context.dialog.inNLP.split(' ');
  async.waterfall([
    function (_cb) {
      var category, word, rCategory;
      for (var i in words) {
        word = words[i];
        if (category) break;

        if (word.length == 1) continue;
        for (var j in asCategory) {
          rCategory = asCategory[j];

          word = RegExp.escape(word);
          if (rCategory.alias.search(new RegExp(word, 'i')) != -1) {
            category = rCategory.category;
            break;
          }
        }
      }

      if (category) {
        inDoc['repairable'] = true;
        context.dialog.ascategory = category;
        matched = true;
        _cb(true);
      } else {
        _cb(null);
      }
    }

  ], function (err) {
    callback(inRaw, inDoc, matched);
  });
}

exports.repairableTypecheck = repairableTypecheck;
