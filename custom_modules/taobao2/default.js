var path = require('path');
var bot = require(path.resolve('./bot-engine/bot')).getBot('taobao2');

var appkey = '24571416';
var appsecret = '5fe3cf3a2f4b5440236ab73f3b7ab856';



var defaultTask2 = {
    name: 'defaultTask2',
    action: function(task, context, callback) {
        console.log('start');
        var taobao = require('taobao');
        taobao.config({
            app_key: appkey,
            app_secret: appsecret
        });

        taobao.core.call({
            method: 'taobao.tbk.shop.get',
            'fields':'user_id,shop_title,shop_type,seller_nick,pict_url,shop_url',
            'q':'女装',
            'sort':'commission_rate_des',
            'is_tmall':'false',
            'start_credit':'1',
            'end_credit':'20',
            'start_commission_rate':'2000',
            'end_commission_rate':'123',
            'start_total_action':'1',
            'end_total_action':'100',
            'start_auction_count':'123',
            'end_auction_count':'200',
            'platform':'1',
            'page_no':'1',
            'page_size':'20'
        }, function(data) {
            console.log(data);
        });





    }
};
bot.setTask("defaultTask2", defaultTask2);





var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        // TopClient = require('./topClient').TopClient;
        console.log('start');
        // TopClient = require('top-client-taobao').TopClient;
        // var client = new TopClient({
        //     'appkey': appkey,
        //     'appsecret': appsecret,
        //     'REST_URL': 'http://gw.api.taobao.com/router/rest'
        // });

        var taobao = require('taobao');
        taobao.config({
            app_key: appkey,
            app_secret: appsecret
        });

        taobao.core.call({
            method: 'taobao.areas.get',
            fields: 'id,type,name,parent_id,zip'
        }, function(data) {
            console.log(data);
        });




        // client.execute('taobao.logistics.orders.get', {
        //     'fields':'tid,seller_nick,buyer_nick,delivery_start,sub_tids,is_spilt',
        //     'tid':'112312323',
        //     'buyer_nick':'jayzhou',
        //     'status':'CREATED',
        //     'seller_confirm':'yes',
        //     'receiver_name':'王刚',
        //     'start_created':'2017-08-02 00:00:00',
        //     'end_created':'2017-08-02 00:00:10',
        //     'freight_payer':'buyer',
        //     'type':'post',
        //     'page_no':'1',
        //     'page_size':'40',
        //     'session': '1234'
        // }, function(error, response) {
        //     if (!error) {
        //         console.log(response);
        //         callback(task, context);
        //     }
        //     else console.log(error);
        // })
    }
};
bot.setTask("defaultTask", defaultTask);





// Top client ver
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
