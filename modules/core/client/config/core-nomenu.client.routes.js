angular.module('core')

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home-nomenu', {
        url: '/cscenter',
        templateUrl: 'modules/core/client/views/nomenu-home.client.view.html',
        controller: 'WebcsController',
        controllerAs: 'vm'
      })
      .state('user-home', {
        url: '/user',
        templateUrl: 'modules/core/client/views/user-home.client.view.html',
        controller: 'UserHomeController',
        controllerAs: 'vm'
      })
      .state('private-bot', {
        url: '/private',
        templateUrl: 'modules/core/client/views/private-bot.client.view.html',
        controller: 'PrivateBotController',
        controllerAs: 'vm'
      })
    ;
  });


