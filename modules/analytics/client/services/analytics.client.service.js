'use strict';

angular.module('analytics').factory('AnalyticsService', ['$resource',
  function ($resource) {
    return $resource('api/user-count/:bId/:kind/:arg', {
      bId: 'bId',
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogUsageService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-usage/:bId/:kind/:arg', {
      bId: 'bId',
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('SessionSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/session-success/:bId/:kind/:arg', {
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogSuccessService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-success/:bId/:kind/:arg', {
      bId: 'bId',
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('DialogFailureService', ['$resource',
  function ($resource) {
    return $resource('api/dialog-failure/:bId/:kind/:arg', {
      bId: 'bId',
      kind: 'kind',
      arg: 'arg'
    }, {});
  }
]);

angular.module('analytics').factory('Dialogs', ['$resource',
  function ($resource) {
    return $resource('api/dialog/:botId/:dialogId', {
      botId: '@botId',
      dialogId: '@dialogId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('analytics').factory('DialogSaveService', ['$resource',
  function ($resource) {
    return $resource('api/saveDialog/:botId/:fileName', {
      botId: 'botId',
      fileName: 'fileName'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
angular.module('analytics').factory('DialogChildren', ['$resource',
  function ($resource) {
    return $resource('api/dialogchildren/:botId/:dialogId', {
      botId: '@botId',
      dialogId: '@dialogId'
    }, {});
  }
]);
angular.module('analytics').factory('DialogFailureMaintenanceService', ['$resource',
  function ($resource) {
    return $resource('/api/dialog-failure-maintenance/:botId/:intentId', {
      botId: '@botId',
      intentId: '@intentId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
//
// angular.module('analytics').factory('IntentsService', ['$resource',
//   function ($resource) {
//     return $resource('api/intents/:botName/:intentId', {
//       intentId: '@_id',
//       botName: '@botName'
//     }, {
//       update: {
//         method: 'PUT'
//       }
//     });
//   }
// ]);
