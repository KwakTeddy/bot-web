var path = require('path');
var bot = require(path.resolve('engine/bot')).getTemplateBot('restaurant');
var mongo = require(path.resolve('./engine/bot/action/common/mongo'));
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var mongoose = require('mongoose');
var type = require(path.resolve('./engine/bot/action/common/type'));
var restaurantmenu= mongo.getModel('restaurant-menus');
var globals = require(path.resolve('engine/bot/engine/common/globals'));
var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var botUser= require(path.resolve('engine/bot-users/server/controllers/bot-users.server.controller'));
var dateformat = require('dateformat');
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./config/lib/logger'));
var restaurantreservation= mongo.getModel('restaurant-reservations');
var request = require('request');
var _ = require('lodash');
var async = require('async');

const IN_TAG_START = '{';
const IN_TAG_END = '}';


var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var startTask = {
    name:'startTask',
    action: function (task, context, callback) {
        // if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
        //     context.botUser.isOwner = true;
        //     // context.bot.authKey = null;
        // }
        context.botUser.isOwner = false;
        console.log('context.bot.authKey: '+ context.bot.authKey);
        console.log('context.botUser.options: '+ context.botUser.options);
        console.log('context.bot.authKey: '+ context.bot.authKey);
        console.log('context.botUser.options.authKey: '+ context.botUser.options.authKey);
        console.log('context.botUser.isOwner: '+ context.botUser.isOwner);
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

bot.setTask("startTask", startTask);
exports.startTask = startTask;

// var startTask = {
//     action: function (task, context, callback) {
//         if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
//             context.botUser.isOwner = true;
//             // context.bot.authKey = null;
//         }
//
//         task.result = {smartReply: ['예약', '위치', '영업시간', '메뉴']};
//
//         context.dialog.날짜입력최초 = undefined;
//         context.dialog.시간입력최초 = undefined;
//         context.dialog.인원선택최초 = undefined;
//
//         if(context.botUser.isOwner) {
//             reserveCheck.action(task, context, function(_task, context) {
//                 callback(task, context);
//             })
//         } else {
//             callback(task, context);
//         }
//     }
// };
//
// globals.setGlobalTask('startTask', startTask);
// bot.setTask("startTask", startTask);


var eventCategoryAction = {
    name: 'eventCategoryAction',
    action: function(task, context, callback) {
        var model;
        context.dialog.eventcategorylength=[];
        model = mongoModule.getModel('restaurant-events');
        //query = {botId: context.bot.id};
        //sort = {'_id': -1};

        model.find({ botId: context.bot.id }).lean().exec(function(err,docs)
        {
            if(!docs)
            {
                context.dialog.events = undefined;
                callback(task, context);
            }
            else
            {
               // console.log('ㅑㅐ너랴ㅐㄴ어래쟈 결과 : ', list);
                context.dialog.events = docs;

                console.log('context.dialog.events.length : ', context.dialog.events.length);
                //task.doc = docs;
                callback(task,context);
            }
        });
    }
};

bot.setTask("eventCategoryAction", eventCategoryAction);


var eventlistType = {
    name: "events",
    listName: "events",
    typeCheck: "listTypeCheck"
};
bot.setType("eventlistType", eventlistType);

var mobile = {
    name: 'mobile',
    raw: true,
    context: true,
    typeCheck: regexpTypeCheck,
    regexp: /\b((?:010[-. ]?\d{4}|01[1|6|7|8|9][-. ]?\d{3,4})[-. ]?\d{4})\b/g,
    checkRequired: function(text, type, inDoc, context) {
        if(text.search(/[^\d-]/g) != -1) return '숫자와 - 기호만 사용할 수 있습니다';
        else if(text.length < 13) return '자리수가 맞지 않습니다';
        else return '휴대폰전화번호 형식으로 입력해 주세요';
    }
};

bot.setType("mobile", mobile);

function regexpTypeCheck (text, type, task, context, callback) {
    var re = type.regexp;
    var matched = false;

    logger.debug('');
    logger.debug('type.js:regexpTypeCheck: START ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    text = text.replace(re, function (match, p1, offset, string) {
        matched = true;

        // if(task[type.name]) {
        //   if(Array.isArray(task[type.name])) task[type.name].push(p1);
        //   else task[type.name] = [task[type.name], p1];
        // } else {
        task[type.name] = p1;
        // }

        return IN_TAG_START + type.name + IN_TAG_END;
    });

    if (matched)
        logger.debug('type.js:regexpTypeCheck: MATCHED ' + type.name + ' "' + text + '" inDoc: ' + JSON.stringify(task[type.name]));

    callback(text, task, matched);
}

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

bot.setTask("inforpark", inforpark);

var checkTime= {
    name: 'checkTime',
    action: function (task, context, callback) {

        var day = new Date().getDay();
        var holiday = dateStringToNumber(context.bot.holiday);
        var str = context.bot.endTime;
        var str1 = context.bot.startTime;
        var str0 = str.substring(3, 5);
        var str10 = str1.substring(3, 5);
        console.log('context.dialog.time==========='+context.dialog.time);
        var xx = Number(context.dialog.time.substring(0, 1));
        if (((str.indexOf('오전') >= 0) && (str1.indexOf('오전')>=0))){
            console.log('===================111');

            context.dialog.endTime1 = Number(str0);
            context.dialog.startTime1 = Number(str10);
            console.log('context.dialog.startTime1==========='+context.dialog.startTime1);
            console.log('context.dialog.endTime1==========='+context.dialog.endTime1);
            console.log('xx==========='+xx);
            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > 0 || xx >= context.dialog.startTime1 && xx < 24) {
                    console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }

        }
        else if((str.indexOf('오후') >= 0) && (str1.indexOf('오후')>=0)) {
            console.log('===================222');
            context.dialog.endTime1 = Number(str0) + 12;
            context.dialog.startTime1 = Number(str10) + 12;
            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > 0 || xx > context.dialog.startTime1 && xx < 24) {
                    console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }
        }
        else {
            console.log('===================333');
            if (str.indexOf('오후') >= 0) {
                context.dialog.endTime1 = Number(str0) + 12;
            }
            if (str1.indexOf('오전') >= 0) {
                context.dialog.startTime1 = Number(str10);
            }

            if (day == holiday) {
                context.dialog.check = true;
                callback(task, context);
            } else {
                if (context.dialog.time == 're') {
                    context.dialog.check = 're';
                } else if (xx < context.dialog.endTime1 && xx > context.dialog.startTime1) {
                    console.log('===================333');
                    context.dialog.check = true;
                } else {

                    context.dialog.check = false;
                }
                callback(task, context);
            }

        }
    }
};
bot.setTask("checkTime", checkTime);



