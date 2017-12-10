var path = require('path');
var bot = require(require('path').resolve("engine/bot")).getTemplateBot('hospital');


var dateformat = require('dateformat');
var config = require(path.resolve('./config/config'));
var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var request = require('request');
var ObjectId = mongoose.Types.ObjectId;

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var addButton = {
    action: function (task,context,callback) {
        task.buttons = [];
        callback(task,context);
    }
};

bot.setTask('addButton', addButton);

var startTask = {
    action: function (task,context,callback) {
        task.buttons = [
            {text:"시술안내"},
            {text:"병원정보"},
            {text:"예약하기"},
            {text:"시술후기 before&after"},
            {text:"★이벤트★"},
        ];

        // var bot = {
        //     // "_id" : ObjectId("5a17b70e6b06be83117b8f81"),
        //     "hospitalName" : "지섭피부과",
        //     "greeting" : "안녕하세요 지섭 피부과 입니다",
        //     "mainImage" : "/files/beauty_test1.jpg",
        //     "introduce" : "지섭피부과는 최선을 다해 진료합니다.",
        //     "phone" : "02-858-5683",
        //     "mobile" : "010-9259-7716",
        //     "startTime" : "09:00",
        //     "endTime" : "18:00",
        //     "holiday" : "일요일",
        //     "address" : "서울 서초구 방배동 481-5, 104호",
        //     "menus" : [
        //         {
        //             "image" : "/files/AA.13324322.1.jpg",
        //             "recovery" : "2주일",
        //             "price" : "50000",
        //             "description" : "필러시술입니다",
        //             "name" : "필러",
        //             "review" : "xxx회원님의 달라진 모습!",
        //             "reviewImage" : "/files/AA.13324322.1.jpg"
        //         },
        //         {
        //             "image" : "/files/AA.13324322.1.jpg",
        //             "recovery" : "2주일",
        //             "price" : "60000",
        //             "description" : "점제거시술입니다",
        //             "name" : "점제거",
        //             "review" : "xxx회원님의 달라진 모습!",
        //             "reviewImage" : "/files/AA.13324322.1.jpg"
        //         }
        //     ],
        //     "events" : [
        //         {
        //             "image" : "/files/img.jpg",
        //             "description" : "페북이벤트입니다.",
        //             "name" : "페북 이벤트"
        //         }
        //     ],
        //     "templateId" : "5a168e1722358dd2282d837e",
        //     "__v" : 0
        // };
        //
        // Object.assign(context.bot, bot);
        callback(task,context);
    }
};

bot.setTask('startTask', startTask);


var makeSurgeList = {
    action: function (task,context,callback) {
        task.buttons = [];
        for(var i=0; i<context.bot.menus.length; i++){
            task.buttons.push({text: ""+ (i+1) + ". " + context.bot.menus[i].name});
        };
        context.dialog.menus = context.bot.menus;

        callback(task,context);
    }
};

bot.setTask('makeSurgeList', makeSurgeList);


var surgeImageButton = {
    action: function (task,context,callback) {
        task.buttons = [{text:"바로 예약"}, {text:"시술후기 보기"}];
        // task.buttons = [];
        task.image = {url: context.dialog.surgeListType.image};

        callback(task,context);
    }
};

bot.setTask('surgeImageButton', surgeImageButton);


var surgeListType = {
    typeCheck: "listTypeCheck",
    listName: "menus"
};

bot.setType('surgeListType', surgeListType);


var mapButton = {
    action: function (task,context,callback) {
        task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.bot.address}];
        context.dialog.location = context.bot.address;
        callback(task,context);
    }
};

bot.setTask('mapButton', mapButton);

var reviewButtonImage = {
    action: function (task,context,callback) {
        task.buttons = [{text:"바로 예약"}, {text:"시술정보 보기"}];
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(config.host);
        task.image = {url: context.dialog.surgeListType.image};

        callback(task,context);
    }
};

bot.setTask('reviewButtonImage', reviewButtonImage);

var reviewButtonImage2 = {
    action: function (task,context,callback) {
        task.buttons = [{text:"바로 예약"}, {text:"시술정보 보기"}];
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(config.host);
        task.image = {url: context.dialog.surgeListType.reviewImage};

        callback(task,context);
    }
};

bot.setTask('reviewButtonImage2', reviewButtonImage2);


var selectOneEvent = {
    action: function (task,context,callback) {
        context.dialog.eventListType = context.bot.events[0];
        callback(task,context);
    }
};

bot.setTask('selectOneEvent', selectOneEvent);

var makeEvent = {
    action: function (task,context,callback) {
        context.dialog.events = context.bot.events;
        console.log("@@@@@@@@@@@@@@@@@@@");
        console.log(context.dialog.events);
        callback(task,context);
    }
};

bot.setTask('makeEvent', makeEvent);

