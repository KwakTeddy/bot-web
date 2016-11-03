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

    console.log('orderHistory: ' + task.from + '~' + task.to);
  }

  if(!task.from) {
    var today = new Date();
    today.setYear(today.getYear() -1);
    query.created = {$gte: today};
  }

  model.find(query).
  populate('restaurant').
  // limit(5).
  sort({created: -1}).
  lean().
  exec(function(err, docs) {
    var _doc, _docs = [];

    var words = context.dialog.inNLP.split(' ');
    for (var i = 0; i < docs.length; i++) {
      var _doc = docs[i];

      for (var j = 0; j < words.length; j++) {
        var word = words[j];
        if(word.length == 1) continue;

        if(_doc.restaurant.name.search(word) != -1) {
          _docs.push(_doc);
        } else {
          for (var k = 0; k < _doc.menus.length; k++) {
            var menu = _doc.menus[k];
            if(menu.name.search(word) != -1) {
              _docs.push(_doc);
              break;
            }
          }
        }
      }
    }

    if(!_docs || _docs.length == 0) _docs = docs;

    if(context.dialog.inNLP.search(/저번|지난번|마지막/g) != -1) {
      _docs = _docs.slice(0,1);
    }

    task.doc = [];
    for(var i = 0; i < _docs.length; i++) {
      try {
        _doc = _docs[i];
        _doc.orderDate = dateformat(_doc.created + 9 * 60 * 60, 'mm월dd일');
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


var currentOrderTask = {
  action: currentOrderAction
};

bot.setTask('currentOrderTask', currentOrderTask);

function currentOrderAction(task, context, callback) {
  var model = mongoose.model('DeliveryOrder');
  var query = {user: context.user.userId};
  query.status = {$in: ['요청', '접수']};

  model.find(query).
  populate('restaurant').
  sort({created: -1}).
  lean().
  exec(function(err, docs) {
    var _doc;
    task.doc = [];
    for(var i = 0; i < docs.length; i++) {
      try {
        _doc = docs[i];
        _doc.orderDate = dateformat(_doc.created + 9 * 60 * 60, 'mm월dd일');
        _doc.menu = _doc.menus[0].name;
        if (_doc.menus.length > 1) _doc.menu += '등';
        task.doc.push(_doc);

      } catch(e) {}
    }

    context.dialog['history'] = task.doc;

    callback(task, context);
  })
}

exports.currentOrderAction = currentOrderAction;


var orderCancel = {
  name: 'orderCancel',
  action: function(task, context, callback) {
    if(context.dialog['history']) {

      var model = mongoose.model('DeliveryOrder');
      model.update({_id: context.dialog['history']._id}, {status: '취소'}, function (err) {
      });
    }
    callback(task, context);
  }
};

bot.setTask('orderCancel', orderCancel);

