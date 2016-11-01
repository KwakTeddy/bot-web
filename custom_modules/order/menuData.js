var path = require('path');
var http = require(path.resolve('modules/bot/action/common/http'));
var task = require(path.resolve('modules/bot/action/common/task'));
var bot = require(path.resolve('config/lib/bot')).getBot('order');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var tough = require('tough-cookie');

var async = require('async');
var mongoose = require('mongoose');
var webdriverio = require('webdriverio');
var fs = require('fs');
var utils = require(path.resolve('modules/bot/action/common/utils'));

// var execTask = {
//   action: function(task, context, callback) {
//     var words = context.dialog.inRaw.split(' ');
//     var _task = bot.tasks[words[1]];
//
//     _task.action(_task, context, function(_task, _context) {
//       callback(_task, _context);
//     })
//   }
// };
//
// bot.setTask('execTask', execTask);


var baeminLocation = {
  actionModule: http,
  action: 'request',
  method: "POST",
  url: "http://www.baemin.com",
  path: '/main/sch_addr',
  param: {addr_kw: '가산동'},
  postCallback: function(task, context, callback) {
    var lat = task._text.match(/<input.*id="lat_\d*" value="([^<>]*)"/)[1];
    var lng = task._text.match(/<input.*id="lng_\d*" value="([^<>]*)"/)[1];
    var addr = task._text.match(/<input.*id="addr_\d*" value="([^<>]*)"/)[1];
    var addr_st = task._text.match(/<input.*id="addr_st_\d*" value="([^<>]*)"/)[1];
    var Rgn3 = task._text.match(/<input.*id="Rgn3_\d*" value="([^<>]*)"/)[1];

    console.log(lat, lng, addr, addr_st, Rgn3);

    context.user.cookie = new tough.CookieJar();

    context.user.cookie.setCookie('lat=' + lat, this.url, function() {});
    context.user.cookie.setCookie('lng=' + lng, this.url, function() {});
    context.user.cookie.setCookie('rgn1=' + Rgn3.substring(0, 2), this.url, function() {});
    context.user.cookie.setCookie('rgn3=' + Rgn3.substring(0, 5), this.url, function() {});
    context.user.cookie.setCookie('rgn3=' + Rgn3, this.url, function() {});
    context.user.cookie.setCookie('addr=' + encodeURIComponent(addr), this.url, function() {});
    context.user.cookie.setCookie('addr_st=' + encodeURIComponent(addr_st), this.url, function() {});

    console.log(context.user.cookie.toJSON());

    callback(task, context);
  }
};

var baeminList = {
  actionModule: http,
  action: "request",
  method: "GET",
  url: "http://www.baemin.com",
//  path: '/list/%EC%A4%91%EA%B5%AD%EC%A7%91/%EC%84%9C%EC%9A%B8_%EA%B0%80%EC%82%B0%EB%8F%99',
  path: '/list/중국집/서울_가산동',
  postCallback: function(task, context, callback) {
    var xml = task._text;

    var re = /<div.*fn_mv_shopInfo\('(.*)','(.*)'\)/g;

    xml.replace(re, function(match, p1, p2) {
      console.log(p1, p2);
    });
  }
};

// bot.setTask('baeminList', baeminList);

var baemin = {
  actionModule: task,
  action: 'sequence',
  actions: [
    baeminLocation,
    baeminList
  ]
};

bot.setTask('baemin', baemin);

