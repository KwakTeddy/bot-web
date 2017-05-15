(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('entitys')
    .controller('EntitysController', EntitysController);

  EntitysController.$inject = ['$scope', '$state', 'Authentication', 'entityResolve', '$resource', 'EntitysService', '$rootScope', '$http', '$timeout'];

  function EntitysController($scope, $state, Authentication, entity, $resource, EntitysService, $rootScope, $http, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.entity = entity;
    $scope.entity = vm.entity;
    vm.entityContent = '';
    vm.entityContentSyn = '';
    vm.error = null;
    vm.contentError = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.entity._id){
      angular.element('#entityFormName').focus();
    }else {
      angular.element('#entityContentForm').focus();
    }

    if (vm.entity._id){
      for(var i = 0; i < vm.entity.content.length; i++){
        if (!vm.entity.content[i].syn){
          vm.entity.content[i]['syn'] = [];
        }
      }
    }

    if(vm.entity._id) {
      $scope.$watch('entity.content', function (newVal, oldVal) {
        if (newVal && (newVal.length == oldVal.length)) {
          for (var i = 0; i < newVal.length; i++) {
            if (newVal[i].name !== oldVal[i].name) {
              return $http.post('/api/entitysContent/' + newVal[i].entityId, newVal[i]).then(function (result) {
              }, function (err) {
                console.log(err)
              })
            }else {
              if(newVal[i].syn && (newVal[i].syn.length !== oldVal[i].syn.length)){
                return $http.post('/api/entitysContent/' + newVal[i].entityId, newVal[i]).then(function (result) {
                }, function (err) {
                  console.log(err)
                })
              }else {
                if (newVal[i].syn){
                  for(var j = 0; j < newVal[i].syn.length; j++){
                    if(newVal[i].syn[j] !== oldVal[i].syn[j]){
                      return $http.post('/api/entitysContent/' + newVal[i].entityId, newVal[i]).then(function (result) {
                      }, function (err) {
                        console.log(err)
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }, true);
    }
    if (vm.entity._id) {
      $scope.$watch('entity', function (newVal, oldVal) {
        if (newVal.name !== oldVal.name) {
          $http.put('/api/entitys/' + $rootScope.botId + '/' + newVal._id, newVal).then(function (result) {

          }, function (err) {
            console.log(err)
          })
        }
      }, true);
    }

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
      console.log(vm.entity.content);
      if (!isValid || !vm.entity.content || !vm.entity.content.length){
        vm.error = null;
        if (!vm.entity.content || !vm.entity.content.length){
          return vm.contentListError = '적어도 하나의 내용을 추가해주세요';
        }else {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
          return false;
        }
      }
      vm.entity.botName = $rootScope.botId;
      console.log(vm.entity);
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
      if (!isValid || !vm.entityContent) {
        if (!vm.entityContent){
          return vm.contentError = '내용을 입력해주세요'
        }else {
          console.log('done')
          $scope.$broadcast('show-errors-check-validity', 'vm.form.entityForm');
          return false;
        }
      }
      if (vm.entity._id){
        console.log(vm.entity._id);

        $resource('/api/entitysContent').save({content: vm.entityContent, entityId: vm.entity._id, botId: $rootScope.botId}, function (result) {
          console.log(result);
          vm.entity.content.unshift(result);
          vm.entityContent = '';
          // console.log(document.getElementById('contentForm').classList.value)
          // document.getElementById('contentForm').classList;
          vm.contentError = '';
          vm.contentListError = null;
        }, function (err) {
          console.log(err);
          vm.contentError = err.data.message
        }) 
      }else {
        if(!vm.entity.content){
          vm.entity['content'] = [];
        }
        if (vm.entityContent){
          for(var i = 0; i < vm.entity.content.length; i++){
            if (vm.entity.content[i].name == vm.entityContent){
              vm.contentError = '동일한 내용이 존재합니다';
              return false
            }
          }
          vm.entity.content.unshift({name: vm.entityContent, syn: [vm.entityContent]});
          vm.entityContent = '';
          vm.contentError = '';
          vm.contentListError = null;
        }else {
          vm.contentError = '내용을 입력해주세요'
        }

      }
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
    };

    vm.contentRemoveBeforeSave = function (target) {
      var index = vm.entity.content.indexOf(target);
      if(index > -1){
        vm.entity.content.splice(index, 1)
      }
    };

    vm.contentSynSave = function (target) {
      if(vm.entityContentSyn){
        if(!target.syn){
          target['syn'] = [];
        }
        for(var i = 0; i < target.syn.length; i++){
          if (target.syn[i] == vm.entityContentSyn){
            var border = angular.copy(document.getElementById('synWrapper_' + target.name + '_' + vm.entityContentSyn).style.border);
            var syn = angular.copy(vm.entityContentSyn);
            document.getElementById('synWrapper_' + target.name + '_' + syn).style.border = 'pink solid 1px';
            $timeout(function () {
              document.getElementById('synWrapper_' + target.name + '_' + syn).style.border = border;
            }, 3000);
            return
          }
        }
        target.syn.push(vm.entityContentSyn);
        vm.entityContentSyn = '';
      }
    };

    vm.contentSynRemoveBeforeSave = function (content, syn) {
      var index = content.syn.indexOf(syn);
      content.syn.splice(index, 1);
    };

    vm.synInputKeyDown = function (event, target) {
      if (event.keyCode == 13){ //enter
        vm.contentSynSave(target);
        event.preventDefault();
      }
    }

  }
})();
