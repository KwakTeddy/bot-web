var path = require('path');
var request = require('request');

module.exports = function(bot)
{
    var messages = require(path.resolve('engine2/messages.js'));

    bot.setTask('defaultTask',
    {
        action: function(conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('addButton',
    {
        action: function (conversation, context, callback)
        {
            task.buttons = [];
            callback();
        }
    });


    bot.setTask('searchUser',
    {
        action: function (conversation, context, callback)
        {
            console.log('컨텍스트 : ', context.user);

          	var options = {};
          	options.url = 'http://sam.moneybrain.ai:3000/api';
          	options.json = {};
          	options.json.name = 'ZCS_CUSTOMER_INFO';
          	options.json.param = [
            	{ key: 'I_NAME', val: context.user.customerName },
              	{ key: 'I_BIRTH', val: context.user.customerBirth },
                { key: 'I_PHONE', val: context.types.mobile }
            ];
          
          	request.post(options, function(err, response, body)
            {
              	if(err)
                {
                    console.log(err);
                }
				else
    	        {
                    console.log('개쩐다 : ', typeof body, body);
    	            if(body.E_RETCD == 'E')
                    {
                        // conversation.dialog.output = body.E_RETMG + '\n다시 인증을 부탁드립니다.';
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        context.user.customerInfo = {
                            name: context.user.customerName,
                            birth: context.user.customerBirth,
                            phone: context.types.mobile
                        };
                    }else {
    	                console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('getCustomerList',
    {
        action: function (conversation, context, callback)
        {
            if(context.user.auth)
            {
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CUSTOMER_INFO';
                options.json.param = [
                    { key: 'I_NAME', val: context.user.customerName },
                    { key: 'I_BIRTH', val: context.user.customerBirth },
                    { key: 'I_PHONE', val: context.types.mobile }
                ];

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log('개쩐다 : ', typeof body, body);
                        if(body.E_RETCD == 'E')
                        {
                            // conversation.dialog.output = body.E_RETMG + '\n다시 인증을 부탁드립니다.';
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            context.user.customerInfo = {
                                name: context.user.customerName,
                                birth: context.user.customerBirth,
                                phone: context.types.mobile
                            };


                            var data =
                                [
                                    {
                                        customerName: "박준하",
                                        address: "서울시 관악구 행운동12",
                                        id: "1235534"
                                    },
                                    {
                                        customerName: "김지섭",
                                        address: "서울시 도봉구 덕릉로 12344",
                                        id: "45344004"
                                    }
                                ];

                            context.customerList = data;

                            conversation.buttons = [];

                            for(var i = 0; i < data.length; i++)
                            {
                                conversation.buttons.push({text: i + 1})
                            }

                        }else {
                            console.log(body.E_RETCD)
                        }

                        callback();
                    }
                });
            }
            else
            {
                callback();
            }
        }
    });

    bot.setType('customerListType',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;
            var selected = undefined;
            var customerList = context.customerList;
            for(var i = 0; i < customerList.length; i++)
            {
                if(i + 1 == conversation.nlu.inputRaw)
                {
                    selected = customerList[i];
                    break;
                }
            }

            if(selected)
            {
                context.curCustomer = selected;
                matched = true;
            }
            else
            {
                context.curCustomer = undefined;
                matched = false;
            }

            callback(matched);
        }
    });

    bot.setType('monthType',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;
            if(conversation.nlu.inputRaw.includes("개월") > 0)
            {
                matched = true;
            }

            callback(matched);
        }
    });

    bot.setTask('getNoticeHistory',
    {
        action: function (conversation, context, callback)
        {
            var word = conversation.nlu.inputRaw;
            var num = parseInt(word);

            //get Data
            var data = [
                {
                    date: "2017.3",
                    method: "신용카드 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.4",
                    method: "지로용지 납부",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.5",
                    method: "은행 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                }
            ];
            context.noticeNum = num;
            context.noticeHistory = data;

            conversation.buttons = [];
            for(var i = 0; i < data.length; i++)
            {
                conversation.buttons.push({text: data[i].date + "월 상세보기"});
            }

            callback();
        }
    });

    bot.setTask('getNoticeDetail',
    {
        action: function (conversation, context, callback)
        {
            //get Data
            var data = [
                {
                    date: "2017.3.5",
                    method: "신용카드 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                }
            ];

            conversation.dialog.output = data[0].date + '/'+ data[0].method;

            console.log('컨버세이션 ', conversation.dialog);

            callback();
        }
    });

    bot.setTask('getPaymentHistory',
    {
        action: function (conversation, context, callback)
        {
            var word = conversation.nlu.inputRaw;
            var num = parseInt(word);

            //get Data
            var data = [
                {
                    date: "2017.3",
                    method: "신용카드 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.4",
                    method: "지로용지 납부",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.5",
                    method: "은행 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                }
            ];

            context.listNum = num;
            context.paymentHistory = data;
            conversation.buttons = [];

            for(var i = 0; i < data.length; i++)
            {
                conversation.buttons.push({text: data[i].date + "월 상세보기"});
            }

            callback();
        }
    });

    bot.setTask('getPaymentDetail',
    {
        action: function (conversation, context, callback)
        {
            var word = conversation.nlu.inputRaw;

            //get Data
            var data = [
                {
                    date: "2017.3.5",
                    method: "신용카드 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                }
            ];

            conversation.dialog.output = data[0].date + '/' + data[0].method;
            callback();
        }
    });


    bot.setTask('getNonpaymentList',
    {
        action: function (conversation, context, callback)
        {
            //get Data
            var data = [
                {
                    date: "2017.3",
                    method: "신용카드 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.4",
                    method: "지로용지 납부",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                },
                {
                    date: "2017.5",
                    method: "은행 자동이체",
                    noticeVal : 1000,
                    payment: 500,
                    paymentDate: "2017.4.5"
                }
            ];

            context.nonpaymentHistory = data;

            callback();
        }
    });

    bot.setTask('sendSMSAuth',
    {
        action: function (conversation, context, callback)
        {
            var request = require('request');

            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);

            var message = '[' + context.bot.name + ']' + ' 인증번호 : ' + randomNum;

            request.post(
                'https://bot.moneybrain.ai/api/messages/sms/send',
                // 'http://dev.moneybrain.ai:8443/api/messages/sms/send',
                {json: {callbackPhone: config.callcenter, phone: conversation.mobile, message: message}},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        task._result = body.result;
                        task._resultMessage = body.resultMessage;
                    } else {
                        task._result = 'FAIL';
                        task._resultMessage = 'HTTP ERROR';
                    }

                    context.smsAuth = randomNum;
                    callback();
                }
            );
        }
    });


 
   bot.setType('saveCustomerName',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;
            var word = conversation.nlu.inputRaw;
            var regExp = new RegExp('[가-힣]{2,4}', "g");
            if(regExp.exec(word))
            {
                context.user.customerName = word;
                matched = true;
            }

            callback(matched);
        }
    });

    bot.setType('saveCustomerBirth',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;
            var word = conversation.nlu.inputRaw;
            var regexp = new RegExp("[0-9]{6}", "g");

            if(regexp.exec(word))
            {
                context.user.customerBirth = word;
                matched = true;
            }

            callback(matched);
        }
    });

    bot.setTask('getAuth',
    {
        action: function (conversation, context, callback)
        {
            if(!context.user.auth)
            {
                //DB연동
                //있으면 context.user.auth = true;
            }

            callback();
        }
    });

    bot.setTask('verifyCode',
    {
        action: function (conversation, context, callback)
        {
            var word = conversation.nlu.inputRaw;

            if(context.smsAuth == word.replace(/\s*/g, ''))
            {
                context.user.mobile = conversation.mobile;
            }

            callback();
        }
    });


    bot.setType('email',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = true;
            callback(matched);
        }
    });


    bot.setTask('getAccoutList',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setType('selectedAccountType',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = true;
            callback(matched);
        }
    });


    bot.setTask('getNoticeMethod',
    {
        action: function (conversation, context, callback)
        {
            var methodIdex =
            {
                '0001' : '우편송달',
                '0002' : '고객센터송달',
                '0003' : '이메일송달',
                '0004' : '모바일송달',
                '0005' : 'LMS송달',
                '0006' : '카카오알림톡송달',
                '0007' : '카카오청구서송달'
            };

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_TYPE_INFO';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'}
            ];

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        console.log('##########')
                        console.log(body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        context.user.curNoticeMethod = methodIdex[body['E_SENDCONTROL_GP']];
                        console.log('@@@@@@@@@@@@@@@')
                        console.log(body)
                    }else {
                        console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
        }
    });


    bot.setTask('setNoticeMethod_kkopay',
    {
        action: function (conversation, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_KKOPAY_REQUEST';
            options.json.param = [
                { key: 'I_VKONT', val: '110591507' },
                { key: 'I_HPNUM', val: '01088588151' }
            ];

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        console.log('##########')
                        console.log(body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        conversation.setNoticeMethodSuccess = true; //TODO conversation으로 교체
                        console.log('@@@@@@@@@@@@@@@')
                        console.log(body)
                    }else {
                        console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('setNoticeMethod_lms',
        {
            action: function (conversation, context, callback)
            {
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_LMS_REQUEST';
                options.json.param = [
                    { key: 'I_VKONT', val: '110591507' },
                    { key: 'I_HPNUM', val: '01088588151' }
                ];

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        if(body.E_RETCD == 'E')
                        {
                            console.log('##########')
                            console.log(body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            conversation.setNoticeMethodSuccess = true;
                            console.log('@@@@@@@@@@@@@@@')
                            console.log(body)
                        }else {
                            console.log(body.E_RETCD)
                        }

                        callback();
                    }
                });
            }
        });

    bot.setTask('setNoticeMethod_email',
    {
        action: function (conversation, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_EMAIL_REQUEST';
            options.json.param = [
                { key: 'I_VKONT', val: '1105391507' },
                { key: 'I_EMAIL', val: '5709psy@moneybrain.ai' }
            ];
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        console.log('##########')
                        console.log(body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        conversation.setNoticeMethodSuccess = true;
                        console.log('@@@@@@@@@@@@@@@')
                        console.log(body)
                    }else {
                        console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('cancelNoticeMethod',
        {
            action: function (conversation, context, callback)
            {
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_CANCEL';
                options.json.param = [
                    { key: 'I_VKONT', val: '1105391507' }
                ];
                options.timeout = 7000;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {no
                        console.log(err);
                    }
                    else
                    {
                        if(body.E_RETCD == 'E')
                        {
                            console.log('##########')
                            console.log(body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            conversation.setNoticeMethodSuccess = true;
                            console.log('@@@@@@@@@@@@@@@')
                            console.log(body)
                        }else {
                            console.log(body.E_RETCD)
                        }

                        callback();
                    }
                });
            }
        });



    bot.setTask('getPaymentMethod',
    {
        action: function (conversation, context, callback)
        {

            var methodIdex =
            {
                'A': '비자동이체',
                'D': '은행자동이체',
                'K': '카드자동이체'
            };

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GET_PAYMENT_METHOD';
            options.json.param = [
                { key: 'I_VKONT', val: '1105391507' }
            ];
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        console.log('##########')
                        console.log(body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log('!@#!#!#!!R#R!R!')
                        console.log(body['E_EZAWE']);
                        if(body['E_EZAWE'] == '')
                        {
                            body['E_EZAWE'] = 'A'
                        }
                        conversation.curPaymentMethod = methodIdex[body['E_EZAWE']];
                        console.log('@@@@@@@@@@@@@@@')
                        console.log(conversation)
                        console.log(body)
                    }else {
                        console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('getErrMsg',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('getSafetyCheckResult',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('getSafetyCheckMonth',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('sendNotiTalk',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('searchCustomerCenter',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('authConfirm',
    {
        action: function (conversation, context, callback)
        {
            context.user.auth = true;
            callback();
        }
    });
};
