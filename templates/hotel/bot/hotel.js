var path = require('path');
var bot = require(path.resolve('engine/bot')).getTemplateBot('hotel');

var messages = require(path.resolve('engine/messages/server/controllers/messages.server.controller'));
var logger = require(path.resolve('./config/lib/logger'));
var mongo = require(path.resolve('./engine/bot/action/common/mongo'));
var async = require('async');
var mongoose = require('mongoose');
var mongoModule = require(path.resolve('engine/bot/action/common/mongo'));
var categoryrooms = mongo.getModel('hotel-rooms');
var categoryrestaurants = mongo.getModel('hotel-restaurants');
var categoryfacilities = mongo.getModel('hotel-facilities');
var categoryevents = mongo.getModel('hotel-events');
var order = mongo.getModel('hotelorders');
var config = require(path.resolve('./config/config'));
var utils = require(path.resolve('engine/bot/action/common/utils'));
var typelib = require(path.resolve('engine/bot/action/common/type'));
var globals = require(path.resolve('engine/bot/engine/common/globals'));
var _ = require('lodash');

const IN_TAG_START = '{';
const IN_TAG_END = '}';

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);

var mapButton = {
    action: function (task,context,callback) {
        task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.bot.address}];
        callback(task,context);
    }
};

bot.setTask('mapButton', mapButton);


var mynamesave = {
    name: 'mynamesave',
    action: function(task, context, callback){
        context.dialog.myname = context.dialog.inCurRaw;
         context.user.myname=context.dialog.myname;
        callback(task, context);
    }
};
bot.setTask("mynamesave", mynamesave);

var mynamesave1 = {
    name: 'mynamesave1',
    action: function(task, context, callback){
        context.dialog.myname = context.dialog.inCurRaw;
        context.user.myname=context.dialog.myname;
        context.dialog.oneallprice=context.dialog.days*context.dialog.roomlistType.room_price;

        var s1  =  context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday;
        var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;
        context.dialog.days=DateDiff(s1,s2);
        context.dialog.dayss=context.dialog.days+1;
      
    var mydate=new Date();
    mydate.setHours(mydate.getHours()+9);
    context.dialog.myall=mydate;
    var ss=mydate;
    context.dialog.todayday=ss.getDate();
    context.dialog.todaymonth=Number(ss.getMonth())+1;
    context.dialog.todayyear=ss.getFullYear();
    context.dialog.todaytime=ss.getHours()+":"+ss.getMinutes()+":"+ss.getSeconds();
    context.dialog.todaydate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+context.dialog.todayday+" "+context.dialog.todaytime;
    var tomorrowday = Number(context.dialog.todayday)+1;
    context.dialog.tomorrowdate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+tomorrowday+" "+context.dialog.todaytime;

        var neworder={
            order_user: context.dialog.myname,
            order_phone:context.user.mobile,
            order_price:context.dialog.oneallprice,
            order_date: context.dialog.todaydate,
            order_paydate: context.dialog.tomorrowdate,
            order_daynumbers:context.dialog.days,
            order_oneprice:context.dialog.roomlistType.room_price,
            order_room:context.dialog.roomlistType.category_name,
            order_category:context.dialog.roomlistType._id,
            order_period:context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday+"~"+context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday,
            order_peoplenumber: context.dialog.peoplenumber
        };
        order.collection.insert(neworder,function(err,docs){
            order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err,docs) {
                context.dialog.order= docs;
                //console.log(context.dialog.order[0]);
                context.dialog.allprice=0;
                for(i=0;i<context.dialog.order.length;i++){
                    var number1=context.dialog.order[i].order_price;
                    context.dialog.allprice=number1+context.dialog.allprice;}

                context.dialog.inputyear1=context.dialog.inputyear;
                context.dialog.inputmonth1=context.dialog.inputmonth;
                context.dialog.inputday1=context.dialog.inputday;

                context.dialog.outyear1=context.dialog.outyear;
                context.dialog.outmonth1=context.dialog.outmonth;
                context.dialog.outday1=context.dialog.outday;
  
                context.dialog.peoplenumber1=context.dialog.peoplenumber;
              
                context.dialog.myyear=undefined;
                context.dialog.mymonth=undefined;
                context.dialog.myday=undefined;

                context.dialog.inputyear=undefined;
                context.dialog.inputmonth=undefined;
                context.dialog.inputday=undefined;

                context.dialog.outyear=undefined;
                context.dialog.outmonth=undefined;
                context.dialog.outday=undefined;
              
               context.dialog.peoplenumber=undefined;

                callback(task,context);
            });
        });


    }
};
bot.setTask("mynamesave1", mynamesave1);
//----------------------task--------------------------------------------------------------------------------------------------------
var categoryroomlist = {
    name: 'categoryroomlist',
    action: function(task, context, callback) {
        //context.dialog.hotelroomss=context.bot.hotelrooms;

        if(context.bot.hotelrooms[0]===undefined){context.dialog.roomno=undefined;callback(task,context);}
        else {
            context.dialog.roomno = 0;
        var mydate=new Date().toLocaleDateString();
        var x=mydate.split("/");
        context.dialog.myyear=x[2];
        context.dialog.mymonth=x[0];
        context.dialog.myday=Number(x[1])+1;
            //console.log(JSON.stringify(context.bot.templateDataId) +" *********************");
          categoryrooms.find({upTemplateId:context.bot.templateDataId}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {

                context.dialog.categoryroom = docs;
                callback(task,context);
            }
        });
        }
    }
};
bot.setTask("categoryroomlist", categoryroomlist);

