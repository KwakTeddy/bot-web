var path = require('path');

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
            if(true)
            {
                context.user.customerInfo = {};
            }
            else
            {

            }

            callback();
        }
    });

    bot.setTask('getCustomerList',
    {
        action: function (conversation, context, callback)
        {
            if(context.user.auth)
            {
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
            }

            callback();
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
            callback();
        }
    });


    bot.setTask('setNoticeMethod',
    {
        action: function (conversation, context, callback)
        {
            callback();
        }
    });

    bot.setTask('getPaymentMethod',
    {
        action: function (conversation, context, callback)
        {
            callback();
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
