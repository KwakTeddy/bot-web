var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var util = require('util');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var config = require(path.resolve('./config/config'));
var mongoose = require('mongoose');
var taskmodule = require(path.resolve('./modules/bot/action/common/task'));
var Entities = require('html-entities').AllHtmlEntities;

function api (data) {
    var request = require('request');
    var authCode = data.req.query.code;
    var userId = data.req.query.state;
    console.log(authCode);

    var options = {
        method: 'POST',
        url: 'https://www.googleapis.com/oauth2/v4/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'code' : authCode,
            'client_id' : '567723322080-uopbt6mrcntsqn79hr8j260t5sbsui8n.apps.googleusercontent.com',
            'client_secret' :'6MOFtpKbkGeKLFdLUf0Ffwtp',
            // 'redirect_uri' : 'http%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fgmail%2Fanothercallback',
            'redirect_uri' : 'http://localhost:8443/api/auth/gmail/callback',
            'grant_type' : 'authorization_code'
        }
    };

    request(options, function (error, response, body) {
        console.log(response);
        if (error) {
            console.log(error);
        } else if(!error && response.statusCode == 200) {
            console.log(response.statusCode, body);
            var data = JSON.parse(body);
            console.log(data);
            global._users[userId].google_accesstoken = data.access_token;
            // global._users[userId].google_refreshtoken = data.refresh_token;
            // var doc = JSON.parse(body);
            // if(error) {
            //     console.log(error);
            // } else {
            //     console.log(response.statusCode, body);
            // }
            request({
                url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + data.access_token,
                method: 'GET'
            }, function (error, response, body) {
                console.log(JSON.parse(body));
                console.log(response);
                if (error) {
                    console.log(error);
                } else if(!error && response.statusCode == 200) {
                    console.log(response.statusCode, body);
                    var doc = JSON.parse(body);
                    global._users[userId].google_email = doc.email;
                    global._users[userId].google_name = doc.name;
                    // if(error) {
                    //     console.log(error);
                    // } else {
                    //     console.log(response.statusCode, body);
                    // }
                }
            })
        }
    })


}

exports.api = api;



function gmailapi(task, context, callback) {
    if (context.user.google_accesstoken) {
        var request = require('request');
        var access_token = context.user.google_accesstoken;
        var email = context.user.google_email;
        request({
            url: 'https://www.googleapis.com/gmail/v1/users/' + email + '/messages?access_token=' + access_token + '&maxResults=10',
            method: 'GET'
            // headers: {
            //     'Authorization': 'Bearer oauth2-token'
            // }
        }, function (error, response, body) {
            console.log(response);
            if (error) {
                console.log(error);
            } else if (!error && response.statusCode == 200) {
                console.log(response.statusCode, body);
                var doc = JSON.parse(body);
                context.dialog.item = new Array ();
                async.eachSeries(doc.messages, function(doc, cb) {
                    request({
                        url: 'https://www.googleapis.com/gmail/v1/users/'+ email +'/messages/' + doc.id + '?access_token=' + access_token,
                        method: 'GET'
                    }, function (error, response, body) {
                        console.log(response);
                        if (error) {
                            console.log(error);
                        } else if (!error && response.statusCode == 200) {
                            console.log(response.statusCode, body);
                            var detail = JSON.parse(body);
                            console.log(JSON.stringify(detail));
                            var title = detail.payload.headers.filter(function( obj ) {
                                return obj.name == 'Subject';
                            });
                            var sendman = detail.payload.headers.filter(function (obj) {
                                return obj.name == 'Return-Path'
                            });
                            var sender = sendman[0].value.replace(/>/,'');
                            sender = sender.replace(/</,'');
                            var _doc = {
                                title: title[0].value,
                                snippet: detail.snippet,
                                sendman: sender

                            };

                            context.dialog.item.push(_doc);

                            cb(null);
                            // if(error) {
                            //     console.log(error);
                            // } else {
                            //     console.log(response.statusCode, body);
                            // }
                        }
                    })
                }, function (err) {
                    callback(task,context);
                });
                // if(error) {
                //     console.log(error);
                // } else {
                //     console.log(response.statusCode, body);
                // }
            }
        });
    } else {
        callback(false);
    }
}


exports.gmailapi = gmailapi;

// function test () {
//     fs.readFile('client_secret.json', function processClientSecrets(err, content) {
//         if (err) {
//             console.log('Error loading client secret file: ' + err);
//             return;
//         }
//         // Authorize a client with the loaded credentials, then call the
//         // Gmail API.
//         authorize(JSON.parse(content), listLabels);
//     });
// }
//
// exports.test = test;

