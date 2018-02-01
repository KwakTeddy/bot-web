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


            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZBI_MS_GOJI_LIST';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'},
                { key: 'I_GUBUN', val: num/3 }
            ];
            options.json.isTable = true;
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

                    }
                    else if(body.E_RETCD == 'S')
                    {
                        var data = body.data.ET_TABLE;
                        context.noticeNum = num;
                        context.noticeHistory = data;

                        conversation.dialog.output[0].buttons = [];
                        for(var i = 0; i < data.length; i++)
                        {
                            conversation.dialog.output[0].buttons.push({text: data[i].BILLING_PERIOD});
                        }


                    }else {
                        console.log(body.E_RETCD)
                    }
                    callback();

                }
            });

        }
    });

    bot.setTask('getNoticeDetail',
    {
        action: function (conversation, context, callback)
        {
            for(var i = 0; i < context.noticeHistory.length; i++)
            {
                if(context.noticeHistory[i].BILLING_PERIOD == conversation.nlu.inputRaw)
                {
                    conversation.noticeDetail = context.noticeHistory[i];
                    break;
                }
            }
            callback();
        }
    });

    bot.setTask('getPaymentHistory',
    {
        action: function (conversation, context, callback)
        {
            var word = conversation.nlu.inputRaw;
            var num = parseInt(word);


            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZFC_MS_PAYMENT';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'},
                { key: 'I_GUBUN', val: num/3 }
            ];
            options.json.isTable = true;
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
                        console.log('@@@@@@@@@@@@@@@')
                        console.log(body)

                        var data = body.data.ET_TABLE;
                        context.listNum = num;
                        context.paymentHistory = data;

                    }else {
                        console.log(body.E_RETCD)
                    }
                    callback();
                }
            });
        }
    });

    bot.setTask('getPaymentDetail',
    {
        action: function (conversation, context, callback)
        {
            for(var i = 0; i < context.paymentHistory.length; i++)
            {
                if(context.paymentHistory[i].YYYYMM == conversation.nlu.inputRaw)
                {
                    conversation.paymentDetail = context.paymentHistory[i];
                    break;
                }
            }
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

    bot.setType('email',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = true;
            callback(matched);
        }
    });


    bot.setTask('getAccountList',
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
            var matched = false;
            var bankArr = ['기업', '국민', '농협', '우리', '신한', '하나'];


            for(var i = 0; i < bankArr.length; i++)
            {
                if(conversation.nlu.inputRaw.indexOf(bankArr[i]) != -1)
                {
                    conversation.selectedBank = bankArr[i];
                    matched = true;
                    break;
                }
            }

            callback(matched);
        }
    });

    bot.setTask('createDepositAccount',
        {
            action: function (conversation, context, callback)
            {
                var bankIndex =
                {
                    '기업' : '003',
                    '국민' : '004',
                    '농협' : '011',
                    '우리' : '020',
                    '신한' : '026',
                    '하나' : '081'
                };
                var selectedBank = bankIndex[conversation.selectedBank];

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CB_COMMON_ACCCRE';
                options.json.param = [
                    { key: 'I_VKONT', val: '105831826'},
                    { key: 'I_BANKK', val: selectedBank }
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
                            conversation.createdBankAccount = body.E_BANKN;
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
                        conversation.curNoticeMethod = methodIdex[body['E_SENDCONTROL_GP']];
                        conversation.curNoticeMethodCategory = parseInt(body['E_SENDCONTROL_GP']);
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
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CENTER_INFO';
            options.json.param = [
                { key: 'I_DONG', val: '목동'}
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
                        console.log('##########');
                        console.log(body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log('@@@@@@@@@@@@@@@');
                        console.log(body)
                    }else {
                        console.log(body.E_RETCD)
                    }

                    callback();
                }
            });
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

    bot.setTask('payByARS',
    {
        action: function (conversation, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_ARS_PAYMENT';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'},
                { key: 'I_HPNUM', val: '01088588151' },
            ];
            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(body)

                    if(body.E_RETCD == 'E')
                    {

                        console.log(body)
                    }
                    else if(body.E_RETCD == 'S')
                    {

                        console.log(body)


                    }else {
                        console.log(body.E_RETCD)
                    }
                    callback();

                }
            });


            callback();
        }
    });

    bot.setTask('payByQR',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });



};
