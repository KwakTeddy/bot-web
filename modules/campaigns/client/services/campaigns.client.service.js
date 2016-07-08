'use strict';

//Campaigns service used for communicating with the campaigns REST endpoints
angular.module('campaigns').factory('Campaigns', ['$resource',
  function ($resource) {
    return $resource('api/campaigns/:campaignId', {
      campaignId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
