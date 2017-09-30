var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('medical');
var async = require('async');

var ang = {
    action: geoCode,
    preCallback: function(task,context,callback) {
        // console.log(context.user.address);
        var address, lng, lat;
        task.address = context.user.address = context.dialog.address;
        addressModule.naverGeocode(task, context, function (task, context) {
            context.user.lat = context.dialog.lat = task.lat;
            context.user.lng = context.dialog.lng = task.lng;

            if (context.dialog.address) {
                address = context.dialog.address;
                lng = context.dialog.lng;
                lat = context.dialog.lat;
            } else if (context.user.address) {
                address = context.user.address;
                lng = context.user.lng;
                lat = context.user.lat;
            }
            context.dialog.distance = addressModule.getDistanceFromGeocode(lat, lng, 37.526922, 127.108381);
            context.dialog.distance = context.dialog.distance.toPrecision(2);
            // console.log(doc.name, doc.distance, JSON.stringify(dist));
        });
        task._doc.address = context.user.address.시도명 + ' ' + context.user.address.시군구명 + ' ' + context.user.address.행정동명;
        // console.log(JSON.stringify(context.dialog.address));
        // console.log(JSON.stringify(context.dialog.address.시도명));
        // console.log(task._doc.address);
        callback(task, context);
    },
    _doc: {
        lng: '',
        lat: '',
        link_find: '',
        link_map: '',
        address: ''
    }
};
exports.ang = ang;

function geoCode(task, context, callback) {
    var request = require('request');
    var query = {q: task._doc.address, output: "json"};
    request({
        url: 'https://apis.daum.net/local/geo/addr2coord?apikey=1b44a3a00ebe0e33eece579e1bc5c6d2',
        method: 'GET',
        qs: query
    }, function(error,response, body) {
        if(!error && response.statusCode == 200) {
            // console.log(body);
            var doc = JSON.parse(body);
            task._doc.lng = 127.108381;
            task._doc.lat = 37.526922;
            task._doc.link_find = 'http://map.daum.net/link/to/' + query.q + ',' + task._doc.lat + ',' + task._doc.lng;
            task._doc.link_map = 'http://map.daum.net/link/map/' + task._doc.lat + ',' + task._doc.lng;
            console.log('lat: ' + task._doc.lat + ', lng: ' + task._doc.lng);
            console.log('link: ' + task._doc.link_find);
            console.log('link: ' + task._doc.link_map);

            task.url = task._doc.link_map;
            task.urlMessage = '경로보기';
        }
        callback(task,context);
    });
}
exports.geoCode = geoCode

function startAction(task, context, callback) {
    context.user.address = null;
    callback(task, context);
}

bot.setAction("startAction", startAction);

// 위치정보를 context.dialog.location 에 저정하기로 한다. location.lat location.lng
function locationNotExists(dialog, context, callback) {
    if(context.user.address == undefined) callback(true);
    else callback(false);
}
exports.locationNotExists = locationNotExists;

function locationExists(dialog, context, callback) {
    if(context.user != undefined && context.user.address != undefined) callback(true);
    else callback(false);
}
exports.locationExists = locationExists;

function locationExistsIN(inRaw, inNLP, dialog, context, callback) {
    if(context.user != undefined && context.user.address != undefined) callback(true);
    else callback(false);
}
exports.locationExistsIN = locationExistsIN;

function locationNotExistsIN(inRaw, inNLP, dialog, context, callback) {
    if(context.user.address == undefined) callback(true);
    else callback(false);
}
exports.locationNotExistsIN = locationNotExistsIN;




var searchCenterTask = {
    action: searchCenter,
    postCallback: function(task, context, callback) {
        callback(task, context);
    }
};
exports.searchCenterTask = searchCenterTask;

var searchUsaCenterTask = {
    action: searchUsaCenter,
    postCallback: function(task, context, callback) {
        callback(task, context);
    }
};

exports.searchUsaCenterTask = searchUsaCenterTask;

function searchUsaCenter (task, context, callback) {
    var center = mongo.getModel('lgcenter_usa', undefined);
    var lng, lat;

    task.address = context.user.address = context.dialog.address;

    if(context.dialog.address) {
        lng = context.dialog.address.lng;
        lat = context.dialog.address.lat;
    } else if(context.user.address) {
        lng = context.user.address.lng;
        lat = context.user.address.lat;
    }

    center.find({}).lean().exec(function(err, docs) {
        if(err) {
            console.log(err);
            callback(task, context);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                doc.distance = addressModule.getDistanceFromGeocode(lat, lng, doc.LATITUDE, doc.LONGITUDE);
                doc.distance = doc.distance.toPrecision(2);
                // console.log(doc.name, doc.distance, JSON.stringify(dist));
            }
            // if (i == docs.length) {
            docs.sort(function (a, b) {
                return a.distance - b.distance;
            });
            // }
            context.dialog.item = docs;

            callback(task,context)
        }
    });
}
exports.searchUsaCenter = searchUsaCenter;

function searchCenter (task, context, callback) {
    var address, lng, lat;
    task.address = context.user.address = context.dialog.address;

    addressModule.naverGeocode(task, context, function (task, context) {
        context.user.lat = context.dialog.lat = task.lat;
        context.user.lng = context.dialog.lng = task.lng;

        if (context.dialog.address) {
            address = context.dialog.address;
            lng = context.dialog.lng;
            lat = context.dialog.lat;
        } else if (context.user.address) {
            address = context.user.address;
            lng = context.user.lng;
            lat = context.user.lat;
        }

        context.dialog.distance = addressModule.getDistanceFromGeocode(lat, lng, 37.526922, 127.108381);
        context.dialog.distance = context.dialog.distance.toPrecision(2);
        // console.log(doc.name, doc.distance, JSON.stringify(dist));
    });
    callback(task, context)
}


exports.searchCenter = searchCenter;

function checkTime(task, context, callback) {

    var day = new Date().getDay();

    if (day <= 5) {
        if (context.dialog.time <= '17:30' && context.dialog.time >= '08:30') {
            context.dialog.check = false;
        } else if (context.dialog.time == 're'){
            context.dialog.check = 're';
        } else {
            context.dialog.check = true;
        }
    } else if (day == 6) {
        if (context.dialog.time <= '17:30' && context.dialog.time >= '08:30') {
            context.dialog.check = false;
        } else if (context.dialog.time == 're'){
            context.dialog.check = 're';
        } else {
            context.dialog.check = true;
        }
    } else {
        context.dialog.check = true;
    }
    callback(task, context);
}


exports.checkTime = checkTime;

function checkDate(task, context, callback) {
    var day = context.dialog.date.getDay();

    if (day <=5) {
        context.dialog.check = false;
    } else if (day >= 6) {
        context.dialog.check = true;
    }
    callback(task, context);
}

exports.checkDate = checkDate;
