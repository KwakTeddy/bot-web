(function () {
  'use strict';

  angular
    .module('campaigns')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('campaigns', {
        abstract: true,
        url: '/campaigns',
        template: '<ui-view/>'
      })
      .state('campaigns.list', {
        url: '',
        templateUrl: 'modules/campaigns/client/views/list-campaigns.client.view.html',
        controller: 'CampaignsListController',
        controllerAs: 'vm',
        resolve: {
          campaignsResolve: getCampaigns
        },
        data: {
          pageTitle: 'Custom actions List'
        }
      })
      .state('campaigns.create', {
        url: '/create',
        templateUrl: 'modules/campaigns/client/views/form-campaign.client.view.html',
        controller: 'CampaignsController',
        controllerAs: 'vm',
        resolve: {
          campaignResolve: newCampaign,
          botUsersResolve: getBotUsers
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle : 'Custom actions Create'
        }
      })
      .state('campaigns.edit', {
        url: '/:campaignId/edit',
        templateUrl: 'modules/campaigns/client/views/form-campaign.client.view.html',
        controller: 'CampaignsController',
        controllerAs: 'vm',
        resolve: {
          campaignResolve: getCampaign,
          botUsersResolve: getBotUsers
        },
        data: {
          // roles: ['user', 'admin'],
          pageTitle: 'Edit Custom action {{ campaignResolve.name }}'
        }
      })
      .state('campaigns.view', {
        url: '/:campaignId/view',
        templateUrl: 'modules/campaigns/client/views/view-campaign.client.view.html',
        controller: 'CampaignsController',
        controllerAs: 'vm',
        resolve: {
          campaignResolve: getCampaign,
          botUsersResolve: getBotUsers
        },
        data:{
          pageTitle: 'Custom action {{ articleResolve.name }}'
        }
      })
      .state('campaigns.users', {
        url: '/:campaignId/users',
        templateUrl: 'modules/campaigns/client/views/users-campaign.client.view.html',
        controller: 'CampaignUsersController',
        controllerAs: 'vm',
        resolve: {
          campaignResolve: getCampaign,
          campaignUsersResolve: getCampaignUsers
        }
      });
  }

  getCampaigns.$inject = ['CampaignsService'];
  function getCampaigns(CampaignsService) {
    return CampaignsService.query().$promise;
  }

  getCampaign.$inject = ['$stateParams', 'CampaignsService'];
  function getCampaign($stateParams, CampaignsService) {
    return CampaignsService.get({
      campaignId: $stateParams.campaignId
    }).$promise;
  }

  newCampaign.$inject = ['CampaignsService'];
  function newCampaign(CampaignsService) {
    return new CampaignsService();
  }

  getCampaignUsers.$inject = ['$stateParams', 'CampaignUsersService'];
  function getCampaignUsers($stateParams, CampaignUsersService) {
    return CampaignUsersService.query({
      campaignId: $stateParams.campaignId
    }).$promise;
  }
  getBotUsers.$inject = ['BotUsersService'];
  function getBotUsers(BotUsersService) {
    return BotUsersService.query().$promise;
  }
})();
