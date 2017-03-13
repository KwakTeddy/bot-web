(function () {
  'use strict';

  angular
    .module('messengers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mobile.messengers', {
        abstract: true,
        url: '/messengers'
      })
      .state('mobile.messengers.list', {
        url: '',
        views: {
          'menuContent@': {
            templateUrl: 'modules/messengers/client/views/list-messengers.mobile.view.html',
            controllerAs: 'vm'
            // controller: 'MessengersListController',
          }
        }
      })
      .state('mobile.messengers.chat', {
        url: '/chat',
        views: {
          'menuContent@': {
            templateUrl: 'modules/messengers/client/views/chat-messengers.mobile.view.html',
            controllerAs: 'vm',
            controller: 'ChatMessengersController'
          }
        }
      });
  }

})();
