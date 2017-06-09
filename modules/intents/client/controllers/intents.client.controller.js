(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('intents')
    .controller('IntentsController', IntentsController);

  IntentsController.$inject = ['$scope', '$state', 'Authentication', 'intentResolve', '$resource', 'IntentsService', '$rootScope', '$http', '$cookies', '$timeout'];

  function IntentsController($scope, $state, Authentication, intent, $resource, IntentsService, $rootScope, $http, $cookies, $timeout) {
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
    vm.entities = [];
    vm.background = {'가전제품' : 'rgb(210, 195, 234)', '사람' : '#fffda6'}

    if (!vm.intent._id){
      angular.element('#intentFormName').focus();
    }else {
      angular.element('#intentContentForm').focus();
    }
    if(vm.intent.content && vm.intent.content.length){
      vm.count = vm.intent.content.length;
    }

    vm.analyzeIntent = function () {
      if(vm.count){
        $resource('/api/user-bots-analytics/intent', {}).get({input: vm.intent.content[vm.count-1].input, botId: $cookies.get('default_bot')}, function (res) {
          if (!Object.keys(res.entities).length){
            vm.entities = undefined;
          }else {
            vm.entities = res.entities;
            var processedInput = vm.intent.content[vm.count-1].input.split(' ');
            for(var i = 0; i < processedInput.length; i++){
              for(var j = 0; j < Object.keys(vm.entities).length; j++){
                if(processedInput[i] == Object.values(vm.entities)[j]){
                  document.getElementById('content_' + (vm.count-1)).innerHTML = document.getElementById('content_' + (vm.count-1)).innerHTML.replace(Object.values(vm.entities)[j], '<span style="background-color: ' + vm.background[Object.keys(vm.entities)[j]] + '">' + Object.values(vm.entities)[j] + '</span>')
                }
              }
            }
          }

          vm.count--;
          vm.analyzeIntent();
        }, function (err) {
          console.log(err)
        })
      }
    };
    vm.analyzeIntent();


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
              var num = angular.copy(i);
              $http.post('/api/intentsContent/'+ newVal[i].intentId, newVal[i]).then(function (result) {
                vm.contentListError = null;
                newVal[num].input = result.data.input;
                console.log(result)
              }, function (err) {
                console.log(err);
                vm.contentListError = err.data.message;
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
            vm.error = null;
          }, function (err) {
            vm.error = err.data.message;
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
            vm.count = vm.intent.content.length;
            vm.analyzeIntent();
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
            vm.count = vm.intent.content.length;
            vm.analyzeIntent();
          })
        }else {
        }
      });
    };
    
    vm.contentRemoveBeforeSave = function (target) {
      var index = vm.intent.content.indexOf(target);
      if(index > -1){
        vm.intent.content.splice(index, 1)
      }
    };



    vm.selectContent = function (index) {
      vm.selectedContent = index
      $timeout(function () {
        angular.element('#input_' + index).focus()
      });
    };

    vm.contentBlur = function (index, content) {
      vm.selectedContent = null;
      console.log(index);
      $timeout(function () {
        console.log(vm.intent.content[index]);
        $resource('/api/user-bots-analytics/intent', {}).get({input: vm.intent.content[index].input, botId: $cookies.get('default_bot')}, function (res) {
          console.log(res)
          if (!Object.keys(res.entities).length){
            vm.entities = undefined;
          }else {
            vm.entities = res.entities;
            var processedInput = vm.intent.content[index].input.split(' ');
            console.log(processedInput)
            for(var i = 0; i < processedInput.length; i++){
              for(var j = 0; j < Object.keys(vm.entities).length; j++){
                if(processedInput[i] == Object.values(vm.entities)[j]){
                  document.getElementById('content_' + index).innerHTML = document.getElementById('content_' + index).innerHTML.replace(Object.values(vm.entities)[j], '<span style="background-color: ' + vm.background[Object.keys(vm.entities)[j]] + '">' + Object.values(vm.entities)[j] + '</span>')
                }
              }
            }
          }
        }, function (err) {
          console.log(err)
        })
      }, 100)


    }

  }
})();
