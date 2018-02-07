var path = require('path');
var mongo = require(path.resolve('./engine2/utils/mongo-wrapper.js'));
var config = require(path.resolve('./config/config'));
var messages = require(path.resolve('engine2/messages.js'));
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var db= mongoose.connect('mongodb://localhost:27017/bot-dev');

db.connection.on("error",function(error){
    console.log("数据库连接失败:"+error);
});

db.connection.on("open",function(){
    console.log("数据库连接成功");
});

var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    "order_name": "String",
    "order_mobile": "String",
    "order_itemname": "String",
    "order_itemcode": "String",
    "order_date": "String",
    "order_hour": "String",
    "order_receivername": "String",
    "order_receivermobile": "String",
    "order_receiveraddress": "String",
    "order_deliverydate": "String",
    "order_deliveryhour": "String",
    "order_greeting": "String",
    "order_sendername": "String",
    "order_status": "String",
    "order_time": "String",
    "order_price": "Number",
    "order_itemimage": "String",
    "order_itemnumber": "Number",
    "order_email": "String",
    "order_bride": "String",
    "order_showtime": "String",
    "order_deliveryway": "String",
    "order_decorateway": "String",
    "order_bill": "String",
    "order_payway": "String",
    "order_allprice": "Number",
    "order_deliverytime": "String",
    "order_otherrequire": "String"
});

var categorySchema = new Schema({
    "category": "String",
    "name": "String",
    "price": "Number",
    "picture": "String",
    "description": "String",
    "code": "String",
    "sale_price": "Number",
    "delivery": "String",
    "VIP": "String",
    "status": "String"
});

var faqSchema = new Schema({
    "category": "String",
    "question": "String",
    "answer": "String"
});

//var db  = mongoose.connection;


module.exports = function (bot) {

var getcategory = {
    action: function (task, context, callback) {
        //context.user.mobile=undefined;
        category.find({}).lean().exec(function (err, docs) {
            context.dialog.category =[];
            context.user.categorylist=undefined;
            var str = [];
            for (var j = 0; j < docs.length; j++) {
                if (str.indexOf(docs[j].category)<0) {
                    str.push(docs[j].category);
                }
            }
            context.dialog.category = str;
            task.buttons = [];
            for(var i=0; i<context.dialog.category.length; i++){
                var ss= ""+ (i+1) + ". " + context.dialog.category[i];
                task.buttons.push({text: ss});
            }
            callback(task, context);
        })
    }
};

bot.setTask('getcategory', getcategory);

var categorylist = {
    name: "category",
    listName: "category",
    typeCheck: "listTypeCheck"
};
bot.setType("categorylist", categorylist);


var showcategory = {
    action: function (task,context,callback) {
        context.user.categorylist1=undefined;
        if(context.dialog.categorylist!==undefined){
            context.user.categorylist=context.dialog.categorylist;
        }
        category.find({category:context.user.categorylist}).lean().exec(function(err,docs){
            context.dialog.category1=[];
            context.dialog.category1=docs;
            task.buttons = [];
            for(var i=0; i<context.dialog.category1.length; i++){
                var ss= ""+ (i+1) + ". " + context.dialog.category1[i].name+" "+context.dialog.category1[i].code;
                task.buttons.push({text: ss});
            }
            callback(task,context);
        });
    }
};

bot.setTask('showcategory', showcategory);

var categorylist1 = {
    name: "category1",
    listName: "category1",
    typeCheck: "listTypeCheck"
};
bot.setType("categorylist1", categorylist1);


var showitem = {
    action: function (task,context,callback) {
        if(context.dialog.categorylist1!==undefined){
            context.user.categorylist1=context.dialog.categorylist1;
        }
        category.find({category:context.user.categorylist1.category,name:context.user.categorylist1.name,code:context.user.categorylist1.code}).lean().exec(function(err,docs){
            context.dialog.item=docs;
            context.dialog.selecteditem={};
            context.dialog.selecteditem=context.dialog.item[0];
            context.dialog.selecteditem.sale_price=context.dialog.item[0].sale_price;
            if(context.dialog.selectchange!==1) {
                if (context.dialog.item[0].picture !== undefined) {
                    task.image = {url: context.dialog.item[0].picture};
                    task.buttons = [
                        {
                            text: '자세히보기',
                            url: context.dialog.item[0].picture.startsWith('http') ? context.dialog.item[0].picture : config.host + context.dialog.item[0].picture
                        },
                        {
                            text: '이 상품으로 주문하기',
                            url: ""
                        },
                        {
                            text: '다른 상품 더보기',
                            url: ""
                        }
                    ];
                }
            }
            else{
                if (context.dialog.item[0].picture !== undefined) {
                    task.image = {url: context.dialog.item[0].picture};
                    task.buttons = [
                        {
                            text: '주문서 확인하기',
                            url: ""
                        }
                    ];
                }
            }
            callback(task,context);
        });
    }
};

bot.setTask('showitem', showitem);


var getFAQcategory = {
    action: function (task, context, callback) {
        faq.find({}).lean().exec(function (err, docs) {
            context.dialog.category =[];
            context.user.categorylist=undefined;
            var str = [];
            for (var j = 0; j < docs.length; j++) {
                if (str.indexOf(docs[j].category)<0) {
                    str.push(docs[j].category);
                }
            }
            context.dialog.category = str;
            task.buttons = [];
            for(var i=0; i<context.dialog.category.length; i++){
                var ss= ""+ (i+1) + ". " + context.dialog.category[i];
                task.buttons.push({text: ss});
            }
            callback(task, context);
        })
    }
};

bot.setTask('getFAQcategory', getFAQcategory);

var showfaqlist = {
    action: function (task,context,callback) {
        context.user.categorylist1=undefined;
        if(context.dialog.categorylist!==undefined){
            context.user.categorylist=context.dialog.categorylist;
        }
        faq.find({category:context.user.categorylist}).lean().exec(function(err,docs){
            context.dialog.category1=[];
            context.dialog.category1=docs;
            task.buttons = [];
            for(var i=0; i<context.dialog.category1.length; i++){
                var ss= ""+ (i+1) + ". " + context.dialog.category1[i].question;
                task.buttons.push({text: ss});
            }
            callback(task,context);
        });
    }
};

bot.setTask('showfaqlist', showfaqlist);

var showfaq = {
    action: function (task,context,callback) {
        faq.find({question:context.dialog.categorylist1.question}).lean().exec(function(err,docs){
            context.dialog.item=docs;
            task.buttons = [
                {
                    text: '시작',
                    url: ""
                }
            ];
            callback(task,context);
        });
    }
};

bot.setTask('showfaq', showfaq);


var categorycheck = {
    action: function (task,context,callback) {
        var str="";
        if(context.dialog.inCurRaw!==undefined){
            str=context.dialog.inCurRaw;
        }
        else{str=context.dialog.inRaw;}
        category.find({}).lean().exec(function(err,docs){
            for(var i=0;i<docs.length;i++){
                if(str==docs[i].name){
                    category.find({"name":str}).lean().exec(function(err,docs){
                        context.dialog.item=docs;
                        //console.log(context.dialog.item[0]+'////////////////');
                        if(context.dialog.item[0].picture!==undefined)
                        {
                            task.result={
                                text:"선택하신 **"+context.dialog.item[0].name+"**에 대한 정보입니다.\n\n상품 번호: "+context.dialog.item[0].code+"\n" +
                                "배송 안내: " +context.dialog.item[0].delivery+"\n" +
                                "회원 혜택: "+context.dialog.item[0].VIP+"\n" +
                                "\n" + "가격:\n" +
                                "       일반가: "+context.dialog.item[0].price+"원\n" +
                                "       회원할인가: "+context.dialog.item[0].sale_price+"원\n\n" +
                                "상품안내: "+context.dialog.item[0].description+ "\n\n" +
                                "이 상품으로 주문하시겠습니까?",
                                image:{url: context.dialog.item[0].picture},
                                buttons :[
                                    {
                                        text: '자세히보기',
                                        url: context.dialog.item[0].picture.startsWith('http') ? context.dialog.item[0].picture : config.host + context.dialog.item[0].picture
                                    },
                                    {
                                        text: '네 주문하기',
                                        url: ""
                                    }
                                ]
                            };
                        }
                        callback(task,context);
                    });
                }
            }
        });
    }
};

bot.setTask('categorycheck', categorycheck);


var newuser = {
    action: function (task,context,callback) {
        task.buttons=[
            {
                text: '회원가입하기',
                url: 'http://flowermania.co.kr/cgi-bin/member/registration.php'
            },
            {
                text: '휴대폰번호로 회원인증하기',
                url: ""
            },
            {
                text: '비회원으로 구매하기',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('newuser', newuser);


var savename = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            context.user.username = "";
            //console.log("context.dialog.inCurRaw=====" + context.dialog.inCurRaw);
            context.user.username = context.dialog.inCurRaw;
            callback(task, context);
        }
        else {
            callback(task, context);
        }
    }
};

bot.setTask('savename', savename);

var email = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = true;
        var str=context.dialog.inCurRaw;
        var RegEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(RegEmail.test(str))//如果返回true,表示userEmail符合邮箱格式
        {matched = true; context.user.useremail=str; callback(text, task, matched);}
        else
        {matched = false;  callback(text, task, matched);}

    }
};