var baeminDetail = {
  actionModule: http,
  action: "xpath",
  method: "GET",
  url: "http://www.baemin.com",
  // path: "/shop/525046/%EC%84%9C%EC%9A%B8%EC%A7%AC%EB%BD%95",
  path: '/shop/528820/%EB%A1%AF%EB%8D%B0%EB%A6%AC%EC%95%84%20%EC%8B%9C%ED%9D%A5%EC%A4%91%EC%95%99%EC%A0%90',
  postCallback: function(task, context, callback) {
    var xmldomErrorHandler = {
      warning: function(w) {},
      error: function(e) {},
      fatalError: function(e) {}
    };

    var DOC_NAME = 'doc';

    var repeat =  "//section[@class='menu-sect panel-group']/div[@class='panel panel-default']";
    var title = ".//h3[@class='panel-title']/a/text()";
    var menus = ".//div[@class='panel']";
    var name = ".//span[@itemprop='menu']/text()";
    var price = ".//strong[@class='price']/text()";
    var options = ".//div[@class='select-option small']";
    var optTitle = ".//div[@class='option-tit']/text()";
    var radio = ".//ul/li/text()";
    var check = ".//input[@type='checkbox']/@id";

    var xml = task._text;
    var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);
    var nodes = xpath.select(repeat, doc)

    task[DOC_NAME] = [];
    for(var i = 0; nodes && i < nodes.length; i++) {
      var node = nodes[i];
      var _category = xpath.select(title, node).toString();
      _category = _category.replace(/,/, '').trim()


      var _menus = xpath.select(menus, node);
      for (var j = 0; j < _menus.length; j++) {
        var docMenu = {};

        var node2 = _menus[j];
        var _name = xpath.select(name, node2).toString();
        var _price = xpath.select(price, node2).toString();

        docMenu.category = _category;
        docMenu.name = _name;
        docMenu.price = _price;

        // console.log(_category, _name, _price);

        var _options = xpath.select(options, node2);
        for (var k = 0; k < _options.length; k++) {
          var _option = _options[k];

          try {
            var _optTitle = xpath.select(optTitle, _option).toString();
            _optTitle = _optTitle.replace(/,/, '').trim();
            var _type = xpath.select(".//span[@class='text-primary']/text()", _option).toString();
            var _radio = xpath.select(radio, _option).toString();
            _radio = _radio.replace(/&amp;middot;/g,'').trim();

            var docOptions = [];
            var options2 = _radio.split(',');
            for (var l = 0; options.length > 1 && l < options2.length; l++) {
              var opt = options2[l];
              var sp = opt.split(':');

              docOptions.push({name: sp[0], price: sp[1]});
            }

            if(_type.trim() == '(필수선택)') {
              if(docOptions.length > 1) {
                if(!docMenu.options) docMenu.options = [];
                docMenu.options.push({optionName: _optTitle, optionValues: docOptions});
              }
            } else {
              if(!docMenu.additions) docMenu.additions = [];
              docMenu.additions.push({name: sp[0], price: sp[1]});
            }
            // console.log(_optTitle, _type, _radio);

          } catch(e) {}
        }

        console.log(JSON.stringify(docMenu, null, 1));
      }
    }

    callback(task, context);
  }

};

// bot.setTask('baeminDetail', baeminDetail);


function baList(task, context, callback) {

  callback(task, context);
}

exports.baList = baList;


var options = {
  desiredCapabilities: {
    browserName: 'chrome',
    logLevel: 'verbose'

  }
};

var client;
var count, i;
var scrollHeight, preScrollHeight;

function loadingScroll() {
  scrollHeight = 0; preScrollHeight = -1;

  function next() {
    if (scrollHeight != preScrollHeight) {
      return client.execute(function() {
        return document.body.scrollHeight;
      }).then(function(ret) {
        preScrollHeight = ret.value;
      })
        .execute(function (preScrollHeight) {
          window.scrollTo(0,document.body.scrollHeight);
        })
        .pause(1000)
        .execute(function() {
          return document.body.scrollHeight;
        }).then(function(ret) {
          scrollHeight =ret.value;
        })
        .then(next);

    } else {
      return client.execute(function() {
        window.scrollTo(0, 0);
      });
    }
  }
  // start the loop
  return next();
}

function getScopeModel(selector, name) {
  try {
    var scope = angular.element(document.querySelector(selector)).scope();
    console.log(scope);
    if(scope) return JSON.parse(JSON.stringify(scope[name]));
    else return null;
  } catch(e) {
    console.log(e);
  }
}

