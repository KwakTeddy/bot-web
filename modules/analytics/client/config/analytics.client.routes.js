'use strict';

angular.module('analytics').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('analytics', {
        abstract: true,
        url: '/developer/analytics',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'enterprise', 'admin'],
        }
      })
      .state('analytics.dashboard', {
        url: '',
        templateUrl: 'modules/analytics/client/views/dashboard.client.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('analytics.user-statistics', {
        url: '/user-statistics',
        templateUrl: 'modules/analytics/client/views/user-statistics.client.view.html',
        controller: 'UserStatisticsController'
      })
      .state('analytics.dialog-amount-statistics', {
        url: '/dialog-amount-statistics',
        templateUrl: 'modules/analytics/client/views/dialog-amount-statistics.client.view.html',
        controller: 'DialogAmountStatisticsController'
      })
      .state('analytics.senario-usage-statistics', {
        url: '/senario-usage-statistics',
        templateUrl: 'modules/analytics/client/views/senario-usage-statistics.client.view.html',
        controller: 'SenarioUsageStatisticsController'
      })
      .state('analytics.user-input-statistics', {
        url: '/user-input-statistics',
        templateUrl: 'modules/analytics/client/views/user-input-statistics.client.view.html',
        controller: 'UserInputStatisticsController'
      })
      .state('analytics.fail-dialog-statistics', {
        url: '/fail-dialog-statistics',
        templateUrl: 'modules/analytics/client/views/fail-dialog-statistics.client.view.html',
        controller: 'FailDialogStatisticsController'
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
      })
      .state('analytics.manage-batch', {
        url: '/manage-batch',
        templateUrl: 'modules/analytics/client/views/manage-batch.client.view.html',
        controller: 'ManageBatchController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-failure-maintenance', {
        url: '/dialog-failure-maintenance',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('analytics.dialog-failure-maintenance.list', {
        url: '',
        templateUrl: 'modules/analytics/client/views/list-dialog-failure-maintenance.client.view.html',
        controller: 'AnalyticsListController',
        controllerAs: 'vm'
      })
      .state('analytics.dialog-failure-maintenance.edit', {
        url: '/:intentId/edit',
        templateUrl: 'modules/analytics/client/views/form-dialog-failure-maintenance.client.view.html',
        controller: 'IntentFailMaintenanceController',
        controllerAs: 'vm'
      })
  }
]);


