var path = require('path');
var http = require(path.resolve('modules/bot/action/common/http'));
var task = require(path.resolve('modules/bot/action/common/task'));
var bot = require(path.resolve('config/lib/bot')).getBot('order');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var tough = require('tough-cookie');

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


var yoList = {
  actionModule: http,
  action: "request",
  method: "GET",
  url: "https://www.yogiyo.co.kr",
//  path: '/list/%EC%A4%91%EA%B5%AD%EC%A7%91/%EC%84%9C%EC%9A%B8_%EA%B0%80%EC%82%B0%EB%8F%99',
//   path: '/mobile',
  path: '/api/v1/restaurants-geo/?category=%EC%B9%98%ED%82%A8&items=20&order=rank&page=0&search=&zip_code=135010',
  postCallback: function(task, context, callback) {
    var xml = task._text;

    var re = /<div.*fn_mv_shopInfo\('(.*)','(.*)'\)/g;
    //
    // xml.replace(re, function(match, p1, p2) {
    //   console.log(p1, p2);
    // });
  }
};


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



