var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var async = require('async');

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