function calendarapi(task, context, callback) {
    if (context.user.google_accesstoken) {
        var request = require('request');
        var access_token = context.user.google_accesstoken;
        request({
            url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=' + access_token,
            method: 'GET'
            // headers: {
            //     'Authorization': 'Bearer oauth2-token'
            // }
        }, function (error, response, body) {
            console.log(response);
            if (error) {
                console.log(error);
            } else if (!error && response.statusCode == 200) {
                console.log(response.statusCode, body);
                var doc = JSON.parse(body);
                context.dialog.item = doc.items;

                callback(task,context);
                // if(error) {
                //     console.log(error);
                // } else {
                //     console.log(response.statusCode, body);
                // }
            }
        });
    } else {
        callback(false);
    }
}


exports.calendarapi = calendarapi;

function eventapi(task, context, callback) {
    if (context.user.google_accesstoken) {
        var request = require('request');
        var access_token = context.user.google_accesstoken;
        var calendarId = context.dialog.calendar.id;
        var currenttime = new Date();
        // if (currenttime.getMonth() == 11) {
        //     var nextmonth = new Date(currenttime.getFullYear() + 1, 0, 1);
        // } else {
        //     var nextmonth = new Date(currenttime.getFullYear(), (currenttime.getMonth()+1)%12 + 1, 1);
        // }
        var mintime = new Date(currenttime.getFullYear(), currenttime.getMonth(), currenttime.getDate(), 0, 0, 0);
        var maxtime = new Date(currenttime.getFullYear(), currenttime.getMonth(), currenttime.getDate(), 23, 59, 59);
        mintime = mintime.toISOString();
        maxtime = maxtime.toISOString();
        // nextmonth = nextmonth.toISOString();
        request({
            url: 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?access_token=' + access_token + '&timeMin=' + mintime + '&timeMax=' + maxtime +'&orderBy=startTime&singleEvents=true',
            method: 'GET'
            // headers: {
            //     'Authorization': 'Bearer oauth2-token'
            // }
        }, function (error, response, body) {
            console.log(response);
            if (error) {
                console.log(error);
            } else if (!error && response.statusCode == 200) {
                console.log(response.statusCode, body);
                var doc = JSON.parse(body);
                var events = doc.items;
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if(event.start.date) {
                        var date = event.start.date;
                        event.dateTime = date.replace(/-/g, "/")
                    } else {
                        event.start.dateTime = new Date((event.start.dateTime || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
                        event.dateTime = event.start.dateTime.getFullYear() + '/' + (event.start.dateTime.getMonth() + 1) + '/' + event.start.dateTime.getDate() + ' ' + event.start.dateTime.getHours() + '시';
                    }
                }
                context.dialog.event = events;
                callback(task,context);
                // if(error) {
                //     console.log(error);
                // } else {
                //     console.log(response.statusCode, body);
                // }
            }
        });
    } else {
        callback(false);
    }
}


exports.eventapi = eventapi;

function googlesearch(task, context, callback) {
    task.query = task['1'];
    taskmodule.executeTask(googlesearchtask, context, function(task, context) {
        callback(task, context);
    });
    callback(task,context);
};

exports.googlesearch = googlesearch;

var googlesearchtask = {
    module: 'http',
    action: "simpleRequest",
    uri: 'https://www.google.co.kr/search',
    method: 'GET',
    param: {
        // q: task.query,
        // oq: task.query,
        aqs:'chrome..69i57j69i60j0l4.62443j0j4',
        sourceid:'chrome',
        ie:'UTF-8'
    },
    xpath: {
        _repeat: '//div[@class="_NId"]/div[@class="srg"]/div',
        title: './/div/h3/a/text()',
        body: './/div/div/span/node()',
        url: './/div/h3/a/@href'
    },
    preCallback: function (task,context,callback) {
        task.query = task['1'];
        callback(task,context,callback);
    },
    postCallback: function (task, context, callback) {
        async.eachSeries(task.doc, function(doc, cb) {
            var snippet = '';
            async.eachSeries(doc.body, function(source, cb) {
                if (source.data) {
                    snippet = snippet + source.data;
                } else {
                    snippet = snippet + source.firstChild.data;
                }
                cb(null)
            }, function (err) {
                doc.title = doc.title.replace(/\|/g,'');
                doc.snippet = snippet;
                cb(null)
            });
        }, function (err) {
            context.dialog.result = task.doc;
            callback(task,context);
        });
    }
};

exports.googlesearchtask = googlesearchtask;
bot.setTask('googlesearchtask', googlesearchtask);

