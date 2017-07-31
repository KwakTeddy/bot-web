var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('coupang2');
var java = require('java');
var request = require('request');
var util = require('util');
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

var defaultTask2 = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        var shipmentBoxId = 102390424;
        var vendorID = 'A00132910';

        var uri = "/v2/providers/openapi/apis/api/v4/vendors/" + vendorID + "/ordersheets?searchType=timeFrame&createdAtFrom=2017-07-28T00:16&createdAtTo=2017-07-29T00:00&status=INSTRUCT";
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
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            // var obj = JSON.parse(body);
            // context.dialog.order = obj.data;
            context.dialog.exp = 'hi2';
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        
        // console.log(body);
        //callback(task, context);
    }
};
bot.setTask("defaultTask2", defaultTask2);
