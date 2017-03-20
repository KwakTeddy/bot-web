var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var async = require('async');
var yahooFinance = require('yahoo-finance');

function currentweather(task, context, callback) {
    if(context.dialog.address) {
        if(context.dialog.address.법정읍면동명 == undefined) {
            callback(task,context);
        } else {
            addressModule.naverGeocode(task, context, function (task, context) {
                context.user.lat = context.dialog.lat = task.lat;
                context.user.lng = context.dialog.lng = task.lng;
                currentweatherapi(task, context, function (task, context) {
                    context.dialog.weather = task.weather;
                    context.dialog.temp = task.temp;
                    callback(task, context);
                })
            })
        }
    } else {
        callback(task,context);
    }
}

exports.currentweather = currentweather;

function currentweatherapi(task, context, callback) {
    var lat = context.dialog.lat;
    var lon = context.dialog.lng;
    var request = require('request');
    request({
        url: 'http://api.wunderground.com/api/5ad031be7c5a72bb/conditions/lang:KR/q/' + lat + ',' + lon + '.json',
        method: 'GET'
        // headers: {
        //     'Host': 'api.openweathermap.org'
        // }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode == 200) {
            console.log(response.statusCode, body);
            var doc = JSON.parse(body);
            task.weather = doc.current_observation.weather;
            task.temp = doc.current_observation.temp_c;
            callback(task, context);
        }
    });
}


exports.currentweatherapi = currentweatherapi;

function forecastweather(task, context, callback) {
    task.address = context.user.address = context.dialog.address[0];
    addressModule.naverGeocode(task, context, function (task, context) {
        context.user.lat = context.dialog.lat = task.lat;
        context.user.lng = context.dialog.lng = task.lng;
        forecastweatherapi(task,context,function (task,context) {
            // context.dialog.weather = task.weather;
            // context.dialog.temp = task.temp;
            // context.dialog.humidity = task.humidity;
            // context.dialog.wind = task.wind;
            callback(task,context);
        })
    })
}

exports.forecastweather = forecastweather;

function forecastweatherapi(task, context, callback) {
    var lat = context.dialog.lat;
    var lon = context.dialog.lng;
    var request = require('request');
    request({
        url: 'http://api.wunderground.com/api/5ad031be7c5a72bb/forecast10day/lang:KR/q/' + lat + ',' + lon + '.json',
        method: 'GET'
        // headers: {
        //     'Host': 'api.openweathermap.org'
        // }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode == 200) {
            console.log(response.statusCode, body);
            var doc = JSON.parse(body);
            doc = doc.forecast.simpleforecast.forecastday;
            for (var i in doc) {
                doc[i].month = doc[i].date.month;
                doc[i].day = doc[i].date.day;
                doc[i].high = doc[i].high.celsius;
                doc[i].low = doc[i].low.celsius;
            }
            var today = new Date();
            var oneDay = 24*60*60*1000;
            var secondDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
            var firstDate = new Date(task.date.getFullYear(),task.date.getMonth(),task.date.getDate());
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            if (task.range == '이번주') {
                context.dialog.range = '이번주';
                if (today.getDay() == 0) {
                    context.dialog.item = doc[0];
                    callback(task, context);
                } else {
                    var x = 8 - today.getDay();
                    context.dialog.item = doc.splice(0,x);
                    callback(task, context);
                }
            } else if (task.range == '다음주') {
                var x = today.getDate() - today.getDay() + 7;
                x = x - today.getDate();
                doc.splice(0,x);
                context.dialog.range = '다음주';
                context.dialog.item = doc;
                callback(task, context);
            } else if (task.range == '이번달') {
                context.dialog.range = '이번달';
                context.dialog.item = doc;
                callback(task, context);
            } else if (diffDays > 9) {
                context.dialog.forecastdatecheck = 'over';
                callback(task, context);
            } else if (diffDays < 0) {
                context.dialog.forecastdatecheck = 'below';
                callback(task, context);
            } else {
                context.dialog.item = doc[diffDays];
                callback(task, context);
            }
        }
    });
}


exports.forecastweatherapi = forecastweatherapi;

exports.exchangerate = function(task, context, callback)
{
  var query = task.inRaw;
  var request = require('request');
  context.dialog.item = [];

  var cur = query;
  if (context.bot.currency[query])
    cur = context.bot.currency[query];

  request({
    url: 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s='+ cur+"KRW" + '=X',
    method: 'get'
  }, function(error, response, body) {
    if (!error) {
      console.log(body);
      var items = body.split(',');
      task.doc = {rate: items[1], date: (items[2]+" "+items[3]).replace(/['"]+/g, '')};
      context.dialog.item.push(task.doc);
      task.count = 1;
    } else {
      task.count = 0;
    }
    callback(task,context);
  });
};

exports.stockprice = function(task, context, callback)
{
  var query = task.inRaw;
  context.dialog.item = [];

  var codes = context.bot.codes;

  var cur = query;
  if (codes[query])
    cur = codes[query];

  yahooFinance.snapshot({
    symbol: cur,
    fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
  }).then(function(snapshot) {
    if (snapshot.lastTradePriceOnly != null) {
      task.doc = snapshot;
      context.dialog.item.push(task.doc);
      task.count = 1;
    } else {
      task.count = 0;
    }
    console.log(JSON.stringify(snapshot, null, 2));
    callback(task,context);
  });
};

// initialize dictionaries
const csv = require('csvtojson');

global._bots["athena"].currency = {
  "유로":"EUR",
  "달러":"USD",
  "위안화":"CNY",
  "엔화":"JPY"
};

var csvFile = path.resolve("custom_modules/athena/codes.csv");
global._bots['athena'].codes = {};

csv({noheader:true})
  .fromFile(csvFile)
  .on('csv',  function(csvRow) {
    global._bots['athena'].codes[csvRow[0]] = csvRow[1] + ".KS";
  })
  .on('done', function(error) {
  });

