(function () {
  'use strict';

  angular
    .module('campaigns')
    .controller('CampaignUsersController', CampaignUsersController);

  CampaignUsersController.$inject = ['campaignUsersResolve'];

  function CampaignUsersController(campaignUsers) {
    var vm = this;

    vm.campaignUsers = campaignUsers;
  }
})();