var orderlist = {
    name: 'orderlist',
    action: function(task, context, callback) {
         order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.orders = docs;
                callback(task,context);
            }
        });
    }
};
bot.setTask("orderlist", orderlist);

var saveinputdate = {
    name: 'saveinputdate',
    action: function(task, context, callback) {
        if(context.dialog.inputyear && context.dialog.inputmonth && context.dialog.inputday){ callback(task,context);}
        else{context.dialog.inputyear=context.dialog.myyear;
        context.dialog.inputmonth=context.dialog.mymonth;
        context.dialog.inputday=context.dialog.myday;
            callback(task,context);
            }

    }
};
bot.setTask("saveinputdate", saveinputdate);



var saveMobile = {
  action: function (task,context,callback) {
    if(context.dialog.mobile)
    {context.user.mobile = context.dialog.mobile;}
     var mydate=new Date().toLocaleDateString();
        var x=mydate.split("/");
        context.dialog.myyear=x[2];
        context.dialog.mymonth=x[0];
        context.dialog.myday=Number(x[1])+1;
      if(context.bot.hotelrooms[0]===undefined){context.dialog.roomno=undefined;callback(task,context);}
      else {
          context.dialog.roomno = 0;
          categoryrooms.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
              if (err) {
                  console.log(err);
                  callback(task, context);
              } else {
                  context.dialog.categoryroom = docs;
                  callback(task, context);
              }
          });
      }
	}
};

bot.setTask('saveMobile', saveMobile);




var categoryrestaurantlist = {
    name: 'categoryrestaurantlist',
    action: function(task, context, callback) {
        if(context.bot.hotelrestaurants[0]===undefined){context.dialog.restaurantno=undefined;callback(task,context);}
        else {
            context.dialog.restaurantno=0;
            categoryrestaurants.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categoryrestaurant = docs;
                    callback(task, context);
                }
            });
        }
    }
};
bot.setTask("categoryrestaurantlist", categoryrestaurantlist);

var categoryfacilitylist = {
    name: 'categoryfacilitylist',
    action: function(task, context, callback) {
        if(context.bot.hotelfacilities[0]===undefined){context.dialog.facilityno=undefined;callback(task,context);}
        else {
            context.dialog.facilityno = 0;
            categoryfacilities.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categoryfacility = docs;
                    callback(task, context);
                }
            });
        }
    }
};
bot.setTask("categoryfacilitylist", categoryfacilitylist);


var categoryeventlist = {
    name: 'categoryeventlist',
    action: function(task, context, callback) {
        if(context.bot.hotelevents[0]===undefined){context.dialog.eventno=undefined;callback(task,context);}
        else {
            context.dialog.eventno = 0;
            categoryevents.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categoryevent = docs;
                    callback(task, context);
                }
            });
        }
    }
};
bot.setTask("categoryeventlist", categoryeventlist);