var checkDate= {
    name: 'checkDate',
    action: function (task, context, callback) {
        console.log('====================');
        var day = context.dialog.date.getDay();

        var holiday = dateStringToNumber(context.bot.holiday);
        if (holiday == 7) {
            context.dialog.check = false;
            callback(task, context);
        }
        else {
            if (day == holiday) {
                context.dialog.check = true;
            } else {
                context.dialog.check = false;
            }

            callback(task, context);
        }
    }
};
bot.setTask("checkDate", checkDate);

function dateStringToNumber(dateString) {
    if(dateString == '일요일' || dateString == '일') return 0;
    else if(dateString == '월요일' || dateString == '월') return 1;
    else if(dateString == '화요일' || dateString == '화') return 2;
    else if(dateString == '수요일' || dateString == '수') return 3;
    else if(dateString == '목요일' || dateString == '목') return 4;
    else if(dateString == '금요일' || dateString == '금') return 5;
    else if(dateString == '토요일' || dateString == '토') return 6;
    else if(dateString == '365일 영업' || dateString == '휴일 없다' || dateString == '없다' || dateString == '휴일없음') return 7;
    else return dateString;
}

var menuCategoryAction= {
    name: 'menuCategoryAction',
    action: function (task, context, callback) {
        context.dialog.categoryisone=undefined;
        context.dialog.categorylength=[];

        
        if (context.bot.menuImage) {
            var img = context.bot.menuImage.startsWith('http') ? context.bot.menuImage : config.host + context.bot.menuImage;
            task.result = {
                image: {url: img},
                buttons: [
                    {text: '메뉴판 사진 보기', url: img}
                ]
            };
        }
        //console.log(context.bot.menus[0]+'+++++++++++++++++++++++++++++');
        if(context.bot.menus.length===0){context.dialog.restaurantno=undefined;callback(task,context);}
        else {
            restaurantmenu.find({botId: context.bot.id}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;
                    for(i=0;i<context.dialog.categorys.length;i++){
                        for(j=0;j<=context.dialog.categorylength.length;j++){
                            var count1=0;
                            if(context.dialog.categorylength.length!==0)
                            {
                                if(context.dialog.categorys[i].category!==context.dialog.categorylength[j]){count1++;}
                            }
                        }
                        if(count1==context.dialog.categorylength.length)
                        {context.dialog.categorylength.push(context.dialog.categorys[i]);}
                     console.log(JSON.stringify(context.dialog.categorylength)+'======================');
                    }
                    if(context.dialog.categorylength.length>1){
                        context.dialog.categoryisone=0;
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
                    else if(context.dialog.categorylength.length===1)
                    {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++3');
                        context.dialog.categoryisone = 1;
                        context.dialog.restaurantno = 0;
                        restaurantmenu.find({
                            botId: context.bot.id,
                            category: context.dialog.categorylength
                        }).lean().exec(function (err, docs) {

                            context.dialog.menuss = docs[0];
                            callback(task, context);
                        });
                    }
                    else {
                        //console.log(context.dialog.categorylength+'+++++++++++++++++++++++++++++++2');
                        context.dialog.restaurantno = 1;callback(task, context);
                    }
                }
            });
        }
    }
};

