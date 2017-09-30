var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('./bot-engine/bot')).getBot('athena');
var addressModule = require(path.resolve('modules/bot/action/common/address'));
var async = require('async');
var yahooFinance = require('yahoo-finance');

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

function currentweather(task, context, callback) {
    if (context.dialog.address || context.user.address) {
        if (context.dialog.address) {
            if (!(Array.isArray(context.dialog.address))) {
                if (context.dialog.address.법정읍면동명 == undefined) {
                    callback(task, context);
                } else {
                    naverGeocode(task, context, function (task, context) {
                        context.user.lat = context.dialog.lat = task.lat;
                        context.user.lng = context.dialog.lng = task.lng;
                        if (context.dialog.address) {
                            context.user.address = context.dialog.address;
                        }
                        currentweatherapi(task, context, function (task, context) {
                            context.dialog.weather = task.weather;
                            console.log('222');
                            callback(task, context);
                        })
                    })
                }
            } else if (context.dialog.address) {
                task.result = null;
                callback(task, context);
            }
        } else if (context.user.address) {
            if (context.user.address.법정읍면동명 == undefined) {
                callback(task, context);
            } else {
                naverGeocode(task, context, function (task, context) {
                    context.user.lat = context.dialog.lat = task.lat;
                    context.user.lng = context.dialog.lng = task.lng;
                    if (context.dialog.address) {
                        context.user.address = context.dialog.address;
                    }
                    currentweatherapi(task, context, function (task, context) {
                        context.dialog.weather = task.weather;
                        console.log('333');
                        callback(task, context);
                    })
                })
            }
        } else {
            task.result = null;
            callback(task, context);
        }
    } else {
        callback(task, context);
    }
}

exports.currentweather = currentweather;

function currentweatherapi(task, context, callback) {
    var lat = context.user.lat;
    var lon = context.user.lng;
    console.log('weather: lat: '+lat+'lon: '+lon);
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
            task.imgUrl = doc.current_observation.icon_url;
            console.log('weather: '+task.weather+'temp: '+task.temp);
            task.result = {
                image: {url: task.imgUrl}
            };
            console.log(JSON.stringify(task.result));
            callback(task, context);
        }
    });
}


exports.currentweatherapi = currentweatherapi;

function forecastweather(task, context, callback) {
    if (context.dialog.address || context.user.address) {
        if (context.dialog.address) {
            if (!(Array.isArray(context.dialog.address))) {
                if (context.dialog.address.법정읍면동명 == undefined) {
                    callback(task, context);
                } else {
                    naverGeocode(task, context, function (task, context) {
                        context.user.lat = context.dialog.lat = task.lat;
                        context.user.lng = context.dialog.lng = task.lng;
                        if (context.dialog.address) {
                            context.user.address = context.dialog.address;
                        }
                        forecastweatherapi(task, context, function (task, context) {
                            var result = [];
                            if (!(Array.isArray(context.dialog.item))) {
                                context.dialog.item = [context.dialog.item]
                            }
                            async.eachSeries(context.dialog.item, function(doc, cb) {
                                var _doc = {
                                    title: doc.conditions + ' - ' +doc.low + '도 ~ ' + doc.high + '도',
                                    text : doc.date.month + '월 ' + doc.date.day + '일 ' + context.user.address.법정읍면동명,
                                    imageUrl : doc.icon_url
                                };
                                result.push(_doc);
                                cb(null)
                            }, function (err) {
                                if (result.length == 1){
                                    context.dialog.item = context.dialog.item[0];
                                    task.result = {
                                        image: {url: result[0].imageUrl}
                                    }
                                } else {
                                    task.result = {items: result};
                                }
                                callback(task, context);
                            });
                        })
                    })
                }
            } else if (context.dialog.address) {
                task.result = null;
                callback(task, context);
            }
        } else if (context.user.address) {
            if (context.user.address.법정읍면동명 == undefined) {
                callback(task, context);
            } else {
                naverGeocode(task, context, function (task, context) {
                    context.user.lat = context.dialog.lat = task.lat;
                    context.user.lng = context.dialog.lng = task.lng;
                    if (context.dialog.address) {
                        context.user.address = context.dialog.address;
                    }
                    forecastweatherapi(task, context, function (task, context) {
                        var result = [];
                        if (!(Array.isArray(context.dialog.item))) {
                            context.dialog.item = [context.dialog.item]
                        }
                        async.eachSeries(context.dialog.item, function(doc, cb) {
                            var _doc = {
                                title: doc.conditions + ' - ' +doc.low + '도 ~ ' + doc.high + '도',
                                text : doc.date.month + '월 ' + doc.date.day + '일 ' + context.user.address.법정읍면동명,
                                imageUrl : doc.icon_url
                            };
                            result.push(_doc);
                            cb(null)
                        }, function (err) {
                            if (result.length == 1){
                                context.dialog.item = context.dialog.item[0];
                                task.result = {
                                    image: {url: result[0].imageUrl}
                                }
                            } else {
                                task.result = {items: result};
                            }
                            callback(task, context);
                        });
                    })
                })
            }
        } else {
            task.result = null;
            callback(task, context);
        }
    } else {
        callback(task, context);
    }
}

exports.forecastweather = forecastweather;

