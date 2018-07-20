var request = require('request');
var async = require('async');
var path = require('path');

module.exports = function(bot)
{
   if(!reTry){
       var reTry = {};
   }
    reTry[bot.userKey]= {};
    reTry[bot.userKey].reTryId = '';
    reTry[bot.userKey].reTryName = '';

    //Variable Area
    var monthIndex =
    {
        1 : 4,
        3 : 1,
        6: 2,
        12: 3
    };

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

    var test_userData = {
        testmode:false,
        auth : true,
        customer : {
            NAME : '전재영',
            VSTELLE_ADDR : 'Dont know where',
            VKONT : '110116118',
            mobile : '01031994434'
        }
    };


    var add_bfBtn = (dialog, context) => {
        if(context.channel.name=='kakao'){
            if(dialog.output[0].text.indexOf('처음으로') === -1) {
                dialog.output[0].text = [dialog.output[0].text, '\n\n이전으로 돌아가시려면 \'ㄱ\' 을, 처음으로 돌아가시려면 \'ㄴ\' 를 입력해주세요.'].join("");
            }
        }else{
            dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
        }
    };

    var add_setCall = (dialog, context) => {
        if(context.channel.name == 'kakao'){
            if(dialog.id=='default3'){
                if(dialog.output[0].text.indexOf('처음으로') === -1) {
                    dialog.output[0].text = [dialog.output[0].text, '\n\n이전으로 돌아가시려면 \'ㄱ\' 을, 처음으로 돌아가시려면 \'ㄴ\' 를 입력해주세요.'].join("");
                }
            }else{
                dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
            }
        }else{
            dialog.output[0].buttons = [{"text": "고객센터 전화하기", "url": "tel:+15443002"}, {text: '이전'}, {text: '처음'}];
        }
    };

    var bankArr = ['기업은행', '국민은행', '농협', '우리은행', '신한은행', '하나은행'];

    var mobileFormatChange = function (mobile) {
        return mobile.replace(/-/g, '');
    };

    var minusDataFormatChange = function (data)
    {
        for(var key in data)
        {
            if(data[key].slice(-1) == '-')
            {
                data[key] = '-' + data[key].slice(0, data[key].length - 1);
            }
        }
    };

    var addDefaultButton = function (dialog, onlyStart) {
        if(!dialog.output[0].buttons) dialog.output[0].buttons =[];

        if(onlyStart)
        {
            dialog.output[0].buttons.push({text: '처음'});
        }
        else
        {
            dialog.output[0].buttons.push({text: '이전'});
            dialog.output[0].buttons.push({text: '처음'});
        }
    };

    var errorHandler = function (dialog, errData)
    {
        console.log(JSON.stringify(errData, null, 4));

        if(!errData)
        {
            dialog.output[0].text = '[에러]\n\n"결과 값이 없습니다."';
            dialog.output[0].buttons = [{text: '처음'}];
            return
        }

        if(errData.msg && errData.msg == "CONNECTIONERR")
        {
            reTry[bot.userKey].reTryId = dialog.id;
            reTry[bot.userKey].reTryName = dialog.card.name;

            dialog.output[0].text = '[에러]\n\n"연결이 지연되고 있습니다. 재시도 부탁드립니다. 연결 지연이 계속될 경우, 고객센터로 문의해주세요. 고객센터 전화 (1544-3002)"';
            dialog.output[0].buttons = [{text: '재시도'}, {text: '처음'}];
            return
        }

        if(errData.msg && errData.msg == "SELECTERROR")
        {
            dialog.output[0].text = '[에러]\n\n"죄송합니다.\n요금납부는 과거 미납요금부터 납부하실 수 있습니다.\n과거 고지년월의 번호부터 입력해주세요."\n\n예시 : 1 2';
            dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
            return
        }

        if(errData.msg && errData.msg == "access_error")
        {
            dialog.output[0].text = '[에러]\n\n"자가검침 기간이 아닙니다.\n\n지정된 검침기간에만 자가검침값 등록이 가능합니다.\n검침 등록 안내 메시지를 받으신 후에 입력 부탁드립니다."';
            dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
            return
        }

        if(errData.E_RETCD && !errData.msg)
        {
            dialog.output[0].text = '[알림]\n\n' +  errData.E_RETMG;
            dialog.output[0].buttons = [];
            addDefaultButton(dialog);
        }
        else if(!errData.msg)
        {
            if(errData.code &&  errData.code == "ESOCKETTIMEDOUT")
            {
                dialog.output[0].text = '[에러]\n\n"시간 지연 오류가 발생했습니다."';
                dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
            }
            else
            {
                dialog.output[0].text = '[에러]\n\n"예상하지 못한 에러가 발생했습니다."\n\n위와 같은 에러가 계속 될 시 에러 메세지와 함께 문의 바랍니다. 처음으로 돌아가기 원하시면 "처음"이라고 입력해주세요.';
            }
        }
    };

    var dateFormatChange = function (dateString) {
        var newStr;
        if(dateString && dateString.length == 6)
        {
            newStr = dateString.slice(0, 4) + '년 ' + dateString.slice(4, 6) + '월';

        }
        else if(dateString && dateString.length == 8)
        {
            newStr = dateString.slice(0, 4) + '년 ' + dateString.slice(4, 6) + '월 ' + dateString.slice(6, 8) + '일';
        }
        return newStr ? newStr : dateString;
    };

    var timeout = 4000;


    //Type Area

    bot.setType('customerListType',
        {
            typeCheck: function (dialog, context, callback)
            {

                var matched = false;
                var selected = undefined;
                var customerList = context.session.customerList;
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
                    context.session.curCustomer = selected;
                    matched = true;
                }
                else
                {
                    context.session.curCustomer = undefined;
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
                if(num == 1 || num == 3 || num == 6 || num == 12)
                {
                    context.session.selectedMonth = num;
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
                    context.session.customerName = word;
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
                    context.session.customerBirth = word;
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
                    context.session.curCustomer.email = dialog.userInput.text;
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

                    if(word.indexOf('-') != -1) word = mobileFormatChange(word);
                    context.session.customerMobile = word;
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

                var nonPaymentList = context.session.nonpaymentHistory;
                var selected = context.session.selectedNonpayment = [];
                var total = 0;

                if (!nonPaymentList) {
                    context.session.isMultiMonthError = 'true';
                    callback(matched);
                    return null;
                }

                    var indexOf1 = userInput.indexOf('1');
                    if (indexOf1 === -1) {
                        context.session.isMultiMonthError = 'true';
                        callback(matched);
                        return null;
                    }
                    else {
                        for (var n = indexOf1 + 1; n < userInput.length; n++) {
                            if (userInput[n] !== userInput[n - 1] + 1) {
                                context.session.isMultiMonthError = 'true';
                                callback(matched);
                                return null;
                            }
                        }
                    }

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
                            nonPaymentList[userInput[i] - 1].userIdx = userInput[i];
                            selected.push(nonPaymentList[userInput[i] - 1]);
                            matched = true;
                        }
                    }
                }

                for(var k = 0; k < selected.length; k++)
                {
                    total += parseInt(selected[k].BETRWP.replace(',', ''));
                }

                context.session.totalSelectedNonpayment = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g , ',');

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
                bankArr = ['기업', '국민', '농협', '우리', '신한', '하나'];


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
                context.session.centerAddress = dialog.userInput.text;
                matched =true;
            }

            callback(matched);
        }
    });

    //Task Area
    bot.setTask('setCall',{
        action: function(dialog, context, callback){
            add_setCall(dialog, context);
            callback();
        }
    });

    bot.setTask('setCenterCall',{
        action: function(dialog, context, callback){
            dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
            if(context.channel.name=='kakao'){
                dialog.output[0].text = '접수를 위해 종합상황실로 전화 부탁드립니다.\n종합상황실 전화번호 (080-3002-119)\n\n사고관련 신고 이외 문의사항은 고객센터로 문의 바랍니다. 고객센터 전화번호 (1544-3002)';
            }else{
                dialog.output[0].text = '접수를 위해 종합상황실로 전화 부탁드립니다.\n\n사고관련 신고 이외 문의사항은 고객센터로 문의 바랍니다.';
                dialog.output[0].buttons.unshift({"text": "종합상황실 전화하기", "url": "tel:+0803002119"});
                dialog.output[0].buttons.unshift({"text": "고객센터 전화하기", "url": "tel:+15443002"});
            }
            callback();
        }
    });


    bot.setTask('monthSelectError',{
        action: function(dialog, context, callback){

            if(context.session.isMultiMonthError === 'true'){
                context.session.isMultiMonthError = 'false';
                if(!context.session.nonpaymentHistory){
                    var Error = {};
                    Error.E_RETCD = 'E';
                    Error.E_RETMG = '조회된 미납금액이 없습니다.';
                    errorHandler(dialog, Error);
                }
                else {
                    var err = {msg: 'SELECTERROR'};
                    errorHandler(dialog, err);
                }
            }
            callback();
        }
    });

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
                add_bfBtn(dialog, context);
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
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_NAME', val: context.session.customerName },
                    { key: 'I_BIRTH', val: context.session.customerBirth },
                    { key: 'I_PHONE', val: context.session.customerMobile }
                ];
                options.json.isTable = true;
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            body.E_RETMG = '조회된 내역이 없습니다. 고객정보를 정확히 확인해 주세요.';
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            context.session.customerList = body.data.E_TAB;

                            for(var i=0; i<context.session.customerList.length; i++)
                            {
                                if(context.session.customerList[i].VKONT.startsWith('000'))
                                {
                                    context.session.customerList[i].VKONT = context.session.customerList[i].VKONT.substring(3);
                                }
                            }
                        }else {
                            errorHandler(dialog, body);
                        }
                    }
                    callback();
                });
            }
        });

    bot.setTask('getCustomerList',
        {
            action: function (dialog, context, callback)
            {
                var customerList = context.session.customerList;

                if(context.session.auth && customerList.length != 1)
                {
                    dialog.output[0].buttons = [];
                    for(var i = 0; i < customerList.length; i++)
                    {
                        dialog.output[0].buttons.push({text: (i + 1) + ''});
                    }

                    addDefaultButton(dialog);
                }
                else if(context.session.auth && customerList.length == 1)
                {
                    context.session.curCustomer = customerList[0];
                }

                callback();

            }
        });

    bot.setTask('selfRFC',
        {
            action: function (dialog, context, callback)
            {
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_KKO_MESSAGE_SEND';
                options.json.channel = context.channel.name;

                // test param
                //var curCustomer = context.session.curCustomer;
                //
                //options.json.param = [
                //    { key: 'I_VKONT', val: '000301926016'},
                //    { key: 'I_HPNO', val: '01029253152' }
                //];

                var curCustomer = context.session.curCustomer;

                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_HPNO', val: curCustomer.mobile }
                ];

                request.post(options, function(err, response, body)
                {
                    var replace_error_msg = { "msg": "access_error", "E_RETCD": "E", "E_RETMG": "" };
                    if(err)
                    {
                        errorHandler(dialog, replace_error_msg);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, replace_error_msg);
                        }
                        else if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, replace_error_msg);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                        }
                        else
                        {
                            errorHandler(dialog, replace_error_msg);
                        }
                    }
                    callback();

                });
            }
        });

    bot.setTask('getNoticeHistory',
        {
            action: function (dialog, context, callback)
            {
                var monthIdx = monthIndex[context.session.selectedMonth];
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZBI_MS_GOJI_LIST';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_GUBUN', val: monthIdx }
                ];
                options.json.isTable = true;
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            var data = body.data.ET_TABLE;
                            dialog.output[0].buttons = [];
                            for(var i = 0; i < data.length; i++)
                            {


                                minusDataFormatChange(data[i]);

                                data[i].BILLING_PERIOD = dateFormatChange(data[i].BILLING_PERIOD);
                                data[i].FAEDN = dateFormatChange(data[i].FAEDN);
                                dialog.output[0].buttons.push({text: data[i].BILLING_PERIOD});
                            }
                            context.session.noticeHistory = data;
                            console.log(context.session.noticeHistory);
                            addDefaultButton(dialog);

                        }else {
                            errorHandler(dialog, body);
                        }
                    }
                    callback();

                });

            }
        });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    bot.setTask('getNoticeDetail',
        {
            action: function (dialog, context, callback)
            {
                console.log('노티스 히스토리 : ', context.session.noticeHistory);
                if(context.session.selectedMonth === 1){

                    dialog.noticeDetail = context.session.noticeHistory[0];

                    dialog.noticeDetail.PR_ZWSTNDAB = numberWithCommas(dialog.noticeDetail.PR_ZWSTNDAB);

                    var split1 = dialog.noticeDetail.USED_CALORY.split('.');

                    dialog.noticeDetail.USED_CALORY = numberWithCommas(split1[0]) + (split1[1] ? '.' + split1[1] : '');

                    callback();

                }else{

                    for(var i = 0; i < context.session.noticeHistory.length; i++)
                    {
                        if(context.session.noticeHistory[i].BILLING_PERIOD == dialog.userInput.text)
                        {
                            dialog.noticeDetail = context.session.noticeHistory[i];

                            dialog.noticeDetail.PR_ZWSTNDAB = numberWithCommas(dialog.noticeDetail.PR_ZWSTNDAB);

                            var split = dialog.noticeDetail.USED_CALORY.split('.');

                            dialog.noticeDetail.USED_CALORY = numberWithCommas(split[0]) + (split[1] ? '.' + split[1] : '');

                            break;
                        }
                    }
                    callback();

                }
            }
        });

    bot.setTask('getPaymentHistory',
        {
            action: function (dialog, context, callback)
            {
                var monthIdx = monthIndex[context.session.selectedMonth];
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZFC_MS_PAYMENT';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_GUBUN', val: monthIdx }
                ];
                options.json.isTable = true;
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            console.log(JSON.stringify(body, null, 4));
                            var data = body.data.ET_TABLE;

                            for(var i = 0; i < data.length; i++)
                            {
                                data[i].YYYYMM = dateFormatChange(data[i].YYYYMM);
                                data[i].BUDAT = dateFormatChange(data[i].BUDAT);
                            }
                            context.session.paymentHistory = data;

                        }else {console.log('444444444');
                            errorHandler(dialog, body);
                        }
                    }
                    callback();
                });
            }
        });

    bot.setTask('getPaymentDetail',
        {
            action: function (dialog, context, callback)
            {

                if(context.session.selectedMonth === 1){

                    dialog.paymentDetail = context.session.paymentHistory[0];

                    callback();

                }else {
                    for (var i = 0; i < context.session.paymentHistory.length; i++) {
                        if (context.session.paymentHistory[i].YYYYMM == dialog.userInput.text) {
                            dialog.paymentDetail = context.session.paymentHistory[i];
                            break;
                        }
                    }
                    callback();
                }
            }
        });

    bot.setTask('getNonpaymentList',
        {
            action: function (dialog, context, callback)
            {

                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CHECK_NOTI_AMT';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                options.json.isTable = true;


                // for test
                //var options = {};
                //options.url = 'http://sam.moneybrain.ai:3000/api';
                //options.json = {};
                //options.json.name = 'ZCS_CHECK_NOTI_AMT';
                //options.json.channel = context.channel.name;
                //options.json.param = [
                //    { key: 'I_VKONT', val: '000105937945'}
                //];
                //options.json.isTable = true;



                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }
                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            if(body.data)
                            {
                                console.log(JSON.stringify(body, null, 4));
                                var data = body.data.E_TAB;

                                for(var i = 0 ; i < data.length; i++)
                                {
                                    data[i].YYYYMM = dateFormatChange(data[i].YYYYMM);
                                    data[i].FAEDN = dateFormatChange(data[i].FAEDN);

                                }

                                data.sort(function(a, b){
                                    return a.FAEDN - b.FAEDN
                                });

                                context.session.nonpaymentHistory = data;

                                add_bfBtn(dialog, context);
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

                    }
                    callback();

                });
            }
        });

    bot.setTask('getAuth',
        {
            action: function (dialog, context, callback)
            {
                if(dialog.userInput.text === '시작하기'){
                    context.session.isFirst = false;
                }

                if(!context.session.auth)
                {
                    //DB연동
                    //있으면 context.session.auth = true;


                    // for through authorization
                    if(test_userData.testmode){
                        context.session.auth = test_userData.auth;
                        context.session.customerList = customerList = [test_userData.customer];
                        context.session.curCustomer = customerList[0];
                    }

                }

                var arr = dialog.output[0].buttons;

                if(context.session.auth && arr[arr.length-1].text!='로그아웃')
                {
                    dialog.output[0].buttons.push({text: '로그아웃'});
                }

                reTry[bot.userKey].reTryId = '';
                reTry[bot.userKey].reTryName = '';

                callback();
            }
        });

    bot.setTask('getAccountList',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CB_COMMON_ACCINFO';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                ////options.timeout = timeout;

                options.json.isTable = true;
                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            var data = body.data.ET_TABLE;
                            dialog.output[0].buttons = [];
                            context.session.nonpaymentHistory = [];

                            var bankText = bankArr.join(' ');
                            for(var i=0; i<data.length; i++)
                            {
                                if(bankText.indexOf(data[i].BANKA) == -1)
                                {
                                    continue;
                                }

                                if(!data[i].BANKN)
                                {
                                    dialog.output[0].buttons.push({text: data[i].BANKA + ' 입금전용계좌 생성'});
                                }
                                else
                                {
                                    context.session.nonpaymentHistory.push(data[i]);
                                }
                            }

                            if(dialog.output[0].buttons.length > 0)
                            {
                                dialog.output[0].text += '다른 은행 계좌를 원하시면 아래 버튼으로 선택해주세요.';
                            }
                            // else
                            // {
                            //     dialog.output[0].text.replace('다른 은행 계좌를 원하시면 아래 버튼으로 선택해주세요.', '');
                            // }

                            addDefaultButton(dialog);

                        }else {
                            errorHandler(dialog, body);
                        }

                    }
                    callback();

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
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CB_COMMON_ACCCRE';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_BANKK', val: selectedBank }
                ];
                ////options.timeout = timeout;


                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            callback();
                        }

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

                    }
                    callback();
                });
            }
        });

    bot.setTask('getNoticeMethod',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_TYPE_INFO';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                ////options.timeout = timeout;


                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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

                    }
                    callback();

                });
            }
        });

  
  bot.setTask('setNoticeMethod_kkoalarm', 
	{
		action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_KKO_REQUEST';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT },
                    { key: 'I_HPNUM', val: context.session.customerMobile },
                    { key: 'I_PERSON_ID', val: context.session.customerBirth }
                ];

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            dialog.setNoticeMethodSuccess = true;
                        }else {
                            errorHandler(dialog, body);
                        }
                    }
                    callback();
                });
            }
	});
  
    bot.setTask('setNoticeMethod_kkopay',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_KKOPAY_REQUEST';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT },
                    { key: 'I_HPNUM', val: curCustomer.mobile }
                ];
                ////options.timeout = timeout;


                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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

                    }
                    callback();

                });
            }
        });

    bot.setTask('setNoticeMethod_lms',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_LMS_REQUEST';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT },
                    { key: 'I_HPNUM', val: curCustomer.mobile }
                ];

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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

                    }
                    callback();

                });
            }
        });

    bot.setTask('setNoticeMethod_email',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_EMAIL_REQUEST';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT },
                    { key: 'I_EMAIL', val: curCustomer.email}
                ];
                //options.timeout = timeout;

                var start = new Date().getTime();
                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            console.log(body, ((new Date().getTime()) - start) / 1000 + 'ms');
                            dialog.setNoticeMethodSuccess = true;
                        }else {
                            errorHandler(dialog, body);
                        }
                    }
                    callback();
                });
            }
        });

    bot.setTask('cancelNoticeMethod',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_CANCEL';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT }
                ];
                //options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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

                    }
                    callback();

                });
            }
        });


    // ZBI_MS_GOJI_RESEND 에서 고지방법을 보내주지 않으므로 ZCS_GOJI_TYPE_INFO 에서 결과수신 후 다시 API를 콜함. 서비스개선을 위해 ZBI_MS_GOJI_RESEND의 결과값에 고지방법을 포함해주길 요청
    bot.setTask('resendNotice',
        {
            action: function (dialog, context, callback)
            {

                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GOJI_TYPE_INFO';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                ////options.timeout = timeout;


                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            dialog.curNoticeMethod = methodIdex[body['E_SENDCONTROL_GP']];
                            dialog.curNoticeMethodCategory = parseInt(body['E_SENDCONTROL_GP']);

                            options.json.name = 'ZBI_MS_GOJI_RESEND';

                            request.post(options, function(err, response, body)
                            {
                                if(err)
                                {
                                    errorHandler(dialog, err);
                                }
                                else
                                {
                                    if(!body)
                                    {
                                        errorHandler(dialog, null);
                                        return callback();
                                    }

                                    if(body.E_RETCD == 'E')
                                    {
                                        errorHandler(dialog, body);
                                    }
                                    else if(body.E_RETCD == 'S')
                                    {
                                        dialog.setNoticeMethodSuccess = true;
                                    }else {
                                        var msg = '[알림]\n\n전자고지 고객님만 가능하며 종이고지서 수령을 원하시는 고객님께서는 관할 고객센터로 연락주시기 바랍니다.\n\n고객센터 전화번호 (1544-3002 연결)';
                                        var btns = [{text: '이전'}, {text: '처음'}];
                                        if(context.channel.name !== 'kakao') {
                                            btns.unshift({"text": "고객센터 전화하기", "url": "tel:+15443002"});
                                        }
                                        dialog.output[0].text = msg;
                                        dialog.output[0].buttons = btns;
                                    }

                                }
                                callback();

                            });

                        }else {
                            errorHandler(dialog, body);
                        }

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
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_GET_PAYMENT_METHOD';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT }
                ];
                //options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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
                    }
                    callback();

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
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'MS_IF_CM0014';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                options.json.isTable = true;
                //options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                        callback();
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            if(body.E_RETMSG.indexOf('정보 없음') != -1 || body.E_RETMSG.indexOf('결과가 없습니다') != -1)
                            {
                                dialog.output[0].text = body.E_RETMSG;
                            }
                            else
                            {
                                errorHandler(dialog, body);
                            }
                            callback();
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            dialog.data.list = body.data.T_OUT;

                            console.log('성공 데이터 : ', dialog.data.list);
                            var outputText = [];

                            // async.eachSeries(dialog.data.list, function(item, next)
                            //

                            var resultList = {};
                            for(var i=0; i<dialog.data.list.length; i++)
                            {
                                var date = dialog.data.list[i].CHK_DAT
                                if(!resultList[date])
                                {
                                    resultList[date] = [];
                                }

                                resultList[date].push(dialog.data.list[i]);
                            }

                            for(var key in resultList)
                            {
                                var item = resultList[key];
                                var chkItmNm = '';
                                for(var i=0; i<item.length; i++)
                                {
                                    if(item[i].CHK_ITM_NM)
                                    {
                                        chkItmNm += ' - ' + item[i].CHK_ITM_NM + '\n';
                                        if(item[i].CHK_ITM_BNM)
                                        {
                                            chkItmNm += ' → ' + item[i].CHK_ITM_BNM + '\n';
                                        }
                                    }
                                }

                                item[0].CHK_ITM_NM = '\n' + chkItmNm;

                                item = item[0];


                                var test = '안전점검일: ' + item.CHK_DAT + '\n';
                                test += '점검참여자: ' + item.SCR_MGR_NO + '\n';
                                if(item.SCR_MGR_CLF == '01')
                                {
                                    test += '계약자와관계: 본인\n';
                                }
                                else if(item.SCR_MGR_CLF == '02')
                                {
                                    test += '계약자와관계: 가족\n';
                                }
                                else if(item.SCR_MGR_CLF == '03')
                                {
                                    test += '계약자와관계: 관리인\n';
                                }
                                else if(item.SCR_MGR_CLF == '04')
                                {
                                    test += '계약자와관계: 기타\n';
                                }

                                if(item.CHK_YN == 'Y')
                                {
                                    if(item.FITN_YN == 'Y')
                                    {
                                        test += '점검결과: 적합\n';
                                    }
                                    else
                                    {
                                        test += '점검결과: 부적합\n';

                                        if(item.IMPV_YN == 'Y')
                                        {
                                            test += '부적합개선여부: 개선완료\n';
                                        }
                                        else
                                        {
                                            test += '부적합개선여부: 미개선\n';
                                        }

                                        test += '부적합 시설: ' + item.CHK_ITM_NM + '\n';
                                    }
                                }
                                else
                                {
                                    test += '미점검사유: ';
                                    if(item.UCHK_RSN == '1')
                                    {
                                        test += '공가\n';
                                    }
                                    else if(item.UCHK_RSN == '2')
                                    {
                                        test += '미입주\n';
                                    }
                                    else if(item.UCHK_RSN == '3')
                                    {
                                        test += '미사용\n';
                                    }
                                    else if(item.UCHK_RSN == '4')
                                    {
                                        test += '중폐지\n';
                                    }
                                    else if(item.UCHK_RSN == '5')
                                    {
                                        test += '이사\n';
                                    }
                                    else if(item.UCHK_RSN == '6')
                                    {
                                        test += '체납중지\n';
                                    }
                                    else if(item.UCHK_RSN == '7')
                                    {
                                        test += '요청중지\n';
                                    }
                                    else if(item.UCHK_RSN == '8')
                                    {
                                        test += '철거\n';
                                    }
                                    else if(item.UCHK_RSN == '9')
                                    {
                                        test += '점검거부\n';
                                    }
                                }

                                outputText.push(test + (i == dialog.data.list.length - 1 ? '' : '\n'));
                            }

                            dialog.output[0].text = outputText.join('\n');
                            callback();
                        }
                        else
                        {
                            errorHandler(dialog, body);
                            callback();
                        }
                    }
                });
            }
        });

    bot.setTask('getSafetyCheckMonth',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'MS_IF_CM0013';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            if(body.E_RETMSG.indexOf('정보 없음') != -1)
                            {
                                dialog.output[0].text = body.E_RETMSG;
                            }
                            else
                            {
                                errorHandler(dialog, body);
                            }
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            console.log(JSON.stringify(body, null, 4));

                            var msg = '';

                            if(body.E_FCNTMM != '00')
                            {
                                msg += body.E_FCNTMM + '월';
                            }

                            if(body.E_SCNTMM != '00')
                            {
                                if(msg)
                                {
                                    msg += ', ';
                                }

                                msg += body.E_SCNTMM + '월';
                            }

                            if(!msg.length)
                            {
                                msg = '없음';
                            }
                            dialog.data.month = msg;
                            dialog.data.gasType = body.E_AKLASSE;
                        }
                        else
                        {
                            errorHandler(dialog, body);
                        }

                    }
                    callback();

                });
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
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_DONG', val: context.session.centerAddress}
                ];
                options.json.isTable = true;
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {
                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            context.session.centerAddressList = body.data.E_TAB;
                            add_setCall(dialog, context);

                        }else {
                            errorHandler(dialog, body);
                        }

                    }
                    callback();

                });
            }
        });

    bot.setTask('authConfirm',
        {
            action: function (dialog, context, callback)
            {
                for(var i = 0; i < context.session.customerList.length; i ++)
                {
                    context.session.customerList[i]['mobile'] = context.session.customerMobile;
                }
                context.session.auth = true;
                callback();
            }
        });

    bot.setTask('payByARS',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_ARS_PAYMENT';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_HPNUM', val: curCustomer.mobile },
                    { key: 'I_BETRWP', val: context.session.totalSelectedNonpayment}
                ];
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {

                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            body.E_RETMG = '조회된 미납금액이 없습니다.';
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            console.log(body)
                        }
                        else
                        {
                            errorHandler(dialog, body);
                        }

                    }
                    callback();

                });
            }
        });

    bot.setTask('payByQR',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_QR_PAYMENT';
                options.json.channel = context.channel.name;


                // 2018/06/18 api update
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT},
                    { key: 'I_HPNUM', val: curCustomer.mobile },
                    { key: 'I_BETRWP', val: context.session.totalSelectedNonpayment}
                ];

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {

                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

                        if(body.E_RETCD == 'E')
                        {
                            body.E_RETMG = '조회된 미납금액이 없습니다.';
                            errorHandler(dialog, body);
                        }
                        else if(body.E_RETCD == 'S')
                        {
                            var url = body.E_URL;
                            dialog.output[0].text = body.E_RETMG + '\n자세히 보기를 클릭해주세요.';
                            dialog.output[0].buttons = [
                                {
                                    text: '자세히 보기',
                                    url: url
                                },
                                {
                                    text: '이전'
                                },
                                {
                                    text: '처음'
                                }
                            ];
                            console.log(body);
                        }
                        else
                        {
                            errorHandler(dialog, body);
                        }

                    }
                    callback();

                });
            }
        });

    bot.setTask('cancelAutoTransfer',
        {
            action: function (dialog, context, callback)
            {
                var curCustomer = context.session.curCustomer;
                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_EXPIRE_SO';
                options.json.channel = context.channel.name;
                options.json.param = [
                    { key: 'I_VKONT', val: '000' + curCustomer.VKONT}
                ];
                ////options.timeout = timeout;

                request.post(options, function(err, response, body)
                {
                    if(err)
                    {
                        errorHandler(dialog, err);
                    }
                    else
                    {

                        if(!body)
                        {
                            errorHandler(dialog, null);
                            return callback();
                        }

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

                    }
                    callback();

                });

            }
        });

    bot.setTask('testTask',
        {
            paramDefs: [
                { type: 'mobileType', description: '핸드폰번호를 입력해주세요' }
            ],
            action: function (dialog, context, callback)
            {
                callback(true, dialog.userInput.text);
            }
        });

    bot.setTask('logout',
        {
            action: function (dialog, context, callback)
            {
                context.session.curCustomer = '';
                context.session.customerName = '';
                context.session.customerMobile = '';
                context.session.customerBirth = '';

                context.session.paymentHistory = '';
                context.session.paymentDetail = '';
                context.session.noticeHistory = '';
                context.session.noticeDetail = '';
                context.session.nonpaymentHistory = '';

                context.session.selectedBank = '';
                context.session.selectedNonpayment = '';
                context.session.selectedMonth = '';
                context.session.totalSelectedNonpayment = '';

                context.session.auth = '';

                context.session.identificationNum = '';

                    callback();
            }
        });

    bot.setTask('selfMeterReading',
        {
            action: function (dialog, context, callback)
            {
                var VKONT = context.session.curCustomer.VKONT;
                var secret    = '2003'; //make this your secret!!

                var exec = require('child_process').exec;
                var compileit = 'java -jar ' + path.resolve('./external_modules/sam_encode.jar') + ' ' + VKONT + ' ' + secret;

                exec(compileit, function(error, stdout, stderr)
                {
                    var hash = stdout.trim();
                    var url = 'https://billgates-web.kakao.com/r/selfMeter/tms/2003?billerUserKey=' + VKONT + '&hashCode=' + hash + '&UTM_SOURCE=sclgas&UTM_MEDIUM=lms&UTM_CAMPAIGN=meter';
                    dialog.output[0].text = '자세히 보기를 클릭해주세요.';
                    dialog.output[0].buttons = [
                        {
                            text: '자세히 보기',
                            url: url
                        },
                        {
                            text: '이전'
                        },
                        {
                            text: '처음'
                        }
                    ];
                    callback();
                });
            }
        });

	bot.setTask('reTry', 
	{
		action: function (dialog, context, callback)
		{
                dialog.output[0].dialogId = reTry[bot.userKey].reTryId;
                dialog.output[0].dialogName = reTry[bot.userKey].reTryName;

            if(!reTry[bot.userKey].reTryId || !reTry[bot.userKey].reTryName){
                dialog.output[0].dialogId = 'startDialog';
                dialog.output[0].dialogName = '시작';
            }

			callback();
		}
	});

	bot.setTask('sendIdentificationNum', 
	{
        action: function (dialog, context, callback) {
            var word = dialog.userInput.text;
            var regexp = new RegExp("[0-9]{6}", "g");
            var isFirst = false;
            if(regexp.exec(word) ){
                if(word === context.session.customerBirth){
                    isFirst = true;
                }
            }

            if (isFirst || word === 'ㅈ' || word === '재발송' || word === '재시도' || word === '이전' || word === 'ㄱ') {

                var options = {};
                options.url = 'http://sam.moneybrain.ai:3000/api';
                options.json = {};
                options.json.name = 'ZCS_CUSTOMER_INFO';
                options.json.channel = context.channel.name;
                options.json.param = [
                    {key: 'I_NAME', val: context.session.customerName},
                    {key: 'I_BIRTH', val: context.session.customerBirth},
                    {key: 'I_PHONE', val: context.session.customerMobile}
                ];
                options.json.isTable = true;
                ////options.timeout = timeout;

                request.post(options, function (err, response, body) {
                    if (err) {
                        errorHandler(dialog, err);
                    }
                    else {
                        if (!body) {
                            errorHandler(dialog, null);
                            return callback();
                        }
                        console.log('channel: ' + context.channel.name);
                        if (body.E_RETCD == 'E') {
                            body.E_RETMG = '조회된 내역이 없습니다. 고객정보를 정확히 확인해 주세요.';
                            errorHandler(dialog, body);
                        }
                        else if (body.E_RETCD == 'S') {
                            context.session.identificationNum = '' + body.E_CONF_NO;
                            console.log('인증번호: ' + context.session.identificationNum);
                            context.session.customerList = body.data.E_TAB;

                            for(var i=0; i<context.session.customerList.length; i++)
                            {
                                if(context.session.customerList[i].VKONT.startsWith('000'))
                                {
                                    context.session.customerList[i].VKONT = context.session.customerList[i].VKONT.substring(3);
                                }
                            }
                            if (context.channel.name == 'kakao') {
                                if(dialog.output[0].text.indexOf('처음으로') === -1) {
                                    dialog.output[0].text = [dialog.output[0].text, '\n\n이전으로 돌아가시려면 \'ㄱ\' 을, 처음으로 돌아가시려면 \'ㄴ\' 를 입력해주세요.'].join("");
                                }
                            } else {
                                dialog.output[0].buttons = [{text: '이전'}, {text: '처음'}];
                            }

                        } else {
                            errorHandler(dialog, body);
                        }
                    }
                    callback();
                });
            }

            else{
                if(context.channel.name == 'kakao'){
                    if(dialog.options.outputText.indexOf('처음으로') === -1) {
                        dialog.options.outputText = [dialog.options.outputText, '\n\n인증번호를 다시 받으시려면 \'ㅈ\' 을,이전으로 돌아가시려면 \'ㄱ\' 을, 처음으로 돌아가시려면 \'ㄴ\' 를 입력해주세요.'].join("");
                        callback();
                    }else{
                        callback();
                    }
                }else{
                    dialog.output[0].buttons = [{text: '재발송'},{text: '이전'}, {text: '처음'}];
                    callback();
                }
            }
        }
	});

    bot.setType('checkIdentificationNum',
    {
        typeCheck: function (dialog, context, callback)
        {
            var matched = false;
            if(dialog.userInput.text === context.session.identificationNum){
                matched = true;
                callback(matched);
            }
            else{
                callback(matched);
            }
        }
    });

	bot.setTask('notRetry', 
	{
		action: function (dialog, context, callback)
		{
            if(context.session.history[1]) {
                if (context.session.history[1].id === 'reTry') {
                    context.session.history.splice(0, 1);
                }
            }
			callback();
		}
	});
};
