var path = require('path');
var bot = require(require('path').resolve("engine/bot")).getTemplateBot('delivery');


var config = require(path.resolve('./config/config'));
var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var request = require('request');
var ObjectId = mongoose.Types.ObjectId;

var defaultTask2 = {
    name: 'defaultTask2',
    action: function(task, context, callback) {
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + context.bot.address);
        // console.log(context.dialog.address);
        // console.log(context.user.address);
        // console.log(context.bot.address);
        callback(task, context);
    }
};
bot.setTask("defaultTask2", defaultTask2);



var startTask = {
    action: function (task,context,callback) {
        // console.log("@@@@@@@@@@@@@@@@@@"+JSON.stringify(context.bot.templateDataIdId));

        context.user.cart = [];
        if(context.bot.authKey != undefined && context.botUser.options && context.bot.authKey == context.botUser.options.authKey) {
            context.botUser.isOwner = true;
        }
        // context.botUser.isOwner = true;
        //  context.botUser.isOwner = false;

        context.dialog.notOpen = "";

        if(context.botUser.isOwner) {
            reserveCheck.action(task, context, function(_task, context) {

                callback(task, context);
            })
        } else {
            callback(task, context);
        }

        // var restaurant = mongoModule.getModel('templatedeliverycontent');
        // restaurant.find({_id:ObjectId("59dcd621874f5bbde7a10679")}).lean().exec(function(err, docs) {
        //     context.bot = docs[0];
        //     if(!isOpen(context.bot.openTime)) context.dialog.notOpen = "\n(**현재는 영업시간이 아닙니다**)\n"; else context.dialog.notOpen = "";
        //
        //     if(context.botUser.isOwner) {
        //         reserveCheck.action(task, context, function(_task, context) {
        //             callback(task, context);
        //         })
        //     } else {
        //         callback(task, context);
        //     }
        // })
    }
};

bot.setTask('startTask', startTask);

var reserveCheck = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            var TemplateReservation = mongoModule.getModel('delivery-orders');
            TemplateReservation.find({
                botId: context.bot.id,
                status: '승인대기중'
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 0) {
                    // for(var i in docs) {
                    //     docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    // }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                callback(task, context);
            });
        }
    }
};







var getCategory = {
    action: function (task,context,callback) {
        // context.dialog.category = context.bot.menus;
        context.dialog.category = menuPreproc(context.bot.menus);
        callback(task,context);
    }
};

bot.setTask('getCategory', getCategory);

function menuPreproc(menu) {
    var category = [];
    for(var i=0; i<menu.length; i++) {
        var item = menu[i];
        var added = false;
        for(var j=0; j<category.length; j++) {
            if (item.category1 == category[j].name) {
                for (var k=0; k<category[j].subMenu.length; k++) {
                    //console.log(item.category2 + "//" + category[j].subMenu[k].name + k);
                    if (item.category2 == category[j].subMenu[k].name) {
                        category[j].subMenu[k].subMenu.push({name:item.name, price:item.price});
                        added = true;
                        break;
                    }
                }
                if(!added){
                    category[j].subMenu.push({name:item.category2, subMenu:[{name:item.name, price:item.price}]});
                    added=true;
                }
                break;
            }
        }
        if (!added) category.push({name:item.category1, subMenu:[{name:item.category2, subMenu:[{name:item.name, price:item.price}]}]});
    }
    return category;
}




var menuElement = {
    typeCheck: 'listTypeCheck',
    listName: 'menuList'
};

bot.setType('menuElement', menuElement);

var menuListUpdate = {
    action: function (task,context,callback) {
        context.dialog.menu = context.dialog.menuElement;
        if(!context.dialog.menu.subMenu) context.dialog.currentItem = context.dialog.menuElement;
        callback(task,context);
    }
};

bot.setTask('menuListUpdate', menuListUpdate);


var category = {
    typeCheck: 'listTypeCheck',
    listName: 'category'
};

bot.setType('category', category);

var categoryToMenu = {
    action: function (task,context,callback) {
        context.dialog.menu = context.dialog.category;
        //context.dialog.menuName = context.dialog
        callback(task,context);
    }
};

bot.setTask('categoryToMenu', categoryToMenu);

