var path = require('path');
var bot = require(path.resolve('./engine/core/bot')).getBot('Shopping_bot_upgr');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
// var logger = require(path.resolve('./config/lib/logger'));
//
// const IN_TAG_START = '{';
// const IN_TAG_END = '}';

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


//-------------------------------------------DummyDatas------------------------------------------------

var order = [
    {
        order_product : "유니클로 스키니진",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_address : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_date : "2017-07-26",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송완료"
    },
    {
        order_product : "H&M 미니스커트",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_address : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_date : "2017-07-26",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송중"
    },
    {
        order_product : "탑텐 블라우스",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_address : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_date : "2017-07-26",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송대기중"
    }
];



//-------------------------------------------Types-----------------------------------------------------


var oderListType = {
    listName: "order",
    typeCheck: "listTypeCheck"
};
bot.setType("orderListType", oderListType);



//-------------------------------------------Tasks-----------------------------------------------------

var signcheck = {
    name: 'signcheck',
    action: function(task, context, callback) {
        context.dialog.signed = 1;
        context.dialog.mobile = task.mobile;

        callback(task,context);
    }
};
bot.setTask("signcheck", signcheck);

var smsAuth = {
    action: function (task,context,callback) {
        task.mobile = context.dialog.mobile;
        messages.sendSMSAuth (task, context, function(task, context) {
            callback(task,context);
        });
    }
};
bot.setTask('smsAuth', smsAuth);

var orderList = {
    name: 'orderList',
    action: function(task, context, callback) {
        context.dialog.order = order;
        if(!context.user.mobile) context.user.mobile = context.dialog.mobile;


        callback(task, context);
    }
};
bot.setTask("orderList", orderList);





var reason = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    context.dialog.reason = text;
    callback(text, task, matched);
	}
};

bot.setType('reason', reason);

var address2 = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    context.dialog.address2 = text;
    callback(text, task, matched);
	}
};

bot.setType('address2', address2);

var option = {
  typeCheck: function (text, type, task, context, callback) {
    var matched = true;
    context.dialog.option = text;
    callback(text, task, matched);
	}
};

bot.setType('option', option);
