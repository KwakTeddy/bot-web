'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('signin', {
        url: '/signin',
        templateUrl: 'modules/authentication/client/views/signin.client.view.html',
        controller: 'SigninController'
    });

    $stateProvider.state('password-forgot', {
        url: '/password/forgot',
        templateUrl: 'modules/authentication/client/views/password-forgot.client.view.html',
        controller: 'PasswordForgotController'
    });

    $stateProvider.state('password-reset', {
        url: '/password/reset/:token',
        templateUrl: 'modules/authentication/client/views/password-reset.client.view.html',
        controller: 'PasswordResetController'
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'modules/authentication/client/views/signup.client.view.html',
        controller: 'SignupController'
    });

    $stateProvider.state('user-profile', {
        url: '/playchat/user-profile',
        templateUrl: 'modules/authentication/client/views/user-profile.client.view.html',
        controller: 'UserProfileController'
    });

    //
    // var developerState = {
    //     url: '/developer',
    //     templateUrl: 'modules/core/client/views/landing-bots.client.view.html',
    //     data: {
    //         roles: ['user', 'enterprise', 'admin'],
    //     }
    // };
    //
    // // Home state routing
    // $stateProvider.state('developer-home', developerState);
}
]);