bot.setTask("menuCategoryAction", menuCategoryAction);

var categorymenu = {
    action: function (task, context, callback) {
        //console.log(context.dialog.category+'++++++++++++++++888+++++++++');
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
               // console.log(context.dialog.categorymenus+'++++++++++++++++888+++++++++');
                callback(task, context);
            }
        });
    }
};

bot.setTask("categorymenu", categorymenu);


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


var categoryrestaurantlist= {
    name: 'categoryrestaurantlist',
    action:function(task, context, callback) {

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
bot.setTask("categoryrestaurantlist", categoryrestaurantlist);




var categoryrestaurantlistisornot= {
    name: 'categoryrestaurantlistisornot',
    action:function(task, context, callback) {
        var str=context.dialog.inCurRaw;
        context.dialog.menucategory=[];
            restaurantmenu.find({botId: context.bot.id,hotmenus:"true"}).lean().exec(function (err, docs) {

                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;

                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            var ll=i+1;
                            if ((str.indexOf(context.dialog.categorys[i].name)>0)||str==ll) { context.dialog.menucategory.push(context.dialog.categorys[i]);}
                        }
                      //console.log(context.dialog.menucategory.length+'+++++++++++++++++++++++++++++');
                        if (context.dialog.menucategory.length) {
                            context.dialog.menuprice = 1;
                            // if(context.dialog.menucategory.image) {
                            //     var img = context.dialog.menucategory.image.startsWith('http') ? context.dialog.menucategory.imagee : config.host + context.dialog.menucategory.image;
                            //     task.result = {
                            //         image: {url: img},
                            //         buttons: [
                            //             {text: '자세히보기', url: img}
                            //         ]
                            //     };
                            // }
                            callback(task, context);
                        }
                        else{context.dialog.menuprice = 0;
                            callback(task, context);
                        }
                }
            });
        }
};
bot.setTask("categoryrestaurantlistisornot", categoryrestaurantlistisornot);



var mapButton = {
    "name":"mapButton",
    action: function (task,context,callback) {
        task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.bot.address}];
        callback(task,context);
    }
};
bot.setTask("mapButton", mapButton);


var categoryrestaurantisornot = {
    name: 'categoryrestaurantisornot',
    action: function(task, context, callback) {
        context.dialog.menuis=undefined;
        context.dialog.menumatch=[];
        context.dialog.categorymatch=[];
        //var ss=0;
        //var ll='ㄴㅁㅇㄹㅎㄴㅇㄹㅎㅇㅌㄹㅎdddd';
        //console.log(JSON.stringify(context.bot)+"pppppppppppppppppp");
        //console.log(task.text+"2222222222222222");
        if(context.bot.menus[0]===undefined){context.dialog.menuis=0;callback(task,context);}
        else {
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
                        if(str.indexOf(context.dialog.categorys[i].category)>=0){context.dialog.categorymatch.push(context.dialog.categorys[i].category);}
                        //console.log(context.dialog.categorymatch+"2222222222222222");
                    }
                    if(context.dialog.menumatch.length!==0)
                    {
                        context.dialog.menuis=1;
                        callback(task, context);
                    }
                    //console.log(context.dialog.categorymatch[0]+"2222222222222222");
                    if(context.dialog.categorymatch.length!==0)
                    {
                        restaurantmenu.find({botId: context.bot.id,category:context.dialog.categorymatch[0]}).lean().exec(function (err, docs) {
                            context.dialog.categoryis=1;
                            context.dialog.categorymatchmenu=docs;
                            callback(task, context);
                        });
                    }
                }
            });
        }
    }
};
bot.setTask("categoryrestaurantisornot", categoryrestaurantisornot);


