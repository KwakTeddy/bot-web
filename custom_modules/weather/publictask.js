var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('weather');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var async = require('async');
var yahooFinance = require('yahoo-finance');

function naverGeocode(task, context, callback) {
    // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
    if (task.address) {
        var query = {query: task.address.지번주소};
    } else if (context.dialog.address.지번주소) {
        var query = {query: context.dialog.address.지번주소};
    } else {
        var query = {query: context.dialog.address};
    }
    var request = require('request');

    request({
        url: 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coord=latlng&output=json',
        method: 'GET',
        qs: query,
        headers: {
            'Host': 'openapi.naver.com',
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'X-Naver-Client-Id': context.bot.naver.clientId,
            'X-Naver-Client-Secret': context.bot.naver.clientSecret
        }
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            var doc = JSON.parse(body);
            task.lng=doc.result.items[0].point.x;
            task.lat=doc.result.items[0].point.y;
            console.log('lat: ' + task.lat + ', lng: ' + task.lng);
        }
        callback(task, context);
    });
}

exports.naverGeocode = naverGeocode;

function currentweather(task, context, callback) {
    if(context.dialog.address) {
        if(context.dialog.address.법정읍면동명 == undefined) {
            callback(task, context);
        } else {
            naverGeocode(task, context, function (task, context) {
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
        callback(task, context);
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
    if(context.dialog.address) {
        if(context.dialog.address.법정읍면동명 == undefined) {
            callback(task, context);
        } else {
            naverGeocode(task, context, function (task, context) {
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
    } else {
        callback(task, context);
    }
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
            if (context.dialog.date) {
                task.date = context.dialog.date;
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

exports.exchangeTypecheck = function (text, type, task, context, callback) {
    var currency = {
        "유로":"EUR",
        "달러":"USD",
        "위안":"CNY",
        "엔":"JPY"
    };
    var matched = false;
    var re = /(달러|유로|위안|엔)/ig;
    text = text.replace(/화/g,'');
    text = text.match(re);
    var query = text;
    if (text) {
        if (currency[query]) {
            matched = true;
            context.dialog.currency = currency[query];
            callback(text,task,matched);
        } else {
            callback(text,task,matched);
        }
    } else {
        callback(text,task,matched);
    }

};

exports.exchangerate = function(task, context, callback) {
    var request = require('request');
    context.dialog.item = [];

    request({
        url: 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s='+ context.dialog.currency +"KRW" + '=X',
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

exports.stockTypecheck = function (text, type, task, context, callback) {
    var matched = false;
    var query = text;
    var codes = context.bot.codes;
    if (codes[query]) {
        matched = true;
        context.dialog.stock = codes[query];
        callback(text,task,matched);
    } else {
        callback(text,task,matched);
    }
};


exports.stockprice = function(task, context, callback) {
    context.dialog.item = [];

    yahooFinance.snapshot({
        symbol: context.dialog.stock,
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

var csvFile = path.resolve("custom_modules/weather/codes.csv");
global._bots['weather'].codes = {};

csv({noheader:true})
    .fromFile(csvFile)
    .on('csv',  function(csvRow) {
        global._bots['weather'].codes[csvRow[0]] = csvRow[1] + ".KS";
    })
    .on('done', function(error) {
    });

