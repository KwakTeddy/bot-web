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
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("单人")!==-1)
		    {
                context.session.selecroom="单人间";
                context.session.price="150";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797303x-1404764313.jpg"};
                dialog.output[0].text = "☃单人间☃\n✔Single Room\n\n36m2 卧室1, 淋浴室1, 卫生间1\n55英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 150元";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797303x-1404764313.jpg"};
                dialog.output[1].text = "☃单人间☃\n✔Single Room\n\n36m2 卧室1, 淋浴室1, 卫生间1\n55英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 150元";
            }
            else if(dialog.userInput.text.indexOf("2")!==-1 || dialog.userInput.text.indexOf("双人")!==-1)
            {
                context.session.selecroom="双人间";
                context.session.price="180";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797320x-1404764397.jpg"};
                dialog.output[0].text = "☃双人间☃\n✔Twin Room\n\n48m2 卧室1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 180元";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797320x-1404764397.jpg"};
                dialog.output[1].text = "☃双人间☃\n✔Twin Room\n\n48m2 卧室1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 180元";
            }
            else if(dialog.userInput.text.indexOf("3")!==-1 || dialog.userInput.text.indexOf("大床")!==-1)
            {
                context.session.selecroom="大床房";
                context.session.price="218";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797340x-1404764397.jpg"};
                dialog.output[0].text = "☃大床房☃\n✔Double Room\n\n침50m2 실1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 218元";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797340x-1404764397.jpg"};
                dialog.output[1].text = "☃大床房☃\n✔Double Room\n\n침50m2 실1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 218元";
            }
            else if(dialog.userInput.text.indexOf("4")!==-1 || dialog.userInput.text.indexOf("三人")!==-1)
            {
                context.session.selecroom="三人间";
                context.session.price="288";
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519797515x-1404764397.jpg"};
                dialog.output[0].text = "☃三人间☃\n✔Triple Room\n\n60m2 卧室1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 288元";
                dialog.output[1].image = {url: "http://chuantu.biz/t6/239/1519797515x-1404764397.jpg"};
                dialog.output[1].text = "☃三人间☃\n✔Triple Room\n\n60m2 卧室1, 淋浴室1, 卫生间1\n65英寸智能电视\n(52个卫星频道)\n\n300Mbps超高速网络\n有线无线(wi-fi)免费\n\n220V, 110V插座提供\n咖啡，茶包免费提供\n\n加床服务:\n加一个床位100元/晚\n婴儿床(免费提供)\n\n价格: 288元";
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
                var message = '[' + bot.name + ']' + ' 验证码 : ' + randomNum;
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
            var message = '[' + bot.name + ']' + ' 验证码 : ' + randomNum;
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
                            state: '预订',
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
                        if (dialog.userInput.text.indexOf(context.user.order[j].name) !== -1 && context.user.order[j].state === "预订") {
                            context.session.confirmlist.push(context.user.order[j]);
                        }
                    }
                    if (context.session.confirmlist.length > 0) {
                        var text = dialog.userInput.text + "预订的清单如下，如果您想取消的话请输入想取消的编号。\n\n";
                        for (var i = 0; i < context.session.confirmlist.length; i++) {
                            text = text.concat((i + 1) + '.\n入住日期: ' + context.session.confirmlist[i].datein + '\n退房日期: ' + context.session.confirmlist[i].dateout + '\n' +
                                '客房: ' + context.session.confirmlist[i].room + '\n' +
                                '预订房间数: ' + context.session.confirmlist[i].number + '个\n' +
                                '价格: ' + context.session.confirmlist[i].allprice + '元\n' +
                                '预订时间: ' + context.session.confirmlist[i].time + '\n' +
                                '联系方式: ' + context.session.confirmlist[i].mobile + '\n\n');
                        }
                        text = text.concat("如果您想回到初始画面，请回复'开始'，如果您想回到上一页，请回复'返回'。");
                        dialog.output[0].text = text;
                        callback();
                    }
                    else {
                        dialog.output[1].text = dialog.userInput.text + "还没有预订过哟\n\n想立即预订的话请按'预订'按钮。";
                        dialog.output[1].buttons = [
                            {
                                text: "预订"
                            },
                            {
                                text: "返回上一页"
                            },
                            {
                                text: "回到初始页面"
                            }
                        ];
                        callback();
                    }
                }
                else{
                    dialog.output[1].text = dialog.userInput.text + "还没有预订过哟\n\n想立即预订的话请按'预订'按钮。";
                    dialog.output[1].buttons = [
                        {
                            text: "预订"
                        },
                        {
                            text: "返回上一页"
                        },
                        {
                            text: "回到初始页面"
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
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("客房清单")!==-1){
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
                    context.session.confirmlist[i].state="预订取消";

                    for(var j=0;j<context.user.order.length;j++){
                        if(context.session.confirmlist[i].index===context.user.order[j].index){
                            context.user.order[j].state="预订取消";
                            callback();
                        }
                    }
                    callback();
                }
            }
		}
	});
};