function getScopeModelById(scopeId, name) {
  function getScope(id) {
    var elem;
    $('.ng-scope').each(function(){
      var s = angular.element(this).scope(),
        sid = s.$id;

      if(sid == id) {
        elem = this;
        return false; // stop looking at the rest
      }
    });
    return elem;
  };

  try {
    var scope = angular.element(getScope(scopeId)).scope();
    if(scope) return scope[name];
    else return null;
  } catch(e) {
    console.log(e);
  }
}

function yoList(task, context, callback) {
  var _task;
  var categoryNum;
  var restaurant_list = [];

  console.log('yoList: ' + task.address + ', ' + task.category);

  async.waterfall([
    function(cb) {

      if(task.category == '치킨') categoryNum = 3;
      else if(task.category == '피자/양식') categoryNum = 4;
      else if(task.category == '중국집') categoryNum = 5;
      else if(task.category == '한식') categoryNum = 6;
      else if(task.category == '일식/돈까스') categoryNum = 7;
      else if(task.category == '족발/보쌈') categoryNum = 8;
      else if(task.category == '야식') categoryNum = 9;
      else if(task.category == '분식') categoryNum = 10;
      else if(task.category == '프랜차이즈') categoryNum = 11;

      client
        .waitUntil(function() {
          return client.getAttribute('#spinner', 'class', function(attr) {
            if(attr == 'ng-hide') return true;
            else return false;
          })
        }, 5000)
        .pause(500)
        // .waitForExist('#search  div  form  input', 5000)
        .isExisting('#search  div  form  input').then(function(isExisting) {
          if(isExisting) cb(null);
          else {
            console.log('yo input 없음: ');
            cb(true);
          }
        });
    },

    function(cb) {
      // console.log('yo 주소 입력');
      client.setValue('#search  div  form  input', task.address)
        .pause(2000)
        .getText('#search > div > form > ul > li:nth-child(1) > a').then(function(text) {
          if(text.search('검색하신 주소를 찾을 수 없습니다') != -1) {
            cb(true);
          } else {
            cb(null);
          }
        })
    },

    function(cb) {
      client.click('#button_search_address button.btn.btn-default.ico-pick')
        .pause(200)
        .waitUntil(function() {
          return client.getAttribute('#spinner', 'class', function(attr) {
            if(attr == 'ng-hide') return true;
            else return false;
          })
        }, 5000)
        .pause(500)
        // .waitForEnabled('//div[@id="category"]/ul/li[' + categoryNum + ']', 5000)
        .isExisting('//div[@id="category"]/ul/li[' + categoryNum + ']').then(function(isExisting) {
          // console.log('yo 카테고리: ' + categoryNum + ', ' + isExisting);
          if(isExisting) cb(null);
          else {
            console.log('yo 카테고리 없음: ' + categoryNum);
            cb(true);
          }
      })
    },

    function(cb) {
      // console.log('yo 카테고리 클릭');

      client
        // .pause(1000)
        .click('//div[@id="category"]/ul/li[' + categoryNum + ']')
        .catch(function(err) {
          console.log(err);
          cb(true);
        })
        .pause(200)

        .waitUntil(function() {
          return client.getAttribute('#spinner', 'class', function(attr) {
            if(attr == 'ng-hide') return true;
            else return false;
          })
        }, 5000)
        .pause(500)
        // .waitForEnabled('#content > div > div.restaurant-list > div.col-sm-6 > div', 5000)
        .isExisting('#content > div > div.restaurant-list > div.col-sm-6 > div').then(function(isExisting) {
          if(isExisting) cb(null);
          else {
            console.log('yo 매장 목록 없음: ');

            cb(true);
          }
        });
    },

    function(cb) {
      // console.log('yo 스크롤');
      client
        .then(loadingScroll)
        .pause(500)
        .then(function() {
          cb(null);
        });
    },

    function(cb) {
      // console.log('yo get elements');
      client.elements("#content > div > div.restaurant-list > div.col-sm-6 > div").then(function(res) {
        i = 0;
        count = res.value.length;
        async.whilst(
          function() { return i++ < count;},
          function(cb2) {
            // console.log('yo elements: ' + i + '/' + count);

            async.waterfall([
              function(cb3) {
                client.waitUntil(function() {
                  return client.isExisting('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ')').then(function (isExisting) {
                    if (isExisting) {
                      return true;
                    } else{
                      return loadingScroll().then(function() {
                        return true;
                      });
                    }
                  })
                }, 5000)
                .then(function() {

                  client.waitUntil(function() {
                    return client.getAttribute('#spinner', 'class', function(attr) {
                      if(attr == 'ng-hide') return true;
                      else return false;
                    })
                  }, 5000)

                  .isExisting('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ') > div').then(function (isExisting) {
                    if(isExisting) cb3(null);
                    else {
                      console.log('element 미존재: ' + i + ', ' + restaurant_list[i-1].name);
                      cb3(true);
                    }
                  });
                });
              },

              function(cb3) {
                // console.log('yoList: whilst 2');

                client
                  .execute(getScopeModel, '.restaurant-list', 'restaurant_list')
                  .then(function(res) {
                    // console.log('getScopeModel: count ' + res.value.length);
                    if(res != null) restaurant_list = res.value;
                    else restaurant_list = [];

                    if(restaurant_list.length > 0 && restaurant_list.length > i-1) {
                      var model = mongoose.model('RestaurantDump');
                      model.find({site: 'yo', restaurantId: restaurant_list[i-1].id}, function(err, docs) {
                        if(err) {
                          cb3(true);
                        } else {
                          if(docs.length > 0) {
                            console.log('Restaurant Exist SKIP: site: yo, restaurantId: ' + restaurant_list[i-1].id + ', name: ' + restaurant_list[i-1].name);
                            cb3(true);
                          } else cb3(null);
                        }
                      })
                    } else cb3(true);
                  });
              },

              function(cb3) {
                // console.log('yoList: whilst 3');

                client
                .pause(500)
                .scroll('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ')', 0, -150)
                .waitUntil(function() {
                  return client.getAttribute('#spinner', 'class', function(attr) {
                    if(attr == 'ng-hide') return true;
                    else return false;
                  })
                }, 5000)
                .element('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ') > div').then(function (res) {
                  // console.log('yoList: whilst 31');
                  // console.log('element[' + i + '] click element: ' +res.value.ELEMENT);
                  client.elementIdClick(res.value.ELEMENT)
                    .catch(function(err) {
                      console.log('yo click restaurant error: ' + err);
                      cb3(true);
                    })
                    .pause(500)
                    .waitUntil(function() {
                      return client.getAttribute('#spinner', 'class', function(attr) {
                        if(attr == 'ng-hide') return true;
                        else return false;
                      })
                    }, 5000)
                    // .waitForExist('#menu > div > div:nth-child(1) > div.panel-collapse.collapse.in > div > ul > li:nth-child(1)', 5000)
                    .isExisting('#menu > div > div:nth-child(1) > div.panel-collapse.collapse.in > div > ul > li:nth-child(1)').then(function(isExisting) {
                      // console.log('yoList: whilst 32');
                      if(isExisting) cb3(null);
                      else {
                        console.log('menu 없음');
                        cb3(true, true);
                      }
                    })
                })
                .catch(function(err) {
                  console.log('yo element restaurant error: ' + err);
                  cb3(true);
                })
              },

              function(cb3) {
                // console.log('yoList: whilst 4');

                client.pause(500)
                  .getUrl().then(function (url) {
                    var matched = url.match(/\/(\d+)\/$/);
                    _task = {site: task.site, restaurantId: matched[1], category: [task.category]};
                  })
                  .execute(getScopeModel, '.restaurant-detail', 'restaurant')
                  .then(function(res) {

                    if(res && res.value) {
                      var restaurant = res.value;
                      var menus = res.value.menu;

                      console.log(restaurant.id + ', ' + restaurant.name);

                      _task.name = restaurant.name;
                      _task.category = restaurant.categories;
                      _task.businessHourStr = restaurant.open_time_description;
                      _task.address1 = restaurant.address;
                      _task.minOrder = restaurant.min_order_amount;
                      _task.payment = restaurant.payment_methods;
                      _task.phone = restaurant.phone;
                      _task.lat = restaurant.lat;
                      _task.lng = restaurant.lng;

                      _task.doc = [];
                      for (var j = 0; j < menus.length; j++) {
                        var category = menus[j];

                        var categoryStr = category.name;
                        for (var k = 0; k < category.items.length; k++) {
                          var item = category.items[k];

                          var options = [];
                          var additions = [];

                          if(item.subchoices) {
                            for (var l = 0; l < item.subchoices.length; l++) {
                              var subchoice = item.subchoices[l];

                              var optionValues = [];
                              for (var m = 0; m < subchoice.subchoices.length; m++) {
                                var choice = subchoice.subchoices[m];
                                optionValues.push({name: choice.name, price: choice.price})
                              }

                              if(subchoice.mandatory && !subchoice.multiple)
                                options.push({optionName: subchoice.name, optionValues: optionValues});
                              else
                                additions.push({optionName: subchoice.name, optionValues: optionValues});
                            }
                          }

                          var _menu = {category: [categoryStr], name: item.name, price: item.price};
                          if(options.length > 0) _menu.options = options;
                          if(additions.length > 0) _menu.additions = additions;

                          _task.doc.push(_menu);
                        }
                      }

                      if(_task.name) {
                        yoSave(_task, {}, function (_task, _context) {
                          cb3(null, true);
                        });
                      } else cb3(true, true);
                    } else {
                      cb3(true, true);
                    }
                  })
                  // .getHTML('html').then(function (html) {
                  //   _task._text = html;
                  //
                  //   yoParse(_task, {}, function (_task, _context) {
                  //     if(_task.name) {
                  //       yoSave(_task, {}, function (_task, _context) {
                  //         cb3(null);
                  //       });
                  //     } else cb3(null);
                  //   });
                  // })
              }
              
              // function(cb3) {
              //   client
              //     .back()
              //     .waitUntil(function() {
              //       return client.getAttribute('#spinner', 'class', function(attr) {
              //         if(attr == 'ng-hide') return true;
              //         else return false;
              //       })
              //     }, 5000)
              //     .then(function() {
              //       cb3(null);
              //     });
              // }
              
            ], function(err, isRestaurant) {
              if(isRestaurant) {
                client
                  .back()
                  .waitUntil(function() {
                    return client.getAttribute('#spinner', 'class', function(attr) {
                      if(attr == 'ng-hide') return true;
                      else return false;
                    })
                  }, 5000)
                  .then(function() {
                    cb2(null);
                  });
              } else {
                cb2(null);
              }
            });
          }, function (err, n) {
             cb(null);
          })
      });
    }
  ], function(err) {
    callback(task, context);
  })
}

