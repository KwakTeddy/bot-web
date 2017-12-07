var path = require('path');
var bot = require(path.resolve('engine/bot')).getTemplateBot('restaurant');

var type = require(path.resolve('./engine/bot/action/common/type'));

var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('engine/bot-users/server/controllers/bot-users.server.controller'));
var dateformat = require('dateformat');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var mongo = require(path.resolve('./engine/bot/action/common/mongo'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var request = require('request');
var _ = require('lodash');
var globals = require(path.resolve('engine/bot/engine/common/globals'));
var async = require('async');
var restaurantmenu= mongo.getModel('restaurant-menus');

var startTask = {
    action: function (task, context, callback) {
        if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
            context.botUser.isOwner = true;
            // context.bot.authKey = null;
        }

        task.result = {smartReply: ['예약', '위치', '영업시간', '메뉴']};

        context.dialog.날짜입력최초 = undefined;
        context.dialog.시간입력최초 = undefined;
        context.dialog.인원선택최초 = undefined;

        if(context.botUser.isOwner) {
            reserveCheck.action(task, context, function(_task, context) {
                callback(task, context);
            })
        } else {
            callback(task, context);
        }
    }
};

globals.setGlobalTask('startTask', startTask);

exports.startTask = startTask;



var menuDetailTask = {
    action: function(task, context, callback) {
        if(context.dialog.menu.image) {
            task.result = {
                image: {url: context.dialog.menu.image},
                buttons: [
                    {text: '사진보기',
                        url: context.dialog.menu.image.startsWith('http') ? context.dialog.menu.image : config.host + context.dialog.menu.image}
                ]
            };
        }
        callback(task, context);
    }
};

exports.menuDetailTask = menuDetailTask;


var inforpark = {
    name: 'inforpark',
    action: function(task, context, callback) {


        // console.log(typeof JSON.stringify(context.bot.parks[0]));
        // console.log(typeof JSON.parse(JSON.stringify(context.bot.parks[0])));
        if(context.bot.parks[0]===undefined){context.dialog.parkno=undefined;callback(task,context);}
        else if(context.bot.parks[0].parkornot==="false"){context.dialog.parkno=1; callback(task,context);}
        else {context.dialog.parkno=0;
            context.dialog.parkaddress=context.bot.parks[0].parkaddress;
            context.dialog.parkdetails=context.bot.parks[0].parkdetails;
            context.dialog.parksize=context.bot.parks[0].parksize;
            context.dialog.parkname=context.bot.parks[0].parkname;
            context.dialog.parkornot=context.bot.parks[0].parkornot;

                task.result = {
                    buttons : [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.dialog.parkaddress}]
                };


            callback(task,context);}
    }
};

exports.inforpark = inforpark;

var categoryrestaurantlist = {
    name: 'categoryrestaurantlist',
    action: function(task, context, callback) {

        //console.log(context.bot.menus[0]+'+++++++++++++++++++++++++++++');
        if(context.bot.menus.length===0){context.dialog.restaurantno=undefined;callback(task,context);}
        else {

            restaurantmenu.find({botId: context.bot.id,hotmenus:"true"}).lean().exec(function (err, docs) {

                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {

                    context.dialog.categorys = docs;
                    if(context.dialog.categorys.length!==0){

                    context.dialog.restaurantno = 0;
                    var ss = 0;
                    for (i = 0; i < context.dialog.categorys.length; i++) {
                        if (context.dialog.categorys[i].price !== "") {ss++;}
                    }
                    if (ss == context.dialog.categorys.length) {
                        context.dialog.menuprice = 1;
                        callback(task, context);
                    }
                    else{context.dialog.menuprice = 0;
                        callback(task, context);
                    }

                    }
                    else{context.dialog.restaurantno = 1;callback(task, context);}
                    }
            });
        }
    }
};

exports.categoryrestaurantlist = categoryrestaurantlist;

var mapButton = {
    action: function (task,context,callback) {
        task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.bot.address}];
        callback(task,context);
    }
};

exports.mapButton= mapButton;