var inforshuttle = {
    name: 'inforshuttle',
    action: function(task, context, callback) {
        if(context.bot.hotelshuttles[0]===undefined){context.dialog.shuttleno=undefined;callback(task,context);}
        else if(context.bot.hotelshuttles[0].shuttleornot==="부"){context.dialog.shuttleno=1;callback(task,context);}
        else {context.dialog.shuttleno=0;
            var ss=context.bot.hotelshuttles[0].shuttleimage[0];
            //console.log(ss+"000000000000");
            var img = context.bot.hotelshuttles[0].shuttleimage[0]=='h' ? context.bot.hotelshuttles[0].shuttleimage : config.host + context.bot.hotelshuttles[0].shuttleimage;
            console.log(img+"222222222222");
            task.buttons = [{text:"자세히보기",url:img}];
            task.image = {url: img};

            callback(task,context);}
    }
};
bot.setTask("inforshuttle", inforshuttle);


var inforpark = {
    name: 'inforpark',
    action: function(task, context, callback) {
        //console.log(context.bot.parks+"222222222");
        // console.log(typeof JSON.stringify(context.bot.parks[0]));
        // console.log(typeof JSON.parse(JSON.stringify(context.bot.parks[0])));
       if(context.bot.hotelparks[0]===undefined){context.dialog.parkno=undefined;callback(task,context);}
       else if(context.bot.hotelparks[0].parkornot==="부"){context.dialog.parkno=1; callback(task,context);}
       else {context.dialog.parkno=0;
       context.dialog.parkaddress=context.bot.hotelparks[0].parkaddress;
       context.dialog.parkdetails=context.bot.hotelparks[0].parkdetails;
       context.dialog.parksize=context.bot.hotelparks[0].parksize;
       context.dialog.parkname=context.bot.hotelparks[0].parkname;
       context.dialog.parkornot=context.bot.hotelparks[0].parkornot;

       task.buttons = [{text:"지도보기(클릭)", url: "http://map.naver.com/?query=" + context.dialog.parkaddress}];
       callback(task,context);}
    }
};
bot.setTask("inforpark", inforpark);


var imageroom = {
    name: 'imageroom',
    action: function(task, context, callback) {
        var img = context.dialog.roomlistType.room_image[0]=='h' ? context.dialog.roomlistType.room_image : config.host + context.dialog.roomlistType.room_image;
        task.image = {url: img};
        callback(task,context);
    }
};
bot.setTask("imageroom", imageroom);

var imagerestaurant = {
    name: 'imagerestaurant',
    action: function(task, context, callback) {
        var img = context.dialog.restaurantlistType.restaurant_image[0]=='h' ? context.dialog.restaurantlistType.restaurant_image : config.host + context.dialog.restaurantlistType.restaurant_image;
        task.image = {url: img};
        callback(task,context);
    }
};
bot.setTask("imagerestaurant", imagerestaurant);

var imagefacility = {
    name: 'imagefacility',
    action: function(task, context, callback) {
        var img = context.dialog.facilitylistType.facility_image[0]=='h' ? context.dialog.facilitylistType.facility_image : config.host + context.dialog.facilitylistType.facility_image;
        task.image = {url: img};
        callback(task,context);
    }
};
bot.setTask("imagefacility", imagefacility);


