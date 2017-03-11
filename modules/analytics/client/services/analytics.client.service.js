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

angular.module('analytics').factory('SessionSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/session-success/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('analytics').factory('DialogSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-success/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('analytics').factory('DialogFailureService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-failure/:botUserId', {
      botUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
