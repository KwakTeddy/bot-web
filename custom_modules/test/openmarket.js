var path = require('path');
var java = require('java');
var request = require('request');
var util = require('util');
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/commons-codec-1.10.jar'));
java.classpath.push(path.resolve(__dirname, '../../external_modules/hmac_sdk/openapi-hmac-sdk-1.0.jar'));
var Hmac = java.import("com.coupang.openapi.sdk.Hmac");
var accessKey = "179e9a30-3bc7-4e40-a066-5dd311b544d3";
var secretKey = "ce09d7771155f54f81bf6f1c0df3803f70d1fe7b";
var host = "https://api-gateway.coupang.com";

var soap = require('soap');
var parseString = require('xml2js').parseString;

// 배송 API
exports.coupangShipment = {
    action: function(task, context, callback) {
        var shipmentBoxId = 102390424;
        var vendorID = 'A00132910';

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorID + "/ordersheets/" + shipmentBoxId + "/history";
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
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        callback(task, context);
    }
};

exports.coupangOrderInquiry = {
    action: function(task, context, callback) {
        var shipmentBoxId = 102390424;

        var uri = "/v2/providers/wing_api/apis/internal-api/v2/ordersheets/" + shipmentBoxId;
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
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        callback(task, context);
    }
};

exports.coupangOrderInquiryList = {
    action: function(task, context, callback) {
        var createdAtForm = '2015-12-14T14:16';
        var createdAtTo = '2015-12-14T15:16';
        var status = 'ACCEPT';

        var uri = "/v2/providers/wing_api/apis/internal-api/v2/ordersheets/time-frame?createdAtFrom=" + createdAtForm + "&createdAtTo=" + createdAtTo + "&status=" + status;
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
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        callback(task, context);
    }
};

exports.coupangOrderInquiryListDaily = {
    action: function(task, context, callback) {
        var createdAtForm = '2015-12-14';
        var createdAtTo = '2015-12-14';
        var status = 'ACCEPT';
        var vendorId = 'A00132910';
        var maxPerPage = 2;
        var nextToken = '';

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorId + "/ordersheets?createdAtFrom=" + createdAtForm + "&createdAtTo=" + createdAtTo + "&maxPerPage=" + maxPerPage + "&status=" + status;
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
            if (!error && response.statusCode == 200) {

            }
            callback(task, context);

        });
        callback(task, context);
    }
};


