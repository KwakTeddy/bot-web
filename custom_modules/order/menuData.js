var path = require('path');
var http = require(path.resolve('modules/bot/action/common/http'));
var bot = require(path.resolve('config/lib/bot')).getBot('order');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

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

bot.setTask('baeminDetail', baeminDetail);