var menuImageTask3 = {
    name: 'menuImageTask3',
    action: function(task, context, callback) {
        context.dialog.categorymenu=[];
       // var inCurRaw=context.dialog.inCurRaw;
        restaurantmenu.find({botId: context.bot.id,category:context.dialog.categorymatch[0]}).lean().exec(function (err, docs) {
            context.dialog.categorys=docs;
            for (i = 0; i < context.dialog.categorys.length; i++) {
                var str = context.dialog.inCurRaw;
                var ll=i+1;
                if (str==ll){
                    context.dialog.categorymenu.push(context.dialog.categorys[i]);
                    var img = context.dialog.categorymenu[0].image.startsWith('http') ? context.dialog.categorymenu[0].imagee : config.host + context.dialog.categorymenu[0].image;
                    task.result = {
                        image: {url: context.dialog.categorymenu[0].image},
                        buttons: [
                            {text: '자세히보기', url: img}
                        ]
                    };
                }
            }
            callback(task, context);
        });
    }
};
bot.setTask("menuImageTask3", menuImageTask3);


var menuimagedisplay = {
    name: 'menuimagedisplay',
    action: function(task, context, callback) {
                if (context.dialog.categorymenu[0].image){
                    var img = context.dialog.categorymenu[0].image.startsWith('http') ? context.dialog.categorymenu[0].imagee : config.host + context.dialog.categorymenu[0].image;
                    task.result = {
                        image: {url: context.dialog.categorymenu[0].image},
                        buttons: [
                            {text: '자세히보기', url: img}
                        ]
                    };
                    callback(task, context);
                }
    }
};
bot.setTask("menuimagedisplay", menuimagedisplay);




var categorymenuisornot= {
    action: function(task, context, callback)
    {
        //console.log("++++++++++++++++++++++++++++++");
        context.dialog.menuis = 0;
        context.dialog.categorymenu=[];
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
                    var str = context.dialog.inCurRaw;
                    var ll=i+1;
                    //console.log(str.indexOf(context.dialog.categorys[i].name)+"2222222222222222");

                    //var regDate =/[context.dialog.inRaw]/;
                    //if (regDate.test(context.dialog.category
                    // s[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                    if ((str.indexOf(context.dialog.categorys[i].name)>0)||str==ll) {
                        context.dialog.categorymenu.push(context.dialog.categorys[i]);
                    }
                }
                if (context.dialog.categorymenu.length !== 0) {
                    context.dialog.menuis = 1;
                }
                if(context.dialog.categorymenu[0].hotmenus==='true'){context.dialog.hot='인기';}
                else{context.dialog.hot='';}
                callback(task, context);
            }
        });
    }
};


bot.setTask("categorymenuisornot", categorymenuisornot);



var menuisornot= {
    action: function(task, context, callback)
    {

        context.dialog.menuis = 0;
        context.dialog.categorymenu=[];
        restaurantmenu.find({
            botId: context.bot.id,
            category: context.dialog.categorylength
        }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.menus = docs;
                var ll=0;
                for (i = 0; i < context.dialog.menus.length; i++) {
                    var str = context.dialog.inCurRaw;
                    ll=i+1;
                    if ((str.indexOf(context.dialog.menus[i].name)>0)|| str==ll) {
                        context.dialog.categorymenu.push(context.dialog.menus[i]);
                    }
                }
                if (context.dialog.categorymenu.length !== 0) {
                    context.dialog.menuis = 1;
                }
                if(context.dialog.categorymenu.hotmenus==='true'){context.dialog.hot='인기';}
                else{context.dialog.hot='';}
                callback(task, context);
            }
        });
    }
};


bot.setTask("menuisornot", menuisornot);

var action2 = {
    name:"action2",
    action: function(task, context, callback)
    {
        console.log('+++++++++++++++++');
        context.dialog.날짜입력최초 = true; callback(task, context);
    }
};
bot.setTask("action2", action2);

var action3 = {
    name:"action3",
    action: function(task, context, callback)
    {
        context.dialog.시간입력최초 = true; callback(task, context);
    }
};
bot.setTask("action3", action3);

