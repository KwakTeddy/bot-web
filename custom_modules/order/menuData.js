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
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var client;

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
  module: 'http',
  action: 'simpleRequest',
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
  module: http,
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
  module: task,
  action: 'sequence',
  actions: [
    baeminLocation,
    baeminList
  ]
};

bot.setTask('baemin', baemin);

var baeminDetail = {
  module: http,
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


// var options = {
//   desiredCapabilities: {
//     browserName: '',
//     logLevel: 'verbose'
//
//   }
// };

var options = {
  host: '127.0.0.1',
  port: 9515,
  path: '/',
  desiredCapabilities: {
    browserName: 'chrome',
    logLevel: 'verbose',
    chromeOptions: {
      "args": [
        "window-size=1280,1080",
        "no-proxy-server",
        "no-default-browser-check",
        "no-first-run",
        "disable-boot-animation",
        "disable-default-apps",
        "disable-extensions",
        "disable-translate"
      ]
    }
  }
};

// var client;
// var count, i;
// var scrollHeight, preScrollHeight;

function loadingScroll(client) {
  var scrollHeight, preScrollHeight;
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

  var client = task._client;

  // console.log('yoList: ' + task.address + ', ' + task.category);

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
        .click('#button_search_address button.btn.btn-default.ico-pick')
        .pause(200)
        .getText('#search > div > form > ul > li:nth-child(1) > a')
        .catch(function(err) {
          cb(null);
        })
        .then(function(text) {
          if(text.search('검색하신 주소를 찾을 수 없습니다') != -1) {
            cb(true);
          } else {
            cb(null);
          }
        })
    },

    function(cb) {
      client
        //   .click('#button_search_address button.btn.btn-default.ico-pick')
        // .pause(200)
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
        .pause(1000)
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
        .then(function() {
          return loadingScroll(client);
        })
        .pause(500)
        .then(function() {
          cb(null);
        });
    },

    function(cb) {
      // console.log('yo get elements');
      client.elements("#content > div > div.restaurant-list > div.col-sm-6 > div").then(function(res) {
        var count, i;

        i = 0;
        count = res.value.length;
        async.whilst(
          function() { return i++ < count;},
          function(cb2) {
            // console.log('yo elements: ' + i + '/' + count);

            async.waterfall([
              function(cb3) {
                // console.log('yoList: whilst 11');

                client.waitUntil(function() {
                  return client.isExisting('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ')').then(function (isExisting) {
                    if (isExisting) {
                      return true;
                    } else{
                      return loadingScroll(client).then(function() {
                        return true;
                      });
                    }
                  })
                }, 5000)
                .then(function() {
                  // console.log('yoList: whilst 12');

                  client.waitUntil(function() {
                    // console.log('yoList: whilst 121');
                    return client.getAttribute('#spinner', 'class', function(attr) {
                      if(attr == 'ng-hide') return true;
                      else return false;
                    })
                  }, 5000)

                  .isExisting('#content > div > div.restaurant-list > div.col-sm-6:nth-child(' + i + ') > div').then(function (isExisting) {
                    // console.log('yoList: whilst 122');
                    if(isExisting) cb3(null);
                    else {
                      console.log('element 미존재: ' + i);
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
  task._client = null;

  model.find({site: task.site, restaurantId: task.restaurantId}, task, {upsert: true},function(err, docs) {
    if(err) {
      console.log('yoSave: ' + err);
    } else {
      if(docs.upserted && docs.upserted.length > 0) {
        task._id = docs.upserted[0]._id;
        model2.remove({restaurantDump: docs.upserted[0]._id}, function(err) {
          for (var j = 0; j < task.doc.length; j++) {
            var doc = task.doc[j];
            doc.restaurantDump = task._id;
          }

          if(task.doc && task.doc.length > 0) {
            model2.collection.insert(task.doc, function(err, docs) {
              if(err) {
                console.log('yoSave: ' + err);
              }
              callback(task, context);
            });
          } else {
            callback(task, context);
          }
        });
      } else {
        callback(task, context);
      }
    }
  });
}

exports.yoSave = yoSave;

function yo(task, context, callback) {
  var inRaw = context.dialog.inRaw;
  var words = inRaw.split(' ');

  // var category = '치킨';
  var category = words[1];
  var inputAddress = words.slice(2, words.length).join(' ');
  var addresses = [inputAddress];

  if(client) {
    try {
      client.end();
    } catch(e) {}
  }

  client = webdriverio
    .remote(options)
    .init();

  client.url('https://www.yogiyo.co.kr/')
  .getUrl().then(function(url) {
    console.log(url);
  })
  .pause(3000)
  .then(function() {
    async.eachSeries(addresses, function(address, cb) {
      yoList({_client: client, address: address, category: category, site: 'yo'}, null, function(_task, _context) {
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

  if(client) {
    try {
      client.end();
    } catch(e) {}
  }

    client = webdriverio
    .remote(options)
    .init();

    client.url('https://www.yogiyo.co.kr/')
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
            yoList({_client: client, address: address, category: category, site: 'yo'}, null, function(_task, _context) {
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


function google(task, context, callback) {
  console.log('start2');
  var client = webdriverio
    .remote(options)
    .init()
    .url('https://www.google.com/')
    .pause(5000)
    .getUrl().then(function(url) {
      console.log('title: ' + url);
      callback(task, context);
    })
    .end();
}

bot.setAction('google', google);



function baeList(task, context, callback) {
  console.log('baeList: ' + task.address + ', ' + task.category);

  var _client = task._client;

  var _task;
  var categoryNum;
  var restaurant_list = [];
  var i, count;

  if(task.category == '치킨') categoryNum = 1;
  else if(task.category == '중국집') categoryNum = 2;
  else if(task.category == '피자') categoryNum = 3;
  else if(task.category == '한식,분식') categoryNum = 4;
  else if(task.category == '족발,보쌈') categoryNum = 5;
  else if(task.category == '야식') categoryNum = 6;
  else if(task.category == '찜,탕') categoryNum = 7;
  else if(task.category == '돈까스,회,일식') categoryNum = 8;
  else if(task.category == '도시락') categoryNum = 9;
  else if(task.category == '패스트푸드') categoryNum = 10;

  async.waterfall([
    function(cb) {
      _client.url('http://baemin.com')
        .pause(5000)
        .alertText()
        .catch(function(err) {
          // cb(null);
        })
        .then(function(res) {
          if (res != null) {
            return this.alertAccept().then(function() {
              cb(null);
            })
          } else {
            cb(null);
          }
        });
    },

    function(cb) {
      // console.log('baeList: 1');
      _client.isExisting('#locText').then(function(isExisting) {
        if(isExisting) cb(null);
        else {
          console.log('yo input 없음: ');
          cb(true);
        }
      })
    },
    function(cb) {
      // console.log('baeList: 2');
      var _addr = task.address.split(' ');
      var dong = _addr[_addr.length - 1];

      _client
        .click('#wrap > header > section.basic-tp-area > section > fieldset.header-loc > div.set-loc')
        .setValue('#sch_addr', dong)
        .pause(500)
        .click('div.dong-srch.visible > fieldset > button')
        .pause(500)
        .then(function() {
          cb(null);
        })
    },

    function(cb) {
      _client.elements('#addrlist > ul > li > strong').then(function(res) {

        // console.log(res.value);

        i = 0;
        var existAddr = false;
        async.eachSeries(res.value, function(value, cb1) {
          _client.elementIdText(value.ELEMENT).then(function(res1) {
            if(res1.value.search('관련된 동이름을 찾을 수 없습니다.') != -1) {
              cb(true);
            } else {
              var addr = res1.value;
              var addrs = addr.split(' ');
              var taskAddrs = task.address.split(' ');
              var addrExist = false;

              if(addr === task.address) addrExist = true;
              else if (addrs[addrs.length -1] == taskAddrs[taskAddrs.length -1] &&
                addrs.slice(0, 2).join(' ') == taskAddrs.slice(0,2).join(' ')) addrExist = true;

              if(addrExist) {
                _client
                  // .scroll('#addrlist > ul > li:nth-child(' + i + ')')
                  .elementIdClick(value.ELEMENT)
                  .pause(1000)
                  .then(function() {
                    existAddr = true;
                    cb1(true);
                  })
              } else {
                i++;
                cb1(null);
              }
            }
          })
        }, function(err) {
          if(existAddr)cb(null);
          else {
            cb(true);
            // _client.click('#addrlist > ul > li:nth-child(1)')
            //   .catch(function(err) {
            //     console.log('yo element restaurant error: ' + err);
            //     cb(true);
            //   })
            //   .then(function() {
            //     cb(null);
            //   });
          }
        });
      });

    },

    function(cb) {
      _client.click('#wrap > div > div.cont.masonry > div:nth-child(' + categoryNum + ')')
        .pause(500)
        .then(function() {
          cb(null);
        });
    },

    // function(cb) {
    //   console.log('yo 스크롤');
    //   _client
    //     .then(function() {
    //       return loadingScroll(_client);
    //     })
    //     .pause(500)
    //     .then(function() {
    //       cb(null);
    //     });
    // },

    function(cb) {
      _client.elements('.shop-list > div > div').then(function(res) {
        i = 0;
        count = res.value.length;

        restaurant_list = [];
        async.whilst(
          function () {
            return i++ < count;
          },
          function (cb1) {
            _client.elementIdAttribute(res.value[i-1].ELEMENT, 'onclick').then(function(res1) {
              // console.log('yoList: whilst 01');

              var onclickVal = res1.value;
              var matched = onclickVal.match(/fn_mv_shopInfo\('(\d*)','([^']*)'\);/);
              // fn_mv_shopInfo('497944','리칭');
              var restaurantId = matched[1];
              var restaurantName = matched[2];

              restaurant_list.push({site: 'bae', category: [task.category], restaurantId: restaurantId, name: restaurantName});

              cb1(null);
            })
          },
          function(err) {

            // console.log(JSON.stringify(restaurant_list));

            i = 0;
            async.whilst(
              function () {
                return i++ < count;
              },
              function (cb1) {
                // console.log('yo elements: ' + i + '/' + count);
                async.waterfall([

                  function(cb2) {
                    // console.log('yoList: whilst 32: ' + i + '/' + count + ' ' + restaurant_list[i-1]);

                    var model = mongoose.model('RestaurantDump');
                    model.find({site: 'bae', restaurantId: restaurant_list[i-1].restaurantId}, function(err, docs) {
                      if(err) {
                        cb2(true);
                      } else {
                        if(docs.length > 0) {
                          console.log('Restaurant Exist SKIP: site: bae,' + restaurant_list[i-1].restaurantId + ',' + restaurant_list[i-1].name);
                          cb2(true);
                        } else {
                          console.log(restaurant_list[i-1].restaurantId + ',' + restaurant_list[i-1].name);

                          cb2(null);
                        }
                      }
                    })
                  },

                  function(cb2) {
                    _client.url('http://www.baemin.com/shop/' + restaurant_list[i-1].restaurantId + '/' + restaurant_list[i-1].name)
                      .pause(1000)
                      .alertText()
                      .catch(function(err) {
                        // cb(null);
                      })
                      .then(function(res) {
                        if (res != null) {
                          return this.alertAccept().then(function() {
                            cb2(null);
                          })
                        } else {
                          cb2(null);
                        }
                      });

                      // .then(function() {
                      //   cb2(null);
                      // })
                  },

                  function(cb2) {
                    _client
                      .getHTML('html').then(function(html) {
                        _task = {site: task.site, category: [task.category], restaurantId: restaurant_list[i-1].restaurantId, name: restaurant_list[i-1].name};
                        _task._text = html;
                      })
                      .then(function() {
                        // console.log('yoList: whilst 4');
                        baeDetail(_task, context, function(_task, _context) {
                          // console.log('yoList: whilst 41');
                          cb2(null);
                        })
                      })
                  },

                  function(cb2) {
                    // console.log('yoList: whilst 5');
                    yoSave(_task, context, function(_task, _context) {
                      // console.log('yoList: whilst 51');
                      cb2(null, true);
                    })
                  }

                ], function (err, isRestaurant) {
                  // console.log('yoList: whilst 6');
                    cb1(null);
                  // }
                })
              },

              function(err) {
                cb(null);
              }
            )
          }
        );

      })
    }

  ], function(err) {
    callback(task, context);
  });
}

exports.baeList = baeList;

function lotteriaList(task, context, callback) {
  var xmldomErrorHandler = {
    warning: function (w) {
      console.log(w);
    },
    error: function (e) {
      console.log(e);
    },
    fatalError: function (e) {
      console.log(e);
    }
  };
  var list = [];

  var client = webdriverio
      .remote(options)
      .init()
      .then(function () {
        client.url('http://www.lotteria.com/Shop/Shop_List.asp#devCallShopList')
            .pause(2000)
            .click('#content > div > div.bx_flex.bx_list_02.clfix > div.searchStoreWrap.hidden > ul > li:nth-child(4) > a')
            .pause(2000)
            .getHTML('//*[@id="devCallShopList"]/div[1]/div[2]').then(function (html) {
                  i = 0;
                  count = 10;
                  async.whilst(
                      function () {
                        return i++ < count;
                      },
                      function (cb1) {
                        var j = 2;
                        var pages = 13;
                        async.whilst(
                            function () {
                              return j++ < pages;
                            },
                            function (cb2) {
                              client.pause(4000)
                                .click('#devCallShopList > div.paging_basic > span > a:nth-child(' + j + ')')
                                  .catch(function(err) {
                                      console.log(err);
                                  })
                                .pause(3000)
                                .getHTML('//*[@id="devCallShopList"]/div[1]/div[2]').then(function (html) {
                                  var DOC_NAME = 'doc';
                                  task[DOC_NAME] = [];
                                  var name = ".//td[1]/a/text()";
                                  var phone = ".//td[3]/text()"
                                  var xml = html;
                                  var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);
                                  var nodes = xpath.select("//tr", doc)
                                  console.log(nodes[0]);
                                  for (var i = 1; nodes && i < nodes.length; i++) {
                                    var node = nodes[i];
                                    var restaurantname = xpath.select(name, node).toString();
                                    console.log(restaurantname);
                                    var restaurantphone = xpath.select(phone, node).toString();
                                    console.log(restaurantphone);
                                    list.push({name: restaurantname, phone: restaurantphone});
                                  }}).then(function() {
                                cb2(null);
                                console.log('종료')
                              })

                            }, function(err) {
                              client.click('#devCallShopList > div.paging_basic > span > a.go.next > img')
                                  .then(function() {
                                    console.log('하위 while 종료');
                                    cb1(null);
                                  });
                            }
                        )
                      }, function(err) {
                        console.log('상위 while 종료');
                        console.log(list.length);
                        var cnt = 0;
                        async.eachSeries(list, function(item, cb) {
                          // console.log(item.name, item.phone);

                          item.name = item.name.trim();
                          // item.name = item.name.replace(', ', '');
                          // item.name = item.name.replace(' ', '');
                          item.name = '롯데리아' + item.name;
                          // if(item.name.endsWith('점')) item.name = item.name.substring(0, item.name.length -1);
                          var Restaurant = mongoose.model('Restaurant');

                          // Restaurant.find({name: new RegExp('^' + item.name, 'i')}, function(err, docs) {
                          //   for(var k = 0; docs && k < docs.length ; k++) {
                          //     console.log((cnt++) + ':' + docs[k].name);
                          //   }
                          //
                          //   cb(null);
                          // });

                          Restaurant.update({name: new RegExp('^' + item.name, 'i')}, {$set: {deliverable: true}}, {multi: 1}, function(err, res) {
                            console.log(item.name + ',' + JSON.stringify(res));
                            cb(null);
                          });

                        }, function(err) {
                          callback(task, context);
                        });
            }
        )
      })
})};

exports.lotteriaList = lotteriaList;
bot.setAction('lotteriaList', lotteriaList);

function McList(task, context, callback) {
  var xmldomErrorHandler = {
    warning: function (w) {
      console.log(w);
    },
    error: function (e) {
      console.log(e);
    },
    fatalError: function (e) {
      console.log(e);
    }
  };

  var list = [];

  var client = webdriverio
      .remote(options)
      .init()
      .then(function () {
        client.url('http://www.mcdonalds.co.kr/www/kor/findus/district.do?sSearch_yn=Y&skey=2&skeyword=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&sflag4=-4-')
            .pause(2000)
            .getHTML('//*[@id="print_div"]/div[2]').then(function (html) {
          i = 0;
          count = 4;
          async.whilst(
              function () {
                return i++ < count;
              },
              function (cb1) {
                var j = 2;
                var pages = 7;
                async.whilst(
                    function () {
                      return j++ < pages;
                    },
                    function (cb2) {
                      client.pause(4000)
                          .click('#print_div > div.searchResult > div > a:nth-child(' + j + ')')
                          .catch(function(err) {
                            console.log(err);
                          })
                          .pause(3000)
                          .getHTML('//*[@id="print_div"]/div[2]').then(function (html) {
                        var DOC_NAME = 'doc';
                        task[DOC_NAME] = [];
                        var name = ".//div[@class='detail']/dl[@class='clearFix']/dt/a/text()";
                        var phone = ".//div[@class='detail']/dl[@class='clearFix']/dd[1]/text()"
                        var xml = html;
                        var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);
                        var nodes = xpath.select(".//ul[@class='resultList']/li", doc)
                        console.log(nodes[0]);
                        for (var i = 0; nodes && i < nodes.length; i++) {
                          var node = nodes[i];
                          var restaurantname = xpath.select(name, node).toString();
                          console.log(restaurantname);
                          var restaurantphone = xpath.select(phone, node).toString();
                          console.log(restaurantphone);

                          list.push({name: restaurantname, phone: restaurantphone});
                        }}).then(function() {
                        cb2(null);
                        // cb2(true);
                        console.log('종료')
                      })

                    }, function(err) {
                      client.click('#print_div > div.searchResult > div > a.btn_next > img')
                          .pause(4000)
                          .then(function() {
                            console.log('하위 while 종료');
                            cb1(null);
                            // cb1(true);
                          });
                    }
                )
              }, function(err) {
                console.log('상위 while 종료');
                  console.log(list.length);
                  var cnt = 0;
                  async.eachSeries(list, function(item, cb) {
                    // console.log(item.name, item.phone);

                    item.name = item.name.trim();
                    item.name = item.name.replace(', ', '');
                    item.name = item.name.replace(' ', '');
                    item.name = '맥도날드 ' + item.name;
                    if(item.name.endsWith('점')) item.name = item.name.substring(0, item.name.length -1);
                    var Restaurant = mongoose.model('Restaurant');

                    // Restaurant.find({name: new RegExp('^' + item.name, 'i')}, function(err, docs) {
                    //   for(var k = 0; docs && k < docs.length ; k++) {
                    //     console.log((cnt++) + ':' + docs[k].name);
                    //   }
                    //
                    //   cb(null);
                    // });

                    Restaurant.update({name: new RegExp('^' + item.name, 'i')}, {$set: {deliverable: true}}, {multi: 1}, function(err, res) {
                      console.log(item.name + ',' + JSON.stringify(res));
                        cb(null);
                    });

                }, function(err) {
                    callback(task, context);
                  });

                // for(var i = 0; i < list.length; i++) {
                //   var item = list[i];
                //   console.log(item.name, item.phone);
                //
                //   item.name = item.name.trim();
                //   item.name = item.replace(', ', '');
                //   item.name = '맥도날드 ' + item.name;
                //
                //   var Restaurant = mongoose.model('Restaurant');
                //
                //   Restaurant.find({name: item.name}, function(err, docs) {
                //     for(var k = 0; docs && k < docs.length ; k++) {
                //       console.log(k + ':' + docs[k].name);
                //     }
                //   });
                //
                //   // Restaurant.update({name: item.name}, {$set: {deliverable: true}}, {multi: 1}, function(err, res) {
                //   //   console.log(item.name + ',' + JSON.stringify(res));
                //   // });
                // }
                //
                // callback(task, context);
              }
          )
        })
      });
};


exports.McList = McList;
bot.setAction('McList', McList);

function baeDetail(task, context, callback) {
  var xmldomErrorHandler = {
    warning: function (w) {},
    error: function (e) {},
    fatalError: function (e) {}
  };


  var DOC_NAME = 'doc';

  var repeat = "//section[@class='menu-sect panel-group']/div[@class='panel panel-default']";
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

  task.address1 = xpath.select('//div/section/div[1]/div/span[1]/text()', doc).toString();
  task.businessHourStr = xpath.select('//div/section/div[2]/div[1]/section[1]/dl/dd[2]/text()', doc).toString();
  var phoneElem = xpath.select('//div/section/div[2]/div[1]/section[1]/dl/dd[3]', doc)[0].firstChild.textContent;
  var matched = phoneElem.match('content="([^"]*)">(.*)');
  task.phone1 = matched[1];
  task.phone = matched[2];
  task.payment = [];
  var paymentElem = xpath.select('//div/section/div[1]/div/div/span', doc);
  for (var i = 0; i < paymentElem.length; i++) {
    var obj = paymentElem[i].textContent;
    task.payment.push(obj.toString());
  }
  task.minOrder = xpath.select('//div/section/div[2]/div[1]/section[1]/dl/dd[1]/text()', doc).toString();
  task.minOrder = task.minOrder.replace(',', '');
  task.minOrder.replace(/(\d+)/, function(match, p1) { task.minOrder = p1; return p1});

  var nodes = xpath.select(repeat, doc);

  task[DOC_NAME] = [];
  for (var i = 0; nodes && i < nodes.length; i++) {
    var node = nodes[i];
    var _category = xpath.select(title, node).toString();
    _category = _category.replace(/,/, '').trim()


    var _menus = xpath.select(menus, node);
    for (var j = 0; j < _menus.length; j++) {
      var docMenu = {};

      var node2 = _menus[j];
      var _name = xpath.select(name, node2).toString();
      var _price = xpath.select(price, node2).toString();
      _price = _price.replace(',', '');
      _price = _price.replace('원', '');

      docMenu.category = [_category];
      docMenu.name = _name;
      docMenu.price = _price;

      // console.log(_category, _name, _price);

      var _options = xpath.select(options, node2);
      for (var k = 0; k < _options.length; k++) {
        var _option = _options[k];

        // console.log(_option.toString());

        try {
          var _optTitle = xpath.select(optTitle, _option).toString();
          _optTitle = _optTitle.replace(/,/, '').trim();
          var _type = xpath.select(".//span[@class='text-primary']/text()", _option).toString();

          var options2;
          var _radio = xpath.select(".//label[@class='radio-inline']", _option);
          if(_radio && _radio.length > 0) options2 = _radio;
          var _check = xpath.select(".//label[@class='checkbox-inline']", _option);
          if(_check && _check.length > 0) options2 = _check;

          var docOptions = [];
          for (var l = 0; options2 && l < options2.length; l++) {
            var sp = options2[l].textContent.trim().split(':');
            // console.log(options2[l].textContent.trim());
            if(sp.length <= 1) continue;

            var _name = sp[0];
            _name = _name.replace(/^(\d+\.\s*)/g, function(match, p1) {return '';});
            var _price = sp[1];
            _price = _price.replace(',', '');
            _price = _price.replace('원', '');

            docOptions.push({name: _name, price: _price});
          }

          // console.log(_optTitle, _type, docOptions);

          if (_radio && _radio.length > 0) {
            if (docOptions.length > 1) {
              if (!docMenu.options) docMenu.options = [];
              docMenu.options.push({optionName: _optTitle, optionValues: docOptions});
            }
          } else if(_check && _check.length > 0) {
            if (!docMenu.additions) docMenu.additions = [];
            docMenu.additions.push({optionName: _optTitle, optionValues: docOptions});
            // docMenu.additions.push({name: sp[0], price: sp[1]});
          }
          // console.log(_optTitle, _type, _radio);

        } catch (e) {
          console.log(e);
        }
      }

      task[DOC_NAME].push(docMenu);
      // console.log(JSON.stringify(docMenu, null, 1));
    }
  }

  callback(task, context);
}

exports.baeDetail = baeDetail;



function bae(task, context, callback) {
  var inRaw = context.dialog.inRaw;
  var words = inRaw.split(' ');

  // var category = '치킨';
  var category = words[1];
  var inputAddress = words.slice(2, words.length).join(' ');

  // 너무 큰파일은 안됨 200M
  var text = fs.readFileSync(path.resolve('dump/address_dong.txt'));
  text =utils.convertEncoding('euc-kr', 'UTF-8', text);

  var lines = text.split('\r\n');

  if(client) {
    try {
      client.end();
    } catch(e) {}
  }

  client = webdriverio
    .remote(options)
    .init();

    // .url('http://www.baemin.com/')
    client.getViewportSize().then(function(size) {
      console.log(size);
    })
    .setViewportSize({width: 1200, height: 5000}, false)
    .getViewportSize().then(function(size) {
      console.log(size);
    })
    // .pause(5000)
    .then(function() {
      async.eachSeries(lines, function(line,cb) {
        var val = line.split('\t');

        var address = val.slice(1, val.length - 1).join(' ');

        if(address.search(inputAddress) != -1 && address != inputAddress && val[val.length -1].trim() == '존재') {
          baeList({_client: client, address: address, category: category, site: 'bae'}, null, function(_task, _context) {
            cb(null);
          });
        } else {
          cb(null);
        }
      },
      function(err) {
        console.log('bae end');

        client.end();
        callback(task, context);
      });
    });
}

exports.bae = bae;

bot.setAction('bae', bae);

function baeTest(task, context, callback) {
  var inRaw = context.dialog.inRaw;
  var words = inRaw.split(' ');

  // var category = '치킨';
  var category = words[1];
  var inputAddress = words.slice(2, words.length).join(' ');

  if(client) {
    try {
      client.end();
    } catch(e) {}
  }

  client = webdriverio
    .remote(options)
    .init();

    client.getViewportSize().then(function(size) {
      console.log(size);
    })
    .setViewportSize({width: 1200, height: 5000}, false)
    .getViewportSize().then(function(size) {
      console.log(size);
    })
    .then(function() {
      baeList({_client: client, address: inputAddress, category: category, site: 'bae'}, null, function (_task, _context) {
        client.end();
        callback(task, context);

      });
    });
}

exports.baeTest = baeTest;

bot.setAction('bt', baeTest);


function updateDump(task, context, callback) {

  var restaurant = mongoose.model('Restaurant');
  var menu = mongoose.model('Menu');
  var restaurantdump = mongoose.model('RestaurantDump');
  var menudump = mongoose.model('MenuDump');

  var query = {category: '중국집', 'address.시도명': '서울특별시'};
  var query2;
  restaurant.find(query, function(err, docs) {
    if(err) {
      console.log(err);
      callback(task, context);
    } else {
      console.log(docs.length);

      async.eachSeries(docs, function(_restaurant, cb) {
          // query2 = {name: _restaurant.name};
          query2 = {name: _restaurant.name.replace(' ', '-')};

          restaurantdump.find(query2).exec(function(err2, docs2) {
            if(err2) {
              cb(null);
            } else {
              var target = {};

              for (var i = 0; i < docs2.length; i++) {
                var doc = docs2[i];
                var addr;
                if(doc.address1) addr = doc.address1.trim().split(' ');

                // console.log(_restaurant.name, addr, _restaurant.address.시도명, addressModule.시도명역변경(_restaurant.address.시도명), _restaurant.address.시군구명, _restaurant.address.법정읍면동명);

                if(addr &&
                  (addr[0] == _restaurant.address.시도명 || addr && addr[0] == addressModule.시도명역변경(_restaurant.address.시도명)) &&
                  addr[1] == _restaurant.address.시군구명 &&
                  (addr[2] == _restaurant.address.법정읍면동명 || addr[2] == _restaurant.address.행정동명)) {
                  // console.log(_restaurant.name, doc.site);
                  target[doc.site] = doc;
                }
              }

              if(target['yo'] || target['bae']) {
                var _restauranttarget;
                if(target['yo']) _restauranttarget = target['yo'];
                else if(target['bae']) _restauranttarget = target['bae'];

                if(_restauranttarget.site == 'yo') {
                  var matched = _restauranttarget.businessHourStr.match(/([\d:]+) - ([\d:]+)/);
                  var start, end;
                  if(matched) {
                    start = matched[1];
                    end = matched[2];

                    // console.log(_restauranttarget.site + ' 영업시간:' + start + '-' + end);
                    _restaurant.businessHours = [
                      {
                        day: '', start: start, end: end
                      }
                    ];
                  }

                } else if(_restauranttarget.site == 'bae') {
                  var matched = _restauranttarget.businessHourStr.match(/([가-힣]+) ([\d:]+) ~ ([가-힣]+) ([\d:]+)/);
                  var start, start0, start1, end, end0, end1;
                  if(matched) {
                    start0 = matched[1];
                    start1 = matched[2];
                    end0 = matched[3];
                    end1 = matched[4];

                    if(start0 == '오후') {
                      var sp = start1.split(':');
                      start = (Number(sp[0]) + 12) + ':' + sp[1];
                    } else {
                      start = start1;
                    }

                    if(end0 == '오후') {
                      var sp = end1.split(':');
                      end = (Number(sp[0]) + 12) + ':' + sp[1];
                    } else {
                      end = end1;
                    }

                    // console.log(_restauranttarget.site + ' 영업시간:' + start + '-' + end);
                    _restaurant.businessHours = [
                      {
                        day: '', start: start, end: end
                      }
                    ];
                  } else if(_restauranttarget.businessHourStr == '24시간 운영') {
                    _restaurant.businessHours = [
                      {
                        day: '', start: '00:00', end: '24:00'
                      }
                    ];
                  }
                }

                _restaurant.minOrder = _restauranttarget.minOrder;
                _restaurant.deliverable = true;
                _restaurant.save();

                console.log(_restaurant.name + ' ' + _restauranttarget.site + ' ' + _restaurant._id + ' '
                  + _restaurant.minOrder + ' ' + (_restaurant.businessHours ? _restaurant.businessHours[0].start + '-' + _restaurant.businessHours[0].end: ''));

                menudump.find({restaurantDump: _restauranttarget._id}).lean().exec(function(err3, docs3) {
                  if(err3) {
                    cb(null);
                  } else {
                    if(docs3.length > 0) {
                      menu.remove({restaurant: _restaurant._id}, function(err, removed) {
                        if(err) {
                          console.log('remove: ' + err);
                          cb(null);
                        } else {
                          // console.log('removed: ' + removed);

                          for (var j = 0; j < docs3.length; j++) {
                            docs3[j]._id = undefined;
                            docs3[j].restaurantDump = undefined;
                            docs3[j].restaurant = _restaurant._id;
                          }

                          menu.collection.insert(docs3, function(err, docs4) {
                            if(err) {
                              console.log('updateDump: ' + err);
                            }
                            // console.log('menu inserted ' +  docs4.insertedCount);

                            cb(null);
                          });
                        }
                      });
                    } else {
                      cb(null);
                    }
                  }
                });
              } else {
                // console.log(_restaurant.name + ' not exist');
                cb(null);
              }
            }
          });
        },
        function(err) {
          callback(task, context);
        })
    }
  });
}

exports.updateDump = updateDump;
bot.setAction('updateDump', updateDump);


function checkRestaurantAddress(task, context, callback) {

  var restaurantModel = mongoose.model('Restaurant');

  var q = {$where: function() {
    var address, s1, s2, 시군구명1, 시군구명2;
    address = this.address1;
    if(!address || address === '') address = this.address2;
    if(address) s1 = address.split(' ');
    if(s1 && s1.length > 1) 시군구명1 = s1[1];
    if(this.address) {
      if (this.address.시군구명.search(' ') != -1) {
        s2 = this.address.시군구명.split(' ');
        if (s2 && s2.length > 1) 시군구명2 = s2[0];
      } else {
        시군구명2 = this.address.시군구명;
      }
    }

    if(!this.address) return false;
    else if(!address || !this.address || !시군구명1 || !시군구명2 || 시군구명1 != 시군구명2) return true;
    else return false;
  }};

  restaurantModel.find(q).lean().exec(function(err, docs) {
    if(err) {
      console.log(err);
    } else {
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        console.log(doc.name + ', ' + doc.address1 + ', ' + doc.address2 + ', ' + (doc.address ? doc.address.시군구명: 'no 시군구명') + ', ' + (doc.address ? doc.address.지번주소: 'no address'));
      }
    }
  });
  callback(task, context);
}

exports.checkRestaurantAddress = checkRestaurantAddress;

function restaurantGeocode(task, context, callback) {
  var restaurant = mongoose.model('Restaurant');

  // var query = {'address.시도명': '서울특별시', lng: {$exists: false}};
  // var query = {franchise: {$exists: true}, lng: {$exists: false}};
  var query = {deliverable: true};

  restaurant.find(query, function(err, docs) {
    if(err) {
      console.log(err);
      callback(task, context);
    } else {
      async.eachSeries(docs, function(doc, cb) {
        if(doc.address) {
          addressModule.naverGeocode(doc, context, function(doc, context) {
            if(doc.lng && doc.lat) {
              doc.save(function (err) {
                if(err) console.log(err);
                console.log(doc.name + ': ' + doc.lng + ', ' + doc.lat);
                cb(null);
              });
            } else {
              console.log(doc.name + ': ');
              cb(null);
            }
          })
        } else {
          cb(null);
        }
      }, function(err) {
        callback(task, context);
      });
    }
  });
}

exports.restaurantGeocode = restaurantGeocode;
bot.setAction('restaurantGeocode', restaurantGeocode);


function botuserGeocode(task, context, callback) {
  var BotUser = mongoose.model('BotUser');

  BotUser.find({}, function(err, docs) {
    if(err) {
      console.log(err);
      callback(task, context);
    } else {
      async.eachSeries(docs, function(doc, cb) {
        if(doc.address) {
          addressModule.naverGeocode(doc, context, function(doc, context) {
            if(doc.lng && doc.lat) {
              doc.save(function (err) {
                if(err) console.log(err);
                console.log(doc.userKey + ': ' + doc.lng + ', ' + doc.lat);
                cb(null);
              });
            } else {
              console.log(doc.userKey + ': ');
              cb(null);
            }
          })
        } else {
          cb(null);
        }
      }, function(err) {
        callback(task, context);
      });
    }
  });
}

exports.botuserGeocode = botuserGeocode;
bot.setAction('botuserGeocode', botuserGeocode);
