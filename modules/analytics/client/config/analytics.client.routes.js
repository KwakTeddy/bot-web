'use strict';

angular.module('analytics').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('analytics', {
        abstract: true,
        url: '/analytics',
        template: '<ui-view/>'
      })
      .state('analytics.dashboard', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dashboard.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('analytics.user-count', {
        url: '',
        templateUrl: 'modules/analytics/client/views/user-count.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('analytics.dialog-usage', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dialog-usage.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('analytics.dialog-success', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dialog-success.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('analytics.dialog-failure', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dialog-failure.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      })
      .state('analytics.session-success', {
        url: '',
        templateUrl: 'modules/analytics/client/views/session-success.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
        }
      });
  }
]);


