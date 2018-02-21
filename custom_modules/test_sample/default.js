var request = require('request');
var cheerio = require('cheerio');

module.exports = function(bot)
{
    bot.setTask("defaultTask",
    {
        name: 'defaultTask',
        action: function(dialog, context, callback)
        {
            callback();
        }
    });


	var email = {
	  typeCheck: function (dialog, context, callback) {
		var matched = true;
		var parsedData = 'example';

		callback(matched, parsedData);
		}
	};

	bot.setType('email', email);


	bot.setTask('crawling',
	{
		action: function (dialog, context, callback)
		{
            var url = 'http://finance.naver.com/item/main.nhn?code=035720';
            request(url,
                function (err, response, body) {
                    if(err)
                    {
                        console.log(err);
                    }
                    var $ = cheerio.load(body);
                    var selector = '#content > div.section.invest_trend > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > em';
                    var result = $(selector).text();

                    context.session.crawlingResult = result;
                    callback();
                }
            );
		}
	});
	bot.setTask('api',
	{
		action: function (dialog, context, callback)
		{
            var client_id = 'tXRaAWut2_2R5OkcLpLQ';
            var client_secret = 'TaU4yqU4fI';
            var api_url = 'https://openapi.naver.com/v1/search/movie.json';
            var options = {
                method: "GET",
                url: api_url,
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret},
                qs:
                    {
                        query: '사건'
                    }

            };
            request(options,
                function (err, response, body) {
                    if(err)
                    {
                        console.log(err);
                    }
                    body = JSON.parse(body);
                    context.session.movieData = body;
                    callback();
                }
            );
		}
	});




	bot.setTask('preCallback', 
	{
	    preCallback : function (dialog, context, callback) {
            dialog.data.preCallback = 'This is preCallback Variable!';
            callback();
        },
        action : function (dialog, context, callback) {
            dialog.data.action = 'This is action Variable!' + dialog.data.preCallback;
            callback();
        }
	});

	bot.setTask('postCallback', 
	{
		action: function (dialog, context, callback)
		{
            dialog.data.action = 'This is action Variable!';
            callback();
		},
        postCallback : function (dialog, context, callback) {
            dialog.data.postCallback = 'This is postCallback Variable!' + dialog.data.action;
            callback();
        }
	});


	var sequenceTest = {
	    action: function (dialog, context, callback) {
	        dialog.data.sequenceTest = 'This is sequenceTest Variable';
            callback();
        }
    };

	var testFunc = function (dialog, context, callback) {
        dialog.data.testFunc = 'This is testFunc Variable';
        callback();
    };

	bot.setTask('sequenceTask', 
	{
		action: [
            'crawling',
            sequenceTest,
            testFunc
        ]
	});

	bot.setTask('taskParams', 
	{
	    params : '테스크에 파라미터가 정산적으로 들어갔습니다.',
		action: function (dialog, context, callback)
		{
		    dialog.data.taskParams = this.params;
			callback();
		}
	});

	bot.setTask('requiredParams', 
	{
        paramDefs: [{ type: 'mobile', description: 'mobile 타입이 필수 파라미터입니다. 핸드폰 번호를 입력해야합니다.' }],
		action: function (dialog, context, callback)
		{

			callback();
		}
	});

	bot.setTask('taskExtends', 
	{
	    params : 'taskParams함수를 extends하여, 테스크 파라미터 변경에 성공했습니다.',
        extends: 'taskParams'

    });


var email = {
  typeCheck: function (dialog, context, callback) {
    var matched = false;
    var regExp = new RegExp('^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$', 'ig');
    var arr = regExp.exec(dialog.userInput.text);
    if(arr)
    {
        matched = true;
    }

    callback(matched);
	}
};

bot.setType('email', email);
};
