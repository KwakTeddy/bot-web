var path = require('path');
var utils = require(path.resolve('modules/bot/action/common/utils'));
var mongoose = require('mongoose');
var dateformat = require('dateformat');
var orderTypes = utils.requireNoCache(path.resolve('custom_modules/order/order.type'));
var bot = require(path.resolve('config/lib/bot')).getBot('order');

var orderHistoryTask = {
  action: orderHistory
};

bot.setTask('orderHistoryTask', orderHistoryTask);

function orderHistory(task, context, successCallback, errorCallback) {
  var model = mongoose.model('DeliveryOrder');
  var query = {user: context.user.userId};

  if(task.from || task.to) {
    query.created = {};
    if(task.from) query.created.$gte = task.from;
    if(task.to) query.created.$lte = task.to;

    console.log(task.from);
    console.log(task.to);
  }


  // query = {'created' : {"$gte": new Date(2016, 9, 1)}};
  // query.created = {"$gte": new Date(new Date(2016, 10, 1).toISOString()), "$lte": new Date(new Date(2016, 10, 10).toISOString())};

  model.find(query).
  populate('restaurant').
  limit(5).
  sort({created: -1}).
  lean().
  exec(function(err, docs) {

    task.doc = [];
    var _doc;
    for(var i in docs) {
      try {
        _doc = docs[i];
        _doc.orderDate = dateformat(_doc.created + 9 * 60 * 60, 'yyyy.mm.dd HH:MM');
        //_doc.created.getMonth() + '/' + _doc.created.getDate();
        _doc.menu = _doc.menus[0].name;
        if (_doc.menus.length > 1) _doc.menu += '등';
        task.doc.push(_doc);

      } catch(e) {}
    }

    context.dialog['history'] = task.doc;

      successCallback(task, context);
  });
}


var historyToOrderTask = {
  name: 'historyToOrderTask',
  action: function(task, context, callback) {
    if(context.dialog['history']) {
      context.dialog['restaurant'] = context.dialog['history']['restaurant'];
      context.dialog['menus'] = context.dialog['history']['menus'];
    }
    callback(task, context);
  }
};

bot.setTask('historyToOrderTask', historyToOrderTask);