bot.setType('email', email);


var savemobile = {
    preCallback: function(task, context, callback) {

        context.user.usermobile = "";
        context.user.usermobile = context.dialog.mobile;
        if (task.mobile === undefined) task.mobile = context.dialog.mobile;
        callback(task, context);
    },
    action: messages.sendSMSAuth
};

bot.setTask('savemobile', savemobile);

var mobileidentification = {
    preCallback: function (task,context,callback) {
        var str= context.dialog.mobile;
        var userinfor=[
            {
                "name":"조수앙",
                "mobile":"01066389310",
                "email":"zsslovelyg@moneybrain.ai"
            },
            {
                "name":"김성훈",
                "mobile":"01095020541",
                "email":"kshchlee@moneybrain.ai"
            },
            {
                "name":"박지현",
                "mobile":"01042369555",
                "email":"jipark@moneybrain.ai"
            },
            {
                "name":"장세영",
                "mobile":"01063165683",
                "email":"com2best@moneybrain.ai"
            },
            {
                "name":"임보훈",
                "mobile":"01062588718",
                "email":"rayim@moneybrain.ai"
            },
            {
                "name":"손보경",
                "mobile":"01021244141",
                "email":"sbk@moneybrain.ai"
            }
        ];
        context.dialog.isvipornot=false;
        for(var i=0;i<userinfor.length;i++){
            if(userinfor[i].mobile===str){
                context.dialog.isvipornot=true;
                context.user.mobile=str;
                //console.log(userinfor[i].name+'==========================userinfor[i].name==');
                //console.log(context.user.name2+'=1=========================context.user.name2==');
                context.user.name2=userinfor[i].name;
                context.user.email2=userinfor[i].email;
                //console.log(context.user.name2+'=2=========================context.user.name2==');
                // //console.log("context.user.email2======="+context.user.email2);
                // console.log("context.user.name2======="+context.user.name2);
                // console.log("context.user.mobile======="+context.user.mobile);
            }
        }
        callback(task,context);
    },
    action: messages.sendSMSAuth
};

bot.setTask('mobileidentification', mobileidentification);

var identification = {
    typeCheck: function (text, type, task, context, callback) {
        var matched = false;
        if(text === context.dialog.smsAuth)
        { matched = true; callback(text, task, matched);}
        else{callback(text, task, matched);}
    }
};

bot.setType('identification', identification);


var bridegroomorbride = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            var str = context.dialog.inCurRaw;
            if (str.indexOf("신랑") >= 0) {
                context.dialog.brideornot = "신랑측"
            }
            else {
                context.dialog.brideornot = "신부측"
            }
            callback(task, context);
        }
        else {
            callback(task, context);
        }
    }
};

bot.setTask('bridegroomorbride', bridegroomorbride);

var saveshowtime = {
    action: function (task,context,callback) {
        //context.dialog.showtime=context.dialog.inCurRaw;
        callback(task,context);
    }
};

bot.setTask('saveshowtime', saveshowtime);

var savefriendname = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            context.dialog.friendname = context.dialog.inCurRaw;
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('savefriendname', savefriendname);

var savefriendmobile = {
    action: function (task,context,callback) {
        context.dialog.friendmobile=context.dialog.mobile;
        callback(task,context);
    }
};

bot.setTask('savefriendmobile', savefriendmobile);

var savefriendaddress = {
    action: function (task,context,callback) {
        //context.dialog.friendaddress=context.dialog.address;
        context.dialog.friendaddress=context.dialog.address.지번주소;
        callback(task,context);
    }
};

bot.setTask('savefriendaddress', savefriendaddress);

