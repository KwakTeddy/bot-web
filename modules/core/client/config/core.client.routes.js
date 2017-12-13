'use strict';

// Setting up route
angular.module('playchat').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location)
    {
        $injector.get('$state').transitionTo('not-found', null, { location: false });
    });

    $stateProvider.state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html'
    });

    $stateProvider.state('home', {
        url: '/',
        controller: function($state, $stateParams)
        {
            window.location.href = '/';
        }
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
