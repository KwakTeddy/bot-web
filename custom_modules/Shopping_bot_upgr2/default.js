var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('Shopping_bot_upgr2');
var logger = require(path.resolve('./config/lib/logger'));

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

const IN_TAG_START = '{';
const IN_TAG_END = '}';

//-------------------------------------------DummyDatas------------------------------------------------

var order = [
    {
        order_product : "유니클로 스키니진",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_adress : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송중"
    },
    {
        order_product : "H&M 미니스커트",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_adress : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송중"
    },
    {
        order_product : "탑텐 블라우스",
        order_content : ["블랙, L, 1"],
        order_date : "2017-07-28",
        order_adress : "서울특별시 관악구 봉천동 1645-55",
        order_status : "배송중, 현재 관악 IC 하차",
        order_expecteddate : "2017-07-29",
        order_simplestatus : "배송중"
    }
];



//-------------------------------------------Types-----------------------------------------------------

var verifyNum = {
    name: 'verifyNum',
    typeCheck:regexpTypeCheck,
    regexp: /\d{4}/
}
bot.setType("verifyNum",verifyNum);

var mobile = {
    name: 'mobile',
    // raw: true,
    // context: true,
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    // checkRequired: function(text, type, inDoc, context) {
    //     if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
    //     else if(text.length < 13) return '자리수가 맞지 않습니다';
    //     else return '휴대폰전화번호 형식으로 입력해 주세요';
    // }
};
bot.setType("mobile", mobile);

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
        context.dialog.mobile.text = 'hi';

        callback(task,context);
    }
};
bot.setTask("signcheck", signcheck);

var orderList = {
    name: 'orderList',
    action: function(task, context, callback) {
        context.dialog.order = order;


        callback(task, context);
    }
};
bot.setTask("orderList", orderList);









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