var savedeliverytime = {
    action: function (task,context,callback) {
        //context.dialog.deliverytime=context.dialog.inCurRaw;
        task.buttons=[
            {
                text: '생화일반배송',
                url: ""
            },
            {
                text: '생화택배',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('savedeliverytime', savedeliverytime);

var savedeliveryway = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택"  && context.dialog.inCurRaw!=="이전"  ) {
            context.dialog.deliveryway = context.dialog.inCurRaw;
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('savedeliveryway', savedeliveryway);

var savedecorate = {
    action: function (task,context,callback) {
        //console.log("==============context.dialog.inCurRaw=============="+context.dialog.inCurRaw);

        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전" ) {
            if(context.dialog.decorate===undefined) {
                //console.log("==============1==============");
                var str = context.dialog.inCurRaw;
                if (str.indexOf("카드") >= 0) {
                    context.dialog.decorate = "카드";
                    task.buttons = [
                        {
                            text: "참고문구",
                            url: ""
                        }
                    ];
                    callback(task, context);
                }
                else {
                    //console.log("==============2==============");
                    context.dialog.decorate = "리본";
                    task.buttons = [
                        {
                            text: "네",
                            url: ""
                        },
                        {
                            text: "익명",
                            url: ""
                        }
                    ];
                    callback(task, context);
                }
            }
            else{
                 str = context.dialog.inCurRaw;
                if (str.indexOf("리본") < 0) {
                    context.dialog.decorate = "카드";
                    //console.log("==============3==============");
                    task.buttons = [
                        {
                            text: "참고문구",
                            url: ""
                        }
                    ];
                    callback(task, context);
                }
                else {
                    context.dialog.decorate = "리본";
                    //console.log("==============4==============");
                    task.buttons = [
                        {
                            text: "네",
                            url: ""
                        },
                        {
                            text: "익명",
                            url: ""
                        }
                    ];
                    callback(task, context);
                }

            }
            callback(task, context);
        }
        else{callback(task, context);}
    }
};

bot.setTask('savedecorate', savedecorate);

var getgreeting = {
    action: function (task,context,callback) {
        ////console.log('context.dialog.decorate============'+context.dialog.decorate);
        if(context.dialog.decorate==="리본"){
            ////console.log('context.dialog.decorate1============'+context.dialog.decorate);
            greeting.find({"decorate":{"$ne":"카드"}}).lean().exec(function(err,docs){
                context.dialog.category =[];
                context.user.categorylist2=undefined;
                var str = [];
                for (var j = 0; j < docs.length; j++) {
                    if (str.indexOf(docs[j].category)<0) {
                        str.push(docs[j].category);
                    }
                }
                context.dialog.category = str;
                task.buttons = [];
                for(var i=0; i<context.dialog.category.length; i++){
                    var ss= ""+ (i+1) + ". " + context.dialog.category[i];
                    task.buttons.push({text: ss});
                }
                callback(task, context);

            })
        }
        else if(context.dialog.decorate==="카드"){
            greeting.find({"decorate":{"$ne":"리본"}}).lean().exec(function(err,docs){
                context.dialog.category =[];
                context.user.categorylist2=undefined;
                var str = [];
                for (var j = 0; j < docs.length; j++) {
                    if (str.indexOf(docs[j].category)<0) {
                        str.push(docs[j].category);
                    }
                }
                context.dialog.category = str;
                //console.log('context.dialog.category2============'+context.dialog.category);
                task.buttons = [];
                for(var i=0; i<context.dialog.category.length; i++){
                    var ss= ""+ (i+1) + ". " + context.dialog.category[i];
                    task.buttons.push({text: ss});
                }
                callback(task, context);
            })
        }
    }
};

bot.setTask('getgreeting', getgreeting);

var categorylist2 = {
    name: "category",
    listName: "category",
    typeCheck: "listTypeCheck"
};
bot.setType("categorylist2", categorylist2);


var savesendname = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="아니요" && context.dialog.inCurRaw!=="이전"  ) {
            if (context.dialog.inCurRaw.indexOf("익명") >= 0) {
                context.dialog.sendname = "익명";
            }
            else if (context.dialog.inCurRaw === "네") {
                if (context.user.username !== undefined) {
                    //console.log("===========================1======================");
                    //console.log("===========================context.user.username======================"+context.user.username);
                    context.dialog.sendname = context.user.username;
                }
                else {
                    //console.log("===========================2======================");
                    //console.log("===========================context.user.name2======================"+context.user.name2);
                    context.dialog.sendname = context.user.name2;
                }
            }
            else {
                //console.log("===========================3======================");
                //console.log("context.dialog.inCurRaw=========" + context.dialog.inCurRaw);
                context.dialog.sendname = context.dialog.inCurRaw;
            }
            task.buttons = [
                {
                    text: "참고문구",
                    url: ""
                }
            ];
            callback(task, context);
        }
        else{
            task.buttons = [
                {
                    text: "참고문구",
                    url: ""
                }
            ];
            callback(task, context);
        }
    }
};

bot.setTask('savesendname', savesendname);

var showgreeting = {
    action: function (task,context,callback) {
        context.dialog.greeting=[];
        context.user.categorylist3=undefined;
        if(context.dialog.categorylist2!==undefined){
            context.user.categorylist2=context.dialog.categorylist2;
        }
        if(context.dialog.decorate==="리본"){
            greeting.find({"category":context.user.categorylist2,"decorate":{"$ne":["카드","리본카드"]}}).lean().exec(function(err,docs){
                context.dialog.category1=docs;
                //console.log("context.dialog.category1:"+JSON.stringify(context.dialog.category1));
                var count = 0;
                var cc;
                for (cc in docs[0]) {
                    if (docs[0].hasOwnProperty(cc)) {
                        count++;
                    }
                }
                //console.log("count:"+count);
                count=count-3;
                var xx=[];
                var word="";
                for(var j=1;j<=count;j++) {
                    word = "word" + j;
                    xx.push(context.dialog.category1[0][word]);
                    //console.log("xx:"+xx);
                }
                context.dialog.greeting=xx;
                //console.log("context.dialog.greeting:"+context.dialog.greeting);

                task.buttons = [];
                for(var i=0; i<context.dialog.greeting.length; i++){
                    var ss= ""+ (i+1) + ". " + context.dialog.greeting[i];
                    task.buttons.push({text: ss});
                }
                callback(task,context);
            });
        }
        else if(context.dialog.decorate==="카드"){
            greeting.find({"category":context.user.categorylist2,"decorate":{"$ne":["리본","리본카드"]}}).lean().exec(function(err,docs){
                context.dialog.category1=docs;
                //console.log("context.dialog.category1:"+JSON.stringify(context.dialog.category1));
                var count = 0;
                var cc;
                for (cc in docs[0]) {
                    if (docs[0].hasOwnProperty(cc)) {
                        count++;
                    }
                }
                //console.log("count:"+count);
                count=count-3;
                var xx=[];
                var word="";
                for(var j=1;j<=count;j++) {
                    word = "word" + j;
                    xx.push(context.dialog.category1[0][word]);
                    //console.log("xx:"+xx);
                }
                context.dialog.greeting=xx;
                //console.log("context.dialog.greeting:"+context.dialog.greeting);

                task.buttons = [];
                for(var i=0; i<context.dialog.greeting.length; i++){
                    var ss= ""+ (i+1) + ". " + context.dialog.greeting[i];
                    task.buttons.push({text: ss});
                }
                callback(task,context);
            });
        }
    }
};

bot.setTask('showgreeting', showgreeting);

var categorylist3 = {
    name: "greeting",
    listName: "greeting",
    typeCheck: "listTypeCheck"
};
bot.setType("categorylist3", categorylist3);


var savebill = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            if (context.dialog.inCurRaw === "필요없음" || context.dialog.inCurRaw === "1") {
                context.dialog.bill = "필요없음";
            }
            else if (context.dialog.inCurRaw === "계산서 발행" || context.dialog.inCurRaw === "2") {
                context.dialog.bill = "계산서 발행";
            }
            else if (context.dialog.inCurRaw === "현금 영수증 발급" || context.dialog.inCurRaw === "3") {
                context.dialog.bill = "현금 영수증 발급";
            }
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('savebill', savebill);