var addorder = {
    name:'addorder',
    action: function (task,context,callback) {
        context.dialog.oneallprice=context.dialog.days*context.dialog.roomlistType.room_price;
        var s1  =  context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday;
        var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;
        context.dialog.days=DateDiff(s1,s2);
        context.dialog.dayss=context.dialog.days+1;
    var mydate=new Date();
    mydate.setHours(mydate.getHours()+9);
    context.dialog.myall=mydate;
    var ss=mydate;
    context.dialog.todayday=ss.getDate();
    context.dialog.todaymonth=Number(ss.getMonth())+1;
    context.dialog.todayyear=ss.getFullYear();
    context.dialog.todaytime=ss.getHours()+":"+ss.getMinutes()+":"+ss.getSeconds();
    context.dialog.todaydate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+context.dialog.todayday+" "+context.dialog.todaytime;
    var tomorrowday = Number(context.dialog.todayday)+1;
    context.dialog.tomorrowdate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+tomorrowday+" "+context.dialog.todaytime;
      
                var neworder={
                order_user: context.dialog.myname,
                order_phone:context.user.mobile,
                order_price:context.dialog.oneallprice,           
                order_date: context.dialog.todaydate,
                order_paydate: context.dialog.tomorrowdate,
                order_daynumbers:context.dialog.days,
                order_oneprice:context.dialog.roomlistType.room_price,
                order_room:context.dialog.roomlistType.category_name,
                order_category:context.dialog.roomlistType._id,
                order_period:context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday+"~"+context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday,
                   order_peoplenumber: context.dialog.peoplenumber
                            };
                order.collection.insert(neworder,function(err,docs){
                  order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err,docs) {
                                                        context.dialog.order= docs;
                                                        //console.log(context.dialog.order[0]);
                                                        context.dialog.allprice=0;
                                                        for(i=0;i<context.dialog.order.length;i++){
                                                        var number1=context.dialog.order[i].order_price;
                                                        context.dialog.allprice=number1+context.dialog.allprice;}
                                      
                                                        
                                                        context.dialog.inputyear1=context.dialog.inputyear;
                                                        context.dialog.inputmonth1=context.dialog.inputmonth;
                                                        context.dialog.inputday1=context.dialog.inputday;
                                                        
                                                        context.dialog.outyear1=context.dialog.outyear;
                                                        context.dialog.outmonth1=context.dialog.outmonth;
                                                        context.dialog.outday1=context.dialog.outday;
                    
                                                        context.dialog.peoplenumber1=context.dialog.peoplenumber;
                    
                                                        context.dialog.myyear=undefined;
                                                        context.dialog.mymonth=undefined;
                                                        context.dialog.myday=undefined;
                                                          
                                                        context.dialog.inputyear=undefined;
                                                        context.dialog.inputmonth=undefined;
                                                        context.dialog.inputday=undefined;
                                                        
                                                        context.dialog.outyear=undefined;
                                                        context.dialog.outmonth=undefined;
                                                        context.dialog.outday=undefined;
                    
                                                        context.dialog.peoplenumber=undefined;

                                                        callback(task,context);
                         });
                  });
    }
};


bot.setTask('addorder',addorder);


var addorder1 = {
    name:'addorder1',
    action: function (task,context,callback) {

        var s1  =  context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday;
        var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;
        context.dialog.days=DateDiff(s1,s2);
        context.dialog.dayss=context.dialog.days+1;
        context.dialog.oneallprice=context.dialog.days*context.dialog.menumatch.room_price;
        var mydate=new Date();
        mydate.setHours(mydate.getHours()+9);
        context.dialog.myall=mydate;
        var ss=mydate;
        context.dialog.todayday=ss.getDate();
        context.dialog.todaymonth=Number(ss.getMonth())+1;
        context.dialog.todayyear=ss.getFullYear();
        context.dialog.todaytime=ss.getHours()+":"+ss.getMinutes()+":"+ss.getSeconds();
        context.dialog.todaydate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+context.dialog.todayday+" "+context.dialog.todaytime;
        var tomorrowday = Number(context.dialog.todayday)+1;
        context.dialog.tomorrowdate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+tomorrowday+" "+context.dialog.todaytime;

        var neworder={
            order_user: context.dialog.myname,
            order_phone:context.user.mobile,
            order_price:context.dialog.oneallprice,
            order_date: context.dialog.todaydate,
            order_paydate: context.dialog.tomorrowdate,
            order_daynumbers:context.dialog.days,
            order_oneprice:context.dialog.menumatch.room_price,
            order_room:context.dialog.menumatch.category_name,
            order_category:context.dialog.menumatch._id,
            order_period:context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday+"~"+context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday,
            order_peoplenumber: context.dialog.peoplenumber
        };
        order.collection.insert(neworder,function(err,docs){
            order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err,docs) {
                context.dialog.order= docs;
                //console.log(context.dialog.order[0]);
                context.dialog.allprice=0;
                for(i=0;i<context.dialog.order.length;i++){
                    var number1=context.dialog.order[i].order_price;
                    context.dialog.allprice=number1+context.dialog.allprice;}


                context.dialog.inputyear1=context.dialog.inputyear;
                context.dialog.inputmonth1=context.dialog.inputmonth;
                context.dialog.inputday1=context.dialog.inputday;

                context.dialog.outyear1=context.dialog.outyear;
                context.dialog.outmonth1=context.dialog.outmonth;
                context.dialog.outday1=context.dialog.outday;

                context.dialog.peoplenumber1=context.dialog.peoplenumber;

                context.dialog.myyear=undefined;
                context.dialog.mymonth=undefined;
                context.dialog.myday=undefined;

                context.dialog.inputyear=undefined;
                context.dialog.inputmonth=undefined;
                context.dialog.inputday=undefined;

                context.dialog.outyear=undefined;
                context.dialog.outmonth=undefined;
                context.dialog.outday=undefined;

                context.dialog.peoplenumber=undefined;

                callback(task,context);
            });
        });
    }
};


