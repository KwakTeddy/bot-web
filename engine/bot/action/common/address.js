var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;
var path = require('path');
var mongo = require(path.resolve('./engine/bot/action/common/mongo'));
var fs = require('fs');

var async = require('async');
var logger = require(path.resolve('./config/lib/logger'));
var utils = require(path.resolve('./engine/bot/action/common/utils'));

var ADDRESS_DIR = process.env.ADDRESS_DIR;
var ADDRESS_MATCH_DIR = process.env.ADDRESS_MATCH_DIR;
var ADDRESS_SPACE_DIR = process.env.ADDRESS_SPACE_DIR;

function addressTypeCheck(text, type, task, context, callback) {
  var address = {};
  address.inRaw = text;
  searchAddress(address, context, function() {
    if(address.doc == undefined) {
      logger.debug('nodata: ' + address.inRaw);

      callback(text, task, false);
    } else if(Array.isArray(address.doc)) {
      for (var i = 0; i < address.doc.length; i++) {
        logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].도로명주소);
      }
      task[type.name] = address.doc[0];
      callback(text, task, true);
    } else if(address.doc) {
      logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.도로명주소);
      task[type.name] = address.doc;
      callback(text, task, true);
    }

  });
}

exports.addressTypeCheck = addressTypeCheck;

function addressTypeCheck2(text, type, task, context, callback) {
  var address = {};
  address.inRaw = text;
  searchAddress2(address, context, function() {
    if(address.doc == undefined) {
      logger.debug('nodata: ' + address.inRaw);

      callback(text, task, false);
    } else if(Array.isArray(address.doc)) {
      for (var i = 0; i < address.doc.length; i++) {
        logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].도로명주소);
      }
      task[type.name] = address.doc;
      callback(text, task, true);
    } else if(address.doc) {
      logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.도로명주소);
      task[type.name] = address.doc;
      callback(text, task, true);
    }
  });
}

exports.addressTypeCheck2 = addressTypeCheck2;

function usaTypeCheck(text, type, task, context, callback) {
  var address = {address: text};
  var name = 'address';
  var request = require('request');

  var matchaddress = function(_name, _task, _time) {
    if(_task[_name]) {
      if(Array.isArray(_task[_name])) _task[_name].push(_time);
      else _task[_name] = [_task[_name], _time];
    } else {
      _task[_name] = _time;
    }
  };

  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyDFfCi-x6iMRxdN_V7U2pSCQFzGseNzSBM',
    method: 'GET',
    qs: address
  }, function(error, response, body) {
    if (!error) {
      // console.log(body);
      task.doc = null;
      var doc = JSON.parse(body);
      console.log(JSON.stringify(doc));
      var _doc = {
        lat:doc.results[0].geometry.location.lat,
        lng:doc.results[0].geometry.location.lng
      };
      // console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
    }

    // return matchaddress(name, task, _doc);

    if(task[name]) {
      if(Array.isArray(task[name])) task[name].push(_doc);
      else task[name] = [task[name], _doc];
    } else {
      task[name] = _doc;
    }

    callback(text, task, true);

  });
}

exports.usaTypeCheck = usaTypeCheck;

function updateRestaurantAddress(task, context, callback) {

  var model = mongoose.model('Restaurant');

  model.find({})./*limit(1000).*/exec(function(err, docs) {
    async.eachSeries(docs, function(doc, cb) {
      var address;
      if(doc._doc.address1 != undefined && doc._doc.address1 != '') address = {inRaw: doc._doc.address1};
      else if(doc._doc.address2 != undefined && doc._doc.address2 != '') address = {inRaw: doc._doc.address2};

      if(address == undefined) {
        logger.debug('noaddress: ' + doc._doc.address1 + ',' + doc._doc.address2);
        cb(null);
      } else {
        searchAddress(address, context, function(_task, _context) {
          if(address.doc == undefined) {
            logger.debug('nodata: ' + address.inRaw);
            cb(null);
          } else if(Array.isArray(address.doc)) {
            for (var i = 0; i < address.doc.length; i++) {
              // logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].행정동명 + ' / ' + address.doc[i].도로명주소);
            }

            model.update({_id: ObjectId(doc._doc._id)}, {address: address.doc[0]}, {multi: true}, function(err, num) {
              cb(null);
            });

          } else if(address.doc) {
            // logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.행정동명 + ' / ' + address.doc.도로명주소 + ',' + doc._doc._id);

            model.update({_id: ObjectId(doc._doc._id)}, {address: address.doc}, {multi: true}, function(err, num) {
              cb(null);
            });
          }
        });
      }
    }, function(err) {
      callback(task, context);
    })
  });
}

exports.updateRestaurantAddress = updateRestaurantAddress;