var categoryrestaurantisornot = {
    name: 'categoryrestaurantisornot',
    action: function(task, context, callback) {
        context.dialog.menuis=undefined;
        context.dialog.menumatch=[];
        //var ss=0;
        //var ll='ㄴㅁㅇㄹㅎㄴㅇㄹㅎㅇㅌㄹㅎdddd';
        //console.log(JSON.stringify(context.bot)+"pppppppppppppppppp");
        //console.log(task.text+"2222222222222222");
        if(context.bot.menus[0]===undefined){context.dialog.menuis=0;callback(task,context);}
        else {
            context.dialog.menuis=0;
            restaurantmenu.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;

                    for(i=0;i<context.dialog.categorys.length;i++)
                    {
                        var str=context.dialog.inRaw;
                        //console.log(str.indexOf(context.dialog.categorys[i].name)+"2222222222222222");

                        //var regDate =/[context.dialog.inRaw]/;
                        //if (regDate.test(context.dialog.categorys[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                        if(str.indexOf(context.dialog.categorys[i].name)>=0){context.dialog.menumatch.push(context.dialog.categorys[i]);}
                    }
                    if(context.dialog.menumatch.length!==0)
                    {context.dialog.menuis=1;}
                    callback(task, context);
                }
            });
        }
    }
};

exports.categoryrestaurantisornot = categoryrestaurantisornot;


var action1 = {
    action: function(task, context, callback)
    {
        task.result = {smartReply: ['예약확정', '예약취소']}; callback(task, context);
    }
};

exports.action1 = action1;



var action2 = {
    action: function(task, context, callback)
    {
        context.dialog.날짜입력최초 = true; callback(task, context);
    }
};

exports.action2 = action2;


var action3 = {
    action: function(task, context, callback)
    {
        context.dialog.시간입력최초 = true; callback(task, context);
    }
};

exports.action3 = action3;


var action4 = {
    action: function(task, context, callback)
    {
        context.dialog.인원선택최초 = true; callback(task, context);
    }
};

exports.action4 = action4;


exports.mapTask = {
    action: function(task, context, callback) {
        task.address = context.bot.address;
        task.name = context.bot.name;

        daumgeoCode(task, context, function(_task, context) {
            task.result = {
                buttons: [
                    {text: '지도보기', url: task.url}
                ]
            };
            callback(task, context);
        });
    }
};

