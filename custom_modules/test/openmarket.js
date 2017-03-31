var path = require('path');
var java = require('java');
var request = require('request');
var util = require('util');

java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/commons-codec-1.10.jar'));
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/openapi-hmac-sdk-1.0.jar'));

exports.coupangTask = {
  action: function(task, context, callback) {
    var Hmac = java.import("com.coupang.openapi.sdk.Hmac");

    var accessKey = "179e9a30-3bc7-4e40-a066-5dd311b544d3";
    var secretKey = "ce09d7771155f54f81bf6f1c0df3803f70d1fe7b";
    var host = "https://api-gateway.coupang.com";
    var uri = "/targets/wing/seller_api/apis/api/v1/marketplace/seller-products/33541225";
    var method = "get";

    var key = Hmac.generateSync(method, uri, secretKey, accessKey);
    var signature = key.split('=').map(function (val) {
        return +val +1;
    });
    console.log(key);
    console.log(typeof (key));
    console.log(signature);
    console.log(typeof (signature));
    console.log(11233);

    request({
        url: 'https://api-gateway.coupang.com/targets/wing/seller_api/apis/api/v1/marketplace/seller-products/33541225',
        method: 'get',
        headers: {
            'Authorization': signature
        }
    }, function (error, response, body) {
      console.log(error);
      // console.log(util.inspect(response));
      console.log(body);
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var doc = JSON.parse(body);
            // task._doc.lng = doc.channel.item[0].lng;
            // task._doc.lat = doc.channel.item[0].lat;
            // task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
            task._doc.link_map = 'http://map.daum.net/link/map/' + context.user.center.svc_center_name + ',' + context.user.center.lat + ',' + context.user.center.lng;
            // console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
            // console.log('link: ' + task._doc.link_find);
            // console.log('link: ' + task._doc.link_map);

            task.url = task._doc.link_map;
            task.urlMessage = '지도에서 위치보기';
        }
        callback(task, context);

    });


    callback(task, context);
  }
};
