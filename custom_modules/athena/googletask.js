var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var google = require('googleapis');
var util = require('util');
var async = require('async');
const base64url = require('base64url');
// var googleAuth = require('google-auth-library');

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
        request({
            url: 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?access_token=' + access_token,
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