var menuImageTask = {
    action: function(task, context, callback) {
        if(context.bot.menuImage) {
            var img = context.bot.menuImage.startsWith('http') ? context.bot.menuImage : config.host + context.bot.menuImage;
            task.result = {
                image: {url: img},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

exports.menuImageTask = menuImageTask;

function naverGeocode(task, context, callback) {
    var query = {query: task.address};
    var request = require('request');

    request({
        url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
        method: 'GET',
        qs: query,
        headers: {
            'Host': 'openapi.naver.com',
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'X-Naver-Client-Id': context.bot.naver.clientId,
            'X-Naver-Client-Secret': context.bot.naver.clientSecret
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var doc = JSON.parse(body);
            task.lng=doc.result.items[0].point.x;
            task.lat=doc.result.items[0].point.y;
            console.log('lat: ' + task.lat + ', lng: ' + task.lng);
        }
        callback(task, context);
    });
}

exports.naverGeocode = naverGeocode;


function daumgeoCode (task, context, callback) {
    // if (context.dialog.bank == undefined) {
    //   callback(false);
    // } else {
    naverGeocode(task, context, function(task, context) {
        var request = require('request');
        var query = {q: task.address, output: "json"};
        task._doc = {
            lng: '',
            lat: '',
            link_find: '',
            link_map: '',
            address: ''
        };
        request({
            url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
            method: 'GET',
            qs: query
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
                var doc = JSON.parse(body);
                task._doc.link_map = 'http://map.daum.net/link/map/' + task.name + ',' + task.lat + ',' + task.lng;

                task.url = task._doc.link_map;
                task.urlMessage = '지도에서 위치보기';
            }
            callback(task, context);
        });
    })
    // }
}
exports.daumgeoCode = daumgeoCode;

function numOfPersonTypeCheck(inRaw, _type, inDoc, context, callback) {
    var re;
    if(_type.init) re = /(\d)\s*명?/g;
    else re = /(\d)(?:\s*명)?/g;

    var matched = inRaw.match(re);
    if(matched != null) {
        try {
            context.dialog.numOfPerson = parseInt(matched[0]);
            callback(inRaw, inDoc, true);
        } catch(e) {
            console.log(e);
            callback(inRaw, inDoc, false);
        }
    } else {
        var num = type.parseNumber(inRaw);
        if(num != inRaw) {
            try {
                context.dialog.numOfPerson = parseInt(num);
                callback(inRaw, inDoc, true);
            } catch(e) {
                console.log(e);
                callback(inRaw, inDoc, false);
            }
        } else {
            callback(inRaw, inDoc, false);
        }
    }
}

globals.setGlobalTypeCheck('numOfPersonTypeCheck', numOfPersonTypeCheck);

function checkTime(task, context, callback) {
    var day = new Date().getDay();
    var holiday = dateStringToNumber(context.bot.holiday);

    if (day == holiday) {
        context.dialog.check = true;
    } else {
        if (context.dialog.time == 're') {
            context.dialog.check = 're';
        } else if (context.dialog.time > context.bot.endTime || context.dialog.time < context.bot.startTime) {
            context.dialog.check = true;
        } else {
            context.dialog.check = false;
        }
    }
    callback(task, context);
}

exports.checkTime = checkTime;

function checkDate(task, context, callback) {
    var day = context.dialog.date.getDay();

    var holiday = dateStringToNumber(context.bot.holiday);

    if (day == holiday) {
        context.dialog.check = true;
    } else {
        context.dialog.check = false;
    }

    callback(task, context);
}

exports.checkDate = checkDate;


function dateStringToNumber(dateString) {
    if(dateString == '일요일' || dateString == '일') return 0;
    else if(dateString == '월요일' || dateString == '월') return 1;
    else if(dateString == '화요일' || dateString == '화') return 2;
    else if(dateString == '수요일' || dateString == '수') return 3;
    else if(dateString == '목요일' || dateString == '목') return 4;
    else if(dateString == '금요일' || dateString == '금') return 5;
    else if(dateString == '토요일' || dateString == '토') return 6;
    else return dateString;

}

/********************* SMS *********************/

var smsAuth = {
    preCallback: function(task, context, callback) {
        if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        callback(task, context);
    },
    action: messages.sendSMSAuth
};

globals.setGlobalTask('smsAuth', smsAuth);


function smsAuthValid(dialog, context, callback) {
    console.log(context.dialog.smsAuth);
    callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);
}

exports.smsAuthValid = smsAuthValid;

function smsAuthinValid(dialog, context, callback) {
    callback(dialog.inRaw.replace(/\s*/g, '') == context.dialog.smsAuth);
}

exports.smsAuthinValid = smsAuthinValid;

var smsAuthTask = {
    action: function (task, context, callback) {
        context.user['mobile'] = context.dialog['mobile'];
        context.user.updates = ['mobile'];
        botUser.updateUserContext(context.user, context, function () {
            context.user.updates = null;

            context.dialog.smsAuth == null;
            callback(task, context);
        });
    }
};

globals.setGlobalTask('smsAuthTask', smsAuthTask);

/********************* 예약 *********************/

function reserveConfirm(task, context, callback) {
    context.dialog['dateStr'] = dateformat(context.dialog.date + 9 * 60 * 60, 'mm월dd일');

    callback(task, context);
}

globals.setGlobalAction('reserveConfirm', reserveConfirm);


function reserveRequest(task, context, callback) {

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

    var TemplateReservation = mongoModule.getModel('restaurant-reservations');
    var templateReservation = new TemplateReservation(doc);

    templateReservation.save(function(err) {
        if(!context.bot.testMode) {
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);

            var url = config.host + '/mobile#/chat/' + context.bot.id + '?authKey=' + randomNum;
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

}

globals.setGlobalAction('reserveRequest', reserveRequest);


var reserveCheck = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.find({
                botId: context.bot.id,
                status: '예약요청중',
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
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.find({
                botId: context.bot.id,
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
                callback(task, context);
            })
        }
    }
};

// bot.setTask('reserveCheck', reserveCheck);
exports.reserverCheck = reserveCheck;

var reserveCancel = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
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

globals.setGlobalTask('reserveCancel', reserveCancel);

var reserveOwnerCancel = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '업주취소'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.dialog.reserve.name + '/' +
                        context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/';
                    // context.dialog.reserve.numOfPerson + '명\n' +
                    // '예약취소: '+
                    // task.inRaw + '\n' +
                    // '매장전화: ' + context.bot.phone;

                    var fields = context.bot.reserveFields || [];
                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message += context.dialog.reserve[field.name] + '명/';
                        } else {
                            message += context.dialog.reserve[field.name] + '/';
                        }s
                    }

                    message += '\n예약취소: '+
                        task.inRaw + '\n' +
                        '매장전화: ' + context.bot.phone;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.dialog.reserve.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            reserveCheck.action(task, context, function(_task, context) {
                                callback(task, context);
                            });
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

globals.setGlobalTask('reserveOwnerCancel', reserveOwnerCancel);

var reserveOwnerConfirm = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '확정'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n' +
                        context.dialog.reserve.name + '/' +
                        context.dialog.reserve.dateStr + '/' + context.dialog.reserve.time + '/';
                    // context.dialog.reserve.numOfPerson + '명\n' +
                    // '예약확정\n'+
                    // '매장전화: ' + context.bot.phone;

                    var fields = context.bot.reserveFields || [];
                    for(var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if(field.name == 'numOfPerson') {
                            message += context.dialog.reserve[field.name] + '명/';
                        } else {
                            message += context.dialog.reserve[field.name] + '/';
                        }
                    }

                    message += '\n예약확정\n'+
                        '매장전화: ' + context.bot.phone;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.dialog.reserve.mobile.replace(/,/g, ''), message: message}},
                        function (error, response, body) {
                            reserveCheck.action(task, context, function(_task, context) {
                                callback(task, context);
                            })
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

globals.setGlobalTask('reserveOwnerConfirm', reserveOwnerConfirm);


var reserveNameTask = {
    action: function (task, context, callback) {
        context.dialog.name = task.inRaw;
        callback(task, context);
    }
};

globals.setGlobalTask('reserveNameTask', reserveNameTask);

var reserveMemoTask = {
    action: function (task, context, callback) {
        context.dialog.memo = task.inRaw;
        callback(task, context);
    }
};

globals.setGlobalTask('reserveMemoTask', reserveMemoTask);

var reservePeriodTask = {
    action: function (task, context, callback) {
        context.dialog.period = task.inRaw;
        callback(task, context);
    }
};

globals.setGlobalTask('reservePeriodTask', reservePeriodTask);

var menuType = {









    name: 'menus',
    typeCheck: type.mongoDbTypeCheck,
    limit: 5,
    mongo: {
        model: 'restaurant-menu',
        queryFields: ['categoryss'],
        fields: 'name price image' ,
        taskFields: ['_id', 'name', 'price', 'image'],
        taskSort: function(a, b) {
            if(b.matchCount > a.matchCount) return 1;
            else if(b.matchCount < a.matchCount) return -1;
            else {
                if(a.created && b.created) {
                    if(b.created.getTime() < a.created.getTime()) return 1;
                    else if(b.created.getTime() > a.created.getTime()) return -1;
                }

                return 0;
            }
        },
        //query: {},
        // sort: "-created",
        // limit: 5,
        minMatch: 1
    }
};

exports.menuType = menuType;

var menuTask = {
    action: function (task, context, callback) {
        context.dialog.menus = task.typeDoc;
        // var items = [];
        // for(var i = 0; i < menus.length; i++) {
        //   items.push({
        //     title: menus[i].name,
        //     text: menus[i].price + '원',
        //     imageUrl: menus[i].image, buttons: [{input: menus[i].name, text: '상세보기'}]
        //   });
        // }
        //
        // if(items.length > 0) task.result = {items: items};

        callback(task, context);
    }
};

globals.setGlobalTask('menuTask', menuTask);

function eventAction(task, context, callback) {

    var inCurRaw = context.dialog.inCurRaw;

    inCurRaw = parseInt(inCurRaw);

    var event = context.dialog.events[inCurRaw-1];

    task.doc = context.dialog.events;
    task.result = { items: [event] };

    console.log('ㅇ너럳재ㅑ러ㅑ대저랮댤', task);
    callback(task, context);

    // var model, query, sort;
    // // if (context.dialog.events.length == 1) {
    // //     context.dialog.category = context.dialog.categorys[0];
    // // }
    // model = mongoModule.getModel('restaurant-events');
    // query = {botId: context.bot.id};
    // sort = {'_id': +1};
    //
    // model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
    //     task.doc = docs;
    //     context.dialog.menus = docs;
    //     var result = [];
    //     async.eachSeries(task.doc, function(doc, cb) {
    //         var _doc = {};
    //         if (doc.name) {
    //             _doc.title = doc.name;
    //         }
    //         if (doc.description) {
    //             _doc.text = doc.description;
    //         }
    //         if (doc.price) {
    //             _doc.text = _doc.text + ' ' + doc.title + '원';
    //         }
    //         if (doc.image) {
    //             _doc.imageUrl = doc.image;
    //         }
    //         result.push(_doc);
    //         cb(null)
    //     }, function (err) {
    //         task.result = {items: result};
    //         if (task.result.items.length == 0) {
    //             task.result = null;
    //         }
    //         callback(task, context);
    //     });
    // });
}

exports.eventAction = eventAction;


function peopleCategoryAction(task, context, callback) {
    var model, query, sort;

    model = mongoModule.getModel('templatepeople');
    query = {botId: context.bot.id};
    sort = {'_id': -1};


    model.aggregate([
        {$match: query},
        {$sort: sort},
        {$group: {
            _id: '$category',
            category: {$first: '$category'}
        }}
    ], function(err, docs) {
        if(docs == undefined) {
            callback(task, context);
        } else {
            var categorys = [];
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];

                var category = doc.category;
                if(!_.includes(categorys, category)){
                    categorys.push({name: category});
                }

                // for (var j = 0; j < doc.category.length; j++) {
                //   var category = doc.category[j];
                //   if(!_.includes(categorys, category)){
                //     categorys.push({name: category});
                //   }
                // }
            }

            if (categorys.length == 1) {
                task.doc = categorys;
                context.dialog.categorys = categorys;
                peopleAction(task,context, function(task,context) {
                    callback(task,context);
                });
            } else if (categorys.length > 1) {
                task.doc = categorys;
                context.dialog.categorys = categorys;
                callback(task,context);
            } else {
                callback(task,context);
            }
        }
    });
}


