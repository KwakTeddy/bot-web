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

    var errorHandler = function (dialog, errData)
    {
        console.log(errData);

        if(errData.E_RETCD)
        {
            dialog.output[0].text = '[알림]\n\n메세지 : "' +  errData.E_RETMG + '"\n\n 처음으로 돌아가기 원하시면 "처음"이라고 입력해주세요.';
            dialog.output[0].buttons = [];
        }
        else
        {
            dialog.output[0].text = '[에러]\n\n에러 메세지 : "예상하지 못한 에러가 발생했습니다."\n\n위와 같은 에러가 계속 될 시 에러 메세지와 함께 문의 바랍니다. 처음으로 돌아가기 원하시면 "처음"이라고 입력해주세요.';
        }
    };
    
    var timeout = 7000;


    //Type Area

    bot.setType('customerListType',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var selected = undefined;
            var customerList = context.customerList;
            for(var i = 0; i < customerList.length; i++)
            {
                if(i + 1 == dialog.userInput.text)
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
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var word = dialog.userInput.text;
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
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var word = dialog.userInput.text;
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
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var word = dialog.userInput.text;
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
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;

            var regExp = new RegExp('^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$', 'g');
            var result = regExp.exec(dialog.userInput.text);

            if(result)
            {
                context.curCustomer.email = dialog.userInput.text;
                matched = true;
            }


            callback(matched);
        }
    });

    bot.setType('saveCustomerMobile',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var word = dialog.userInput.text;

            var regExp = new RegExp('\\b((?:010[-.]?\\d{4}|01[1|6|7|8|9][-.]?\\d{3,4})[-.]?\\d{4})\\b', 'g');
            if(regExp.exec(word))
            {
                matched = true;
                context.user.customerMobile = word;
            }


            callback(matched);
        }
    });

    bot.setType('multiMonthType',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var userInput = dialog.userInput.text.split(' ');
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
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            var bankArr = ['기업', '국민', '농협', '우리', '신한', '하나'];


            for(var i = 0; i < bankArr.length; i++)
            {
                if(dialog.userInput.text.indexOf(bankArr[i]) != -1)
                {
                    dialog.userInput.selectedBank = bankArr[i];
                    matched = true;
                    break;
                }
            }

            callback(matched);
        }
    });

    bot.setType('centerAddressType', {
        typeCheck: function (dialog, context, callback) {
            var matched = false;

            if(true)
            {
                context.centerAddress = dialog.userInput.text;
                matched =true;
            }

            callback(matched);
        }
    });

    //Task Area

    bot.setTask('defaultTask',
    {
        action: function(dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('addButton',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('searchSamchullyUser',
    {
        action: function (dialog, context, callback)
        {
          	var options = {};
          	options.url = 'http://sam.moneybrain.ai:3000/api';
          	options.json = {};
          	options.json.name = 'ZCS_CUSTOMER_INFO';
          	options.json.param = [
            	{ key: 'I_NAME', val: context.user.customerName },
              	{ key: 'I_BIRTH', val: context.user.customerBirth },
                { key: 'I_PHONE', val: context.user.customerMobile }
            ];
            options.json.isTable = true;
            options.timeout = timeout;

          	request.post(options, function(err, response, body)
            {
              	if(err)
                {
                    errorHandler(dialog, err);
                }
				else
    	        {
    	            if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        context.customerList = body.data.E_TAB;
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('getCustomerList',
    {
        action: function (dialog, context, callback)
        {
            if(context.user.auth)
            {
                var customerList = context.customerList;
                dialog.output[0].buttons = [];

                for(var i = 0; i < customerList.length; i++)
                {
                    dialog.output[0].buttons.push({text: (i + 1) + ''});
                }
            }

            callback();

        }
    });

    bot.setTask('getNoticeHistory',
    {
        action: function (dialog, context, callback)
        {

            var monthIdx = monthIndex[context.selectedMonth];
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZBI_MS_GOJI_LIST';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT},
                { key: 'I_GUBUN', val: monthIdx }
            ];
            options.json.isTable = true;
            options.timeout = timeout;
            console.log(JSON.stringify(options))

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        var data = body.data.ET_TABLE;
                        context.noticeHistory = data;
                        console.log(context.noticeHistory)

                        dialog.output[0].buttons = [];
                        for(var i = 0; i < data.length; i++)
                        {
                            dialog.output[0].buttons.push({text: data[i].BILLING_PERIOD});
                        }


                    }else {
                        errorHandler(dialog, body);
                    }
                    callback();

                }
            });

        }
    });

    bot.setTask('getNoticeDetail',
    {
        action: function (dialog, context, callback)
        {
            for(var i = 0; i < context.noticeHistory.length; i++)
            {
                if(context.noticeHistory[i].BILLING_PERIOD == dialog.userInput.text)
                {
                    dialog.noticeDetail = context.noticeHistory[i];
                    break;
                }
            }
            callback();
        }
    });

    bot.setTask('getPaymentHistory',
    {
        action: function (dialog, context, callback)
        {
            var monthIdx = monthIndex[context.selectedMonth];
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZFC_MS_PAYMENT';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT},
                { key: 'I_GUBUN', val: monthIdx }
            ];
            options.json.isTable = true;
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(JSON.stringify(body, null, 4));
                        var data = body.data.ET_TABLE;
                        context.paymentHistory = data;

                    }else {
                        errorHandler(dialog, body);
                    }
                    callback();
                }
            });
        }
    });

    bot.setTask('getPaymentDetail',
    {
        action: function (dialog, context, callback)
        {
            for(var i = 0; i < context.paymentHistory.length; i++)
            {
                if(context.paymentHistory[i].YYYYMM == dialog.userInput.text)
                {
                    dialog.paymentDetail = context.paymentHistory[i];
                    break;
                }
            }
            callback();
        }
    });

    bot.setTask('getNonpaymentList',
    {
        action: function (dialog, context, callback)
        {

            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CHECK_NOTI_AMT';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT}
            ];
            options.json.isTable = true;
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
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
                            errorHandler(dialog, body);
                        }
                    }
                    else
                    {
                        errorHandler(dialog, body);
                    }
                    callback();

                }
            });
        }
    });

    bot.setTask('getAuth',
    {
        action: function (dialog, context, callback)
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
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CB_COMMON_ACCINFO';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT}
            ];
            options.timeout = timeout;

            options.json.isTable = true;
            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        context.nonpaymentHistory = [];

                        var data = body.data.ET_TABLE;
                        dialog.output[0].buttons = [];

                        var idx = 1;

                        for(var i = 0; i < data.length; i++)
                        {
                            if(data[i].BANKN != '')
                            {
                                context.nonpaymentHistory.push(data[i]);
                            }
                            else
                            {

                                dialog.output[0].buttons.push({text: data[i].BANKA + '입금전용계좌 생성'});
                                // dialog.output[0].buttons.push({text: idx + '. ' + data[i].BANKA + '입금전용계좌 생성'});
                                idx++;

                            }
                        }

                    }else {
                        errorHandler(dialog, body);
                    }
                    callback();

                }
            });
        }
    });

    bot.setTask('createDepositAccount',
    {
        action: function (dialog, context, callback)
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
                var selectedBank = bankIndex[dialog.userInput.selectedBank];
                var curCustomer = context.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CB_COMMON_ACCCRE';
                options.json.param = [
                    { key: 'I_VKONT', val: curCustomer.VKONT},
                    { key: 'I_BANKK', val: selectedBank }
                ];
                options.timeout = timeout;


            request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            dialog.createdBankAccount = body.E_BANKN;
                            console.log(body)
                        }else {
                            errorHandler(dialog, body);
                        }

                        callback();
                    }
                });
            }
    });

    bot.setTask('getNoticeMethod',
    {
        action: function (dialog, context, callback)
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
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_TYPE_INFO';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT}
            ];
            options.timeout = timeout;


            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        dialog.curNoticeMethod = methodIdex[body['E_SENDCONTROL_GP']];
                        dialog.curNoticeMethodCategory = parseInt(body['E_SENDCONTROL_GP']);
                        console.log(dialog.curNoticeMethod)
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('setNoticeMethod_kkopay',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_KKOPAY_REQUEST';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT },
                { key: 'I_HPNUM', val: curCustomer.mobile }
            ];
            options.timeout = timeout;


            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        dialog.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('setNoticeMethod_lms',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_LMS_REQUEST';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT },
                { key: 'I_HPNUM', val: curCustomer.mobile }
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        dialog.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('setNoticeMethod_email',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_EMAIL_REQUEST';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT },
                { key: 'I_EMAIL', val: curCustomer.email }
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        dialog.setNoticeMethodSuccess = true;
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('cancelNoticeMethod',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GOJI_CANCEL';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT }
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body);
                        dialog.cancelNoticeMethodSuccess = true;
                    }
                    else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('resendNotice',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZBI_MS_GOJI_RESEND';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT }
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        dialog.setNoticeMethodSuccess = true;
                        console.log(body)
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('getPaymentMethod',
    {
        action: function (dialog, context, callback)
        {

            var methodIdex =
            {
                'A': '비자동이체',
                'D': '은행자동이체',
                'K': '카드자동이체'
            };
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_GET_PAYMENT_METHOD';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT }
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        if(body['E_EZAWE'] == '')
                        {
                            body['E_EZAWE'] = 'A'
                        }

                        dialog.curPaymentMethod = methodIdex[body['E_EZAWE']];
                        console.log(body)
                    }else {
                        errorHandler(dialog, err);
                    }
                    callback();
                }
            });
        }
    });

    bot.setTask('getErrMsg',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('getSafetyCheckResult',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('getSafetyCheckMonth',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('sendNotiTalk',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('searchCustomerCenter',
    {
        action: function (dialog, context, callback)
        {
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_CENTER_INFO';
            options.json.param = [
                { key: 'I_DONG', val: context.centerAddress}
            ];
            options.json.isTable = true;
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {
                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(JSON.stringify(body, null, 4))
                        context.centerAddressList = body.data.E_TAB;
                    }else {
                        errorHandler(dialog, body);
                    }

                    callback();
                }
            });
        }
    });

    bot.setTask('authConfirm',
    {
        action: function (dialog, context, callback)
        {
            for(var i = 0; i < context.customerList.length; i ++)
            {
                context.customerList[i]['mobile'] = context.user.customerMobile;
            }
            context.user.auth = true;
            callback();
        }
    });

    bot.setTask('payByARS',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;

            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_ARS_PAYMENT';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT},
                { key: 'I_HPNUM', val: curCustomer.mobile },
                { key: 'I_BETRWP', val: context.totalSelectedNonpayment}
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {

                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body)
                    }else {
                        errorHandler(dialog, body);
                    }
                    callback();

                }
            });
        }
    });

    bot.setTask('payByQR',
    {
        action: function (dialog, context, callback)
        {
            callback();
        }
    });

    bot.setTask('cancelAutoTransfer',
    {
        action: function (dialog, context, callback)
        {
            var curCustomer = context.curCustomer;
            var options = {};
            options.url = 'http://sam.moneybrain.ai:3000/api';
            options.json = {};
            options.json.name = 'ZCS_EXPIRE_SO';
            options.json.param = [
                { key: 'I_VKONT', val: curCustomer.VKONT}
            ];
            options.timeout = timeout;

            request.post(options, function(err, response, body)
            {
                if(err)
                {
                    errorHandler(dialog, err);
                }
                else
                {

                    if(body.E_RETCD == 'E')
                    {
                        errorHandler(dialog, body);
                    }
                    else if(body.E_RETCD == 'S')
                    {
                        console.log(body)
                    }else {
                        errorHandler(dialog, body);
                    }
                    callback();

                }
            });

        }
    });

};
