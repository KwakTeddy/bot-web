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
		    if(dialog.userInput.text.indexOf("1")!==-1 || dialog.userInput.text.indexOf("하우스")!==-1)
		    {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519733708x-1404764397.jpg"};
                dialog.output[0].text = "☃하우스 함박스테이크☃\n✔house burgsteak\n\n상큼한 토마토 소스\n\n가격: 8900원";
            }
            else if(dialog.userInput.text.indexOf("2")!==-1 || dialog.userInput.text.indexOf("라구")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519734111x-1404764397.jpg"};
                dialog.output[0].text = "☃라구 라이스☃\n✔ragu a bowl of rice\n\n가격: 9500원";
            }
            else if(dialog.userInput.text.indexOf("3")!==-1 || dialog.userInput.text.indexOf("팬")!==-1)
            {
                dialog.output[0].image = {url: "http://chuantu.biz/t6/239/1519733729x-1404764397.jpg"};
                dialog.output[0].text = "☃팬 스테이크☃\n✔pan steak\n\n뜨거운 스테이크&구운야채, 강황필라프\n\n가격: 15000원";
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
                var text = dialog.userInput.text + "님의 예약 내용은 아래와 같습니다.\n\n";
                for (var i = 0; i < context.session.confirmlist.length; i++) {
                    text = text.concat((i + 1) + '.\n일시: ' + context.session.confirmlist[i].date + " " + context.session.confirmlist[i].time + '\n' +
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
			dialog.output[0].image={url:"http://chuantu.biz/t6/239/1519733843x-1404764397.jpg"};
			callback();
		}
	});
};
