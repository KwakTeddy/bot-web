(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['tasksResolve', 'openTasksResolve', 'TasksService', 'OpenTasksService', '$stateParams', '$state','DTOptionsBuilder', '$compile', '$scope'];

  function TasksListController(tasksResolve, openTasksResolve, TasksService, OpenTasksService, $stateParams, $state, DTOptionsBuilder, $compile, $scope) {
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

    var abc = "\"tasks.create({listType: 'all', taskId: 'new'})\"";

    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $("div.toolbar").html('<button id="addToTable" class="btn btn-primary" ui-sref= '+abc+'><i class="fa fa-plus"></i> 신규등록</button>');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })

    vm.dtOptions2 = DTOptionsBuilder.newOptions()
        .withOption('bLengthChange', false)
        .withOption('info', false)
        .withOption('dom', 'l<"toolbar">frtip')
        .withOption('initComplete', function(settings, json) {
          $('#dt_filter > label > input[type="search"]').addClass('form-control').attr('placeholder', 'Search');
          $compile(angular.element(document.querySelector('div.toolbar')).contents())($scope);
        })
  }
})();
