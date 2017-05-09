var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('config/lib/bot')).getBot('csdemo');
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
  {category: '텔레비전', alias: '텔레비전 TV 텔레비젼 티비 테레비'},
  {category: '냉장고', alias: '냉장고 냉동고 김치냉장고 와인셀러 업소용냉장고'},
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
    callback(task,context);
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
        context.dialog.link_map = 'http://map.daum.net/link/map/' + context.user.center.svc_center_name + ',' + context.user.center.lat + ',' + context.user.center.lng;
        // console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
        // console.log('link: ' + task._doc.link_find);
        // console.log('link: ' + task._doc.link_map);
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
  if(task['1']) {
    if (task['1'] == ('집' || '회사' || '내' || '우리집')) {
      callback(task,context)
    } else {
      task.query = task['1'];
    }
  } else {
    task.query = context.dialog.inCurRaw;
  }

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
      var re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동|[가-힣]+.*[0-9]+.*가)))|([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로))/;
      if (Array.isArray(context.dialog.item.address.match(re))) {
        context.dialog.address2 = context.dialog.item.address.match(re)[0];
      } else {
        context.dialog.address2 = context.dialog.item.address.match(re);
      }
      // var match = context.dialog.item.address.replace (re, function (match, p1, p2, p3) {
      //   context.dialog.address2 = '';
      //   if (p1) {
      //     context.dialog.address2 += p1;
      //   }
      //   if (p2) {
      //     context.dialog.address2 += ' ' + p2;
      //   }
      //   if (p3) {
      //     context.dialog.address2 += ' ' + p3;
      //   }
      //
      // });
      context.dialog.address = context.dialog.item.address.replace(' ', '');
      callback(task,context);
    } else {
      context.dialog.check = 're';
      callback(task, context);
    }
  });

}

exports.searchNaver = searchNaver;

function searchNaverTwo(task, context, callback) {
  if(task['1']) {
    if (task['1'] == ('집' || '회사' || '내' || '우리집')) {
      callback(task,context)
    } else {
      task.query = task['1'];
    }
  } else if (context.dialog.addressquery) {
    task.query = context.dialog.addressquery;
  } else {
    task.query = context.dialog.inCurRaw;
  }

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
      var re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+.[0-9]?동|[가-힣]+.*[0-9]+.*가)))|([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로))/;
      if (Array.isArray(context.dialog.item.address.match(re))) {
        context.dialog.address2 = context.dialog.item.address.match(re)[0];
      } else {
        context.dialog.address2 = context.dialog.item.address.match(re);
      }
      // var match = context.dialog.item.address.replace (re, function (match, p1, p2, p3) {
      //   context.dialog.address2 = '';
      //   if (p1) {
      //     context.dialog.address2 += p1;
      //   }
      //   if (p2) {
      //     context.dialog.address2 += ' ' + p2;
      //   }
      //   if (p3) {
      //     context.dialog.address2 += ' ' + p3;
      //   }
      //
      // });
      context.dialog.address = context.dialog.item.address.replace(' ', '');
      callback(task,context);
    } else {
      context.dialog.check = 're';
      callback(task, context);
    }
  });

}

exports.searchNaverTwo = searchNaverTwo;


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

  if (day <=6) {
    context.dialog.check = false;
  } else if (day >= 7) {
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
        callback(task,context);
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
          context.dialog.repairable = true;
          _cb(true);
        } else {
          context.dialog.repairable = false;
          _cb(null);
        }
      }
    }

  ], function (err) {
    callback(task,context);
  })
}

exports.repairableCheck = repairableCheck;

