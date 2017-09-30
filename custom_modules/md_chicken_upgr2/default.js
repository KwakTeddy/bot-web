var path = require('path');
var request = require('request');

var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('md_chicken_upgr2');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var menu = {
    "후라이드": [
        {
            'name': '후라이드 특대',
            'price': 16000
        },
        {
            'name': '후라이드 중',
            'price': 13000
        },
        {
            'name': '후라이드 순살',
            'price': 16000
        }
    ],
    "양념치킨": [
        {
            'name': '양념치킨 특대',
            'price': 17000
        },
        {
            'name': '양념치킨 중',
            'price': 14000
        },
        {
            'name': '양념치킨 순살',
            'price': 17000
        }
    ],
    "간장치킨": [
        {
            'name': '간장치킨 특대',
            'price': 17000
        },
        {
            'name': '간장치킨 중',
            'price': 14000
        },
        {
            'name': '간장치킨 순살',
            'price': 17000
        }
    ],
    "반반치킨": [
        {
            'name': '반반치킨 특대',
            'price': 17000
        },
        {
            'name': '반반치킨 중',
            'price': 14000
        },
        {
            'name': '반반치킨 순살',
            'price': 17000
        }
    ],
    "두마리치킨": [
        {
            'name': '두마리 후라이드 후라이드',
            'price': 19000
        },
        {
            'name': '두마리 후라이드 양념치킨',
            'price': 20000
        },
        {
            'name': '두마리 후라이드 간장치킨',
            'price': 20000
        },
        {
            'name': '두마리 간장치킨 양념치킨',
            'price': 21000
        }
    ],
    "부위별치킨": [
        {
            'name': '다리 8개',
            'price': 17000
        },
        {
            'name': '통날개 10개',
            'price': 17000
        },
        {
            'name': '다리 + 통날개',
            'price': 17000
        }
    ]
};

var detailMenu = [];
var totalprice = 0;

function findName(list, word) {
    for(var key in list)
    {
        if(word == "부위 별") return "부위별치킨";
        if(word == "두 마리") return "두마리치킨";
        if(key.search(word) != -1) return key;
    }
}

// function addOrder(list, menuObj) {
//     for(i=0; i<list.length; i++){
//         if ((typeof list[i].name != 'undefined') && list[i].name == menuObj.name){
//             if (typeof list[i].quant == 'undefined') list[i].quant = 2;
//             else list[i].quant++;
//             list[i].price += menuObj.price;
//             break;
//         }
//         if (i == (list.length - 1)) list.push(menuObj);
//     }
//
//         for(i=0; i<list.length; i++){
//             totalprice += list[i].price;
//         }
// }




var orderSave = {
    action: function (task,context,callback) {
        if(typeof context.dialog.orderList == 'undefined')
        {
            context.dialog.orderList = [];
            context.dialog.ordering = true;
        }

        //context.dialog.orderList.push({name:task['1']+' '+task['2']+' '+task['3']})
        var keyword = task['1'];
        var bigmenu = [];
        if(typeof keyword == "undefined" | keyword == '부위 별') bigmenu = menu.부위별치킨;
        else if(keyword == '두 마리') bigmenu = menu.두마리치킨;
        else {
            eval('bigmenu = menu.' + findName(menu, keyword) );
        }
        for(i=0; i < bigmenu.length; i++){
            if(bigmenu[i].name.search(task['2']) != -1) context.dialog.orderList.push(bigmenu[i]);
            // if(bigmenu[i].name.search(task['2']) != -1) addOrder(context.dialog.orderList, bigmenu[i]);
        }
        callback(task,context);
    }
};

bot.setTask('orderSave', orderSave);

var saveAddress = {
    action: function (task,context,callback) {
        context.user.address = context.dialog.inCurRaw;
        callback(task,context);
    }
};

bot.setTask('saveAddress', saveAddress);

var saveMobile = {
    action: function (task,context,callback) {
        context.user.mobile = context.dialog.mobile;
        callback(task,context);
    }
};

bot.setTask('saveMobile', saveMobile);