var makeSubMenuList = {
    action: function (task,context,callback) {
        context.dialog.menuList = context.dialog.menu.subMenu;
        callback(task,context);
    }
};

bot.setTask('makeSubMenuList', makeSubMenuList);


var menuElementText = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        var array = context.dialog.menuList;
        for(i=0; i<array.length; i++){
            if (matchFun(context.dialog.inCurRaw, array[i].name)) {
                matched = true;
                task.menuElement = array[i];
            };
        };
        callback(text, task, matched);
    }
};

bot.setType('menuElementText', menuElementText);





var makeOrderList = {
    action: function (task,context,callback) {
        context.dialog.keyword = context.dialog.inRaw;
        // if(context.dialog.inRaw == 1) context.dialog.keyword = context.dialog.inCurRaw;
        context.dialog.keyword = (context.dialog.inCurRaw || context.dialog.inRaw);
        context.dialog.menu = {};
        context.dialog.menu.subMenu = filter(context.dialog.keyword, context.bot.menus);
        if(context.dialog.menu.subMenu.length==1) context.dialog.currentItem = context.dialog.menu.subMenu[0];
        // context.dialog.menuList = filter(context.dialog.inRaw, mdmenu);

        callback(task,context);
    }
};

bot.setTask('makeOrderList', makeOrderList);

var orderble = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // console.log(text);
        // console.log(context.dialog);
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        var keyword = (context.dialog.inCurRaw || context.dialog.inRaw);
        if(keyword.match(/^\d$/)) callback(text, task, false);
        if (filter(keyword, context.bot.menus).length){
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@filter true!!!");
            matched =  true;
        }

        callback(text, task, matched);
    }
};

bot.setType('orderble', orderble);

var addCart = {
    action: function (task,context,callback) {
        // if(!context.dialog.modifying) context.user.cart = pushCart(context.dialog.currentItem, context.user.cart);
        // context.dialog.modifying = false;
        if(context.dialog.currentItem) context.user.cart = pushCart(context.dialog.currentItem, context.user.cart);
        delete context.dialog.currentItem;
        callback(task,context);
    }
};

bot.setTask('addCart', addCart);


var sendSMSAuth = {
    preCallback: function(task, context, callback) {
        if (task.mobile == undefined) task.mobile = context.dialog['mobile'];
        //console.log('ddd');
        callback(task, context);
    },
    action: messages.sendSMSAuth
};

bot.setTask('sendSMSAuth', sendSMSAuth);

var savePay = {
    action: function (task,context,callback) {
        var input = context.dialog.inCurRaw
        if (input == 1 || input.search('카드') != -1) context.dialog.pay = '카드';
        if (input == 2 || input.search('현금') != -1) context.dialog.pay = '현금';
        callback(task,context);
    }
};

bot.setTask('savePay', savePay);

var saveRequest = {
    action: function (task,context,callback) {
        context.dialog.discription = context.dialog.inCurRaw;
        callback(task,context);
    }
};

bot.setTask('saveRequest', saveRequest);


var reserveRequest = {
    name: 'reserveRequest',
    action: reserveRequest
};
bot.setTask("reserveRequest", reserveRequest);

var recentCart = {
    action: function (task,context,callback) {

        var orderList = mongoModule.getModel('delivery-orders');
        orderList.find({user:context.user.userKey}).sort({created:-1}).limit(1).lean().exec(function(err, docs){
            if(docs.length != 0){
                var orderHis = docs[0]
                context.dialog.orderHistory = true;
                context.dialog.cart = orderHis.order;
                context.dialog.totalPrice = getTotalPrice(orderHis.order);
                context.dialog.pay = orderHis.pay;
                context.dialog.discription = orderHis.discr || '없음';
                context.user.discription = orderHis.discr || '없음';
                context.bot.discription = orderHis.discr || '없음';
                // context.dialog.discription = '없음';

                // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                // console.log(orderHis.discr);
                // console.log(context.dialog.discr);
                callback(task,context);


                // context.dialog.orderHistory = docs[0];
                // var created = context.dialog.orderHistory.created;
                // context.dialog.orderHistory.time = datePreProc(created);
                // created.setMinutes(created.getMinutes() + 30);
                // context.dialog.expectedTime = datePreProc(created);
                // context.dialog.totalPrice = getTotalPrice(context.dialog.orderHistory.order);
            }

        });
    }
};
bot.setTask("recentCart", recentCart);















