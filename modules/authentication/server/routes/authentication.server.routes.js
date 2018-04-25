'use strict';

var authentication = require('../controllers/authentication.server.controller.js');
var UserController = require('../controllers/users.server.controller.js');

module.exports = function(app)
{
    app.get('/auth/facebook', authentication.oauthCall('facebook', {scope: ['email']}));
    app.route('/auth/facebook/page').get(authentication.oauthCall('facebook', { scope: [ 'manage_pages', 'pages_show_list', 'pages_messaging' ]}));
    app.route('/auth/facebook/:callback').get(authentication.oauthCallback('facebook'));

    app.route('/auth/kakao').get(authentication.oauthCall('kakao'));
    app.route('/auth/kakao/:callback').get(authentication.oauthCallback('kakao'));

    app.route('/auth/google').get(authentication.oauthCall('google', { scope: [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.login'] }));
    app.route('/auth/google/:callback').get(authentication.oauthCallback('google'));

    app.get('/api/auth/signout', authentication.signout);
    app.post('/api/auth/signin', authentication.signin);
    app.post('/api/auth/signup', authentication.signup);
    app.post('/api/auth/forgot', authentication.forgot);
    app.get('/api/auth/emailconfirm/:token', authentication.validateEmailConfirmToken);
    app.post('/api/auth/emailconfirm/code', authentication.validateEmailConfirmCode);
    app.post('/api/users', UserController.updateUser);

    app.route('/auth/reset/:token/:from').get(UserController.validateResetToken);
    app.route('/auth/reset/:token').post(UserController.reset);
};

/**
 * Module dependencies.
 */
// var passport = require('passport');
// const util = require('util'); //temporary
// module.exports = function (app) {
//   // User Routes
//   var users = require('../controllers/users.server.controller');
//   // Setting up the users password api
//   app.route('/api/auth/forgot').post(users.forgot);
//   app.route('/api/auth/reset/:token/:from').get(users.validateResetToken);
//   app.route('/api/auth/reset/:token').post(users.reset);
//
//   //Setting up the emailconfirm api
//   app.route('/api/auth/emailconfirm/:token').get(users.validateEmailConfirmToken);
//
//     // Setting up the users authentication api
//   app.route('/api/auth/signup').post(users.signup);
//   app.route('/api/auth/signin').post(users.signin);
//   app.route('/api/auth/signout').get(users.signout);
//
//   // Setting the facebook oauth routes
//   app.route('/api/auth/facebook').get(users.oauthCall('facebook', {
//     scope: [
//         'email'
//     ]
//   }));
//   app.route('/api/auth/facebook/page').get(users.oauthCall('facebook', {
//     scope: [
//       'manage_pages',
//       'pages_show_list',
//       'pages_messaging'
//   ]}));
//
//   app.route('/api/auth/facebook/token/:userId').get(users.getToken);
//
//   app.route('/api/auth/facebook/:callback').get(users.oauthCallback('facebook'));
//
//   // Setting the twitter oauth routes
//   app.route('/api/auth/twitter').get(users.oauthCall('twitter'));
//   app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));
//
//   // Setting the kakao oauth routes
//   app.route('/api/auth/kakao').get(users.oauthCall('kakao'));
//   app.route('/api/auth/kakao/:callback').get(users.oauthCallback('kakao'));
//
//     // Setting the google oauth routes
//   app.route('/api/auth/google').get(users.oauthCall('google', {
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email',
//       'https://www.googleapis.com/auth/plus.login'
//     ]
//   }));
//   app.route('/api/auth/google/:callback').get(users.oauthCallback('google'));
//
//   app.route('/api/auth/gmail/callback').get(function (err, data){
//     // console.log(util.inspect(data));
//     googletask.api(data);
//   });
//   // app.route('/api/auth/gmail').get(users.oauthCall('google', {
//   //   scope: [
//   //     'https://www.googleapis.com/auth/userinfo.profile',
//   //     'https://www.googleapis.com/auth/userinfo.email',
//   //     'https://mail.google.com'
//   //   ]
//   // }));
//   // app.route('/api/auth/gmail/callback').get(users.oauthCallback('google'));
//
//   // function (err, data) {
//   //   console.log(util.inspect(data.req.query.code));
//   //   return data.req.query.code;
//   //   var authCode = data.req.query.code;
//   //   var data1 = {
//   //     code : authCode,
//   //   client_id : '567723322080-uopbt6mrcntsqn79hr8j260t5sbsui8n.apps.googleusercontent.com',
//   //   client_secret :'6MOFtpKbkGeKLFdLUf0Ffwtp',
//   //   redirect_uri : 'http://localhost:8443/api/auth/gmail/anothercallback',
//   //   grant_type : 'authorization_code'
//   //   };
//   //
//   // })
//   // https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fmail.google.com&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fgmail%2Fcallback&access_type=offline&response_type=code&client_id=567723322080-uopbt6mrcntsqn79hr8j260t5sbsui8n.apps.googleusercontent.com
//
//   // Setting the linkedin oauth routes
//   app.route('/api/auth/linkedin').get(users.oauthCall('linkedin', {
//     scope: [
//       'r_basicprofile',
//       'r_emailaddress'
//     ]
//   }));
//   app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));
//
//   // Setting the github oauth routes
//   app.route('/api/auth/github').get(users.oauthCall('github'));
//   app.route('/api/auth/github/callback').get(users.oauthCallback('github'));
//
//   // Setting the paypal oauth routes
//   app.route('/api/auth/paypal').get(users.oauthCall('paypal'));
//   app.route('/api/auth/paypal/callback').get(users.oauthCallback('paypal'));
// };