function forecastweatherapi(task, context, callback) {
    var lat = context.user.lat;
    var lon = context.user.lng;
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
            if (Array.isArray(task.date) == true) {
                task.date = task.date[task.date.length - 1];
            }
            var today = new Date();
            var oneDay = 24*60*60*1000;
            var secondDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
            var firstDate = new Date(task.date.getFullYear(),task.date.getMonth(),task.date.getDate());
            var diffDays = Math.round((firstDate.getTime() - secondDate.getTime())/(oneDay));
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
        "엔":"JPY",
        "중국":"CNY",
        "유럽":"EUR",
        "일본":"JPY",
        "미국":"USD",
        "호주":"AUD",
        "캐나다":"CAD",
        "홍콩":"HKD",
        "프랑스":"EUR",
        "대만":"TWD",
        "필리핀":"PHP",
        "페소":"PHP",
        "베트남":"VND",
        "태국":"THB",
        "싱가폴":"SGD",
        "바트":"THB",
        "이탈리아":"EUR"
    };
    var matched = false;
    var re = /(달러|유로|위안|엔|미국|중국|유럽|일본|호주|캐나다|홍콩|프랑스|대만|필리핀|페소|베트남|태국|싱가폴|바트|이탈리아)|([A-Z]{3})/ig;
    text = text.replace(/화/g,'');
    text = text.replace(re, function(match, p1, p2) {
        matched = true;
        if (p1) {
            context.dialog.currency = currency[p1];
        } else if (p2) {
            context.dialog.currency = p2;
        }
        callback(text,task,matched);
    });
    callback(text,task,matched);
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
            var date = items[2].split('/');
            task.doc = {rate: items[1], date: (date[2]+'년 '+date[1]+'월 '+date[0]+'일 '+items[3]).replace(/['"]+/g, '')};
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
    var codes = context.bot.codes;
    var code = context.bot.codes;
    codes = Object.keys(codes);
    codes = codes.toString();
    // codes = codes.replace(/\[/g, '');
    // codes = codes.replace(/]/g, '');
    // codes = codes.replace(/'/g, '');
    codes = codes.replace(/,/g, '|');
    codes = '(' + codes + ')';
    var re = new RegExp(codes,"g");
    console.log(re);
    text = text.replace(re, function(match, p1) {
        matched = true;
        if (p1) {
            context.dialog.stock = code[p1];
            context.dialog.stockname = p1;
        }
        callback(text,task,matched);
    });
    callback(text,task,matched);
};


exports.stockprice = function(task, context, callback) {
    context.dialog.item = [];

    yahooFinance.snapshot({
        symbol: context.dialog.stock,
        fields: ['s', 'n', 'd1', 'l1', 'y', 'r']
    }).then(function(snapshot) {
        if (snapshot.lastTradePriceOnly != null) {
            task.doc = snapshot;
            var year = task.doc.lastTradeDate.getFullYear();
            var month = task.doc.lastTradeDate.getMonth();
            var date = task.doc.lastTradeDate.getDate();
            var hour = task.doc.lastTradeDate.getHours();
            task.doc.Date = year + '년 ' + (month + 1) + '월 ' + date + '일 ' + hour + '시';
            context.dialog.item = task.doc;
            context.dialog.item.stockname = context.dialog.stockname;
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

var csvFile = path.resolve("custom_modules/athena/codes.csv");
global._bots['athena'].codes = {};

csv({noheader:true})
    .fromFile(csvFile)
    .on('csv',  function(csvRow) {
        global._bots['athena'].codes[csvRow[0]] = csvRow[1] + ".KS";
    })
    .on('done', function(error) {
    });

function itunesmusic(task, context, callback) {
    var query = task['1'];
    var itunesApiSearch = require('itunes-api-search');
    itunesApiSearch.search( query,{
        media: 'music',
        limit: 20, // max 200
        country: 'US'
    }, function (err, res) {
        if (err) {
            console.log(err);
            return;
        }
        context.dialog.item = res.results;
        var result = [];
        async.eachSeries(context.dialog.item, function(doc, cb) {
            var _doc = {
                title: doc.artistName + ' - ' + doc.trackName,
                text : doc.collectionName,
                imageUrl : doc.artworkUrl100,
                buttons: [{url: doc.previewUrl, text: '30초 듣기'}]
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
    });
}


exports.itunesmusic = itunesmusic;

function youtube(task, context, callback) {
    var query = task['1'];
    var search = require('youtube-search');
    var opts = {
        maxResults: 20,
        key: 'AIzaSyDFfCi-x6iMRxdN_V7U2pSCQFzGseNzSBM'
    };

    search(query, opts, function(err, res) {
        if(err) {
            return console.log(err);
        }
        context.dialog.item = res;
        var result = [];
        async.eachSeries(context.dialog.item, function(doc, cb) {
            if (doc.thumbnails) {
                var _doc = {
                    title: doc.title,
                    text: doc.channelTitle,
                    imageUrl: doc.thumbnails.medium.url,
                    buttons: [{url: doc.link, text: '상세보기'}]
                };
            } else {
                var _doc = {
                    title: doc.title,
                    text: doc.channelTitle,
                    buttons: [{url: doc.link, text: '상세보기'}]
                };
            }
            result.push(_doc);
            cb(null)
        }, function (err) {
            task.result = {items: result};
            if (task.result.items.length == 0) {
                task.result = null;
            }
            callback(task, context);
        });
    });
}


exports.youtube = youtube;
