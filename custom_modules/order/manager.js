var path = require('path');
var facebook = require(path.resolve('./modules/bot/server/controllers/facebook.server.controller.js'));

exports.checkOrder = checkOrder;
function checkOrder(task, context, successCallback, errorCallback) {
  var pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
    // context.user.pendingCallback = null;
    var re = new RegExp('접수', 'g');
    if(_inRaw.search(re) != -1) {

      var managerName;
      for(var i in _context.bot.managers) {
        var manager = _context.bot.managers[i];
        if(manager.userId == _context.user.userId) managerName = manager.name;
      }
      if(managerName == undefined) managerName = _context.user.userId;

      for(var i in _context.bot.managers) {
        var manager = _context.bot.managers[i];

        global._users[manager.userId].pendingCallback = pendingCallback;

        if(_context.user.userId != manager.userId)
          facebook.respondMessage(manager.user, managerName + '님이 접수하셨습니다.');
      }

      print('수고하셨습니다!');
    }
  };


  for(var i in context.bot.managers) {
    var manager = context.bot.managers[i];
    global._users[manager.userId].pendingCallback = pendingCallback;
  }

  context.user.pendingCallback = function(_inRaw, _inNLP, _inDoc, _context, print) {
    context.user.pendingCallback = null;
    var re = new RegExp('접수', 'g');
    if(_inRaw.search(re) != -1) {

      var managerName;
      for(var i in context.bot.managers) {
        var manager = context.bot.managers[i];
        if(manager.userId == _context.user.userId) managerName = manager.name;
      }
      if(managerName == undefined) managerName = _context.user.userId;

      for(var i in context.bot.managers) {
        var manager = context.bot.managers[i];
        if(_context.user.userId != manager.userId)
          facebook.respondMessage(manager.user, managerName + '님이 접수하셨습니다.');
      }

      print('수고하셨습니다!');
    }
  };

  for(var i in context.bot.managers) {
    var manager = context.bot.managers[i];
    facebook.respondMessage(manager.userId, '배달 주문이 접수 되었습니다.\n' +
      '주소: ' + task.topTask.address.address + '\n' +
      '음식점: ' + task.topTask.restaurant.name + '\n'+
      '메뉴: ' + task.topTask.menu.name + ' ' + task.topTask.menu.price + '\n' +
      '전화: ' + task.topTask.restaurant.phone + '\n\n' +
      '전화주문 후 "접수"라고 얘기해주세요.', context.bot.botName);
  }
}