function yoParse(task, context, callback) {
  // console.log('yoParse');

  try {
    var xmldomErrorHandler = {
      warning: function (w) {
      },
      error: function (e) {
      },
      fatalError: function (e) {
      }
    };

    var DOC_NAME = 'doc';

    var xml = task._text;
    var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);

    task.name = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[1]/span[1]/text()', doc).toString();
    task.businessHourStr = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[1]/span/text()', doc).toString();
    task.address1 = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[3]/span/text()', doc).toString();
    task.minOrder = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[2]/span/text()', doc).toString();
    task.minOrder = task.minOrder.replace(/[,원]/g, '');
    var payment = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[4]/span/text()', doc).toString();
    var pArray = payment.split(',');
    task.payment = [];
    for (var j = 0; j < pArray.length; j++) {
      var p = pArray[j];
      if (p.trim() != '') task.payment.push(p.trim());
    }

    console.log(task.restaurantId + ',' + task.name);

    var nodes = xpath.select('//*[@id="menu"]/div/div', doc);

    task[DOC_NAME] = [];
    for (var j = 0; j < nodes.length; j++) {
      var node = nodes[j];

      var category = xpath.select('./div[1]/h4/a/span/text()', node).toString();

      var menus = xpath.select('./div[2]/div/ul/li', node);
      for (var k = 0; k < menus.length; k++) {
        var menu = menus[k];

        var name = xpath.select('./span[1]/text()', menu).toString();
        var price = xpath.select('./span[2]/text()', menu).toString();
        price = price.replace(/[,원]/g, '');

        task[DOC_NAME].push({category: category, name: name, price: price});
      }
    }
    
    callback(task, context);

  } catch(e) {
    console.log('yoParse: ' + task.restaurantId + ',' + task.name + ', ' + e);

    callback(task, context);
  }