// -------------------- Functions --------------------------

function reserveRequest(task, context, callback) {

    var doc = {
        // mobile: context.dialog.mobile || context.user.mobile,
        // time: context.dialog.time,
        status: '승인대기중',
        botId: context.bot.id,
        // userKey: context.user.userKey


        user: context.user.userKey,
        mobile: context.user.mobile,
        address: context.user.address.지번주소,
        order: context.user.cart,
        pay: context.dialog.pay,
        discr: context.dialog.discription,
        created: new Date()
    };
    // console.log("####################################" + JSON.stringify(doc));


    var TemplateReservation = mongoModule.getModel('delivery-orders');
    var templateReservation = new TemplateReservation(doc);

    templateReservation.save(function(err) {
        if(!context.bot.testMode) {
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);

            // var url = config.host + '/mobile#/chat/' + context.bot.id + '?authKey=' + randomNum;
            // var url = (config.host || "https://remaster.moneybrain.ai") + '/playchat/templates/contents/order';
            var url = ("https://remaster.moneybrain.ai") + '/playchat/templates/contents/order';
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
                    var message = '배달주문';


                    message += '번호: ' + (context.dialog.mobile || context.user.mobile) + '\n' +
                        '예약접수(클릭) ' + shorturl;

                    request.post(
                        'https://bot.moneybrain.ai/api/messages/sms/send',
                        // {json: {callbackPhone: context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
                        {json: {callbackPhone: "02-858-5683", phone: context.bot.mobile.replace(/,/g, ''), message: message}},
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



function checkInDistance(str, task, context, callback) {
    var address = {address: str};
    var lat, lng, lat2, lng2;
    request({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyDFfCi-x6iMRxdN_V7U2pSCQFzGseNzSBM',
            method: 'GET',
            qs: address
        }, function(error, response, body) {
            //console.log(response);
            // console.log(JSON.parse(body));
            var location = JSON.parse(body).results[0].geometry.location;
            lat = location.lat;
            lng = location.lng;
            // console.log(lat);
            [lat2, lng2] = context.bot.geocode;
            context.dialog.deliveryDistance = (getDistanceFromGeocode(lat,lng,lat2,lng2)<context.bot.deliveryDistance);
            callback(task, context);
        }
    );
}

function getDistanceFromGeocode(lat1,lng1,lat2,lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function isOpen(opentime) {
    var now = new Date();
    // var nowTime = parseInt(""+now.getHours()+now.getMinutes());
    var nowTime = now.getHours()*100+now.getMinutes();
    // console.log(nowTime);
    var time = opentime[now.getDay()-1].time;
    var open = parseInt(time.substring(0,2) + time.substring(3,5));
    var close = parseInt(time.substring(6,8) + time.substring(9,11));
    // console.log(open, close);
    return (open < nowTime && nowTime < close);
};

function transSynonim(word) {
    var synonims = [
        {
            name: "라지",
            list: ["l", "large", "대"]
        },
        {
            name: "미디움",
            list: ["m", "medium", "중"]
        },
        {
            name: "후라이드",
            list: ["프라이드"]
        }
    ];

    for(var i=0; i<synonims.length; i++){
        for(var j=0; j<synonims[i].list.length; j++){
            word = word.toLowerCase().replace(synonims[i].list[j], synonims[i].name);
        }
    };
    return word;

}

function matchFun(key, word) {
    var keys = key.split(' ');
    word = transSynonim(word.replace( /(\s*)/g, ""));
    key = transSynonim(key.replace( /(\s*)/g, ""));
    for(var i=0; i<keys.length; i++) {
        console.log(keys[i] + "//" + word);
        console.log(word.search(keys[i]));
        if (word.search(keys[i]) >= 0 && keys[i].length >1) return true;
        // if (word.search(keys[i]) >= 0) return true;
    }

    return false;
}


function filter(key, list) {
    var result = [];
    for(var i=0; i<list.length; i++){
        if(list[i].subMenu) result = result.concat(filter(key,list[i].subMenu));
        else {
            if(matchFun(key, list[i].name)) {
                console.log("matched!!!");
                result.push(list[i]);
            }
        }
    }
    console.log(result);
    return result;
}

function pushCart(item, cart) {

    for(var i=0; i<cart.length; i++){
        if(item.name == cart[i].name){
            cart[i].quant++;
            console.log(cart[i].price);
            console.log('item' + item.price);
            cart[i].price = cart[i].price + item.price;
            console.log(cart[i].price);
            return cart;
        }
    }
    var itemCopy = JSON.parse(JSON.stringify(item));
    itemCopy.quant = 1;
    cart.push(itemCopy);
    return cart;
}


var saveMobile = {
    action: function (task,context,callback) {
        context.user.mobile = context.dialog.mobile;
        callback(task,context);
    }
};

bot.setTask('saveMobile', saveMobile);

var checkCondition = {
    action: function (task,context,callback) {
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        context.dialog.ordering = true;
        // context.dialog.deliveryTime = isOpen(context.bot.openTime);
        context.dialog.deliveryTime = true;
        context.dialog.deliveryDistance = true;
        var totalPrice = parseInt(getTotalPrice(context.user.cart));
        // console.log("##########################" + totalPrice);
        context.dialog.priceCond = (totalPrice >= context.bot.minPrice);
        //context.dialog.priceCond = true;
        context.dialog.totalPrice = totalPrice;
        // callback(task,context);

        // if(context.user.address) checkInDistance(context.user.address.지번주소, task, context, callback);
        // else callback(task,context);
        callback(task,context);
    }
};

bot.setTask('checkCondition', checkCondition);


function sendSMS(phone, message) {
    request.post(
        'https://bot.moneybrain.ai/api/messages/sms/send',
        // 'http://dev.moneybrain.ai:8443/api/messages/sms/send',
        {json: {callbackPhone: "15777314", phone: phone, message: message}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(response);
                // console.log(body);
            } else {
                // task._result = 'FAIL';
                // task._resultMessage = 'HTTP ERROR';
                console.log(error);
            }
        }
    );
}


var getOrderHistory = {
    action: function (task,context,callback) {
        var orderList = mongoModule.getModel('delivery-orders');
        orderList.find({user:context.user.userKey}).sort({created:-1}).limit(1).lean().exec(function(err, docs){
            if(docs.length != 0){
                context.dialog.orderHistory = docs[0];
                var created = context.dialog.orderHistory.created;
                context.dialog.orderHistory.time = datePreProc(created);
                created.setMinutes(created.getMinutes() + 30);
                context.dialog.expectedTime = datePreProc(created);
                context.dialog.totalPrice = getTotalPrice(context.dialog.orderHistory.order);
            }

            callback(task,context);
        });
    }
};

bot.setTask('getOrderHistory', getOrderHistory);


function datePreProc(created) {
    return {
        month: created.getMonth()+1,
        date: created.getDate(),
        hour: created.getHours(),
        minute: created.getMinutes()
    };
}

function getTotalPrice(cart) {
    var price = 0;
    for(var i=0; i<cart.length; i++){
        price += cart[i].price;
    }
    return parseInt(price);
}


var cartItem = {
    typeCheck: 'listTypeCheck',
    listName: 'cart'
};

bot.setType('cartItem', cartItem);

var makeCartList = {
    action: function (task,context,callback) {
        context.dialog.cart = context.user.cart;
        callback(task,context);
    }
};

bot.setTask('makeCartList', makeCartList);

var changeQuantity = {
    action: function (task,context,callback) {
        context.dialog.cartItem.price /= context.dialog.cartItem.quant;
        context.dialog.cartItem.quant = parseInt(context.dialog.inCurRaw);
        context.dialog.cartItem.price *= parseInt(context.dialog.inCurRaw);
        context.dialog.modifying = true;
        callback(task,context);
    }
};

bot.setTask('changeQuantity', changeQuantity);

var deleteCartItem = {
    action: function (task,context,callback) {
        for(var i=0; i<context.user.cart.length; i++) {
            if(context.user.cart[i].name == context.dialog.cartItem.name) context.user.cart.splice(i,1);
        };
        context.dialog.modifying = true;
        callback(task,context);
    }
};

bot.setTask('deleteCartItem', deleteCartItem);


var makeOpenTime = {
    action: function (task,context,callback) {
        context.dialog.weekday = true;
        for(var i=0; i<5; i++){
            if(context.bot.openTime[0].time != context.bot.openTime[i].time) {
                context.dialog.weekday = false;
                break;
            }
        }
        callback(task,context);
    }
};

bot.setTask('makeOpenTime', makeOpenTime);


var makeReserve = {
    action: function (task,context,callback) {
        //task.result = {smartReply: ['예약확정', '예약취소']};
        task.buttons = [{text:'주문승인'}, {text:'주문취소'}];
        task.buttons = [{text:'주문승인'}, {text:'주문취소'}];
        context.dialog.reserveTime= datePreProc(context.dialog.reserve.created);


        callback(task,context);
    }
};

bot.setTask('makeReserve', makeReserve);

var makeReserve2 = {
    action: function (task,context,callback) {
        //task.result = {smartReply: ['예약확정', '예약취소']};
        task.buttons = [{text:'처음'}, {text:'이전'}];
        context.dialog.reserveTime= datePreProc(context.dialog.reserve.created);


        callback(task,context);
    }
};

bot.setTask('makeReserve2', makeReserve2);


var reserveOwnerConfirm = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('delivery-orders');
            TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '확정'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n';
                    var cart = context.dialog.reserve.order;
                    for(var i=0; i<cart.length; i++){
                        message += cart[i].name +', ' + cart[i].quant + ', ' + cart[i].price + '\n';
                    }

                    message += '\n주문접수완료\n'+
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

bot.setTask('reserveOwnerConfirm', reserveOwnerConfirm);


var reserveOwnerCancel = {
    action: function (task, context, callback) {
        if(context.dialog.reserve) {
            var TemplateReservation = mongoModule.getModel('delivery-orders');
            TemplateReservation.update({_id: context.dialog.reserve._id}, {$set: {status: '업주취소'}}, function (err) {

                if(!context.bot.testMode) {
                    var message = '[' + context.bot.name + ']' + '\n';

                    message += '\n배달취소: '+
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

bot.setTask('reserveOwnerCancel', reserveOwnerCancel);


var orderCancel = {
    action: function (task, context, callback) {

        var TemplateReservation = mongoModule.getModel('delivery-orders');
        TemplateReservation.update({_id: context.dialog.orderHistory._id}, {$set: {status: '주문자취소'}}, function (err) {

            if(!context.bot.testMode) {
                // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                var message = '[' + context.bot.name + ']' + '\n';

                message += '배달요청이 취소되었습니다.';

                request.post(
                    'https://bot.moneybrain.ai/api/messages/sms/send',
                    {json: {callbackPhone: '02-858-5683' || context.bot.phone, phone: context.bot.mobile.replace(/,/g, ''), message: message}},
                    function (error, response, body) {
                        console.log(error);
                        callback(task, context);

                    }
                );
            } else {
                callback(task, context);
            }
        });


    }
};

bot.setTask('orderCancel', orderCancel);



var pastHistory = {
    action: function (task, context, callback) {

        if(context.botUser.isOwner) {
            var TemplateReservation = mongoModule.getModel('delivery-orders');
            TemplateReservation.find({
                botId: context.bot.id,
                status: {$not:/승인대기중/}
            }).lean().sort({date: -1, time: -1}).exec(function(err, docs) {
                if(docs && docs.length > 0) {
                    // for(var i in docs) {
                    //     docs[i].dateStr = dateformat(docs[i].date + 9 * 60 * 60, 'mm월dd일');
                    // }
                    context.dialog.reserves = docs;
                    context.dialog.reserve = undefined;
                } else {
                    context.dialog.reserves = undefined;
                    context.dialog.reserve = undefined;
                }
                callback(task, context);
            });
        }
    }
}

bot.setTask('pastHistory', pastHistory);

var getLocation = {
    action: function (task,context,callback) {
        context.dialog.location = context.bot.address;
        callback(task,context);
    }
};

bot.setTask('getLocation', getLocation);

