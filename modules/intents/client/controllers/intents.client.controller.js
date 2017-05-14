(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('intents')
    .controller('IntentsController', IntentsController);

  IntentsController.$inject = ['$scope', '$state', 'Authentication', 'intentResolve', '$resource', 'IntentsService', '$rootScope', '$http'];

  function IntentsController($scope, $state, Authentication, intent, $resource, IntentsService, $rootScope, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.intent = intent;
    $scope.intent = vm.intent;
    vm.intentContent = '';
    vm.error = null;
    vm.contentError = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.intent._id){
      angular.element('#intentFormName').focus();
    }else {
      angular.element('#intentContentForm').focus();
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('\'' + vm.intent.name + '\' ' + '정말 삭제하시겠습니까?')) {
        vm.intent.$remove({botName: $rootScope.botId}, function (response) {
          $state.go('intents.list')
        });
      }
    }
    
    $scope.$watch('intent.content', function (newVal, oldVal) {
      if(vm.intent._id){
        if(newVal && (newVal.length == oldVal.length)){
          for(var i = 0; i < newVal.length; i++){
            if(newVal[i].name !== oldVal[i].name){
              $http.post('/api/intentsContent/'+ newVal[i].intentId, newVal[i]).then(function (result) {
              }, function (err) {
                console.log(err)
              })
            }
          }
        }

      }
    }, true);

    $scope.$watch('intent', function (newVal, oldVal) {
      if (vm.intent._id){
        if (newVal.name !== oldVal.name){
          $http.put('/api/intents/'+ $rootScope.botId + '/' + newVal._id, newVal).then(function (result) {

          }, function (err) {
            console.log(err)
          })
        }
      }
    }, true);

    // Save Custom action
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        return false;
      }
      if (!vm.intent.content){
        vm.contentListError = '적어도 하나의 내용을 목록에 추가해주세요';
        return false
      }

      vm.intent.botName = $rootScope.botId;

      console.log(vm.intent);

      if (vm.intent._id) {
        vm.intent.$update(successCallback, errorCallback);
      } else {
        vm.intent.$save({botName: $rootScope.botId},successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        $state.go('intents.list')
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
        if (res.data.message.code == 11000){
          vm.error = '\'' + res.data.message.op.name + '\'' +' 이름의 인텐트가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    vm.contentSave = function(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.intentForm');
        return false;
      }
      if (vm.intent._id){
        if (vm.intentContent){
          $resource('/api/intentsContent').save({content: vm.intentContent, intentId: vm.intent._id, botId: $rootScope.botId}, function (result) {
            vm.intent.content.unshift(result);
            vm.intentContent = '';
            vm.contentError = '';
          }, function (err) {
            console.log(err);
            vm.contentError = err.data.message
          })
        }else {
          vm.contentError = '내용을 입력해주세요'
        }

      }else {
        if(!vm.intent.content){
          vm.intent['content'] = [];
        }
        if (vm.intentContent){
          for(var i = 0; i < vm.intent.content.length; i++){
            if (vm.intent.content[i].name == vm.intentContent){
              vm.contentError = '동일한 내용이 존재합니다';
              return false
            }
          }
          vm.intent.content.unshift({name: vm.intentContent});
          vm.intentContent = '';
          vm.contentError = ''
        }else {
          vm.contentError = '내용을 입력해주세요'
        }
      }
    };
    
    vm.contentRemove = function (target) {
      $resource('/api/intentsContent').delete({contentId: target._id}, function (result) {
        if (result.ok){
          IntentsService.get({
            botName: $rootScope.botId,
            intentId: vm.intent._id
          }).$promise.then(function (data) {
            vm.intent = data;
          })
        }else {
        }
      });
    };
    
    vm.contentRemoveBeforeSave = function (target) {
      console.log(vm.intent.content.indexOf(target))
      var index = vm.intent.content.indexOf(target);
      if(index > -1){
        vm.intent.content.splice(index, 1)
      }
    }
  }
})();
