var path = require('path');
var bot = require(path.resolve('config/lib/bot')).getBot('delivery2');

var messages = require(path.resolve('modules/messages/server/controllers/messages.server.controller'));
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('modules/bot/action/common/mongo'));
var request = require('request');
var ObjectId = mongoose.Types.ObjectId;

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);





var mdmenu = [
    {
        name:"치킨",
        subMenu: [
            {
                name: "후라이드 치킨",
                subMenu: [
                    {
                        name: "후라이드 치킨 L",
                        price: 16000
                    },
                    {
                        name: "후라이드 치킨 M",
                        price: 14000
                    }
                ]
            },
            {
                name: "양념 치킨",
                subMenu: [
                    {
                        name: "양념 치킨 L",
                        price: 17000
                    },
                    {
                        name: "양념 치킨 M",
                        price: 15000
                    }
                ]
            },
            {
                name: "파닭",
                subMenu: [
                    {
                        name: "순살 파닭",
                        subMenu: [
                            {
                                name: "순살 파닭 L",
                                price: 17000
                            },
                            {
                                name: "순살 파닭 M",
                                price: 15000
                            }
                        ]
                    },
                    {
                        name: "뼈 있는 파닭",
                        subMenu: [
                            {
                                name: "뼈 있는 파닭 L",
                                price: 17000
                            },
                            {
                                name: "뼈 있는 파닭 M",
                                price: 15000
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name:"사이드",
        subMenu: [
            {
                name: '콜라',
                price: 1000
            },
            {
                name: '피클',
                price: 1000
            }
        ]
    }
];




var startTask = {
    action: function (task,context,callback) {
        context.user.cart = [];

        var restaurant = mongoModule.getModel('restaurantcontent');
        restaurant.find({_id:ObjectId("59dcd621874f5bbde7a10679")}).lean().exec(function(err, docs) {
            context.bot.restaurant = docs[0];
            callback(task,context);
        })
    }
};

bot.setTask('startTask', startTask);







var getCategory = {
    action: function (task,context,callback) {
        context.dialog.category = context.bot.restaurant.menu;
        callback(task,context);
    }
};

bot.setTask('getCategory', getCategory);




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
      if (matchFun(text, array[i].name)) {
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
    context.dialog.menu = {};
    context.dialog.menu.subMenu = filter(context.dialog.inRaw, mdmenu);
    if(context.dialog.menu.subMenu.length==1) context.dialog.currentItem = context.dialog.menu.subMenu[0];
    // context.dialog.menuList = filter(context.dialog.inRaw, mdmenu);

    callback(task,context);
	}
};

bot.setTask('makeOrderList', makeOrderList);

var orderble = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        if (filter(text, mdmenu).length) matched =  true;

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
        console.log('ddd');
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
        context.dialog.request = context.dialog.inCurRaw;
        callback(task,context);
    }
};

bot.setTask('saveRequest', saveRequest);

var sendMessage = {
    action: function (task,context,callback) {

        var message = '[주문내용]\n';

        for(i=0; i<context.user.cart.length; i++){
            message += context.user.cart[i].name + ', ' + context.user.cart[i].price + '\n';
        }


        message += '\n주소: ' + context.user.address.지번본번 + '\n';
        message += '번호: ' + context.user.mobile + '\n';
        message += '결제방법: ' + context.dialog.pay + '\n';
        message += '요청사항: ' + context.dialog.request + '\n';

        var mess = [];
        mess[0] = message;

        if (message.length > 60) {
            mess[0] = message.slice(0,60);
            mess[1] = message.slice(60,120);
        }
        sendSMS("01092597716", mess[0]);
        setTimeout(function() {sendSMS("01092597716", mess[1])}, 2000);


        var orderListSchema = mongoose.Schema({
            user: String,
            created: {
                type: Date,
                default: Date.now
            },
            mobile: String,
            address: mongoose.Schema.Types.Mixed,
            order: [],
            pay:String,
            request:String
        });

        var OrderList = undefined;
        if(!mongoose.models['orderList'])
        {
            console.log('created schema');
            OrderList = mongoose.model('orderList', orderListSchema);
        }
        else
        {
            console.log('read schema');
            OrderList = mongoose.model('orderList');
        }

        var orderList = new OrderList({
            user: context.user.userKey,
            mobile: context.user.mobile,
            address: context.user.address,
            order: context.user.cart,
            pay: context.user.pay,
            request: context.user.request
        });

        console.log('orderList: ' + JSON.stringify(orderList));

        orderList.save(function(err){
            if(err)
            {
                console.log('error: ' + JSON.stringify(err));
            }
            callback(task,context);
        });
    }
};

bot.setTask('sendMessage', sendMessage);


var reserveRequest = {action: 'reserveRequest'};
bot.setTask('reserveRequest', reserveRequest);

















// -------------------- Functions --------------------------

function matchFun(key, word) {
    if (word.search(key) >=0 ) return true;
    else return false;
}


function filter(key, list) {
    var result = [];
    for(var i=0; i<list.length; i++){
        if(list[i].subMenu) result = result.concat(filter(key,list[i].subMenu));
        else {
            if(matchFun(key, list[i].name)) {
                result.push(list[i]);
            }
        }
    }
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
    context.dialog.ordering = true;
    context.dialog.deliveryTime = true;
    context.dialog.deliveryDistance = true;
    var totalPrice = getTotalPrice(context.user.cart);
    // for(var i=0; i<context.user.cart.length; i++){
    //   totalPrice += context.user.cart[i].price;
    // }
    // context.dialog.priceCond = (totalPrice > context.dialog.minimumPrice);
    context.dialog.priceCond = true;

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
                console.log(response);
                console.log(body);
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
    var orderList = mongoModule.getModel('orderList');
    orderList.find({user:context.user.userKey}).sort({created:-1}).limit(1).lean().exec(function(err, docs){
        context.dialog.orderHistory = docs[0];
        var created = context.dialog.orderHistory.created;
        context.dialog.orderHistory.time = datePreProc(created);
        created.setMinutes(created.getMinutes() + 30);
        context.dialog.expectedTime = datePreProc(created);
        context.dialog.totalPrice = getTotalPrice(context.dialog.orderHistory.order);

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
    return price;
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