function searchAddress(task, context, callback) {

  var model = mongo.getModel('buildingdata', 건물정보스키마);

  var query = {};
  var 시도명, 시군구명, 읍면동명, 행정동명, 도로명, 리명, 본번, 부번, 상세주소, 도로명상세주소, 건물명;

  var 지번Re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세>종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동[\s가-힣]+[\s0-9]+가|[가-힣]+동|[가-힣]+[\s0-9]+가)|([가-힣]+\d+읍|[가-힣]+\d+면|[가-힣]+\d+동))|(?:(?:[가-힣]+읍\s+|[가-힣]+면\s+)?([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로)))\s*([가-힣]+\d*리)?\s*(\d+)?(?:\s*-\s*(\d+))?(?:(?:\s*,?\s*|\s+)([^\\(]*))?(?:\s*\(([^,\s]+)(?:\s*,?\s*([^\\)]*))?\))?/i;
  var matched = task.inRaw.match(지번Re);
  console.log('matched: ' + matched);
  if(matched != null) {
    if (matched[1] != null) {
      if (matched[1] == '경기') 시도명 = '경기도';
      else if (matched[1] == '강원') 시도명 = '강원도';
      else if (matched[1] == '충북') 시도명 = '충청북도';
      else if (matched[1] == '충남') 시도명 = '충청남도';
      else if (matched[1] == '전북') 시도명 = '전라북도';
      else if (matched[1] == '전남') 시도명 = '전라남도';
      else if (matched[1] == '경북') 시도명 = '경상북도';
      else if (matched[1] == '경남') 시도명 = '경상남도';
      else if (matched[1] == '제주') 시도명 = '제주특별자치도';
      else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
      else if (matched[1] == '서울') 시도명 = '서울특별시';
      else if (matched[1] == '서울시') 시도명 = '서울특별시';
      else if (matched[1] == '인천') 시도명 = '인천광역시';
      else if (matched[1] == '인천시') 시도명 = '인천광역시';
      else if (matched[1] == '대전') 시도명 = '대전광역시';
      else if (matched[1] == '대전시') 시도명 = '대전광역시';
      else if (matched[1] == '대구') 시도명 = '대구광역시';
      else if (matched[1] == '대구시') 시도명 = '대구광역시';
      else if (matched[1] == '광주') 시도명 = '광주광역시';
      else if (matched[1] == '광주시') 시도명 = '광주광역시';
      else if (matched[1] == '부산') 시도명 = '부산광역시';
      else if (matched[1] == '부산시') 시도명 = '부산광역시';
      else if (matched[1] == '울산') 시도명 = '울산광역시';
      else if (matched[1] == '울산시') 시도명 = '울산광역시';
      else if (matched[1] == '세종') 시도명 = '세종특별자치시';
      else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
      else 시도명 = matched[1];
    } else {
      시도명 = matched[1];
    }

      시군구명 = matched[2];
      읍면동명 = matched[3];
      행정동명 = matched[4];
      도로명 = matched[5];
      리명 = matched[6];
      본번 = matched[7];
      부번 = matched[8];
      상세주소 = matched[9] ? matched[9].trim() : matched[9];

      // 시도명 = "서울시";

      // 시군구명 = "용산구";
      // 읍면동명 = "용산동";
      // 행정동명 = matched[4];
      // 도로명 = matched[5];
      // 리명 = matched[6];
      // 본번 = "5가";
      // 부번 = matched[8];
      // 상세주소 = "24번지 101동 101호";
      //
      // 시도명 = "서울특별시";

      // 시군구명 = "관악구";
      // 읍면동명 = "봉천동";
      // 행정동명 = matched[4];
      // 도로명 = matched[5];
      // 리명 = matched[6];
      // 본번 = "1645";
      // 부번 = "55";
      // 상세주소 = "201호";


      if(도로명) {
      도로명 = 도로명.replace(/\s/, '');
      query.도로명 = 도로명;
      if(본번) query.건물본번 = 본번;
      if(부번) query.건물부번 = 부번;
      else if(본번) query.건물부번 = '0';
    } else if(읍면동명) {
      query.법정읍면동명 = 읍면동명.replace(/\s/, '');
      if(리명) query.법정리명 = 리명;
      // else query.법정리명 = '';
      if(본번) query.지번본번 = 본번;
      if(부번) query.지번부번 = 부번;
      else if(본번) query.지번부번 = '0';
    } else if(행정동명) {
      행정동명 = 행정동명.replace(/\s/, '');
      query.행정동명 = 행정동명;
      if(본번) query.지번본번 = 본번;
      if(부번) query.지번부번 = 부번;
      else if(본번) query.지번부번 = '0';
    }
    if(시도명) query.시도명 = 시도명;
    if(시군구명) query.시군구명 = new RegExp(시군구명, 'i');

  }
  // else {
  //   var 건물명Re = /\B(?:[a-zA-Z가-힣]+\s*\d+차[a-zA-Z가-힣]*|[0-9a-zA-Z가-힣]+)(?:\s|$)/g;
  //   var 건물명예외Re = /^(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시|[가-힣]+시|[가-힣]+군|[가-힣]+구|[가-힣]+읍|[0-9가-힣]+면|[0-9가-힣]+동|[0-9가-힣]+리|아파트|상가|건물|주택)$/i;
  //   matched = task.inRaw.match(건물명Re);
  //   건물명 = matched[0];
  //   console.log('건물명1: '+건물명)
  //   // console.log('inRaw: ' + task.inRaw);
  //   // console.log('matched: ' + matched);
  //   if(matched != null && matched instanceof Array) {
  //     if(matched.length > 1) {
  //       query = {$or: []};
  //       for (var i = 0; i < matched.length; i++) {
  //         var match = matched[i].trim();
  //         // console.log(match);
  //         // logger.debug('건물명예외Re:' +match + ',' +  건물명예외Re + ','  + match.search(건물명예외Re));
  //         if(match.search(건물명예외Re) == -1)
  //           query.$or.push({시군구용건물명: match});
  //       }
  //     } else {
  //       if(matched[0].trim().search(건물명예외Re) == -1)
  //         query = {시군구용건물명: matched[0].trim()};
  //         // console.log('-------------------')
  //         // console.log(JSON.stringify(query));
  //     }
  //
  //     var last = matched[matched.length-1];
  //     var lastRe = new RegExp(last+'\\s+(.*)', 'i');
  //     matched = task.inRaw.match(lastRe);
  //     console.log('matched: ' + matched);
  //     if(matched != null) {
  //       상세주소 = matched[1];
  //     } else {
  //       상세주소 = undefined;
  //     }
  //   }
  // }

  task.doc = null;

  // query.시군구명 = "용산구";

  if(Object.keys(query).length == 0) {
    callback(task, context);
  } else {
    model.aggregate([
      {$match: query},
      {$group: {
        _id: '$도로명코드',
        시도명: {$first: '$시도명'},
        시군구명: {$first: '$시군구명'},
        법정읍면동명: {$first: '$법정읍면동명'},
        법정리명: {$first: '$법정리명'},
        행정동명: {$first: '$행정동명'},
        지번본번: {$first: '$지번본번'},
        지번부번: {$first: '$지번부번'},
        도로명: {$first: '$도로명'},
        건물본번: {$first: '$건물본번'},
        건물부번: {$first: '$건물부번'},
        시군구용건물명: {$first: '$시군구용건물명'},
        도로명코드: {$first: '$도로명코드'},
        읍면동일련번호: {$first: '$읍면동일련번호'}
      }},
      {$limit: 10}
    ], function(err, docs) {
      if(err) {
        logger.debug('searchAddress : ' + task.inRaw + ' ' + err);
      } else {
        // if(docs.length == 0)
        //   logger.debug('searchAddress: ' + task.inRaw + ' / count: ' + docs.length);
        console.log(JSON.stringify(docs));

        var 시군구Re = /(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?/g;
        if(docs.length > 1) {
          matched = task.inRaw.match(시군구Re);
          // console.log('시군구Re: '+matched);
          if (matched != null) {
            if (matched[1] != null) {
              if (matched[1] == '경기') 시도명 = '경기도';
              else if (matched[1] == '강원') 시도명 = '강원도';
              else if (matched[1] == '충북') 시도명 = '충청북도';
              else if (matched[1] == '충남') 시도명 = '충청남도';
              else if (matched[1] == '전북') 시도명 = '전라북도';
              else if (matched[1] == '전남') 시도명 = '전라남도';
              else if (matched[1] == '경북') 시도명 = '경상북도';
              else if (matched[1] == '경남') 시도명 = '경상남도';
              else if (matched[1] == '제주') 시도명 = '제주특별자치도';
              else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
              else if (matched[1] == '서울') 시도명 = '서울특별시';
              else if (matched[1] == '서울시') 시도명 = '서울특별시';
              else if (matched[1] == '인천') 시도명 = '인천광역시';
              else if (matched[1] == '인천시') 시도명 = '인천광역시';
              else if (matched[1] == '대전') 시도명 = '대전광역시';
              else if (matched[1] == '대전시') 시도명 = '대전광역시';
              else if (matched[1] == '대구') 시도명 = '대구광역시';
              else if (matched[1] == '대구시') 시도명 = '대구광역시';
              else if (matched[1] == '광주') 시도명 = '광주광역시';
              else if (matched[1] == '광주시') 시도명 = '광주광역시';
              else if (matched[1] == '부산') 시도명 = '부산광역시';
              else if (matched[1] == '부산시') 시도명 = '부산광역시';
              else if (matched[1] == '울산') 시도명 = '울산광역시';
              else if (matched[1] == '울산시') 시도명 = '울산광역시';
              else if (matched[1] == '세종') 시도명 = '세종특별자치시';
              else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
              else 시도명 = matched[1];
            } else {
              시도명 = matched[1];
            }

            시군구명 = matched[2];
          }
        }

        for (var i = 0; i < docs.length && i < 10; i++) {
          var doc = docs[i];
          // console.log(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명))
          // console.log('건물명2: '+건물명);
          // console.log('시도명: '+시도명);
          // console.log('독시도명: '+doc.시도명);
          // console.log('시군구명: ' +시군구명);
          // console.log('독시군구명: '+doc.시군구명);
          if(본번) {
            if(docs.length > 1 && !건물명) {
              if(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명)) continue;
            }
            var 상세주소Re = new RegExp(doc.시군구용건물명 + '\\s+', 'i');
            console.log('----------');
            if(상세주소 && doc.시군구용건물명 != '') 도로명상세주소 = 상세주소.replace(상세주소Re, '');
            console.log(1);
            var _doc = {
              시도명: doc.시도명,
              시군구명: doc.시군구명,
              법정읍면동명: doc.법정읍면동명,
              법정리명: doc.법정리명,
              행정동명: doc.행정동명,
              지번본번: doc.지번본번,
              지번부번: doc.지번부번,
              도로명: doc.도로명,
              건물본번: doc.건물본번,
              건물부번: doc.건물부번,
              시군구용건물명: doc.시군구용건물명,
              도로명코드: doc.도로명코드,
              읍면동일련번호: doc.읍면동일련번호
            };

            console.log(2);
            _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
              doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '');

            _doc.도로명주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
              (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')';

            _doc.상세주소 = 상세주소;

            _doc.in = task.inRaw;

            if(Array.isArray(task.doc)) task.doc.push(_doc);
            else if(task.doc) task.doc = [task.doc, _doc];
            else task.doc = utils.clone(_doc);

          } else {
            if(읍면동명) {
              var _doc = {
                시도명: doc.시도명,
                시군구명: doc.시군구명,
                법정읍면동명: doc.법정읍면동명,
                법정리명: doc.법정리명,
                행정동명: doc.행정동명
              };

              _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');

              _doc.in = task.inRaw;

              if(Array.isArray(task.doc)) task.doc.push(_doc);
              else if(task.doc) task.doc = [task.doc, _doc];
              else task.doc = utils.clone(_doc);

              break;
            }
          }

          // logger.debug('searchAddress: ' +
          //   task.inRaw + ' / ' +
          //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
          //   doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '') + ' / ' + doc.행정동명 + ' / ' +
          //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
          //   (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')');

          // + doc.상세건물명 + ' ' + doc.도로명코드 + ',' + doc.읍면동일련번호 + ', ' + doc.건물관리번호
        }
      }

      // console.log(task.doc);
      callback(task, context);

    })
  }
}

