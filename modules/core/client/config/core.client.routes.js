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
    // .state('developer-home', {
    //   url: '/developer',
    //   templateUrl: 'modules/core/client/views/home.client.view.html',
    //   controller: 'HomeController',
    //   controllerAs: 'vm',
    //   data: {
    //     roles: ['user', 'enterprise', 'admin']
    //   }
    // })
    .state('developer-home', {
      url: '/developer',
      templateUrl: 'modules/bots/client/views/list-bots.client.view.html',
      controller: 'BotListController',
      controllerAs: 'vm',
      resolve: {
        botsResolve: getBots
      },
      data: {
        roles: ['user', 'enterprise', 'admin'],
        botCheck : true
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
    .state('facebookOvertext', {
      url: '/developer/facebookOvertext',
      templateUrl: 'modules/users/client/views/authentication/signup.client.privacy.view.html',
      data: {
        ignoreState: true
      }
    })
  }
]);
