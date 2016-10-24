var path = require('path');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var mongoose = require('mongoose');
var bot = require(path.resolve('config/lib/bot')).getBot('order');
var _ = require('lodash');

var menuConcepts = [
  {menu: '치킨', concept: '기르다 느끼다'},
  {menu: '후라이드', concept: '바삭'},
  {menu: '간장치킨', concept: '짭쪼름 짠'},
  {menu: '허니치킨', concept: '달달 달콤하다 아이'},
  {menu: '양념치킨', concept: '맵다 매콤'},
  {menu: '짜장면', concept: '느끼다'},
  {menu: '짬뽕', concept: '맵다 매콤 해장'},
  {menu: '볶음밥', concept: '밥'},
  {menu: '탕수육', concept: '바삭'},
  {menu: '짬짜면', concept: '골고루 같이'},
  {menu: '탕짜면', concept: '골고루 같이'},
  {menu: '깐풍기', concept: '맵다 매콤'},
  {menu: '피자', concept: '기르다 느끼다'},
  {menu: '족발', concept: '부드럽다 야들야들'},
  {menu: '보쌈', concept: '고기'}
];

var restaurantCategory = [
  {category: '치킨', alias: '치킨 통닭 닭 chicken'},
  {category: '중국집', alias: '중국 중국집 중식 짱깨 짱께 중식당 chinese'},
  {category: '피자', alias: '피자 핏자 pizza'},
  {category: '패스트푸드', alias: '햄버거 버거 burger'},
  {category: '족발', alias: '족발 돼지발'},
  {category: '보쌈', alias: '보쌈'}
];

var menuCategory = [
  {category: '치킨', 'menu': '치킨 닭 후라이드 양념치킨 양념닭 chicken 바베큐 치맥'},
  {category: '중국집', 'menu': '짜장 짜장면 간짜장 자장면 짬뽕 잠뽕 우동 볶음밥 짬뽕밥 짜장밥 잡채밥 마파두부 쟁반짜장 탕수육 깐풍 깐소 라조 유산슬 양장피 팔보채 고추잡채 난자완스 오향장육'},
  {category: '피자', 'menu': '피자 핏자 pizza 스파케티 스파게리'},
  {category: '패스트푸드', 'menu': '햄버거 버거 burger'}
];

var menus = {
  '치킨': {desc: '언제나 진리'},
  '짜장면': {desc: '빨리되는'},
  '피자': {desc: '고소한치즈와 빵의 조화'},
  '족발': {desc: '야들야들한'},
  '햄버거': {desc: '고기패티와 함께'},
  '후라이드': {desc: '고소하게 맛있는'},
  '간장치킨': {desc: '짭쪼름한 깔끔한맛'},
  '허니치킨': {desc: '누구나 좋아하는 달콤한'},
  '양념치킨': {desc: '매콤한게 제일'},
  '짬뽕': {desc: '시원한 국물의'},
  '볶음밥': {desc: '밥이 좋아'},
  '탕수육': {desc: '그래도 요리지'},
  '짬짜면': {desc: '고민할 필요없이'},
  '탕짜면': {desc: '요리와 식사'},
  '깐풍기': {desc: '술안주로 제격'},
  '보쌈': {desc: '돼지고기의 대표'}
};

var recommendTask = {
  action: recommendAction
}

exports.recommendTask = recommendTask;

bot.setTask('recommendTask', recommendTask);

function recommendAction(task, context, callback) {
  var _doc = [];
  var words = context.dialog.inNLP.split(' ');

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if(word.length == 1) continue;
    
    for (var j = 0; j < menuConcepts.length; j++) {
      var menuConcept = menuConcepts[j];

      if(menuConcept.concept.search(word) != -1) {
        if(!_.includes(_doc, menuConcept.menu)) {
          _doc.push(menuConcept.menu);
        }
      }
    }
  }

  if(!_doc || _doc.length == 0) {
    context.dialog.recommMenu = [
      {desc: '언제나 진리', name:'치킨'},
      {desc: '빨리되는', name:'짜장면'},
      {desc: '고소한 치즈와 빵의 조화', name:'피자'},
      {desc: '야들야들한', name:'족발'},
      {desc: '고기패티와 함께', name:'햄버거'}
    ];
  } else {
    var recommMenu = [];
    for (var i = 0; i < _doc.length; i++) {
      var doc = _doc[i];
      if(menus[doc]) {
        recommMenu.push({name: doc, desc: menus[doc].desc});
      } else {
        recommMenu.push({name: doc, desc: ''});
      }
    }

    context.dialog.recommMenu = recommMenu;
  }

  if(context.dialog.recommMenu.length == 1) {
    context.dialog.recommMenu = context.dialog.recommMenu[0];
  }
  callback(task, context);
}

exports.recommendAction = recommendAction;


function orderableTypeCheck(text, format, inDoc, context, callback) {

  var matched = false;
  var words = text.split(' ');

  async.waterfall([

    // 음식점 종류 검색
    function(_cb) {
      var category, word, rCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        if(word.length == 1) continue;
        for(var j in restaurantCategory) {
          rCategory = restaurantCategory[j];

          word = RegExp.escape(word);
          if(rCategory.alias.search(new RegExp(word, 'i')) != -1) {
            category = rCategory.category;
            break;
          }
        }
      }

      if(category) {
        matched = true;
        _cb(true);
      } else {
        _cb(null);
      }
    },

    // 메뉴 종류 검색
    function(_cb) {
      var category, word, mCategory;
      for(var i in words) {
        word = words[i];
        if(category) break;
        for(var j in menuCategory) {
          mCategory = menuCategory[j];

          word = RegExp.escape(word);
          if(word.length == 1) continue;
          if(mCategory.menu.search(new RegExp(word, 'i')) != -1) {
            category = mCategory.category;
            break;
          }
        }
      }

      if(category) {
        matched = true;
        _cb(true);
      } else {
        _cb(null);
      }
    }

  ], function(err) {
    callback(text, inDoc, matched);
  });
}

exports.orderableTypeCheck = orderableTypeCheck;

var recommendToOrderTask = {
  action: recommToOrder
}

bot.setTask('recommendToOrderTask', recommendToOrderTask);


function recommToOrder(task, context, callback) {
  context.dialog.inNLP = context.dialog.recommMenu.name;
  context.dialog.inRaw = context.dialog.recommMenu.name;
  callback(task, context);
}

exports.recommToOrder = recommToOrder;

