'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('developer-home', {
      url: '/developer',
      templateUrl: 'modules/core/client/views/landing-bots.client.view.html',
      controller: 'LandingBotsController',
      controllerAs: 'vm',
      resolve: {
        botsResolve: getBots
      },
      data: {
        roles: ['user', 'enterprise', 'admin'],
      }
    })
    .state('not-found', {
      url: '/developer/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/developer/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/developer/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('privacy', {
        url: '/developer/privacy',
        templateUrl: 'modules/users/client/views/authentication/signup.client.privacy.view.html',
        data: {
            ignoreState: true
        }
    })
  }
]);