bot.setTask('addorder1',addorder1);

var addorder2 = {
    name: 'addorder2',
    action: function(task, context, callback){
        context.dialog.myname = context.dialog.inCurRaw;
        context.user.myname=context.dialog.myname;
        var s1  =  context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday;
        var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;
        context.dialog.days=DateDiff(s1,s2);
        context.dialog.dayss=context.dialog.days+1;
        context.dialog.oneallprice=context.dialog.days*context.dialog.menumatch.room_price;
        var mydate=new Date();
        mydate.setHours(mydate.getHours()+9);
        context.dialog.myall=mydate;
        var ss=mydate;
        context.dialog.todayday=ss.getDate();
        context.dialog.todaymonth=Number(ss.getMonth())+1;
        context.dialog.todayyear=ss.getFullYear();
        context.dialog.todaytime=ss.getHours()+":"+ss.getMinutes()+":"+ss.getSeconds();
        context.dialog.todaydate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+context.dialog.todayday+" "+context.dialog.todaytime;
        var tomorrowday = Number(context.dialog.todayday)+1;
        context.dialog.tomorrowdate=context.dialog.todayyear+"-"+context.dialog.todaymonth+"-"+tomorrowday+" "+context.dialog.todaytime;

        var neworder={
            order_user: context.dialog.myname,
            order_phone:context.user.mobile,
            order_price:context.dialog.oneallprice,
            order_date: context.dialog.todaydate,
            order_paydate: context.dialog.tomorrowdate,
            order_daynumbers:context.dialog.days,
            order_oneprice:context.dialog.menumatch.room_price,
            order_room:context.dialog.menumatch.category_name,
            order_category:context.dialog.menumatch._id,
            order_period:context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday+"~"+context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday,
            order_peoplenumber: context.dialog.peoplenumber
        };
        order.collection.insert(neworder,function(err,docs){
            order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err,docs) {
                context.dialog.order= docs;
                //console.log(context.dialog.order[0]);
                context.dialog.allprice=0;
                for(i=0;i<context.dialog.order.length;i++){
                    var number1=context.dialog.order[i].order_price;
                    context.dialog.allprice=number1+context.dialog.allprice;}


                context.dialog.inputyear1=context.dialog.inputyear;
                context.dialog.inputmonth1=context.dialog.inputmonth;
                context.dialog.inputday1=context.dialog.inputday;

                context.dialog.outyear1=context.dialog.outyear;
                context.dialog.outmonth1=context.dialog.outmonth;
                context.dialog.outday1=context.dialog.outday;

                context.dialog.peoplenumber1=context.dialog.peoplenumber;

                context.dialog.myyear=undefined;
                context.dialog.mymonth=undefined;
                context.dialog.myday=undefined;

                context.dialog.inputyear=undefined;
                context.dialog.inputmonth=undefined;
                context.dialog.inputday=undefined;

                context.dialog.outyear=undefined;
                context.dialog.outmonth=undefined;
                context.dialog.outday=undefined;

                context.dialog.peoplenumber=undefined;

                callback(task,context);
            });
        });
    }
};
bot.setTask("addorder2", addorder2);



var deleteorder = {
    name: 'deleteorder',
    action: function(task, context, callback) {
       
                order.find({_id:context.dialog.orderlistType._id}).remove({},function(err){
                   order.find({order_user:context.user.myname,order_phone:context.user.mobile}).lean().exec(function(err, docs) {
            if(err) {
                console.log(err);
                callback(task, context);
            } else {
                context.dialog.orders = docs;
                callback(task,context);}
                     
                });

        });
    }
};

