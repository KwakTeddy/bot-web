var path = require('path');
var java = require('java');
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/commons-codec-1.10.jar'));
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/openapi-hmac-sdk-1.0.jar'));

exports.coupangTask = {
  action: function(task, context, callback) {
    var Hmac = java.import("com.coupang.openapi.sdk.Hmac");

    var accessKey = "1a3a1f34-7852-4ad8-9368-766291b8b1ab";
    var secretKey = "7ffcdf981d918fe7ca3d642868e22f99f1316bf5";
    var host = "https://api-gateway.coupang.com";
    var uri = "/v2/providers/wing_api/apis/internal-api/samples/v1/return/time-frame?createdAtFrom=2015-12-02T10%3A54&createdAtTo=2015-12-02T10%3A59&status=UC";
    var method = "get";

    var key = Hmac.generateSync(method, uri, secretKey, accessKey);

    console.log(key);

    callback(task, context);
  }
};
