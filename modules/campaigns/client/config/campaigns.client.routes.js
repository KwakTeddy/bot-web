'use strict';

// Setting up route
angular.module('campaigns').config(['$stateProvider',
  function ($stateProvider) {
    // Campaigns state routing
    $stateProvider
      .state('campaigns', {
        abstract: true,
        url: '/campaigns',
        template: '<ui-view/>'
      })
      .state('campaigns.list', {
        url: '',
        templateUrl: 'modules/campaigns/client/views/list-campaigns.client.view.html'
      })
      .state('campaigns.create', {
        url: '/create',
        templateUrl: 'modules/campaigns/client/views/create-campaign.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('campaigns.view', {
        url: '/:campaignId',
        templateUrl: 'modules/campaigns/client/views/view-campaign.client.view.html'
      })
      .state('campaigns.edit', {
        url: '/:campaignId/edit',
        templateUrl: 'modules/campaigns/client/views/edit-campaign.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
