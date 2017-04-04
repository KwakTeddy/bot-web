var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var async = require('async');
var address = require(path.resolve('modules/bot/action/common/address'));

function naverGeocode(task, context, callback) {
    // var query = {query: task.address.법정읍면동명 + ' ' + task.address.지번본번 + ' ' + task.address.지번부번};
    if (task.address) {
        var query = {query: task.address.지번주소};
    } else if (context.dialog.address) {
        if (context.dialog.address.지번주소) {
            var query = {query: context.dialog.address.지번주소};
        } else {
            var query = {query: context.dialog.address};
        }
    } else if (context.user.address) {
        if (context.user.address.지번주소) {
            var query = {query: context.user.address.지번주소};
        } else {
            var query = {query: context.user.address};
        }
    }
    console.log('123123123' + JSON.stringify(query));

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

// exports.newscrawl = function(task, context, callback)
// {
//     var query = task.inRaw;
//     var request = require('request');
//     context.dialog.item = [];
//
//     request({
//         url: "http://news.naver.com",
//         method: 'get'
//     }, function(error, response, body) {
//         if (!error) {
//             console.log(body);
//             var items = body.split(',');
//             task.doc = {rate: items[1], date: (items[2]+" "+items[3]).replace(/['"]+/g, '')};
//             context.dialog.item.push(task.doc);
//             task.count = 1;
//         } else {
//             task.count = 0;
//         }
//         callback(task,context);
//     });
// };


var newscrawl = {
    module: 'http',
    action: "simpleRequest",
    uri: 'http://news.naver.com',
    method: 'GET',
    xpath: {
        _repeat: '//*[@id="main_content"]/div',
        link: './/div[3]/dl/dd/a/@href',
        category: './/div[1]/h4/a/text()',
        title: './/div[3]/dl/dd/a/text()',
        imageUrl: './/div[3]/dl/dt/a/img/@src'
    },
    postCallback: function (task, context, callback) {
        task.doc.forEach(function(d) {
            d.title = d.title.replace(/,/g, '');
        });
        task.doc = task.doc.splice(3,6);
        context.dialog.item = task.doc;
        task.count = task.doc.length;
        var result = [];
        async.eachSeries(context.dialog.item, function(doc, cb) {
            var _doc = {
                title: doc.category,
                text : doc.title,
                imageUrl : doc.imageUrl,
                buttons: [{url: doc.link, text: '상세보기'}]
            };
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            callback(task, context);
        });
    }
};

bot.setTask("newscrawl", newscrawl);
exports.newscrawl = newscrawl;

// var newsonecrawl = {
//     module: 'http',
//     action: "simpleRequest",
//     method: 'GET',
//     xpath: {
//         company: '//*[@id="main_content"]/div[2]/div[1]/a/img/@title',
//         title: '//*[@id="articleTitle"]/text()',
//         imageUrl: '//*[@id="articleBodyContents"]/span[1]/img/@src'
//     },
//     preCallback: function(task, context, callback) {
//         task.uri = context.dialog.item.link;
//         callback(task, context);
//     },
//     postCallback: function (task, context, callback) {
//         task.doc.url = task.uri;
//         context.dialog.item = task.doc;
//         task.count = task.doc.length;
//         // async.eachSeries(doc.items, function(doc, cb) {
//         //     var _doc = {
//         //         title: doc.title,
//         //         text : doc.lprice + ' ~ ' + doc.hprice,
//         //         imageUrl : doc.image,
//         //         buttons: [{url: doc.link, text: '상세보기'}]
//         //     };
//         //     result.push(_doc);
//         //     cb(null)
//         // }, function (err) {
//         //     task.result = {items: result};
//         //     if (task.result.items.length == 0) {
//         //         task.result = null;
//         //     }
//         //     callback(task, context);
//         // });
//         console.log(task.doc.imageUrl);
//         task.result = {
//                 // title: task.doc.title,
//                 // text: task.doc.company,
//                 image: {url:task.doc.imageUrl},
//                 buttons: [{url: task.doc.url, text: '상세보기'}]
//             };
//         callback(task, context);
//     }
// };
//
// bot.setTask("newsonecrawl", newsonecrawl);
// exports.newsonecrawl = newsonecrawl;


function searchNaver(task, context, callback) {
    task.query=context.dialog.inRaw;

    address.naverGeoSearch(task, context, function(task, context) {
        for(var i = 0; i < task.doc.length; i++) {
            var item = task.doc[i];
            item.title = item.title.replace(/<[^>]+>/, '');
            item.title = item.title.replace(/<\/[^>]+>/, '');
        }

        if(task.doc && task.doc.length > 0) task.count = task.doc.length;
        else task.count = 0;

        context.dialog.item = task.doc;
        if (context.dialog.item.length != 0) {
            var result = [];
            async.eachSeries(context.dialog.item, function(doc, cb) {
                context.dialog.address = doc.address;
                naverGeocode(task, context, function (task, context) {
                    context.dialog.lat = task.lat;
                    context.dialog.lng = task.lng;
                    doc.link = 'http://map.daum.net/link/map/' + doc.title + ',' + context.dialog.lat + ',' + context.dialog.lng;
                    var _doc = {
                        title: doc.title,
                        text : doc.telephone + '\n' + doc.description,
                        imageUrl : doc.imageUrl,
                        link: doc.link,
                        buttons: [{url: doc.link, text: '상세보기'}]
                    };
                    result.push(_doc);
                    cb(null)
                });
            }, function (err) {
                task.result = {items: result};
                callback(task, context);
            });
        } else {
            context.dialog.check = 're';
            callback(task, context);
        }
    });

}

exports.searchNaver = searchNaver;



function navershopping(task, context, callback) {

    var query = {query: task['1']};
    var request = require('request');

    request({
        url: 'https://openapi.naver.com/v1/search/shop.json?start=1&display=30&sort=sim',
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
            var doc = JSON.parse(body);
            context.dialog.item = doc.items;
            context.dialog.item.forEach(function (a) {
                a.title = a.title.replace(/<b>|<\/b>/g, '');
            });
            var result = [];
            async.eachSeries(doc.items, function(doc, cb) {
                if (doc.hprice != 0) {
                    var _doc = {
                        title: doc.title,
                        text: doc.lprice + '원 ~ ' + doc.hprice + '원',
                        imageUrl: doc.image,
                        buttons: [{url: doc.link, text: '상세보기'}]
                    };
                    result.push(_doc);
                } else {
                    var _doc = {
                        title: doc.title,
                        text: doc.lprice + '원',
                        imageUrl: doc.image,
                        buttons: [{url: doc.link, text: '상세보기'}]
                    };
                    result.push(_doc);
                }
                cb(null)
            }, function (err) {
                task.result = {items: result};
                if (task.result.items.length == 0) {
                    task.result = null;
                }
                callback(task, context);
            });
        }
    });
}

exports.navershopping = navershopping;