bot.setTask('deleteorder', deleteorder);


//---------------------------function----------------------------------------------------------------------------------------------


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

   //计算天数差的函数，通用  
   function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式  
       var  aDate,oDate1,oDate2,iDays;  
       aDate  =  sDate1.split("-");
       oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);   //转换为12-18-2002格式
       aDate  =  sDate2.split("-");
       oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
       iDays  =  parseInt((oDate2  -  oDate1)  /  1000  /  60  /  60  /24);   //把相差的毫秒数转换为天数
       return  iDays  
}

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
//-----------------type------------------------------------------------------------------------------------------------------------------------
var datetype = {
    name: "datetype",
    listName: "datetype",
    typeCheck: "dateTypeCheck"
};
bot.setType("datetype", datetype);

var  dateincheck= {
    name:'dateincheck',
    action: function(task, context, callback) {

        //console.log(task.date[1]+" 111111111111");
        context.dialog.date2=task.date[1];
        context.dialog.inputyear=task.date[1].getFullYear();
        context.dialog.inputmonth=task.date[1].getMonth()+1;
        context.dialog.inputday=task.date[1].getDate();
        //console.log(context.dialog.inputyear+" 111111111111");
        //console.log(context.dialog.inputmonth+" 111111111111");
        //console.log(context.dialog.inputday+" 111111111111");
        callback(task,callback);
    }
};

bot.setTask('dateincheck', dateincheck);

var peoplenumbertype = {
    name: "peoplenumbertype",
    listName: "peoplenumbertype",
    typeCheck: function (text, type, task, context, callback) {
        var x=/[ ]?명/g;
        //search(x);
        //var str='2017-12-15부터 5명 4555박5일 예약';
        var count1=text.search(x);
        var count2=0;
        if(count1>=0){
            context.dialog.peoplenumber='';
            //console.log(str.search(x));
            //console.log(str[count1]);
            for(i=count1-1;i>=0;i--)
            {
                if(text[i]===' '){count2=i;break}
            }
            var count3=count2+1;
            for(i=count3;i<count1;i++)
            {
                context.dialog.peoplenumber=Number(context.dialog.peoplenumber+text[i]);

            }
            callback(text, task, true);}
        else{ callback(text, task, false);}
        //console.log(context.dialog.daynumber);
    }
};
bot.setType("peoplenumbertype", peoplenumbertype);


var daynumbertype = {
    name: "daynumbertype",
    listName: "daynumbertype",
    typeCheck: function (text, type, task, context, callback) {
        var x=/[ ]?박/g;
         //search(x);
        //var str='2017-12-15부터 5명 4555박5일 예약';
        var count1=text.search(x);
        var count2=0;
        if(count1>=0){
        context.dialog.daynumber='';
        //console.log(str.search(x));
        //console.log(str[count1]);
        for(i=count1-1;i>=0;i--)
        {
            if(text[i]===' '){count2=i;break}
        }
        var count3=count2+1;
        for(i=count3;i<count1;i++)
        {
            context.dialog.daynumber=Number(context.dialog.daynumber+text[i]);

        }
            context.dialog.daynumber1=context.dialog.daynumber+1;
        callback(text, task, true);}
        else{ callback(text, task, false);}
        //console.log(context.dialog.daynumber);
    }
};
bot.setType("daynumbertype", daynumbertype);

var  dateoutcheck= {
    name:'dateoutcheck',
    action: function(task, context, callback) {
        //console.log(task.date+"++++++++++++++++++++");
        var x=context.dialog.date2;

        x.setDate(x.getDate()+context.dialog.daynumber);

        //console.log(task.date+" 111111111111");
        context.dialog.outyear=x.getFullYear();
        context.dialog.outmonth=x.getMonth()+1;
        context.dialog.outday=x.getDate();

        //console.log(context.dialog.inputyear+" 111111111111");
        //console.log(context.dialog.inputmonth+" 111111111111");
        //console.log(context.dialog.inputday+" 111111111111");
        callback(task,callback);
    }
};

bot.setTask('dateoutcheck', dateoutcheck);