var savegreeting = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전" ) {
            if (context.dialog.selectchange !== 1) {
                if (context.dialog.categorylist3 !== undefined) {
                    context.dialog.selectedgreeting = context.dialog.categorylist3;
                }
                else {
                    context.dialog.selectedgreeting = context.dialog.inCurRaw;
                }
                task.result = {
                    text: "기타 요청사항을 입력해주세요.\n\n※ 케익이 포함된경우 요청사항에 양초갯수를 적어주세요!"
                };
                callback(task, context);
            }
            else {
                if (context.dialog.categorylist3 !== undefined) {
                    context.dialog.selectedgreeting = context.dialog.categorylist3;
                }
                else {
                    context.dialog.selectedgreeting = context.dialog.inCurRaw;
                }
                task.result = {
                    text: "변경 되었습니다.",
                    buttons: [
                        {
                            text: '주문서 확인하기',
                            url: ""
                        }
                    ]
                };
                callback(task, context);
            }

            callback(task, context);
        }
        else{callback(task, context);}
    }
};

bot.setTask('savegreeting', savegreeting);


var savepayway = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전" ) {
            if (context.dialog.inCurRaw === "카드 결제하기" || context.dialog.inCurRaw === "1") {
                context.dialog.payway = "카드";
            }
            else if (context.dialog.inCurRaw === "무통장 입금하기" || context.dialog.inCurRaw === "2") {
                context.dialog.payway = "무통장";
            }
            else if (context.dialog.inCurRaw === "카카오페이" || context.dialog.inCurRaw === "3") {
                context.dialog.payway = "카카오페이";
            }
            callback(task, context);
        }
        else {
            callback(task, context);
        }
    }
};

bot.setTask('savepayway', savepayway);


var collectorderinfor = {
    action: function (task,context,callback) {
        //console.log("context.dialog.itemnumber:========="+context.dialog.itemnumber);
        //console.log("context.user.username:========="+context.user.username);

        context.dialog.orderinfor={};
        //주문일시
        var myDate = new Date();
        //var local=myDate.toLocaleString( );
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var day=myDate.getDate();
        var time=myDate.toLocaleTimeString();
        var time1=myDate.getHours();
        context.dialog.orderinfor.time=year+"년"+month+"월"+day+"일"+" "+time;
        context.dialog.orderinfor.date=year+"."+month+"."+day;
        context.dialog.orderinfor.hour='';
        context.dialog.orderinfor.hour=time1+":00";

        //고객성함,고객 휴대폰 번호,구매자 메일,상품금액:
        if(context.user.username!==undefined){
            context.dialog.orderinfor.name=context.user.username;
            context.dialog.orderinfor.mobile=context.user.usermobile;
            context.dialog.orderinfor.email=context.user.useremail;
            context.dialog.orderinfor.itemprice=context.dialog.selecteditem.price;
        }
        else {
            context.dialog.orderinfor.name = context.user.name2;
            context.dialog.orderinfor.mobile=context.user.mobile;
            context.dialog.orderinfor.email= context.user.email2;
            context.dialog.orderinfor.itemprice=context.dialog.selecteditem.sale_price;
        }
        //보내시는분 성함:
        if(context.dialog.decorate==="리본"){
            //console.log("===========================11======================");
            //console.log("===========================context.dialog.sendname======================"+context.dialog.sendname);
            context.dialog.orderinfor.sendername=context.dialog.sendname;}
        else{
            //console.log("===========================22======================");
            //console.log("===========================context.dialog.orderinfor.name======================"+context.dialog.orderinfor.name);
            context.dialog.orderinfor.sendername=context.dialog.orderinfor.name;
        }
        //받는분 성함:
        context.dialog.orderinfor.receivername=context.dialog.friendname;
        //받는분 연락처:
        context.dialog.orderinfor.receivermobile=context.dialog.friendmobile;
        //배달주소:
        context.dialog.orderinfor.receiveraddress=context.dialog.friendaddress;
        //배달일자:
        context.dialog.orderinfor.deliverytime=context.dialog.deliverytime;
        context.dialog.orderinfor.deliverydate=context.dialog.dateonly;
        context.dialog.orderinfor.deliveryhour=context.dialog.time;
        //남기시는 메세지:
        context.dialog.orderinfor.greeting=context.dialog.selectedgreeting;
        //상품명:
        context.dialog.orderinfor.itemname=context.dialog.selecteditem.name;
        //상품 이미지:
        context.dialog.orderinfor.itemimage=context.dialog.selecteditem.picture;
        //상품 코드:
        context.dialog.orderinfor.itemcode=context.dialog.selecteditem.code;
        //수량---------------------------------------
        if(context.dialog.itemnumber===undefined){
            context.dialog.orderinfor.itemnumber=1;}
        else{
            context.dialog.orderinfor.itemnumber=context.dialog.itemnumber;
        }
        //console.log("context.dialog.orderinfor.itemnumber:========="+context.dialog.orderinfor.itemnumber);
        //신부신랑:
        context.dialog.orderinfor.brideornot=context.dialog.brideornot;
        //신부신랑 전시 시간:
        context.dialog.orderinfor.showtime=context.dialog.showtime;
        //배송방식:
        context.dialog.orderinfor.deliveryway=context.dialog.deliveryway;
        //포장방식:
        context.dialog.orderinfor.decorateway=context.dialog.decorate;
        //계산서 필요할건지:
        context.dialog.orderinfor.bill=context.dialog.bill;
        //결제 방식:
        context.dialog.orderinfor.payway=context.dialog.payway;
        //총 금액
        var price=context.dialog.orderinfor.itemprice;
        var number=context.dialog.orderinfor.itemnumber;
        price=Number(price);
        number=Number(number);
        context.dialog.orderinfor.allprice=price*number;
        //console.log("price:========="+price);
        //console.log("number:========="+number);
        //console.log("context.dialog.orderinfor.allprice:========="+context.dialog.orderinfor.allprice);
        //다른 요구사항:
        context.dialog.orderinfor.otherrequire=context.dialog.otherrequire;

        //task.result={
        // text:"고객님의 주문내역입니다.\n\n이대로 주문신청을 할까요\n\n"+"【주문내역】\n\n-주문일시:\n"
        //  +context.dialog.orderinfor.time+"\n-고객성함: "
        //  +context.dialog.orderinfor.name+"\n-보내시는분 성함: "
        //  +context.dialog.orderinfor.sendername+"\n-고객 휴대폰 번호: "
        //  +context.dialog.orderinfor.mobile+"\n-받는분 성함: "
        //  +context.dialog.orderinfor.receivername+"\n-받는분 연락처: "
        //  +context.dialog.orderinfor.receivermobile+"\n-배달주소: "
        //  +context.dialog.orderinfor.receiveraddress+"\n-배달일자: "
        //  +context.dialog.orderinfor.deliverytime+"\n-남기시는 메세지: "
        //  +context.dialog.orderinfor.greeting+"\n-상품명: "
        //  +context.dialog.orderinfor.itemname+"\n-상품금액: "
        //  +context.dialog.orderinfor.itemprice+"원\n-수량: "
        //  +context.dialog.orderinfor.itemnumber+"\n\n총 "+
        // +context.dialog.orderinfor.allprice+"원"+"\n\n[상품 이미지]",
        task.image={url:context.dialog.orderinfor.itemimage};
        task.buttons= [
            {
                text: '이대로 주문하기',
                url: ""
            },
            {
                text: '변경하기',
                url: ""
            }
        ];
        //};
        //task.image={url:context.dialog.orderinfor.itemimage};
        callback(task,context);
    }
};


bot.setTask('collectorderinfor', collectorderinfor);


