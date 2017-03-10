'use strict';

angular.module('analytics').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('analytics', {
        abstract: true,
        url: '/analytics',
        template: '<ui-view/>'
      })
      .state('analytics.user-count', {
        url: '',
        templateUrl: 'modules/analytics/client/views/user-count.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'User Count'
        }
      })
      .state('analytics.dialog-usage', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dialog-usage.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'User Count'
        }
      });
  }
]);


