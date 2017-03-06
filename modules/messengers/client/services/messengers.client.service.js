'use strict';

//Messengers service used for communicating with the messengers REST endpoints
angular.module('messengers').factory('Messengers', ['$resource',
  function ($resource) {
    return $resource('api/messengers/:messengerId', {
      messengerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