function repairableChecktwo(task, context, callback) {

  async.waterfall([
    function (_cb) {
      var category, word, rCategory;

      word = context.dialog.ascategory;

      if (word == "에어컨" | word == "텔레비전" | word == "냉장고" | word == "가스레인지" | word == "세탁기" | word == "식기세척기" | word == "정수기" | word == "안마의자" | word == "홈시어터") {
        context.user.category = word;
        context.dialog.repairable = 'remote';
        _cb(true);
      } else if (context.user.center == undefined) {
        callback(task,context);
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
          context.dialog.repairable = true;
          _cb(true);
        } else {
          context.dialog.repairable = false;
          _cb(null);
        }
      }
    }

  ], function (err) {
    callback(task,context);
  })
}

exports.repairableChecktwo = repairableChecktwo;


function repairableTypecheck(inRaw, inNLP, inDoc, context, callback) {

  var matched = false;
  if (context.dialog.inCurNLP) {
    var words = context.dialog.inCurNLP.split(' ');
  } else {
    var words = context.dialog.inNLP.split(' ');
  }
  async.waterfall([
    function (_cb) {
      var category, word, rCategory;
      for (var i in words) {
        word = words[i];
        if (category) break;

        if (word.length == 1 && word != '폰') continue;
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

exports.dongTypeCheck = function (text, type, task, context, callback) {
  var re = /(?:(역삼|개포|청담|삼성|대치|신사|논현|압구정|세곡|자곡|율현|일원|수서|도곡|명일|고덕|상일|둔촌|암사|성내|천호|강일|미아|수유|우이|마곡|가양|염창|공항|과해|오곡|오쇠|등촌|외발산|내발산|화곡|방화|개화|봉천|신림|남현|중곡|구의|광장|노유|자양|화양|모진|군자|온수|개봉|고척|신도림|오류|천왕|구로|가리봉|가산|독산|시흥|월계|공릉|하계|중계|상계|쌍문|방학|도봉|용두|신설|제기|전농|답십리|장안|청량리|회기|휘경|이문|용신|노량진|흑석|대방|상도|신대방|사당|공덕|신공덕|아현|도화|마포|용강|토정|대흥|노고산|염리|신수|현석|구수|신정|상수|하중|당인|서교|창전|동교|합정|망원|연남|성산|상서강|미근|북아현|냉천|천연|옥천|영천|현저|대신|대현|신촌|봉원|창천|연희|홍제|홍은|남가좌|북가좌|충현|방배|양재|우면|원지|잠원|반포|서초|내곡|염곡|신원|상왕십리|하왕십리|홍익|도선|마장|용답|행당|사근|송정|옥수|정릉|길음|하월곡|장위|석관|성북|돈암|종암|상월곡|풍납|거여|마천|방이|오금|석촌|삼전|가락|장지|문정|송파|신천|잠실|신정|신월|영등포|여의도|양화|신길|대림|도림|후암|갈월|남영|서계|신창|산천|청암|효창|도원|용문|문배|신계|이촌|한남|빙고|서빙고|주성|이태원|보광|녹번|역촌|응암|신사|증산|수색|구산|대조|갈현|불광|진관|청운|신교|궁정|효자|창성|통의|적선|통인|누상|누하|옥인|체부|필운|내자|사직|도렴|당주|내수|세종로|청진|서린|수송|중학|공평|관훈|견지|와룡|권농|운니|익선|경운|관철|인사|낙원|팔판|삼청|안국|소격화|사간|송현|가회|원서|훈정|봉익|돈의|장사|관수|인의|예지|원남|연지|효제|이화|연건|충신|혜화|창신|숭인|교남|송월|홍파|교북|행촌|구기|평창|부암|홍지|신영|무악|무교|삼각|수하|장교|수표|남창|소공|북창|예관|묵정|남학|주자|예장|주교|방산|오장|입정|산림|신당|흥인|무학|황학|서소문|순화|중림|면목|망우|상봉|중화|신내)|(강남|강동|강북|강서|관악|광진|구로|금천|노원|도봉|동대문|동작|마포|서대문|서초|성동|성북|송파|양천|영등포|용산|은평|종로|중구|중랑)|(가능|강남|가락시장|경마공원|강동|고려대|가산디지털단지|가락시장|가양|간석오거리|가재울|가천대|검암|가좌|강남|가평|남동인더스파크|강남대|경기도청북부청사|경기광주|가산디지털단지|강변|경복궁|고잔|개롱|공덕|강남구청|강동구청|개화|갈산|가정|강남구청|계양|강매|광교|갈매|달월|고진|경전철의정부|곤지암|간석|건대입구|경찰병원|과천|개화산|광흥창|건대입구|남한산성입구|고속터미널|경인교대입구|가정중앙시장|개포동|공덕|곡산|광교중앙|강촌|소래포구|기흥|곤제|부발|개봉|교대|고속터미널|금정|거여|구산|고속터미널|단대오거리|공항시장|계산|검단사거리|구룡|공항화물청사|공덕|동천|굴봉산|송도|김량장|동오|삼동|관악|구로디지털단지|교대|길음|고덕|녹사평|공릉|모란|구반포|계양|검단오류|구성|김포공항|구리|상현|금곡|숭의|동백|발곡|세종대왕릉|광명|구의|구파발|남태령|공덕|대흥|광명사거리|몽촌토성|국회의사당|국제업무지구|검바위|기흥|디지털미디어시티|국수|성복|김유정|신포|둔전|범골|신둔도예촌|광운대|까치산|금호|노원|광나루|독바위|군자|문정|김포공항|귤현|검암|대모산입구|서울역|금릉|수지구청|남춘천|연수|명지대|새말|여주|구로|낙성대|남부터미널|당고개|광화문|돌곶이|굴포천|복정|노들|동막|남동구청|도곡|영종|금촌|양재|대성리|오이도|보평|송산|이매|구일|당산|녹번|대공원|군자|동묘앞|까치울|산성|노량진|동수|독정|망포|운서|능곡|양재시민의숲|마석|원인재|삼가|어룡|이천|군포|대림|대곡|대야미|굽은다리|디지털미디어시티|남구로|석촌|당산|동춘|마전|매교|인천국제공항|대곡|정자|망우|월곶|시청.용인대|의정부시청|초월|금정|도림천|대청|동대문|길동|마포구청|남성|송파|동작|문학경기장|만수|매탄권선|청라국제도시|덕소|청계산입구|백양리|인천|어정|의정부중앙|판교|금천구청|동대문역사문화공원|대치|동대문역사문화공원|김포공항|망원|내방|수진|등촌|박촌|모래내시장|모란|홍대입구|도농|판교|별내|인천논현|운동장.송담대|탑석|남영|뚝섬|대화|동작|까치산|버티고개|노원|신흥|마곡나루|부평|서구청|미금|도심|사릉|인하대|전대.에버랜드|회룡|노량진|문래|도곡|명동|답십리|보문|논현|암사|봉은사|부평구청|서부여성회관|보정|디지털미디어시티|상봉|호구포|지석|효자|녹양|방배|독립문|미아|동대문역사문화공원|봉화산|대림|잠실|사평|부평삼거리|석남|복정|망우|상천|초당|흥선|녹천|봉천|동대입구|미아사거리|둔촌동|불광|도봉산|장지|삼성중앙|부평시장|석바위시장|상갈|문산|신내|당정|사당|마두|반월|마곡|삼각지|뚝섬유원지|천호|샛강|선학|석천사거리|서울숲|백마|천마산|대방|삼성|매봉|범계|마장|상수|마들|선유도|센트럴파크|시민공원|서현|상봉|청평|덕계|상왕십리|무악재|사당|마천|상월곡|먹골|선정릉|신연수|아시아드경기장|선릉|서강대|춘천|덕정|서울대입구|백석|산본|마포|새절|면목|신논현|예술회관|완정|선정릉|서빙고|퇴계원|도봉|서초|불광|삼각지|명일|석계|반포|신목동|원인재|왕길|수내|서울역|평내호평|도봉산|선릉|삼송|상계|목동|신당|보라매|신반포|인천대입구|운연|수서|수색|도원|성수|수서|상록수|발산|안암|부천시청|신방화|인천시청|인천가좌|수원|신원|도화|시청|신사|서울역|방이|약수|부천종합운동장|양천향교|인천터미널|인천대공원|수원시청|신촌|독산|신답|안국|선바위|방화|역촌|부평구청|언주|임학|인천시청|신갈|아신|동대문|신당|압구정|성신여대입구|상일동|연신내|사가정|여의도|작전|주안|압구정로데오|야당|동두천|신대방|약수|수리산|서대문|월곡|삼산체육관|염창|지식정보단지|주안국가산단|야탑|양수|동두천중앙|신도림|양재|수유|송정|월드컵경기장|상도|종합운동장|캠퍼스타운|영통|양원|동묘앞|신림|연신내|숙대입구|신금호|응암|상동|증미|테크노파크|오리|양정|동암|신설동|오금|신길온천|신길|이태원|상봉|흑석|왕십리|양평|동인천|신정네거리|옥수|신용산|신정|증산|수락산|이매|오빈|두정|신촌|원당|쌍문|아차산|창신|숭실대입구|정자|옥수|망월사|아현|원흥|안산|애오개|청구|신대방삼거리|죽전|왕십리|명학|양천구청|을지로3가|오이도|양평|태릉입구|신중동|청명|용문|방학|역삼|일원|이촌|여의나루|한강진|신풍|태평|용산|배방|영등포구청|잠원|인덕원|여의도|합정|어린이대공원|한티|운길산|백운|왕십리|정발산|정부과천청사|영등포구청|화랑대|온수|운정|병점|용답|종로3가|정왕|영등포시장|효창공원앞|용마산|원덕|보산|용두|주엽|중앙|오금|이수|월롱|봉명|을지로3가|지축|창동|오목교|장승배기|응봉|부개|을지로4가|충무로|초지|올림픽공원|장암|이촌|부천|을지로입구|학여울|총신대입구|왕십리|중계|일산|부평|이대|홍제|충무로|우장산|중곡|중랑|서동탄|잠실|화정|평촌|을지로4가|중화|청량리|서울역|잠실나루|한대앞|장한평|천왕|탄현|서정리|잠실새내|한성대입구|종로3가|철산|파주|석계|종합운동장|혜화|천호|청담|팔당|석수|충정로|회현|청구|춘의|풍산|성균관대|한양대|충정로|태릉입구|한남|성환|합정|행당|하계|행신|세류|홍대입구|화곡|학동|홍대입구|세마|화전|소사|회기|소요산|효창공원앞|송내|송탄|수원|시청|신길|신도림|신설동|신이문|신창|쌍용|아산|안양|양주|역곡|영등포|오류동|오산|오산대|온수|온양온천|외대앞|용산|월계|의왕|의정부|인천|제기동|제물포|종각|종로3가|종로5가|주안|중동|지제|지행|직산|진위|창동|천안|청량리|평택|화서|회기|회룡)?(역)|(홍대|대학로))/g;
  var matched = false;
  console.log('1'+text);
  text = text.replace(re, function (match,p1,p2,p3,p4,p5) {
    matched = true;
    if (p1) {
      context.dialog.addressquery = p1 + '동';
    } else if (p2) {
      context.dialog.addressquery = p2 + '구';
    } else if (p3) {
      if (p4) {
        context.dialog.addressquery = p3;
      } else {
        context.dialog.addressquery = p3 + '역';
      }
    } else if (p5) {
      context.dialog.addressquery = p5;
    }
  });
  callback(text, task, matched);
};

exports.nameTypeCheck = function (text, type, task, context, callback) {
  var re = /^[가-힣]{2,4}$/g;
  var matched = false;
  var word = text.replace(/ /,'');
  word = word.match(re);
  if (word) {
    matched = true;
    callback(text, task, matched);
  } else {
    callback(text, task, matched);
  }
};
