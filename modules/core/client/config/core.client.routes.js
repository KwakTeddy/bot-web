'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location)
    {
        $injector.get('$state').transitionTo('not-found', null, { location: false });
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
