var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var async = require('async');
var mongoose = require('mongoose');
var XLSX = require('xlsx');
var utils = require(path.resolve('./modules/bot/action/common/utils'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('order');

exports.dumpFolder = function(task, context, successCallback, errorCallback) {
  // var fs = require('fs');
  // var _dir = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 치킨업계/치킨 프랜차이즈 매장';
  // var _files;
  //
  // function getFiles (dir, files_){
  //   files_ = files_ || [];
  //   var files = fs.readdirSync(dir);
  //   for (var i in files){
  //     var name = dir + '/' + files[i];
  //     if (fs.statSync(name).isDirectory()){
  //       getFiles(name, files_);
  //     } else {
  //       files_.push(name);
  //     }
  //   }
  //   return files_;
  // }
  //
  // _files = getFiles(_dir, _files);


  async.waterfall([
    // 치킨 프랜차이즈
    // function(cb) {
    //   task.category = ['치킨', '프랜차이즈'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 치킨업계/치킨 프랜차이즈 매장/★전국 치킨 프랜차이즈 매장_13176건.xls';
    //
    //   task.sheetName = 'Sheet1';
    //   task.franchiseLabel = '프랜차이즈명 ';
    //   task.nameLabel = '매장명 ';
    //   task.postLabel = '새우편번호';
    //   task.addrLabel = '주소';
    //   task.addrTypeLabel = '도로명';
    //   task.phoneLabel = '전화번호';
    //
    //   dumpRestaurant(task, context, function(_task, _context) {
    //     cb(null);
    //   });
    // },

    // // 치킨 일반
    // function(cb) {
    //   task.category = ['치킨'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 치킨업계/1.치킨 닭강정 매장_21689건.xls';
    //
    //   task.sheetName = '한국콘텐츠미디어';
    //   task.franchiseLabel = undefined;
    //   task.nameLabel = '상호명';
    //   task.postLabel = '새우편번호';
    //   task.addrLabel = '주소 (소재지)';
    //   task.addrTypeLabel = '도로명 주소';
    //   task.phoneLabel = '전화번호';
    //
    //   dumpRestaurant(task, context, function(_task, _context) {
    //     cb(null);
    //   });
    // },

    // // 피자
    // function(cb) {
    //   task.category = ['피자'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 전국 피자가게/★전국 피자가게 주소록_13888건(전체).xls';
    //
    //   var sheetName = task.sheetName = '피자';
    //   var franchiseLabel = task.franchiseLabel = '프랜차이즈';
    //   var nameLabel = task.nameLabel = '상호명';
    //   var postLabel = task.postLabel = '새우편번호';
    //   var addrLabel = task.addrLabel = '주소(도로명)';
    //   var addr2Label = task.addr2Label = '주소(지번)';
    //   // task.addrTypeLabel = '도로명 주소';
    //   var phoneLabel = task.phoneLabel = '전화번호';
    //   var category2 = '업종2';
    //
    //   var workbook = XLSX.readFile(task.path);
    //   var worksheet = workbook.Sheets[sheetName];
    //
    //   var data = XLSX.utils.sheet_to_json(worksheet);
    //   var model = mongoose.model('Restaurant');
    //   var options =  {upsert: true};
    //
    //   var i = 0;
    //   async.eachSeries(data, function(_doc, callback) {
    //     i++;
    //
    //     _doc[addrLabel] = _doc[addrLabel] || '';
    //     _doc[addr2Label] = _doc[addr2Label] || '';
    //
    //     var _phone = _doc[phoneLabel];
    //     if(_doc[phoneLabel] !== undefined && _doc[phoneLabel] != '') {
    //       _phone = _phone.replace(/\(/gi, '');
    //       _phone = _phone.replace(/\)/gi, '-');
    //     }
    //
    //     var _category = utils.clone(task.category);
    //
    //     var _query = {
    //       name: _doc[nameLabel], address: _doc[addrLabel], address2: _doc[addr2Label]
    //     };
    //
    //     var _update = {
    //       name: _doc[nameLabel],
    //       category: _category,
    //       post: _doc[postLabel],
    //       address: _doc[addrLabel],
    //       address2: _doc[addr2Label],
    //       phone: _phone,
    //       homepage: null,
    //       photo: null,
    //       description: null,
    //       tag: null,
    //
    //       isOpen: false,
    //       minOrder: 0,
    //       payment: null,
    //       businessHours: null,
    //       updated: null,
    //       created: null,
    //       user: null
    //     };
    //
    //     if(_doc[franchiseLabel] != undefined) _update.category.push('프랜차이즈');
    //     if(_doc[category2]) {
    //       if(_doc[category2].search('/이탈리아|파스타/g') != -1) _update.category.push('이탈리아식');
    //       if(_doc[category2].search('/패밀리레스토랑/g') != -1) _update.category.push('패밀리레스토랑');
    //       if(_doc[category2].search('/치킨/g') != -1) _update.category.push('치킨');
    //       if(_doc[category2].search('/퓨전/g') != -1) _update.category.push('퓨전');
    //       if(_doc[category2].search('/야식/g') != -1) _update.category.push('야식');
    //     }
    //
    //     model.find(_query, function(err, docs) {
    //
    //       if(docs == undefined || docs.length == 0) {
    //
    //         model.update(_query, _update, options, function(err2) {
    //           logger.debug('i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //             _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //           callback(null);
    //         });
    //       } else {
    //         // logger.debug('EXIST: ' + _doc[nameLabel] + ',' + _doc[addrLabel] + ',' + _doc[addr2Label]);
    //
    //         var doc = docs[0];
    //         _update.category = utils.clone(doc.category);
    //         for(var k = 0; k < _category.length; k++) {
    //           var bExist = false;
    //           for(var j = 0; j < doc.category.length; j++) {
    //             if(doc.category[j] == _category[k]) {
    //               bExist = true;
    //               break;
    //             }
    //           }
    //
    //           if(!bExist) _update.category.push(_category[k]);
    //         }
    //
    //         model.update(_query, _update, options, function(err2) {
    //           logger.debug('EXIST i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //             _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //           callback(null);
    //         });
    //       }
    //     });
    //   },
    //   function(err) {
    //     cb(null);
    //   });
    //
    // },

    // function(cb) {
    //   task.category = ['중국집'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 전국 음식점 정보/3.중식_21000건/중식당_21762건.xls';
    //
    //   var sheetName = task.sheetName = '전국 음식점 정보';
    //   var franchiseLabel = task.franchiseLabel = undefined;
    //   var nameLabel = task.nameLabel = '상호명';
    //   var postLabel = task.postLabel = '새우편번호';
    //   var addrLabel = task.addrLabel = '주소(도로명)';
    //   var addr2Label = task.addr2Label = '주소(지번)';
    //   // task.addrTypeLabel = '도로명 주소';
    //   var phoneLabel = task.phoneLabel = '전화번호';
    //
    //   var workbook = XLSX.readFile(task.path);
    //   var worksheet = workbook.Sheets[sheetName];
    //
    //   var data = XLSX.utils.sheet_to_json(worksheet);
    //   var model = mongoose.model('Restaurant');
    //   var options =  {upsert: true};
    //
    //   var i = 0;
    //   async.eachSeries(data, function(_doc, callback) {
    //     i++;
    //
    //     _doc[addrLabel] = _doc[addrLabel] || '';
    //     _doc[addr2Label] = _doc[addr2Label] || '';
    //
    //     var _phone = _doc[phoneLabel];
    //     if(_doc[phoneLabel] !== undefined && _doc[phoneLabel] != '') {
    //       _phone = _phone.replace(/\(/gi, '');
    //       _phone = _phone.replace(/\)/gi, '-');
    //     }
    //
    //     var _category = utils.clone(task.category);
    //
    //     var _query = {
    //       name: _doc[nameLabel], address: _doc[addrLabel], address2: _doc[addr2Label]
    //     };
    //
    //     var _update = {
    //       name: _doc[nameLabel],
    //       category: _category,
    //       post: _doc[postLabel],
    //       address: _doc[addrLabel],
    //       address2: _doc[addr2Label],
    //       phone: _phone,
    //       homepage: null,
    //       photo: null,
    //       description: null,
    //       tag: null,
    //
    //       isOpen: false,
    //       minOrder: 0,
    //       payment: null,
    //       businessHours: null,
    //       updated: null,
    //       created: null,
    //       user: null
    //     };
    //
    //     model.find(_query, function(err, docs) {
    //
    //       if(docs == undefined || docs.length == 0) {
    //
    //         model.update(_query, _update, options, function(err2) {
    //           logger.debug('i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //             _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //           callback(null);
    //         });
    //       } else {
    //         // logger.debug('EXIST: ' + _doc[nameLabel] + ',' + _doc[addrLabel] + ',' + _doc[addr2Label]);
    //
    //         var doc = docs[0];
    //         _update.category = utils.clone(doc.category);
    //         for(var k = 0; k < _category.length; k++) {
    //           var bExist = false;
    //           for(var j = 0; j < doc.category.length; j++) {
    //             if(doc.category[j] == _category[k]) {
    //               bExist = true;
    //               break;
    //             }
    //           }
    //
    //           if(!bExist) _update.category.push(_category[k]);
    //         }
    //
    //         model.update(_query, _update, options, function(err2) {
    //           logger.debug('EXIST i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //             _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //           callback(null);
    //         });
    //       }
    //     });
    //   },
    //   function(err) {
    //     cb(null);
    //   });
    // }

    // 족발
    // function(cb) {
    //   task.category = ['족발', '보쌈'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 전국 음식점 정보/1.한식_170000건/육류/족발_12351건.xls';
    //
    //   var sheetName = task.sheetName = '전국 음식점 정보';
    //   var franchiseLabel = task.franchiseLabel = '프랜차이즈';
    //   var nameLabel = task.nameLabel = '상호명';
    //   var postLabel = task.postLabel = '새우편번호';
    //   var addrLabel = task.addrLabel = '주소(도로명)';
    //   var addr2Label = task.addr2Label = '주소(지번)';
    //   // task.addrTypeLabel = '도로명 주소';
    //   var phoneLabel = task.phoneLabel = '전화번호';
    //   var category2 = '업종2';
    //
    //   var workbook = XLSX.readFile(task.path);
    //   var worksheet = workbook.Sheets[sheetName];
    //
    //   var data = XLSX.utils.sheet_to_json(worksheet);
    //   var model = mongoose.model('Restaurant');
    //   var options =  {upsert: true};
    //
    //   var i = 0;
    //   async.eachSeries(data, function(_doc, callback) {
    //       i++;
    //
    //       _doc[addrLabel] = _doc[addrLabel] || '';
    //       _doc[addr2Label] = _doc[addr2Label] || '';
    //
    //       var _phone = _doc[phoneLabel];
    //       if(_doc[phoneLabel] !== undefined && _doc[phoneLabel] != '') {
    //         _phone = _phone.replace(/\(/gi, '');
    //         _phone = _phone.replace(/\)/gi, '-');
    //       }
    //
    //       var _category = utils.clone(task.category);
    //
    //       var _query = {
    //         name: _doc[nameLabel], address: _doc[addrLabel], address2: _doc[addr2Label]
    //       };
    //
    //       var _update = {
    //         name: _doc[nameLabel],
    //         category: _category,
    //         post: _doc[postLabel],
    //         address: _doc[addrLabel],
    //         address2: _doc[addr2Label],
    //         phone: _phone,
    //         homepage: null,
    //         photo: null,
    //         description: null,
    //         tag: null,
    //
    //         isOpen: false,
    //         minOrder: 0,
    //         payment: null,
    //         businessHours: null,
    //         updated: null,
    //         created: null,
    //         user: null
    //       };
    //
    //       // if(_doc[franchiseLabel] != undefined) _update.category.push('프랜차이즈');
    //       // if(_doc[category2]) {
    //       //   if(_doc[category2].search('/이탈리아|파스타/g') != -1) _update.category.push('이탈리아식');
    //       //   if(_doc[category2].search('/패밀리레스토랑/g') != -1) _update.category.push('패밀리레스토랑');
    //       //   if(_doc[category2].search('/치킨/g') != -1) _update.category.push('치킨');
    //       //   if(_doc[category2].search('/퓨전/g') != -1) _update.category.push('퓨전');
    //       //   if(_doc[category2].search('/야식/g') != -1) _update.category.push('야식');
    //       // }
    //
    //       model.find(_query, function(err, docs) {
    //
    //         if(docs == undefined || docs.length == 0) {
    //
    //           model.update(_query, _update, options, function(err2) {
    //             logger.debug('i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //               _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //             callback(null);
    //           });
    //         } else {
    //           // logger.debug('EXIST: ' + _doc[nameLabel] + ',' + _doc[addrLabel] + ',' + _doc[addr2Label]);
    //
    //           var doc = docs[0];
    //           _update.category = utils.clone(doc.category);
    //           for(var k = 0; k < _category.length; k++) {
    //             var bExist = false;
    //             for(var j = 0; j < doc.category.length; j++) {
    //               if(doc.category[j] == _category[k]) {
    //                 bExist = true;
    //                 break;
    //               }
    //             }
    //
    //             if(!bExist) _update.category.push(_category[k]);
    //           }
    //
    //           model.update(_query, _update, options, function(err2) {
    //             logger.debug('EXIST i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //               _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //             callback(null);
    //           });
    //         }
    //       });
    //
    //     },
    //     function(err) {
    //       cb(null);
    //     });
    //
    // }

    // // 패스트푸드
    // function(cb) {
    //   task.category = ['패스트푸드'];
    //   task.path = '/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 전국 음식점 정보/7.패스트푸드_10000건/햄버거_4621건.xls';
    //
    //   var sheetName = task.sheetName = '전국 음식점 정보';
    //   var franchiseLabel = task.franchiseLabel = '프랜차이즈';
    //   var nameLabel = task.nameLabel = '상호명';
    //   var postLabel = task.postLabel = '새우편번호';
    //   var addrLabel = task.addrLabel = '주소(도로명)';
    //   var addr2Label = task.addr2Label = '주소(지번)';
    //   // task.addrTypeLabel = '도로명 주소';
    //   var phoneLabel = task.phoneLabel = '전화번호';
    //   var category2 = '업종2';
    //
    //   var workbook = XLSX.readFile(task.path);
    //   var worksheet = workbook.Sheets[sheetName];
    //
    //   var data = XLSX.utils.sheet_to_json(worksheet);
    //   var model = mongoose.model('Restaurant');
    //   var options =  {upsert: true};
    //
    //   var i = 0;
    //   async.eachSeries(data, function(_doc, callback) {
    //       i++;
    //
    //       if(_doc[nameLabel].startsWith('롯데리아') || _doc[nameLabel].startsWith('맥도날드')) {
    //         _doc[addrLabel] = _doc[addrLabel] || '';
    //         _doc[addr2Label] = _doc[addr2Label] || '';
    //
    //         var _phone = _doc[phoneLabel];
    //         if(_doc[phoneLabel] !== undefined && _doc[phoneLabel] != '') {
    //           _phone = _phone.replace(/\(/gi, '');
    //           _phone = _phone.replace(/\)/gi, '-');
    //         }
    //
    //         var _category = utils.clone(task.category);
    //
    //         var _query = {
    //           name: _doc[nameLabel], address: _doc[addrLabel], address2: _doc[addr2Label]
    //         };
    //
    //         var _update = {
    //           name: _doc[nameLabel],
    //           category: _category,
    //           post: _doc[postLabel],
    //           address: _doc[addrLabel],
    //           address2: _doc[addr2Label],
    //           phone: _phone,
    //           homepage: null,
    //           photo: null,
    //           description: null,
    //           tag: null,
    //
    //           isOpen: false,
    //           minOrder: 0,
    //           payment: null,
    //           businessHours: null,
    //           updated: null,
    //           created: null,
    //           user: null
    //         };
    //
    //         // if(_doc[franchiseLabel] != undefined) _update.category.push('프랜차이즈');
    //         // if(_doc[category2]) {
    //         //   if(_doc[category2].search('/이탈리아|파스타/g') != -1) _update.category.push('이탈리아식');
    //         //   if(_doc[category2].search('/패밀리레스토랑/g') != -1) _update.category.push('패밀리레스토랑');
    //         //   if(_doc[category2].search('/치킨/g') != -1) _update.category.push('치킨');
    //         //   if(_doc[category2].search('/퓨전/g') != -1) _update.category.push('퓨전');
    //         //   if(_doc[category2].search('/야식/g') != -1) _update.category.push('야식');
    //         // }
    //
    //         model.find(_query, function(err, docs) {
    //
    //           if(docs == undefined || docs.length == 0) {
    //
    //             model.update(_query, _update, options, function(err2) {
    //               logger.debug('i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //                 _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //               callback(null);
    //             });
    //           } else {
    //             // logger.debug('EXIST: ' + _doc[nameLabel] + ',' + _doc[addrLabel] + ',' + _doc[addr2Label]);
    //
    //             var doc = docs[0];
    //             _update.category = utils.clone(doc.category);
    //             for(var k = 0; k < _category.length; k++) {
    //               var bExist = false;
    //               for(var j = 0; j < doc.category.length; j++) {
    //                 if(doc.category[j] == _category[k]) {
    //                   bExist = true;
    //                   break;
    //                 }
    //               }
    //
    //               if(!bExist) _update.category.push(_category[k]);
    //             }
    //
    //             model.update(_query, _update, options, function(err2) {
    //               logger.debug('EXIST i: ' + i + ' ' + _doc[nameLabel] + ',' +
    //                 _doc[addrLabel] + ',' + _doc[addr2Label] + ',' + _doc[phoneLabel] + ',' + JSON.stringify(_update.category));
    //
    //               callback(null);
    //             });
    //           }
    //         });
    //       } else {
    //         callback(null);
    //       }
    //
    //     },
    //     function(err) {
    //       cb(null);
    //     });
    //
    // }

  ])
};



exports.dumpRestaurant = dumpRestaurant;
function dumpRestaurant(task, context, successCallback, errorCallback) {
  // var workbook = XLSX.readFile('/Users/com2best/Documents/머니브레인/개발/외부모듈/한국컨텐츠미디어_2016/2016년 치킨업계/치킨 프랜차이즈 매장/1.치킨 닭강정 매장_21689건.xls');
  logger.debug('');
  logger.debug(task.path);

  // var range = worksheet['!range'];
  // for(var R = range.s.r; R <= range.e.r; ++R) {
  //   for(var C = range.s.c; C <= range.e.c; ++C) {
  //     var cell_address = XLSX.utils.encode_cell({c:C, r:R});
  //
  //     console.log(y + "!" + cell_address + "=" + JSON.stringify(worksheet[cell_address].v));
  //   }
  // }

  var sheetName = task.sheetName;
  var franchiseLabel = task.franchiseLabel;
  var nameLabel = task.nameLabel;
  var postLabel = task.postLabel;
  var addrLabel = task.addrLabel;
  var addrTypeLabel = task.addrTypeLabel;
  var phoneLabel = task.phoneLabel;
  var homepageLabel = task.homepageLabel;
  var photoLabel = task.photoLabel;
  var descriptionLabel = task.descriptionLabel;
  var tagLabel = task.tagLabel;

  var workbook = XLSX.readFile(task.path);
  var worksheet = workbook.Sheets[sheetName];

  var data = XLSX.utils.sheet_to_json(worksheet);

  var model = mongoose.model('Restaurant');
  var options =  {upsert: true};

  var i = 0;
  async.eachSeries(data, function(_doc, callback){
      if(_doc == undefined) {
        logger.debug('i: ' + i + ' _doc: ' + _doc);
        callback(null);

      } else if((franchiseLabel && _doc[franchiseLabel] == undefined) || _doc[nameLabel] == undefined ||
        _doc[addrLabel] == undefined || _doc[phoneLabel] == undefined) {

        logger.debug('i: ' + i + ' ' + (_doc[franchiseLabel] ? _doc[franchiseLabel] + ' ' + _doc[nameLabel] : _doc[nameLabel]) + ',' +
          _doc[addrLabel] + ',' + _doc[phoneLabel] + ',' + _doc[addrTypeLabel]);

        if((franchiseLabel && _doc[franchiseLabel] == undefined) || _doc[nameLabel] == undefined ||
          _doc[addrLabel] == undefined || _doc[phoneLabel] == undefined)
          callback(null);

      } else {
        logger.debug('i: ' + i + ' ' + (_doc[franchiseLabel] ? _doc[franchiseLabel] + ' ' + _doc[nameLabel] : _doc[nameLabel]) + ',' +
          _doc[addrLabel] + ',' + _doc[phoneLabel] + ',' + _doc[addrTypeLabel]);

        i++;

        var query = {
          name: _doc[franchiseLabel] ? _doc[franchiseLabel] + ' ' + _doc[nameLabel] : _doc[nameLabel],
          address: (_doc[addrTypeLabel] == '○' ? _doc[addrLabel] : ''),
          address2: (_doc[addrTypeLabel] != '○' ? _doc[addrLabel]: '')
        };

        var _phone = _doc[phoneLabel];
        if(_doc[phoneLabel] !== undefined && _doc[phoneLabel] != '') {
          _phone = _phone.replace(/\(/gi, '');
          _phone = _phone.replace(/\)/gi, '-');
        }

        var _update = {
          name: _doc[franchiseLabel] ? _doc[franchiseLabel] + ' ' + _doc[nameLabel] : _doc[nameLabel],
          category: task.category,
          post: _doc[postLabel],
          address: (_doc[addrTypeLabel] == '○' ? _doc[addrLabel] : ''),
          address2: (_doc[addrTypeLabel] != '○' ? _doc[addrLabel]: ''),
          phone: _phone,
          homepage: _doc[homepageLabel],
          photo: _doc[photoLabel],
          description: _doc[descriptionLabel],
          tag: _doc[tagLabel],

          isOpen: false,
          minOrder: 0,
          payment: null,
          businessHours: null,
          updated: null,
          created: null,
          user: null
        };

        model.update(query, _update, options, function (err, numAffected) {
          // if (err) {
          //   throw err;
          // } else {
          // }

          callback(null);
        });
      }
    },
    function(err) {
      successCallback(task, context);
    });
}

exports.fssLotteriaSave2 = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/burger.asp",
      "xpath": {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        "doc": {
          title: '//p[@class="desc"]/text()',
          "soloprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[1]/label/b/text()",
          "setprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[2]/label/b/text()",
          solid: "//div[@class='cart_wrap']/div[@class='cart_left']/div[1]/input/@value",
          setid: "//div[@class='cart_wrap']/div[@class='cart_left']/div[2]/input/@value"
        }
      },

      postCallback: function (task, context, callback) {
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].sort = '버거'
        }
        callback(task, context);
      }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/pack.asp",
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        "doc": {
          title: '//p[@class="desc"]/text()',
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
          id: '//div[@class="cart_left"]/span/input/@value'
        }
      },
      postCallback: function (task, context, callback) {
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].sort = '팩'
        }
        callback(task, context);
      }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/chicken.asp",
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        "doc": {
          title: '//p[@class="desc"]/text()',
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
          id: '//div[@class="cart_left"]/span/input/@value'
        }
      },
      postCallback: function (task, context, callback) {
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].sort = '치킨'
        }
        callback(task, context);
      }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/dessert.asp",
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        "doc": {
          title: '//p[@class="desc"]/text()',
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
          id: '//div[@class="cart_left"]/span/input/@value'
        }
      },
      postCallback: function (task, context, callback) {
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].sort = '디저트'
        }
        callback(task, context);
      }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/drink.asp",
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        "doc": {
          title: '//p[@class="desc"]/text()',
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()",
          id: '//div[@class="cart_left"]/span/input/@value'
        }
      },
      postCallback: function (task, context, callback) {
        for(var i = 0; i < task.doc.length; i++) {
          task.doc[i].sort = '드링크'
        }
        callback(task, context);
      }
    },
    {
      module: 'mongo',
      action: 'update',
      setData: true,
      docMerge: 'none',
      mongo: {
        model: 'lotteriaMenu',
        schema: {
          title: 'String',
          sort: 'String',
          calories: 'String',
          price: 'String',
          id: 'String',
          soloprice: 'String',
          setprice: 'String'
        },
        query: {sort: '', title: ''},
        options: {upsert: true}
      },
      preCallback: function(task, context, callback) {
        task.doc = task.topTask.doc;
        callback(task, context);
      }

    }
  ]
};