exports.coupangOrderStatusChange = {
    action: function(task, context, callback) {
        console.log('list');
        var vendorId = 'A00132910';
        var body = {
            "vendorId" : "A00132910",
            "shipmentBoxIds" : '1231232'
        };
        JSON.stringify(body)

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorId + "/ordersheets/acknowledgement";
        var method = "PATCH";

        var key = Hmac.generateSync(method, uri, secretKey, accessKey);
        console.log(host+ uri);

        request({
            url: host + uri,
            method: 'PATCH',
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

exports.coupangOrderStatusChangeDelivery = {
    action: function(task, context, callback) {
        console.log('list');
        var vendorId = 'A00132910';
        var body = {
            "vendorId" : "A00132910",
            "orderSheetInvoiceApplyDtos" : [
                {
                    "shipmentBoxId":102392001,
                    "orderId":500000596,
                    "vendorItemId":3000000177,
                    "deliveryCompanyCode":"KDEXP",
                    "invoiceNumber":"329845729347",
                    "splitShipping":false,
                    "preSplitShipped":false,
                    "estimatedShippingDate":""
                }
            ]
        };
        JSON.stringify(body);

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/"+ vendorId +"/orders/invoices";
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

//취소 API

exports.coupangCanceal = {
    action: function(task, context, callback) {
        var vendorId = 'A00132910';
        var orderId = '1004';
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


// Customer Service API

exports.coupangCsCtoS = {
    action: function(task, context, callback) {
        var vendorId = 'A00132910';
        var inquiryStartAt = '2016-09-18';
        var inquiryEndAt = '2016-09-18';
        var answeredType = 'ALL';
        var vendorItemId = '33541225';
        var pageNum = 1;
        var pageSize = 10;


        var uri = "/v2/providers/wing_api/apis/internal-api/v1/customer-service/customer/inquiries?vendorId=" + vendorId +"&vendorItemId=" + vendorItemId + "&inquiryStartAt=" + inquiryStartAt + "&inquiryEndAt=" + inquiryEndAt + "&answeredType=" + answeredType + "&pageNum=" + pageNum + "&pageSize=" + pageSize;
        var method = "GET";
        var key = Hmac.generateSync(method, uri, secretKey, accessKey);

        request({
            url: host + uri,
            method: 'GET',
            headers: {
                "Authorization" : key
            }
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

exports.coupangCsStoC = {
    action: function(task, context, callback) {
        var counselingId = '1004';
        var vendorId = "A00132910";
        var content = "just do it";
        var replyBy = "wanger";
        var body = {
            "content" : content,
            "vendorId" : vendorId,
            "replyBy" : replyBy
        };
        JSON.stringify(body);

        var uri = "/v2/providers/wing_api/apis/internal-api/v1/customer-service/customer/replies/" + counselingId;
        var method = "POST";
        var key = Hmac.generateSync(method, uri, secretKey, accessKey);

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

exports.coupangCsStoCoupang = {
    action: function(task, context, callback) {
        var inquiryId = '1004';
        var vendorId = "A00132910";
        var content = "just do it";
        var replyBy = "wanger";
        var body = {
            "vendorId" : vendorId,
            "inquiryId" : inquiryId,
            "content" : content,
            "replyBy" : replyBy
        };
        JSON.stringify(body);

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorId + "/callCenterInquiries/" + inquiryId + "/replies";
        var method = "POST";
        var key = Hmac.generateSync(method, uri, secretKey, accessKey);

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

exports.coupangCsCoupangtoS = {
    action: function(task, context, callback) {
        var inquiryId = '1004';
        var vendorId = "A00132910";
        var inquiryStartAt = "2016-09-16";
        var inquiryEndAt = "2016-09-17";
        var orderId = "1004";
        var partnerCounselingStatus = "none";
        var vendorItemId = "33541225";
        var pageNum = 1;
        var pageSize = 10;

        var uri = "/v2/providers/greatwall_api/apis/api/v4/vendors/" + vendorId + "/callCenterInquiries?vendorId=" + vendorId + "&inquiryId=" + inquiryId + "&inquiryStartAt=" + inquiryStartAt + "&inquiryEndAt=" + inquiryEndAt + "&orderId=" + orderId + "&partnerCounselingStatus=" + partnerCounselingStatus + "&vendorItemId=" + vendorItemId + "&pageNum=" + pageNum + "&pageSize=" +pageSize;
        var method = "GET";
        var key = Hmac.generateSync(method, uri, secretKey, accessKey);

        request({
            url: host + uri,
            method: 'GET',
            headers: {
                "Authorization" : key
            }
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


exports.auctiontest = {
  action: function(task, context, callback) {


    var url = 'http://api.auction.co.kr/APIv1/ShoppingService.asmx?WSDL';
    // var args =    { memberTicket: {
    //     Ticket: [ { _: 'd059cAnBM8CAttVPwnG8DGxUelcAHmK8O7e4gWEtyXvVxOEWwqHK6Y1VecEOK7NCZR+zNvTMc1+hSIZ3icRx+xjzbnuicwi6CS95md6w6tHUInd5soGzW9VV0STOjM75t1x7C4p5oO+2Si6jdhBVB6BeZJ/IyV4mKDt/UzHhFCnyIpyVLOu9I46oSkIa5qGADhSkw8NoN/Yp/OZyDDlrUhg=',
    //     '$': { xmlns: 'http://schema.auction.co.kr/Arche.APISvc.xsd' } } ]
    // }  };
    var args = {};
    args = {
      "req": {
        "_SeqNo": "long",
        "_Value": 1,
        "_SeqNo2": "long",
        "_Value2": 22
      },
    }

    // var args = { req: { EncryptedTicket: { Value: 'd059cAnBM8CAttVPwnG8DGxUelcAHmK8O7e4gWEtyXvVxOEWwqHK6Y1VecEOK7NCZR+zNvTMc1+hSIZ3icRx+xjzbnuicwi6CS95md6w6tHUInd5soGzW9VV0STOjM75t1x7C4p5oO+2Si6jdhBVB6BeZJ/IyV4mKDt/UzHhFCnyIpyVLOu9I46oSkIa5qGADhSkw8NoN/Yp/OZyDDlrUhg='}}};
    // var args = '<req><MemberTicket xmlns="http://schema.auction.co.kr/Arche.APISvc.xsd"><Ticket>d2GjGEpFMpvg11Y6pi0j/ZfPk8DQlm/luURs8mAQTyocRWcJt83xMKeeokssVwxtIO6urCfjekPTH9CAqsgyu+2fTsW8gpGsSvR+wEDROS+SOUBZsJWxhj2c7BTSL1tGh4ddLEFSGVwvYt//rOutg7r70oL7CsWMkk2v8lPrDeQkUegdqL+WZ+m3ouIJVWwgjBrTd49GVurbWLNJ+Ydqi48=</Ticket></MemberTicket></req>';
    var soapHeader = '<EncryptedTicket xmlns="http://www.auction.co.kr/Security"><Value>d059cAnBM8CAttVPwnG8DGxUelcAHmK8O7e4gWEtyXvVxOEWwqHK6Y1VecEOK7NCZR+zNvTMc1+hSIZ3icRx+xjzbnuicwi6CS95md6w6tHUInd5soGzW9VV0STOjM75t1x7C4p5oO+2Si6jdhBVB6BeZJ/IyV4mKDt/UzHhFCnyIpyVLOu9I46oSkIa5qGADhSkw8NoN/Yp/OZyDDlrUhg=</Value></EncryptedTicket>';
    // var soapHeader = { EncryptedTicket:
    //         { '$': { xmlns: 'http://www.auction.co.kr/Security' },
    //             Value: [ 'd059cAnBM8CAttVPwnG8DGxUelcAHmK8O7e4gWEtyXvVxOEWwqHK6Y1VecEOK7NCZR+zNvTMc1+hSIZ3icRx+xjzbnuicwi6CS95md6w6tHUInd5soGzW9VV0STOjM75t1x7C4p5oO+2Si6jdhBVB6BeZJ/IyV4mKDt/UzHhFCnyIpyVLOu9I46oSkIa5qGADhSkw8NoN/Yp/OZyDDlrUhg=' ] } }
    // var soapHeader = {EncryptedTicket : { Value : 'd2GjGEpFMpvg11Y6pi0j/ZfPk8DQlm/luURs8mAQTyocRWcJt83xMKeeokssVwxtIO6urCfjekPTH9CAqsgyu+2fTsW8gpGsSvR+wEDROS+SOUBZsJWxhj2c7BTSL1tGh4ddLEFSGVwvYt//rOutg7r70oL7CsWMkk2v8lPrDeQkUegdqL+WZ+m3ouIJVWwgjBrTd49GVurbWLNJ+Ydqi48='}};
    // var test = '<EncryptedTicket xmlns="http://www.auction.co.kr/Security"><Value>d059cAnBM8CAttVPwnG8DGxUelcAHmK8O7e4gWEtyXvVxOEWwqHK6Y1VecEOK7NCZR+zNvTMc1+hSIZ3icRx+xjzbnuicwi6CS95md6w6tHUInd5soGzW9VV0STOjM75t1x7C4p5oO+2Si6jdhBVB6BeZJ/IyV4mKDt/UzHhFCnyIpyVLOu9I46oSkIa5qGADhSkw8NoN/Yp/OZyDDlrUhg=</Value></EncryptedTicket>'
    // var test = '<Content xmlns="http://schema.auction.co.kr/Arche.APISvc.xsd">string</Content>'
    // parseString(test, function (err, data) {
    //     console.log(util.inspect(data))
    //     console.log(util.inspect(data.req.Content))
    // })

    soap.createClient(url, function(err, client) {
      // client.addSoapHeader(soapHeader, '', '', 'http://www.auction.co.kr/Security');
      client.addSoapHeader(soapHeader);
      // console.log(util.inspect(client.describe()));
      // console.log(util.inspect(client.describe().AuctionService.AuctionServiceSoap.GetMyAccount));
      // console.log(util.inspect(client.describe().AuctionService.AuctionServiceSoap.GetMyAccount.input.req.MemberTicket));
      console.log(util.inspect(client.describe().ShoppingService.ShoppingServiceSoap.TestDTC1));
      console.log(util.inspect(client.describe().ShoppingService.ShoppingServiceSoap.TestDTC1.input.req.Content));
      client.ShoppingService.ShoppingServiceSoap.TestDTC1(args, function(err, result) {
        // console.log(util.inspect(err))
        console.log(util.inspect(result))
        // console.log(util.inspect(result.GetMyAccountResult.MyAccount.attributes))
      });
    });

    callback(task, context);
  }
};

exports.naver = {
  action: function(task, context, callback) {
    var body = {};
    body = {
      "event":"send",
      "sender":"partner",
      "user":"d176c7180f5b1e0245ff5cd1841e1d62",
      "partner":"wc8bu4",
      "textContent":{"text":"hello world"}
    };

    request({
      url: "https://dev.apis.naver.com/talk-partner/talk-bot/event",
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": "c7VNVyIG3s95N4q2LWZQ",
        "X-Naver-Client-Secret": "HXWvXdrKi7"
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
