'use strict';

angular.module('analytics').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('analytics', {
        abstract: true,
        url: '/developer/analytics',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin']
        }
      })
      .state('analytics.dashboard', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dashboard.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.user-count', {
        url: '/user-count',
        templateUrl: 'modules/analytics/client/views/user-count.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-usage', {
        url: '/dialog-usage',
        templateUrl: 'modules/analytics/client/views/dialog-usage.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-success', {
        url: '/dialog-success',
        templateUrl: 'modules/analytics/client/views/dialog-success.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-failure', {
        url: '/dialog-failure',
        templateUrl: 'modules/analytics/client/views/dialog-failure.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.session-success', {
        url: '/session-success',
        templateUrl: 'modules/analytics/client/views/session-success.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-intent', {
        url: '/dialog-intent',
        templateUrl: 'modules/analytics/client/views/dialog-intent.client.view.html',
        controller: 'AnalyticsIntentController',
        controllerAs: 'vm'
      });
  }
]);


