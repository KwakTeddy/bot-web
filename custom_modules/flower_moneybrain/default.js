var path = require('path');
var config = require(path.resolve('./config/config'));
var nodemailer = require('nodemailer');
var request = require('request');

var SERVER_HOST = 'http://template-dev.moneybrain.ai:8443';

module.exports = function (bot) {
    bot.setTask('defaultTask',
        {
            action: function (dialog, context, callback) {
                var modelname = 'flower_test';
                var options = {};

                options.url = SERVER_HOST + '/api/' + modelname;

                options.json =
                    {
                        botId: '123',
                        name: 'shuang',
                        age: '25',
                        sex: 'female'
                    };
                //read: request.get
                //create: request.post
                //update: request.put
                //delete: request.delete
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(response.statusCode);
                        console.log(body);
                    }
                    callback();
                });
            }
        });

    bot.setTask("getcategory",
        {
            action: function (dialog, context, callback) {

                // context.user.mobile=undefined;
                var modelname = 'flower_moneybrain_category';
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {};
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.categorylist = undefined;
                        var str = [];
                        for (var j = 0; j < body.length; j++) {
                            if (str.indexOf(body[j].category) < 0) {
                                str.push(body[j].category);
                            }
                        }
                        context.session.category = str;

                        dialog.output[0].buttons = [];
                        for (var i = 0; i < context.session.category.length; i++) {
                            var ss = "" + (i + 1) + ". " + context.session.category[i];
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push({text: "이전으로 가기"},
                            {
                                text: "처음으로 돌아가기"
                            });
                        dialog.output[0].image={url: body[0].category대};

                        callback();
                    }
                    callback();
                });
            }
        });

    bot.setType("categorylist", {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            if (text[1] !== undefined) {
                text[1] = text[1].trim();

                for (var i = 0; i < context.session.category.length; i++) {
                    if (context.session.category[i].indexOf(text[1]) !== -1) {
                        return callback(true, context.session.category[i]);
                    }
                }
            }
            else if(dialog.userInput.text){
                for (var j = 0; j < context.session.category.length; j++) {
                    var ss=j+1;
                    if (ss==dialog.userInput.text) {
                        return callback(true, context.session.category[j]);
                    }
                }
            }
            callback(false);
        }
    });


    bot.setTask('showcategory', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_category";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                category: dialog.userInput.types.categorylist
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.itemcategory = [];
                    context.session.itemcategory = body;

                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.itemcategory.length; i++) {
                        var ss = "" + (i + 1) + ". " + context.session.itemcategory[i].name;
                        dialog.output[0].buttons.push({text: ss});
                    }
                    dialog.output[0].buttons.push({text: "이전으로 가기"},
                        {
                            text: "처음으로 돌아가기"
                        });
                    callback();
                }
            });
        }
    });


    bot.setType('itemlist', {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            if (text[1] !== undefined) {
                text[1] = text[1].trim();
                for (var i = 0; i < context.session.itemcategory.length; i++) {
                    var namecode = context.session.itemcategory[i].name;
                    if (namecode.indexOf(text[1]) !== -1) {
                        dialog.userInput.types.itemlist = context.session.itemcategory[i];
                        return callback(true);
                    }
                }
            }
            else if(dialog.userInput.text){
                for (var j = 0; j <context.session.itemcategory.length; j++) {
                    var ss=j+1;
                    if (ss==dialog.userInput.text) {
                        dialog.userInput.types.itemlist = context.session.itemcategory[j];
                        return callback(true);
                    }
                }
            }
            callback(false);
        }
    });


    bot.setTask('showitem', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_category";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                _id: dialog.userInput.types.itemlist._id
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.item = body;
                    var outputcount = 0;

                    context.session.selecteditem = {};
                    context.session.selecteditem = context.session.item[0];

                    context.session.selecteditem.sale_price = context.session.item[0].sale_price;
                    if (context.session.selectchange !== 1) {
                        if (context.session.item[0].picture !== undefined) {
                            dialog.output[outputcount].image = {url: context.session.item[0].picture};
                            dialog.output[outputcount].buttons = [
                                {
                                    text: '주문하기',
                                    url: context.session.item[0].inforpay
                                },
                                    {
                                        text: '이전으로 가기',
                                        url: ""
                                    },
                                    {
                                        text: '처음으로 돌아가기',
                                        url: ""
                                    }
                            ];
                            // dialog.output[outputcount].buttons = [
                            //     {
                            //         text: '자세히보기',
                            //         url: context.session.item[0].picture.startsWith('http') ? context.session.item[0].picture : config.host + context.session.item[0].picture
                            //     },
                            //     {
                            //         text: '이 상품으로 주문하기',
                            //         url: ""
                            //     },
                            //     {
                            //         text: '다른 상품 더보기',
                            //         url: ""
                            //     },
                            //     {text: "이전으로 가기"},
                            //     {
                            //         text: "처음으로 돌아가기"
                            //     }
                            // ];
                        }
                    }
                    else {
                        if (context.session.item[0].picture !== undefined) {
                            dialog.output[outputcount].image = {url: context.session.item[0].picture};
                            dialog.output[outputcount].buttons = [
                                {
                                    text: '주문서 확인하기',
                                    url: ""
                                },
                                {text: "이전으로 가기"},
                                {
                                    text: "처음으로 돌아가기"
                                }
                            ];
                        }
                    }
                    callback();
                }
            });
        }
    });


    bot.setTask('getFAQcategory', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_faq";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {};
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    var str = [];
                    for (var j = 0; j < body.length; j++) {
                        if (str.indexOf(body[j].category) < 0) {
                            str.push(body[j].category);
                        }
                    }
                    context.session.faqcategory = str;

                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.faqcategory.length; i++) {
                        var ss = "" + (i + 1) + ". " + context.session.faqcategory[i];
                        dialog.output[0].buttons.push({text: ss});
                    }
                    dialog.output[0].buttons.push({text: "이전으로 가기"},
                        {
                            text: "처음으로 돌아가기"
                        });
                    callback();
                }
                callback();
            });
        }
    });

    bot.setType("faqcategorylist", {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            if (text[1] !== undefined) {
                text[1] = text[1].trim();

                for (var i = 0; i < context.session.faqcategory.length; i++) {
                    if (context.session.faqcategory[i].indexOf(text[1]) !== -1) {
                        return callback(true, context.session.faqcategory[i]);
                    }
                }
            }
            callback(false);
        }
    });


    bot.setTask('showfaqlist', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_faq";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                category: dialog.userInput.types.faqcategorylist
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.faqitemcategory = [];
                    context.session.faqitemcategory = body;

                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.faqitemcategory.length; i++) {
                        var ss = "" + (i + 1) + ". " + context.session.faqitemcategory[i].question;
                        dialog.output[0].buttons.push({text: ss});
                    }
                    dialog.output[0].buttons.push({text: "이전으로 가기"},
                        {
                            text: "처음으로 돌아가기"
                        });

                    callback();
                }
            });
        }
    });

    bot.setType('faqitemlist', {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            if (text[1] !== undefined) {
                text[1] = text[1].trim();

                for (var i = 0; i < context.session.faqitemcategory.length; i++) {
                    if (context.session.faqitemcategory[i].question.indexOf(text[1]) !== -1) {
                        return callback(true, context.session.faqitemcategory[i]);
                    }
                }
            }
            callback(false);
        }
    });


    bot.setTask('showfaq', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_faq";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                _id: dialog.userInput.types.faqitemlist._id
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.faqitem = body;
                    dialog.output[0].buttons = [
                        {
                            text: '시작',
                            url: ""
                        },
                        {
                            text: '이전으로 가기'
                        }
                    ];
                }
                callback();
            });
        }
    });


    //
    // bot.setTask('newuser',{
    //     action: function (dialog, context, callback) {
    //         dialog.output[0].buttons = [
    //             {
    //                 text: '휴대폰번호로 회원인증하기',
    //                 url: ""
    //             }
    //         ];
    //         callback();
    //     }
    // });


    bot.setTask('savename', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.user.name = "";
                context.user.name = dialog.userInput.text;


                var newuser = {
                    name: context.user.name,
                    mobile: context.user.mobile,
                    // email: context.user.email,
                    botId: bot.id,
                    createTime: new Date().toLocaleString(),
                    updateTime: new Date().toLocaleString()
                };
                var modelname = "flower_moneybrain_user";
                var options = {};

                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.json = newuser;

                request.post(options, function (err, response, body) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("response.statusCode=" + response.statusCode);
                        callback();
                    }
                });
            }
            else {
                callback();
            }
        }
    });


    // bot.setType('email', {
    //     typeCheck: function (dialog, context, callback) {
    //         var matched = true;
    //         var str = dialog.userInput.text;
    //         var RegEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    //         if (RegEmail.test(str))//如果返回true,表示userEmail符合邮箱格式
    //         {
    //             matched = true;
    //             context.user.email = str;
    //             var newuser = {
    //                 name: context.user.name,
    //                 mobile: context.user.mobile,
    //                 email: context.user.email,
    //                 botId: bot.id,
    //                 createTime:new Date().toLocaleString(),
    //                 updateTime:new Date().toLocaleString()
    //             };
    //             var modelname="flower_moneybrain_user";
    //             var options = {};
    //
    //             options.url = 'http://template-dev.moneybrain.ai:8443/api/'+modelname;
    //             options.json = newuser;
    //
    //             request.post(options, function(err, response, body) {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     console.log("response.statusCode=" + response.statusCode);
    //                     return callback(matched);
    //                 }
    //             });
    //         }
    //         else {
    //             matched = false;
    //             callback(matched);
    //         }
    //
    //     }
    // });


    bot.setTask('savemobile', {
        preCallback: function (dialog, context, callback) {
            context.session.mobile = dialog.userInput.types.mobile;
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            context.session.smsAuth = randomNum;
            var message = '[' + bot.name + ']' + ' 인증번호 : ' + randomNum;
            request.post(
                'https://bot.moneybrain.ai/api/messages/sms/send',
                {json: {callbackPhone: config.callcenter, phone: dialog.userInput.types.mobile, message: message}},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("response.statusCode:" + response.statusCode);
                        console.log("context.session.smsAuth=" + context.session.smsAuth);
                        return callback();
                    } else {
                        console.log("error:" + error);
                    }
                }
            );
            callback();
        }
    });


    // bot.setTask('mobileidentification',{
    //     preCallback: function (dialog, context, callback) {
    //         var str = dialog.userInput.types.mobile;
    //         // var modelname = "flower_moneybrain_vipUser";
    //         var modelname = "flower_moneybrain_vipUser";
    //         var options = {};
    //         options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
    //         options.qs = {};
    //         request.get(options, function (err, response, body) {
    //             if (err) {
    //                 console.log('err:' + err);
    //             }
    //             else {
    //                 body = JSON.parse(body);
    //                 console.log("response.statusCode=="+response.statusCode);
    //
    //                 var userinfor = body;
    //                 context.session.isvipornot = false;
    //                 for (var i = 0; i < userinfor.length; i++) {
    //                     if (userinfor[i].mobile === str) {
    //                         context.session.isvipornot = true;
    //                         context.user.mobile = str;
    //                         context.user.name2 = userinfor[i].name;
    //                         context.user.email2 = userinfor[i].email;
    //                     }
    //                 }
    //
    //                 var randomNum = '';
    //                 randomNum += '' + Math.floor(Math.random() * 10);
    //                 randomNum += '' + Math.floor(Math.random() * 10);
    //                 randomNum += '' + Math.floor(Math.random() * 10);
    //                 randomNum += '' + Math.floor(Math.random() * 10);
    //                 context.session.smsAuth = randomNum;
    //                 var message = '[' + context.bot.name + ']' + ' 인증번호 : ' + randomNum;
    //                 request.post(
    //                     'https://bot.moneybrain.ai/api/messages/sms/send',
    //                     {json: {callbackPhone: config.callcenter, phone: dialog.userInput.types.mobile, message: message}},
    //                     function (error, response, body) {
    //                         if (!error && response.statusCode == 200) {
    //                             console.log("response.statusCode:"+response.statusCode);
    //                             console.log("context.session.smsAuth="+context.session.smsAuth);
    //                             return callback();
    //                         } else {
    //                             console.log("error:"+error);
    //                         }
    //                     }
    //                 );
    //                 callback();
    //             }
    //         });
    //     }
    // });


    bot.setType('identification', {
        typeCheck: function (dialog, context, callback) {
            var matched = false;
            if (dialog.userInput.text == context.session.smsAuth) {
                matched = true;
                var modelname = "flower_moneybrain_user";
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {
                    mobile: context.session.mobile
                };
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);
                        if (body.length > 0) {
                            context.session.olduser = true;
                            context.user.mobile = body[0].mobile;
                            context.user.name = body[0].name;
                            // context.user.email=body[0].email;

                            // // var updateuser = [{
                            // //     botId: bot.id},{
                            // //     updateTime:new Date().toISOString()
                            // // }];
                            // // var modelname="flower_moneybrain_user";
                            // // var options = {};
                            // //
                            // // options.url = 'http://template-dev.moneybrain.ai:8443/api/'+modelname;
                            // // options.json = updateuser;
                            //
                            // request.put(options, function(err, response, body) {
                            //     if (err) {
                            //         console.log(err);
                            //     }
                            //     else {
                            //         console.log("response.statusCode=" + response.statusCode);
                            //         return callback(matched);
                            //     }
                            // });
                            return callback(matched);
                        }
                        else {
                            context.session.olduser = false;
                            context.user.mobile = context.session.mobile;
                            return callback(matched);
                        }
                    }
                });

                //==========================================================

            }
            else {
                callback(matched);
            }
        }
    });


    bot.setTask('bridegroomorbride', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                var str = dialog.userInput.text;
                if (str.indexOf("신랑") >= 0) {
                    context.session.brideornot = "신랑측"
                }
                else {
                    context.session.brideornot = "신부측"
                }
                callback();
            }
            else {
                callback();
            }
        }
    });

    //
    // bot.setTask('saveshowtime',{
    //     action: function (dialog, context, callback) {
    //         context.session.showtime=dialog.userinput.text;
    //         callback();
    //     }
    // });


    bot.setTask('savefriendname', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.session.friendname = dialog.userInput.text;
                callback();
            }
            else {
                callback();
            }
        }
    });


    bot.setTask('savefriendmobile', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.session.friendmobile = dialog.userInput.types.mobile;
                callback();
            }
            else {
                callback();
            }
        }
    });


    bot.setTask('savefriendaddress', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.session.friendaddress = dialog.userInput.types.address;
                // context.session.friendaddress = context.user.address.지번주소;
                callback();
            }
            else {
                callback();
            }
        }
    });
    //
    // bot.setTask('savedeliverytime',{
    //     action: function (dialog, context, callback) {
    //         dialog.output[0].buttons = [
    //             {
    //                 text: '생화일반배송',
    //                 url: ""
    //             },
    //             {
    //                 text: '생화택배',
    //                 url: ""
    //             }
    //         ];
    //         callback();
    //     }
    // });

    // bot.setTask('savedeliveryway',{
    //     action: function (dialog, context, callback) {
    //         if (dialog.userInput.text  !== "다시 입력" && dialog.userInput.text  !== "다시 확인" && dialog.userInput.text  !== "다시 선택" && dialog.userInput.text  !== "이전") {
    //             context.session.deliveryway = dialog.userInput.text ;
    //             callback();
    //         }
    //         else {
    //             callback();
    //         }
    //     }
    // });

    bot.setTask('savedecorate', {
        action: function (dialog, context, callback) {

            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                if (context.session.decorate === undefined) {

                    var str = dialog.userInput.text;
                    if (str.indexOf("카드") >= 0) {
                        context.session.decorate = "카드";
                        // dialog.output[0].buttons = [
                        //     {
                        //         text: "참고문구",
                        //         url: ""
                        //     },
                        //     {
                        //         text: "이전으로 가기"
                        //     },
                        //     {
                        //         text: "처음으로 돌아가기"
                        //     }
                        //     ];
                        callback();
                    }
                    else {
                        context.session.decorate = "리본";
                        // dialog.output[0].buttons = [
                        //     {
                        //         text: "네",
                        //         url: ""
                        //     },
                        //     {
                        //         text: "익명",
                        //         url: ""
                        //     },
                        //     {
                        //         text: "이전으로 가기"
                        //     },
                        //     {
                        //         text: "처음으로 돌아가기"
                        //     }
                        // ];
                        callback();
                    }
                }
                else {
                    str = dialog.userInput.text;
                    if (str.indexOf("리본") < 0) {
                        context.session.decorate = "카드";
                        // dialog.output[0].buttons = [
                        //     {
                        //         text: "참고문구",
                        //         url: ""
                        //     },
                        //     {
                        //         text: "이전으로 가기"
                        //     },
                        //     {
                        //         text: "처음으로 돌아가기"
                        //     }
                        // ];
                        callback();
                    }
                    else {
                        context.session.decorate = "리본";
                        // dialog.output[0].buttons = [
                        //     // {
                        //     //     text: "네",
                        //     //     url: ""
                        //     // },
                        //     // {
                        //     //     text: "익명",
                        //     //     url: ""
                        //     // },
                        //     // {
                        //     //     text: "이전으로 가기"
                        //     // },
                        //     // {
                        //     //     text: "처음으로 돌아가기"
                        //     // }
                        // ];
                        callback();
                    }

                }
                callback();
            }
            else {
                callback();
            }
        }
    });

    bot.setTask('getgreeting', {
        action: function (dialog, context, callback) {
            if (context.session.decorate === "카드") {
                var modelname = "flower_moneybrain_greeting";
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {"decorate": {"$ne": "리본"}};
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        var str = [];
                        for (var j = 0; j < body.length; j++) {
                            if (str.indexOf(body[j].category) < 0) {
                                str.push(body[j].category);
                            }
                        }
                        context.session.greetingcategory = str;
                        dialog.output[0].buttons = [];
                        for (var i = 0; i < context.session.greetingcategory.length; i++) {
                            var ss = "" + (i + 1) + ". " + context.session.greetingcategory[i];
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push(
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            });
                        callback();
                    }
                })
            }
            else if (context.session.decorate === "리본") {
                var modelname = "flower_moneybrain_greeting";
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {"decorate": {"$ne": "카드"}};
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        var str = [];
                        for (var j = 0; j < body.length; j++) {
                            if (str.indexOf(body[j].category) < 0) {
                                str.push(body[j].category);
                            }
                        }
                        context.session.greetingcategory = str;
                        dialog.output[0].buttons = [];
                        for (var i = 0; i < context.session.greetingcategory.length; i++) {
                            var ss = "" + (i + 1) + ". " + context.session.greetingcategory[i];
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push(
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            });
                        callback();
                    }
                })
            }
        }
    });


    bot.setType("greetiongcategorylist", {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            text[1] = text[1].trim();

            for (var i = 0; i < context.session.greetingcategory.length; i++) {
                if (context.session.greetingcategory[i].indexOf(text[1]) >= 0) {
                    dialog.userInput.types.greetingcategorylist = context.session.greetingcategory[i];
                    return callback(true, context.session.greetingcategory[i]);
                }
            }
            callback(false);
        }
    });


    bot.setTask('savesendname', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0 && dialog.userInput.text !== "아니요") {
                if (dialog.userInput.text.indexOf("익명") >= 0) {
                    context.session.sendname = "익명";
                }
                else {
                    context.session.sendname = dialog.userInput.text;
                }
                // dialog.output[0].buttons = [
                //     {
                //         text: "참고문구",
                //         url: ""
                //     },
                //     {
                //         text: "이전으로 가기"
                //     },
                //     {
                //         text: "처음으로 돌아가기"
                //     }
                // ];
                callback();
            }
            else {
                // dialog.output[0].buttons = [
                //     {
                //         text: "참고문구",
                //         url: ""
                //     },
                //     {
                //         text: "이전으로 가기"
                //     },
                //     {
                //         text: "처음으로 돌아가기"
                //     }
                // ];
                callback();
            }
        }
    });


    bot.setTask('showgreeting', {
        action: function (dialog, context, callback) {
            context.session.greeting = [];
            // if (dialog.userInput.greetingcategorylist !== undefined) {
            //     context.user.categorylist2 = context.user.categorylist2;
            // }
            if (context.session.decorate === "리본") {
                var modelname = "flower_moneybrain_greeting";
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {
                    category: dialog.userInput.types.greetingcategorylist,
                    decorate: {"$ne": "카드"}
                };
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.greetingcategory1 = body;
                        var count = 0;
                        var cc;
                        for (cc in body[0]) {
                            if (body[0].hasOwnProperty(cc)) {
                                count++;
                            }
                        }
                        count = count - 3;
                        var xx = [];
                        var word = "";
                        for (var j = 1; j <= count; j++) {
                            word = "word" + j;
                            xx.push(context.session.greetingcategory1[0][word]);
                        }
                        context.session.greeting = xx;

                        dialog.output[0].buttons = [];
                        for (var i = 0; i < context.session.greeting.length; i++) {
                            var ss = "" + (i + 1) + ". " + context.session.greeting[i];
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push(
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            });
                    }
                    callback();
                });
            }
            else if (context.session.decorate === "카드") {
                var modelname = "flower_moneybrain_greeting";
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {
                    category: dialog.userInput.types.greetingcategorylist,
                    decorate: {"$ne": "리본"}
                };
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(response.statusCode);

                        context.session.greetingcategory1 = body;
                        var count = 0;
                        var cc;
                        for (cc in body[0]) {
                            if (body[0].hasOwnProperty(cc)) {
                                count++;
                            }
                        }
                        count = count - 3;
                        var xx = [];
                        var word = "";
                        for (var j = 1; j <= count; j++) {
                            word = "word" + j;
                            xx.push(context.session.greetingcategory1[0][word]);
                        }
                        context.session.greeting = xx;
                        dialog.output[0].buttons = [];
                        for (var i = 0; i < context.session.greeting.length; i++) {
                            var ss = "" + (i + 1) + ". " + context.session.greeting[i];
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push(
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            });
                    }
                    callback();
                });
            }
        }
    });

    bot.setType('greetingitemlist', {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split('.');
            if (text[1] !== undefined) {
                text[1] = text[1].trim();
                for (var i = 0; i < context.session.greeting.length; i++) {
                    var namecode = context.session.greeting[i];
                    if (namecode.indexOf(text[1]) !== -1) {
                        context.session.greetingitemlist = context.session.greeting[i];
                        callback(true);
                    }
                }
            }
            else {
                callback(false);
            }
        }
    });


    // bot.setTask('savebill',{
    //     action: function (dialog, context, callback) {
    //         if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전")<0) {
    //             if (dialog.userInput.text=== "필요없음" || dialog.userInput.text === "1") {
    //                 context.session.bill = "필요없음";
    //             }
    //             else if (dialog.userInput.text === "계산서 발행" || dialog.userInput.text === "2") {
    //                 context.session.bill = "계산서 발행";
    //             }
    //             else if (dialog.userInput.text === "현금 영수증 발급" || dialog.userInput.text === "3") {
    //                 context.session.bill = "현금 영수증 발급";
    //             }
    //             callback();
    //         }
    //         else {
    //             callback();
    //         }
    //     }
    // });


    bot.setTask('savegreeting', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                if (context.session.selectchange !== 1) {
                    if (context.session.greetingitemlist !== undefined) {
                        context.session.selectedgreeting = context.session.greetingitemlist;
                    }
                    else {
                        context.session.selectedgreeting = dialog.userInput.text;
                    }
                    dialog.output[0].text = "기타 요청사항이 있으시면 입력해주세요.\n\n요청사항이 없으시면, 없다고 해주시면 됩니다^^";
                    callback();
                }
                else {
                    if (context.session.greetingitemlist !== undefined) {
                        context.session.selectedgreeting = context.session.greetingitemlist;
                    }
                    else {
                        context.session.selectedgreeting = dialog.userInput.text;
                    }

                    dialog.output[0].text = "변경 되었습니다.";
                    dialog.output[0].buttons = [
                        {
                            text: '주문서 확인하기',
                            url: ""
                        },
                        {
                            text: "이전으로 가기"
                        },
                        {
                            text: "처음으로 돌아가기"
                        }
                    ];

                    callback();
                }

                callback();
            }
            else {
                callback();
            }
        }
    });


    // bot.setTask('savepayway', {
    //     action: function (dialog, context, callback) {
    //         if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전")<0) {
    //             if (dialog.userInput.text === "카드 결제하기" || dialog.userInput.text === "1") {
    //                 context.session.payway = "카드";
    //             }
    //             else if (dialog.userInput.text=== "무통장 입금하기" || dialog.userInput.text=== "2") {
    //                 context.session.payway = "무통장";
    //             }
    //             else if (dialog.userInput.text === "카카오페이" ||dialog.userInput.text=== "3") {
    //                 context.session.payway = "카카오페이";
    //             }
    //             callback();
    //         }
    //         else {
    //             callback();
    //         }
    //     }
    // });


    bot.setTask('collectorderinfor', {
        action: function (dialog, context, callback) {

            context.session.orderinfor = {};
            //주문일시
            var myDate = new Date();
            //var local=myDate.toLocaleString( );
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var time = myDate.toLocaleTimeString();
            context.session.orderinfor.time = year + "년" + month + "월" + day + "일" + " " + time;
            //고객성함,고객 휴대폰 번호,구매자 메일,상품금액:
            context.session.orderinfor.name = context.user.name;
            context.session.orderinfor.mobile = context.user.mobile;
            // context.session.orderinfor.email = context.user.email;
            context.session.orderinfor.itemprice = context.session.selecteditem.price;
            //보내시는분 성함:
            if (context.session.decorate === "리본") {
                context.session.orderinfor.sendername = context.session.sendname;
            }
            else {
                context.session.orderinfor.sendername = context.session.orderinfor.name;
            }
            //받는분 성함:
            context.session.orderinfor.receivername = context.session.friendname;
            //받는분 연락처:
            context.session.orderinfor.receivermobile = context.session.friendmobile;
            //배달주소:
            context.session.orderinfor.receiveraddress = context.session.friendaddress;
            //배달일자:
            context.session.orderinfor.deliverytime = context.session.deliverytime;
            //남기시는 메세지:
            context.session.orderinfor.greeting = context.session.selectedgreeting;
            //상품명:
            context.session.orderinfor.itemname = context.session.selecteditem.name;
            //상품 이미지:
            context.session.orderinfor.itemimage = context.session.selecteditem.picture;
            //상품 코드:
            context.session.orderinfor.itempay = context.session.selecteditem.pay;
            //수량---------------------------------------
            if (context.session.itemnumber === undefined) {
                context.session.orderinfor.itemnumber = 1;
            }
            else {
                context.session.orderinfor.itemnumber = context.session.itemnumber;
            }
            //console.log("context.user.orderinfor.itemnumber:========="+context.user.orderinfor.itemnumber);
            //신부신랑:
            context.session.orderinfor.brideornot = context.session.brideornot;
            //신부신랑 전시 시간:
            context.session.orderinfor.showtime = context.session.showtime;
            //배송방식:
            // context.session.orderinfor.deliveryway = context.session.deliveryway;
            //포장방식:
            context.session.orderinfor.decorateway = context.session.decorate;
            //계산서 필요할건지:
            // context.session.orderinfor.bill = context.session.bill;
            //결제 방식:
            // context.session.orderinfor.payway = context.session.payway;
            //총 금액
            var price = context.session.orderinfor.itemprice;
            var number = context.session.orderinfor.itemnumber;
            price = Number(price);
            number = Number(number);
            context.session.orderinfor.allprice = price * number;
            context.session.orderinfor.allprice = String(context.session.orderinfor.allprice);
            context.session.orderinfor.otherrequire = context.session.otherrequire;

            dialog.output[0].image = {url: context.session.orderinfor.itemimage};
            dialog.output[0].buttons = [
                {
                    text: '이대로 주문하기',
                    url: ""
                },
                {
                    text: '변경하기',
                    url: ""
                },
                {
                    text: "처음으로 돌아가기"
                }
            ];
            callback();
        }
    });


    bot.setTask('addorder', {
        action: function (dialog, context, callback) {
            var neworder = {
                time: context.session.orderinfor.time,
                name: context.session.orderinfor.name,
                mobile: context.session.orderinfor.mobile,
                price: context.session.orderinfor.itemprice,
                sendername: context.session.orderinfor.sendername,
                receivername: context.session.orderinfor.receivername,
                receivermobile: context.session.orderinfor.receivermobile,
                receiveraddress: context.session.orderinfor.receiveraddress,
                greeting: context.session.orderinfor.greeting,
                itemname: context.session.orderinfor.itemname,
                itemimage: context.session.orderinfor.itemimage,
                itemnumber: context.session.orderinfor.itemnumber,
                itempay: context.session.orderinfor.itempay,
                // email: context.session.orderinfor.email,
                bride: context.session.orderinfor.brideornot,
                showtime: context.session.orderinfor.showtime,
                // deliveryway: context.session.orderinfor.deliveryway,
                decorateway: context.session.orderinfor.decorateway,
                // bill: context.session.orderinfor.bill,
                // payway: context.session.orderinfor.payway,
                allprice: context.session.orderinfor.allprice,
                deliverytime: context.session.orderinfor.deliverytime,
                otherrequire: context.session.orderinfor.otherrequire,
                status: "주문 대기중",
                botId: bot.id
            };
            var modelname = "flower_moneybrain_reservation";
            var options = {};


            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.json = neworder;

            request.post(options, function (err, response, body) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("response.statusCode=" + response.statusCode);

                    dialog.output[0].buttons = [
                        {
                            text: '결제하기',
                            url: context.session.selecteditem.pay
                        },
                        {
                            text: '내 주문 확인하기'
                        },
                        {
                            text: '시작'
                        }
                    ];

                    //보내시는분 성함:
                    context.session.sendname = undefined;
                    //받는분 성함:
                    context.session.friendname = undefined;
                    //받는분 연락처:
                    context.session.friendmobile = undefined;
                    //배달주소:
                    context.session.friendaddress = undefined;
                    //배달일자:
                    context.session.deliverytime = undefined;
                    //남기시는 메세지:
                    context.session.selectedgreeting = undefined;
                    //상품:
                    // context.session.selecteditem = undefined;
                    //수량---------------------------------------
                    context.session.itemnumber = undefined;
                    //신부신랑:
                    context.session.brideornot = undefined;
                    //신부신랑 전시 시간:
                    context.session.showtime = undefined;
                    //배송방식:
                    // context.session.deliveryway = undefined;
                    //포장방식:
                    context.session.decorate = undefined;
                    //계산서 필요할건지:
                    // context.session.bill = undefined;
                    //결제 방식:
                    // context.session.payway = undefined;
                    //변경:
                    context.session.selectchange = undefined;
                    //다른 요구사항
                    context.session.otherrequire = undefined;
                    context.session.olduser = undefined;
                    context.session.findorder = undefined;
                    //매세지:


                    if (!context.bot.testMode) {
                        var randomNum = '';
                        randomNum += '' + Math.floor(Math.random() * 10);
                        randomNum += '' + Math.floor(Math.random() * 10);
                        randomNum += '' + Math.floor(Math.random() * 10);
                        randomNum += '' + Math.floor(Math.random() * 10);

                        var url = config.host + '/mobile#/chat/' + bot.id + '?authKey=' + randomNum;
                        bot.authKey = randomNum;

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
                                'X-Naver-Client-Id': 'Aqi_RlMlLRlJnmJptMhD',
                                'X-Naver-Client-Secret': '0AKq2NoNgn'
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
                                    context.session.orderinfor.itemname + "/" + context.session.orderinfor.itemnumber + '개/' + '총 ' + context.session.orderinfor.allprice + '원\n' +
                                    "-수취인: [" + context.session.orderinfor.receivername + " " + context.session.orderinfor.receivermobile + "]";


                                // var message = '[플레이챗-'+context.user.orderinfor.name+'고객님]'+
                                //     '주문일시: '+context.user.orderinfor.time +'주문 고객명: ' + context.user.orderinfor.name + '보내시는분 성함:' + context.user.orderinfor.sendername+
                                //     '주문 전화번호: '+context.user.orderinfor.mobile + '받는분 성함: '+context.user.orderinfor.receivername + '수취인 전화번호: ' + context.user.orderinfor.receivermobile+
                                //     '배달주소: ' + context.user.orderinfor.receiveraddress + '배달일자: ' + context.user.orderinfor.deliverytime +
                                //     '남기시는 메세지: '+context.user.orderinfor.greeting+'상품: ' + context.user.orderinfor.itemname + '수량: '+ context.user.orderinfor.itemnumber +'개'+'총: '+context.user.orderinfor.allprice + '원'+
                                //     '신부신랑: '+context.user.orderinfor.brideornot+'신부신랑 전시 시간: '+context.user.orderinfor.showtime+'다른 요구사항: '+context.user.orderinfor.otherrequire+'결제 방식: '+context.user.orderinfor.payway+
                                //     '계산서 필요할건지: '+context.user.orderinfor.bill+'배송방식: '+context.user.orderinfor.deliveryway+'카드/리본: '+context.user.orderinfor.decorateway;// html body
                                //

                                //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //'예약접수(클릭) ' + shorturl;

                                // if (context.session.orderinfor.mobile !== "01066389310") {
                                //     context.session.orderinfor.mobile = "01020865439";
                                // }
                                var transporter = nodemailer.createTransport({
                                    service: 'Gmail',
                                    auth: {
                                        user: 'zsslovelyg@gmail.com',
                                        pass: 'ZSdh1007--'
                                    }
                                });
                                // if (context.session.orderinfor.email !== "zsslovelyg@moneybrain.ai") {
                                //     context.session.orderinfor.email = "jipark305@icloud.com";
                                // }
                                var mailOptions = {
                                    from: 'moneybrain', // sender address
                                    to: ['ellie@moneybrain.ai', 'zsslovelyg@moneybrain.ai', 'jipark@moneybrain.ai'], // list of receivers
                                    subject: "***주문소식***", // Subject line
                                    html: '<b>[플레이챗-</b>' + context.session.orderinfor.name + '<b>고객님]</b>' + '<br>' +
                                    '<br>' + '<b>주문일시: </b>' + context.session.orderinfor.time + '<br>' + '<b>주문 고객명: </b>' + context.session.orderinfor.name + '<br>' + '<b>보내시는분 성함:</b>' + context.session.orderinfor.sendername +
                                    '<br>' + '<b>주문 전화번호: </b>' + context.session.orderinfor.mobile + '<br>' + '<b>받는분 성함: </b>' + context.session.orderinfor.receivername + '<br>' + '<b>수취인 전화번호: </b>' + context.session.orderinfor.receivermobile +
                                    '<br>' + '<b>배달주소: </b>' + context.session.orderinfor.receiveraddress + '<br>' + '<b>배달일자: </b>' + context.session.orderinfor.deliverytime +
                                    '<br>' + '<b>남기시는 메세지: </b>' + context.session.orderinfor.greeting + '<br>' + '<b>상품: </b>' + context.session.orderinfor.itemname + '<br>' + '<b>수량: </b>' + context.session.orderinfor.itemnumber + '<b>개</b>' + '<br>' + '<b>총: </b>' + context.session.orderinfor.allprice + '<b>원</b>' +
                                    '<br>' + '<b>신부신랑: </b>' + context.session.orderinfor.brideornot + '<br>' + '<b>신부신랑 전시 시간: </b>' + context.session.orderinfor.showtime + '<br>' + '<b>다른 요구사항: </b>' + context.session.orderinfor.otherrequire + '<br>' +
                                    '<br>' + '<b>카드/리본: </b>' + context.session.orderinfor.decorateway + '<br>' + '<b>결제하러 가기: </b>' + context.session.orderinfor.itempay// html body
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });

                                request.post(
                                    'https://bot.moneybrain.ai/api/messages/sms/send',
                                    {
                                        json: {
                                            // callbackPhone: context.bot.phone,
                                            callbackPhone: "028585683",
                                            phone: ["01020865439"],
                                            message: message
                                        }
                                    },
                                    function (error, response, body) {
                                        console.log("error:", error);
                                        callback();
                                    }
                                );


                                //================================================================================
                                // var options = {};
                                // options.url = "http://api.payapp.kr/oapi/apiLoad.html";
                                // options.form = {
                                //     cmd         : "payrequest",           // 결제요청, 필수
                                //     userid      : "moneybrain",          // 판매자 아이디, 필수
                                //     goodname    : "3단 축하화환(알뜰형)",
                                //     price       : "59000",
                                //     recvphone   : "01066389310",
                                //     memo        : "결제요청 테스트 메모",
                                //     reqaddr     : 0,
                                //     feedbackurl : "http://remaster.moneybrain.ai/api/flower_moneybrain/complete_payapp",
                                //     var1        : "xxx6666",
                                //     var2        : "9999",
                                //     smsuse      : "n",
                                //     reqmode     : "krw",
                                //     vccode      : "",
                                //     returnurl   : "http://remaster.moneybrain.ai/결제완료페이지.php",
                                //     openpaytype : "phone",
                                //     checkretry  : "y"
                                // };
                                //
                                // request.post(options, function (err, response, body)
                                // {
                                //     console.log(body);
                                //     var split = body.split('&');
                                //
                                //     var data = {};
                                //
                                //     for(var i=0; i<split.length; i++)
                                //     {
                                //         var keyValueSplit = split[i].split('=');
                                //         data[keyValueSplit[0]] = decodeURIComponent(keyValueSplit[1]);
                                //     }
                                //
                                //     console.log(data);
                                // });
                                //

                                //  //--------------------------------------------------------------------------
                                //  var message = '[플레이챗-'+context.user.orderinfor.name+'1]' + '\n' +
                                //      "주문일시:"+context.user.orderinfor.time + "\n고객명:" + context.user.orderinfor.name + '\n발송인:' + context.user.orderinfor.sendername;
                                //  //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //  //'예약접수(클릭) ' + shorturl;
                                //  if(context.user.orderinfor.mobile!=="01066389310"){
                                //      context.user.orderinfor.mobile="01042369555";
                                //  }
                                //  request.post(
                                //      'https://bot.moneybrain.ai/api/messages/sms/send',
                                //      {
                                //          json: {
                                //              // callbackPhone: context.bot.phone,
                                //              callbackPhone: "028585683",
                                //              phone: context.user.orderinfor.mobile.replace(/,/g, ''),
                                //              message: message
                                //          }
                                //      },
                                //      function (error, response, body) {
                                //          console.log("error:", error);
                                //          callback();
                                //      }
                                //  );
                                // //----------------------------------------------------------------------------
                                //
                                //  var message = '['+context.user.orderinfor.name+'2]' + '\n' +
                                //      '주문 전화번호:'+context.user.orderinfor.mobile + "수취인:"+context.user.orderinfor.receivername + "\n수취인 전화번호:" + context.user.orderinfor.receivermobile;
                                //  //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //  //'예약접수(클릭) ' + shorturl;
                                //  if(context.user.orderinfor.mobile!=="01066389310"){
                                //      context.user.orderinfor.mobile="01042369555";
                                //  }
                                //  request.post(
                                //      'https://bot.moneybrain.ai/api/messages/sms/send',
                                //      {
                                //          json: {
                                //              // callbackPhone: context.bot.phone,
                                //              callbackPhone: "028585683",
                                //              phone: context.user.orderinfor.mobile.replace(/,/g, ''),
                                //              message: message
                                //          }
                                //      },
                                //      function (error, response, body) {
                                //          console.log("error:", error);
                                //          callback();
                                //      }
                                //  );
                                //
                                //  //----------------------------------------------------------------------------
                                //  var message = '['+context.user.orderinfor.name+'3]' + '\n' +
                                //       "배달주소:"+ context.user.orderinfor.receiveraddress + '\n배달일자:' +context.user.orderinfor.deliverytime;
                                //
                                //  //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //  //'예약접수(클릭) ' + shorturl;
                                //  if(context.user.orderinfor.mobile!=="01066389310"){
                                //      context.user.orderinfor.mobile="01042369555";
                                //  }
                                //  request.post(
                                //      'https://bot.moneybrain.ai/api/messages/sms/send',
                                //      {
                                //          json: {
                                //              // callbackPhone: context.bot.phone,
                                //              callbackPhone: "028585683",
                                //              phone: context.user.orderinfor.mobile.replace(/,/g, ''),
                                //              message: message
                                //          }
                                //      },
                                //      function (error, response, body) {
                                //          console.log("error:", error);
                                //          callback();
                                //      }
                                //  );
                                //  //--------------------------------------------------------------------------
                                //  //----------------------------------------------------------------------------
                                //  var message = '['+context.user.orderinfor.name+'4]' + '\n' +
                                //      "남긴 메세지:"+context.user.orderinfor.greeting;
                                //
                                //  //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //  //'예약접수(클릭) ' + shorturl;
                                //  if(context.user.orderinfor.mobile!=="01066389310"){
                                //      context.user.orderinfor.mobile="01042369555";
                                //  }
                                //  request.post(
                                //      'https://bot.moneybrain.ai/api/messages/sms/send',
                                //      {
                                //          json: {
                                //              // callbackPhone: context.bot.phone,
                                //              callbackPhone: "028585683",
                                //              phone: context.user.orderinfor.mobile.replace(/,/g, ''),
                                //              message: message
                                //          }
                                //      },
                                //      function (error, response, body) {
                                //          console.log("error:", error);
                                //          callback();
                                //      }
                                //  );
                                //  //--------------------------------------------------------------------------
                                //  //----------------------------------------------------------------------------
                                //  var message = '['+context.user.orderinfor.name+'5]' + '\n' +
                                //      "남긴 메세지:"+context.user.orderinfor.greeting + "\n/" + context.user.orderinfor.itemname + "/총:"+ context.user.orderinfor.itemnumber + '개/'+context.user.orderinfor.allprice + '원';
                                //
                                //  //message += '\n-' + context.user.orderinfor.name + ' '+'주문';
                                //  //'예약접수(클릭) ' + shorturl;
                                //  if(context.user.orderinfor.mobile!=="01066389310"){
                                //      context.user.orderinfor.mobile="01042369555";
                                //  }
                                //  request.post(
                                //      'https://bot.moneybrain.ai/api/messages/sms/send',
                                //      {
                                //          json: {
                                //              // callbackPhone: context.bot.phone,
                                //              callbackPhone: "028585683",
                                //              phone: context.user.orderinfor.mobile.replace(/,/g, ''),
                                //              message: message
                                //          }
                                //      },
                                //      function (error, response, body) {
                                //          console.log("error:", error);
                                //          callback();
                                //      }
                                //  );
                                //  //--------------------------------------------------------------------------

                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }
                callback();
            });
        }
    });


    bot.setTask('nobride', {
        action: function (dialog, context, callback) {
            if (context.session.showtime === undefined) {
                context.session.brideornot = "없음";
                context.session.showtime = "없음";
                callback();
            }
            else {
                callback();
            }
        }
    });


    bot.setTask('selectchange', {
        action: function (dialog, context, callback) {
            context.session.selectchange = 1;
            dialog.output[0].buttons = [
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
                    text: "이전으로 가기"
                },
                {
                    text: "처음으로 돌아가기"
                }
            ];
            callback();
        }
    });

    bot.setTask('deletegreeting', {
        action: function (dialog, context, callback) {
            context.session.greetingitemlist = undefined;
            // dialog.output[0].buttons = [
            //     {
            //         text: '참고문구',
            //         url: ""
            //     },
            //     {
            //         text: "이전으로 가기"
            //     },
            //     {
            //         text: "처음으로 돌아가기"
            //     }
            // ];
            callback();
        }
    });


    bot.setTask('saveitemnumber', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.session.itemnumber = dialog.userInput.text;
                callback();
            }
            else {
                callback();
            }
        }
    });


    bot.setTask('saveotherrequire', {
        action: function (dialog, context, callback) {
            if (dialog.userInput.text !== "다시 입력" && dialog.userInput.text !== "다시 확인" && dialog.userInput.text !== "다시 선택" && dialog.userInput.text.indexOf("이전") < 0) {
                context.session.otherrequire = dialog.userInput.text;
                callback();
            }
            else {
                callback();
            }
        }
    });


    bot.setTask('showorder', {
        action: function (dialog, context, callback) {
            var modelname = "flower_moneybrain_reservation";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                botId: bot.id,
                mobile: context.user.mobile,
                status: "주문 대기중"
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.orderlist = body;
                    //task.doc={text:"완료된 고객님의 지난 주문내역입니다.\n\n지난 주문내역과 동일한 상품으로 주문을 원하시면 해당 주문내역의 번호를 입력하세요.\n\n"};

                    dialog.output[0].buttons = [];
                    for (var i = 0; i < context.session.orderlist.length; i++) {
                        var ss = "" + (i + 1) + ". " + context.session.orderlist[i].itemname + " " + context.session.orderlist[i].deliverytime + " " + context.session.orderlist[i].receivername;
                        dialog.output[0].buttons.push({text: ss});
                    }
                    dialog.output[0].buttons.push({text: "이전으로 가기"},
                        {
                            text: "처음으로 돌아가기"
                        });
                    callback();
                }
            });
        }
    });

    bot.setType("orderlist", {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text.split(".");
            if (text[1] !== undefined) {
                text[1] = text[1].trim();

                for (var i = 0; i < context.session.orderlist.length; i++) {
                    var orderitem = context.session.orderlist[i].itemname + " " + context.session.orderlist[i].deliverytime + " " + context.session.orderlist[i].receivername;
                    if (orderitem.indexOf(text[1]) !== -1) {
                        dialog.userInput.types.orderlist = context.session.orderlist[i];
                        return callback(true);
                    }
                }
            }
            callback(false);
        }
    });


    bot.setTask('showorder1', {
        action: function (dialog, context, callback) {
            dialog.output[0].image = {url: dialog.userInput.types.orderlist.itemimage};
            dialog.output[0].buttons = [
                {
                    text: "결제하러 가기",
                    url: dialog.userInput.types.orderlist.itempay
                },
                {
                    text: "시작",
                    url: ""
                },
                {
                    text: "이전으로 가기"
                }
            ];
            //};
            context.session.findorder = undefined;
            callback();
        }
    });


    bot.setTask('recordorder', {
        action: function (dialog, context, callback) {
            context.session.selectchange = undefined;
            context.session.sendname = undefined;
            //받는분 성함:
            context.session.friendname = undefined;
            //받는분 연락처:
            context.session.friendmobile = undefined;
            //배달주소:
            context.session.friendaddress = undefined;
            //배달일자:
            context.session.deliverytime = undefined;
            //남기시는 메세지:
            context.session.selectedgreeting = undefined;
            //상품:
            //context.session.selecteditem=undefined;
            //수량---------------------------------------
            context.session.itemnumber = undefined;
            //신부신랑:
            context.session.brideornot = undefined;
            //신부신랑 전시 시간:
            context.session.showtime = undefined;
            //배송방식:
            // context.session.deliveryway = undefined;
            //포장방식:
            context.session.decorate = undefined;
            //계산서 필요할건지:
            // context.session.bill = undefined;
            //결제 방식:
            // context.session.payway = undefined;
            //변경:
            //다른 요구사항
            context.session.otherrequire = undefined;
            context.session.olduser = undefined;
            context.session.greetingitemlist = undefined;

            context.session.findorder = 1;
            callback();
        }
    });


    bot.setTask('addvip', {
        action: function (dialog, context, callback) {
            dialog.output[0].buttons = [
                {
                    text: '회원가입하기',
                    url: 'http://flowermania.co.kr/cgi-bin/member/registration.php'
                },
                {
                    text: '시작',
                    url: ""
                },
                {
                    text: "이전으로 가기"
                }
            ];
            callback();
        }
    });

    bot.setTask('sendidentification', {
        preCallback: function (dialog, context, callback) {
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            context.session.smsAuth = randomNum;
            var message = '[' + context.bot.name + ']' + ' 인증번호 : ' + randomNum;
            request.post(
                'https://bot.moneybrain.ai/api/messages/sms/send',
                {json: {callbackPhone: config.callcenter, phone: context.session.mobile, message: message}},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("response.statusCode:" + response.statusCode);
                        console.log("context.session.smsAuth=" + context.session.smsAuth);
                        return callback();
                    } else {
                        console.log("error:" + error);
                    }
                }
            );
            callback();
        }
    });


    bot.setTask('addbuttons', {
        action: function (dialog, context, callback) {
            dialog.output[0].buttons = [
                {
                    text: '시작',
                    url: ""
                },
                {
                    text: "이전으로 가기"
                }
            ];
            callback();
        }
    });

    bot.setTask('startbuttons',
        {
            action: function (dialog, context, callback) {
                dialog.output[0].image = {url: 'http://pic1.wed114.cn/allimg/120910/15454935M-0.jpg'};
                dialog.output[0].buttons = [
                    {
                        text: '✶졸업식 꽃 배달✶',
                        url: ''
                    },
                    {
                        text: '꽃 카테고리 보기',
                        url: ''
                    }
                    // {
                    //     text: '2.내 주문내역 확인하기',
                    //     url: ''
                    // }
                ];

                console.log('으 다이얼로그 : ', dialog);

                callback();
            }
        });


    // bot.setTask('neworder',{
    //     action: function (dialog, context, callback) {
    //         context.session.sendname = undefined;
    //         //받는분 성함:
    //         context.session.friendname = undefined;
    //         //받는분 연락처:
    //         context.session.friendmobile = undefined;
    //         //배달주소:
    //         context.session.friendaddress = undefined;
    //         //배달일자:
    //         context.session.deliverytime = undefined;
    //         //남기시는 메세지:
    //         context.session.selectedgreeting = undefined;
    //         //상품:
    //         //context.session.selecteditem=undefined;
    //         //수량---------------------------------------
    //         context.session.itemnumber = undefined;
    //         //신부신랑:
    //         context.session.brideornot = undefined;
    //         //신부신랑 전시 시간:
    //         context.session.showtime = undefined;
    //         //배송방식:
    //         // context.session.deliveryway = undefined;
    //         //포장방식:
    //         context.session.decorate = undefined;
    //         //계산서 필요할건지:
    //         // context.session.bill = undefined;
    //         //결제 방식:
    //         // context.session.payway = undefined;
    //         //변경:
    //         //다른 요구사항
    //         context.session.otherrequire = undefined;
    //         context.session.olduser=undefined;
    //         context.session.greetingitemlist=undefined;
    //         context.session.findorder = undefined;
    //         context.session.selectchange=undefined;
    //
    //         callback();
    //     }
    // });


    bot.setTask('allname', {
        action: function (dialog, context, callback) {
            context.session.sendname = undefined;
            //받는분 성함:
            context.session.friendname = undefined;
            //받는분 연락처:
            context.session.friendmobile = undefined;
            //배달주소:
            context.session.friendaddress = undefined;
            //배달일자:
            context.session.deliverytime = undefined;
            //남기시는 메세지:
            context.session.selectedgreeting = undefined;
            //상품:
            //context.session.selecteditem=undefined;
            //수량---------------------------------------
            context.session.itemnumber = undefined;
            //신부신랑:
            context.session.brideornot = undefined;
            //신부신랑 전시 시간:
            context.session.showtime = undefined;
            //배송방식:
            // context.session.deliveryway = undefined;
            //포장방식:
            context.session.decorate = undefined;
            //계산서 필요할건지:
            // context.session.bill = undefined;
            //결제 방식:
            // context.session.payway = undefined;
            //변경:
            //다른 요구사항
            context.session.otherrequire = undefined;
            context.session.olduser = undefined;
            context.session.greetingitemlist = undefined;
            context.session.findorder = undefined;
            context.session.selectchange = undefined;
            context.user.time = undefined;
            var modelname = "flower_moneybrain_category";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {};
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.allname = [];
                    for (var i = 0; i < body.length; i++) {
                        context.session.allname.push(body[i].name);
                    }
                }
                callback();
            });
        }
    });


    bot.setType('allnamelist', {
        typeCheck: function (dialog, context, callback) {
            var text = dialog.userInput.text;

            for (var i = 0; i < context.session.allname.length; i++) {
                if (text.indexOf(context.session.allname[i]) >= 0) {
                    return callback(true, context.session.allname[i]);
                }
            }
            callback(false);
        }
    });

    bot.setTask('categorycheck', {
        action: function (dialog, context, callback) {
            var str = "";
            str = dialog.userInput.text;

            var modelname = "flower_moneybrain_category";
            var options = {};
            options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
            options.qs = {
                name: dialog.userInput.types.allnamelist
            };
            request.get(options, function (err, response, body) {
                if (err) {
                    console.log('err:' + err);
                }
                else {
                    body = JSON.parse(body);
                    console.log(response.statusCode);

                    context.session.item = body;
                    if (context.session.item[0].picture !== undefined) {
                        // dialog.output[0].text = "선택하신 **" + context.session.item[0].name + "**에 대한 정보입니다.\n\n상품 번호: " + context.session.item[0].code + "\n" +
                        //     "배송 안내: " + context.session.item[0].delivery + "\n" +
                        //     "회원 혜택: " + context.session.item[0].VIP + "\n" +
                        //     "\n" + "가격:\n" +
                        //     "       일반가: " + context.session.item[0].price + "원\n" +
                        //     "       회원할인가: " + context.session.item[0].sale_price + "원\n\n" +
                        //     "상품안내: " + context.session.item[0].description + "\n\n" +
                        //     "이 상품으로 주문하시겠습니까?";
                        dialog.output[0].image = {url: context.session.item[0].picture};
                        dialog.output[0].buttons = [
                            {
                                text: '자세히보기',
                                url: context.session.item[0].picture.startsWith('http') ? context.session.item[0].picture : config.host + context.session.item[0].picture
                            },
                            {
                                text: '네 주문하기',
                                url: ""
                            },
                            {
                                text: "이전으로 가기"
                            },
                            {
                                text: "처음으로 돌아가기"
                            }
                        ]
                    }
                    callback();
                }
            });
        }
    });


    function IsMonthAndDateCorrect(nYear, nMonth, nDay) {
        // 月份是否在1-12的范围内，注意如果该字符串不是C#语言的，而是JavaScript的，月份范围为0-11
        if (nMonth > 12 || nMonth <= 0)
            return false;

        // 日是否在1-31的范围内，不是则取值不正确
        if (nDay > 31 || nMonth <= 0)
            return false;

        // 根据月份判断每月最多日数
        var bTrue = false;
        switch (nMonth) {
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
    function IsLeapYear(nYear) {
        // 如果不是4的倍数，一定不是闰年
        if (nYear % 4 != 0)
            return false;
        // 是4的倍数，但不是100的倍数，一定是闰年
        if (nYear % 100 != 0)
            return true;

        // 是4和100的倍数，如果又是400的倍数才是闰年
        return (nYear % 400 == 0);
    }

    function timeTypeCheck1(text, type, dialog, context, cb) {
        var name = 'time';
        var re = /(오전|오후|새벽|아침|낮|저녁|밤|am|pm|a.m|p.m)?\s*(\d{1,2})\s*(?:시|:)\s*(?:(\d{1,2}|반)\s*분?)?/g;
        var matched = false;

        //console.log("re============1"+JSON.stringify(re));
        // console.log("re============2"+re);

        text = text.replace(re, function (match, g1, g2, g3) {
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
            context.user.time = time;
            if (time === 're' || time === 'out') {
                matched = false;
            }
            else {
                matched = true;
            }
            // console.log("context.user.time======999999999=="+context.user.time);
        });
        return matched
    }

    bot.setTask('addbuttons1', {
        action: function (dialog, context, callback) {
            dialog.output[0].buttons = [
                {
                    text: "재발송",
                    url: ""
                },
                {
                    text: "시작",
                    url: ""
                }
            ];
            callback();
        }
    });

    bot.setType('dateAndtime', {
        typeCheck: function (dialog, context, callback) {
            var matched = false;
            // 判断年、月、日的取值范围是否正确
            // 先判断格式上是否正确
            var text = dialog.userInput.text;
            var type = dialog.userInput.type;
            var regDate = /^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
            if (!regDate.test(text)) {
                matched = false;
                callback(matched);
            }
            else {
                // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
                var arr = regDate.exec(text);
                // 判断年、月、日的取值范围是否正确
                matched = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
                if (matched) {
                    context.session.dateonly = arr[1] + "년" + arr[2] + "월" + arr[3] + "일";
                    //time格式判断
                    //var strr=context.user.inRaw;
                    var strr = dialog.userInput.text;
                    var textt = strr.split(" ");
                    if (textt[1] === undefined) {
                        var textt3 = strr.substring(8);
                        timeTypeCheck1(textt3, type, dialog, context, callback);
                        if (context.user.time === undefined) {
                            context.user.time = ' ';
                        }
                        context.session.showtime = context.session.dateonly + " " + context.user.time;
                        if (context.user.time == 're') {
                            matched = false;
                            return matched;
                        }
                        callback(matched);
                    }
                    else {
                        if (textt[2] === undefined) {
                            timeTypeCheck1(textt[1], type, dialog, context, callback);
                            if (context.user.time === undefined) {
                                context.user.time = ' ';
                            }
                            context.session.showtime = context.session.dateonly + " " + context.user.time;
                            if (context.user.time == 're') {
                                matched = false;
                                return matched;
                            }
                            callback(matched);
                        }
                        else {
                            var textt2 = textt[1] + textt[2];
                            timeTypeCheck1(textt2, type, dialog, context, callback);
                            if (context.user.time === undefined) {
                                ccontext.user.time = ' ';
                            }
                            context.session.showtime = context.session.dateonly + " " + context.user.time;
                            if (context.user.time == 're') {
                                matched = false;
                                return matched;
                            }
                            callback(matched);
                        }
                    }
                }
                else {
                    context.session.weddingdate = undefined;
                    callback(matched);
                }
            }
        }
    });


    bot.setType('dateAndtime1', {
        typeCheck: function (dialog, context, callback) {
            var matched = false;
            var text = dialog.userInput.text;
            var type = dialog.userInput.type;
            // 判断年、月、日的取值范围是否正确
            // 先判断格式上是否正确
            var regDate = /^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
            if (!regDate.test(text)) {
                matched = false;
                callback(matched);
            }
            else {
                // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
                var arr = regDate.exec(text);
                // 判断年、月、日的取值范围是否正确
                matched = IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
                if (matched) {
                    context.session.dateonly = arr[1] + "년" + arr[2] + "월" + arr[3] + "일";
                    //time格式判断
                    //var strr=context.user.inRaw;
                    var strr = dialog.userInput.text;
                    var textt = strr.split(" ");
                    if (textt[1] === undefined) {
                        var textt3 = strr.substring(8);
                        timeTypeCheck1(textt3, type, dialog, context, callback);
                        if (context.user.time === undefined) {
                            context.user.time = ' ';
                        }
                        context.session.deliverytime = context.session.dateonly + " " + context.user.time;
                        if (context.user.time == 're') {
                            matched = false;
                            return callback(matched);
                        }
                        return callback(matched);
                    }
                    else {
                        if (textt[2] === undefined) {
                            timeTypeCheck1(textt[1], type, dialog, context, callback);
                            if (context.user.time === undefined) {
                                context.user.time = ' ';
                            }
                            context.session.deliverytime = context.session.dateonly + " " + context.user.time;
                            if (context.user.time == 're') {
                                matched = false;
                                return callback(matched);
                            }
                            return callback(matched);
                        }
                        else {
                            var textt2 = textt[1] + textt[2];
                            timeTypeCheck1(textt2, type, dialog, context, callback);
                            if (context.user.time === undefined) {
                                context.user.time = ' ';
                            }
                            context.session.deliverytime = context.session.dateonly + " " + context.user.time;
                            if (context.user.time == 're') {
                                matched = false;
                                return callback(matched);
                            }
                            return callback(matched);
                        }
                    }
                }
                else {
                    context.session.weddingdate = undefined;
                    return callback(matched);
                }
            }
            callback(matched);
        }
    });

    // bot.setTask('deletemobile',
    //     {
    //         action: function (dialog, context, callback)
    //         {
    //             context.user.mobile=undefined;
    //             callback();
    //         }
    //     });

    bot.setTask('valentine',
        {
            action: function (dialog, context, callback) {
                var modelname = 'flower_moneybrain_category';
                var options = {};
                options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
                options.qs = {
                    valentine:"true"
                };
                request.get(options, function (err, response, body) {
                    if (err) {
                        console.log('err:' + err);
                    }
                    else {
                        body = JSON.parse(body);
                        context.session.valentine=body;
                        console.log(response.statusCode);
                        dialog.output[0].buttons = [];
                        for (var i = 0; i < body.length; i++) {
                            var ss = "" + (i + 1) + ". " + body[i].name;
                            dialog.output[0].buttons.push({text: ss});
                        }
                        dialog.output[0].buttons.push({text: "이전으로 가기"},
                            {
                                text: "처음으로 돌아가기"
                            });
                        dialog.output[0].image={url:body[0].valentine대};
                        callback();
                    }
                });
            }
        });

bot.setType('valentineitemlist', {
    typeCheck: function (dialog, context, callback) {
        var text = dialog.userInput.text.split(".");
        if (text[1] !== undefined) {
            text[1] = text[1].trim();
            for (var i = 0; i < context.session.valentine.length; i++) {
                var namecode = context.session.valentine[i].name;

                if (namecode.indexOf(text[1]) !== -1) {
                    dialog.userInput.types.valentineitemlist = context.session.valentine[i];
                    return callback(true);
                }
            }
        }
        else if(dialog.userInput.text){
            for (var j = 0; j < context.session.valentine.length; j++) {
                var ss=j+1;
                if (ss==dialog.userInput.text) {
                    dialog.userInput.types.valentineitemlist = context.session.valentine[j];
                    return callback(true);
                }
            }
        }
        callback(false);
    }
});

bot.setTask('showvalentineitem', {
    action: function (dialog, context, callback) {
        var modelname = "flower_moneybrain_category";
        var options = {};
        options.url = 'http://template-dev.moneybrain.ai:8443/api/' + modelname;
        options.qs = {
            _id: dialog.userInput.types.valentineitemlist._id
        };
        request.get(options, function (err, response, body) {
            if (err) {
                console.log('err:' + err);
            }
            else {
                body = JSON.parse(body);
                console.log(response.statusCode);

                context.session.item = body;
                var outputcount = 0;

                context.session.selecteditem = {};
                context.session.selecteditem = context.session.item[0];

                context.session.selecteditem.sale_price = context.session.item[0].sale_price;

                if (context.session.item[0].picture !== undefined) {
                    dialog.output[outputcount].image = {url: context.session.item[0].picture};
                    dialog.output[outputcount].buttons = [
                        {
                            text: '주문하기',
                            url: context.session.item[0].inforpay
                        },
                        {
                            text: '이전으로 가기',
                            url: ""
                        },
                        {
                            text: '처음으로 돌아가기',
                            url: ""
                        }
                    ];
                }
                callback();
            }
        });
    }
});
};


