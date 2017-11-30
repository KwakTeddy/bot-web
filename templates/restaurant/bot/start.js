var path = require('path');
var bot = require(path.resolve('engine/bot')).getBot('restaurants');

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
var restaurantmenu= mongo.getModel('templaterestaurantmenus');

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

exports.startTask = startTask;

var reserveCheck = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            var TemplateReservation = mongoModule.getModel('TemplateReservation');
            TemplateReservation.find({
                upTemplateId: context.bot.templateDataId,
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
            var TemplateReservation = mongoModule.getModel('TemplateReservation');
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
                callback(task, context);
            })
        }
    }
};

// bot.setTask('reserveCheck', reserveCheck);
exports.reserverCheck = reserveCheck;


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

    model = mongoose.model('TemplateMenu');
    query = {upTemplateId: context.bot.templateDataId,
             hotmenus:"여"};
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
                menuAction1(task,context, function(task,context) {
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
exports.menuCategoryAction = menuCategoryAction;

function menuAction(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }
    model = mongoose.model('TemplateMenu');
    query = {upTemplateId: context.bot.templateDataId,
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

function menuAction1(task, context, callback) {
    var model, query, sort;
    if (context.dialog.categorys.length == 1) {
        context.dialog.category = context.dialog.categorys[0];
    }
    model = mongoose.model('TemplateMenu');
    query = {upTemplateId: context.bot.templateDataId,
        category: context.dialog.category.name,
        hotmenus:"여"};
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

exports.menuAction1 = menuAction1;

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
        if(context.bot.restaurantparks[0]===undefined){context.dialog.parkno=undefined;callback(task,context);}
        else if(context.bot.restaurantparks[0].parkornot==="부"){context.dialog.parkno=1; callback(task,context);}
        else {context.dialog.parkno=0;
            context.dialog.parkaddress=context.bot.restaurantparks[0].parkaddress;
            context.dialog.parkdetails=context.bot.restaurantparks[0].parkdetails;
            context.dialog.parksize=context.bot.restaurantparks[0].parksize;
            context.dialog.parkname=context.bot.restaurantparks[0].parkname;
            context.dialog.parkornot=context.bot.restaurantparks[0].parkornot;

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

        if(context.bot.restaurantmenus[0]===undefined){context.dialog.restaurantno=undefined;callback(task,context);}
        else {

            restaurantmenu.find({upTemplateId: context.bot.templateDataId,hotmenus:"여"}).lean().exec(function (err, docs) {
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
                    }
                    else{context.dialog.menuprice = 0;}
                        callback(task, context);
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
        if(context.bot.restaurantmenus[0]===undefined){context.dialog.menuis=0;callback(task,context);}
        else {
            context.dialog.menuis=0;
            restaurantmenu.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
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
