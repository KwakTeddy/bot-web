(function () {
  'use strict';

  angular
    .module('campaigns')
    .controller('CampaignsListController', CampaignsListController);

  CampaignsListController.$inject = ['campaignsResolve'];

  function CampaignsListController(campaigns) {
    var vm = this;

    vm.campaigns = campaigns;
  }
})();