var addorder = {
    action: function (task,context,callback) {
        var neworder={
            order_time: context.dialog.orderinfor.time,
            order_date: context.dialog.orderinfor.date,
            order_hour: context.dialog.orderinfor.hour,
            order_name:context.dialog.orderinfor.name,
            order_mobile:context.dialog.orderinfor.mobile,
            order_price: context.dialog.orderinfor.itemprice,
            order_sendername: context.dialog.orderinfor.sendername,
            order_receivername:context.dialog.orderinfor.receivername,
            order_receivermobile:context.dialog.orderinfor.receivermobile,
            order_receiveraddress:context.dialog.orderinfor.receiveraddress,
            order_greeting:context.dialog.orderinfor.greeting,
            order_itemname:context.dialog.orderinfor.itemname,
            order_itemimage: context.dialog.orderinfor.itemimage,
            order_itemnumber:context.dialog.orderinfor.itemnumber,
            order_itemcode:context.dialog.orderinfor.itemcode,
            order_email:context.dialog.orderinfor.email,
            order_bride:context.dialog.orderinfor.brideornot,
            order_showtime:context.dialog.orderinfor.showtime,
            order_deliveryway:context.dialog.orderinfor.deliveryway,
            order_decorateway:context.dialog.orderinfor.decorateway,
            order_bill:context.dialog.orderinfor.bill,
            order_payway:context.dialog.orderinfor.payway,
            order_allprice:context.dialog.orderinfor.allprice,
            order_deliverytime:context.dialog.orderinfor.deliverytime,
            order_deliverydate:context.dialog.orderinfor.deliverydate,
            order_deliveryhour:context.dialog.orderinfor.deliveryhour,
            order_otherrequire:context.dialog.orderinfor.otherrequire,
            order_status:"승인 대기중",
            botId:context.bot.id,
            __v:0
        };
        order.collection.insert(neworder,function(err,docs){

            //보내시는분 성함:
            context.dialog.sendname=undefined;
            //받는분 성함:
            context.dialog.friendname=undefined;
            //받는분 연락처:
            context.dialog.friendmobile=undefined;
            //배달주소:
            context.dialog.friendaddress=undefined;
            //배달일자:
            context.dialog.deliverytime=undefined;
            //남기시는 메세지:
            context.dialog.selectedgreeting=undefined;
            //상품:
            context.dialog.selecteditem=undefined;
            //수량---------------------------------------
            context.dialog.itemnumber=undefined;
            //신부신랑:
            context.dialog.brideornot=undefined;
            //신부신랑 전시 시간:
            context.dialog.showtime=undefined;
            //배송방식:
            context.dialog.deliveryway=undefined;
            //포장방식:
            context.dialog.decorate=undefined;
            //계산서 필요할건지:
            context.dialog.bill=undefined;
            //결제 방식:
            context.dialog.payway=undefined;
            //변경:
            context.dialog.selectchange=undefined;
            //다른 요구사항
            context.dialog.otherrequire=undefined;
            context.user.username=undefined;
            context.user.useremail=undefined;
            context.user.usermobile=undefined;
            //매세지:


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
                            context.dialog.orderinfor.itemname + "/" + context.dialog.orderinfor.itemnumber + '개/'+ '총 ' + context.dialog.orderinfor.allprice + '원\n' +
                            "-수취인: ["+context.dialog.orderinfor.receivername+" "+context.dialog.orderinfor.receivermobile+"]";


                        // var message = '[플레이챗-'+context.dialog.orderinfor.name+'고객님]'+
                        //     '주문일시: '+context.dialog.orderinfor.time +'주문 고객명: ' + context.dialog.orderinfor.name + '보내시는분 성함:' + context.dialog.orderinfor.sendername+
                        //     '주문 전화번호: '+context.dialog.orderinfor.mobile + '받는분 성함: '+context.dialog.orderinfor.receivername + '수취인 전화번호: ' + context.dialog.orderinfor.receivermobile+
                        //     '배달주소: ' + context.dialog.orderinfor.receiveraddress + '배달일자: ' + context.dialog.orderinfor.deliverytime +
                        //     '남기시는 메세지: '+context.dialog.orderinfor.greeting+'상품: ' + context.dialog.orderinfor.itemname + '수량: '+ context.dialog.orderinfor.itemnumber +'개'+'총: '+context.dialog.orderinfor.allprice + '원'+
                        //     '신부신랑: '+context.dialog.orderinfor.brideornot+'신부신랑 전시 시간: '+context.dialog.orderinfor.showtime+'다른 요구사항: '+context.dialog.orderinfor.otherrequire+'결제 방식: '+context.dialog.orderinfor.payway+
                        //     '계산서 필요할건지: '+context.dialog.orderinfor.bill+'배송방식: '+context.dialog.orderinfor.deliveryway+'카드/리본: '+context.dialog.orderinfor.decorateway;// html body
                        //

                        //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //'예약접수(클릭) ' + shorturl;

                        if(context.dialog.orderinfor.mobile!=="01066389310"){
                            context.dialog.orderinfor.mobile="01042369555";
                        }
                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'zsslovelyg@gmail.com',
                                pass: 'ZSdh1007--'
                            }
                        });
                        if(context.dialog.orderinfor.email!=="zsslovelyg@moneybrain.ai"){
                            context.dialog.orderinfor.email="jipark@moneybrain.ai";
                        }
                        var mailOptions = {
                            from: 'moneybrain', // sender address
                            to: context.dialog.orderinfor.email, // list of receivers
                            subject: "***주문소식***", // Subject line
                            html: '<b>[플레이챗-</b>'+context.dialog.orderinfor.name+'<b>고객님]</b>'+'<br>'+
                            '<br>'+'<b>주문일시: </b>'+context.dialog.orderinfor.time +'<br>'+'<b>주문 고객명: </b>' + context.dialog.orderinfor.name +'<br>'+ '<b>보내시는분 성함:</b>' + context.dialog.orderinfor.sendername+
                            '<br>'+'<b>주문 전화번호: </b>'+context.dialog.orderinfor.mobile +'<br>'+ '<b>받는분 성함: </b>'+context.dialog.orderinfor.receivername + '<br>'+'<b>수취인 전화번호: </b>' + context.dialog.orderinfor.receivermobile+
                            '<br>'+'<b>배달주소: </b>' + context.dialog.orderinfor.receiveraddress + '<br>'+'<b>배달일자: </b>' + context.dialog.orderinfor.deliverytime +
                            '<br>'+'<b>남기시는 메세지: </b>'+context.dialog.orderinfor.greeting+'<br>'+'<b>상품: </b>' + context.dialog.orderinfor.itemname + '<br>'+'<b>수량: </b>'+ context.dialog.orderinfor.itemnumber +'<b>개</b>'+'<br>'+'<b>총: </b>'+context.dialog.orderinfor.allprice + '<b>원</b>'+
                            '<br>'+'<b>신부신랑: </b>'+context.dialog.orderinfor.brideornot+'<br>'+'<b>신부신랑 전시 시간: </b>'+context.dialog.orderinfor.showtime+'<br>'+'<b>다른 요구사항: </b>'+context.dialog.orderinfor.otherrequire+'<br>'+'<b>결제 방식: </b>'+context.dialog.orderinfor.payway+
                            '<br>'+'<b>계산서 필요할건지: </b>'+context.dialog.orderinfor.bill+'<br>'+'<b>배송방식: </b>'+context.dialog.orderinfor.deliveryway+'<br>'+'<b>카드/리본: </b>'+context.dialog.orderinfor.decorateway// html body
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                console.log(error);
                            }else{
                                console.log('Message sent: ' + info.response);
                            }
                        });

                        request.post(
                            'https://bot.moneybrain.ai/api/messages/sms/send',
                            {
                                json: {
                                    // callbackPhone: context.bot.phone,
                                    callbackPhone: "028585683",
                                    phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                                    message: message
                                }
                            },
                            function (error, response, body) {
                                console.log("error:", error);
                                callback(task, context);
                            }
                        );
                        //================================================================================


                        //  //--------------------------------------------------------------------------
                        //  var message = '[플레이챗-'+context.dialog.orderinfor.name+'1]' + '\n' +
                        //      "주문일시:"+context.dialog.orderinfor.time + "\n고객명:" + context.dialog.orderinfor.name + '\n발송인:' + context.dialog.orderinfor.sendername;
                        //  //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //  //'예약접수(클릭) ' + shorturl;
                        //  if(context.dialog.orderinfor.mobile!=="01066389310"){
                        //      context.dialog.orderinfor.mobile="01042369555";
                        //  }
                        //  request.post(
                        //      'https://bot.moneybrain.ai/api/messages/sms/send',
                        //      {
                        //          json: {
                        //              // callbackPhone: context.bot.phone,
                        //              callbackPhone: "028585683",
                        //              phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                        //              message: message
                        //          }
                        //      },
                        //      function (error, response, body) {
                        //          console.log("error:", error);
                        //          callback(task, context);
                        //      }
                        //  );
                        // //----------------------------------------------------------------------------
                        //
                        //  var message = '['+context.dialog.orderinfor.name+'2]' + '\n' +
                        //      '주문 전화번호:'+context.dialog.orderinfor.mobile + "수취인:"+context.dialog.orderinfor.receivername + "\n수취인 전화번호:" + context.dialog.orderinfor.receivermobile;
                        //  //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //  //'예약접수(클릭) ' + shorturl;
                        //  if(context.dialog.orderinfor.mobile!=="01066389310"){
                        //      context.dialog.orderinfor.mobile="01042369555";
                        //  }
                        //  request.post(
                        //      'https://bot.moneybrain.ai/api/messages/sms/send',
                        //      {
                        //          json: {
                        //              // callbackPhone: context.bot.phone,
                        //              callbackPhone: "028585683",
                        //              phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                        //              message: message
                        //          }
                        //      },
                        //      function (error, response, body) {
                        //          console.log("error:", error);
                        //          callback(task, context);
                        //      }
                        //  );
                        //
                        //  //----------------------------------------------------------------------------
                        //  var message = '['+context.dialog.orderinfor.name+'3]' + '\n' +
                        //       "배달주소:"+ context.dialog.orderinfor.receiveraddress + '\n배달일자:' +context.dialog.orderinfor.deliverytime;
                        //
                        //  //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //  //'예약접수(클릭) ' + shorturl;
                        //  if(context.dialog.orderinfor.mobile!=="01066389310"){
                        //      context.dialog.orderinfor.mobile="01042369555";
                        //  }
                        //  request.post(
                        //      'https://bot.moneybrain.ai/api/messages/sms/send',
                        //      {
                        //          json: {
                        //              // callbackPhone: context.bot.phone,
                        //              callbackPhone: "028585683",
                        //              phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                        //              message: message
                        //          }
                        //      },
                        //      function (error, response, body) {
                        //          console.log("error:", error);
                        //          callback(task, context);
                        //      }
                        //  );
                        //  //--------------------------------------------------------------------------
                        //  //----------------------------------------------------------------------------
                        //  var message = '['+context.dialog.orderinfor.name+'4]' + '\n' +
                        //      "남긴 메세지:"+context.dialog.orderinfor.greeting;
                        //
                        //  //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //  //'예약접수(클릭) ' + shorturl;
                        //  if(context.dialog.orderinfor.mobile!=="01066389310"){
                        //      context.dialog.orderinfor.mobile="01042369555";
                        //  }
                        //  request.post(
                        //      'https://bot.moneybrain.ai/api/messages/sms/send',
                        //      {
                        //          json: {
                        //              // callbackPhone: context.bot.phone,
                        //              callbackPhone: "028585683",
                        //              phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                        //              message: message
                        //          }
                        //      },
                        //      function (error, response, body) {
                        //          console.log("error:", error);
                        //          callback(task, context);
                        //      }
                        //  );
                        //  //--------------------------------------------------------------------------
                        //  //----------------------------------------------------------------------------
                        //  var message = '['+context.dialog.orderinfor.name+'5]' + '\n' +
                        //      "남긴 메세지:"+context.dialog.orderinfor.greeting + "\n/" + context.dialog.orderinfor.itemname + "/총:"+ context.dialog.orderinfor.itemnumber + '개/'+context.dialog.orderinfor.allprice + '원';
                        //
                        //  //message += '\n-' + context.dialog.orderinfor.name + ' '+'주문';
                        //  //'예약접수(클릭) ' + shorturl;
                        //  if(context.dialog.orderinfor.mobile!=="01066389310"){
                        //      context.dialog.orderinfor.mobile="01042369555";
                        //  }
                        //  request.post(
                        //      'https://bot.moneybrain.ai/api/messages/sms/send',
                        //      {
                        //          json: {
                        //              // callbackPhone: context.bot.phone,
                        //              callbackPhone: "028585683",
                        //              phone: context.dialog.orderinfor.mobile.replace(/,/g, ''),
                        //              message: message
                        //          }
                        //      },
                        //      function (error, response, body) {
                        //          console.log("error:", error);
                        //          callback(task, context);
                        //      }
                        //  );
                        //  //--------------------------------------------------------------------------

                    } else {
                        callback(task, context);
                    }
                });
            } else {
                callback(task, context);
            }
            callback(task,context);
        });
    }
};

