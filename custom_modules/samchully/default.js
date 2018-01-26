var path = require('path');
var bot = require(path.resolve('./engine/bot.js')).getBot('samchully');
var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));


var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var addButton = {
    action: function (task,context,callback) {
        task.buttons = [];
        callback(task,context);
    }
};

bot.setTask('addButton', addButton);


var authentication = {
    action: function (task,context,callback) {
        if(true)
        {
            //DB에 고객정보가 있을시에
            context.user.auth = true;
        }else //DB에 고객 정보가 없을시에
        {

        }
        callback(task,context);
    }
};

bot.setTask('authentication', authentication);

var getCustomerList = {
    action: function (task,context,callback) {
        var data = [
            {
                customerName: "박준하",
                address: "서울시 관악구 행운동12",
                id: "1235534"
            },
            {
                customerName: "김지섭",
                address: "서울시 도봉구 덕릉로 12344",
                id: "45344004"
            }
        ];

        context.dialog.customerList = data;

        task.buttons = [];

        for(var i = 0; i < data.length; i++){
            task.buttons.push({text: data[i].id})
        }

        callback(task,context);
    }
};

bot.setTask('getCustomerList', getCustomerList);

var customerListType = {

    typeCheck: function (text, type, task, context, callback) {
        var matched = true;
        var customerList = context.dialog.customerList;
        for(var i = 0; i < customerList.length; i++){
            if(customerList[i].id == text){
                context.dialog.curCustomer = customerList[i];
                break;
            }
        }

        callback(text, task, matched);
    }
};

bot.setType('customerListType', customerListType);

var monthType = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        if(text.includes("개월") > 0) matched = true;
        callback(text, task, matched);
    }
};

bot.setType('monthType', monthType);

var getNoticeHistory = {
    action: function (task,context,callback) {
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        var num = parseInt(word);

        //get Data
        var data = [
            {
                date: "2017.3",
                method: "신용카드 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.4",
                method: "지로용지 납부",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.5",
                method: "은행 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            }
        ];
        context.dialog.noticeNum = num;
        context.dialog.noticeHistory = data;
        task.buttons = [];
        for(var i = 0; i < data.length; i++){
            task.buttons.push({text: data[i].date + "월 상세보기"});
        }
        callback(task,context);
    }
};

bot.setTask('getNoticeHistory', getNoticeHistory);


var getNoticeDetail = {
    action: function (task,context,callback) {
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        var num = parseInt(word);

        //get Data
        var data = [
            {
                date: "2017.3.5",
                method: "신용카드 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            }
        ];

        context.dialog.output = data[0].date + '/'+ data[0].method;

        callback(task,context);
    }
};

bot.setTask('getNoticeDetail', getNoticeDetail);

var getPaymentHistory = {
    action: function (task,context,callback) {

        var word = context.dialog.inCurRaw || context.dialog.inRaw
        var num = parseInt(word);

        //get Data
        var data = [
            {
                date: "2017.3",
                method: "신용카드 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.4",
                method: "지로용지 납부",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.5",
                method: "은행 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            }
        ];
        context.dialog.listNum = num;
        context.dialog.paymentHistory = data;
        task.buttons = [];
        for(var i = 0; i < data.length; i++){
            task.buttons.push({text: data[i].date + "월 상세보기"});
        }
        callback(task,context);
    }

};

bot.setTask('getPaymentHistory', getPaymentHistory);

var getPaymentDetail = {
    action: function (task,context,callback) {

        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        var num = parseInt(word);

        //get Data
        var data = [
            {
                date: "2017.3.5",
                method: "신용카드 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            }
        ];

        context.dialog.output = data[0].date + '/' + data[0].method;
        callback(task,context);
    }
};

bot.setTask('getPaymentDetail', getPaymentDetail);


var getNonpaymentList = {
    action: function (task,context,callback) {
        //get Data
        var data = [
            {
                date: "2017.3",
                method: "신용카드 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.4",
                method: "지로용지 납부",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            },
            {
                date: "2017.5",
                method: "은행 자동이체",
                noticeVal : 1000,
                payment: 500,
                paymentDate: "2017.4.5"
            }
        ];

        context.dialog.nonpaymentHistory = data;


        callback(task,context);
    }
};

bot.setTask('getNonpaymentList', getNonpaymentList);

var sendSMSAuth = {
    preCallback: function(task, context, callback) {
        if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        callback(task, context);
    },
    action: messages.sendSMSAuth
};

bot.setTask('sendSMSAuth', sendSMSAuth);


var saveCustomerName = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = true;
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        context.user.customerName = word;

        callback(text, task, matched);
    }
};

bot.setType('saveCustomerName', saveCustomerName);

var saveCustomerBirth = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = true;
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        context.user.customerBirth = word;
        callback(text, task, matched);
    }
};

bot.setType('saveCustomerBirth', saveCustomerBirth);

var getAuth = {
    action: function (task,context,callback) {
        if(!context.user.auth)
        {
            //DB연동
            //있으면 context.user.auth = true;
        }

        callback(task,context);
    }
};

bot.setTask('getAuth', getAuth);


var verifyCode = {
    action: function (task,context,callback) {
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        if(context.dialog.smsAuth == word.replace(/\s*/g, ''))
        {
            context.user.mobile = context.dialog.mobile;
        }
        callback(task,context);
    }
};

bot.setTask('verifyCode', verifyCode);


var email = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = true;

        callback(text, task, matched);
    }
};

bot.setType('email', email);
