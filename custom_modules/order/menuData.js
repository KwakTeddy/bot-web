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
    yoList
    // baeminLocation,
    // baeminList
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




var options = {
  desiredCapabilities: {
    browserName: 'chrome',
    logLevel: 'verbose'

  }
};

var client;

var count, i;
function yoList(task, context, callback) {
  console.log('yoList: ' + task.address);

  client.setValue('#search  div  form  input', task.address)
    .click('#button_search_address button.btn.btn-default.ico-pick')

    .waitForEnabled('//div[@id="category"]/ul/li[5]', 5000)
    .pause(1000)
    .click('//div[@id="category"]/ul/li[5]')

    .waitForEnabled('#content > div > div.restaurant-list > div:nth-child(2) > div', 5000)
    .pause(500)
    .elements("#content > div > div.restaurant-list > div > div").then(function(res) {
    i = 1;
    count = res.value.length;
    count = 4;
    console.log('item list: ' + count);
    function next() {
      if(i++ < count) {
        return client
          .waitForEnabled('#content > div > div.restaurant-list > div:nth-child(' + i + ') > div', 5000)
          .pause(500)
          .click('#content > div > div.restaurant-list > div:nth-child(' + i + ') > div')
          .waitForExist('#menu > div > div:nth-child(1) > div.panel-collapse.collapse.in > div > ul > li:nth-child(1)', 5000)
          .pause(500)
          .getHTML('html').then(function(html) {
            var task = {_text: html};
            yoParse(task, {}, null);
          })
          .back()
          .then(next);
      } else {
        return client;
      }
    }

    return next();
  })
    .pause(2000)
    .then(function() {
      callback(task, context);
    });
}

function yoParse(task, context, callback) {
  console.log('yoParse');

  var xmldomErrorHandler = {
    warning: function(w) {},
    error: function(e) {},
    fatalError: function(e) {}
  };

  var DOC_NAME = 'doc';

  //*[@id="menu"]/div/div[1]/div[1]/h4/a/span
  //*[@id="menu"]/div/div[1]/div[2]
  //*[@id="menu"]/div/div[1]/div[2]/div/ul/li[1]/span[1]
  //*[@id="menu"]/div/div[1]/div[2]/div/ul/li[1]/span[2]
  //*[@id="menu"]/div/div[1]/div[2]/div/ul/li[2]/span[1]

  var xml = task._text;
  var doc = new dom({errorHandler: xmldomErrorHandler}).parseFromString(xml);

  task.name = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[1]/span[1]/text()', doc).toString();
  task.businessHourStr = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[1]/span/text()', doc).toString();
  task.address1 = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[3]/span/text()', doc).toString();
  task.minOrder = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[3]/span/text()', doc).toString();
  task.minOrder = task.minOrder.replace(/(,|원)/g, '');
  task.payment = xpath.select('//*[@id="content"]/div[2]/div[1]/div[1]/div[2]/ul/li[4]/span/text()', doc).toString();

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

      task[DOC_NAME].push({category: category, name: name, price: price});
    }
  }

  console.log(JSON.stringify(task.doc));
}

function yoSave(task, context, callback) {
  var model = mongoose.model('RestaurantDump');

  callback(task, context);
}

exports.yoSave = yoSave;

function yo(task, context, callback) {
  client = webdriverio
    .remote(options)
    .init()
    .url('https://www.yogiyo.co.kr/')
    .pause(5000)
    .getUrl().then(function(url) {
      console.log(url);
    });

  var addresses = [
    '서울 강남구 논현동',
    '서울 강남구 청담동'
  ];

  async.eachSeries(addresses, function(address, cb) {
    yoList({address: address}, null, function(_task, _context) {
      cb(null);
    });
  }, function(err) {
    client.end();
    callback(task, context);
  });
}

exports.yo = yo;

bot.setAction('yo', yo);

// yo({}, {}, function() {});