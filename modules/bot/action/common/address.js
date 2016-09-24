var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo.js'));
var fs = require('fs');
var async = require('async');
var logger = require(path.resolve('./config/lib/logger'));

function insertAddress(task, context, callback) {
  async.waterfall([
    function (cb) {
      task.modelName = '도로명코드';
      task.schema = 도로명코드스키마;
      task.pk = ['시군구코드', '도로명번호', '읍면동일련번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608전체주소(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('road_code'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '건물정보';
      task.schema = 건물정보스키마;
      task.pk = ['건물관리번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608전체주소(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('build'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '관련지번';
      task.schema = 관련지번스키마;
      task.pk = ['도로명코드', '지하여부', '건물본번', '건물부번', '지번일련번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608전체주소(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('jibun'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '개선도로명코드';
      task.schema = 개선도로명코드스키마;
      task.pk = ['도로명코드', '읍면동일련번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608매칭데이터(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('개선_도로명코드'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '도로명주소';
      task.schema = 도로명주소스키마;
      task.pk = ['관리번호', '도로명코드', '읍면동일련번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608매칭데이터(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('주소'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '지번주소';
      task.schema = 지번주소스키마;
      task.pk = ['관리번호', '일련번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608매칭데이터(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('지번'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '부가정보';
      task.schema = 부가정보스키마;
      task.pk = ['관리번호'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/201608매칭데이터(도로명코드)_전체분/';
      task.fileFilter = function(file) { return file.startsWith('부가정보'); };

      updateAddressDir(task, context, function(_task, _context) {
        cb(null);
      });
    },

    function(cb) {
      task.modelName = '위치정보요약';
      task.schema = 위치정보요약스키마;
      task.pk = ['시도명', '시군구명', '읍면동명', '도로명', '지하여부', '건물본번', '건물부번'];
      task.dir = '/Users/com2best/Documents/MoneyBrain/Dev/외부모듈/주소/공간정보요약DB_8월분/';
      task.fileFilter = function(file) { return file.startsWith('entrc'); };

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
  var files = fs.readdirSync(task.dir);
  files = files.filter(task.fileFilter);

  logger.info(task.modelName + ' 업데이트 시작');

  async.eachSeries(files, function(file, cb) {
    task.file = task.dir + file;

    updateAddressFile(task, context, function() {
      logger.info(task.modelName + ' 업데이트: ' + task.file);
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

  var text = fs.readFileSync(task.file);

  var encoding = 'euc-kr';
  var Iconv  = require('iconv').Iconv;
  var iconv = new Iconv(encoding.toUpperCase(), 'UTF-8//TRANSLIT//IGNORE');
  text = iconv.convert(new Buffer(text, 'binary')).toString('UTF-8');

  var lines = text.split('\n');

  async.eachSeries(lines, function(line, cb) {
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

    model.update(query, update, {upsert: true}, function(err, num){
      cb(null);
    });
  }, function(err) {
    callback(task, context);
  });
};

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
  지번본번: Number,
  지번부번: Number,
  도로명코드: String,
  도로명: String,
  지하여부: String,
  건물본번: Number,
  건물부번: Number,
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
  지번본번: Number,
  지번부번: Number,
  도로명코드: String,
  지하여부: String,
  건물본번: Number,
  건물부번: Number,
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
  건물본번: Number,
  건물부번: Number,
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
  지번본번: Number,
  지번부번: Number,
  대표여부: Number
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

var 위치정보요약 = {
  시군구코드: String,
  출입구일련번호: String,
  법정동코드: String,
  시도명: String,
  시군구명: String,
  읍면동명: String,
  도로명코드: String,
  도로명: String,
  지하여부: String,
  건물본번: Number,
  건물부번: Number,
  건물명: String,
  우편번호: String,
  건물용도분류: String,
  건물군여부: String,
  관할행정동: String,
  X좌표: Number,
  Y좌표: Number,
  이동사유코드: String
};