exports.peopleCategoryAction = peopleCategoryAction;

function peopleAction(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }
    model = mongoModule.getModel('templatepeople');
    query = {botId: context.bot.id,
        category: context.dialog.category.name};
    sort = {'_id': +1};

    model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
        task.doc = docs;
        context.dialog.menus = docs;
        var result = [];
        async.eachSeries(task.doc, function(doc, cb) {
            var _doc = {};
            if (doc.name) {
                _doc.title = doc.name;
            }
            if (doc.description) {
                _doc.text = doc.description;
            }
            if (doc.price) {
                _doc.text = _doc.text + ' ' + doc.title + '원';
            }
            if (doc.image) {
                _doc.imageUrl = doc.image;
            }
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    });
}

exports.peopleAction = peopleAction;

function previewCategoryAction(task, context, callback) {
    var model, query, sort;

    model = mongoModule.getModel('restaurant-previews');
    query = {botId: context.bot.id};
    sort = {'_id': -1};


    model.aggregate([
        {$match: query},
        {$sort: sort},
        {$group: {
            _id: '$category',
            category: {$first: '$category'}
        }}
    ], function(err, docs) {
        if(docs == undefined) {
            callback(task, context);
        } else {
            var categorys = [];
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];

                var category = doc.category;
                if(!_.includes(categorys, category)){
                    categorys.push({name: category});
                }

                // for (var j = 0; j < doc.category.length; j++) {
                //   var category = doc.category[j];
                //   if(!_.includes(categorys, category)){
                //     categorys.push({name: category});
                //   }
                // }
            }
            if (categorys.length == 1) {
                task.doc = categorys;
                context.dialog.categorys = categorys;
                previewAction(task,context, function(task,context) {
                    callback(task,context);
                });
            } else if (categorys.length > 1) {
                task.doc = categorys;
                context.dialog.categorys = categorys;
                callback(task,context);
            } else {
                callback(task,context);
            }
        }
    });
}


