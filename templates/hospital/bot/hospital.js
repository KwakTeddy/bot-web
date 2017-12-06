var path = require('path');
var bot = require(require('path').resolve("engine/bot")).getTemplateBot('hospital');


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
        task.image = {url: config.host + context.dialog.surgeListType.image};

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
        callback(task,context);
    }
};

bot.setTask('mapButton', mapButton);

var reviewButtonImage = {
    action: function (task,context,callback) {
        task.buttons = [{text:"바로 예약"}, {text:"시술정보 보기"}];
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(config.host);
        task.image = {url: config.host + context.dialog.surgeListType.image};

        callback(task,context);
        callback(task,context);
    }
};

bot.setTask('reviewButtonImage', reviewButtonImage);


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
        task.image = {url: config.host + context.dialog.eventListType.image};
        callback(task,context);
    }
};

bot.setTask('addEventImage', addEventImage);
