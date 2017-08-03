var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('taobao2');

var appkey = '24571416';
var appsecret = '5fe3cf3a2f4b5440236ab73f3b7ab856';



var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        // TopClient = require('./topClient').TopClient;
        console.log('start');
        TopClient = require('top-client-taobao').TopClient;
        var client = new TopClient({
            'appkey': appkey,
            'appsecret': appsecret,
            'REST_URL': 'http://gw.api.taobao.com/router/rest'
        });

        client.execute('taobao.logistics.orders.get', {
            'fields':'tid,seller_nick,buyer_nick,delivery_start,sub_tids,is_spilt',
            'tid':'112312323',
            'buyer_nick':'jayzhou',
            'status':'CREATED',
            'seller_confirm':'yes',
            'receiver_name':'王刚',
            'start_created':'2017-08-02 00:00:00',
            'end_created':'2017-08-02 00:00:10',
            'freight_payer':'buyer',
            'type':'post',
            'page_no':'1',
            'page_size':'40',
            'session': '1234'
        }, function(error, response) {
            if (!error) {
                console.log(response);
                callback(task, context);
            }
            else console.log(error);
        })
    }
};
bot.setTask("defaultTask", defaultTask);




// var defaultTask = {
//     name: 'defaultTask',
//     action: function(task, context, callback) {
//         // TopClient = require('./topClient').TopClient;
//         console.log('start');
//         TopClient = require('top-client-taobao').TopClient;
//         var client = new TopClient({
//             'appkey': appkey,
//             'appsecret': appsecret,
//             'REST_URL': 'http://gw.api.taobao.com/router/rest'
//         });
//
//         client.execute('taobao.logistics.orders.get', {
//             'fields':'tid,seller_nick,buyer_nick,delivery_start,sub_tids,is_spilt',
//             'tid':'112312323',
//             'buyer_nick':'jayzhou',
//             'status':'CREATED',
//             'seller_confirm':'yes',
//             'receiver_name':'王刚',
//             'start_created':'2017-08-02 00:00:00',
//             'end_created':'2017-08-02 00:00:10',
//             'freight_payer':'buyer',
//             'type':'post',
//             'page_no':'1',
//             'page_size':'40',
//             'session': '1234'
//         }, function(error, response) {
//             if (!error) {
//                 console.log(response);
//                 callback(task, context);
//             }
//             else console.log(error);
//         })
//     }
// };
// bot.setTask("defaultTask", defaultTask);



// var defaultTask = {
//     name: 'defaultTask',
//     action: function(task, context, callback) {
//         // TopClient = require('./topClient').TopClient;
//         console.log('start');
//         TopClient = require('top-client-taobao').TopClient;
//         var client = new TopClient({
//             'appkey': appkey,
//             'appsecret': appsecret,
//             'REST_URL': 'http://gw.api.taobao.com/router/rest'
//         });
//
//         var reqParameter = {
//             'fields': 'num_iid,title,pict_url,small_images,user_type,provcity,item_url,seller_id,volume,nick',
//             'q': 'hi',
//             'is_overseas': 'false',
//             'is_tmall': 'false'
//         };
//         client.execute('taobao.tbk.item.get', reqParameter, function(error, response) {
//             console.log(response);
//             callback(task, context);
//         });
//     }
// };
// bot.setTask("defaultTask", defaultTask);
