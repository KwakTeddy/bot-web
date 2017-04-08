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
    uri: 'http://media.daum.net/ranking/popular',
    method: 'GET',
    xpath: {
        _repeat: '//*[@id="mArticle"]/div[2]/ul[3]/li',
        link: './/div[2]/strong/a/@href',
        company: './/div[2]/strong/span/text()',
        title: './/div[2]/strong/a/text()',
        imageUrl: './/a/img/@src',
        body: './/div[2]/div/span/text()'
    },
    postCallback: function (task, context, callback) {
        task.doc.forEach(function(d) {
            d.title = d.title.replace(/"/g, '\"');
            d.body = d.body.replace(/"/g, '\"');
            d.body = d.body.replace(/\\n/g, '');
            d.body = d.body.replace(/  /g, '');
        });
        context.dialog.item = task.doc;
        context.dialog.item = context.dialog.item.splice(0,20);
        task.count = task.doc.length;
        var result = [];
        async.eachSeries(context.dialog.item, function(doc, cb) {
            var _doc = {
                title: doc.title,
                text : doc.body,
                imageUrl : doc.imageUrl,
                buttons: [{url: doc.link, text: '상세보기'}]
            };
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    }
};

bot.setTask("newscrawl", newscrawl);
exports.newscrawl = newscrawl;

var moviecrawl = {
    module: 'http',
    action: "simpleRequest",
    uri: 'http://ticket2.movie.daum.net/Movie/MovieRankList.aspx',
    method: 'GET',
    xpath: {
        _repeat: '//*[@id="mArticle"]/div/div[2]/div[1]/div/ul/li',
        link: './/div/strong/a/@href',
        rate: './/div/div/em/text()',
        title: './/div/strong/a/text()',
        imageUrl: './/a/img/@src',
        reserverate: './/div/dl/dd[2]/text()[1]'
    },
    postCallback: function (task, context, callback) {
        task.doc.forEach(function(d) {
            d.reserverate = d.reserverate[0].data;
            d.reserverate = d.reserverate.replace(/ \(/g, '');
            d.rate = d.rate.replace(/ /g,'')
        });
        context.dialog.item = task.doc;
        task.count = task.doc.length;
        var result = [];
        async.eachSeries(context.dialog.item, function(doc, cb) {
            var _doc = {
                title: doc.title,
                text : '평점' + doc.rate + ' ' + doc.reserverate,
                imageUrl : doc.imageUrl,
                buttons: [{url: doc.link, text: '상세보기'}]
            };
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    }
};

bot.setTask("moviecrawl", moviecrawl);
exports.moviecrawl = moviecrawl;


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
                if (task.result.items.length == 0) {
                    task.result = null;
                }
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
        url: 'https://openapi.naver.com/v1/search/shop.json?start=1&display=10&sort=sim',
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

