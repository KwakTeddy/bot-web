var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('coupang');
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
        //var shipmentBoxId = 102390424;
        var vendorID = 'A00132910';

        var uri = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/outboundShippingCenters?searchType=FULL";
        var method = "GET";

        var key = Hmac.generateSync(method, uri, secretKey, accessKey);

        request({
            url: host + uri,
            method: 'get',
            headers: {
                "Authorization" : key
            }
        }, function (error, response, body) {
            console.log(body);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);


var defaultTask2 = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        //var shipmentBoxId = 102390424;
        var vendorID = 'A00132910';

        var uri1 = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=ACCEPT";
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
            context.dialog.exp = context.dialog.order[0].orderItems[0].estimatedShippingDate;
            context.dialog.exp2 = 0;
            callback(task, context);
        });
    }
};
bot.setTask("defaultTask2", defaultTask2);




var orderReturn = {
    action: function(task, context, callback) {
        var vendorId = 'A00132910';
        var orderId = '25000007901221';
        var userId = 'moneybrain';
        var vendorItemIds = [123, 321];
        var receiptCounts = [1, 3];
        var bigCancelCode = 'CANERR';
        var middleCancelCode = 'CCTTER';
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

            }
            callback(task, context);
        });
        callback(task, context);
    }
};

bot.setTask('orderReturn', orderReturn);
