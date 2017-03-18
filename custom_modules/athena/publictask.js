var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var async = require('async');
var yahooFinance = require('yahoo-finance');

function currentweather(task, context, callback) {
    task.address = context.user.address = context.dialog.address;
    addressModule.naverGeocode(task, context, function (task, context) {
        context.user.lat = context.dialog.lat = task.lat;
        context.user.lng = context.dialog.lng = task.lng;
        currentweatherapi(task,context,function (task,context) {
            context.dialog.weather = task.weather;
            context.dialog.temp = task.temp;
            context.dialog.humidity = task.humidity;
            context.dialog.wind = task.wind;
            callback(task,context);
        })
    })
}

exports.currentweather = currentweather;

function currentweatherapi(task, context, callback) {
    var lat = context.dialog.lat;
    var lon = context.dialog.lng;
    var request = require('request');
    request({
        url: 'http://api.openweathermap.org/data/2.5/weather?APPID=6dab1e9de4ff0c0d49641cb8d4e1a2af&lat=' + lat + '&lon=' + lon,
        method: 'GET',
        headers: {
            'Host': 'api.openweathermap.org'
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode == 200) {
            console.log(response.statusCode, body);
            var doc = JSON.parse(body);
            task.weather = doc.weather[0].main;
            task.temp = doc.main.temp;
            task.humidity = doc.main.humidity;
            task.wind = doc.wind.speed;
            // if(error) {
            //     console.log(error);
            // } else {
            //     console.log(response.statusCode, body);
            // }
            callback(task, context);
        }
    });
}


exports.currentweatherapi = currentweatherapi;

function forecastweather(task, context, callback) {
    task.address = context.user.address = context.dialog.address;
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
        url: 'http://api.openweathermap.org/data/2.5/forecast?APPID=6dab1e9de4ff0c0d49641cb8d4e1a2af&lat=' + lat + '&lon=' + lon,
        method: 'GET',
        headers: {
            'Host': 'api.openweathermap.org'
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode == 200) {
            console.log(response.statusCode, body);
            var doc = JSON.parse(body);
            // task.weather = doc.weather[0].main;
            // task.temp = doc.main.temp;
            // task.humidity = doc.main.humidity;
            // task.wind = doc.wind.speed;
            // if(error) {
            //     console.log(error);
            // } else {
            //     console.log(response.statusCode, body);
            // }
            callback(task, context);
        }
    });
}


exports.forecastweatherapi = forecastweatherapi;

exports.exchangerate = function(task, context, callback)
{
  var query = task.inRaw;
  var request = require('request');
  context.dialog.item = [];

  var currency = {
    "유로":"EUR",
    "달러":"USD",
    "위안화":"CNY",
    "엔화":"JPY"
  };

  var cur = query;
  if (currency[query])
    cur = currency[query];

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

var csvFile = path.resolve("custom_modules/athena/codes.csv");
const csv = require('csvtojson');
global._bots['athena'].codes = {};

csv({noheader:true})
  .fromFile(csvFile)
  .on('csv',  function(csvRow) {
    global._bots['ahtena'].codes[csvRow[0]] = csvRow[1] + ".KS";
  })
  .on('done', function(error) {
  });