exports.previewCategoryAction = previewCategoryAction;

function previewAction(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }
    model = mongoModule.getModel('restaurant-previews');
    query = {botId: context.bot.id,
        category: context.dialog.category.name};
    sort = {'_id': +1};

    model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
        task.doc = docs;
        context.dialog.menus = docs;
        var result = [];
        async.eachSeries(task.doc, function(doc, cb) {
            var _doc = {};
            if (doc.name) {
                _doc.title = doc.name;
            }
            if (doc.description) {
                _doc.text = doc.description;
            }
            if (doc.price) {
                _doc.text = _doc.text + ' ' + doc.title + '원';
            }
            if (doc.image) {
                _doc.imageUrl = doc.image;
            }
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    });
}

exports.previewAction = previewAction;

function menuCategoryAction(task, context, callback) {

    if(context.bot.menuImage) {
        var img = context.bot.menuImage.startsWith('http') ? context.bot.menuImage : config.host + context.bot.menuImage;
        task.result = {
            image: {url: img},
            buttons: [
                {text: '메뉴판 사진 보기', url: img}
            ]
        };
    }
    var model, query, sort;

    model = mongoose.model('restaurant-menus');
    query = {botId: context.bot.id};
    sort = {'_id': -1};
    //console.log(JSON.stringify(categorys)+'+++++++++++++++++++++++');

    model.aggregate([
        {$match: query},
        {$sort: sort},
        {$group: {
            _id: '$category',
            category: {$first: '$category'}
        }}
    ], function(err, docs) {
        if(docs == undefined) {
            callback(task, context);
        } else {
            //console.log(JSON.stringify(docs)+'+++++++++++++++++++++++');
            var categorys = [];
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];

                //var category = doc.category;
                var category = doc;


                    categorys.push(category);
                //console.log(JSON.stringify(categorys)+'+++++++++++++++++++++++');
                // for (var j = 0; j < doc.category.length; j++) {
                //   var category = doc.category[j];
                //   if(!_.includes(categorys, category)){
                //     categorys.push({name: category});
                //   }
                // }
            }

            if (categorys.length == 1) {
                task.doc = categorys;
                context.dialog.categorys = categorys;
                menuAction(task,context, function(task,context) {
                    callback(task,context);
                });
            } else if (categorys.length > 1) {
                task.doc = categorys;
                console.log(context.dialog.categorys+'+++++++++++++++++++++++');
                context.dialog.categorys = categorys;
                callback(task,context);
            } else {
                callback(task,context);
            }
        }
    });
}

