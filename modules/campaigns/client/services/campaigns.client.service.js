//Custom actions service used to communicate Custom actions REST endpoints
(function () {
  'use strict';

  angular
    .module('campaigns')
    .factory('CampaignsService', CampaignsService)
    .factory('CampaignUsersService', CampaignUsersService);

  CampaignsService.$inject = ['$resource'];
  function CampaignsService($resource) {
    return $resource('api/campaigns/:campaignId', {
      campaignId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  CampaignUsersService.$inject = ['$resource'];
  function CampaignUsersService($resource) {
    return $resource('api/campaign-users/:campaignId/:campaignUserId', {
      campaignId: '@campaignId',
      campaignUserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