exports.fssLotteriaSave = {
  module: 'task',
  action: 'sequence',
  actions: [
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/burger.asp",
      param: {
        a: 1798581530,
        z: 375957775,
        dl: 'https://homeservice.lotteria.com/RIA/homeservice/burger.asp'
      },
      "xpath": {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
          "soloprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[1]/label/b/text()",
          "setprice": "//div[@class='cart_wrap']/div[@class='cart_left']/div[2]/label/b/text()"
        }

      }
      // postCallback: function (outJson, json, callback) {
      //     for(var i = 0; i < json.doc.length; i++) {
      //         json.doc[i].sort = '버거'
      //     }
      //     callback(json);
      // }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/pack.asp",
      param: {
        a: 1891420703,
        z: 2147133306,
        dl: 'https://homeservice.lotteria.com/RIA/homeservice/pack.asp'
      },
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
        }
      }
      // postCallback: function (outJson, json, callback) {
      //     for(var i = 0; i < json.doc.length; i++) {
      //         json.doc[i].sort = '팩'
      //     }
      //     callback(json);
      // }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/chicken.asp",
      param: {
        a: 262626634,
        z: 208966946,
        dl: 'https://homeservice.lotteria.com/RIA/homeservice/chicken.asp'
      },
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
        }
      }
      // postCallback: function (outJson, json, callback) {
      //     for(var i = 0; i < json.doc.length; i++) {
      //         json.doc[i].sort = '치킨'
      //     }
      //     callback(json);
      // }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/dessert.asp",
      param: {
        a: 766690042,
        z: 917500388,
        dl: 'https://homeservice.lotteria.com/RIA/homeservice/dessert.asp'
      },
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
        }
      }
      // postCallback: function (outJson, json, callback) {
      //     for(var i = 0; i < json.doc.length; i++) {
      //         json.doc[i].sort = '디저트'
      //     }
      //     callback(json);
      // }
    },
    {
      module: "orderbot",
      action: "fssLotteria",
      path : "/RIA/homeservice/drink.asp",
      param: {
        a: 1197707916,
        z: 23969862,
        dl: 'https://homeservice.lotteria.com/RIA/homeservice/drink.asp'
      },
      xpath: {
        "repeat": "//ul[@class='menu_list']/li[@class='product']",
        //"limit": "5",
        "doc": {
          "price": "//div[@class='cart_wrap']/div[@class='cart_left']/span/b/text()"
        }
      }
      // postCallback: function (outJson, json, callback) {
      //     for(var i = 0; i < json.doc.length; i++) {
      //         json.doc[i].sort = '드링크'
      //     }
      //     callback(json);
      // }
    },
    {
      module: 'mongo',
      action: 'update',
      setData: true,
      docMerge: 'none',
      mongo: {
        model: 'Deposit',
        schema: {
          sort: 'String',
          calories: 'String',
          price: 'String',
          soloprice: 'String',
          setprice: 'String'
        },
        query: {sort: ''},
        options: {upsert: true}
      }
    }
  ]
};

