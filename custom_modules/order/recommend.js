var path = require('path');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var mongoose = require('mongoose');
var bot = require(path.resolve('config/lib/bot')).getBot('order');

var menuConcept = [
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

var recommendTask = {
  action: recommendAction
}

exports.recommendTask = recommendTask;

bot.setTask('recommendTask', recommendTask);

function recommendAction(task, context, callback) {

  // var words = task.inNLP.split(' ');

  // context.dialog.recommMenu = {adj: '언제나 진리', name:'치킨'};

  context.dialog.recommMenu = [
    {adj: '언제나 진리', name:'치킨'},
    {adj: '빨리되는', name:'짜장면'},
    {adj: '고소한 치즈와 빵의 조화', name:'피자'},
    {adj: '야들야들한', name:'족발'},
    {adj: '고기패티와 함께', name:'햄버거'}
  ];

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