exports.menuCategoryAction = menuCategoryAction;

var categorymenu = {
    action: function (task, context, callback) {
        console.log(context.dialog.category+'++++++++++++++++888+++++++++');
        restaurantmenu.find({
            botId: context.bot.id,
            category: context.dialog.category.category
        }).lean().exec(function (err, docs) {

            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                task.doc = docs;
                context.dialog.categorymenus = docs;
                context.dialog.categoryss=context.dialog.categorymenus[0].category;
                console.log(context.dialog.categorymenus+'++++++++++++++++888+++++++++');
                callback(task, context);
            }
        });
    }
};
exports.categorymenu = categorymenu;





function menuAction(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }

    model = mongoose.model('restaurant-menus');
    query = {botId: context.bot.id,
        category: context.dialog.category.category};
    sort = {'_id': +1};

    model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function(err, docs) {
        task.doc = docs;
        context.dialog.menus = docs;

        var result = [];
        async.eachSeries(task.doc, function(doc, cb) {
            var _doc = {};
            if (doc.name) {
                _doc.title = doc.name;
            }
            if (doc.description) {
                _doc.text = doc.description;
            } else {
                _doc.text = '';
            }
            if (doc.price) {
                _doc.text = _doc.text + ' ' + doc.price + '원';
            }
            if (doc.image) {
                _doc.imageUrl = doc.image;
            }
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    });
}

exports.menuAction = menuAction;


var categorymenuisornot= {
    action: function(task, context, callback)
{
    console.log("++++++++++++++++++++++++++++++");
    context.dialog.menuis = 0;
    restaurantmenu.find({
        botId: context.bot.id,
        category: context.dialog.category.category
    }).lean().exec(function (err, docs) {
        if (err) {
            console.log(err);
            callback(task, context);
        } else {
            context.dialog.categorys = docs;

            for (i = 0; i < context.dialog.categorys.length; i++) {
                var str = context.dialog.inRaw;
                var ll=i+1;
                //console.log(str.indexOf(context.dialog.categorys[i].name)+"2222222222222222");

                //var regDate =/[context.dialog.inRaw]/;
                //if (regDate.test(context.dialog.category
                // s[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                if (str === context.dialog.categorys[i].name || str ===ll) {
                    context.dialog.categorymenu.push(context.dialog.categorys[i]);
                }
            }
            if (context.dialog.categorymenu.length !== 0) {
                context.dialog.menuis = 1;
            }
            callback(task, context);
        }
    });
}
};

exports.categorymenuisornot = categorymenuisornot;