var categoryroomisornot = {
    name: "categoryroomisornot",
    listName: "categoryroomisornot",
    typeCheck: function(text, type, task, context, callback) {
        var matched=false;

        //context.dialog.menumatch=[];
        //var ss=0;
        //var ll='ㄴㅁㅇㄹㅎㄴㅇㄹㅎㅇㅌㄹㅎdddd';
        //console.log(JSON.stringify(context.bot)+"pppppppppppppppppp");
        //console.log(context.bot.hotelrooms+"2222222222222222");
        if(context.bot.hotelrooms[0]===undefined){callback(task,context);}
        else {
            categoryrooms.find({upTemplateId: context.bot.templateDataId}).lean().exec(function (err, docs) {
                if (err) {
                    console.log(err);
                    callback(task, context);
                } else {
                    context.dialog.categorys = docs;
                    if (context.dialog.categorys.length === 0) {
                        callback(task, context);
                    }
                    else {

                        for (i = 0; i < context.dialog.categorys.length; i++) {
                            var str = context.dialog.inRaw;
                            var ss=i+1;
                            //console.log(text+"tttttttttt2222222222222222");
                            //console.log(i+"tttttttttt2222222222222222");
                            //console.log(context.dialog.categorys[i].category_name+"2222222222222222");
                            //console.log(typeof text);
                            //var regDate =/[context.dialog.inRaw]/;
                            //if (regDate.test(context.dialog.categorys[i].name)) {context.dialog.menumatch.push(context.dialog.categorys[i]);}
                            if (str.indexOf(context.dialog.categorys[i].category_name) >= 0 || text == ss) {
                                context.dialog.menumatch = context.dialog.categorys[i];
                               // console.log(context.dialog.inRaw+"ssssssss2222222222222222");
                               // console.log((i+1)+"ssssssss2222222222222222");
                               // console.log(context.dialog.menumatch+"ssssssss2222222222222222");
                            }
                        }
                        if (context.dialog.menumatch !== undefined) {
                            matched = true;
                            context.dialog.preallprice = context.dialog.daynumber * context.dialog.menumatch.room_price;
                        }
                        callback(task, context,matched);
                    }
                }
            });
        }
    }
};

bot.setType('categoryroomisornot', categoryroomisornot);



var roomlistType = {
    name: "categoryroom",
    listName: "categoryroom",
    typeCheck: "listTypeCheck"
};
bot.setType("roomlistType", roomlistType);

var restaurantlistType = {
    name: "categoryrestaurant",
    listName: "categoryrestaurant",
    typeCheck: "listTypeCheck"
};
bot.setType("restaurantlistType", restaurantlistType);

var facilitylistType = {
    name: "categoryfacility",
    listName: "categoryfacility",
    typeCheck: "listTypeCheck"
};
bot.setType("facilitylistType", facilitylistType);

var eventlistType = {
    name: "categoryevent",
    listName: "categoryevent",
    typeCheck: "listTypeCheck"
};
bot.setType("eventlistType", eventlistType);

var orderlistType = {
    name: "orders",
    listName: "orders",
    typeCheck: "listTypeCheck"
};
bot.setType("orderlistType", orderlistType);



var  isDateIn= {
  typeCheck: function (text, type, task, context, callback) {
    var matched=false;
      // 判断年、月、日的取值范围是否正确 
  // 先判断格式上是否正确 
var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})$/;
if (!regDate.test(text))
{
    matched=false;
   callback(text, task, matched);

}
else{
    // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
    var arr = regDate.exec(text);
    if(!context.dialog.outyear && !context.dialog.outmonth && !context.dialog.outday) {
        // 判断年、月、日的取值范围是否正确
        context.dialog.inputyear = arr[1];
        context.dialog.inputmonth = arr[2];
        context.dialog.inputday = arr[3];
        matched = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
        callback(text, task, matched);
    }
    else{
        context.dialog.inputyear = arr[1];
        context.dialog.inputmonth = arr[2];
        context.dialog.inputday = arr[3];
        var ss=false;
        ss = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
        if(ss && context.dialog.inputyear<=context.dialog.outyear && context.dialog.inputmonth<=context.dialog.outmonth && context.dialog.inputday<=context.dialog.outday)
        {
            matched=true;callback(text, task, matched);
        }
        else{matched=false;callback(text, task, matched);}
    }
}
	}
};