exports.fssLotteria = {
  "module": "http",
  "action": "xpathRepeat",
  "method": "POST",
  "url": "https://homeservice.lotteria.com",
  "path": "/RIA/homeservice/burger.asp",
  "param": {
    "v": 1,
    "_v": "j44",
    "t": "pageview",
    "_s": 1,
    "je": 0,
    "a": 1798581530,
    "z": 375957775,
    "dl": 'https://homeservice.lotteria.com/RIA/homeservice/burger.asp'
  },
  "docMerge": "add",
  "xpath": {
    "repeat": "//ul[@class='menu_list']/li[@class='product']",
    //"limit": "5",
    "doc": {
      "product": "//div[@class='info']/div[@class='name']/p[@class='desc']/text()",
      "calories": "//div[@class='info']/div[@class='name']/p[@class='desc']/span/text()"
    }
  }
};

function updateFranchiseRestaurant(task, context, successCallback, errorCallback) {
  var modelFranchise = mongoose.model('Franchise');

  var modelRestaurant = mongoose.model('Restaurant');

  modelFranchise.find({}, function(err, docs) {
    async.eachSeries(docs, function (doc, callback) {
        if(doc._doc.name.search('부어치킨') != -1 || doc._doc.name.search('피자나라치킨공주') != -1 || doc._doc.name.search('훌랄라참숮바베큐') != -1) {
          modelRestaurant.update({name: new RegExp(doc._doc.name, 'i')}, {franchise: doc._id, deliverable: false}, {upsert: true, multi: true}, function (_err, numberAffected) {
            logger.debug(doc._doc.name + ': ' + numberAffected.n + ', ' + numberAffected.nModified + ', ' + doc._id);
            callback(null);
          });
        } else {
          modelRestaurant.update({name: new RegExp(doc._doc.name, 'i')}, {franchise: doc._id, deliverable: true}, {upsert: true, multi: true}, function(_err, numberAffected) {
            logger.debug(doc._doc.name + ': ' + numberAffected.n + ', ' + numberAffected.nModified + ', ' + doc._id);
            callback(null);
          });
        }
      },
      function(err) {
        successCallback(task, context);
      });
  })
}