var numOfPersonTypeCheck1 = {
    name: "numOfPersonTypeCheck1",
    action: function (task, context, callback) {
        context.dialog.numOfPersonis=undefined;
        var inRaw=context.dialog.inRaw;
        var inCurRaw=context.dialog.inCurRaw;
        console.log('++++++++++++++++++++++++++++++++');
        console.log(inRaw+'++++++++++1111111');
        console.log(inCurRaw+'++++++++++1111111');
        var x = /[ ]?명/g;

        //search(x);
        //var str='2017-12-15부터 5명 4555박5일 reserve';
        var count1 = inRaw.search(x);
        var count2;
        if(count1<0 && inCurRaw!==undefined){
            console.log("count1:"+count1+'++++++++++1111111');
            count1 = inCurRaw.search(x);
            if (count1 >= 0) {
                context.dialog.numOfPersonis=1;
                context.dialog.numOfPerson = '';
                //console.log(str.search(x));
                //console.log(str[count1]);

                for (i = 0; i < count1; i++) {
                    context.dialog.numOfPerson = context.dialog.numOfPerson + inCurRaw[i];

                }
                context.dialog.numOfPerson = Number(context.dialog.numOfPerson);
                console.log(context.dialog.numOfPersonis+'++++++++++2222222');
                callback(task, context);
            }
            else {
                context.dialog.numOfPersonis=0;
                console.log(context.dialog.numOfPersonis+'++++++++++333333');
                callback(task, context);
            }
        }
        else {
            console.log("count1:"+count1+'++++++++++222222');
           // console.log("count1:" + count1 + '++++++++++1111111');
            count2 = 0;
            if (count1 >= 0) {
                context.dialog.numOfPersonis = 1;
                context.dialog.numOfPerson = '';
                //console.log(str.search(x));
                //console.log(str[count1]);
                for (i = count1 - 1; i >= 0; i--) {
                    if (inRaw[i] === ' ') {
                        count2 = i;
                        break
                    }
                }
                var count3 = count2 + 1;
                for (i = count3; i < count1; i++) {
                    context.dialog.numOfPerson = context.dialog.numOfPerson + inRaw[i];
                }
                context.dialog.numOfPerson = Number(context.dialog.numOfPerson);
               // console.log(context.dialog.numOfPersonis + '++++++++++2222222');
                callback(task, context);
            }
            else {
                context.dialog.numOfPersonis = 0;
               // console.log(context.dialog.numOfPersonis + '++++++++++333333');
                callback(task, context);
            }
        }
    }
};
bot.setTask("numOfPersonTypeCheck1", numOfPersonTypeCheck1);

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




var action4 = {
    name:"action4",
    action: function(task, context, callback)
    {
        context.dialog.인원선택최초 = true; callback(task, context);
    }
};
bot.setTask("action4", action4);


var reserveNameTask = {
    name:"reserveNameTask",
    action: function (task, context, callback) {
        context.dialog.name = task.inRaw;
        callback(task, context);
    }
};
bot.setTask("reserveNameTask", reserveNameTask);

var smsAuth = {
    name:"smsAuth",
    preCallback: function(task, context, callback) {
    //     if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        context.user.mobile=undefined;
         callback(task, context);
     },

    action: messages.sendSMSAuth
};
bot.setTask("smsAuth", smsAuth);

var smsAuthValid = {
    name: "smsAuthValid",
    action: function (task, context, callback) {

        context.dialog.matched1=false;
        //console.log(context.dialog.smsAuth+'++++++++++++++++++++++++');
        if(context.dialog.inCurRaw==context.dialog.smsAuth) {context.dialog.matched1=true;context.user.mobile=context.dialog.mobile;}
        else{context.dialog.matched1=false;}

        callback(task, context);
    }
};

bot.setTask("smsAuthValid", smsAuthValid);


// var smsAuthinValid = {
//     name: "smsAuthinValid",
//     action: function (dialog, context, callback) {
//         context.dialog.matched1=false;
//         console.log(context.dialog.smsAuth);
//         if(dialog.inCurRaw.replace(/\s*/g, '')!=context.dialog.smsAuth)
//         {context.dialog.matched1=true;}
//         callback(task, context);
//     }
// };
// bot.setTask("smsAuthinValid", smsAuthinValid);


