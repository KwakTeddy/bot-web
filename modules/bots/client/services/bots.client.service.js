'use strict';

//Bots service used for communicating with the bots REST endpoints
angular.module('bots').factory('Bots', ['$resource',
  function ($resource) {
    return $resource('api/bots/:botId', {
      botId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