var addEventButton = {
    action: function (task,context,callback) {
        task.buttons = [];
        for(var i=0; i<context.bot.events.length; i++){
            task.buttons.push({text: ""+ (i+1) + ". " + context.bot.events[i].name});
        };
        callback(task,context);
    }
};

bot.setTask('addEventButton', addEventButton);

var eventListType = {
    typeCheck: "listTypeCheck",
    listName: "events"
};

bot.setType('eventListType', eventListType);

var addEventImage = {
    action: function (task,context,callback) {
        task.image = {url: context.dialog.eventListType.image};
        callback(task,context);
    }
};

bot.setTask('addEventImage', addEventImage);

var reserveRequest2 = {
    name: 'reserveRequest2',
    action: reserveRequest2
};
bot.setTask("reserveRequest2", reserveRequest2);


function reserveRequest2(task, context, callback) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@requested");

    var doc = {
        name: context.dialog.name,
        mobile: context.dialog.mobile || context.user.mobile,
        date: context.dialog.date,
        time: context.dialog.time,
        // numOfPerson: context.dialog.numOfPerson,
        status: '예약요청중',
        botId: context.bot.id,
        userKey: context.user.userKey
    };

    var fields = context.bot.reserveFields || [];
    for(var i = 0; i < fields.length; i++) {
        var field = fields[i];
        doc[field.name] = context.dialog[field.name];
    }

    var TemplateReservation = mongoModule.getModel('hospital-orders');
    var templateReservation = new TemplateReservation(doc);

    templateReservation.save(function(err) {
        if(!context.bot.testMode) {
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);

            // var url = (config.host || "https://remaster.moneybrain.ai")+"/playchat/templates/contents/order";
            var url = ("https://remaster.moneybrain.ai")+"/playchat/templates/contents/order";
            context.bot.authKey = randomNum;

            var query = {url: url};
            var request = require('request');

            request({
                url: 'https://openapi.naver.com/v1/util/shorturl',
                method: 'POST',
                form: query,
                headers: {
                    'Host': 'openapi.naver.com',
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'X-Naver-Client-Id': context.bot.naver.clientId,
                    'X-Naver-Client-Secret': context.bot.naver.clientSecret
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var shorturl;
                    try {shorturl = JSON.parse(body).result.url; } catch(e) {console.log(e);}
                    var message = '[플레이챗]' + '\n' +
                        context.dialog.name + '/' +
                        context.dialog.dateStr + '/';
                    // context.dialog.numOfPerson + '명\n' +
                    if (context.dialog.time) {
                        messages += context.dialog.time + '/';
                    }

                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message +=  context.dialog[field.name] + '명/';
                        } else {
                            message += context.dialog[field.name] + '/';
                        }
                    }

                    message += '\n' + (context.dialog.mobile || context.user.mobile) + '\n' +
                        '예약접수(클릭) ' + shorturl;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            callback(task, context);
                        }
                    );
                } else {
                    callback(task, context);
                }
            });
        } else {
            callback(task, context);
        }
    });

};


var reserveCheck = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@isowner??");
            var TemplateReservation = mongoModule.getModel('hospital-orders');
            TemplateReservation.find({
                botId: context.bot.id,
                date: {$gte: new Date()}
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 0) {
                    for(var i in docs) {
                        docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                callback(task, context);
            });
        } else {
            var TemplateReservation = mongoModule.getModel('hospital-orders');
            TemplateReservation.find({
                upTemplateId: context.bot.templateDataId,
                userKey: context.user.userKey,
                status: {$ne: '취소'},
                date: {$gte: new Date()}
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 1) {
                    for(var i in docs) {
                        docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else if(docs && docs.length > 0) {
                    docs[0].dateStr = dateformat(docs[0].date + 9 * 60 * 60, 'mm월dd일');
                    context.dialog.reserve = docs[0];
                    context.dialog.reserves = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                console.log(JSON.stringify(context.dialog.reserve));
                callback(task, context);
            })
        }
    }
};
bot.setTask('reserveCheck', reserveCheck);


var reserveCancel2 = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('hospital-orders');
            TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '취소'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.dialog.reserve.name + '/' +
                        context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/';
                    // context.dialog.reserve.numOfPerson + '명\n' +
                    // context.dialog.reserve.mobile + '\n' +
                    // '예약취소';

                    var fields = context.bot.reserveFields || [];
                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message +=  context.dialog[field.name] + '명/';
                        } else {
                            message += context.dialog[field.name] + '/';
                        }
                    }

                    message += '\n' + context.dialog.reserve.mobile + '\n' +
                        '예약취소';

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            callback(task, context);
                        }
                    );
                } else {
                    callback(task, context);
                }
            });
        } else {
            callback(task, context);
        }
    }
};
bot.setTask('reserveCancel2', reserveCancel2);