var selectMenu = {
    action: function (task,context,callback) {
        if(task['1']){
            context.dialog.detailMenuName = findName(menu, task['1']);
            eval('context.dialog.detailMenu = menu.' + context.dialog.detailMenuName);
        }
        detailMenu = context.dialog.detailMenu;
        callback(task,context);
    }
};

bot.setTask('selectMenu', selectMenu);


var detailList = {
    listName: "detailMenu",
    typeCheck: "listTypeCheck"
};

bot.setType('detailList', detailList);


var detailSelect = {
    action: function (task,context,callback) {
        if(typeof context.dialog.orderList == 'undefined')
        {
            context.dialog.orderList = [];
            context.dialog.ordering = true;
        }
        context.dialog.orderList.push(context.dialog.detailList);
        // addOrder(context.dialog.orderList, context.dialog.detailList);
        callback(task,context);
    }
};

bot.setTask('detailSelect', detailSelect);


var noMenusave = {
    action: function (task,context,callback) {
        context.dialog.noMenu = task['1'];
        callback(task,context);
    }
};

bot.setTask('noMenusave', noMenusave);


var numberMatch = {
    action: function (task,context,callback) {
        var num = task['1'];
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // console.log(num);
        if(num == '1') context.dialog.detailMenuName = '후라이드';
        if(num == '2') context.dialog.detailMenuName = '양념치킨';
        if(num == '3') context.dialog.detailMenuName = '간장치킨';
        if(num == '4') context.dialog.detailMenuName = '반반치킨';
        if(num == '5') context.dialog.detailMenuName = '두마리치킨';
        if(num == '6') context.dialog.detailMenuName = '부위별치킨';
        eval('context.dialog.detailMenu = menu.' + context.dialog.detailMenuName);
        // console.log(context.dialog.detailMenu);


        callback(task,context);
    }
};

bot.setTask('numberMatch', numberMatch);


var savePay = {
  action: function (task,context,callback) {
    var input = context.dialog.inCurRaw
    if (input == 1 || input.search('카드') != -1) context.dialog.pay = '카드';
    if (input == 2 || input.search('현금') != -1) context.dialog.pay = '현금';
    callback(task,context);
	}
};

bot.setTask('savePay', savePay);

var saveRequest = {
  action: function (task,context,callback) {
    context.dialog.request = context.dialog.inCurRaw;
    callback(task,context);
	}
};

bot.setTask('saveRequest', saveRequest);


var sendMessage = {
    action: function (task,context,callback) {

        var message = '[주문내용]\n';

        for(i=0; i<context.dialog.orderList.length; i++){
            message += context.dialog.orderList[i].name + ', ' + context.dialog.orderList[i].price + '\n';
        }


        message += '\n주소: ' + context.user.address + '\n';
        message += '번호: ' + context.user.mobile + '\n';
        message += '결제방법: ' + context.dialog.pay + '\n';
        message += '요청사항: ' + context.dialog.request + '\n';

        var mess = [];
        mess[0] = message;

        if (message.length > 60) {
            mess[0] = message.slice(0,60);
            mess[1] = message.slice(60,120);
        }

        // sendSMS("01026548343", mess[0]);
        // sendSMS("01026548343", mess[1]);
        sendSMS("01026548343", mess[0]);
        // setTimeout(sendSMS("01092597716", mess[1]), 5000);

        // for(i=0; i<mess.length; i++) {
        //
        // }

        // task.phone = "01092597716";
        // task.message = message;
        //
        // messages.sendVMS (task, context, function(task, context) {
        //     callback(task,context);
        // });


        callback(task,context);

        setTimeout(sendSMS("01026548343", mess[1]), 5000);
    }
};

bot.setTask('sendMessage', sendMessage);



function sendSMS(phone, message) {
    request.post(
        'https://bot.moneybrain.ai/api/messages/sms/send',
        // 'http://dev.moneybrain.ai:8443/api/messages/sms/send',
        {json: {callbackPhone: "15777314", phone: phone, message: message}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(response);
                console.log(body);
            } else {
                // task._result = 'FAIL';
                // task._resultMessage = 'HTTP ERROR';
                console.log(error);
            }
        }
    );
}
