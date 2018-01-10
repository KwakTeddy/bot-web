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
              	num: "123553"
            },
            {
                customerName: "김지섭",
	            address: "서울시 관악구 행운동123",
              	num: "45344"
            }
        ];
   		
    	context.dialog.customerList = data;
    
    	task.buttons = [];

        for(var i = 0; i < data.length; i++){
           task.buttons.push({text: data[i].customerName})
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
		if(customerList[i].customerName == text){
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
      	date: "3",
        method: "신용카드 자동이체",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "4",
        method: "지로용지 납부",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "5",
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
    
    context.dialog.output = data[0].date;

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
      	date: "3",
        method: "신용카드 자동이체",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "4",
        method: "지로용지 납부",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "5",
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
    
    context.dialog.output = data[0].date;
    callback(task,context);
	}
};

bot.setTask('getPaymentDetail', getPaymentDetail);


var getNonpaymentList = {
  action: function (task,context,callback) {
     //get Data
    var data = [
      {
      	date: "3",
        method: "신용카드 자동이체",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "4",
        method: "지로용지 납부",
        noticeVal : 1000,
        payment: 500,
        paymentDate: "2017.4.5"
      },
      {
      	date: "5",
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
