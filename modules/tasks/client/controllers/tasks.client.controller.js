(function () {
  'use strict';

  // Custom actions controller
  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', '$state', 'Authentication', '$resource', 'TasksService', '$stateParams','openTaskResolve', 'taskResolve'];

  function TasksController($scope, $state, Authentication, $resource, TasksService, $stateParams, openTaskResolve, taskResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.task = taskResolve;
    vm.task.json = JSON.stringify(taskResolve, undefined, 4);
    vm.openTask = openTaskResolve;
    vm.listType = $stateParams.listType;
    console.log(vm.task);
    console.log(vm.openTask);
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if ($state.current.name == "tasks.edit"){
      vm.task = vm.openTask;
    }

    // Remove existing Custom action
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.task.$remove(function (response) {
          $state.go('tasks.list')
        });
        // vm.task.$remove($state.go('tasks.list'), {}, {reload: true});
      }
    }

    // Save Custom action
    function save(isValid) {
      console.log(isValid);
      if (!isValid) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.task._id) {
        vm.task.$update(successCallback, errorCallback);
      } else {
        vm.task.$save({content: vm.taskContent},successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.error = null;
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        $state.go('tasks.list', {
          taskId: res._id
        }, {reload: true});
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        if (res.data.message.code == 11000){
          vm.error = '\'' + res.data.message.op.name + '\'' +' 이름의 테스크가 존재합니다. 다른 이름으로 생성해주세요'
        }
      }
    }

    vm.contentSave = function(isValid){
      console.log(isValid);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }
      console.log(vm.task._id);
      $resource('/api/tasksContent').save({content: vm.taskContent, taskId: vm.task._id}, function (result) {
        console.log(result);
        vm.task.content.unshift(result);
        vm.taskContent = '';
        // console.log(document.getElementById('contentForm').classList.value)
        // document.getElementById('contentForm').classList;
        vm.contentError = '';
      }, function (err) {
        console.log(err);
        vm.contentError = err.data.message
      })
    };
    
    vm.contentRemove = function (target) {
      if (confirm('Are you sure you want to delete?')) {
        console.log(vm.task);
        // vm.task.content[target._id].$remove();
        console.log(vm.taskContent);
        console.log(target);
        $resource('/api/tasksContent').delete({contentId: target._id}, function (result) {
          if (result.ok){
            TasksService.get({
              taskId: vm.task._id
            }).$promise.then(function (data) {
              vm.task = data;
            })

          }
        });
        // vm.task.$remove($state.go('tasks.list'), {}, {reload: true});
      }
    };

    function ConvertToCSV(objArray) {

      var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
      array = [objArray];
      JSON.stringify(array);

      console.log(array);

      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
        }

        str += line + '\r\n';
      }

      return str;
    }

    vm.openTaskFn = function () {
      TasksService.save({task: vm.task}, function (response) {
        $state.go('tasks.list', {listType: 'openTask'})
      }, function (err) {
        console.log(err);
      })
    };


  }
})();
