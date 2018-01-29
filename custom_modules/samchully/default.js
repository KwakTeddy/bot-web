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


var searchUser = {
    action: function (task,context,callback) {
        if(true)
        {
            context.user.customerInfo = {};
        }else
        {

        }
        callback(task,context);
    }
};

bot.setTask('searchUser', searchUser);

var getCustomerList = {
    action: function (task,context,callback) {
        if(context.user.auth){
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
                task.buttons.push({text: i + 1})
            }
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
            if(i + 1 == text){
                context.dialog.curCustomer = customerList[i];
                break;
            }
        }
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        console.log(context.dialog.curCustomer);

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
        var matched = false;
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        var regExp = new RegExp('[가-힣]{2,4}', "g");
        if(regExp.exec(word))
        {
            context.user.customerName = word;
            matched = true;
        }
        callback(text, task, matched);
    }
};

bot.setType('saveCustomerName', saveCustomerName);

var saveCustomerBirth = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        var word = context.dialog.inCurRaw || context.dialog.inRaw;
        var regexp = new RegExp("[0-9]{6}", "g");

        if(regexp.exec(word))
        {
            context.user.customerBirth = word;
            matched = true;
        }
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


var getAccoutList = {
  action: function (task,context,callback) {
    callback(task,context);
	}
};

bot.setTask('getAccoutList', getAccoutList);

var selectedAccountType = {

    typeCheck: function (text, type, task, context, callback) {
        var matched = true;

        callback(text, task, matched);
    }
};

bot.setType('selectedAccountType', selectedAccountType);


var getNoticeMethod = {
    action: function (task,context,callback) {

        callback(task,context);
    }
};

bot.setTask('getNoticeMethod', getNoticeMethod);


var setNoticeMethod = {
    action: function (task,context,callback) {

        callback(task,context);
    }
};

bot.setTask('setNoticeMethod', setNoticeMethod);

var getPaymentMethod = {
    action: function (task,context,callback) {

        callback(task,context);
    }
};

bot.setTask('getPaymentMethod', getPaymentMethod);



var getErrMsg = {
  action: function (task,context,callback) {
    callback(task,context);
	}
};

bot.setTask('getErrMsg', getErrMsg);


var getSafetyCheckResult = {
  action: function (task,context,callback) {
    callback(task,context);
	}
};

bot.setTask('getSafetyCheckResult', getSafetyCheckResult);

var getSafetyCheckMonth = {
    action: function (task,context,callback) {
        callback(task,context);
    }
};

bot.setTask('getSafetyCheckMonth', getSafetyCheckMonth);


var sendNotiTalk = {
  action: function (task,context,callback) {
    callback(task,context);
	}
};

bot.setTask('sendNotiTalk', sendNotiTalk);

var searchCustomerCenter = {
  action: function (task,context,callback) {
    callback(task,context);
	}
};

bot.setTask('searchCustomerCenter', searchCustomerCenter);


var authConfirm = {
  action: function (task,context,callback) {
      context.user.auth = true;
    callback(task,context);
	}
};

bot.setTask('authConfirm', authConfirm);
