'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $stateProvider.state('signin', {
        url: '/signin',
        templateUrl: 'modules/authentication/client/views/signin.client.view.html',
        controller: 'AuthenticationController'
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
