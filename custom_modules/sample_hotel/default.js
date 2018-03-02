var request=require('request');
var path = require('path');
var config = require(path.resolve('./config/config'));

module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        action: function(dialog, context, callback)
        {
            callback();
        }
    });

	bot.setTask('image', 
	{
		action: function (dialog, context, callback)
		{
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("싱글")!==-1)
		    {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797303x-1404764313.jpg"};
                dialog.output[0].text = "☃싱글룸☃\n✔Single Room\n\n36m2 침실1, 욕실1, 화장실1\n55인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 50000원";
            }
            else if(dialog.userInput.text.indexOf("2")!==-1 || dialog.userInput.text.indexOf("트윈")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797320x-1404764397.jpg"};
                dialog.output[0].text = "☃트윈룸☃\n✔Twin Room\n\n48m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 80000원";
            }
            else if(dialog.userInput.text.indexOf("3")!==-1 || dialog.userInput.text.indexOf("더블")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797340x-1404764397.jpg"};
                dialog.output[0].text = "☃더블룸☃\n✔Double Room\n\n침50m2 실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 100000원";
            }
            else if(dialog.userInput.text.indexOf("4")!==-1 || dialog.userInput.text.indexOf("트리플")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797515x-1404764397.jpg"};
                dialog.output[0].text = "☃트리플룸☃\n✔Triple Room\n\n60m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 120000원";
            }
			callback();
		}
	});

	bot.setTask('savetime', 
	{
		action: function (dialog, context, callback)
		{
            context.session.time=dialog.userInput.text;
			callback();
		}
	});
	bot.setTask('savedatein',
	{
		action: function (dialog, context, callback)
		{
			context.session.datein=dialog.userInput.types.date;
			console.log("666666666677777777766666"+context.session.datein);
            var regDate =/(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})/;
            var arr = regDate.exec(context.session.datein);
            console.log("arr[1]"+arr[1]);
            console.log("arr[2]"+arr[2]);
            console.log("arr[3]"+arr[3]);
            // 判断年、月、日的取值范围是否正确
            context.session.inyear=arr[1];
            context.session.inmonth=arr[2];
            context.session.inday=arr[3];

			callback();
		}
	});
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

    bot.setType('savedateout',
        {
            typeCheck: function (dialog, context, callback) {
                console.log("---------------------------");
                var matched=false;
                // 判断年、月、日的取值范围是否正确 
                // 先判断格式上是否正确 
                var regDate =/^(\d{4})[- ]?(\d{1,2})[- ]?(\d{1,2})$/;
                if (!regDate.test(dialog.userInput.text))
                {
                    matched=false;
                    callback(matched);
                }
                else{
                    // 将年、月、日的值取到数组arr中，其中arr[0]为整个字符串，arr[1]-arr[3]为年、月、日
                    var arr = regDate.exec(dialog.userInput.text);

                    // 判断年、月、日的取值范围是否正确
                    context.session.outyear=arr[1];
                    context.session.outmonth=arr[2];
                    context.session.outday=arr[3];

                    var s1  =  context.session.inputyear+"-"+context.session.inputmonth+"-"+context.session.inputday;
                    var s2  =  context.session.outyear+"-"+context.session.outmonth+"-"+context.session.outday;
                    context.session.days=DateDiff(s1,s2);

                    if(context.session.days>0){
                        matched=IsMonthAndDateCorrect(arr[1], arr[2], arr[3]);
                        context.session.dateout=s2;
                        callback(matched);
                    }
                    else{matched=false; callback(matched);}
                }
            }
        });

	bot.setTask('savepeoplenum', 
	{
		action: function (dialog, context, callback)
		{
            context.session.peoplenumber=dialog.userInput.types.peoplenumber;
            console.log("context.session.peoplenumber: "+context.session.peoplenumber);
			callback();
		}
	});

	bot.setTask('savename', 
	{
		action: function (dialog, context, callback)
		{
			context.session.name=dialog.userInput.text;
			callback();
		}
	});

	bot.setType('peoplenumber',
    {
        typeCheck: function (dialog, context, callback) {
            var regDate = /^\d$/;
            if (!regDate.test(dialog.userInput.text)) {
                callback(false);
            }
            else {
                callback(true, dialog.userInput.text);
            }
        }
    });

	bot.setTask('savemobile', 
	{
		action: function (dialog, context, callback)
		{
            var regDate = /^\d$/;
            if (!regDate.test(dialog.userInput.text) && dialog.userInput.types.mobile) {
                context.session.mobile=dialog.userInput.types.mobile;
                var randomNum = '';
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);
                randomNum += '' + Math.floor(Math.random() * 10);
                context.session.smsAuth = randomNum;
                var message = '[' + bot.name + ']' + ' 인증번호 : ' + randomNum;
                request.post(
                    'https://bot.moneybrain.ai/api/messages/sms/send',
                    {json: {callbackPhone: config.callcenter, phone: context.session.mobile, message: message}},
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("response.statusCode: " + response.statusCode);
                            console.log("context.session.smsAuth: " + context.session.smsAuth);
                            return callback();
                        } else {
                            console.log("error:" + error);
                        }
                    }
                );
                callback();
            }
            else {
                callback();
            }
		}
	});

	bot.setType('identification', {
    typeCheck: function (dialog, context, callback) {
    	if(dialog.userInput.text.indexOf(context.session.smsAuth)!==-1)
    	{
    		callback(true);
    	}
		else
			{
				callback(false);
			}
    }
	});

	bot.setTask('recertification', 
	{
		action: function (dialog, context, callback) {
            var randomNum = '';
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            randomNum += '' + Math.floor(Math.random() * 10);
            context.session.smsAuth = randomNum;
            var message = '[' + bot.name + ']' + ' 인증번호 : ' + randomNum;
            request.post(
                'https://bot.moneybrain.ai/api/messages/sms/send',
                {json: {callbackPhone: config.callcenter, phone: context.session.mobile, message: message}},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("response.statusCode: " + response.statusCode);
                        console.log("context.session.smsAuth: " + context.session.smsAuth);
                        return callback();
                    } else {
                        console.log("error:" + error);
                    }
                }
            );
            callback();
        }
	});


    bot.setTask('saveorder',
        {
            action: function (dialog, context, callback)
            {
            	if(!context.user.order){
                    context.user.order=[];
				}
            	var neworder=
            		{
                        datein:context.session.datein,
						time:context.session.time,
						peoplenumber:context.session.peoplenumber,
						name:context.session.name,
						mobile:context.session.mobile
            		};
            	context.user.order.push(neworder);
                callback();
            }
        });

	bot.setTask('showlist', 
	{
		action: function (dialog, context, callback)
		{
            if(context.user.order) {
                context.session.confirmlist = [];
                for (var i = 0; i < context.user.order.length; i++) {
                    if (dialog.userInput.text.indexOf(context.user.order[i].name) !== -1) {
                        context.session.confirmlist.push(context.user.order[i]);
                    }
                }
                var text = dialog.userInput.text + "님의 예약 내용은 아래와 같습니다.\n\n";
                for (var i = 0; i < context.session.confirmlist.length; i++) {
                    text = text.concat((i + 1) + '.\n일시: ' + context.session.confirmlist[i].datein + " " + context.session.confirmlist[i].time + '\n' +
                        '인원: ' + context.session.confirmlist[i].peoplenumber + '명\n' +
                        '연락처: ' + context.session.confirmlist[i].mobile + '\n\n');
                }
                    dialog.output[0].text = text;
                    callback();
            }
            else{
                dialog.output[0].text = dialog.userInput.text + "님의 예약 내역이 존재하지 않습니다.\n\n바로 예약하시려면 '예약하기'버튼을 누러주세요";
                dialog.output[0].buttons = [
                    {
                        text: "예약하기"
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
		}
	});

	bot.setTask('start', 
	{
		action: function (dialog, context, callback)
		{
			dialog.output[0].image={url:"http://chuantu.biz/t6/239/1519783307x-1404764397.jpg"};
			callback();
		}
	});
};
