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
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("汉堡")!==-1)
		    {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519733708x-1404764397.jpg"};
                dialog.output[0].text = "☃汉堡牛排☃\n✔house burgsteak\n\n清新西红柿酱味\n\n价格: 89元";
            }
            else if(dialog.userInput.text.indexOf("2")!==-1 || dialog.userInput.text.indexOf("酱香")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519734111x-1404764397.jpg"};
                dialog.output[0].text = "☃酱香米饭☃\n✔ragu a bowl of rice\n\n价格: 95元";
            }
            else if(dialog.userInput.text.indexOf("3")!==-1 || dialog.userInput.text.indexOf("黑椒")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519733729x-1404764397.jpg"};
                dialog.output[0].text = "☃黑椒牛排☃\n✔pan steak\n\n热腾腾的牛排&烤蔬菜, 姜黄饭\n\n价格: 115元";
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
	bot.setTask('savedate', 
	{
		action: function (dialog, context, callback)
		{
			context.session.date=dialog.userInput.types.date;
			console.log("context.session.date: "+context.session.date);
			callback();
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
            action: function (dialog, context, callback)
            {
            	if(!context.user.order){
                    context.user.order=[];
				}
            	var neworder=
            		{
                        date:context.session.date,
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
                var text = dialog.userInput.text + "的预订信息如下：\n\n";
                for (var i = 0; i < context.session.confirmlist.length; i++) {
                    text = text.concat((i + 1) + '.\n时间: ' + context.session.confirmlist[i].date + " " + context.session.confirmlist[i].time + '\n' +
                        '人数: ' + context.session.confirmlist[i].peoplenumber + '位\n' +
                        '联系方式: ' + context.session.confirmlist[i].mobile + '\n\n');
                }
                    dialog.output[0].text = text;
                    callback();
            }
            else{
                dialog.output[0].text = "暂时还没有"+dialog.userInput.text + "的预订信息。\n\n想立即预订的话请按'预订'按钮";
                dialog.output[0].buttons = [
                    {
                        text: "预订"
                    },
                    {
                        text: "返回上一页"
                    },
                    {
                        text: "回到初始画面"
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
			dialog.output[0].image={url:"http://chuantu.biz/t6/239/1519733843x-1404764397.jpg"};
			callback();
		}
	});
};