//  console.log(JSON.stringify(task.doc));
}

function yoSave(task, context, callback) {
  var model = mongoose.model('RestaurantDump');
  var model2 = mongoose.model('MenuDump');

  task._text = null;

  model.update({site: task.site, restaurantId: task.restaurantId}, task, {upsert: true},function(err, docs) {
    if(err) {
      console.log('yoSave: ' + err);
    } else {
      if(docs.upserted && docs.upserted.length > 0) {
        task._id = docs.upserted[0]._id;
        model2.remove({restaurantDump: docs.upserted[0]._id});

        for (var j = 0; j < task.doc.length; j++) {
          var doc = task.doc[j];
          doc.restaurantDump = task._id;
        }

        model2.collection.insert(task.doc, function(err, docs) {
          if(err) {
            console.log('yoSave: ' + err);
          }
          callback(task, context);
        });
      } else {
        callback(task, context);
      }
    }
  });
}

exports.yoSave = yoSave;

function yo(task, context, callback) {
  var addresses = [
    '서울 강남구 논현동'
    // '서울 강남구 청담동',
    // '서울 금천구 가산동'
    // '경기도 부천시 원미구 중2동'
  ];

  // if(!client) {
    client = webdriverio
      .remote(options)
      .init()
  // }

    // .url('https://www.yogiyo.co.kr/')
    // .url('https://www.yogiyo.co.kr/mobile/#/%EC%84%9C%EC%9A%B8/135010/%ED%94%BC%EC%9E%90%EC%96%91%EC%8B%9D/')
    .url('https://www.yogiyo.co.kr/mobile/#/%EC%84%9C%EC%9A%B8/153023/%EC%A4%91%EC%8B%9D/')
    .getUrl().then(function(url) {
      console.log(url);
    })
    .pause(3000)
    .then(function() {
      async.eachSeries(addresses, function(address, cb) {
        yoList({address: address, category: '치킨', site: 'yo'}, null, function(_task, _context) {
          cb(null);
        });
      }, function(err) {
        console.log('client end');
        client.end();
        callback(task, context);
      });
    });
}

