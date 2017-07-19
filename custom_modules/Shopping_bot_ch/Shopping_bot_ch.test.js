/**
 * Created by moneybrain on 2017. 7. 5..
 */

'use strict';

var assert = require('assert');
var path = require('path');
var mongoose = require(path.resolve('config/lib/mongoose.js'));
var bot_server;
var bot;

describe('Bot', function () {
    var channel = "socket";
    var bot_name = 'Hotel_bot_ch';
    var user = 'com2best';

    var msgEqual = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            assert.equal(out, expected);
            done();
        });
    };

    var msgMatch = function (msg, expected, done) {
        bot.botProc(bot_name, channel, user, msg, {}, function (out, task) {
            console.log(out + '\n-------------------------------------------------\n' +  expected + '\n-------------------------------------------------\n' + out.search(new RegExp(expected, 'i')));
            assert.notEqual(-1, out.search(new RegExp(expected, 'i')));
            done();
        });
    };

    before(function () {
        var app = require(path.resolve('config/lib/app.js'));
        app.start();

        bot_server = require(path.resolve('config/lib/bot.js'));
        bot = require(path.resolve('modules/bot/server/controllers/bot.server.controller'));
    });

    describe('start', function () {
        // before(function () {
        //   bot_server.loadBot(bot_name);
        // });

        it('load', function(done) {
            bot_server.loadBot(bot_name, function() {
                done();
            });
        });



        it('1', function (done) {
            msgMatch(':reset user', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('2', function (done) {
            msgMatch('1', '\\[客室\\]\n\n您好，欢迎光临Moneybrain酒店 \n提供酒店服务信息，请选择需要的选项 \n\n1. 房间信息\n2. 房间预订\n3. 房间预订确认\n4. 房间预订取消\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('3', function (done) {
            msgMatch('1', '\\[房间信息\\]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('4', function (done) {
            msgMatch('1', '\\[客室 情報 \\- 单人间\\]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n\\- 卧室1， 浴室1，卫生间1\n\\- 视野 : 街景或者海景\n\\- 床型 : 双人床，大床 \n\\- 大小 : 36m2\n\\- 入住 : 下午 3点\n\\- 退宿 : 白天 12点\n\\- 55寸 智能电视 TV\\(52个卫星电视频道\\)卫星电视信息 \n\\- 300Mbps 超高速有线网，无线网免费提供300Mbps \n\\- 可使用 220V 11V 电压 \n\\-  咖啡，茶速冲包免费提供\n\\- 加大号床 30,000韩元/1晚\n\\-婴儿面霜（免费）\n\n\\[房间照片\n\n\\(9.上一步, 0.开始\\)\\]', done);
        });
        it('5', function (done) {
            msgMatch('9', '\\[房间信息\\]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('6', function (done) {
            msgMatch('2', '\\[客室 情報 \\- 单人间\\]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n\\- 卧室1， 浴室1，卫生间1\n\\- 视野 : 街景或者海景\n\\- 床型 : 双人床，大床 \n\\- 大小 : 43m2\n\\- 入住 : 下午 3点\n\\- 退宿 : 白天 12点\n\\- 55寸 智能电视 TV\\(52个卫星电视频道\\)卫星电视信息 \n\\- 300Mbps 超高速有线网，无线网免费提供300Mbps \n\\- 可使用 220V 11V 电压 \n\\-  咖啡，茶速冲包免费提供\n\\- 加大号床 30,000韩元/1晚\n\\-婴儿面霜（免费）\n\n\\[房间照片\n\n\\(9.上一步, 0.开始\\)\\]', done);
        });
        it('7', function (done) {
            msgMatch('0', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('8', function (done) {
            msgMatch('1', '\\[客室\\]\n\n您好，欢迎光临Moneybrain酒店 \n提供酒店服务信息，请选择需要的选项 \n\n1. 房间信息\n2. 房间预订\n3. 房间预订确认\n4. 房间预订取消\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('9', function (done) {
            msgMatch('2', '\\[房间 – 房间预约\\]\n Moneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息 \n\n1. 单人间 \n2. 豪华间 \n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('10', function (done) {
            msgMatch('1', '\\[房间预订\\]\n房间预约情况\n\\- 房间种类 : 单人间\n\n请选择入住日期.\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('11', function (done) {
            msgMatch('2017-07-13', '\\[房间预订\n房间预约信息\n\\- 房间种类 : 单人间\n\\- 入住日期 : 2017\\-07\\-13\n\n请输入退房日期.\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('12', function (done) {
            msgMatch(':reset user', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('13', function (done) {
            msgMatch('1', '\\[客室\\]\n\n您好，欢迎光临Moneybrain酒店 \n提供酒店服务信息，请选择需要的选项 \n\n1. 房间信息\n2. 房间预订\n3. 房间预订确认\n4. 房间预订取消\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('14', function (done) {
            msgMatch('1', '\\[房间信息\\]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('15', function (done) {
            msgMatch('1', '\\[客室 情報 \\- 单人间\\]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n\\- 卧室1， 浴室1，卫生间1\n\\- 视野 : 街景或者海景\n\\- 床型 : 双人床，大床 \n\\- 大小 : 36m2\n\\- 入住 : 下午 3点\n\\- 退宿 : 白天 12点\n\\- 55寸 智能电视 TV\\(52个卫星电视频道\\)卫星电视信息 \n\\- 300Mbps 超高速有线网，无线网免费提供300Mbps \n\\- 可使用 220V 11V 电压 \n\\-  咖啡，茶速冲包免费提供\n\\- 加大号床 30,000韩元/1晚\n\\-婴儿面霜（免费）\n\n\\[房间照片\n\n\\(9.上一步, 0.开始\\)\\]', done);
        });
        it('16', function (done) {
            msgMatch('9', '\\[房间信息\\]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('17', function (done) {
            msgMatch('2', '\\[客室 情報 \\- 单人间\\]\n单人间为您提供舒适安逸的个人空间 \n\n房间构成 \n\\- 卧室1， 浴室1，卫生间1\n\\- 视野 : 街景或者海景\n\\- 床型 : 双人床，大床 \n\\- 大小 : 43m2\n\\- 入住 : 下午 3点\n\\- 退宿 : 白天 12点\n\\- 55寸 智能电视 TV\\(52个卫星电视频道\\)卫星电视信息 \n\\- 300Mbps 超高速有线网，无线网免费提供300Mbps \n\\- 可使用 220V 11V 电压 \n\\-  咖啡，茶速冲包免费提供\n\\- 加大号床 30,000韩元/1晚\n\\-婴儿面霜（免费）\n\n\\[房间照片\n\n\\(9.上一步, 0.开始\\)\\]', done);
        });
        it('18', function (done) {
            msgMatch('9', '\\[房间信息\\]\n\nMoneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息.\n\n1. 单人间\n2. 豪华间\n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('19', function (done) {
            msgMatch('9', '\\[客室\\]\n\n您好，欢迎光临Moneybrain酒店 \n提供酒店服务信息，请选择需要的选项 \n\n1. 房间信息\n2. 房间预订\n3. 房间预订确认\n4. 房间预订取消\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('20', function (done) {
            msgMatch('2', '\\[房间 – 房间预约\\]\n Moneybrain酒店提供三种客房供您选择，请选择希望入住的房型查看详细信息 \n\n1. 单人间 \n2. 豪华间 \n3. 套间\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('21', function (done) {
            msgMatch('1', '\\[房间预订\\]\n房间预约情况\n\\- 房间种类 : 单人间\n\n请选择入住日期.\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('22', function (done) {
            msgMatch('2017 07 13', '\\[房间预订\n房间预约信息\n\\- 房间种类 : 单人间\n\\- 入住日期 : 2017\\-07\\-13\n\n请输入退房日期.\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('23', function (done) {
            msgMatch('2017 07 20', '\\[房间预订\\]\n您的房间预订已经完成.\n\n房间预订信息\n\\- 房间种类 : 单人间\n\\- 入住日期 : 2017년 7月13日\n\\- 退房日期 : 2017\\-07\\-20\n\\- 住宿时间 : 6晚7天\n\\- 价格 : 500,000韩元\n\n确认进行预订吗\\?\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('24', function (done) {
            msgMatch('是', '\\[房间预订\\]\n您的房间预订已经完成.\n\n房间预订信息\n\\- 房间种类 : 单人间\n\\- 入住日期 : 2017년 7月13日\n\\- 退房日期 : 2017년 7月 20日\n\\- 住宿时间 : 6晚7天\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('25', function (done) {
            msgMatch('0', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('26', function (done) {
            msgMatch('2', '\\[餐厅\\]\nMoneybrain为您提供多样的餐饮空间。请点击下列选项查看详细信息。 \n\n1. 韩餐厅\n2. 日餐厅\n3. 中餐厅\n4. 西餐厅\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('27', function (done) {
            msgMatch('3', '\\[餐厅 – 中餐厅\\]\n 融合东方风情和现代感的室内装修，体验中国或香港上流餐厅的感觉。随和而又独居风格的氛围，让您在进入餐厅的一瞬间沉醉其中。 \n\n\\- 位置 : 11楼\n\\- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n\\- 座位数 : 总100座\n\\- 11个房间\n包含照片\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('28', function (done) {
            msgMatch('9', '\\[餐厅\\]\nMoneybrain为您提供多样的餐饮空间。请点击下列选项查看详细信息。 \n\n1. 韩餐厅\n2. 日餐厅\n3. 中餐厅\n4. 西餐厅\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('29', function (done) {
            msgMatch('1', '\\[餐厅 – 韩餐厅\\]\n将传统的味道更加细心，精炼地 表达出来的韩国传统餐厅. 欢迎您来体验世界最初的米其林三星韩餐厅. \n\n\\- 位置 : 23层\n\\- 营业时间 \n中午 : 12:00 ~ 14:30\n晚上 : 18:00 ~ 22:00\n\\- 座位数 : 总 40座\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('30', function (done) {
            msgMatch('0', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('31', function (done) {
            msgMatch('3', '\\[施設\\]\n Moneybrank为顾客提供了可以便捷实用的多种设施。请点击下列选项查看详细信息。 \n\n1. 泳池\n2. 礼堂\n3. 会议厅\n4. 健身房\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('32', function (done) {
            msgMatch('1', '\\[设施 – 泳池\\]\n温泉, 四季浴缸, 室外酒吧，为您提供高档次休闲方式的泳池. \n\n\\- 位置 : 3楼\n\\- 设施介绍 \n浴缸，温泉，吧台，桑拿\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('33', function (done) {
            msgMatch('4', '\\[特别活动\\]\nMoneybrain酒店为迎接夏季而举办的特别活动，想要具体了解请选择下列选项。 \n \n1. 夏季狂欢节 \n2. 晚会玛利亚周\n3. 特别周末\n\n\\(9.上一步, 0.开始\\)', done);
        });
        it('34', function (done) {
            msgMatch('3', '\\丰盛的美食和清爽的啤酒还有隐隐的月光.\n欢迎体验我们为您准备的月光沐浴狂欢节. \n \n \\- 地点 1楼酒吧 .\n 时间', done);
        });
        it('35', function (done) {
            msgMatch('0', '您好，欢迎光临Moneybrain酒店.\n提供酒店服务信息，请选择需要的选项. \n\n1. 房间 \n2. 餐饮 \n3, 设施 \n4. 活动 \n5. 咨询', done);
        });
        it('36', function (done) {
            msgMatch('5', '\\[位置介绍\\]\nMoneybrain酒店是城市中的花园. 尽我们最大的努力为您提供休息的空间. \n\n\\- 地址 : 首尔市中路222号 \n\n\\(9.上一步, 0.开始', done);
        });





        /*
         add a test case here
         it('bot should return "expected" for "msg", function(done) {
         bot_test(bot_name, 'msg', "expected", done);
         });
         */
    });
});
