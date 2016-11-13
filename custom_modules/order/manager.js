var path = require('path');
var facebook = require(path.resolve('./modules/bot/server/controllers/facebook.server.controller.js'));
var mongoose = require('mongoose');
var deliveryOrdersModule = require(path.resolve('modules/deliveryOrders/server/controllers/deliveryOrders.server.controller.js'));

exports.checkOrder = checkOrder;
function checkOrder(task, context, successCallback, errorCallback) {
  var pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
    // context.user.pendingCallback = null;

    if(_inRaw.search(/접수/) != -1) {
      var deliveryOrderId;
      for(var i in _context.bot.managers) {
        var manager = _context.bot.managers[i];
        deliveryOrderId = manager.deliveryOrderId;
      }
      // console.log(deliveryOrderId, '접수')
      deliveryOrdersModule.updateStatus(deliveryOrderId, '접수')

    } else if(_inRaw.search(/취소/) != -1) {
      var deliveryOrderId;
      for(var i in _context.bot.managers) {
        var manager = _context.bot.managers[i];
        deliveryOrderId = manager.deliveryOrderId;
      }
      // console.log(deliveryOrderId, '취소')
      deliveryOrdersModule.updateStatus(deliveryOrderId, '취소')

    } else {
      print('접수 또는 취소만 가능합니다!');
    }

    // if(_inRaw.search(/접수/) != -1) {
    //
    //   var managerName;
    //   for(var i in _context.bot.managers) {
    //     var manager = _context.bot.managers[i];
    //     if(manager.userId == _context.user.userId) managerName = manager.name;
    //   }
    //   if(managerName == undefined) managerName = _context.user.userId;
    //
    //   for(var i in _context.bot.managers) {
    //     var manager = _context.bot.managers[i];
    //
    //     if(_context.user.userId != manager.userId)
    //       facebook.respondMessage(manager.userId, managerName + '님이 접수하셨습니다.', _context.bot.botName);
    //     else {
    //       print('[접수완료] 수고하셨습니다!');
    //
    //       var model = mongoose.model('DeliveryOrder');
    //       model.update({_id: manager.deliveryOrderId}, {status: '접수'}, function (err) {
    //         console.log(err);
    //       });
    //     }
    //
    //     global._users[manager.userId].pendingCallback = null;
    //     manager.deliveryOrderId = null;
    //   }
    // } else if(_inRaw.search(/취소/) != -1) {
    //   var managerName;
    //   for(var i in _context.bot.managers) {
    //     var manager = _context.bot.managers[i];
    //     if(manager.userId == _context.user.userId) managerName = manager.name;
    //   }
    //   if(managerName == undefined) managerName = _context.user.userId;
    //
    //   for(var i in _context.bot.managers) {
    //     var manager = _context.bot.managers[i];
    //
    //     if(_context.user.userId != manager.userId)
    //       facebook.respondMessage(manager.userId, managerName + '님이 취소하셨습니다.', _context.bot.botName);
    //     else {
    //       print('[취소완료] 수고하셨습니다!');
    //
    //       var model = mongoose.model('DeliveryOrder');
    //       model.update({_id: manager.deliveryOrderId}, {status: '취소'}, function (err) {
    //         console.log(err);
    //       });
    //     }
    //
    //     global._users[manager.userId].pendingCallback = null;
    //     manager.deliveryOrderId = null;
    //   }
    // } else {
    //   print('접수 또는 취소만 가능합니다!');
    // }
  };

  for(var i in context.bot.managers) {
    var manager = context.bot.managers[i];
    if(global._users[manager.userId] == undefined) global._users[manager.userId] = {};
    global._users[manager.userId].pendingCallback = pendingCallback;
  }

  for(var i in context.bot.managers) {
    var manager = context.bot.managers[i];
    manager.deliveryOrderId = task.deliveryOrderId;

    facebook.respondMessage(manager.userId, '배달 주문이 접수 되었습니다.\n' +
      '배달주소: ' + context.user.address.지번주소 + '\n' +
      '배달자휴대폰: ' + context.user.mobile + '\n' +
      '매장명: ' + context.dialog.restaurant.name + '\n'+
      '메뉴: ' + context.dialog.menuStr + '\n' +
      '전화: ' + context.dialog.restaurant.phone + '\n\n' +
      '전화주문 후 "접수" 또는 "취소" 라고 말해주세요.\n\n' +
      '여러 주문을 처리할 때는 주문관리자에서 해주세요.' +
      'https://bot.moneybrain.ai/deliveryOrders', context.bot.botName);
  }
}
