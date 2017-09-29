var path = require('path');
var path = require('path');
var bot = require(path.resolve('./engine/core/bot')).getBot('Shopping_bot_ch');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var type = require(path.resolve('./modules/bot/action/common/type'));
var logger = require(path.resolve('./config/lib/logger'));
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var async = require('async');
var order = mongo.getModel('shopping_ch_orders');
var item = mongo.getModel('shopping_ch_items');
var category = mongo.getModel('shopping_ch_categories');

const IN_TAG_START = '{';
const IN_TAG_END = '}';

var itemdetail = {
    name: 'itemdetail',
    action: function(task, context, callback) {
        task.buttons = [
            {
                text: "直接前往商品",
                url: context.dialog.listType3.item_link
            }
        ]
        callback(task,context);
    }
};
bot.setTask("itemdetail", itemdetail);


var itemlist = {
    name: 'itemlist',
    action: function(task, context, callback) {
        item.find({item_category: context.dialog.listType2._id}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.items = docs;
                callback(task,context);
            }
        });
    }
};
bot.setTask("itemlist", itemlist);


var categorylist = {
    name: 'categorylist',
    action: function(task, context, callback) {
        category.find({}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.category = docs;
                callback(task,context);
            }
        });
    }
};
bot.setTask("categorylist", categorylist);

var orderlist = {
    name: 'orderlist',
    action: function(task, context, callback) {
        //context.dialog.title = 'ttt';
        // context.dialog.order = [
        //     {
        //         order_simplestatus: '배송중',
        //         order_product: '장난감'
        //     },
        //     {
        //         order_simplestatus: '배송중',
        //         order_product: '장난감'
        //     },
        // ]
        context.dialog.options = 'S, M, L';
        context.dialog.curr_option = 'S';



        order.find({}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {
                async.eachSeries(docs, function(doc, cb) {
                    item.find({_id: doc.order_product}).lean().exec(function(err, items) {
                        if (err) {
                            console.log(err);
                            callback(task, context);
                        } else {
                            if (items) doc.order_product = items[0].item_name;
                            cb(null)
                        }
                    })
                }, function (err) {
                    context.dialog.order = docs;
                    callback(task,context);
                });
            }
        });
    }
};
bot.setTask("orderlist", orderlist);

var checkorderstatus = {
    name: 'checkorderstatus',
    action: function(task, context, callback) {
        if (context.dialog.listType.order_simplestatus == '配送中') {
            context.dialog.orderstatuscheck = 1;
        } else if (context.dialog.listType.order_simplestatus == '配送准备中') {
            context.dialog.orderstatuscheck = 2;
        }
        callback(task,context);
    }
};
bot.setTask("checkorderstatus", checkorderstatus);

var listType3 = {
    name: "items",
    listName: "items",
    typeCheck: "listTypeCheck"
};

bot.setType("listType3", listType3);

var listType2 = {
    name: "category",
    listName: "category",
    typeCheck: "listTypeCheck"
};

bot.setType("listType2", listType2);


var listType = {
    name: "order",
    listName: "order",
    typeCheck: "listTypeCheck"
};

bot.setType("listType", listType);

var mobileType = {
    name: 'mobile',
    raw: true,
    context: true,
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text, type, inDoc, context) {
        if(text.search(/[^\d-]/g) != -1) return '只能使用数字和记号';
        else if(text.length < 13) return '手机位数不符';
        else return '请以手机号码形式输入';
    }
};

bot.setType("mobile", mobileType);

function regexpTypeCheck (text, type, task, context, callback) {
    var re = type.regexp;
    var matched = false;

    logger.debug('');
    logger.debug('type.js:regexpTypeCheck: START ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    text = text.replace(re, function(match, p1, offset, string) {
        matched = true;

        // if(task[type.name]) {
        //   if(Array.isArray(task[type.name])) task[type.name].push(p1);
        //   else task[type.name] = [task[type.name], p1];
        // } else {
        task[type.name] = p1;
        // }

        return IN_TAG_START + type.name + IN_TAG_END;
    });

    if(matched)
        logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    callback(text, task, matched);
};

var SMSAuth = {
    name: 'SMSAuth',
    preCallback: function(task, context, callback) {
        if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        console.log('ddd');
        callback(task, context);
    },
    action: messages.sendSMSAuth
};
bot.setTask("SMSAuth", SMSAuth);
