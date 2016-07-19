(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$scope', '$state', 'Authentication', 'campaignResolve', 'botUsersResolve', 'FileUploader', 'CampaignUsersService'];

  function CampaignsController($scope, $state, Authentication, campaign, botUsers, FileUploader, CampaignUsersService) {
    var vm = this;

    vm.categories = [
      '설문', '이벤트'
    ];
    vm.botUsers = botUsers;

    vm.authentication = Authentication;
    vm.campaign = campaign;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.uploader = new FileUploader();
    vm.uploader.onAfterAddingFile = function(fileItem) {
      vm.image = fileItem.file.name;
    };

    if(!vm.campaign.category) {
      vm.campaign.category = vm.categories[0];
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.campaign.$remove($state.go('campaigns.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campaignForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.campaign._id) {
        vm.campaign.$update(successCallback, errorCallback);
      } else {
        vm.campaign.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log('success');
        createCampaignUser(vm.campaignUsers, 0, function () {
          $state.go('campaigns.list', {
            campaignId: res._id
          }, {reload: true});
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function createCampaignUser(botUsers, index, callback) {
      console.log('create: ' + index);
      if(!botUsers || index < 0 || index >= botUsers.length) {
        callback();
        return;
      }
      var campaignUser = new CampaignUsersService({campaignId: vm.campaign._id});
      campaignUser.botUser = botUsers[index]._id;
      campaignUser.campaign = vm.campaign._id;
      campaignUser.$save(function (res) {
        createCampaignUser(botUsers, index+1, callback);
      }, function (res) {
        createCampaignUser(botUsers, index+1, callback);
      });
    }
  }

})();
