var path = require('path');
var bot = require(path.resolve('./engine/bot.js')).getBot('lecture_jun');
var request = require('request');
var cheerio = require('cheerio');

var defaultTask = {
    name: 'defaultTask',
    action: function(task, context, callback) {
        callback(task, context);
    }
};
bot.setTask("defaultTask", defaultTask);



var saveCustomerName = {
  action: function (task,context,callback) {
    if(context.user.customerName===undefined)
    {
     context.user.customerName='';
     context.user.customerName=context.dialog.inCurRaw;
    }
    callback(task,context);
	}
};

bot.setTask('saveCustomerName', saveCustomerName);





var crawling = {
  action: function (task,context,callback) {
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

              context.dialog.crawlingResult = result;
        	  console.log(result);
              callback(task,context);
          }
      );
	}
};

bot.setTask('crawling', crawling);


var naverMovieSearch = {
    action: function (task,context,callback) {
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
          		console.log(body.items);
                context.dialog.movieData = body;
                callback(task,context);
            }
        );
	}
};

bot.setTask('naverMovieSearch', naverMovieSearch);
