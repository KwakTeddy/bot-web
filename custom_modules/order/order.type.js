var path = require('path');
var botlib = require(path.resolve('./engine/core/bot'));
var bot = botlib.getBot('order');

function menuCategoryCheck(inRaw, inNLP, dialog, context, callback) {
  var num = Number(inRaw);
  if (num >= 1 && num <= 5) {
    if(num == 1) context.dialog.restaurantCategory = '치킨';
    else if(num == 2) context.dialog.restaurantCategory = '중국집';
    else if(num == 3) context.dialog.restaurantCategory = '피자';
    else if(num == 4) context.dialog.restaurantCategory = '족발';
    else if(num == 5) context.dialog.restaurantCategory = '패스트푸드';

    callback(true);
  } else if(inRaw.trim() === '치킨') {
    context.dialog.restaurantCategory = '치킨';
    callback(true);
  } else if(inRaw.trim() === '중국집') {
    context.dialog.restaurantCategory = '중국집';
    callback(true);
  } else if(inRaw.trim() === '피자') {
    context.dialog.restaurantCategory = '피자';
    callback(true);
  } else if(inRaw.trim() === '족발') {
    context.dialog.restaurantCategory = '족발';
    callback(true);
  } else if(inRaw.trim() === '패스트푸드') {
    context.dialog.restaurantCategory = '패스트푸드';
    callback(true);
  } else {
    callback(false);
  }
}

exports.menuCategoryCheck = menuCategoryCheck;


function orderDialogCondition(inRaw, inNLP, dialog, context, callback) {
  if(context.botUser.currentDialog && context.botUser.currentDialog.top && context.botUser.currentDialog.top.name == '배달주문')
    callback(true);
  else
    callback(false);
}

exports.orderDialogCondition = orderDialogCondition;

