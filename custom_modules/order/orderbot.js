var path = require('path');
var logger = require(path.resolve('./config/lib/logger'));
var async = require('async');
var mongoose = require('mongoose');
var XLSX = require('xlsx');
var utils = require(path.resolve('./modules/bot/action/common/utils'));

exports.text = function (task, context, successCallback, errorCallback) {
    successCallback(task, context);
};


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