exports.yo = yo;

bot.setAction('yo', yo);

function yoAddress(task, context, callback) {
  var inRaw = context.dialog.inRaw;
  var words = inRaw.split(' ');

  // var category = '치킨';
  var category = words[1];
  var inputAddress = words.slice(2, words.length).join(' ');

  // 너무 큰파일은 안됨 200M
  var text = fs.readFileSync(path.resolve('dump/address_dong.txt'));
  text =utils.convertEncoding('euc-kr', 'UTF-8', text);

  var lines = text.split('\r\n');

  client = webdriverio
    .remote(options)
    .init()
    .url('https://www.yogiyo.co.kr/')
    // .windowHandleSize({width: 1200, height: 1000})
    .getViewportSize().then(function(size) {
      console.log(size);
    })
    .setViewportSize({width: 1200, height: 5000}, false)
    .getViewportSize().then(function(size) {
      console.log(size);
    })
    .pause(5000)
    .then(function() {
      async.eachSeries(lines, function(line,cb) {
          var val = line.split('\t');

          var address = val.slice(1, val.length - 1).join(' ');

          if(address.search(inputAddress) != -1 && address != inputAddress && val[val.length -1].trim() == '존재') {
            yoList({address: address, category: category, site: 'yo'}, null, function(_task, _context) {
              cb(null);
            });
          } else {
            cb(null);
          }
        },
        function(err) {
          console.log('yo end');

          client.end();
          callback(task, context);
        });
    });
}

exports.yoAddress = yoAddress;
bot.setAction('yoAddress', yoAddress);
