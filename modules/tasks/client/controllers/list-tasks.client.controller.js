(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['tasksResolve', 'openTasksResolve', 'TasksService', 'OpenTasksService', '$stateParams', '$state'];

  function TasksListController(tasksResolve, openTasksResolve, TasksService, OpenTasksService, $stateParams, $state) {
    var vm = this;
    vm.type = $stateParams.listType;
    vm.tasks = Object.keys(tasksResolve[0]).map(function (key) {return tasksResolve[0][key]; });
    vm.openTasks = openTasksResolve;
    for(var i = 0; i < vm.tasks.length; i++){
      for(var j = 0; j < vm.openTasks.length; j++){
        if (vm.tasks[i].name == vm.openTasks[j].name){
          vm.tasks[i].save = true;
          if(vm.openTasks[j].open){
            vm.tasks[i].open = true;
          }
        }
      }
    }
    console.log(vm.tasks);
    console.log(vm.openTasks);

    vm.closeTask = function (target) {
      console.log(target);
      TasksService.update({task: target}, function (response) {
        console.log(response);
        target.open = response.open;
        OpenTasksService.query().$promise.then(function (result) {
          vm.openTasks = result;
        });
        console.log(vm.openTasks);
      }, function (err) {
        console.log(err);
      })
    };

    vm.openTaskFn = function (target) {
      console.log(target);
      if (target.save){
        TasksService.update({task: target}, function (response) {
          console.log(response);
          target.open = response.open;
          OpenTasksService.query().$promise.then(function (result) {
            vm.openTasks = result;
            $state.go('tasks.list', {listType: 'openTask'})
          });
        }, function (err) {
          console.log(err);
        })
      }else {
        $state.go('tasks.create', {taskId: target.name, listType: 'openTask'})
      }

    };

    vm.changeType = function (type) {
      vm.type = type
    }
  }
})();
