(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('intents')
    .controller('IntentsController', IntentsController);

  IntentsController.$inject = ['$scope', '$state', 'Authentication', 'intentResolve', '$resource', 'IntentsService', '$rootScope'];

  function IntentsController($scope, $state, Authentication, intent, $resource, IntentsService, $rootScope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.intent = intent;
    vm.intentContent = '';
    vm.error = null;
    vm.contentError = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.intent.$remove(function (response) {
          $state.go('intents.list')
        });
        // vm.intent.$remove($state.go('intents.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        return false;
      }
      vm.intent.botId = $rootScope.botId;
      // TODO: move create/update logic to service
      if (vm.intent._id) {
        vm.intent.$update(successCallback, errorCallback);
      } else {
        vm.intent.$save({content: vm.intentContent},successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        $state.go('intents.edit', {
          intentId: res._id
        }, {reload: true});


      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (res.data.message.code == 11000){
          vm.error = '\'' + res.data.message.op.name + '\'' +' 이름의 인텐트가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    vm.contentSave = function(isValid){
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        return false;
      }
      console.log(vm.intent._id);
      if (vm.intent._id){
        $resource('/api/intentsContent').save({content: vm.intentContent, intentId: vm.intent._id, botId: $rootScope.botId}, function (result) {
          console.log(result);
          vm.intent.content.unshift(result);
          vm.intentContent = '';
          // console.log(document.getElementById('contentForm').classList.value)
          // document.getElementById('contentForm').classList;
          vm.contentError = '';
        }, function (err) {
          console.log(err);
          vm.contentError = err.data.message
        })
      }else {
        if(!vm.intent.content){
          vm.intent['content'] = [];
        }
        vm.intent.content.unshift({name: vm.intentContent});
        vm.intentContent = ''

      }
    };
    
    vm.contentRemove = function (target) {
      if (confirm('Are you sure you want to delete?')) {
        console.log(vm.intent);
        // vm.intent.content[target._id].$remove();
        console.log(vm.intentContent);
        console.log(target);
        $resource('/api/intentsContent').delete({contentId: target._id}, function (result) {
          if (result.ok){
            IntentsService.get({
              intentId: vm.intent._id
            }).$promise.then(function (data) {
              vm.intent = data;
            })

          }
        });
        // vm.intent.$remove($state.go('intents.list'), {}, {reload: true});
      }
    }
  }
})();
