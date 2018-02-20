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
                    console.log(body)
                    context.session.movieData = body;
                    callback();
                }
            );
		}
	});



};