exports.searchAddress = searchAddress;

function searchAddress2(task, context, callback) {

  var model = mongo.getModel('건물정보', 건물정보스키마);

  var query = {};
  var 시도명, 시군구명, 읍면동명, 행정동명, 도로명, 리명, 본번, 부번, 상세주소, 도로명상세주소, 건물명, 시군구, 시군구의시도, 시도;

  var 지번Re = /(?:(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?(?:(?:([가-힣]+읍|[가-힣]+면|[가-힣]+동|[가-힣]+\s[0-9]+가)|([가-힣]+\d+읍|[가-힣]+\d+면|[가-힣]+\d+동))|(?:(?:[가-힣]+읍\s+|[가-힣]+면\s+)?([가-힣]+[\s0-9]*번?로[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?[가나다라마바사아자차카타파하]?길|[가-힣]+[\s0-9]*번?로)))\s*([가-힣]+\d*리)?\s*(\d+)?(?:\s*-\s*(\d+))?(?:(?:\s*,?\s*|\s+)([^\\(]*))?(?:\s*\(([^,\s]+)(?:\s*,?\s*([^\\)]*))?\))?|(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)|(?:^(경기도|경기|강원도|강원|충청북도|충북|충청남도|충남|전라북도|전북|전라남도|전남|경상북도|경북|경상남도|경남|제주특별자치도|제주도|제주|서울특별시|서울시|서울|인천광역시|인천시|인천|대전광역시|대전시|대전|대구광역시|대구시|대구|광주광역시|광주시|광주|부산광역시|부산시|부산|울산광역시|울산시|울산|세종특별자치시|세종특별시|세종시|세종)$)|(여의도)/i;
  var matched = task.inRaw.match(지번Re);
  // console.log('matched: ' + matched);
  if(matched != null) {
    if (matched[1] != null) {
      if (matched[1] == '경기') 시도명 = '경기도';
      else if (matched[1] == '강원') 시도명 = '강원도';
      else if (matched[1] == '충북') 시도명 = '충청북도';
      else if (matched[1] == '충남') 시도명 = '충청남도';
      else if (matched[1] == '전북') 시도명 = '전라북도';
      else if (matched[1] == '전남') 시도명 = '전라남도';
      else if (matched[1] == '경북') 시도명 = '경상북도';
      else if (matched[1] == '경남') 시도명 = '경상남도';
      else if (matched[1] == '제주') 시도명 = '제주특별자치도';
      else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
      else if (matched[1] == '서울') 시도명 = '서울특별시';
      else if (matched[1] == '서울시') 시도명 = '서울특별시';
      else if (matched[1] == '인천') 시도명 = '인천광역시';
      else if (matched[1] == '인천시') 시도명 = '인천광역시';
      else if (matched[1] == '대전') 시도명 = '대전광역시';
      else if (matched[1] == '대전시') 시도명 = '대전광역시';
      else if (matched[1] == '대구') 시도명 = '대구광역시';
      else if (matched[1] == '대구시') 시도명 = '대구광역시';
      else if (matched[1] == '광주') 시도명 = '광주광역시';
      else if (matched[1] == '광주시') 시도명 = '광주광역시';
      else if (matched[1] == '부산') 시도명 = '부산광역시';
      else if (matched[1] == '부산시') 시도명 = '부산광역시';
      else if (matched[1] == '울산') 시도명 = '울산광역시';
      else if (matched[1] == '울산시') 시도명 = '울산광역시';
      else if (matched[1] == '세종') 시도명 = '세종특별자치시';
      else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
      else 시도명 = matched[1];
    } else {
      시도명 = matched[1];
    }

    시군구명 = matched[2];
    읍면동명 = matched[3];
    행정동명 = matched[4];
    도로명 = matched[5];
    리명 = matched[6];
    본번 = matched[7];
    부번 = matched[8];
    상세주소 = matched[9] ? matched[9].trim() : matched[9];
    시군구의시도 = matched[12];
    시군구 = matched[13];
    시도 = matched[14];
    if (matched[15]) {
      읍면동명 = matched[15] + '동';
    }
    console.log('시군구의시도: ' + 시군구의시도);
    console.log('시군구: ' + 시군구);
    console.log('시도: ' + 시도);
    console.log('읍면동명: ' + 읍면동명);
    console.log('도로명: ' + 도로명);
    console.log('본번: ' + 본번);

    if(도로명) {
      도로명 = 도로명.replace(/\s/, '');
      query.도로명 = 도로명;
      if(본번) query.건물본번 = 본번;
      if(부번) query.건물부번 = 부번;
      else if(본번) query.건물부번 = '0';
    } else if(읍면동명) {
      query.법정읍면동명 = 읍면동명;
      if(리명) query.법정리명 = 리명;
      // else query.법정리명 = '';
      if(본번) query.지번본번 = 본번;
      if(부번) query.지번부번 = 부번;
      else if(본번) query.지번부번 = '0';
    } else if(행정동명) {
      행정동명 = 행정동명.replace(/\s/, '');
      query.행정동명 = 행정동명;
      if(본번) query.지번본번 = 본번;
      if(부번) query.지번부번 = 부번;
      else if(본번) query.지번부번 = '0';
    }

    if(시도) query.시도명 = 시도;
    if(시군구) query.시군구명 = new RegExp(시군구, 'i');
    console.log(Object.keys(query).length);

  } else {
    var 건물명Re = /\B(?:[a-zA-Z가-힣]+\s*\d+차[a-zA-Z가-힣]*|[0-9a-zA-Z가-힣]+)(?:\s|$)/g;
    var 건물명예외Re = /^(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시|[가-힣]+시|[가-힣]+군|[가-힣]+구|[가-힣]+읍|[0-9가-힣]+면|[0-9가-힣]+동|[0-9가-힣]+리|아파트|휴대폰|상가|건물|주택)$/i;
    matched = task.inRaw.match(건물명Re);
    if (matched != null) {
      건물명 = matched[0];
    console.log('건물명1: ' + 건물명)
    // console.log('inRaw: ' + task.inRaw);
    // console.log('matched: ' + matched);
    if (matched != null && matched instanceof Array) {
      if (matched.length > 1) {
        query = {$or: []};
        for (var i = 0; i < matched.length; i++) {
          var match = matched[i].trim();
          // console.log(match);
          // logger.debug('건물명예외Re:' +match + ',' +  건물명예외Re + ','  + match.search(건물명예외Re));
          if (match.search(건물명예외Re) == -1)
            query.$or.push({시군구용건물명: match});
        }
      } else {
        if (matched[0].trim().search(건물명예외Re) == -1)
          query = {시군구용건물명: matched[0].trim()};
        // console.log('-------------------')
        // console.log(JSON.stringify(query));
      }

      var last = matched[matched.length - 1];
      var lastRe = new RegExp(last + '\\s+(.*)', 'i');
      matched = task.inRaw.match(lastRe);
      console.log('matched: ' + matched);
      if (matched != null) {
        상세주소 = matched[1];
      } else {
        상세주소 = undefined;
      }
    }
  }}

  task.doc = null;

  // console.log(JSON.stringify(query));

  if(Object.keys(query).length == 0) {
    callback(task, context);
  } else if (읍면동명||도로명||행정동명||본번||부번||리명||건물명) {
    console.log('query start');
    model.aggregate([
      {$match: query},
      {$group: {
        _id: '$도로명코드',
        시도명: {$first: '$시도명'},
        시군구명: {$first: '$시군구명'},
        법정읍면동명: {$first: '$법정읍면동명'},
        법정리명: {$first: '$법정리명'},
        행정동명: {$first: '$행정동명'},
        지번본번: {$first: '$지번본번'},
        지번부번: {$first: '$지번부번'},
        도로명: {$first: '$도로명'},
        건물본번: {$first: '$건물본번'},
        건물부번: {$first: '$건물부번'},
        시군구용건물명: {$first: '$시군구용건물명'},
        도로명코드: {$first: '$도로명코드'},
        읍면동일련번호: {$first: '$읍면동일련번호'}
      }},
      {$limit: 10}
    ], function(err, docs) {
      if(err) {
        logger.debug('searchAddress : ' + task.inRaw + ' ' + err);
      } else {
        // if(docs.length == 0)
        //   logger.debug('searchAddress: ' + task.inRaw + ' / count: ' + docs.length);
        // console.log(JSON.stringify(docs));
        // var 시군구Re = /(?:(경기|경기도|강원|강원도|충북|충청북도|충남|충청남도|전북|전라북도|전남|전라남도|경북|경상북도|경남|경상남도|제주|제주도|제주특별자치도|서울|서울시|서울특별시|인천|인천시|인천광역시|대전|대전시|대전광역시|대구|대구시|대구광역시|광주|광주시|광주광역시|부산|부산시|부산광역시|울산|울산시|울산광역시|세종|세종시|세종특별시|세종특별자치시)\s*)?(?:([가-힣]+시|[가-힣]+군|[가-힣]+구)\s*)?(?:[가-힣]+구\s*)?/g;
        // if(docs.length > 1) {
        //   matched = task.inRaw.match(시군구Re);
        //   // console.log('시군구Re: '+matched);
        //   if (matched != null) {
        //     if (matched[1] != null) {
        //       if (matched[1] == '경기') 시도명 = '경기도';
        //       else if (matched[1] == '강원') 시도명 = '강원도';
        //       else if (matched[1] == '충북') 시도명 = '충청북도';
        //       else if (matched[1] == '충남') 시도명 = '충청남도';
        //       else if (matched[1] == '전북') 시도명 = '전라북도';
        //       else if (matched[1] == '전남') 시도명 = '전라남도';
        //       else if (matched[1] == '경북') 시도명 = '경상북도';
        //       else if (matched[1] == '경남') 시도명 = '경상남도';
        //       else if (matched[1] == '제주') 시도명 = '제주특별자치도';
        //       else if (matched[1] == '제주도') 시도명 = '제주특별자치도';
        //       else if (matched[1] == '서울') 시도명 = '서울특별시';
        //       else if (matched[1] == '서울시') 시도명 = '서울특별시';
        //       else if (matched[1] == '인천') 시도명 = '인천광역시';
        //       else if (matched[1] == '인천시') 시도명 = '인천광역시';
        //       else if (matched[1] == '대전') 시도명 = '대전광역시';
        //       else if (matched[1] == '대전시') 시도명 = '대전광역시';
        //       else if (matched[1] == '대구') 시도명 = '대구광역시';
        //       else if (matched[1] == '대구시') 시도명 = '대구광역시';
        //       else if (matched[1] == '광주') 시도명 = '광주광역시';
        //       else if (matched[1] == '광주시') 시도명 = '광주광역시';
        //       else if (matched[1] == '부산') 시도명 = '부산광역시';
        //       else if (matched[1] == '부산시') 시도명 = '부산광역시';
        //       else if (matched[1] == '울산') 시도명 = '울산광역시';
        //       else if (matched[1] == '울산시') 시도명 = '울산광역시';
        //       else if (matched[1] == '세종') 시도명 = '세종특별자치시';
        //       else if (matched[1] == '세종시') 시도명 = '세종특별자치시';
        //       else 시도명 = matched[1];
        //     } else {
        //       시도명 = matched[1];
        //     }
        //
        //     시군구명 = matched[2];
        //   }
        // }

        for (var i = 0; i < docs.length && i < 10; i++) {
          var doc = docs[i];
          // console.log(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명))
          // console.log('건물명2: '+건물명);
          // console.log('시도명: '+시도명);
          // console.log('독시도명: '+doc.시도명);
          // console.log('시군구명: ' +시군구명);
          // console.log('독시군구명: '+doc.시군구명);
          // if(본번||건물명) {
          if (본번||건물명) {
            if(docs.length > 1 && !건물명) {
              if(!(시도명 && 시도명 == doc.시도명 && 시군구명 && doc.시군구명)) continue;
            }
            var 상세주소Re = new RegExp(doc.시군구용건물명 + '\\s+', 'i');
            console.log('----------');
            if(상세주소 && doc.시군구용건물명 != '') 도로명상세주소 = 상세주소.replace(상세주소Re, '');
            console.log(1);
            var _doc = {
              시도명: doc.시도명,
              시군구명: doc.시군구명,
              법정읍면동명: doc.법정읍면동명,
              법정리명: doc.법정리명,
              행정동명: doc.행정동명,
              지번본번: doc.지번본번,
              지번부번: doc.지번부번,
              도로명: doc.도로명,
              건물본번: doc.건물본번,
              건물부번: doc.건물부번,
              시군구용건물명: doc.시군구용건물명,
              도로명코드: doc.도로명코드,
              읍면동일련번호: doc.읍면동일련번호
            };

            console.log(2);
            _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
                doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '');

            _doc.도로명주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
                (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')';

            _doc.상세주소 = 상세주소;

            _doc.in = task.inRaw;

            if(Array.isArray(task.doc)) task.doc.push(_doc);
            else if(task.doc) task.doc = [task.doc, _doc];
            else task.doc = utils.clone(_doc);
            // console.log('task1: '+JSON.stringify(task.doc));

          } else if (읍면동명) {
            var _doc = {
              시도명: doc.시도명,
              시군구명: doc.시군구명,
              법정읍면동명: doc.법정읍면동명,
              법정리명: doc.법정리명,
              행정동명: doc.행정동명
            };

            _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ' : '');

            _doc.in = task.inRaw;

            // console.log('_doc: '+JSON.stringify(_doc));
            // console.log('task3: '+JSON.stringify(task.doc));
            // console.log(Array.isArray(task.doc));

            if (Array.isArray(task.doc)) {
              for (var j = 0; j < task.doc.length; j++) {
                if (task.doc[j].시도명 == _doc.시도명) {
                  var same;
                  break;
                }
              }
              if (typeof same == undefined) {
                task.doc.push(_doc)
              }
            } else if (task.doc && task.doc.시도명 != _doc.시도명) {
              task.doc = [task.doc, _doc];
            }
            else {
              task.doc = utils.clone(_doc);
            }

            // console.log('i::::::::::::::'+i);
            // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
            // console.log('task2: '+JSON.stringify(task.doc));
            // break;
          }
          // } else if (시군구) {
          //   var _doc = {
          //     시도명: doc.시도명,
          //     시군구명: doc.시군구명
          //   };
          //
          //   _doc.지번주소 = doc.시도명 + ' ' + doc.시군구명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');
          //
          //   _doc.in = task.inRaw;
          //
          //   // console.log('_doc: '+JSON.stringify(_doc));
          //   // console.log('task3: '+JSON.stringify(task.doc));
          //   // console.log(Array.isArray(task.doc));
          //
          //   if (Array.isArray(task.doc)) {
          //     for (var j = 0; j < task.doc.length; j++) {
          //       if (task.doc[j].시도명 == _doc.시도명) {
          //         var same;
          //         break;
          //       }
          //     }
          //     if (typeof same == undefined) {
          //       task.doc.push(_doc)
          //     }
          //   } else if (task.doc && task.doc.시도명 != _doc.시도명) {
          //     task.doc = [task.doc, _doc];
          //   }
          //   else {
          //     task.doc = utils.clone(_doc);
          //   }
          //
          //   // console.log('i::::::::::::::'+i);
          //   // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
          //   // console.log('task2: '+JSON.stringify(task.doc));
          //   // break;
          // } else if (시도) {
          //   var _doc = {
          //     시도명: doc.시도명
          //   };
          //   console.log('doc.시도명: '+ doc.시도명);
          //
          //   _doc.지번주소 = doc.시도명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '');
          //
          //   _doc.in = task.inRaw;
          //
          //   // console.log('_doc: '+JSON.stringify(_doc));
          //   // console.log('task3: '+JSON.stringify(task.doc));
          //   // console.log(Array.isArray(task.doc));
          //
          //   if (Array.isArray(task.doc)) {
          //     for (var j = 0; j < task.doc.length; j++) {
          //       if (task.doc[j].시도명 == _doc.시도명) {
          //         var same;
          //         break;
          //       }
          //     }
          //     if (typeof same == undefined) {
          //       task.doc.push(_doc)
          //     }
          //   } else if (task.doc && task.doc.시도명 != _doc.시도명) {
          //     task.doc = [task.doc, _doc];
          //   }
          //   else {
          //     task.doc = utils.clone(_doc);
          //   }
          //
          //   // console.log('i::::::::::::::'+i);
          //   // if(Array.isArray(task.doc)) console.log(task.doc[j].시도명);
          //   // console.log('task2: '+JSON.stringify(task.doc));
          //   // break;
          // }

          // logger.debug('searchAddress: ' +
          //   task.inRaw + ' / ' +
          //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.법정읍면동명 + ' ' + (doc.법정리명 != '' ? doc.법정리명 + ' ': '') +
          //   doc.지번본번 + (doc.지번부번 != '0' ? '-' + doc.지번부번 : '') + (상세주소 != undefined ? ' ' + 상세주소 : '') + ' / ' + doc.행정동명 + ' / ' +
          //   doc.시도명 + ' ' + doc.시군구명 + ' ' + doc.도로명 + ' ' + doc.건물본번 + (doc.건물부번 != '0' ? '-' + doc.건물부번: '') +
          //   (도로명상세주소 != undefined ? ', ' + 도로명상세주소 : '') + ' (' + doc.법정읍면동명 + (doc.시군구용건물명 != '' ? ', ' + doc.시군구용건물명 : '') + ')');

          // + doc.상세건물명 + ' ' + doc.도로명코드 + ',' + doc.읍면동일련번호 + ', ' + doc.건물관리번호
        }
      }
      // console.log('docs: ' + JSON.stringify(docs));
      // console.log('task.doc: '+JSON.stringify(task.doc));
      callback(task, context);

    })
  } else if (시군구||시도||시군구의시도) {
    if (시도) {
      var _doc = {
        시도명: 시도
      };

      _doc.지번주소 = 시도 + ' ';

      _doc.in = task.inRaw;

      // console.log('_doc: '+JSON.stringify(_doc));
      // console.log('task3: '+JSON.stringify(task.doc));
      // console.log(Array.isArray(task.doc));

      if (Array.isArray(task.doc)) {
        for (var j = 0; j < task.doc.length; j++) {
          if (task.doc[j].시도명 == _doc.시도명) {
            var same;
            break;
          }
        }
        if (typeof same == undefined) {
          task.doc.push(_doc)
        }
      } else if (task.doc && task.doc.시도명 != _doc.시도명) {
        task.doc = [task.doc, _doc];
      }
      else {
        task.doc = utils.clone(_doc);
      }
    } else if (시군구의시도) {
      var _doc = {
        시도명: 시군구의시도,
        시군구명: 시군구
      };

      _doc.지번주소 = 시군구의시도 + ' ' + 시군구 + ' ';

      _doc.in = task.inRaw;

      // console.log('_doc: '+JSON.stringify(_doc));
      // console.log('task3: '+JSON.stringify(task.doc));
      // console.log(Array.isArray(task.doc));

      if (Array.isArray(task.doc)) {
        for (var j = 0; j < task.doc.length; j++) {
          if (task.doc[j].시도명 == _doc.시도명) {
            var same;
            break;
          }
        }
        if (typeof same == undefined) {
          task.doc.push(_doc)
        }
      } else if (task.doc && task.doc.시도명 != _doc.시도명) {
        task.doc = [task.doc, _doc];
      }
      else {
        task.doc = utils.clone(_doc);
      }
    } else if (시군구) {
      console.log('시군구는 바로'+ 시군구);
      var _doc = {
        시군구명: 시군구
      };

      _doc.지번주소 = 시군구 + ' ';

      _doc.in = task.inRaw;

      // console.log('_doc: '+JSON.stringify(_doc));
      // console.log('task3: '+JSON.stringify(task.doc));
      // console.log(Array.isArray(task.doc));

      if (Array.isArray(task.doc)) {
        for (var j = 0; j < task.doc.length; j++) {
          if (task.doc[j].시도명 == _doc.시도명) {
            var same;
            break;
          }
        }
        if (typeof same == undefined) {
          task.doc.push(_doc)
        }
      } else if (task.doc && task.doc.시도명 != _doc.시도명) {
        task.doc = [task.doc, _doc];
      }
      else {
        task.doc = utils.clone(_doc);
      }
    }
  callback(task,context);
  }
}

exports.searchAddress2 = searchAddress2;

const ADDRESS_KEY = 'U01TX0FVVEgyMDE2MDgyODEwMjEyMDE0ODU1';
exports.ADDRESS_KEY = ADDRESS_KEY;

function addressGovTypeCheck(text, type, task, context, callback) {
  var userTokens = text.split(' ');
  var tmpTokens = utils.clone(userTokens);
  var addrPart, addrDetail;
  for(var i = tmpTokens.length - 1; i >= 0; i--) {
    if(tmpTokens[i].endsWith('길') || tmpTokens[i].endsWith('로')) {
      addrPart = tmpTokens.splice(0, i+2).join(' ');
      addrDetail = tmpTokens.join(' ');
      break;
    } else if(tmpTokens[i].search(/^[^\d].*동$/g) != -1 || userTokens[i].endsWith('리')) {
      addrPart = tmpTokens.splice(0, i+2).join(' ');
      addrDetail = tmpTokens.join(' ');
      break;
    }
  }

  task.addressOrg = {};
  task.addressOrg.address = text;
  task.addressOrg.addrTokens = userTokens;
  task.addressOrg.addrPart = addrPart;
  task.addressOrg.addrDetail = addrDetail;
  task.addressOrg.detailToken = tmpTokens;

  if(!addrPart) {
    type.message = context.global.messages.typeAddress;
    return;
  }

  var http = require('./http');
  var httpTask = {
    action: 'xml',
    url: 'http://www.juso.go.kr',
    path: '/addrlink/addrLinkApi.do',
    param: {confmKey: ADDRESS_KEY, currentPage: 1, countPerPage: 30, keyword: addrPart}
  };

  http.execute(httpTask, context, function(_task, context) {
    if(_task.doc.results.common.totalCount == 0) {
      type.message = context.global.messages.typeAddressCheck1;
    } else {
      var addr;
      if(_task.doc.results.juso instanceof Array) {
        addr = _task.doc.results.juso[0];
      } else {
        addr = _task.doc.results.juso;
      }

      task.address = {};
      task.addressJibun = {};

      task.address.address = addr.roadAddr;
      task.address.roadAddrPart1 = addr.roadAddrPart1;
      task.address.roadAddrPart2 = addr.roadAddrPart2;
      task.address.zipNo = addr.zipNo;

      task.addressJibun.address = addr.jibunAddr;
      task.addressJibun.zipNo = addr.zipNo;

      var jusoToken = addr.jibunAddr.split(' ');
      var roadToken = addr.roadAddrPart1.split(' ');
      if(jusoToken[0].endsWith('시')) {
        task.addressJibun.sido = jusoToken[0];
        task.addressJibun.sigungu = jusoToken[1];
        task.addressJibun.dong = jusoToken[2];
        task.addressJibun.bungi = jusoToken[4];
        task.addressJibun.building = jusoToken[5];

        task.address.sido = roadToken[0];
        task.address.sigungu = roadToken[1];
        task.address.road = roadToken[2];
        task.address.roadNum = roadToken[3];
      } else {
        if (jusoToken[1].endsWith('시')) {
          task.addressJibun.sido = jusoToken[0];
          // 현재 도로명주소 API 비정상으로 나오고 있음
          // task.addressJibun.sigungu = jusoToken[1] + ' ' + jusoToken[2];
          // task.addressJibun.dong = jusoToken[3];
          task.addressJibun.sigungu = jusoToken[1];
          task.addressJibun.dong = jusoToken[2];
          task.addressJibun.bungi = jusoToken[4];
          task.addressJibun.building = jusoToken[5];

          task.address.sido = roadToken[0];
          task.address.sigungu = roadToken[1];
          task.address.road = roadToken[2];
          task.address.roadNum = roadToken[3];

        } else if (jusoToken[1].endsWith('군')) {
          task.addressJibun.sido = jusoToken[0];
          task.addressJibun.sigungu = jusoToken[1];
          task.addressJibun.dong = jusoToken[2];
          task.addressJibun.bungi = jusoToken[4];
          task.addressJibun.building = jusoToken[5];

          task.address.sido = roadToken[0];
          task.address.sigungu = roadToken[1];
          task.address.road = roadToken[2];
          task.address.roadNum = roadToken[3];
        }
      }

      for(var i = 0; i < tmpTokens.length; i++) {
        if(task.addressJibun.address.indexOf(tmpTokens[i]) == -1) {
          task.addressJibun.detail = tmpTokens.slice(i).join(' ');
          task.addressJibun.address += ' ' + task.addressJibun.detail;
          break;
        }
      }

      // 주소 API 에서 동이 안나오는 오류 임시 처리

      var sigu = task.addressJibun.sigungu.split(' ');
      if(sigu.length == 1 && sigu[0].endsWith('시')) {
        for(var i = 0; i < userTokens.length; i++) {
          if(userTokens[i].search(/^[^\d].*구$/g) != -1) {
            task.addressJibun.sigungu += ' ' + userTokens[i];
            break;
          }
        }
      }

      task.address.detail = task.addressJibun.detail;
      task.address.address = addr.roadAddrPart1 + ', ' + task.address.detail + addr.roadAddrPart2;

      console.log(JSON.stringify(task.address));
      console.log(JSON.stringify(task.addressJibun));

      callback(text, task, true);
    }
  });
}

exports.addressGovTypeCheck = addressGovTypeCheck;

function insertTest(task, context, callback) {
  task.updateMethod = 'insert';
  task.modelName = '건물정보';
  task.schema = 건물정보스키마;
  task.pk = ['건물관리번호'];
  task.dir = ADDRESS_DIR;
  task.fileFilter = function(file) { return file.startsWith('build'); };

  updateAddressDir(task, context, function(_task, _context) {
    callback(task, context);
  });

}

exports.insertTest = insertTest;

//TODO 도로명주소, 위치정보요약위치정보요약 인덱스 생성하다 오류

function insertAddress(task, context, callback) {
  async.waterfall([
    function(cb) {
      task.updateMethod = 'insert';
      task.modelName = '개선도로명코드';
      task.schema = 개선도로명코드스키마;
      task.pk = ['도로명코드', '읍면동일련번호'];
      task.dir = ADDRESS_MATCH_DIR;
      task.fileFilter = function(file) { return file.startsWith('개선_도로명코드'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '도로명주소';
      task.schema = 도로명주소스키마;
      task.pk = ['관리번호', '도로명코드', '읍면동일련번호'];
      task.dir = ADDRESS_MATCH_DIR;
      task.fileFilter = function(file) { return file.startsWith('주소'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '지번주소';
      task.schema = 지번주소스키마;
      task.pk = ['관리번호', '일련번호'];
      task.dir = ADDRESS_MATCH_DIR;
      task.fileFilter = function(file) { return file.startsWith('지번'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '부가정보';
      task.schema = 부가정보스키마;
      task.pk = ['관리번호'];
      task.dir = ADDRESS_MATCH_DIR;
      task.fileFilter = function(file) { return file.startsWith('부가정보'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '위치정보요약';
      task.schema = 위치정보요약스키마;
      task.pk = ['시도명', '시군구명', '읍면동명', '도로명', '지하여부', '건물본번', '건물부번'];
      task.dir = ADDRESS_SPACE_DIR;
      task.fileFilter = function(file) { return file.startsWith('entrc'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function (cb) {
      task.modelName = '도로명코드';
      task.schema = 도로명코드스키마;
      task.pk = ['시군구코드', '도로명번호', '읍면동일련번호'];
      task.dir = ADDRESS_DIR;
      task.fileFilter = function(file) { return file.startsWith('road_code'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '건물정보';
      task.schema = 건물정보스키마;
      task.pk = ['건물관리번호'];
      task.dir = ADDRESS_DIR;
      task.fileFilter = function(file) { return file.startsWith('build'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '관련지번';
      task.schema = 관련지번스키마;
      task.pk = ['도로명코드', '지하여부', '건물본번', '건물부번', '지번일련번호'];
      task.dir = ADDRESS_DIR;
      task.fileFilter = function(file) { return file.startsWith('jibun'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    }


  ], function(err) {
    callback(task, context);
  })
};

exports.insertAddress = insertAddress;


function updateAddressDir(task, context, callback) {
  var files;
  try {
    files = fs.readdirSync(task.dir);
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if(file != file.normalize('NFC')) {
        files[i] = file.normalize('NFC');
      }
    }
    files = files.filter(task.fileFilter);
  } catch(e) {
      logger.info(task.modelName + ' ' + task.dir + ' 경로 없음');
      callback(task, context);
      return;
  }

  logger.info(task.modelName + ' 업데이트 시작');

  async.eachSeries(files, function(file, cb) {
    task.file = task.dir + file;

    updateAddressFile(task, context, function() {
      cb(null);
    });
  }, function(err) {
    logger.info(task.modelName + ' 업데이트 완료');
    callback(task, context);
  });
};

exports.updateAddressDir = updateAddressDir;


function updateAddressFile(task, context, callback) {
  var model = mongo.getModel(task.modelName, task.schema);

  if(task.updateMethod == 'insert') {
    var lineByLine = require('n-readlines');
    var liner = new lineByLine(task.file);

    var count = 0;
    var line;
    async.whilst(
      function() { return line = liner.next(); },
      function(cb) {
        var lines = [];
        do {
          line = utils.convertEncoding('euc-kr', 'UTF-8', line);
          lines.push(line);
        } while(lines.length < 10000 && (line = liner.next()));

        var updates = [];
        for (var i = 0; i < lines.length; i++) {
          var _line = lines[i];
          var val = _line.split('|');
          var update = {};

          var j = 0;
          for (var key in task.schema) {
            if(j >= val.length) break;
            update[key] = val[j++];
          }

          updates.push(update);
        }

        model.collection.insert(updates, function(err, docs) {
          if(err) {
            logger.info('updateAddressFile: ' + err + ' ' + task.file);
          } else {
            count += docs.result.n;
            logger.info('updateAddressFile: ' + count + ' ' + task.file);
          }

          lines = null;
          updates = null;
          cb(null);

        });
      },
      function(err) {
        logger.info(task.modelName + ' 업데이트: ' + count + ' ' + task.file);
        callback(task, context);
      }
    );

  } else {
    // 너무 큰파일은 안됨 200M
    var text = fs.readFileSync(task.file);
    text =utils.convertEncoding('euc-kr', 'UTF-8', text);

    var count = 0;
    var lines = text.split('|');
    async.eachSeries(lines, function(line,cb) {
      var val = line.split('|');
      var update = {};

      var i = 0;
      for (var key in task.schema) {
        if(i >= val.length) break;
        update[key] = val[i++];
      }

      var query = {};
      for (var j = 0; j < task.pk.length; j++) {
        var pk = task.pk[j];
        query[pk] = update[pk];
      }

      if(task.updateMethod == 'create') {
        model.create(update, function(err){
          count++;
          if(count % 1000 == 0) logger.info('updateAddressFile: ' + count + ' ' + task.file);
          cb(null);
        });
      } else {
        model.update(query, update, {upsert: true}, function(err, num){
          count++;
          if(count % 1000 == 0) logger.info('updateAddressFile: ' + count + ' ' + task.file);
          cb(null);
        });
      }
    },
    function(err) {
      text = null;
      lines = null;
      logger.info(task.modelName + ' 업데이트: ' + count + ' ' + task.file);
      callback(task, context);
    });
  }
}

exports.updateAddressFile = updateAddressFile;

var 도로명코드스키마 = {
  시군구코드: String,
  도로명번호: String,
  도로명: String,
  도로명로마자: String,
  읍면동일련번호: String,
  시도명: String,
  시군구명: String,
  읍면구분: String,
  읍면동코드: String,
  읍면동명: String,
  상위도로명번호: String,
  상위도로명: String,
  사용여부: String,
  변경사유: String,
  변경이력정보: String,
  시도명로마자: String,
  시군구명로마자: String,
  읍면동명로마자: String,
  고시일자: String,
  말소일자: String
};

var 건물정보스키마 = {
  법정동코드: String,
  시도명: String,
  시군구명: String,
  법정읍면동명: String,
  법정리명: String,
  산여부: String,
  지번본번: String,
  지번부번: String,
  도로명코드: String,
  도로명: String,
  지하여부: String,
  건물본번: String,
  건물부번: String,
  건축물대장건물명: String,
  상세건물명: String,
  건물관리번호: String,
  읍면동일련번호: String,
  행정동코드: String,
  행정동명: String,
  우편번호: String,
  우편일련번호: String,
  다량배달처명: String,
  이동사유코드: String,
  고시일자: String,
  변경전도로명주소: String,
  시군구용건물명: String,
  공동주택여부: String,
  기초구역번호: String,
  상세주소부여여부: String,
  비고1: String,
  비고2: String
};

var 관련지번스키마 = {
  법정동코드: String,
  시도명: String,
  시군구명: String,
  법정읍면동명: String,
  법정리명: String,
  산여부: String,
  지번본번: String,
  지번부번: String,
  도로명코드: String,
  지하여부: String,
  건물본번: String,
  건물부번: String,
  지번일련번호: String,
  이동사유코드: String
};

var 개선도로명코드스키마 = {
  도로명코드: String,
  도로명: String,
  도로명로마자: String,
  읍면동일련번호: String,
  시도명: String,
  시도로마자: String,
  시군구명: String,
  시군구로마자: String,
  읍면동명: String,
  읍면동로마자: String,
  읍면동구분: String,
  읍면동코드: String,
  사용여부: String,
  변경사유: String,
  변경이력정보: String,
  고시일자: String,
  말소일자: String
};

var 도로명주소스키마 = {
  관리번호: String,
  도로명코드: String,
  읍면동일련번호: String,
  지하여부: String,
  건물본번: String,
  건물부번: String,
  기초구역번호: String,
  변경사유코드: String,
  고시일자: String,
  변경전도로명주소: String,
  상세주소부여여부: String
};

var 지번주소스키마 = {
  관리번호: String,
  일련번호: String,
  법정동코드: String,
  시도명: String,
  시군구명: String,
  법정읍면동명: String,
  법정리명: String,
  산여부: String,
  지번본번: String,
  지번부번: String,
  대표여부: String
};

var 부가정보스키마 = {
  관리번호: String,
  행정동코드: String,
  행정동명: String,
  우편번호: String,
  우편번호일련번호: String,
  다량배달처명: String,
  건축물대장건물명: String,
  시군구건물명: String,
  공동주택여부: String
};

var 위치정보요약스키마 = {
  시군구코드: String,
  출입구일련번호: String,
  법정동코드: String,
  시도명: String,
  시군구명: String,
  읍면동명: String,
  도로명코드: String,
  도로명: String,
  지하여부: String,
  건물본번: String,
  건물부번: String,
  건물명: String,
  우편번호: String,
  건물용도분류: String,
  건물군여부: String,
  관할행정동: String,
  X좌표: String,
  Y좌표: String,
  이동사유코드: String
};


function addressTestOne(task, context, callback) {
  var address = {};
  address.inRaw = '경기 가평군 상면 임초리 417-4';
  searchAddress(address, context, function() {
    if(address.doc == undefined) {
      logger.debug('nodata: ' + address.inRaw);
    } else if(Array.isArray(address.doc)) {
      for (var i = 0; i < address.doc.length; i++) {
        logger.debug('multi: ' + address.inRaw + ' / ' + address.doc[i].지번주소 + ' / ' + address.doc[i].도로명주소);
      }
    } else if(address.doc) {
      // logger.debug(address.inRaw + ' / ' + address.doc.지번주소 + ' / ' + address.doc.도로명주소);
    }

    callback(task, context);
  });

}

exports.addressTestOne = addressTestOne;

function searchTest(task, context, callback) {
  async.waterfall([
    function(cb) {
      task.inRaw = '서울 강남구 청담동 35-47';
      searchAddress(task, context, function(task, context) {

        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '청담동 35-47';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '서울 강남구 삼성로135길 47';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '삼성로135길 47';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '한신오페라하우스 101동 502호';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '경기도 부천시 원미구 중동 1106 103-3302';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '경기도 부천시 중동 1106 위브더스테이트 103동 3302호';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '경기 부천시 원미구 중2동 1106 위브더스테이트 103-3302';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '중동 1106 130-3302';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '부천시 신흥로 190, 103-3302 (중동, 위브더스테이트)';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '디지털로9길 68';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '디지털로 9길 68';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '서울 금천구 디지털로9길 68, 1006호 (가산동, 대륭포스트타워5차)';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '대륭포스트타워 5차 1606호';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '대륭포스트타워5차';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '서울 금천구 가산동 60-3 대륭포스트타워 5차 1606';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '가산동 60-3 1606';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '전라북도 정읍시 소성면 소성로 100';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '소성로 100';
      searchAddress(task, context, function() {
        cb(null);
      });
    },
    function(cb) {
      task.inRaw = '전라북도 정읍시 소성면 보화리 106-12 희망주유소';
      searchAddress(task, context, function() {
        cb(null);
      });
    }
  ], function(err) {
    callback(task, context);
  });
}

exports.searchTest = searchTest;


// insertTest({}, {}, function(t, c) {
//   console.log('end');
// });

function 시도명변경(str) {
  if (str == '경기') return'경기도';
  else if (str == '강원') return'강원도';
  else if (str == '충북') return'충청북도';
  else if (str == '충남') return'충청남도';
  else if (str == '전북') return'전라북도';
  else if (str == '전남') return'전라남도';
  else if (str == '경북') return'경상북도';
  else if (str == '경남') return'경상남도';
  else if (str == '제주') return'제주특별자치도';
  else if (str == '제주도') return'제주특별자치도';
  else if (str == '서울') return'서울특별시';
  else if (str == '서울시') return'서울특별시';
  else if (str == '인천') return'인천광역시';
  else if (str == '인천시') return'인천광역시';
  else if (str == '대전') return'대전광역시';
  else if (str == '대전시') return'대전광역시';
  else if (str == '대구') return'대구광역시';
  else if (str == '대구시') return'대구광역시';
  else if (str == '광주') return'광주광역시';
  else if (str == '광주시') return'광주광역시';
  else if (str == '부산') return'부산광역시';
  else if (str == '부산시') return'부산광역시';
  else if (str == '울산') return'울산광역시';
  else if (str == '울산시') return'울산광역시';
  else if (str == '세종') return'세종특별자치시';
  else if (str == '세종시') return'세종특별자치시';
  else return str;
}

exports.시도명변경 = 시도명변경;


function 시도명역변경(str) {
  if (str == '경기도') return '경기';
  else if (str == '강원도') return '강원';
  else if (str == '충청북도') return '충북';
  else if (str == '충청남도') return '충남';
  else if (str == '전라북도') return '전북';
  else if (str == '전라남도') return '전남';
  else if (str == '경상북도') return '경북';
  else if (str == '경상남도') return '경남';
  else if (str == '제주특별자치도') return '제주';
  else if (str == '서울특별시') return '서울';
  else if (str == '인천광역시') return '인천';
  else if (str == '대전광역시') return '대전';
  else if (str == '대구광역시') return '대구';
  else if (str == '광주광역시') return '광주';
  else if (str == '부산광역시') return '부산';
  else if (str == '울산광역시') return '울산';
  else if (str == '세종특별자치시') return '세종';
  else return str;
}

exports.시도명역변경 = 시도명역변경;

function naverGeocode(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
  if (task.address.지번주소) {
    var query = {query: task.address.지번주소};
  } else {
    var query = {query: context.dialog.address};
  }
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

function naverReverseGeocode(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};

  var query = {query: task.lng+','+task.lat};
  var request = require('request');

  request({
    url: 'https://openapi.naver.com/v1/map/reversegeocode?encoding=utf-8&coord=latlng&output=json',
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
      task.address=doc.result.items[0].address;
      console.log('address: ' + task.address);
    }
    callback(task, context);
  });
}

exports.naverReverseGeocode = naverReverseGeocode;


function getDistanceFromGeocode(lat1,lng1,lat2,lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

exports.getDistanceFromGeocode = getDistanceFromGeocode;


function naverGeoSearch(task, context, callback) {
  // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
  // console.log('naverGeoSearch');

  var query = {query: task.query};
  var request = require('request');

  // console.log('naverGeoSearch: query=' + task.query);

  request({
    url: 'https://openapi.naver.com/v1/search/local.json?&display=10&start=1&sort=random',
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
      task.doc = doc.items;
      console.log('naverGeoSearch: doc=' + body);
    }
    callback(task, context);
  });
}

exports.naverGeoSearch = naverGeoSearch;

function daumgeoCode(task, context, callback) {
  var request = require('request');
  var query = {q: context.dialog.item.address, output: "json"};
  request({
    url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
    method: 'GET',
    qs: query
  }, function(error,response, body) {
    if(!error && response.statusCode == 200) {
      // console.log(body);
      var doc = JSON.parse(body);
      context.dialog.lng = doc.channel.item[0].lng;
      context.dialog.lat = doc.channel.item[0].lat;

    }
    callback(task,context);
  });
}

exports.daumgeoCode = daumgeoCode;
