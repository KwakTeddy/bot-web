(function () {
  'use strict';

  angular
    .module('campaigns')
    .controller('CampaignUsersController', CampaignUsersController);

  CampaignUsersController.$inject = ['campaignResolve', 'campaignUsersResolve'];

  function CampaignUsersController(campaign, campaignUsers) {
    var vm = this;

    vm.campaign = campaign;
    vm.campaignUsers = campaignUsers;
  }
})();
