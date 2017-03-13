var path = require('path');
var mongo = require(path.resolve('./modules/bot/action/common/mongo'));
var bot = require(path.resolve('config/lib/bot')).getBot('athena');
var google = require('googleapis');
// var googleAuth = require('google-auth-library');

function api (data) {
    var request = require('request');
    var authCode = data.req.query.code;
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
            'redirect_uri' : 'http%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fgmail%2Fcallback',
            // 'redirect_uri' : 'http://localhost:8443/api/auth/gmail/anothercallback',
            'grant_type' : 'authorization_code'
        }
    };

    request(options, function (error, response, body) {
        console.log(response);
        if (error) {
            console.log(error);
        } else if(!error) {
            console.log(response.statusCode, body);
            // var doc = JSON.parse(body);
            // if(error) {
            //     console.log(error);
            // } else {
            //     console.log(response.statusCode, body);
            // }
            callback(task, context);
        }
    })


}

exports.api = api;



// function gmailapi(task, context, callback) {
//     var request = require('request');
//     request({
//         url: 'https://www.googleapis.com/gmail/v1/users/me/messages?access_token=231379844282-g4t4ltrajhuv4i9b9tghp2lv5ke6g0an.apps.googleusercontent.com',
//         method: 'GET'
//         // headers: {
//         //     'Authorization': 'Bearer oauth2-token'
//         // }
//     }, function (error, response, body) {
//         if (error) {
//             console.log(error);
//         } else if(!error && response.statusCode == 200) {
//             console.log(response.statusCode, body);
//             var doc = JSON.parse(body);
//             // if(error) {
//             //     console.log(error);
//             // } else {
//             //     console.log(response.statusCode, body);
//             // }
//             callback(task, context);
//         }
//     });
// }


// exports.gmailapi = gmailapi;

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

function listLabels(auth) {
    var gmail = google.gmail('v1');
    gmail.users.labels.list({
        auth: auth,
        userId: 'me',
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var labels = response.labels;
        if (labels.length == 0) {
            console.log('No labels found.');
        } else {
            console.log('Labels:');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                console.log('- %s', label.name);
            }
        }
    });
}


