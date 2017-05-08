(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('entitys')
    .controller('EntitysController', EntitysController);

  EntitysController.$inject = ['$scope', '$state', 'Authentication', 'entityResolve', '$resource', 'EntitysService', '$rootScope'];

  function EntitysController($scope, $state, Authentication, entity, $resource, EntitysService, $rootScope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.entity = entity;
    vm.entityContent = '';
    vm.error = null;
    vm.contentError = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Custom action
    function remove() {
      if (confirm('\'' + vm.entity.name + '\' ' + '정말 삭제하시겠습니까?')) {
        vm.entity.$remove({botName: $rootScope.botId}, function (response) {
          $state.go('entitys.list')
        });
        // vm.entity.$remove($state.go('entitys.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
        return false;
      }
      vm.entity.botName = $rootScope.botId;
      vm.entity.content = vm.entityContent;
      // TODO: move create/update logic to service
      if (vm.entity._id) {
        vm.entity.$update(successCallback, errorCallback);
      } else {
        vm.entity.$save({botName: $rootScope.botId},successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
        $state.go('entitys.edit', {
          entityId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (res.data.message.code == 11000){
          vm.error = '\'' + res.data.message.op.name + '\'' +' 이름의 엔터티가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    vm.contentSave = function(isValid){
      console.log($rootScope);
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
        return false;
      }
      console.log(vm.entity._id);
      $resource('/api/entitysContent').save({content: vm.entityContent, entityId: vm.entity._id, botId: $rootScope.botId}, function (result) {
        console.log(result);
        vm.entity.content.unshift(result);
        vm.entityContent = '';
        // console.log(document.getElementById('contentForm').classList.value)
        // document.getElementById('contentForm').classList;
        vm.contentError = '';
      }, function (err) {
        console.log(err);
        vm.contentError = err.data.message
      })
    };
    
    vm.contentRemove = function (target) {
      console.log(vm.entity);
      // vm.entity.content[target._id].$remove();
      console.log(vm.entityContent);
      console.log(target);
      $resource('/api/entitysContent').delete({contentId: target._id}, function (result) {
        if (result.ok){
          EntitysService.get({
            botName: $rootScope.botId,
            entityId: vm.entity._id
          }).$promise.then(function (data) {
            vm.entity = data;
          })

        }
      });
      // vm.entity.$remove($state.go('entitys.list'), {}, {reload: true});
    }
  }
})();