exports.updateFranchiseRestaurant = updateFranchiseRestaurant;

bot.setAction('updateFranchiseRestaurant', updateFranchiseRestaurant);


function updateFranchiseRestaurantName(task, context, successCallback, errorCallback) {
  var modelRestaurant = mongoose.model('Restaurant');

  modelRestaurant.find({name: /교촌치킨 교촌치킨/}, function(err, docs) {
    async.eachSeries(docs, function (doc, callback) {
        doc.name = doc._doc.name.replace('교촌치킨 교촌치킨', '교촌치킨');
        doc.save();

        logger.debug(doc.name + ': ');

        callback(null);
      },
      function(err) {
        successCallback(task, context);
      });
  })
}

exports.updateFranchiseRestaurantName = updateFranchiseRestaurantName;

bot.setAction('updateFranchiseRestaurantName', updateFranchiseRestaurantName);


function updateMenuExist(task, context, callback) {
  var modelRestaurant = mongoose.model('Restaurant');
  var modelMenu = mongoose.model('Menu');

  modelRestaurant.find({"franchise" : mongoose.Types.ObjectId("582d4975477f9a6f66cf953e")}, function(err, docs) {
    async.eachSeries(docs, function (doc, cb) {
      modelMenu.count({restaurant: doc._id}, function(err, cnt) {
        if(cnt > 0) {
          doc.isMenuExist = true;
          logger.debug(doc.name, cnt);
          doc.save();
        } else {
          doc.isMenuExist = false;
          doc.save();
        }
        cb(null);
      });
    },
    function(err) {
      callback(task, context);
    });
  })
}

