var path = require('path');
var request = require('request');

module.exports = function(bot)
{

    //Variable Area

    var monthIndex =
    {
            3 : 1,
            6: 2,
            12: 3
    };

    var errorHandler = function (conversation, errData)
    {
        console.log(errData);

        if(errData.E_RETCD)
        {
            conversation.dialog.output[0].text = '[알림]\n\n메세지 : "' +  errData.E_RETMG + '"\n\n 처음으로 돌아가기 원하시면 "처음"이라고 입력해주세요.';
        }
        else
        {
            conversation.dialog.output[0].text = '[에러]\n\n에러 메세지 : "예상하지 못한 에러가 발생했습니다."\n\n위와 같은 에러가 계속 될 시 에러 메세지와 함께 문의 바랍니다. 처음으로 돌아가기 원하시면 "처음"이라고 입력해주세요.';
        }
    };


    //Type Area

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
            var word = conversation.nlu.inputRaw;
            var num = parseInt(word);
            if(num == 3 || num == 6 || num == 12)
            {
                context.selectedMonth = num;
                matched = true;
            }

            callback(matched);
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

    bot.setType('email',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;

            var regExp = new RegExp('^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\\.[a-zA-Z]{2,3}$', 'g');
            if(regExp.exec(conversation.nlu.inputRaw))
            {
                matched = true;
            }


            callback(matched);
        }
    });

    bot.setType('multiMonthType',
    {
        typeCheck: function (conversation, context, callback)
        {
            var matched = false;
            var userInput = conversation.nlu.inputRaw.split(' ');
            var nonPaymentList = context.nonpaymentHistory;
            var selected = context.selectedNonpayment = [];
            var total = 0;

            for(var i = 0; i < userInput.length; i++)
            {
                if(nonPaymentList[userInput[i] - 1])
                {
                    var alreadySelected = false;
                    for(var j = 0; j < selected.length; j++)
                    {
                        if(selected[j] == nonPaymentList[userInput[i] - 1])
                        {
                            alreadySelected = true;
                        }
                    }
                    if(!alreadySelected)
                    {
                        selected.push(nonPaymentList[userInput[i] - 1]);
                        matched = true;
                    }
                }
            }

            for(var k = 0; k < selected.length; k++)
            {
                total += parseInt(selected[k].BETRWP.replace(',', ''));
            }

            context.totalSelectedNonpayment = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g , ',');

            selected.sort(function (a, b)
            {
                return a.YYYYMM-b.YYYYMM;
            });
            callback(matched);
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

    bot.setType('centerAddressType', {
        typeCheck: function (conversation, context, callback) {
            var matched = false;

            if(true)
            {
                context.centerAddress = conversation.nlu.inputRaw;
                matched =true;
            }

            callback(matched);
        }
    });

    //Task Area

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

    bot.setTask('searchSamchullyUser',
    {
        action: function (conversation, context, callback)
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
                    errorHandler(conversation, err);
                }
				else
    	        {
                    console.log('개쩐다 : ', typeof body, body);
    	            if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
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
                        errorHandler(conversation, body);
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
                        errorHandler(conversation, err);
                    }
                    else
                    {
                        console.log('개쩐다 : ', typeof body, body);
                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(conversation, body);
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
                            errorHandler(conversation, body);
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

    bot.setTask('getNoticeHistory',
    {
        action: function (conversation, context, callback)
        {

            var monthIdx = monthIndex[context.selectedMonth];

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZBI_MS_GOJI_LIST';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826000'},
                { key: 'I_GUBUN', val: monthIdx }
            ];
            options.json.isTable = true;
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        var data = body.data.ET_TABLE;
                        context.noticeHistory = data;

                        conversation.dialog.output[0].buttons = [];
                        for(var i = 0; i < data.length; i++)
                        {
                            conversation.dialog.output[0].buttons.push({text: data[i].BILLING_PERIOD});
                        }


                    }else {
                        errorHandler(conversation, body);
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
            var monthIdx = monthIndex[context.selectedMonth];

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZFC_MS_PAYMENT';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'},
                { key: 'I_GUBUN', val: monthIdx }
            ];
            options.json.isTable = true;
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        var data = body.data.ET_TABLE;
                        context.paymentHistory = data;

                    }else {
                        errorHandler(conversation, body);
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

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CHECK_NOTI_AMT';
            options.json.param = [
                { key: 'I_VKONT', val: '110591507'}
            ];
            options.json.isTable = true;
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        if(body.data)
                        {
                            console.log(JSON.stringify(body, null, 4));
                            context.nonpaymentHistory = body.data.E_TAB;
                        }
                        else
                        {
                            body.E_RETMG = '테이블 데이터를 요구하지 않았습니다. 관리자에게 문의해주세요.';
                            errorHandler(conversation, body);
                        }
                    }
                    else
                    {
                        errorHandler(conversation, body);
                    }
                    callback();

                }
            });
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

    bot.setTask('getAccountList',
    {
        action: function (conversation, context, callback)
        {

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CB_COMMON_ACCINFO';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'}
            ];
            options.json.isTable = true;
            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        context.nonpaymentHistory = [];

                        var data = body.data.ET_TABLE;
                        conversation.dialog.output[0].buttons = [];

                        for(var i = 0; i < data.length; i++)
                        {
                            if(data[i].BANKN != '')
                            {
                                context.nonpaymentHistory.push(data[i]);
                            }
                            else
                            {
                                conversation.dialog.output[0].buttons.push({text: data[i].BANKA + '입금전용계좌 생성'});

                            }
                        }

                    }else {
                        errorHandler(conversation, body);
                    }
                    callback();

                }
            });
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
                        errorHandler(conversation, err);
                    }
                    else
                    {
                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(conversation, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            conversation.createdBankAccount = body.E_BANKN;
                            console.log(body)
                        }else {
                            errorHandler(conversation, body);
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
            options.timeout = 7000;


            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        conversation.curNoticeMethod = methodIdex[body['E_SENDCONTROL_GP']];
                        conversation.curNoticeMethodCategory = parseInt(body['E_SENDCONTROL_GP']);
                    }else {
                        errorHandler(conversation, body);
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
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        conversation.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(conversation, body);
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
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        conversation.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(conversation, body);
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
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        conversation.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(conversation, body);
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
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        conversation.cancelNoticeMethodSuccess = true;
                    }
                    else {
                        errorHandler(conversation, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('resendNotice',
    {
        action: function (conversation, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZBI_MS_GOJI_RESEND';
            options.json.param = [
                { key: 'I_VKONT', val: '1105391507' }
            ];
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        conversation.setNoticeMethodSuccess = true;
                        console.log(body)
                    }else {
                        errorHandler(conversation, body);
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
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        if(body['E_EZAWE'] == '')
                        {
                            body['E_EZAWE'] = 'A'
                        }

                        conversation.curPaymentMethod = methodIdex[body['E_EZAWE']];
                        console.log(body)
                    }else {
                        errorHandler(conversation, err);
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
                { key: 'I_DONG', val: context.centerAddress}
            ];
            options.json.isTable = true;
            options.timeout = 7000;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(JSON.stringify(body, null, 4))
                        context.centerAddressList = body.data.E_TAB;
                    }else {
                        errorHandler(conversation, body);
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
                { key: 'I_VKONT', val: '110591507'},
                { key: 'I_HPNUM', val: '01088588151' },
                { key: 'I_BETRWP', val: context.totalSelectedNonpayment}
            ];
            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {

                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body)
                    }else {
                        errorHandler(conversation, body);
                    }
                    callback();

                }
            });
        }
    });

    bot.setTask('payByQR',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('cancelAutoTransfer',
    {
        action: function (conversation, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_EXPIRE_SO';
            options.json.param = [
                { key: 'I_VKONT', val: '105831826'}
            ];
            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(conversation, err);
                }
                else
                {

                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(conversation, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body)
                    }else {
                        errorHandler(conversation, body);
                    }
                    callback();

                }
            });

        }
    });

};