bot.setTask('addorder', addorder);


var nobride = {
    action: function (task,context,callback) {
        if(context.dialog.showtime===undefined) {
            context.dialog.brideornot = "없음";
            context.dialog.showtime = "없음";
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('nobride', nobride);


var selectchange = {
    action: function (task,context,callback) {
        context.dialog.selectchange=1;
        // task.result={text:"다음중 변경하고 싶으신 부분을 선택해주세요.\n\n[주문내역]\n-주문일시:\n"
        // +context.dialog.orderinfor.time+"\n-고객성함: "
        // +context.dialog.orderinfor.name+"\n-보내시는분 성함: "
        // +context.dialog.orderinfor.sendername+"\n-고객 휴대폰 번호: "
        // +context.dialog.orderinfor.mobile+"\n-받는분 성함: "
        // +context.dialog.orderinfor.receivername+"\n-받는분 연락처: "
        // +context.dialog.orderinfor.receivermobile+"\n-배달주소: "
        // +context.dialog.orderinfor.receiveraddress+"\n-배달일자: "
        // +context.dialog.orderinfor.deliverytime+"\n-남기시는 메세지: "
        // +context.dialog.orderinfor.greeting+"\n-상품명: "
        // +context.dialog.orderinfor.itemname+"\n-상품금액: "
        // +context.dialog.orderinfor.itemprice+"원\n-수량: "
        // +context.dialog.orderinfor.itemnumber+"\n\n총 "
        // +context.dialog.orderinfor.allprice+"원",
        task.buttons=[
            {
                text: '받는 분 성함',
                url: ""
            },
            {
                text: '받는 분 연락처',
                url: ""
            },
            {
                text: '배달주소',
                url: ""
            },
            {
                text: '배달일자',
                url: ""
            },
            {
                text: '남기시는 메세지',
                url: ""
            },
            {
                text: '상품 변경',
                url: ""
            },
            {
                text: '상품수량 변경',
                url: ""
            }
        ];
        // };
        callback(task,context);
    }
};

bot.setTask('selectchange', selectchange);



var deletegreeting = {
    action: function (task,context,callback) {
        context.dialog.categorylist3=undefined;
        task.buttons=[
            {
                text: '참고문구',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('deletegreeting', deletegreeting);


var saveitemnumber = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            context.dialog.itemnumber = context.dialog.inCurRaw;
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('saveitemnumber', saveitemnumber);


var saveotherrequire = {
    action: function (task,context,callback) {
        if(context.dialog.inCurRaw!=="다시 입력" && context.dialog.inCurRaw!=="다시 확인" && context.dialog.inCurRaw!=="다시 선택" && context.dialog.inCurRaw!=="이전"  ) {
            context.dialog.otherrequire = context.dialog.inCurRaw;
            callback(task, context);
        }
        else{
            callback(task, context);
        }
    }
};

bot.setTask('saveotherrequire', saveotherrequire);


var showorder = {
    action: function (task,context,callback) {
        order.find({botId:context.bot.id,order_mobile:context.user.mobile,order_status:"승인 대기중"}).lean().exec(function(err,docs){
            context.dialog.orderlist=docs;
            //task.doc={text:"완료된 고객님의 지난 주문내역입니다.\n\n지난 주문내역과 동일한 상품으로 주문을 원하시면 해당 주문내역의 번호를 입력하세요.\n\n"};

            task.buttons = [];
            for(var i=0; i<context.dialog.orderlist.length; i++){
                var ss= ""+ (i+1) + ". " + context.dialog.orderlist[i].order_itemname+" "+context.dialog.orderlist[i].order_deliverytime+" "+context.dialog.orderlist[i].order_receivername;
                task.buttons.push({text: ss});
            }
            callback(task,context);
        });
    }
};

bot.setTask('showorder', showorder);

var orderlist = {
    name: "orderlist",
    listName: "orderlist",
    typeCheck: "listTypeCheck"
};
bot.setType("orderlist", orderlist);


var showorder1 = {
    action: function (task,context,callback) {
        // task.result={text:"주문접수중인 상품의 주문내역입니다.\n\n주문확정은 고객님의 휴대폰으로 SMS를 통해 안내해드리겠습니다.\n\n처음으로 가려면 \"시작\"이라고 입력해주세요.\n\n-주문일시:\n"
        // +context.dialog.orderlist.order_time+"\n-고객성함: "
        // +context.dialog.orderlist.order_name+"\n-보내시는분 성함: "
        // +context.dialog.orderlist.order_sendername+"\n-고객 휴대폰 번호: "
        // +context.dialog.orderlist.order_mobile+"\n-받는분 성함: "
        // +context.dialog.orderlist.order_receivername+"\n-받는분 연락처: "
        // +context.dialog.orderlist.order_receivermobile+"\n-배달주소: "
        // +context.dialog.orderlist.order_receiveraddress+"\n-배달일자: "
        // +context.dialog.orderlist.order_deliverytime+"\n-남기시는 메세지: "
        // +context.dialog.orderlist.order_greeting+"\n-상품명: "
        // +context.dialog.orderlist.order_itemname+"\n-상품금액: "
        // +context.dialog.orderlist.order_price+"원\n-수량: "
        // +context.dialog.orderlist.order_itemnumber+"\n\n총 "
        // +context.dialog.orderlist.order_allprice+"원"+"\n\n[상품 이미지]",
        task.image={url:context.dialog.orderlist.order_image};
        task.buttons= [
            {
                text: "시작",
                url: ""
            }
        ];
        //};
        context.dialog.findorder=undefined;
        callback(task,context);
    }
};

bot.setTask('showorder1', showorder1);


var recordorder = {
    action: function (task,context,callback) {
        context.dialog.findorder=1;
        callback(task,context);
    }
};

bot.setTask('recordorder', recordorder);


var addvip = {
    action: function (task,context,callback) {
        task.buttons=[
            {
                text: '회원가입하기',
                url: 'http://flowermania.co.kr/cgi-bin/member/registration.php'
            },
            {
                text: '시작',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('addvip', addvip);


var sendidentification = {
    preCallback: function(task, context, callback) {
        if (task.mobile === undefined) task.mobile = context.dialog.mobile;
        callback(task, context);
    },
    action: messages.sendSMSAuth
};

bot.setTask('sendidentification', sendidentification);


var addbuttons = {
    action: function (task,context,callback) {
        task.buttons=[
            {
                text: '시작',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('addbuttons', addbuttons);


var startbuttons = {
    action: function (task,context,callback) {
        task.image={url:'http://pic1.wed114.cn/allimg/120910/15454935M-0.jpg'};
        task.buttons=[
            {
                text: '1.자주하는 질문',
                url: ""
            },
            {
                text: '2.상품주문하기',
                url: ""
            },
            {
                text: '3.문의하기',
                url: ""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('startbuttons', startbuttons);


var neworder = {
    action: function (task,context,callback) {
        context.dialog.sendname=undefined;
        //받는분 성함:
        context.dialog.friendname=undefined;
        //받는분 연락처:
        context.dialog.friendmobile=undefined;
        //배달주소:
        context.dialog.friendaddress=undefined;
        //배달일자:
        context.dialog.deliverytime=undefined;
        //남기시는 메세지:
        context.dialog.selectedgreeting=undefined;
        //상품:
        //context.dialog.selecteditem=undefined;
        //수량---------------------------------------
        context.dialog.itemnumber=undefined;
        //신부신랑:
        context.dialog.brideornot=undefined;
        //신부신랑 전시 시간:
        context.dialog.showtime=undefined;
        //배송방식:
        context.dialog.deliveryway=undefined;
        //포장방식:
        context.dialog.decorate=undefined;
        //계산서 필요할건지:
        context.dialog.bill=undefined;
        //결제 방식:
        context.dialog.payway=undefined;
        //변경:
        context.dialog.selectchange=undefined;
        //다른 요구사항
        context.dialog.otherrequire=undefined;
        context.user.username=undefined;
        context.user.useremail=undefined;
        context.user.usermobile=undefined;
        callback(task,context);
    }
};

bot.setTask('neworder', neworder);


var allname = {
    action: function (task,context,callback) {
        category.find({}).lean().exec(function(err,docs){
            context.dialog.allname=[];
            for(i=0;i<docs.length;i++){
                context.dialog.allname.push(docs[i].name);
            }
            callback(task,context);
        });
    }
};

bot.setTask('allname', allname);

var allnamelist = {
    name: "allname",
    listName: "allname",
    typeCheck: "listTypeCheck"
};
bot.setType("allnamelist", allnamelist);


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

function timeTypeCheck1(text, type, task, context, callback) {
    var name = 'time';
    var re = /(오전|오후|새벽|아침|낮|저녁|밤|am|pm|a.m|p.m)?\s*(\d{1,2})\s*(?:시|:)\s*(?:(\d{1,2}|반)\s*분?)?/g;
    var matched = false;

    //console.log("re============1"+JSON.stringify(re));
    // console.log("re============2"+re);

    text = text.replace(re, function(match, g1, g2, g3){
        var time;
        // var timeform = ':00';

        var matchTime = function (_name, _task, _time) {
            if (_task[_name]) {
                if (Array.isArray(_task[_name])) _task[_name].push(_time);
                else _task[_name] = [_task[_name], _time];
            } else {
                _task[_name] = _time;
            }
        };

        var hour = parseInt(g2);
        var min = parseInt(g3) || g3 || 0;
        if (min == '반') min = 30;

        var am = (g1 == '오전' || g1 == '새벽' || g1 == '아침' || g1 == 'am' || g1 == 'a.m');
        var pm = (g1 == '오후' || g1 == '낮' || g1 == '저녁' || g1 == '밤' || g1 == 'pm' || g1 == 'p.m');

        if (hour < 23 && min < 60) {
            if (hour > 12) {
                time = hour.toString() + ':' + min;
            } else if (am) {
                if (hour == 12) hour = 0;
                time = hour.toString() + ':' + min;
            } else if (pm) {
                if (hour == 12) hour = 0;
                time = (hour + 12) + ':' + min;
            } else time = 're';
        } else {
            time = 'out';
        }

        time = time.replace(/(.*):(.*)/, function (match, g1, g2) {
            if (g1.length == 1) g1 = '0' + g1;
            if (g2.length == 1) g2 = '0' + g2;
            return g1 + ":" + g2;
        });
        // console.log(time+"===================99");
        context.dialog.time = time;
        if(time === 're' || time === 'out'){
            matched=false;
        }
        else
        {matched=true;}
        //console.log("context.dialog.time========"+context.dialog.time);
    });
    callback(text, task, matched);
}

var addbuttons1 = {
    action: function (task,context,callback) {
        task.buttons=[
            {
                text:"재발송",
                url:""
            },
            {
                text:"시작",
                url:""
            }
        ];
        callback(task,context);
    }
};

bot.setTask('addbuttons1', addbuttons1);

var dateAndtime = {
    typeCheck: function (text, type, task, context, callback) {
        var matched=false;
        // 判断年、月、日的取值范围是否正确
        // 先判断格式上是否正确
        var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
        if (!regDate.test(text))
        {
            matched=false;
            callback(text, task, matched);

        }
        else{
            // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
            var arr = regDate.exec(text);
            // 判断年、月、日的取值范围是否正确
            matched=IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
            if(matched){
                context.dialog.dateonly1=arr[1]+"년"+arr[2]+"월"+arr[3]+"일";
                context.dialog.dateonly=arr[1]+"."+arr[2]+"."+arr[3];
                //time格式判断
                //var strr=context.dialog.inRaw;
                var strr=context.dialog.inCurRaw;
                var textt=strr.split(" ");
                // console.log("textt=========="+textt[0]+"===="+textt[1]+"========"+textt[2]+"====="+textt[3]);
                if(textt[1]===undefined){
                    var textt3=strr.substring(8);
                    // console.log("textt3==========" + textt3);
                    timeTypeCheck1(textt3, type, task, context, callback);
                    context.dialog.showtime=context.dialog.dateonly1+" "+context.dialog.time;
                    //console.log("context.dialog.showtime===1=======" + context.dialog.showtime);
                    if(context.dialog.time=='re'){
                        matched=false;
                        callback(task, context, matched);
                    }
                    callback(task, context, matched);
                }
                else {
                    if (textt[2] === undefined) {
                        //  console.log("textt[1]==========" + textt[1]);
                        timeTypeCheck1(textt[1], type, task, context, callback);
                        context.dialog.showtime=context.dialog.dateonly1+" "+context.dialog.time;
                        if(context.dialog.time=='re'){
                            matched=false;
                            callback(task, context, matched);
                        }
                        callback(task, context, matched);
                    }
                    else {
                        var textt2 = textt[1] + textt[2];
                        timeTypeCheck1(textt2, type, task, context, callback);
                        context.dialog.showtime=context.dialog.dateonly1+" "+context.dialog.time;
                        if(context.dialog.time=='re'){
                            matched=false;
                            callback(task, context, matched);
                        }
                        callback(task, context, matched);
                    }
                }
            }
            else{
                context.dialog.weddingdate=undefined;
                callback(task, context, matched);
            }
        }
    }
};

bot.setType('dateAndtime', dateAndtime);


var dateAndtime1 = {
    typeCheck: function (text, type, task, context, callback) {
        var matched=false;
        // 判断年、月、日的取值范围是否正确
        // 先判断格式上是否正确
        var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
        if (!regDate.test(text))
        {
            matched=false;
            callback(text, task, matched);

        }
        else{
            // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
            var arr = regDate.exec(text);
            // 判断年、月、日的取值范围是否正确
            matched=IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
            if(matched){
                context.dialog.dateonly1=arr[1]+"년"+arr[2]+"월"+arr[3]+"일";
                context.dialog.dateonly=arr[1]+"."+arr[2]+"."+arr[3];
                //time格式判断
                //var strr=context.dialog.inRaw;
                var strr=context.dialog.inCurRaw;
                var textt=strr.split(" ");
                // console.log("textt=========="+textt[0]+"===="+textt[1]+"========"+textt[2]+"====="+textt[3]);
                if(textt[1]===undefined){
                    var textt3=strr.substring(8);
                    // console.log("textt3==========" + textt3);
                    timeTypeCheck1(textt3, type, task, context, callback);
                    context.dialog.deliverytime=context.dialog.dateonly1+" "+context.dialog.time;
                    if(context.dialog.time=='re'){
                        matched=false;
                        callback(task, context, matched);
                    }
                    callback(task, context, matched);
                }
                else {
                    if (textt[2] === undefined) {
                        timeTypeCheck1(textt[1], type, task, context, callback);
                        context.dialog.deliverytime=context.dialog.dateonly1+" "+context.dialog.time;
                        if(context.dialog.time=='re'){
                            matched=false;
                            callback(task, context, matched);
                        }
                        callback(task, context, matched);
                    }
                    else {
                        var textt2 = textt[1] + textt[2];
                        timeTypeCheck1(textt2, type, task, context, callback);
                        context.dialog.deliverytime=context.dialog.dateonly1+" "+context.dialog.time;
                        if(context.dialog.time=='re'){
                            matched=false;
                            callback(task, context, matched);
                        }
                        callback(task, context, matched);
                    }
                }
            }
            else{
                context.dialog.weddingdate=undefined;
                callback(task, context, matched);
            }
        }
    }
};

bot.setType('dateAndtime1', dateAndtime1);

};