var smsAuthTask = {
    name: "smsAuthTask",
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

bot.setTask("smsAuthTask", smsAuthTask);

var reserveConfirm = {
    name: "reserveConfirm",
    action: function (task, context, callback) {
        context.dialog['dateStr'] = dateformat(context.dialog.date + 9 * 60 * 60, 'mm월dd일');

        callback(task, context);
    }
};

bot.setTask("reserveConfirm", reserveConfirm);

var reserveRequest = {
    name: "reserveRequest",
    action: function (task, context, callback) {

        var doc = {
            name: context.dialog.name,
            mobile: context.dialog.mobile || context.user.mobile,
            date: context.dialog.date,
            time: context.dialog.time,
            numOfPerson: context.dialog.numOfPerson,
            status: '예약요청중',
            botId: context.bot.id,
            userKey: context.user.userKey,
            dateStr:context.dialog.dateStr
        };

        var fields = context.bot.reserveFields || [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            doc[field.name] = context.dialog[field.name];
        }

        var TemplateReservation = mongoModule.getModel('restaurant-reservations');
        var templateReservation = new TemplateReservation(doc);

        templateReservation.save(function (err) {
           // console.log('++++++++++++++++++++++++123');
            if (!context.bot.testMode) {
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
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var shorturl;
                        try {
                            shorturl = JSON.parse(body).result.url;
                        } catch (e) {
                            console.log(e);
                        }
                        var message = '[플레이챗]' + '\n' +
                            context.dialog.name + '/' +
                            context.dialog.dateStr + '/';
                            //context.dialog.numOfPerson + '명\n';
                        if (context.dialog.time) {
                            messages += context.dialog.time + '/';
                        }

                        for (var i = 0; i < fields.length; i++) {
                            var field = fields[i];
                            if (field.name == 'numOfPerson') {
                                message += context.dialog[field.name] + '명/';
                            } else {
                                message += context.dialog[field.name] + '/';
                            }
                        }

                        message += '\n' + (context.dialog.mobile || context.user.mobile) + '\n' +
                            '예약접수(클릭) ' + shorturl;

                        request.post(
                            'https://bot.moneybrain.ai/api/messages/sms/send',
                            {
                                json: {
                                    callbackPhone: context.bot.phone,
                                    phone: context.bot.mobile.replace(/,/g, ''),
                                    message: message
                                }
                            },
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
};

bot.setTask("reserveRequest", reserveRequest);



var reserveCheck = {
    name: "reserveCheck",
    action: function (task, context, callback) {
       // console.log(context.botUser.isOwner+'++++++++++++++++++++++++');
       //context.botUser.isOwner=true;

            var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            TemplateReservation.find({
                botId: context.bot.id,
                status: '예약요청중'
            }).lean().exec(function(err, docs) {
               // console.log(JSON.stringify(docs)+'++++++++++++++++++++++++111');
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

            // var TemplateReservation = mongoModule.getModel('restaurant-reservations');
            // TemplateReservation.find({
            //     botId: context.bot.id,
            //     userKey: context.user.userKey,
            //     status: {$ne: '취소'},
            //     date: {$gte: new Date()}
            // }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
            //     if(docs && docs.length > 1) {
            //         for(var i in docs) {
            //             docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
            //         }
            //         context.dialog.reserves = docs;
            //         context.dialog.reserve = undefined;
            //     } else if(docs && docs.length > 0) {
            //         docs[0].dateStr = dateformat(docs[0].date + 9 * 60 * 60, 'mm월dd일');
            //         context.dialog.reserve = docs[0];
            //         context.dialog.reserves = undefined;
            //     } else {
            //         context.dialog.reserves = undefined;
            //         context.dialog.reserve = undefined;
            //     }
            //     callback(task, context);
            // })
    }
};

bot.setTask("reserveCheck", reserveCheck);



var action1 = {
    name: "action1",
    action: function(task, context, callback)
    {
        context.dialog.ordermenu=[];
        restaurantreservation.find({
            botId: context.bot.id,
            status: '예약요청중'
        }).lean().exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback(task, context);
            } else {
                //console.log(JSON.stringify(docs)+'**');
                context.dialog.ordermenus = docs;
                var ll=0;
                for (i = 0; i < context.dialog.ordermenus.length; i++) {
                    var str = context.dialog.inCurRaw;
                    ll=i+1;
                    if (str==ll) {
                        context.dialog.ordermenu.push(context.dialog.ordermenus[i]);
                    }
                    //console.log(JSON.stringify(context.dialog.ordermenu)+'**');
                }
                //var aa=context.dialog.ordermenu[0].date;
                //console.log(aa+'222222222222222');
                //context.dialog.time1=aa.getTime();
                task.result = {smartReply: ['예약확정', '예약취소']}; callback(task, context);

            }
        });
    }
};
bot.setTask("action1", action1);


var reserveOwnerConfirm = {
    name: "reserveOwnerConfirm",
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

bot.setTask("reserveOwnerConfirm", reserveOwnerConfirm);

var reserveOwnerCancel = {
    name: "reserveOwnerCancel",
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

bot.setTask("reserveOwnerCancel", reserveOwnerCancel);

var reserveCancel = {
    name: "reserveCancel",
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

bot.setTask("reserveCancel", reserveCancel);

var previewAction = {
    name: "previewAction",
    action: function (task, context, callback) {
        model = mongoModule.getModel('restaurant-previews');
        var inCurRaw=Number(context.dialog.inCurRaw)-1;
        context.dialog.categorys2=[];
        model.find({botId: context.bot.id}).lean().exec(function (err, docs) {
            context.dialog.categorys1=docs;
            //console.log(JSON.stringify(context.dialog.categoryss)+'====================');

            for(i=0;i<context.dialog.categorys1.length;i++){
                var ss=0;
                for(j=0;j< context.dialog.categorys2.length;j++)
                {
                   if(context.dialog.categorys2.length!==0) {
                       if(context.dialog.categorys1[i].category!== context.dialog.categorys2[j])
                       {ss++;}
                   }
                }

                if(ss==context.dialog.categorys2.length)
                {context.dialog.categorys2.push(context.dialog.categorys1[i].category);}
            }

            context.dialog.categorys2.reverse();
           // console.log(context.dialog.categorys2[0]+'+++++++++++++++++++++++++++++++');
           context.dialog.categoryselect=context.dialog.categorys2[inCurRaw];
            model.find({botId: context.bot.id,category:context.dialog.categoryselect}).lean().exec(function(err, docs) {
                context.dialog.categoryss=docs;
              //  console.log(docs+'====================');
                callback(task, context);
            });
        });
    }
};
bot.setTask("previewAction", previewAction);


function previewAction(task, context, callback) {
        var model, query, sort;
        if (context.dialog.categorys.length == 1) {
            context.dialog.category = context.dialog.categorys[0];
        }
        model = mongoModule.getModel('restaurant-previews');
        query = {
            botId: context.bot.id,
            category: context.dialog.category.name
        };
        sort = {'_id': +1};

        model.find(query).limit(type.MAX_LIST).sort(sort).lean().exec(function (err, docs) {
            task.doc = docs;
            context.dialog.menus = docs;
            var result = [];
            async.eachSeries(task.doc, function (doc, cb) {
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


var previewCategoryAction = {
    name: "previewCategoryAction",
    action: function (task, context, callback) {
        var model, query, sort;

        model = mongoModule.getModel('restaurant-previews');
        query = {botId: context.bot.id};
        sort = {'_id': +1};


        model.aggregate([
            {$match: query},
            {$sort: sort},
            {
                $group: {
                    _id: '$category',
                    category: {$first: '$category'}
                }
            }
        ], function (err, docs) {
            if (docs == undefined) {
                callback(task, context);
            } else {
                var categorys = [];
                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];

                    var category = doc.category;
                    if (!_.includes(categorys, category)) {
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
                    previewAction(task, context, function (task, context) {
                        callback(task, context);
                    });
                } else if (categorys.length > 1) {
                    task.doc = categorys;
                    context.dialog.categorys = categorys;
                    callback(task, context);
                } else {
                    callback(task, context);
                }
            }
        });
    }
};

bot.setTask("previewCategoryAction", previewCategoryAction);

var menuDetailTask = {
    name: "menuDetailTask",
    action: function(task, context, callback) {
        //console.log(context.dialog.menu.name+'=============');

        model = mongoModule.getModel('restaurant-previews');
        var inCurRaw=Number(context.dialog.inCurRaw)-1;
        context.dialog.categorysnames2=[];
        model.find({botId: context.bot.id,category:context.dialog.categoryselect}).lean().exec(function (err, docs) {
            context.dialog.categorysnames1=docs;

            //console.log(JSON.stringify(docs)+'==========6666==========');

            for(i=0;i<context.dialog.categorysnames1.length;i++){
                var ss=0;
                for(j=0;j< context.dialog.categorysnames2.length;j++)
                {
                    if(context.dialog.categorysnames2.length!==0) {
                        if(context.dialog.categorysnames1[i].name!== context.dialog.categorysnames2[j])
                        {ss++;}
                    }
                }

                if(ss==context.dialog.categorysnames2.length)
                {context.dialog.categorysnames2.push(context.dialog.categorysnames1[i].name);}
            }

            //context.dialog.categorysnames2.reverse();
            // console.log(context.dialog.categorysnames2+'+++++++++++++++++++++++++++++++');
            context.dialog.categorynameselect=context.dialog.categorysnames2[inCurRaw];
            model.find({botId: context.bot.id,name:context.dialog.categorynameselect}).lean().exec(function(err, docs) {
                context.dialog.categorynamess=docs;
               // console.log(context.dialog.categorynamess[0].name+'=========88888888===========');
                if(context.dialog.categorynamess[0].image) {
                    task.result = {
                        text:'['+context.dialog.categorynamess[0].name+']'+ '\n'+ context.dialog.categorynamess[0].description+'\n\n처음으로 가려면\n "시작"이라고 입력해주세요.',
                        image: {url: context.dialog.categorynamess[0].image},
                        buttons: [
                            {text: '자세히보기',
                                url: context.dialog.categorynamess[0].image.startsWith('http') ? context.dialog.categorynamess[0].image : config.host + context.dialog.categorynamess[0].image}
                        ]
                    };
                }
                //task.result = {items: context.dialog.menu};
                //console.log(context.dialog.menu.name+'=============');
                callback(task, context);
            });
        });
    }
};

bot.setTask("menuDetailTask", menuDetailTask);




var menuImageTask1 = {
    name: "menuImageTask1",
    action: function(task, context, callback) {
        console.log(context.dialog.menucategory[0].image+'======================');
        if(context.dialog.menucategory[0].image) {
            var img = context.dialog.menucategory[0].image.startsWith('http') ? context.dialog.menucategory[0].imagee : config.host + context.dialog.menucategory[0].image;
            task.result = {
                image: {url: context.dialog.menucategory[0].image},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

bot.setTask("menuImageTask1", menuImageTask1);

var menuImageTask2 = {
    name: "menuImageTask2",
    action: function(task, context, callback) {
        console.log(context.dialog.menumatch[0].image+'======================');
        if(context.dialog.menumatch[0].image) {
            var img = context.dialog.menumatch[0].image.startsWith('http') ? context.dialog.menumatch[0].imagee : config.host + context.dialog.menumatch[0].image;
            task.result = {
                image: {url: context.dialog.menumatch[0].image},
                buttons: [
                    {text: '자세히보기', url: img}
                ]
            };
        }
        callback(task, context);
    }
};

bot.setTask("menuImageTask2", menuImageTask2);


var menuImageTask = {
    name: "menuImageTask",
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

bot.setTask("menuImageTask", menuImageTask);

var eventAction = {
    name: "eventAction",
    action: function (task, context, callback) {
        console.log(context.dialog.eventlistType.name+'+++++++++++++++++++++++++++');
        context.dialog.events=context.dialog.eventlistType;
        context.dialog.eventss=context.dialog.events;
        task.result = {
            text:'['+context.dialog.eventss.name+']'+'\n'+context.dialog.eventss.description+'\n'+'처음으로 가려면 "시작"이라고 입력해주세요.',
            image: {url: context.dialog.eventss.image},
            buttons: [
                {text: '자세히보기',
                    url: context.dialog.eventss.image.startsWith('http') ? context.dialog.eventss.image : config.host + context.dialog.eventss.image}
            ]
        };
        callback(task, context);
    }
};

bot.setTask("eventAction", eventAction);


// var  isDateIn= {
//     name:'date',
//     typeCheck: function (text, type, task, context, callback) {
//         var matched=false;
//         // 判断年、月、日的取值范围是否正确
//         // 先判断格式上是否正确
//         var regDate =/(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
//         if (!regDate.test(text))
//         {
//             matched=false;
//             callback(text, task, matched);
//
//         }
//         else{
//             // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
//             var arr = regDate.exec(text);
//                 var ss =false;
//                 ss = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
//                 if(ss)
//                 {
//                     matched=true;callback(text, task, matched);
//                 }
//                 else{matched=false;callback(text, task, matched);}
//             }
//     }
// };
//
// bot.setType('isDateIn', isDateIn);

function IsMonthAndDateCorrect(nYear, nMonth, nDay)
{
    // 月份是否在1-12的范围内，注意如果该字符串不是C#语言的，而是JavaScript的，月份范围为0-11
    if (nMonth > 12 || nMonth <= 0)
        return false;

    // 日是否在1-31的范围内，不是则取值不正确
    if (nDay > 31 || nMonth <= 0)
        return false;

    // 根据月份判断每月最多日数
    var bTrue = false;
    switch(nMonth)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            bTrue = true;               // 大月，由于已判断过nDay的范围在1-31内，因此直接返回true
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            bTrue = (nDay <= 30);    // 小月，如果小于等于30日返回true
            break;
    }

    if (!bTrue)

        return true;

    // 2月的情况
    // 如果小于等于28天一定正确
    if (nDay <= 28)
        return true;
    // 闰年小于等于29天正确
    if (IsLeapYear(nYear))
        return (nDay <= 29);
    // 不是闰年，又不小于等于28，返回false
    return false;
}

// 是否为闰年，规则：四年一闰，百年不闰，四百年再闰
function IsLeapYear(nYear)
{
    // 如果不是4的倍数，一定不是闰年
    if (nYear % 4 != 0)
        return false;
    // 是4的倍数，但不是100的倍数，一定是闰年
    if (nYear % 100 != 0)
        return true;

    // 是4和100的倍数，如果又是400的倍数才是闰年
    return (nYear % 400 == 0);
}



