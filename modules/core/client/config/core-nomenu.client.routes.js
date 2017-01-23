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

      .state('mobile', {
        abstract: true,
        // views: {
        //   'menuContent@': {
        //     template: '<ion-nav-view name="mobileRoot" class="view-container"></ion-nav-view>'
        //   }
        // }
      })

      .state('mobile.design', {
        abstract: true,
        url: '/design',
        // views: {
        //   'menuContent@': {
        //     template: '<ion-nav-view name="menuContent" class="view-container"></ion-nav-view>'
        //   }
        // }
      })

      .state('mobile.design.test24', {
        url: '/test23',
        views: {
          'menuContent@': {
            templateUrl: 'modules/_design/client/views/view-invest04.mobile.view.html'
          }
        }
      })
    ;
  });


