'use strict';

angular.module('analytics').factory('AnalyticsService', ['$resource',
  function ($resource) {
    return $resource('api/user-count/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogUsageService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-usage/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('SessionSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/session-success/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-success/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogFailureService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-failure/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);
