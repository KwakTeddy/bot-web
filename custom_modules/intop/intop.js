var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('intop');
var async = require('async');

var searchCategory = {
  action: function (task,context,callback) {
    var category = mongo.getModel('gas_item_category');
    category.find({$and:[{parent_id:0},{name:{$not:/Common/}}]}).lean().exec(function(err, docs) {
      context.dialog.categoryone = docs;
      callback(task, context);
    });
  }
};

bot.setTask('searchCategory', searchCategory);

var searchCategorychild= {
  action: function (task,context,callback) {
    var category = mongo.getModel('gas_item_category');
    category.find({parent_id:context.dialog.categoryone.id}).lean().exec(function(err, docs) {
      if (docs.length != 0) {
        context.dialog.categorychild = docs;
      } else {
        context.dialog.categorychild = null;
      }
      callback(task, context);
    });
  }
};

bot.setTask('searchCategorychild', searchCategorychild);

var showProducts= {
  action: function (task,context,callback) {
    var item = mongo.getModel('gas_crawl_items');
    var id = context.dialog.categoryone.id.toString();
    var parent = context.dialog.categoryone.parent_id.toString();
    item.find({$or:[{item_category: id},{item_category: parent}]}).lean().exec(function(err, docs) {
      if (docs.length != 0) {
        context.dialog.item = docs;
      } else {
        context.dialog.item = null;
      }
      callback(task, context);
    });
  }
};

bot.setTask('showProducts', showProducts);
