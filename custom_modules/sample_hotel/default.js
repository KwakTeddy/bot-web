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
                context.session.selecroom="싱글룸";
                context.session.price="50000";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797303x-1404764313.jpg"};
                dialog.output[0].text = "☃싱글룸☃\n✔Single Room\n\n36m2 침실1, 욕실1, 화장실1\n55인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 50000원";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797303x-1404764313.jpg"};
                dialog.output[1].text = "☃싱글룸☃\n✔Single Room\n\n36m2 침실1, 욕실1, 화장실1\n55인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 50000원";
            }
            else if(dialog.userInput.text.indexOf("2")!==-1 || dialog.userInput.text.indexOf("트윈")!==-1)
            {
                context.session.selecroom="트윈룸";
                context.session.price="80000";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797320x-1404764397.jpg"};
                dialog.output[0].text = "☃트윈룸☃\n✔Twin Room\n\n48m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 80000원";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797320x-1404764397.jpg"};
                dialog.output[1].text = "☃트윈룸☃\n✔Twin Room\n\n48m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 80000원";
            }
            else if(dialog.userInput.text.indexOf("3")!==-1 || dialog.userInput.text.indexOf("더블")!==-1)
            {
                context.session.selecroom="더블룸";
                context.session.price="100000";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797340x-1404764397.jpg"};
                dialog.output[0].text = "☃더블룸☃\n✔Double Room\n\n침50m2 실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 100000원";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797340x-1404764397.jpg"};
                dialog.output[1].text = "☃더블룸☃\n✔Double Room\n\n침50m2 실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 100000원";
            }
            else if(dialog.userInput.text.indexOf("4")!==-1 || dialog.userInput.text.indexOf("트리플")!==-1)
            {
                context.session.selecroom="트리플룸";
                context.session.price="120000";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797515x-1404764397.jpg"};
                dialog.output[0].text = "☃트리플룸☃\n✔Triple Room\n\n60m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 120000원";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797515x-1404764397.jpg"};
                dialog.output[1].text = "☃트리플룸☃\n✔Triple Room\n\n60m2 침실1, 욕실1, 화장실1\n65인치 스마트 TV\n(위성 TV 52개 채널)\n\n300Mbps 초고속 인터넷\n유∙무선(wi-fi) 무료\n\n220V, 110V 전압 사용 가능\n커피·차 티백 무료 제공\n\n엑스트라 베드:\n1개 추가 30,000원/1박\n베이비 크립(무료)\n\n가격: 120000원";
            }
			callback();
		}
	});

	bot.setTask('savedatein',
	{
		action: function (dialog, context, callback)
		{
		    if(dialog.userInput.types.date!==undefined) {
                context.session.datein = dialog.userInput.types.date;
                callback();
            }
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

    bot.setTask('savedateout',
        {
            action: function (dialog, context, callback) {
                if(dialog.userInput.types.date!==undefined) {
                    context.session.dateout = dialog.userInput.types.date;
                }
                    var s1  =  context.session.datein;
                    var s2  =  context.session.dateout;
                    context.session.days=DateDiff(s1,s2);
                    callback();
            }
        });

	bot.setTask('savenum',
	{
		action: function (dialog, context, callback)
		{
            context.session.number=dialog.userInput.text;
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

            action: function (dialog, context, callback) {
                if (!context.user.order) {
                    context.user.order=[];
                }
                    var number = Number(context.session.number);
                    var price = Number(context.session.price);
                    var allprice = number * price;
                    context.session.allprice = String(allprice);

                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();

                context.session.time=currentdate;

                    var neworder =
                        {
                            datein: context.session.datein,
                            dateout: context.session.dateout,
                            room: context.session.selecroom,
                            number: context.session.number,
                            name: context.session.name,
                            mobile: context.session.mobile,
                            price: context.session.price,
                            allprice: context.session.allprice,
                            time: currentdate,
                            state: '예약',
                            index: (context.user.order.length+1)
                        };
                    context.user.order.push(neworder);
                    callback();
            }
        });

	bot.setTask('showlist', 
	{
		action: function (dialog, context, callback)
		{
                context.session.confirmlist = [];
                if(context.user.order) {
                    for (var j = 0; j < context.user.order.length; j++) {
                        if (dialog.userInput.text.indexOf(context.user.order[j].name) !== -1 && context.user.order[j].state === "예약") {
                            context.session.confirmlist.push(context.user.order[j]);
                        }
                    }
                    if (context.session.confirmlist.length > 0) {
                        var text = dialog.userInput.text + "님의 예약 내용은 아래와 같습니다. 취소 하시고 싶은 예약의 번호를 입력해주세요. \n\n";
                        for (var i = 0; i < context.session.confirmlist.length; i++) {
                            text = text.concat((i + 1) + '.\n입주날짜: ' + context.session.confirmlist[i].datein + '\n퇴실날짜: ' + context.session.confirmlist[i].dateout + '\n' +
                                '객실: ' + context.session.confirmlist[i].room + '\n' +
                                '객실수: ' + context.session.confirmlist[i].number + '개\n' +
                                '가격: ' + context.session.confirmlist[i].allprice + '개\n' +
                                '예약 시간: ' + context.session.confirmlist[i].time + '\n' +
                                '연락처: ' + context.session.confirmlist[i].mobile + '\n\n' );
                        }
                        text = text.concat("처음으로 가시려면 '처음', 이전단계로 가시려면 '이전'을 입력해주세요");
                        dialog.output[0].text = text;
                        callback();
                    }
                    else {
                        dialog.output[1].text = dialog.userInput.text + "님의 예약 내역이 존재하지 않습니다.\n\n바로 예약하시려면 '예약하기'버튼을 누러주세요";
                        dialog.output[1].buttons = [
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
                else{
                    dialog.output[1].text = dialog.userInput.text + "님의 예약 내역이 존재하지 않습니다.\n\n바로 예약하시려면 '예약하기'버튼을 누러주세요";
                    dialog.output[1].buttons = [
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

	bot.setTask('orderstart', 
	{
		action: function (dialog, context, callback)
		{
            context.session.isorder=true;
			callback();
		}
	});

	bot.setTask('startmenu', 
	{
		action: function (dialog, context, callback)
		{
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("메뉴")!==-1){
		        context.session.isorder=false;
            }
			callback();
		}
	});

	bot.setTask('deleteorder', 
	{
		action: function (dialog, context, callback)
		{
		    for(var i=0;i<context.session.confirmlist.length;i++) {
		        var s=i+1;
                if (dialog.userInput.text == s) {
                    context.session.confirmlist[i].state="예약취소";

                    for(var j=0;j<context.user.order.length;j++){
                        if(context.session.confirmlist[i].index===context.user.order[j].index){
                            context.user.order[j].state="예약취소";
                            callback();
                        }
                    }
                    callback();
                }
            }
		}
	});
};