exports.updateMenuExist = updateMenuExist;
bot.setAction('updateMenuExist', updateMenuExist);

function checkDumpCategory(task, context, callback) {
  var model = mongoose.model('Menu');

  model.aggregate(
    [
      {
        "$unwind" : "$category"
      },
      {
        "$group" : {
          "_id" : {
            'category': '$category'
          },
          "category1" : {
            "$first" : "$category"
          }
        }
      }
    ], function(err, docs) {

      if(err) console.log(err);
      else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          console.log(doc.category1);
        }
      }
      callback(task, context);
    });
}

exports.checkDumpCategory = checkDumpCategory;
bot.setAction('checkDumpCategory', checkDumpCategory);


var categoryNames = [
  {ori: "이벤트3", to: "이벤트메뉴"},
  {ori: "정갈하고 맛있는 요리", to: "담백한 요리"},
  {ori: "추천짬뽕메뉴", to: "추천짬뽕"},
  {ori: "한그릇 두가지맛!", to: "두가지맛"},
  {ori: "불타는 매운요리", to: "매운요리"},
  {ori: "원플러스원", to: "1+1"},
  {ori: "한그릇에 두가지맛 메뉴", to: "두가지맛"},
  {ori: "뜨끈뜨끈 짬뽕", to: "짬뽕"},
  {ori: "새로운 맛 메뉴", to: "신메뉴"},
  {ori: "추천 알뜰메뉴", to: "알뜰메뉴"},
  {ori: "세트메트", to: "세트메뉴"},
  {ori: "Set Menu", to: "세트메뉴"},
  {ori: "두가지 맛 메뉴", to: "두가지맛"},
  {ori: "한그릇에 두가지 메뉴", to: "두가지맛"},
  {ori: "추천 히트메뉴", to: "인기메뉴"},
  {ori: "한그릇에두가지를먹는즐거움!", to: "두가지맛"},
  {ori: "화끈화끈 불메뉴", to: "불메뉴"},
  {ori: "빅히트 코스요리", to: "인기코스요리"},
  {ori: "강력추천 셋트메뉴", to: "추천세트메뉴"},
  {ori: "한그룻두가지맛", to: "두가지맛"},
  {ori: "청누리 여름 스페셜", to: "여름메뉴"},
  {ori: "한그릇두가지맛", to: "두가지맛"},
  {ori: "뭐 시킬지 고민 뚝! 일석이조", to: "두가지맛"},
  {ori: "두가지맛!", to: "두가지맛"},
  {ori: "하절기 특선 메뉴", to: "여름메뉴"},
  {ori: "떳다 알뜰셋트", to: "알뜰세트"},
  {ori: "한 그릇에 두가지맛", to: "두가지맛"},
  {ori: "강추 할인 세트", to: "할인세트메뉴"},
  {ori: "강추메뉴", to: "인기메뉴"},
  {ori: "한그릇에두가지맛", to: "두가지맛"},
  {ori: "여름의 진수", to: "여름메뉴"},
  {ori: "강력 추천셋트", to: "추천세트메뉴"},
  {ori: "New", to: "신메뉴"},
  {ori: "한번에 두가지의 맛!!!", to: "두가지맛"},
  {ori: "더욱알찬 중화명가셋트메뉴", to: "중화명가세트메뉴"},
  {ori: "짬뽕들의 행진", to: "짬뽕"},
  {ori: "최고급 건강요리류", to: "건강요리류"},
  {ori: "한그릇에 3가지 맛", to: "세가지맛"},
  {ori: "두가지 맛을 한 그릇에", to: "두가지맛"},
  {ori: "맛보면 기절하는 짬뽕", to: "짬뽕"},
  {ori: "직장인을 위한 최고 인기메뉴", to: "인기메뉴"},
  {ori: "한그릇에 두가지맛!", to: "두가지맛"},
  {ori: "금용세트트메뉴", to: "금용세트메뉴"},
  {ori: "<버거바이트（30% 할인중）>", to: "버거바이트"},
  {ori: "두가지 맛을 한번에", to: "두가지맛"},
  {ori: "두가지맛을 한번에!!", to: "두가지맛"},
  {ori: "매운맛 불타는메뉴", to: "매운메뉴"},
  {ori: "프린스 프리미엄 골드 피자 BIG 7", to: "BIG 7"},
  {ori: "한그릇에 두가지메뉴", to: "두가지맛"},
  {ori: "한그릇에 두가지를 먹는  즐거움!!", to: "두가지맛"},
  {ori: "짬뽕의 달인", to: "짬뽕"},
  {ori: "한그릇 두가지 맛!", to: "두가지맛"},
  {ori: "한그릇에 두가지 맛", to: "두가지맛"},
  {ori: "중식과 한식의 콤비", to: "퓨전요리"},
  {ori: "만리장성 추천 스페샬메뉴", to: "추천메뉴"},
  {ori: "전국 5대짬뽕", to: "짬뽕"},
  {ori: "<치즈롤 크러스트 패밀리（F）>", to: "치즈롤 크러스트 패밀리"},
  {ori: "기막힌 후라이드 순살 치킨", to: "후라이드 순살"},
  {ori: "한그릇 두가지맛", to: "두가지맛"},
  {ori: "<달인피자（R）>", to: "달인피자 ( R )"},
  {ori: "<오리지널 크러스트 레귤러（R）>", to: "오리지널 크러스트 ( R )"},
  {ori: "기획할인셋트", to: "할인세트"},
  {ori: "차칸메뉴 RICE", to: "착한메뉴"},
  {ori: "한그릇에 두가지 맛을 즐기세요", to: "두가지맛"},
  {ori: "<기타>", to: "기타"},
  {ori: "한그릇에 두가지를 먹는 즐거움!!", to: "두가지맛"},
  {ori: "한그릇에 두가지맛", to: "두가지맛"},
  {ori: "강력추천메뉴", to: "추천메뉴"},
  {ori: "<굽네 고추 바사삭 시리즈>", to: "굽네 고추 바사삭"},
  {ori: "<오리지널 크러스트 라지（L）>", to: "오리지널 크러스트 ( L )"},
  {ori: "4가지맛을한번에", to: "네가지맛"},
  {ori: "기막힌양념메뉴", to: "양념메뉴"},
  {ori: "기막힌 뼈강정 메뉴", to: "뼈강정 메뉴"},
  {ori: "<트리플박스>", to: "트리플박스"},
  {ori: "<구이치킨>", to: "구이치킨"},
  {ori: "한그릇에 세가지맛!", to: "세가지맛"},
  {ori: "스페셜피자L ★음료별도★", to: "스페셜피자 L"},
  {ori: "레알 수제치즈버거 메뉴", to: "수제치즈버거"},
  {ori: "짬뽕하우스", to: "짬뽕"},
  {ori: "<굽네 후르츄 소이갈릭 시리즈>", to: "굽네 후르츄 소이갈릭"},
  {ori: "NOODLE 메뉴", to: "면 류"},
  {ori: "<후라이드>", to: "후라이드 순살"},
  {ori: "Hit 메뉴", to: "인기메뉴"},
  {ori: "실속있는 세트메뉴", to: "실속세트"},
  {ori: "한 그릇에 두가지 맛", to: "두가지맛"},
  {ori: "<명품세트（L）>", to: "명품세트 ( L )"},
  {ori: "한그릇에 두메뉴", to: "두가지맛"},
  {ori: "기막힌 후라이드 뼈 치킨 메뉴", to: "후라이드 뼈 치킨 메뉴"},
  {ori: "강추세트", to: "추천메뉴"},
  {ori: "<사이드>", to: "사이드"},
  {ori: "<콜라／무／소스>", to: "콜라/무/소스"},
  {ori: "한그릇 두가지 메뉴", to: "두가지맛"},
  {ori: "기막힌 순살강정 메뉴", to: "순살강정 메뉴"},
  {ori: "<프리미엄 피자（1＋1）>", to: "프리미엄 피자 ( 1 + 1 )"},
  {ori: "각종모임 및 집들이 코스요리", to: "코스요리"},
  {ori: "피자 두판 세트 출시!", to: "피자 두판 세트"},
  {ori: "<명품세트（R）>", to: "명품세트 ( R )"},
  {ori: "한그릇에 두가지를 먹는 즐거움", to: "두가지맛"},
  {ori: "특별한식사", to: "특별메뉴"},
  {ori: "<음료 메뉴>", to: "음료"},
  {ori: "（大）샐러드>>사이즈업", to: "샐러드 사이즈업"},
  {ori: "한그릇에두가지 메뉴", to: "두가지맛"},
  {ori: "스페셜피자XXL★음료별도★", to: "스페셜피자XXL"},
  {ori: "스페셜피자 L 메뉴", to: "스페셜피자L"},
  {ori: "스페셜피자R★음료별도★", to: "스페셜피자R"},
  {ori: "고스트피자R★음료별도★", to: "고스트피자R"},
  {ori: "핫딜 싱글메카 할인세트（M）", to: "할인세트 ( M )"},
  {ori: "일반피자L★음료별도★", to: "일반피자L"},
  {ori: "<스페셜 피자（한판）>", to: "스페셜피자"},
  {ori: "일반피자R★음료별도★", to: "일반피자R"},
  {ori: "<굽네 볼케이노 시리즈>", to: "굽네 볼케이노"},
  {ori: "일반피자XXL★음료별도★", to: "일반피자XXL"},
  {ori: "<오리지날 치킨>", to: "오리지날 치킨"},
  {ori: "한번에 두가지맛", to: "두가지맛"},
  {ori: "<클래식 피자（한판）>", to: "클래식 피자"},
  {ori: "<리치골드피자 （30%할인중）>", to: "리치골드피자"},
  {ori: "<올리브치도락>", to: "올리브치도락"},
  {ori: "<치즈롤 크러스트 파티（P）>", to: "치즈롤 크러스트 ( P )"},
  {ori: "한그릇에 두가지 맛을 즐기세요!!", to: "두가지맛"},
  {ori: "<뿌링클>", to: "뿌링클"},
  {ori: "고스트피자XXL★음료별도★", to: "고스트피자XXL"},
  {ori: "기막힌후라이드메뉴", to: "후라이드메뉴"},
  {ori: "<콜팝>", to: "콜팝"},
  {ori: "2판 피자★음료별도★", to: "2판 피자"},
  {ori: "프리미엄피자L★음료별도★", to: "프리미엄피자L"},
  {ori: "<웰빙피자（L）>", to: "웰빙피자 ( L )"},
  {ori: "<순살치킨>", to: "순살치킨"},
  {ori: "<장인세트（L）>", to: "장인세트 ( L )"},
  {ori: "<골드링 씬 크러스트 패밀리（F）>", to: "골드링 씬 크러스트 ( F )"},
  {ori: "<골드링 크러스트 파티（P）>", to: "골드링 크러스트 ( P )"},
  {ori: "핫딜 더블메카 할인세트（M）", to: "할인세트 ( M )"},
  {ori: "<하프앤하프 피자（L）>", to: "하프앤하프 피자 ( L )"},
  {ori: "<명품피자（R）>", to: "명품피자 ( R )"},
  {ori: "<치즈크러스트피자 （30%할인중>", to: "치즈크러스트피자"},
  {ori: "Top 10", to: "인기메뉴"},
  {ori: "순한맛과 건강한 어린이를 위한 메뉴", to: "어린이 메뉴"},
  {ori: "개화 특선 개발메뉴", to: "신메뉴"},
  {ori: "숙취해소를 잡는 짬뽕쌍둥이 메뉴", to: "짬뽕"},
  {ori: "고스트피자L★음료별도★", to: "고스트피자L"},
  {ori: "<굽네 양념 시리즈>", to: "굽네 양념"},
  {ori: "<스페셜 피자（1＋1）>", to: "스페셜 피자 1+1"},
  {ori: "시즌 '모듬수프' 특별세일", to: "모듬수프"},
  {ori: "한그릇에 세가지맛", to: "세가지맛"},
  {ori: "<히트박스 메뉴>", to: "히트박스"},
  {ori: "순살만 골라만든 메뉴", to: "순살 메뉴"},
  {ori: "원플러스원 피자메뉴", to: "1 + 1 피자"},
  {ori: "일석이조 두가지맛", to: "두가지맛"},
  {ori: "강력추천 히트메뉴", to: "추천메뉴"},
  {ori: "<스폐셜 치킨>", to: "스페셜 치킨"},
  {ori: "★고스트 추천메뉴★", to: "고스트 추천메뉴"},
  {ori: "이벤트 3", to: "이벤트"},
  {ori: "한그릇에 두가지를 먹는 즐거움!", to: "두가지맛"},
  {ori: "<정통세트（L）>", to: "정통세트 ( L )"},
  {ori: "<클래식 피자（1＋1）>", to: "클래식 피자 ( 1 + 1 )"},
  {ori: "<사이드&음료 메뉴>", to: "사이드&음료"},
  {ori: "<굽네 오리지널 시리즈>", to: "굽네 오리지널"},
  {ori: "<오리지널 크러스트 파티（P）>", to: "오리지널 크러스트 (P)"},
  {ori: "<굽네 볼케이노 쌀떡볶이 시리즈>", to: "굽네 볼케이노 쌀떡볶이"},
  {ori: "<토핑치킨>", to: "토핑치킨"},
  {ori: "두가지맛을 한번에!", to: "두가지맛"},
  {ori: "<달인피자（L）>", to: "달인피자 ( L )"},
  {ori: "<간장／구이>", to: "간장 / 구이"},
  {ori: "VEGETABLE CURRY 야채 커리", to: "야채 커리"},
  {ori: "프리미엄피자R★음료별도★", to: "프리미엄피자 R"},
  {ori: "한 그릇에 두 가지를 먹는 즐거움", to: "두가지맛"},
  {ori: "<맛초킹>", to: "맛초킹"},
  {ori: "<세트메뉴>", to: "세트메뉴"},
  {ori: "<색다른 메뉴>", to: "색다른 메뉴"},
  {ori: "<맵스터>", to: "맵스터"},
  {ori: "<웰빙피자（R）>", to: "웰빙피자 ( R )"},
  {ori: "해물홍합짬봉의 진수", to: "해물홍합짬뽕"},
  {ori: "우리식당자랑거리", to: "추천메뉴"},
  {ori: "한그릇에 두가지 맛을 즐기세요~", to: "두가지맛"},
  {ori: "<반반치킨>", to: "반반치킨"},
  {ori: "한 그릇에 세가지맛", to: "세가지맛"},
  {ori: "<스넥류>", to: "스낵류"},
  {ori: "<정통피자（R）>", to: "정통피자 ( R )"},
  {ori: "중국성 강추메뉴", to: "중국성 추천메뉴"},
  {ori: "한 그릇 두 가지 맛", to: "두가지맛"},
  {ori: "한그릇두가지메뉴", to: "두가지맛"},
  {ori: "<팬피자>", to: "팬피자"},
  {ori: "한번에 두가지 맛", to: "두가지맛"},
  {ori: "한그릇에 두가지 맛!", to: "두가지맛"},
  {ori: "<하니퐁듀 피자（한판）>", to: "허니퐁듀 피자"},
  {ori: "<골드링 크러스트 패밀리（F）>", to: "골드링 크러스트 ( F )"},
  {ori: "<굽네 볼케이노 모짜렐라 시리즈>", to: "굽네 볼케이노 모짜렐라"},
  {ori: "<양념／순살>", to: "양념 / 순살"},
  {ori: "<신제품세트>", to: "신제품 세트"},
  {ori: "<하프앤하프 피자（R）>", to: "하프앤하프 피자 ( R )"},
  {ori: "<씬 크러스트 패밀리（F）>", to: "씬 크러스트 ( F )"},
  {ori: "핫딜 더블메카 할인세트（L）", to: "할인세트 ( L )"},
  {ori: "<굽네 오리지널 콤보 세트>", to: "굽네 오리지널 콤보"},
  {ori: "<명품피자（L）>", to: "명품피자 ( L )"},
  {ori: "<굽네 반반 시리즈>", to: "굽네 반반"},
  {ori: "<사이드 메뉴>", to: "사이드"},
  {ori: "<옵션>", to: "옵션"},
  {ori: "<음료>", to: "음료"},
  {ori: "<이탈리안 피자（1＋1）>", to: "이탈리안 피자 1 + 1"},
  {ori: "<프리미엄 피자（한판）>", to: "프리미엄 피자"},
  {ori: "VIP를 위한 특선메뉴", to: "특선메뉴"},
  {ori: "강력추천 매운불맛 메뉴", to: "매운메뉴"},
  {ori: "<장인피자 （R）>", to: "장인피자 ( R )"},
  {ori: "<하트 씬 크러스트 패밀리（F）>", to: "하트 씬 크러스트 ( F )"},
  {ori: "<정통피자（L）>", to: "정통피자 ( L )"},
  {ori: "이벤트 2", to: "이벤트"},
  {ori: "<웰빙세트（R）>", to: "웰빙세트 ( R )"},
  {ori: "<커리퀸>", to: "커리퀸"},
  {ori: "<달인세트（L）>", to: "달인세트 ( L )"},
  {ori: "프리미엄엄피자XXL★음료별도★", to: "프리미엄 피자 XXL"},
  {ori: "<장인세트（R）>", to: "장인세트 ( R )"},
  {ori: "<추가 메뉴>", to: "추가 메뉴"},
  {ori: "<하니퐁듀 피자（1＋1）>", to: "허니퐁듀 피자 1 + 1"},
  {ori: "<키즈피자 세트>", to: "키즈피자 세트"},
  {ori: "<굽네 딥치즈 시리즈>", to: "굽네 딥치즈"},
  {ori: "[ NEW신메뉴 ] 나폴리 피자", to: "나폴리 피자"},
  {ori: "<더 맛있는 피자 시즌2>", to: "더 마있는 피자"},
  {ori: "<양념치킨>", to: "양념치킨"},
  {ori: "정직한 셋트메뉴", to: "세트메뉴"},
  {ori: "<파스타&리조또 메뉴>", to: "파스타&리조또"},
  {ori: "<추가 사이드 & 음료 메뉴>", to: "사이드&음료"},
  {ori: "<오리지널 크러스트 패밀리（F）>", to: "오리지널 크러스트 ( F )"},
  {ori: "<치즈롤 크러스트 라지（L）>", to: "치즈롤 크러스트 ( L )"},
  {ori: "<골드링 크러스트 라지（L）>", to: "골드링 크러스트 ( L )"}


];

function updateDumpCategory(task, context, callback) {
  var model = mongoose.model('Menu');

  async.eachSeries(categoryNames, function(ct, cb) {
    model.update({'category': ct.ori}, {'$set': {'category.$': ct.to}}, {multi: true}, function(err, res) {
      if(err) console.log(err);
      else console.log(ct.ori, ct.to, res.nModified);
      cb(null);
    });
  }, function(err) {
    callback(task, context);
  });
}

exports.updateDumpCategory = updateDumpCategory;
bot.setAction('updateDumpCategory', updateDumpCategory);

