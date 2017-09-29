var path = require('path');
var bot = require(path.resolve('./engine/core/bot')).getBot('taobao');
var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var java = require('java');
var request = require('request');
var util = require('util');
var async = require('async');
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/commons-codec-1.10.jar'));
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/openapi-hmac-sdk-1.0.jar'));
var Hmac = java.import("com.coupang.openapi.sdk.Hmac");
var accessKey = "179e9a30-3bc7-4e40-a066-5dd311b544d3";
var secretKey = "ce09d7771155f54f81bf6f1c0df3803f70d1fe7b";
var host = "https://api-gateway.coupang.com";

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
        //var shipmentBoxId = 102390424;
        if(!context.user.mobile) context.user.mobile = context.dialog.mobile;
        var vendorID = 'A00132910';

        var uri1 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-08-02T00:16&createdAtTo=2017-08-03T00:00&status=ACCEPT";
        var uri2 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=INSTRUCT";
        var uri3 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=DEPARTURE";
        var uri4 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=DELIVERING";
        var uri5 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=FINAL_DELIVERY";
        var uri6 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=NONE_TRACKING";

        var method = "GET";

        context.dialog.order = [];

        //var key = Hmac.generateSync(method, uri1, secretKey, accessKey);

        var tasks = [
            function(cb) {
                request({
                    url: host + uri1,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri1, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    var obj = JSON.parse(body);
                    console.log(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            },
            function(cb) {
                request({
                    url: host + uri2,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri2, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    var obj = JSON.parse(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            },
            function(cb) {
                request({
                    url: host + uri3,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri3, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    var obj = JSON.parse(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            },
            function(cb) {
                request({
                    url: host + uri4,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri4, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    // console.log(body);
                    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    var obj = JSON.parse(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            },
            function(cb) {
                request({
                    url: host + uri5,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri5, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    // console.log(body);
                    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    var obj = JSON.parse(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            },
            function(cb) {
                request({
                    url: host + uri6,
                    method: 'get',
                    headers: {
                        "Authorization" : Hmac.generateSync(method, uri6, secretKey, accessKey)
                    }
                }, function (error, response, body) {
                    // console.log(body);
                    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    var obj = JSON.parse(body);
                    for(i = 0; i < obj.data.length; i++) {
                        // console.log('-----------------------------------------------------------');
                        // console.log(obj.data[i].orderId);
                        // console.log(obj.data[i].orderItems[0].vendorItemName);
                        obj.data[i].text = obj.data[i].orderItems[0].vendorItemName;
                    }
                    context.dialog.order = context.dialog.order.concat(obj.data);
                    if (!error && response.statusCode == 200) {

                    }
                    cb(null);

                });
            }
        ];

        async.waterfall(tasks, function (err, results) {
            callback(task, context);
        });
    }
};
bot.setTask("orderList", orderList);



var orderCancle = {
    action: function(task, context, callback) {
        var order = context.dialog.orderListType;
        console.log('------------------------');
        console.log(context.dialog.orderListType);

        var vendorId = 'A00132910';
        var orderId = order.orderId;
        var userId = 'moneybrain';
        var vendorItemIds = [order.orderItems[0].vendorItemId];
        var receiptCounts = [order.orderItems[0].shippingCount];
        var bigCancelCode = 'CANERR';
        var middleCancelCode = 'CCPRER';
        var body = {
            "orderId" : orderId,
            "vendorItemIds" : vendorItemIds,
            "receiptCounts" : receiptCounts,
            "bigCancelCode" : bigCancelCode,
            "middleCancelCode" : middleCancelCode ,
            "vendorId" : vendorId,
            "userId" : userId
        };
        JSON.stringify(body);
        console.log(util.inspect(body));

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorId + "/orders/" + orderId + "/refunds";
        var method = "POST";

        var key = Hmac.generateSync(method, uri, secretKey, accessKey);
        console.log(host+ uri);

        request({
            url: host + uri,
            method: 'POST',
            headers: {
                "Authorization" : key
            },
            json: true,
            body: body
        }, function (error, response, body) {
            console.log(util.inspect(body));
            console.log(error);
            // console.log(util.inspect(response));
            if (!error && response.statusCode == 200) {
                console.log(body);

            }
            callback(task, context);
        });
        callback(task, context);
    }
};

bot.setTask('orderCancle', orderCancle);





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
