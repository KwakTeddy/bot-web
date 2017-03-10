'use strict';

angular.module('analytics').factory('AnalyticsService', ['$resource',
  function ($resource) {
    return $resource('api/user-count/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('analytics').factory('DialogUsageService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-usage/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