bot.setType('isDateIn', isDateIn);

var  isDateOut= {
  typeCheck: function (text, type, task, context, callback) {
    
    var matched=false;
      // 判断年、月、日的取值范围是否正确 
  // 先判断格式上是否正确 
var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})$/;
if (!regDate.test(text))
{
    matched=false;
   callback(text, task, matched);

}
else{
    // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
    var arr = regDate.exec(text);

    // 判断年、月、日的取值范围是否正确
    context.dialog.outyear=arr[1];
    context.dialog.outmonth=arr[2];
    context.dialog.outday=arr[3];
  

      var s1  =  context.dialog.inputyear+"-"+context.dialog.inputmonth+"-"+context.dialog.inputday; 
      var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;  
       context.dialog.days=DateDiff(s1,s2);
       context.dialog.dayss=context.dialog.days+1;
         // var allday=context.dialog.days;
    //var numberallday=Number(allday);
   // var oneprice=context.dialog.roomlistType.room_price;
    //var numberoneprice=Number(oneprice);
    context.dialog.preallprice=context.dialog.days*context.dialog.roomlistType.room_price;
  if(context.dialog.days>0){
    matched=IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
   callback(text, task, matched);}
    else{matched=false; callback(text, task, matched);}
}
	}
};

bot.setType('isDateOut', isDateOut);


var  isDateOutfast= {
  typeCheck: function (text, type, task, context, callback) {
    
    var matched=false;
      // 判断年、月、日的取值范围是否正确 
  // 先判断格式上是否正确 
var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})$/;
if (!regDate.test(text))
{
    matched=false;
   callback(text, task, matched);

}
else{
    // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
    var arr = regDate.exec(text);

    // 判断年、月、日的取值范围是否正确
    context.dialog.outyear=arr[1];
    context.dialog.outmonth=arr[2];
    context.dialog.outday=arr[3];
  

      var s1  =  context.dialog.myyear+"-"+context.dialog.mymonth+"-"+context.dialog.myday; 
      var s2  =  context.dialog.outyear+"-"+context.dialog.outmonth+"-"+context.dialog.outday;  
       context.dialog.days=DateDiff(s1,s2);
       context.dialog.dayss=context.dialog.days+1;
   // var allday=context.dialog.days;
    //var numberallday=Number(allday);
   // var oneprice=context.dialog.roomlistType.room_price;
    //var numberoneprice=Number(oneprice);
    context.dialog.preallprice=context.dialog.days*context.dialog.roomlistType.room_price;
  if(context.dialog.days>0){
  
    matched=IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
    callback(text, task, matched);}
  else{matched=false; callback(text, task, matched);}
}
	}
};

bot.setType('isDateOutfast', isDateOutfast);

var orderlistType = {
    name: "orders",
    listName: "orders",
    typeCheck: "listTypeCheck"
};
bot.setType("orderlistType", orderlistType);



var  ispeoplenumber= {
  typeCheck: function (text, type, task, context, callback) {
    var matched=false;
      // 判断年、月、日的取值范围是否正确 
  // 先判断格式上是否正确 
var regDate =/^\d$/;
if (!regDate.test(text))
{
    matched=false;
   callback(text, task, matched);

}
else{
    context.dialog.peoplenumber=context.dialog.inCurRaw;
    //context.dialog.backallprice=context.dialog.preallprice*context.dialog.peoplenumber;
    matched=true;
    callback(text, task, matched);
}
	}
};

bot.setType('ispeoplenumber', ispeoplenumber);

//-----------------------------------------------------------------------------------------------


var verificationType = {
  typeCheck: function (text, type, task, context, callback) {
   var matched = false;
    if(text === context.dialog.smsAuth)
    { matched = true; callback(text, task, matched);}
    else{callback(text, task, matched);}
	}
};

bot.setType('verificationType', verificationType);




var SMSAuth = {
    name: 'SMSAuth',
    preCallback: function(task, context, callback) {
        if (task.mobile === undefined) task.mobile = context.dialog.mobile;
        console.log('ddd');
        callback(task, context);
    },
    action: messages.sendSMSAuth
};
bot.setTask("SMSAuth", SMSAuth);



